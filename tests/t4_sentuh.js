// T4 — Interaksi sentuh (emulasi layar sentuh Chromium, HP 360×740 @2x).
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t4_sentuh');
  const fresh=(o={})=>L.newPage(b,{w:360,h:740,dpr:2,touch:true,...o});
  const swipe=async(p,a,z,steps=8)=>{ const t=await p.touchscreen.touchStart(a.x,a.y); for(let i=1;i<=steps;i++) await t.move(a.x+(z.x-a.x)*i/steps,a.y+(z.y-a.y)*i/steps); await t.end(); await L.sleep(120); };
  const inView=(p,sel,i=0)=>p.evaluate((s,i)=>{const r=document.querySelectorAll(s)[i].getBoundingClientRect();return {ok:r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth,top:Math.round(r.top),bottom:Math.round(r.bottom),vh:innerHeight};},sel,i);
  const tapSel=async(p,sel,i=0)=>{ const r=await L.rect(p,sel,i); await p.touchscreen.tap(r.cx,r.cy); await L.sleep(120); };

  let c=await fresh(); let p=c.page;
  { const a=await L.rect(p,'#palette .card'), z=await L.rect(p,'#board'); await swipe(p,{x:a.cx,y:a.cy},{x:z.cx,y:z.cy}); }
  await S.t('S01','Seret-sentuh kartu dari palet ke papan → kartu bertambah',async()=>({ok:(await L.boardCards(p)).length===1}));
  await tapSel(p,'#palette .card'); await tapSel(p,'#palette .card'); await tapSel(p,'#palette .card');
  await S.t('S02','Ketuk kartu palet menambah kartu (4 kartu)',async()=>({ok:(await L.boardCards(p)).length===4}));
  await S.t('S03','Setelah 4 kartu, tombol ▶ Jalankan berada di dalam layar (dapat disentuh)',async()=>{ const v=await inView(p,'#btnRun'); return {ok:v.ok,note:`tombol y=${v.top}–${v.bottom} dari tinggi layar ${v.vh}`}; });
  await S.t('S04','Tombol ⏹ Ulang, 💡 Hint (dan tong sampah bila ditampilkan) berada di dalam layar',async()=>{ const shown=await p.evaluate(()=>document.querySelector('#trash').offsetParent!==null); const a=[await inView(p,'#btnReset'),await inView(p,'#btnHint')]; if(shown) a.push(await inView(p,'#trash')); return {ok:a.every(x=>x.ok),note:a.map(x=>x.bottom).join('/')+' dari '+a[0].vh+(shown?'':' (tong sampah disembunyikan di layar sempit; membuang = seret ke deretan kartu)')}; });
  await p.screenshot({path:__dirname+'/evidence/sentuh_360_4kartu.png'});
  await c.ctx.close();

  // buang & susun ulang dengan gagang ⠿ (sentuh)
  c=await fresh(); p=c.page; for(let i=0;i<3;i++) await tapSel(p,'#palette .card');
  { const g=await L.rect(p,'#boardList .grip',2), pal=await L.rect(p,'#palette'); await swipe(p,{x:g.cx,y:g.cy},{x:pal.cx,y:pal.cy},10); }
  await S.t('S10','Sentuh: seret kartu papan lewat gagang ⠿ ke deretan kartu → kartu terbuang',async()=>({ok:(await L.boardCards(p)).length===2}));
  await L.openStage(p,1); await p.click('#bubbleClose').catch(()=>{}); for(let i=0;i<2;i++) await tapSel(p,'#palette .card');
  await L.pickChoice(p,0,[['Kotak','nama perahu']]);
  { const before=await L.boardCards(p); const g=await L.rect(p,'#boardList .grip',0), li=await L.rect(p,'#boardList li',1); await swipe(p,{x:g.cx,y:g.cy},{x:li.cx,y:li.y+li.h-2},10); const after=await L.boardCards(p);
    await S.t('S11','Sentuh: susun ulang lewat gagang ⠿',()=>({ok:after[1]===before[0]&&after[0]===before[1],note:after.map(x=>x.slice(10,32)).join(' / ')})); }
  { const r=await L.rect(p,'#boardList .card',0); await p.touchscreen.tap(r.cx+60,r.cy); await L.sleep(200); }
  await S.t('S12','Sentuh: mengetuk badan kartu papan (bukan gagang) membuka pemilih',()=>L.overlayOpen(p,'#ovPick'));
  await c.ctx.close();

  // dengan perbaikan A (agar papan bisa discroll): uji gestur scroll pada papan penuh
  c=await fresh(); p=c.page; await p.addStyleTag({content:'#editor{min-height:0}'});
  for(let i=0;i<8;i++) await tapSel(p,'#palette .card');
  const sc=()=>p.evaluate(()=>document.querySelector('#board').scrollTop);
  const info=await p.evaluate(()=>{const b=document.querySelector('#board');return {sh:b.scrollHeight,ch:b.clientHeight};});
  await p.evaluate(()=>{document.querySelector('#board').scrollTop=0;}); await L.sleep(100); // papan kini otomatis bergulir ke kartu baru: mulai dari atas
  const card=await L.rect(p,'#boardList .card',2), bd=await L.rect(p,'#board');
  await swipe(p,{x:card.cx,y:Math.min(card.cy,bd.y+bd.h-10)},{x:card.cx,y:bd.y+10}); const s1=await sc();
  const nBefore=(await L.boardCards(p)).length;
  await S.t('S05','Papan penuh (8 kartu) bisa di-scroll dengan menggeser jari DI ATAS kartu',async()=>({ok:s1>0,note:`papan ${info.sh}px isi / ${info.ch}px tampak; scrollTop setelah geser di atas kartu = ${s1} (kartu menangkap gestur sebagai seret karena touch-action:none)`}));
  await p.evaluate(()=>{document.querySelector('#board').scrollTop=0;}); await L.sleep(100);
  const gut=await L.rect(p,'#boardList .num',2);
  await swipe(p,{x:gut.cx,y:Math.min(gut.cy,bd.y+bd.h-10)},{x:gut.cx,y:bd.y+10}); const s2=await sc();
  await S.t('S06','Papan bisa di-scroll dengan menggeser di kolom nomor (di luar kartu)',async()=>({ok:s2>0,note:'scrollTop='+s2+' — satu-satunya cara scroll, tidak intuitif bagi anak'}));
  await c.ctx.close();

  // palet b8 Hard
  c=await fresh(); p=c.page; await L.openStage(p,2); await p.select('#diff','hard'); await L.sleep(300);
  const pal=await p.evaluate(()=>{const P=document.querySelector('#palette'),pr=P.getBoundingClientRect();const cs=[...P.querySelectorAll('.card')].map(c=>{const r=c.getBoundingClientRect();return {t:c.textContent.trim(),full:r.left>=pr.left-1&&r.right<=pr.right+1,vis:Math.max(0,Math.min(r.right,pr.right)-Math.max(r.left,pr.left))/r.width};});return {sw:P.scrollWidth,cw:P.clientWidth,cs};});
  await S.t('S07','Palet b8 Hard (4 kartu) muat seluruhnya di layar 360 px tanpa perlu scroll',async()=>({ok:pal.sw<=pal.cw+1,note:`isi ${pal.sw}px / tampak ${pal.cw}px; kartu terpotong: ${pal.cs.filter(x=>!x.full).map(x=>x.t+' ('+Math.round(x.vis*100)+'% tampak)').join(', ')||'-'}`}));
  const first=await L.rect(p,'#palette .card',0); const pr=await L.rect(p,'#palette');
  await swipe(p,{x:first.cx,y:first.cy},{x:first.cx-150,y:first.cy});
  const sl=await p.evaluate(()=>document.querySelector('#palette').scrollLeft);
  await S.t('S08','Palet bisa di-scroll dengan menggeser jari di atas kartu',async()=>({ok:pal.sw<=pal.cw+1||sl>0,note:'scrollLeft='+sl+' (touch-action:none pada kartu)'}));
  await c.ctx.close();

  // picker di sentuh
  c=await fresh(); p=c.page; await L.openStage(p,1); await p.click('#bubbleClose'); await tapSel(p,'#palette .card'); await tapSel(p,'#boardList .card');
  const pk=await p.evaluate(()=>{const s=document.querySelector('#ovPick .sheet').getBoundingClientRect();const bs=[...document.querySelectorAll('#pickBody button')].map(b=>b.getBoundingClientRect());return {sheetH:Math.round(s.height),vh:innerHeight,minBtn:Math.round(Math.min(...bs.map(r=>Math.min(r.width,r.height)))),done:(()=>{const r=document.querySelector('#pickDone').getBoundingClientRect();return r.bottom<=innerHeight})()};});
  await S.t('S09','Pemilih nilai: tombol ≥ 44 px dan tombol "Selesai" terlihat tanpa scroll di 360×740',async()=>({ok:pk.minBtn>=44&&pk.done,note:JSON.stringify(pk)}));
  await p.screenshot({path:__dirname+'/evidence/sentuh_360_picker.png'});
  await c.ctx.close();

  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
