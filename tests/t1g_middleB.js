// T1g — Middle B MB01–MB03 (cetakan, objek, atribut, method): acuan lulus di semua keadaan; cara pintas gagal dengan pesan; aturan kartu; kode semu.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1g_middleB');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},misc:{}}, E={type:'akhir'}, UN={type:'untuk'};
    const CT=n=>({type:'cetakan',nama:n||'Kucing'}), AT=v=>({type:'atribut',attr:'warna',val:v}), MT=n=>({type:'method',nama:n||'mengeong'}), BS={type:'bersuara',bunyi:'meong'};
    const BO=o=>({type:'buatObjek',obj:o,cet:'Kucing'}), UA=(o,v)=>({type:'ubahAtr',obj:o,attr:'warna',val:v}), SR=o=>({type:'suruh',obj:o,method:'mengeong'});
    const REF={
      mb01:[BO('Belang'),BO('Mochi'),BO('Kopi'),UA('Mochi','putih'),UA('Kopi','hitam')],
      mb02:[CT(),AT('oranye'),MT(),BS,E,E,BO('Belang'),SR('Belang')],
      mb03:[CT(),MT(),BS,E,E,UN,BO('cur'),SR('cur'),E]
    };
    const NEG={
      mb01:{'ubah sebelum dibuat':[UA('Mochi','putih'),BO('Belang'),BO('Mochi'),BO('Kopi'),UA('Kopi','hitam')],'lupa mengubah Kopi':[BO('Belang'),BO('Mochi'),BO('Kopi'),UA('Mochi','putih')],'nama objek dipakai dua kali':[BO('Belang'),BO('Belang')]},
      mb02:{'Bit bersuara sendiri':[CT(),AT('oranye'),E,BO('Belang'),BS],'tanpa atribut warna':[CT(),MT(),BS,E,E,BO('Belang'),SR('Belang')],'warna awal bawaan (putih)':[CT(),AT('putih'),MT(),BS,E,E,BO('Belang'),SR('Belang')],'suruh sebelum objek dibuat':[CT(),AT('oranye'),MT(),BS,E,E,SR('Belang'),BO('Belang')],'Bersuara langsung di dalam cetakan':[CT(),AT('oranye'),BS,E,BO('Belang')],'Method di luar cetakan':[MT(),BS,E,CT(),E,BO('Belang'),SR('Belang')],'tanpa cetakan':[BO('Belang'),SR('Belang')]},
      mb03:{'objek tetap untuk 3 nama':[CT(),MT(),BS,E,E,BO('Belang'),BO('Mochi'),BO('Kopi'),SR('Belang'),SR('Mochi'),SR('Kopi')],'mengeong dua kali':[CT(),MT(),BS,BS,E,E,UN,BO('cur'),SR('cur'),E],'isi rak sekarang di luar Untuk setiap':[CT(),MT(),BS,E,E,BO('cur')]}
    };
    const cnt=p=>p.filter(c=>c.type!=='akhir').length;
    for(const id of Object.keys(REF)){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      const per=[]; for(let v=0;v<n;v++){ const r=T.simulate(REF[id],v); per.push(r.ok?'ok':`v${v}: ${r.msg}`); }
      out.ref[id]={ok:per.every(x=>x==='ok'),msg:per.filter(x=>x!=='ok').join(' | '),len:cnt(REF[id]),limit:st.limit,n,pal:['easy','medium','hard'].every(d=>REF[id].filter(c=>c.type!=='akhir').every(c=>st.palette[d].includes(c.type)))};
      out.neg[id]={}; for(const [k,p] of Object.entries(NEG[id])){ let fail=null; for(let v=0;v<n&&!fail;v++){ const x=T.simulate(p,v); if(!x.ok) fail={v,msg:(x.msg||'').slice(0,150)}; } out.neg[id][k]=fail||{v:-1,msg:''}; out.neg[id][k].len=cnt(p); out.neg[id][k].limit=st.limit; } }
    { const st=T.STAGES.find(s=>s.id==='mb02'); T.setStage(st); T.loadStage(st); T.setProgram(REF.mb02); out.misc.pseudo=T.pseudo(); }
    { const st=T.STAGES.find(s=>s.id==='mb01'); T.setStage(st); const w=T.freshWorld(); for(const s of T.interpret(REF.mb01.slice(0,4),()=>w)) T.execStep(w,s); out.misc.copies=w.objek.map(o=>o.nama+':'+o.attrs.warna).join(','); }
    out.order=T.STAGES.map(s=>s.code.split(' ')[0]).join(' ');
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1g_data.json',JSON.stringify(D,null,2));
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan; kartunya ada di palet ketiga tingkat`,()=>({ok:r.ok&&r.len<=r.limit&&r.pal,note:r.msg||`kartu ${r.len}/${r.limit}`}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,x] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: cara salah “${k}” gagal (atau melebihi batas kartu)`,()=>({ok:(x.v>=0&&x.msg.length>0)||x.len>x.limit,note:x.v>=0?`keadaan ${x.v}: ${x.msg}`:(x.len>x.limit?`benar tetapi ${x.len} > ${x.limit} kartu`:'LOLOS')}));
  await S.t('C1','Objek punya salinan atribut sendiri: mengubah Mochi tidak mengubah Belang dan Kopi',()=>({ok:D.misc.copies==='Belang:oranye,Mochi:putih,Kopi:oranye',note:D.misc.copies}));
  await S.t('P1','Kode semu kelas: kelas Kucing / warna = "oranye" / fungsi mengeong(diri) / belang = Kucing() / belang.mengeong()',()=>({ok:/^kelas Kucing:\n    warna = "oranye"\n    fungsi mengeong\(diri\):\n        bersuara\("meong"\)\nbelang = Kucing\(\)\nbelang.mengeong\(\)$/.test(D.misc.pseudo),note:JSON.stringify(D.misc.pseudo)}));
  await S.t('O1','Urutan menu: … MA10 lalu MB01 MB02 MB03',()=>({ok:/MA10 MB01 MB02 MB03( |$)/.test(D.order),note:D.order.split(' ').slice(-4).join(' ')}));
  await S.t('E1','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
