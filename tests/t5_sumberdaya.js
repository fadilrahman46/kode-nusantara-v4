// T5 — Sumber daya GPU/memori, ketahanan (storage ditolak, CDN gagal, iframe tersandbox), resize.
const L=require('./lib'); const fs=require('fs');
(async()=>{
  const b=await L.launch(); const S=L.suite('t5_sumberdaya'); const data={};
  const mem=p=>p.evaluate(()=>({g:__r.info.memory.geometries,t:__r.info.memory.textures,heap:performance.memory?performance.memory.usedJSHeapSize:null}));

  // R01 draw call
  let c=await L.newPage(b); let p=c.page; data.draw={};
  for(const [i,id] of [[0,'p0'],[1,'b6'],[2,'b7'],[3,'b8']]){ await L.openStage(p,id); await L.sleep(500); data.draw[id]=await p.evaluate(()=>({calls:__r.info.render.calls,tri:__r.info.render.triangles})); }
  await S.t('R01','Draw call per stage < 100 (anggaran GDD §8.5) dan segitiga < 20.000',()=>({ok:Object.values(data.draw).every(d=>d.calls<100&&d.tri<20000),note:Object.entries(data.draw).map(([k,d])=>`${k}: ${d.calls} call, ${d.tri} segitiga`).join(' | ')}));
  // R02 kebocoran saat ganti stage
  await L.openStage(p,0); await L.sleep(300); const m0=await mem(p);
  for(let i=0;i<30;i++) await L.openStage(p,['p0','b6','b7','b8'][i%4]);
  await L.openStage(p,0); await L.sleep(400); const m1=await mem(p); data.leak={awal:m0,akhir:m1,pergantian:31};
  await S.t('R02','Memori GPU stabil setelah 31× ganti stage (geometri & tekstur tidak menumpuk)',()=>({ok:m1.g<=m0.g*1.5&&m1.t<=m0.t+4,note:`geometri ${m0.g}→${m1.g}, tekstur ${m0.t}→${m1.t}; heap JS ${m0.heap&&Math.round(m0.heap/1e6)}→${m1.heap&&Math.round(m1.heap/1e6)} MB`}));
  await c.ctx.close();

  // R03 tekstur label stabil saat banyak eksekusi
  c=await L.newPage(b); p=c.page; await L.openStage(p,2); await p.click('#btnSpeed'); await p.click('#bubbleClose');
  for(let i=0;i<3;i++){ const r=await L.rect(p,'#palette .card',i%2); await p.mouse.click(r.cx,r.cy); await L.sleep(40); }
  await L.sleep(300); const t0=(await mem(p)).t;
  for(let i=0;i<12;i++){ await p.click('#btnRun'); await L.sleep(100); await L.waitIdle(p); await L.sleep(1050); if(await L.overlayOpen(p,'#ovResult')) await p.click('#resRetry'); }
  const t1=(await mem(p)).t;
  await S.t('R03','12× eksekusi berturut-turut: jumlah tekstur label stabil (tidak bocor per langkah)',()=>({ok:t1<=t0+2,note:`tekstur ${t0}→${t1}`}));
  await c.ctx.close();

  // R04 storage ditolak
  c=await L.newPage(b,{denyStorage:true}); p=c.page;
  { const r=await L.rect(p,'#palette .card'); for(let i=0;i<4;i++){ await p.mouse.click(r.cx,r.cy); await L.sleep(40);} await L.runAndWait(p); }
  await S.t('R04','localStorage ditolak (mode privat/iframe): halaman tetap dapat dimainkan sampai menang',async()=>({ok:c.errors.length===0&&await L.overlayOpen(p,'#ovResult'),note:c.errors.join('|')}));
  await c.ctx.close();

  // R05 tanpa internet (Three.js disematkan; semua permintaan ke luar diblokir)
  c=await L.newPage(b,{offline:true}); p=c.page;
  const draw=await p.evaluate(()=>window.__r?window.__r.info.render.calls:0);
  { const r=await L.rect(p,'#palette .card'); for(let i=0;i<4;i++){ await p.mouse.click(r.cx,r.cy); await L.sleep(40);} await L.runAndWait(p); }
  await S.t('R05a','Tanpa internet: adegan 3D tetap tampil (Three.js disematkan)',()=>({ok:draw>0,note:`draw calls=${draw}; permintaan luar diblokir=${c.net.offlineBlocked||0}`}));
  await S.t('R05b','Tanpa internet: Stage Pengantar bisa dimenangkan tanpa error',async()=>({ok:c.errors.filter(e=>/pageerror/.test(e)).length===0&&await L.overlayOpen(p,'#ovResult'),note:c.errors.join('|')}));
  await c.ctx.close();

  // R06 iframe tersandbox tanpa allow-modals
  c=await L.newPage(b); p=c.page;
  await p.setContent(`<iframe id=f sandbox="allow-scripts allow-same-origin" style="width:1000px;height:700px" src="http://127.0.0.1:${L.PORTF()}/"></iframe>`);
  await L.sleep(2500); const fr=p.frames().find(f=>f!==p.mainFrame());
  let r6={};
  try{ await fr.evaluate(()=>{ window.__t.getLogs().push({stage:'x',runs:1}); document.querySelector('#btnLog').click(); }); await L.sleep(100);
    await fr.evaluate(()=>document.querySelector('#logClear').click()); await L.sleep(150); await fr.evaluate(()=>document.querySelector('#logClear').click()); await L.sleep(200);
    r6=await fr.evaluate(()=>({n:window.__t.getLogs().length,txt:document.querySelector('#logText').value.length})); }catch(e){ r6={err:e.message}; }
  await S.t('R06','[iframe tersandbox TANPA allow-modals] tombol "Hapus catatan" (dua ketukan) berfungsi',()=>({ok:r6.n===0,note:`entri tersisa=${r6.n} (kondisi sandbox artifact sebenarnya belum diverifikasi)`}));
  await c.ctx.close();

  // R07 resize / rotasi
  c=await L.newPage(b,{w:1280,h:720}); p=c.page; await p.setViewport({width:360,height:740,deviceScaleFactor:2,isMobile:true,hasTouch:true}); await L.sleep(500);
  const rs=await p.evaluate(()=>{const cv=document.querySelector('#world canvas'),w=document.querySelector('#worldWrap').getBoundingClientRect();return {cw:cv.clientWidth,ww:Math.round(w.width),bufW:cv.width,ch:cv.clientHeight,wh:Math.round(w.height)};});
  await S.t('R07','Rotasi/resize saat berjalan: kanvas 3D mengikuti ukuran area dunia',()=>({ok:Math.abs(rs.cw-rs.ww)<=1&&Math.abs(rs.ch-rs.wh)<=1&&c.errors.length===0,note:JSON.stringify(rs)}));
  await c.ctx.close();

  // R08 bobot halaman
  const html=fs.statSync(__dirname+'/../kode-nusantara-prototipe.html').size, three=0; // Three.js kini di dalam HTML
  data.weight={html,three};
  await S.t('R08','Bobot unduhan awal (HTML + Three.js r128) < 8 MB',()=>({ok:html+three<8e6,note:`satu berkas HTML (termasuk Three.js) = ${(html/1048576).toFixed(2)} MB; font web opsional`}));
  fs.writeFileSync(__dirname+'/results/t5_data.json',JSON.stringify(data,null,2));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
