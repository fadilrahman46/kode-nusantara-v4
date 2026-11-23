// T2j — Placement Test 1 (Ujian Si Teka): kunci 21 butir diperiksa penafsir game; alur, penilaian, buka J01, tes ulang, varian, data, papan ketik, HP.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2j_placement');
  // ---- kunci butir diperiksa penafsir
  { const {page:p,ctx}=await L.newPage(b);
    const K=await p.evaluate(()=>{ const T=window.__t, B=T.T1_BANK, out=[], keep=T.getStage();
      const syn={id:'_q',tiles:{w:3,h:3},buttons:[],boxLabels:{}}; T.setStage(syn);
      const W=(o)=>Object.assign({bit:{x:1,z:1,dir:3},blocked:[],walls:[],floor:{},boxes:{},crates:[],bridge:0,lamp:false},o||{});
      const fmt=v=>!v?'kosong':v.t==='txt'?`“${v.v}”`:v.t==='bool'?(v.v?'nyala':'mati'):String(v.v);
      B.forEach((vars,c)=>vars.forEach((it,vi)=>{ const key=it.pilihan.find(o=>o[1]===1)[0]; let got=null, detail='';
        if(c===0){ const ok=it.pilihan.map(o=>{ const w=W({bit:{x:it.pic.bit[0],z:it.pic.bit[1],dir:it.pic.dir}}); for(const t of o[0]){ if(!T.apply(w,{type:t}).ok) return false; } return w.bit.x===it.pic.star[0]&&w.bit.z===it.pic.star[1]; });
          got=ok.filter(Boolean).length===1&&ok[it.pilihan.findIndex(o=>o[1]===1)]?'ok':'salah'; detail=ok.join(','); }
        else if(c===1){ const w=W({walls:it.cek.tembok?[[1,0]]:[],floor:it.cek.lantai?{'1,1':it.cek.lantai}:{}}); syn.buttons=[[1,1]]; const before=JSON.stringify(w.bit); const r=T.apply(w,it.kartu[0]); syn.buttons=[];
          got=w.lamp?'Tekan tombol':w.bit.dir!==3?(w.bit.dir===0?'Belok kanan':'Belok kiri'):JSON.stringify(w.bit)!==before?'Maju':'Tidak melakukan apa-apa'; }
        else if(c===2||c===3||c===5){ const w=W(); const sh=it.kartu[0].shape; w.boxes[it.cek.kotak]={shape:sh,value:null,at:[0,0]}; for(const k of it.kartu) T.apply(w,k); got=fmt(w.boxes[it.cek.kotak].value); }
        else if(c===4){ const acc=it.pilihan.map(o=>{ const w=W(); w.boxes.x={shape:it.cek.bentuk,value:null,at:[0,0]}; return T.apply(w,{type:'isi',box:'x',value:o[2]}).ok; });
          const idx=it.pilihan.findIndex(o=>o[1]===1); got=it.cek.tolak?(acc.filter(a=>!a).length===1&&!acc[idx]?'ok':'salah'):(acc.filter(a=>a).length===1&&acc[idx]?'ok':'salah'); detail=acc.join(','); }
        else if(c===6){ const w=W({bit:{x:0,z:1,dir:0}}); for(const k of it.kartu) if(k.type==='isi') w.boxes[k.box]={shape:'num',value:null,at:[0,0]}; if(it.cek.lampu) syn.buttons=[[0,1]];
          for(const k of it.kartu) T.apply(w,k); syn.buttons=[]; got=it.cek.lampu?(w.lamp?'Ya, menyala':'Tidak'):(w.bit.dir===3?'Gerbang kiri':w.bit.dir===1?'Gerbang kanan':'Lurus'); }
        const expect=(c===0||c===4)?'ok':key; out.push({c,v:'ABC'[vi],ok:got===expect,got,expect,detail}); }));
      T.setStage(keep); return out; });
    for(const k of K) await S.t(`K${k.c+1}${k.v}`,`Kunci butir konsep ${k.c+1} varian ${k.v} cocok dengan hasil penafsir game`,()=>({ok:k.ok,note:`hasil=${k.got} kunci=${k.expect} ${k.detail}`}));
    await ctx.close(); }
  const fast=p=>p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); });
  const winB01=async p=>{ try{ await p.click('#bubbleClose'); }catch(e){} await fast(p); for(let i=0;i<4;i++){ await p.click('#palette .card[data-type="maju"]'); await L.sleep(60); } await L.runAndWait(p); };
  // jawab satu ujian: wrong = indeks konsep yang dijawab salah, dunno = indeks konsep dijawab "Aku belum tahu"
  const take=async(p,o={})=>{ await p.click('#testStart'); await L.sleep(80); const seen=[];
    for(let i=0;i<7;i++){ const r=await p.evaluate(()=>{ const R=window.__t.getTestRun(); const c=R.order[R.i]; return {c,v:R.varian[c]}; }); seen.push(r);
      const it=await p.evaluate(r=>window.__t.T1_BANK[r.c][r.v].pilihan.map(o=>o[1]),r); let want;
      if((o.dunno||[]).includes(r.c)) want='tahu'; else { const ki=it.findIndex(x=>x===1); want=String((o.wrong||[]).includes(r.c)?(ki+1)%4:ki); }
      await p.click(`#testBody .t-opt[data-v="${want}"]`); await L.sleep(40); await p.click('#testNext'); await L.sleep(60); }
    return seen; };
  const result=p=>p.evaluate(()=>({live:document.querySelector('#testLive').textContent,body:document.querySelector('#testBody').innerText}));
  const menuInfo=p=>p.evaluate(()=>{ document.querySelector('#btnMenu').click(); const r={status:document.querySelector('#menuTestStatus').textContent,j01:document.querySelector('.stage-item[data-id="j01"]').classList.contains('locked'),ma01:document.querySelector('.stage-item[data-id="ma01"]').classList.contains('locked'),b02:document.querySelector('.stage-item[data-id="s02"]').classList.contains('locked')}; document.querySelector('#ovMenu [data-close]').click(); return r; });
  { const {page:p,ctx,errors}=await L.newPage(b,{locked:true,path:'/?benih=111111'});
    await S.t('U1','Menang B01 → layar hasil menawarkan “Ujian Si Teka”; Nanti saja menutup tanpa menghabiskan kesempatan',async()=>{ await winB01(p); const shown=await p.evaluate(()=>!document.querySelector('#resTestRow').hidden); await p.click('#resTest'); await L.sleep(100); const intro=await p.evaluate(()=>!!document.querySelector('#testStart')); await p.click('#testLater'); await L.sleep(60); const t=await p.evaluate(()=>window.__t.getTests().t1);
      return {ok:shown&&intro&&(!t||t.percobaan.length===0),note:`tawaran=${shown} pembuka=${intro} percobaan=${t?t.percobaan.length:0}`}; });
    await S.t('U2','Satu jawaban salah → Beginner Programmer, J01 tetap terkunci, tes ulang terkunci sampai 3 tahap baru',async()=>{ await p.click('#btnMenu'); await L.sleep(60); await p.click('#menuTest'); await L.sleep(80); await take(p,{wrong:[2]}); const r=await result(p); await p.click('#testDone'); const m=await menuInfo(p);
      return {ok:/1 dari 7|6 dari 7/.test(r.live)&&/Beginner Programmer/.test(r.body)&&/Kotak: mengubah isi/.test(r.body)&&m.j01&&/setelah 3 tahap baru/.test(m.status),note:`${r.live} | ${m.status}`}; });
    await S.t('U3','“Aku belum tahu” dihitung salah; tidak ada kunci jawaban di layar hasil',async()=>{ const t=await p.evaluate(()=>window.__t.getTests().t1.percobaan[0]); const body=(await result(p)).body; return {ok:t.benar===6&&!/✓/.test(body),note:`benar=${t.benar}`}; });
    await S.t('U4','Syarat tes ulang: 2 tahap baru belum cukup; tahap lama yang diulang tidak dihitung; tahap ke-3 membuka tes ulang',async()=>{
      const a=await p.evaluate(()=>{ const T=window.__t; T.markWin('s02'); T.markWin('s03'); const r1=T.t1Blocked(); T.markWin('p0'); T.markWin('s02'); const r2=T.t1Blocked(); T.markWin('s04'); return {r1,r2,r3:T.t1Blocked(),n:T.getTests().t1.tahapSejakTes.join(',')}; });
      return {ok:/1 tahap baru lagi/.test(a.r1||'')&&/1 tahap baru lagi/.test(a.r2||'')&&a.r3===null,note:JSON.stringify(a)}; });
    await S.t('U5','Tes ulang lulus 7/7 → Junior Programmer, J01 terbuka (B05 dst. masih terkunci), MA01 tetap terkunci; varian berbeda dari percobaan 1',async()=>{ await p.click('#btnMenu'); await L.sleep(60); await p.click('#menuTest'); await L.sleep(80); await take(p); const r=await result(p); const goJ=await p.evaluate(()=>!!document.querySelector('#testGoJ')); await p.click('#testDone'); const m=await menuInfo(p);
      const t=await p.evaluate(()=>window.__t.getTests().t1); const diff=t.percobaan[0].varian.every((v,i)=>v!==t.percobaan[1].varian[i]);
      return {ok:/7 dari 7/.test(r.live)&&/Junior Programmer/.test(r.body)&&goJ&&!m.j01&&m.ma01&&diff&&t.terbaik==='junior',note:`${r.live} | J01 terkunci=${m.j01} | varian1=${t.percobaan[0].varian} varian2=${t.percobaan[1].varian}`}; });
    await S.t('U6','Setelah lulus, tombol ujian menolak dengan alasan; data tetap setelah muat ulang',async()=>{ const why=await p.evaluate(()=>window.__t.t1Blocked()); await p.reload({waitUntil:'load'}); await L.sleep(700); const m=await menuInfo(p); return {ok:/sudah lulus/.test(why||'')&&!m.j01&&/Junior Programmer/.test(m.status),note:`${why} | ${m.status}`}; });
    await S.t('U7','“Hapus progres” juga menghapus hasil ujian; J01 terkunci lagi',async()=>{ await p.click('#btnMenu'); await L.sleep(60); await p.click('#progClear'); await p.click('#progClear'); await L.sleep(100); await p.evaluate(()=>document.querySelector('#ovMenu [data-close]').click()); const m=await menuInfo(p); return {ok:m.j01&&/belum diambil/.test(m.status),note:m.status}; });
    await S.t('U8','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
    await ctx.close(); }
  await S.t('U9','Tiga percobaan memakai varian berbeda untuk setiap konsep; percobaan ke-4 ditolak',async()=>{ const {page:p,ctx}=await L.newPage(b,{path:'/?benih=222222'}); try{
      const vars=[]; for(let k=0;k<3;k++){ if(k>0) await p.evaluate(k=>{ const T=window.__t; (k===1?['s05','s06','s07']:['s11','s12','s13']).forEach(id=>T.markWin(id)); },k); await p.evaluate(()=>{ window.__t; document.querySelector('#btnMenu').click(); }); await L.sleep(60); await p.click('#menuTest'); await L.sleep(80); await take(p,{wrong:[0]}); await p.click('#testDone'); const t=await p.evaluate(()=>window.__t.getTests().t1); vars.push(t.percobaan[k].varian); await p.evaluate(()=>{ const T=window.__t; T.getTests().t1.tahapSejakTes=[]; }); }
      const distinct=[0,1,2,3,4,5,6].every(c=>new Set(vars.map(v=>v[c])).size===3); const why=await p.evaluate(()=>window.__t.t1Blocked());
      return {ok:distinct&&/habis/.test(why||''),note:`${vars.map(v=>v.join('')).join(' / ')} | ${why}`}; } finally{ await ctx.close(); } });
  await S.t('U10','Benih sesi sama → urutan soal dan urutan pilihan sama',async()=>{ const get=async()=>{ const {page:p,ctx}=await L.newPage(b,{path:'/?benih=333333'}); try{ await p.click('#btnMenu'); await L.sleep(60); await p.click('#menuTest'); await L.sleep(60); await p.click('#testStart'); await L.sleep(60); return await p.evaluate(()=>{ const R=window.__t.getTestRun(); return R.order.join('')+'|'+[...document.querySelectorAll('#testBody .t-opt')].map(e=>e.dataset.v).join(''); }); } finally{ await ctx.close(); } };
    const a=await get(), c=await get(); return {ok:a===c,note:`${a} / ${c}`}; });
  await S.t('U11','Papan ketik: panah memilih pilihan berikutnya (aria-checked), tombol Lanjut aktif setelah memilih',async()=>{ const {page:p,ctx}=await L.newPage(b); try{ await p.click('#btnMenu'); await L.sleep(60); await p.click('#menuTest'); await L.sleep(60); await p.click('#testStart'); await L.sleep(80);
      const dis0=await p.evaluate(()=>document.querySelector('#testNext').disabled); await p.keyboard.press('ArrowDown'); await L.sleep(40); const r=await p.evaluate(()=>({checked:[...document.querySelectorAll('#testBody .t-opt')].map(e=>e.getAttribute('aria-checked')).join(','),dis:document.querySelector('#testNext').disabled,live:document.querySelector('#testLive').textContent}));
      return {ok:dis0&&r.checked.split(',')[1]==='true'&&!r.dis&&/Soal 1 dari 7/.test(r.live),note:JSON.stringify(r)}; } finally{ await ctx.close(); } });
  for(const v of [{n:'360x740',w:360,h:740},{n:'667x375',w:667,h:375}]) await S.t('U12-'+v.n,`HP ${v.n}: setiap soal bisa dijawab (pilihan ≥ 44 px, tombol Lanjut bisa dicapai) sampai hasil`,async()=>{ const {page:p,ctx}=await L.newPage(b,{w:v.w,h:v.h,dpr:2,touch:true}); try{ await p.click('#btnMenu'); await L.sleep(60); await p.evaluate(()=>document.querySelector('#menuTest').click()); await L.sleep(60); await p.evaluate(()=>document.querySelector('#testStart').click()); await L.sleep(60);
      let minH=999, reach=true; for(let i=0;i<7;i++){ const m=await p.evaluate(()=>{ const o=[...document.querySelectorAll('#testBody .t-opt')]; const n=document.querySelector('#testNext'); n.scrollIntoView({block:'nearest'}); const r=n.getBoundingClientRect(); return {h:Math.min(...o.map(e=>e.getBoundingClientRect().height)),vis:r.top>=0&&r.bottom<=innerHeight}; }); minH=Math.min(minH,m.h); reach=reach&&m.vis;
        await p.evaluate(()=>document.querySelector('#testBody .t-opt[data-v="tahu"]').click()); await L.sleep(30); await p.evaluate(()=>document.querySelector('#testNext').click()); await L.sleep(50); }
      const done=await p.evaluate(()=>/Ujian selesai/.test(document.querySelector('#testLive').textContent)); return {ok:minH>=44&&reach&&done,note:`pilihan terkecil ${Math.round(minH)} px, Lanjut tercapai=${reach}, selesai=${done}`}; } finally{ await ctx.close(); } });
  await S.t('U13','Penyimpanan diblokir: ujian tetap berjalan sampai hasil tanpa galat',async()=>{ const {page:p,ctx,errors}=await L.newPage(b,{denyStorage:true}); try{ await p.click('#btnMenu'); await L.sleep(60); await p.click('#menuTest'); await L.sleep(60); await take(p); const r=await result(p); return {ok:/7 dari 7/.test(r.live)&&errors.length===0,note:`${r.live} galat=${errors.length}`}; } finally{ await ctx.close(); } });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
