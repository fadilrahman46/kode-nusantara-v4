// T1f — Middle A misi 2–3 (MA04–MA10): acuan lulus di SEMUA keadaan; cara salah/jalan pintas gagal di sedikitnya satu keadaan dengan pesan; palet; kode semu.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1f_middleA2');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},misc:{}};
    const E={type:'akhir'},MS={type:'mesin'},UN={type:'untuk'},BK={type:'buka'},PK={type:'pakai',arg:null},KJ={type:'kunjungi'};
    const SEL=s=>({type:'selama',neg:false,s,op:null,neg2:false,s2:s}), U=n=>({type:'ulangi',n});
    const JC=(cmp,then,els)=>({type:'jika',sensor:'cari',cmp,then,else:els||null}), J=(sensor,then,els)=>({type:'jika',sensor,then,else:els||null});
    const TM={type:'tumpukMasuk'},TA={type:'tumpukAmbil'},AM={type:'antreMasuk'},AA={type:'antreAmbil'};
    const BIN=[SEL('belumKetemu'),BK,JC('=','ambilBerhenti'),JC('<','buangKiri','buangKanan'),E];
    const LIN=[UN,JC('=','ambilBerhenti'),E];
    const REF={
      ma04:LIN,
      ma05:BIN,
      ma06:[MS,UN,JC('=','ambilBerhenti'),E,E,J('acak','pakai'),...BIN],
      ma07:[UN,TM,E,SEL('tumpukanBerisi'),TA,E],
      ma08:[UN,AM,J('lonceng','antreAmbil'),E,SEL('antreanBerisi'),AA,E],
      ma09:[MS,KJ,J('anakKiri','pakaiKiri'),J('anakKanan','pakaiKanan'),E,PK],
      ma10:[MS,KJ,JC('=','ambilBerhenti'),JC('<','pakaiKanan','pakaiKiri'),E,PK]
    };
    const NEG={
      ma04:{'ambil tanpa berhenti':[UN,JC('=','ambilSaja'),E],'nomor rak tetap':[{type:'ambilRak',idx:3}]},
      ma05:{'satu per satu (cari linear)':LIN,'arah buang terbalik':[SEL('belumKetemu'),BK,JC('=','ambilBerhenti'),JC('<','buangKanan','buangKiri'),E],'tanpa memeriksa sama dengan':[SEL('belumKetemu'),BK,JC('<','buangKiri','buangKanan'),E]},
      ma06:{'buka tengah untuk semua rak':BIN,'satu per satu untuk semua rak':LIN},
      ma07:{'langsung ambil lagi (tanpa menumpuk dulu)':[UN,TM,TA,E],'Ulangi 3 kali':[UN,TM,E,U(3),TA,E]},
      ma08:{'pakai tumpukan':[UN,TM,J('lonceng','tumpukAmbil'),E,SEL('tumpukanBerisi'),TA,E],'tanpa melayani saat lonceng':[UN,AM,E,SEL('antreanBerisi'),AA,E]},
      ma09:{'kiri dulu, baru kunjungi (inorder)':[MS,J('anakKiri','pakaiKiri'),KJ,J('anakKanan','pakaiKanan'),E,PK],'tanpa memeriksa anak':[MS,KJ,J('anakKiri','pakaiKiri'),{type:'jika',sensor:'anakKiri',then:'pakaiKanan',else:null},E,PK],'kanan dulu':[MS,KJ,J('anakKanan','pakaiKanan'),J('anakKiri','pakaiKiri'),E,PK]},
      ma10:{'kunjungi semua map (pohon biasa)':[MS,KJ,JC('=','ambilBerhenti'),J('anakKiri','pakaiKiri'),J('anakKanan','pakaiKanan'),E,PK],'arah terbalik':[MS,KJ,JC('=','ambilBerhenti'),JC('<','pakaiKiri','pakaiKanan'),E,PK]}
    };
    const cnt=p=>p.filter(c=>c.type!=='akhir').length;
    for(const id of Object.keys(REF)){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      const per=[]; for(let v=0;v<n;v++){ const r=T.simulate(REF[id],v); per.push(r.ok?'ok':`v${v}: ${r.msg}`); }
      out.ref[id]={ok:per.every(x=>x==='ok'),msg:per.filter(x=>x!=='ok').join(' | '),len:cnt(REF[id]),limit:st.limit,n,
        pal:['easy','medium','hard'].every(d=>REF[id].filter(c=>c.type!=='akhir').every(c=>st.palette[d].includes(c.type)))};
      out.neg[id]={}; for(const [k,p] of Object.entries(NEG[id])){ let fail=null; for(let v=0;v<n&&!fail;v++){ const x=T.simulate(p,v); if(!x.ok) fail={v,msg:(x.msg||'').slice(0,140)}; } out.neg[id][k]=fail||{v:-1,msg:''}; } }
    { const st=T.STAGES.find(s=>s.id==='ma05'); T.setStage(st); T.loadStage(st); T.setProgram(BIN); out.misc.pseudo5=T.pseudo(); }
    { const st=T.STAGES.find(s=>s.id==='ma09'); T.setStage(st); T.loadStage(st); T.setProgram(REF.ma09); out.misc.pseudo9=T.pseudo(); }
    out.order=T.STAGES.map(s=>s.code.split(' ')[0]).join(' ');
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1f_data.json',JSON.stringify(D,null,2));
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan; kartunya ada di palet ketiga tingkat`,()=>({ok:r.ok&&r.len<=r.limit&&r.pal,note:r.msg||`kartu ${r.len}/${r.limit}`}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,x] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: cara salah “${k}” gagal di sedikitnya satu keadaan, dengan pesan`,()=>({ok:x.v>=0&&x.msg.length>0,note:x.v>=0?`keadaan ${x.v}: ${x.msg}`:'LOLOS DI SEMUA KEADAAN'}));
  await S.t('P1','Kode semu buka tengah: selama belum_ketemu() … buang_separuh_kiri()',()=>({ok:/selama belum_ketemu\(\):\n    buka_tengah\(\)\n    jika isi == dicari:\n        ambil\(isi\); berhenti\n    jika isi < dicari:\n        buang_separuh_kiri\(\)\n    selain_itu:\n        buang_separuh_kanan\(\)/.test(D.misc.pseudo5),note:JSON.stringify(D.misc.pseudo5)}));
  await S.t('P2','Kode semu pohon: fungsi mesin(map) … mesin(map.kiri) … mesin(akar)',()=>({ok:/fungsi mesin\(map\):\n    kunjungi\(map\)\n    jika map.kiri ada:\n        mesin\(map.kiri\)[\s\S]*\nmesin\(akar\)$/.test(D.misc.pseudo9),note:JSON.stringify(D.misc.pseudo9)}));
  await S.t('O1','Urutan menu: … MA03 lalu MA04 … MA10',()=>({ok:/MA03 MA04 MA05 MA06 MA07 MA08 MA09 MA10( |$)/.test(D.order),note:D.order.split(' ').slice(-8).join(' ')}));
  await S.t('E1','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
