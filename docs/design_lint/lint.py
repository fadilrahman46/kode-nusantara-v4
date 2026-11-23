#!/usr/bin/env python3
"""Pemeriksa konsistensi desain kurikulum Kode Nusantara.
Memeriksa spesifikasi stage (JSON): urutan prasyarat, beban mekanik baru, pola kenalkan→latih→pelintir,
riddle, cakupan placement test, konsep wajib. Hanya memeriksa KONSISTENSI DESAIN, bukan apakah game seru/efektif."""
import json,sys
KLP={0:'L',1:'K'}
def load(p): return json.load(open(p,encoding='utf-8'))
def flatten(spec):
    out=[]; 
    for mode in spec['modes']:
        for mi in mode['missions']:
            for k,st in enumerate(mi['stages']):
                out.append(dict(st,mode=mode['id'],mission=mi['id'],first=(k==0),last_of_mission=(k==len(mi['stages'])-1)))
    return out
def lint(spec):
    E=[];W=[]; reg=spec['mechanics']; S=flatten(spec)
    at={}
    for i,s in enumerate(S):
        for m in s['introduces']: at.setdefault(m,i)
    def err(rule,msg): E.append(dict(rule=rule,msg=msg))
    # L1 prasyarat & pemakaian sebelum diperkenalkan
    for i,s in enumerate(S):
        for m in s['uses']:
            if m not in reg: err('L1',f"{s['id']}: mekanik tak dikenal '{m}'")
            elif m not in at: err('L1',f"{s['id']}: memakai '{m}' yang TIDAK diperkenalkan di stage mana pun")
            elif at[m]>=i: err('L1',f"{s['id']}: memakai '{m}' sebelum diperkenalkan ({S[at[m]]['id']})")
        for m in s['introduces']:
            for p in reg.get(m,{}).get('prereq',[]):
                if p not in at or at[p]>=i: err('L1',f"{s['id']}: memperkenalkan '{m}' padahal prasyarat '{p}' belum ada")
    # L2 maks 1 mekanik baru
    for s in S:
        if len(s['introduces'])>1: err('L2',f"{s['id']}: {len(s['introduces'])} mekanik baru sekaligus ({', '.join(s['introduces'])})")
    # L3 run K berturut-turut per mode
    stats={}
    for mode in spec['modes']:
        ss=[s for s in S if s['mode']==mode['id']]; run=best=0; bs=be=None; cur=None
        for s in ss:
            if len(s['introduces'])>=1:
                run+=1; cur=cur or s['id']
                if run>best: best=run; bs=cur; be=s['id']
            else: run=0; cur=None
        kc=sum(1 for s in ss if s['introduces']); 
        stats[mode['id']]=dict(stage=len(ss),K=kc,LP=len(ss)-kc,max_run_K=best,run=(f"{bs}–{be}" if best else '-'))
        if best>spec['rules']['max_run_K']: err('L3',f"{mode['id']}: {best} stage berturut-turut memperkenalkan mekanik baru ({bs}–{be}); batas {spec['rules']['max_run_K']}")
    # L4 tiap misi punya stage tanpa mekanik baru
    for mode in spec['modes']:
        for mi in mode['missions']:
            if not any(len(st['introduces'])==0 for st in mi['stages']): err('L4',f"{mi['id']} ({mi['name']}): semua stage memperkenalkan mekanik baru; tidak ada latihan/pelintir")
    # L5 K non-pertama harus memakai ulang mekanik dari misi yang sama
    for i,s in enumerate(S):
        if s['introduces'] and not s['first']:
            prev={m for t in S[:i] if t['mission']==s['mission'] for m in t['introduces']}
            if not (set(s['uses'])&prev): err('L5',f"{s['id']}: memperkenalkan mekanik baru tanpa memakai ulang mekanik apa pun dari misi yang sama")
    # L6 stage terakhir tiap mode = pelintir gabungan
    for mode in spec['modes']:
        last=[s for s in S if s['mode']==mode['id']][-1]
        if last['introduces'] or len(set(last['uses']))<4: err('L6',f"{mode['id']}: stage terakhir {last['id']} harus tanpa mekanik baru dan memakai ≥ 4 mekanik")
    # L7 riddle hanya memakai konsep yang sudah diajarkan
    for mode in spec['modes']:
        for mi in mode['missions']:
            r=mi.get('riddle'); 
            if not r: continue
            li=max(i for i,s in enumerate(S) if s['mission']==mi['id'])
            for m in r.get('konsep',[]):
                if m not in at or at[m]>li: err('L7',f"riddle {mi['id']} (\"{r['teks'][:48]}…\") memakai '{m}' yang belum diajarkan sampai akhir misi")
    # L11 label stage vs isi
    for s in S:
        if s.get('label') in ('Gabungan','Puzzle penutup','Latihan') and s['introduces']: err('L11',f"{s['id']}: berlabel '{s['label']}' tetapi memperkenalkan mekanik baru ({', '.join(s['introduces'])})")
    # L12 mekanik yatim
    for m,i in at.items():
        if not any(m in t['uses'] for t in S[i+1:]): err('L12',f"mekanik '{m}' ({S[i]['id']}) tidak dipakai di stage mana pun sesudahnya (dalam lingkup spesifikasi ini)")
    # L13 konsep wajib
    for name,ms in spec.get('required_concepts',{}).items():
        if not any(m in at for m in ms): err('L13',f"konsep wajib '{name}' tidak diajarkan oleh stage mana pun")
    # L14 bukti pemahaman (mode lanjut)
    for s in S:
        if s['mode'] in spec['rules'].get('bukti_modes',[]) and s['introduces'] and not s.get('bukti'): err('L14',f"{s['id']}: tidak ada 'bukti pemahaman' (apa yang tidak bisa dilakukan tanpa paham, bukan sekadar hafal istilah)")
    # L15 cakupan placement test (peringatan)
    for t in spec.get('tests',[]):
        gated=[m for s in S if s['mode'] in t['gates'] for m in s['introduces']]
        covered={m for q in t['questions'] for m in q['topik']}
        miss=[m for m in gated if m not in covered]
        if miss: W.append(dict(rule='L15',msg=f"{t['id']}: mekanik yang dilewati pemain tetapi tidak diuji: {', '.join(miss)}"))
        bad=[m for q in t['questions'] for m in q['topik'] if m not in gated]
        if bad: err('L15',f"{t['id']}: soal menguji mekanik di luar mode yang dilompati: {', '.join(sorted(set(bad)))}")
    return dict(errors=E,warnings=W,stats=stats)
if __name__=='__main__':
    spec=load(sys.argv[1]); r=lint(spec)
    print(f"== {spec['version']} ==")
    for m,s in r['stats'].items(): print(f"  {m}: {s['stage']} stage | mekanik-baru {s['K']} | latihan/pelintir {s['LP']} | run terpanjang {s['max_run_K']} ({s['run']})")
    for e in r['errors']: print(f"  GAGAL [{e['rule']}] {e['msg']}")
    for w in r['warnings']: print(f"  PERINGATAN [{w['rule']}] {w['msg']}")
    print(f"  -> {len(r['errors'])} pelanggaran, {len(r['warnings'])} peringatan")
    if len(sys.argv)>2: json.dump(r,open(sys.argv[2],'w',encoding='utf-8'),indent=1,ensure_ascii=False)
    sys.exit(1 if r['errors'] else 0)
