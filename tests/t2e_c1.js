// T2e — Perbaikan C1: label Indonesia (G1), pengali Sulit ×1,5 (F13), modal hasil tertunda & tidak menggelapkan (F16), pesan gagal ramah (G3).
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2e_c1');
  const fresh=async()=>L.newPage(b,{w:1280,h:720});
  const sel=async(p,id)=>{ await L.openStage(p,id); await p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); }); try{ await p.click('#bubbleClose'); }catch(e){} await L.sleep(100); };
  const tap=async(p,t)=>{ await p.click(`#palette .card[data-type="${t}"]`); await L.sleep(40); };
  let c=await fresh(), p=c.page; await sel(p,'s02');
  await S.t('G1a','Pemilih tingkat berlabel Mudah / Sedang / Sulit (nilai internal easy/medium/hard tetap)',async()=>{ const o=await p.evaluate(()=>[...document.querySelectorAll('#diff option')].map(x=>x.value+'='+x.textContent)); return {ok:o.join(',')==='easy=Mudah,medium=Sedang,hard=Sulit',note:o.join(',')}; });
  await S.t('G1b','Tombol bantuan berlabel “Petunjuk”, menu berlabel “Pilih tahap”; tidak ada kata Hint/Stage/Easy/Medium/Hard di antarmuka terlihat',async()=>{
    const t=await p.evaluate(()=>{ document.querySelector('#btnMenu').click(); const txt=document.body.innerText; document.querySelector('#ovMenu [data-close]')&&document.querySelector('#ovMenu [data-close]').click(); return {hint:document.querySelector('#btnHint').textContent.trim(),menu:document.querySelector('#btnMenu').textContent.trim(),eng:(txt.match(/\b(Hint|Stage|Easy|Medium|Hard)\b/g)||[])}; });
    return {ok:/Petunjuk/.test(t.hint)&&/Pilih tahap/.test(t.menu)&&t.eng.length===0,note:JSON.stringify(t)}; });
  await S.t('G3','Pesan gagal diakhiri “Tidak apa-apa, coba lagi!” (B02 tanpa belok → menabrak)',async()=>{ for(const t of ['maju','maju','maju','maju','maju','maju']) await tap(p,t); await L.runAndWait(p); const m=await L.bubble(p); return {ok:/Tidak apa-apa, coba lagi!/.test(m)&&/air|tembok|Duk|Awas|kurang/i.test(m),note:m}; });
  await c.ctx.close();
  // F16: waktu & tampilan modal
  c=await fresh(); p=c.page; await sel(p,'s02');
  for(const t of ['maju','maju','maju','kanan','maju','maju']) await tap(p,t);
  await p.click('#btnRun'); await L.sleep(100); await L.waitIdle(p);
  await L.sleep(700); const early=await L.overlayOpen(p,'#ovResult'); await L.sleep(1500); const late=await L.overlayOpen(p,'#ovResult');
  await S.t('F16a','Modal hasil belum terbuka 0,7 dtk setelah menang, dan sudah terbuka setelah ±2,2 dtk',()=>({ok:!early&&late,note:`awal=${early} akhir=${late}`}));
  await S.t('F16b','Modal hasil tidak menggelapkan layar (latar transparan) dan menutupi < 45% panel dunia',async()=>{
    const m=await p.evaluate(()=>{ const ov=document.querySelector('#ovResult'), sh=ov.querySelector('.sheet'), w=document.querySelector('#worldWrap').getBoundingClientRect(), r=sh.getBoundingClientRect();
      const ix=Math.max(0,Math.min(r.right,w.right)-Math.max(r.left,w.left)), iy=Math.max(0,Math.min(r.bottom,w.bottom)-Math.max(r.top,w.top));
      return {bg:getComputedStyle(ov).backgroundColor,pe:getComputedStyle(ov).pointerEvents,cover:+(ix*iy/(w.width*w.height)).toFixed(2)}; });
    return {ok:(m.bg==='rgba(0, 0, 0, 0)'||m.bg==='transparent')&&m.cover<0.45,note:JSON.stringify(m)}; });
  await S.t('F16c','Tombol di lembar hasil tetap bisa diklik (Stage berikutnya → B03 terbuka)',async()=>{ await p.click('#resNext'); await L.sleep(300); const t=await p.evaluate(()=>document.querySelector('#stageTitle').textContent); return {ok:/Peti & Tombol/.test(t),note:t}; });
  await c.ctx.close();
  for(const v of [{n:'360x740',w:360,h:740,dpr:2,touch:true},{n:'667x375',w:667,h:375,dpr:2,touch:true},{n:'844x390',w:844,h:390,dpr:2,touch:true}]){
    await S.t('F16d-'+v.n,`HP ${v.n}: lembar hasil terbuka, menutupi < 45% panel dunia, tombol hasil terlihat penuh`,async()=>{
      const cc=await L.newPage(b,v), pp=cc.page; try{ await sel(pp,'s02'); for(const t of ['maju','maju','maju','kanan','maju','maju']) await pp.click(`#palette .card[data-type="${t}"]`).catch(()=>{}) ; 
        // ketuk lewat sentuh bila klik tidak menambah kartu
        let n=(await L.boardCards(pp)).length; if(n<6){ for(const t of ['maju','maju','maju','kanan','maju','maju'].slice(n)){ const r=await L.rect(pp,`#palette .card[data-type="${t}"]`,0); await pp.touchscreen.tap(r.cx,r.cy); await L.sleep(60); } }
        await L.runAndWait(pp); const open=await L.overlayOpen(pp,'#ovResult');
        const m=await pp.evaluate(()=>{ const sh=document.querySelector('#ovResult .sheet'), w=document.querySelector('#worldWrap').getBoundingClientRect(), r=sh.getBoundingClientRect();
          const ix=Math.max(0,Math.min(r.right,w.right)-Math.max(r.left,w.left)), iy=Math.max(0,Math.min(r.bottom,w.bottom)-Math.max(r.top,w.top));
          const btns=['#resNext','#resRetry'].map(s=>document.querySelector(s)).filter(e=>e&&!e.hidden&&e.offsetParent!==null).map(e=>{const q=e.getBoundingClientRect();return q.top>=0&&q.bottom<=innerHeight;});
          return {cover:+(ix*iy/(w.width*w.height)).toFixed(2),btnsVisible:btns.every(Boolean),sheetH:Math.round(r.height),vh:innerHeight}; });
        return {ok:open&&m.cover<0.45&&m.btnsVisible,note:JSON.stringify(m)}; } finally{ await cc.ctx.close(); } });
  }
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
