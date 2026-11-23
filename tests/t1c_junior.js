// T1c — Junior J01–J06 (wadah bersarang): program acuan lulus di semua keadaan; program salah gagal;
// tanpa kartu wadah tidak ada program ≤ batas kartu yang lulus; penafsir bersarang, pengaman putaran tak berujung, normalisasi Selesai.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1c_junior');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},flat:{},misc:{}};
    const M={type:'maju'},R={type:'kanan'},Lf={type:'kiri'},A={type:'ambil'},E={type:'akhir'};
    const U=n=>({type:'ulangi',n}), W=(s,neg,op,s2,neg2)=>({type:'selama',s,neg:!!neg,op:op||null,s2:s2||s,neg2:!!neg2});
    const JK=(then,els)=>({type:'jika',sensor:'koin',then,else:els||null});
    const REF={
      j01:[U(8),M,E],
      j02:[U(3),M,R,M,Lf,E],
      j03:[U(4),U(3),M,E,R,E],
      j04:[W('jalan'),M,E],
      j05:[W('tembok',true,'dan','lubang',true),M,E],
      j06:[W('jalan'),JK('ambil'),M,E,JK('ambil')]
    };
    const ALT={ j05:{'De Morgan: TIDAK(tembok ATAU lubang) tidak tersedia; ATAU salah':null}, j06:{'jika-selain itu':[W('jalan'),JK('ambil','maju'),E,JK('ambil')]} };
    const NEG={
      j01:{'Ulangi 6':[U(6),M,E],'Maju di luar Ulangi':[U(8),E,M]},
      j02:{'Ulangi 2':[U(2),M,R,M,Lf,E],'urutan belok terbalik':[U(3),M,Lf,M,R,E]},
      j03:{'tanpa belok':[U(4),U(3),M,E,E],'hanya 3 sisi':[U(3),U(3),M,E,R,E]},
      j04:{'Ulangi 5 (hitungan tetap)':[U(5),M,E],'Selama ada tembok':[W('tembok'),M,E]},
      j05:{'hanya TIDAK tembok':[W('tembok',true),M,E],'hanya TIDAK lubang':[W('lubang',true),M,E],'ATAU, bukan DAN':[W('tembok',true,'atau','lubang',true),M,E]},
      j06:{'Ambil tanpa Jika':[W('jalan'),A,M,E],'lupa petak terakhir':[W('jalan'),JK('ambil'),M,E],'Maju di luar Selama':[W('jalan'),JK('ambil'),E,M]}
    };
    const cnt=p=>p.filter(c=>c.type!=='akhir').length;
    const keyOf=w=>JSON.stringify([w.bit,w.coins,w.seen,w.lamp]);
    for(const id of Object.keys(REF)){
      const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      const run=(prog)=>{ const res=[]; for(let i=0;i<n;i++){ T.setSeed(i); const r=T.simulate(prog,i); res.push({ok:r.ok,msg:r.msg||'',label:st.variants[i].label}); } return res; };
      out.ref[id]={n,limit:st.limit,len:cnt(REF[id]),res:run(REF[id]),pal:['easy','medium','hard'].every(d=>REF[id].filter(c=>c.type!=='akhir').every(c=>st.palette[d].includes(c.type)))};
      out.neg[id]={}; for(const [k,p] of Object.entries(NEG[id])) out.neg[id][k]=run(p).map(x=>x.ok);
      if(ALT[id]) for(const [k,p] of Object.entries(ALT[id])) if(p) out.ref[id+' (alternatif: '+k+')']={n,limit:st.limit,len:cnt(p),res:run(p),pal:true};
      // BFS tanpa wadah (hanya kartu datar dari palet Hard, tanpa ulangi/selama; jika diisi koin→ambil)
      const atoms=[]; for(const t of st.palette.hard){ if(t==='ulangi'||t==='selama') continue; if(t==='jika'){ atoms.push(JK('ambil')); atoms.push(JK('ambil','maju')); } else atoms.push({type:t}); }
      const mk=()=>{ const ws=[]; for(let i=0;i<n;i++){ T.setSeed(i); ws.push(T.freshWorld()); } return ws; };
      let layer=new Map(); const w0=mk(); layer.set(JSON.stringify(w0.map(keyOf)),w0); let found=null, explored=0;
      for(let k=1;k<=st.limit&&!found;k++){ const nxt=new Map();
        for(const ws of layer.values()) for(const at of atoms){ const ws2=JSON.parse(JSON.stringify(ws)); let ok=true; for(let i=0;i<n;i++){ T.setSeed(i); if(!T.apply(ws2[i],at).ok){ ok=false; break; } } if(!ok) continue; const kk=JSON.stringify(ws2.map(keyOf)); if(!nxt.has(kk)){ nxt.set(kk,ws2); explored++; } }
        for(const ws of nxt.values()){ let all=true; for(let i=0;i<n;i++){ T.setSeed(i); if(!st.check(ws[i]).ok){ all=false; break; } } if(all){ found=k; break; } }
        layer=nxt; }
      out.flat[id]={found,explored};
    }
    // J03: Ulangi satu tingkat butuh 5 kartu (> batas 4)
    { const st=T.STAGES.find(s=>s.id==='j03'); T.setStage(st); T.setSeed(0); const p=[U(4),M,M,M,R,E]; out.misc.j03flat={ok:T.simulate(p,0).ok,len:cnt(p),limit:st.limit}; }
    // pengaman putaran tak berujung
    { const st=T.STAGES.find(s=>s.id==='j04'); T.setStage(st); T.setSeed(0); const r=T.simulate([W('jalan'),E],0); out.misc.loopGuard=r; const r2=T.simulate([W('jalan'),R,Lf,E],0); out.misc.loopGuard2=r2; }
    // urutan langkah penafsir: Ulangi 2 [Maju, Ulangi 2 [Kanan]] → indeks kartu yang dijalankan
    { const st=T.STAGES.find(s=>s.id==='j02'); T.setStage(st); T.setSeed(0); const w=T.freshWorld(); const p=[U(2),M,U(2),R,E,E]; const seq=[]; for(const s of T.interpret(p,()=>w)){ seq.push(s.index+(s.ctl?'c':'')); T.execStep(w,s); if(seq.length>40) break; } out.misc.seq=seq.join(' '); }
    // normalisasi Selesai lewat setProgram
    { const st=T.STAGES.find(s=>s.id==='j02'); T.loadStage(st); const ty=()=>T.getProgram().map(c=>c.type).join(',');
      T.setProgram([E,U(2),M]); const a=ty(); T.setProgram([U(2),U(2),M,E]); const b2=ty(); T.setProgram([M,E,E]); const c=ty(); out.misc.norm={a,b:b2,c}; }
    T.setSeed(0); out.order=T.STAGES.map(s=>s.code.slice(0,3)).join(' ');
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1c_data.json',JSON.stringify(D,null,2));
  for(const [id,r] of Object.entries(D.ref)){
    await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan`,()=>({ok:r.res.every(x=>x.ok)&&r.len<=r.limit&&r.pal,note:r.res.filter(x=>!x.ok).map(x=>x.label+': '+x.msg).join(' | ')||`kartu ${r.len}/${r.limit}`}));
  }
  for(const [id,o] of Object.entries(D.neg)) for(const [k,res] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: program salah “${k}” gagal di minimal satu keadaan`,()=>({ok:res.some(x=>!x),note:res.map(x=>x?'✓':'✗').join('')}));
  for(const [id,o] of Object.entries(D.flat)) await S.t('F-'+id,`${id}: tanpa kartu wadah (Ulangi/Selama) tidak ada program ≤ batas kartu yang lulus semua keadaan`,()=>({ok:o.found===null,note:`keadaan dijelajahi=${o.explored}, solusi datar=${o.found}`}));
  await S.t('M1','J03: Ulangi satu tingkat [Maju×3, Kanan] memang benar tetapi butuh 5 kartu (> batas 4), jadi bersarang diperlukan',()=>({ok:D.misc.j03flat.ok&&D.misc.j03flat.len>D.misc.j03flat.limit,note:JSON.stringify(D.misc.j03flat)}));
  await S.t('M2','Selama dengan isi kosong / isi yang tidak mengubah keadaan dihentikan dengan pesan, bukan macet',()=>({ok:!D.misc.loopGuard.ok&&/berputar terus/.test(D.misc.loopGuard.msg)&&!D.misc.loopGuard2.ok&&/berputar terus/.test(D.misc.loopGuard2.msg),note:D.misc.loopGuard.msg}));
  await S.t('M3','Urutan langkah penafsir bersarang: Ulangi 2 [Maju, Ulangi 2 [Kanan]]',()=>({ok:D.misc.seq==='0c 1 2c 3 2c 3 0c 1 2c 3 2c 3',note:D.misc.seq}));
  await S.t('M4','Normalisasi: Selesai tanpa pasangan dibuang; Selesai yang kurang ditambahkan di akhir',()=>({ok:D.misc.norm.a==='ulangi,maju,akhir'&&D.misc.norm.b==='ulangi,ulangi,maju,akhir,akhir'&&D.misc.norm.c==='maju',note:JSON.stringify(D.misc.norm)}));
  await S.t('O1','Urutan menu: B01–B13 lalu J01–J06',()=>({ok:/B13 J01 J02 J03 J04 J05 J06/.test(D.order),note:D.order}));
  await S.t('E1','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
