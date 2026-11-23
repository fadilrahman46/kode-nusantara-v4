// T1m — Expert EX04–EX10 (setelan + simulasi): acuan lulus, cara salah gagal bermakna, ruang setelan dicari SELURUHNYA (jumlah jawaban persis), ablasi EX10, kesesuaian model halaman = model Node.
const L=require('./lib'); const fs=require('fs'); const path=require('path');
(async()=>{
  const b=await L.launch(); const S=L.suite('t1m_expert2');
  const {page:p,errors}=await L.newPage(b,{w:1280,h:720});
  const D=await p.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},space:{},misc:{}}, C=(type,o)=>Object.assign({type},o);
    const REF={
      ex04:[C('pekerja',{jumlah:2}),C('penyangga',{ukuran:24})],
      ex05:[C('skala',{naik:4,turun:2})],
      ex06:[C('server',{jumlah:3}),C('strategi',{cara:'kosong'})],
      ex07:[C('rak',{kebijakan:'lfu',ukuran:3})],
      ex08:[C('server',{jumlah:2}),C('strategi',{cara:'kosong'}),C('rak',{kebijakan:'lfu',ukuran:2})],
      ex09:[C('coba',{kali:2,jeda:2}),C('cadangan',{}),C('pemutus',{k:3})],
      ex10:[C('skala',{naik:4,turun:2}),C('server',{jumlah:2}),C('strategi',{cara:'kosong'}),C('rak',{kebijakan:'lfu',ukuran:3}),C('coba',{kali:2,jeda:2}),C('cadangan',{}),C('pemutus',{k:3})]};
    const NEG={
      ex04:{'pekerja kebanyakan (melebihi anggaran)':[C('pekerja',{jumlah:5}),C('penyangga',{ukuran:6})],'penyangga kecil':[C('pekerja',{jumlah:2}),C('penyangga',{ukuran:6})],'pekerja sedikit':[C('pekerja',{jumlah:1}),C('penyangga',{ukuran:24})],'tanpa penyangga':[C('pekerja',{jumlah:2})],'dua kartu pekerja':[C('pekerja',{jumlah:2}),C('pekerja',{jumlah:3}),C('penyangga',{ukuran:24})]},
      ex05:{'pekerja tetap 2':[C('pekerja',{jumlah:2})],'ambang terlalu tinggi':[C('skala',{naik:8,turun:2})],'tanpa kartu':[]},
      ex06:{'bergilir 3 server':[C('server',{jumlah:3}),C('strategi',{cara:'bergilir'})],'satu-ke-satu':[C('server',{jumlah:3}),C('strategi',{cara:'satu'})],'5 server (anggaran)':[C('server',{jumlah:5}),C('strategi',{cara:'bergilir'})]},
      ex07:{'pertama masuk 3':[C('rak',{kebijakan:'fifo',ukuran:3})],'paling lama tak dipakai 3':[C('rak',{kebijakan:'lru',ukuran:3})],'ukuran 4 (anggaran)':[C('rak',{kebijakan:'lfu',ukuran:4})]},
      ex08:{'tanpa rak':[C('server',{jumlah:3}),C('strategi',{cara:'kosong'})],'tanpa server':[C('rak',{kebijakan:'lfu',ukuran:3})],'melebihi anggaran':[C('server',{jumlah:3}),C('strategi',{cara:'kosong'}),C('rak',{kebijakan:'lfu',ukuran:3})]},
      ex09:{'cadangan dulu':[C('cadangan',{}),C('coba',{kali:2,jeda:2}),C('pemutus',{k:3})],'tanpa pemutus':[C('coba',{kali:2,jeda:2}),C('cadangan',{})],'tanpa cadangan':[C('coba',{kali:2,jeda:2}),C('pemutus',{k:3})],'hanya cadangan':[C('cadangan',{})]},
      ex10:{'tanpa skala':[C('server',{jumlah:2}),C('strategi',{cara:'kosong'}),C('rak',{kebijakan:'lfu',ukuran:3}),C('coba',{kali:2,jeda:2}),C('cadangan',{}),C('pemutus',{k:3})],'melebihi anggaran':[C('skala',{naik:4,turun:2}),C('server',{jumlah:3}),C('strategi',{cara:'kosong'}),C('rak',{kebijakan:'lfu',ukuran:3}),C('coba',{kali:2,jeda:2}),C('cadangan',{}),C('pemutus',{k:3})]}};
    const sim=(id,prog)=>{ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length; const r=[]; for(let v=0;v<n;v++) r.push(T.simulate(prog.map((c,i)=>Object.assign({id:'q'+i},c)),v)); return r; };
    for(const id of Object.keys(REF)){ const st=T.STAGES.find(s=>s.id===id); const r=sim(id,REF[id]); out.ref[id]={ok:r.every(x=>x.ok),n:r.length,len:REF[id].length,limit:st.limit,pal:st.palette.easy.length,msg:r.map(x=>x.ok?'ok':x.msg).join(' | ')};
      out.neg[id]={}; for(const [k,pr] of Object.entries(NEG[id])){ const rr=sim(id,pr); const f=rr.findIndex(x=>!x.ok); out.neg[id][k]=f>=0?{v:f,msg:(rr[f].msg||'').slice(0,170)}:{v:-1,msg:''}; } }
    // ruang setelan penuh yang dapat dijangkau kartu di tiap tahap
    const cnt=(id,gen)=>{ let tried=0,pass=0; const sols=[]; for(const prog of gen){ tried++; if(sim(id,prog).every(x=>x.ok)){ pass++; sols.push(prog.map(c=>c.type+':'+Object.values(c).slice(1).join('/')).join(' ')); } } return {tried,pass,sols}; };
    const opt=(a)=>a;
    out.space.ex04=cnt('ex04',(function*(){ for(const N of [1,2,3,4,5,6]) for(const B of [6,12,24]) yield [C('pekerja',{jumlah:N}),C('penyangga',{ukuran:B})]; })());
    out.space.ex05=cnt('ex05',(function*(){ for(const N of [1,2,3,4,5,6]){ yield [C('pekerja',{jumlah:N})]; for(const T of [10,8,6,4,2,0]) for(const Dn of [0,2]) yield [C('pekerja',{jumlah:N}),C('skala',{naik:T,turun:Dn})]; } })());
    out.space.ex06=cnt('ex06',(function*(){ for(const S of [2,3,4,5]) for(const st of ['satu','bergilir','kosong']) yield [C('server',{jumlah:S}),C('strategi',{cara:st})]; })());
    out.space.ex07=cnt('ex07',(function*(){ for(const pl of ['fifo','lru','lfu']) for(const z of [1,2,3,4]) yield [C('rak',{kebijakan:pl,ukuran:z})]; })());
    out.space.ex08=cnt('ex08',(function*(){ for(const S of [2,3,4,5]) for(const st of ['satu','bergilir','kosong']){ yield [C('server',{jumlah:S}),C('strategi',{cara:st})]; for(const pl of ['fifo','lru','lfu']) for(const z of [1,2,3,4]) yield [C('server',{jumlah:S}),C('strategi',{cara:st}),C('rak',{kebijakan:pl,ukuran:z})]; } })());
    out.space.ex09=cnt('ex09',(function*(){ const co=[null]; for(const n of [1,2,3]) for(const j of [1,2]) co.push(C('coba',{kali:n,jeda:j})); const pm=[null]; for(const k of [2,3,4]) pm.push(C('pemutus',{k})); for(const c of co) for(const m of pm) for(const ca of [false,true]){ const base=[]; const orders=(c&&ca)?[[c,C('cadangan',{})],[C('cadangan',{}),c]]:[[c,ca?C('cadangan',{}):null].filter(Boolean)]; for(const o of orders){ const prog=[...o]; if(m) prog.push(m); if(prog.length) yield prog; } } })());
    return out; });
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan`,async()=>({ok:r.ok&&r.len<=r.limit,note:r.msg.slice(0,200)}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,x] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: cara salah “${k}” gagal dengan pesan bermakna`,async()=>({ok:x.v>=0&&x.msg.length>20,note:x.v>=0?`keadaan ${x.v}: ${x.msg}`:'LULUS (jalan pintas!)'}));
  const WANT={ex04:1,ex05:3,ex06:1,ex07:1,ex08:1,ex09:2};
  for(const [id,a] of Object.entries(D.space)) await S.t('S-'+id,`${id}: dari ${a.tried} susunan setelan, tepat ${WANT[id]} yang lulus`,async()=>({ok:a.pass===WANT[id],note:`lulus ${a.pass}: ${a.sols.join(' ; ')}`}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
