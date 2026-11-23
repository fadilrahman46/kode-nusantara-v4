// T1n — EX10 Toko Terbuka: seluruh ruang setelan yang dapat dijangkau kartu dicari di Node (model sama dengan halaman), ablasi tiap bagian, dan kesesuaian halaman = Node pada sampel acak.
const L=require('./lib'); const fs=require('fs'); const path=require('path');
const X=require('./expert_model/expert_sim.js');
(async()=>{
  const S=L.suite('t1n_expert10');
  const html=fs.readFileSync(process.env.TARGET||path.resolve(__dirname,'../kode-nusantara-prototipe.html'),'utf8');
  const src=fs.readFileSync(path.resolve(__dirname,'expert_model/expert_sim.js'),'utf8').replace(/\s*if\(typeof module[^\n]*\n?$/,'').trim();
  await S.t('M1','Model Node (tests/expert_model/expert_sim.js) identik dengan model yang tertanam di halaman',async()=>({ok:html.includes(src),note:html.includes(src)?'identik':'BERBEDA'}));
  const chains=[]; for(const o of [[],['coba'],['cadangan'],['coba','cadangan'],['cadangan','coba']]) for(const n of (o.includes('coba')?[1,2,3]:[0])) for(const j of (o.includes('coba')?[1,2]:[1])) for(const k of [0,2,3,4]) chains.push({chain:o,n,jeda:j,k});
  const raks=[null]; for(const pol of ['fifo','lru','lfu']) for(let size=1;size<=4;size++) raks.push({pol,size});
  const autos=[null]; for(const T of [10,8,6,4,2,0]) for(const D of [0,2]) autos.push({T,D});
  const all=[]; let tried=0;
  for(const auto of autos) for(let S2=1;S2<=5;S2++) for(const strat of ['satu','bergilir','kosong']) for(const rak of raks) for(const H of chains){ const c={N:1,Bf:24,auto,S:S2,strat,rak,H}; if(X.ex10Cost(c)>X.EX10_BUDGET) continue; tried++; if(X.ex10Variants(c).every(v=>v.run().ok)) all.push(c); }
  await S.t('E1',`EX10: dari ${tried} susunan dalam anggaran 13, tepat 12 yang lulus`,async()=>({ok:all.length===12,note:'lulus '+all.length}));
  const ab={skala:s=>!s.auto,rak:s=>!s.rak,cadangan:s=>!s.H.chain.includes('cadangan'),pemutus:s=>!s.H.k,'coba lagi':s=>!s.H.chain.includes('coba'),'urutan coba sebelum cadangan':s=>s.H.chain[0]!=='coba'};
  for(const [k,f] of Object.entries(ab)) await S.t('A-'+k,`EX10: tidak ada susunan lulus tanpa ${k}`,async()=>({ok:all.filter(f).length===0,note:'jumlah: '+all.filter(f).length}));
  await S.t('A-strategi','EX10: “paling kosong” tidak wajib (separuh jawaban memakai bergilir) — dicatat, bukan cacat',async()=>({ok:all.filter(s=>s.strat==='kosong').length===6&&all.filter(s=>s.strat==='bergilir').length===6,note:'kosong 6, bergilir 6'}));
  // Kesesuaian halaman = Node pada 150 susunan acak (kartu → simulate)
  const b=await L.launch(); const {page:p,errors}=await L.newPage(b,{w:1280,h:720});
  let seed=12345; const rnd=n=>{ seed=(seed*1103515245+12345)&0x7fffffff; return seed%n; };
  const samples=[]; for(let i=0;i<150;i++){ const au=autos[rnd(autos.length)],rk=raks[rnd(raks.length)],H=chains[rnd(chains.length)],S2=1+rnd(5),st=['satu','bergilir','kosong'][rnd(3)]; if(i<12&&all[i]){ samples.push(all[i]); continue; } samples.push({N:1,Bf:24,auto:au,S:S2,strat:st,rak:rk,H}); }
  const toCards=c=>{ const a=[]; if(c.auto) a.push({type:'skala',naik:c.auto.T,turun:c.auto.D}); a.push({type:'server',jumlah:c.S}); a.push({type:'strategi',cara:c.strat}); if(c.rak) a.push({type:'rak',kebijakan:c.rak.pol,ukuran:c.rak.size}); for(const h of c.H.chain){ if(h==='coba') a.push({type:'coba',kali:c.H.n,jeda:c.H.jeda}); else a.push({type:'cadangan'}); } if(c.H.k) a.push({type:'pemutus',k:c.H.k}); return a; };
  const nodeOk=samples.map(c=>X.ex10Cost(c)<=X.EX10_BUDGET&&X.ex10Variants(c).every(v=>v.run().ok));
  const pageOk=await p.evaluate(progs=>{ const T=window.__t, st=T.STAGES.find(s=>s.id==='ex10'); T.setStage(st); return progs.map(pr=>st.variants.every((v,i)=>T.simulate(pr.map((c,k)=>Object.assign({id:'z'+k},c)),i).ok)); },samples.map(toCards));
  const diff=nodeOk.map((v,i)=>v===pageOk[i]?null:i).filter(x=>x!==null);
  await S.t('P1','EX10: halaman dan Node memberi hasil sama pada 150 susunan (12 jawaban benar + 138 acak)',async()=>({ok:diff.length===0&&nodeOk.filter(Boolean).length>=12,note:`beda ${diff.length}; lulus ${nodeOk.filter(Boolean).length}`}));
  await S.t('E2','Tidak ada galat konsol',async()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
