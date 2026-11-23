// T7 — Cutscene pembuka + kunci potret (v24).
// Penjaga otomatisasi (navigator.webdriver) menonaktifkan pembuka dan layar "putar tegak" agar suite lama tidak terganggu;
// uji ini memaksa dengan ?pembuka / ?putar, atau menyamarkan webdriver (noWd) untuk menguji logika sesi yang sebenarnya.
const L=require('./lib'),fs=require('fs'),path=require('path');
const DIST=path.resolve(__dirname,'../kode-nusantara-pwa');
(async()=>{
  const b=await L.launch(); const S=L.suite('t7_pembuka'); const EV=path.join(__dirname,'evidence'); fs.mkdirSync(EV,{recursive:true});
  const hid=(p,s)=>p.evaluate(x=>{ const e=document.querySelector(x); return !e||e.hidden; },s);
  const beat=p=>p.evaluate(()=>document.querySelector('#ovBuka').dataset.beat);
  const lampFill=p=>p.evaluate(()=>[...document.querySelectorAll('#bkSvg .bk-l .lp')].map(e=>getComputedStyle(e).fill));
  async function open(o={}){ // halaman baru; wd=false menyamarkan webdriver; entry=true menampilkan halaman masuk; pre dijalankan sebelum dokumen
    const ctx=await b.createBrowserContext(); const page=await ctx.newPage(); const errors=[];
    page.on('pageerror',e=>errors.push('pageerror: '+e.message));
    page.on('console',m=>{ const t=m.text(); if((m.type()==='error'||m.type()==='warning')&&!/ERR_FAILED|fonts\.(googleapis|gstatic)|Failed to load resource|manifest/i.test(t)) errors.push(m.type()+': '+t); });
    await page.setViewport({width:o.w||390,height:o.h||844,deviceScaleFactor:o.dpr||1,isMobile:!!o.touch,hasTouch:!!o.touch});
    if(o.reduce) await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    if(o.wd) await page.evaluateOnNewDocument(()=>{ Object.defineProperty(navigator,'webdriver',{get:()=>false}); });
    if(o.pre) await page.evaluateOnNewDocument(o.pre);
    if(!o.entry) await page.evaluateOnNewDocument(()=>{ try{ if(!sessionStorage.getItem('kn_sesi')) sessionStorage.setItem('kn_sesi','~tamu'); }catch(e){} });
    await page.setRequestInterception(true);
    page.on('request',r=>{ if(/fonts\.(googleapis|gstatic)\.com/.test(r.url())) return r.abort(); r.continue(); });
    return {ctx,page,errors,go:async u=>{ await page.goto(await base(u),{waitUntil:'load'}); await page.waitForFunction('document.querySelector("#stageTitle")&&document.querySelector("#stageTitle").textContent.length>0',{timeout:20000}); }}; }
  const base=async u=>`http://127.0.0.1:${L.PORTF()}${u||'/'}`;

  // ---- A. penjaga otomatisasi dan pemaksaan
  { const {ctx,page:p,errors,go}=await open(); await go('/'); await L.sleep(400);
    await S.t('A1','Di otomatisasi (webdriver) pembuka TIDAK diputar: suite regresi lama tidak tertahan layar baru',async()=>({ok:await hid(p,'#ovBuka')&&await hid(p,'#ovPutar')}));
    await S.t('A2','Blok pembuka ada di halaman tetapi kosong saat tidak diputar (SVG tanpa isi)',async()=>({ok:await p.evaluate(()=>document.querySelector('#bkSvg').childElementCount===0)}));
    await S.t('A3','Tidak ada galat konsol pada pemuatan normal',()=>({ok:errors.length===0,note:errors.join('|')})); await ctx.close(); }

  // ---- B. alur cutscene (dipaksa dengan ?pembuka), 390x844
  { const {ctx,page:p,errors,go}=await open({touch:true,dpr:2}); await go('/?pembuka'); await L.sleep(300);
    const t0=Date.now();
    await S.t('B1','?pembuka: overlay tampil, adegan 1, teks sinopsis pertama, tombol "Lewati" terfokus',async()=>{ const r=await p.evaluate(()=>({vis:!document.querySelector('#ovBuka').hidden,beat:document.querySelector('#ovBuka').dataset.beat,cap:document.querySelector('#bkCap').textContent,foc:document.activeElement&&document.activeElement.id,inert:document.querySelector('#app').inert}));
      await p.screenshot({path:path.join(EV,'pembuka_1_390.png')}); return {ok:r.vis&&r.beat==='1'&&/pulau-pulau kecil/.test(r.cap)&&r.foc==='bkSkip'&&r.inert,note:JSON.stringify(r)}; });
    await S.t('B2','Adegan 1: semua lampu menyala dan langit senja terlihat (lapisan senja opacity 1, bintang 0)',async()=>{ const f=await lampFill(p); const o=await p.evaluate(()=>({d:getComputedStyle(document.querySelector('.bk-dusk')).opacity,s:getComputedStyle(document.querySelector('.bk-stars')).opacity})); return {ok:f.length===3&&f.every(x=>x==='rgb(255, 194, 60)')&&o.d==='1'&&o.s==='0',note:JSON.stringify(o)}; });
    await p.waitForFunction('document.querySelector("#ovBuka").dataset.beat==="2"',{timeout:6000}); await L.sleep(2600);
    await S.t('B3','Adegan 2 (malam): senja memudar, bintang muncul, lampu padam satu per satu (abu-abu)',async()=>{ const f=await lampFill(p); const o=await p.evaluate(()=>({d:getComputedStyle(document.querySelector('.bk-dusk')).opacity,s:getComputedStyle(document.querySelector('.bk-stars')).opacity,c:document.querySelector('#bkCap').textContent}));
      await p.screenshot({path:path.join(EV,'pembuka_2_390.png')}); return {ok:f.every(x=>x==='rgb(89, 99, 111)')&&o.d==='0'&&o.s==='1'&&/lampu padam/.test(o.c),note:JSON.stringify({f,o})}; });
    await p.waitForFunction('document.querySelector("#ovBuka").dataset.beat==="3"',{timeout:6000}); await L.sleep(1300);
    await S.t('B4','Adegan 3: Si Teka muncul (opacity 1) dengan dialognya; lampu masih padam',async()=>{ const o=await p.evaluate(()=>({o:getComputedStyle(document.querySelector('.bk-owl')).opacity,c:document.querySelector('#bkCap').textContent})); const f=await lampFill(p);
      await p.screenshot({path:path.join(EV,'pembuka_3_390.png')}); return {ok:o.o==='1'&&/Si Teka/.test(o.c)&&f.every(x=>x==='rgb(89, 99, 111)'),note:JSON.stringify(o)}; });
    await p.waitForFunction('document.querySelector("#ovBuka").dataset.beat==="4"',{timeout:6000}); await L.sleep(2400);
    await S.t('B5','Adegan 4: judul "Kode Nusantara" tampil, Si Teka hilang, lampu menyala kembali, tombol berubah "Mulai"',async()=>{ const o=await p.evaluate(()=>({t:getComputedStyle(document.querySelector('.bk-title')).opacity,o:getComputedStyle(document.querySelector('.bk-owl')).opacity,btn:document.querySelector('#bkSkip').textContent})); const f=await lampFill(p);
      await p.screenshot({path:path.join(EV,'pembuka_4_390.png')}); return {ok:o.t==='1'&&o.o==='0'&&/Mulai/.test(o.btn)&&f.every(x=>x==='rgb(255, 194, 60)'),note:JSON.stringify({o,f})}; });
    await p.waitForFunction('document.querySelector("#ovBuka").hidden',{timeout:8000});
    const dur=Date.now()-t0;
    await S.t('B6','Selesai sendiri: total sekitar 12,6 dtk (±2) tanpa interaksi, lalu overlay tertutup dan #app aktif kembali',async()=>{ const inert=await p.evaluate(()=>document.querySelector('#app').inert); return {ok:dur>10500&&dur<15500&&!inert,note:`${(dur/1000).toFixed(1)} dtk, inert=${inert}`}; });
    await S.t('B7','Setelah selesai, SVG dikosongkan (tidak ada animasi tersisa yang memakai CPU)',async()=>({ok:await p.evaluate(()=>document.querySelector('#bkSvg').childElementCount===0)}));
    await S.t('B8','Tidak ada galat konsol selama pemutaran penuh',()=>({ok:errors.length===0,note:errors.join('|')})); await ctx.close(); }

  // ---- C. lewati, Escape, putar ulang, fokus
  { const {ctx,page:p,errors,go}=await open({touch:true}); await go('/?pembuka'); await L.sleep(300);
    await S.t('C1','Tombol Lewati menutup pembuka di adegan 1 (≤ 0,8 dtk) dan mengembalikan #app',async()=>{ await p.click('#bkSkip'); await L.sleep(800); return {ok:await hid(p,'#ovBuka')&&!(await p.evaluate(()=>document.querySelector('#app').inert))}; });
    await S.t('C2','Menu → "Putar pembuka sekarang" memutar ulang; Escape menutupnya dan TIDAK membuka/menutup menu game',async()=>{ await p.click('#btnMenu'); await L.sleep(120); await p.click('#bkReplay'); await L.sleep(300); const on=!(await hid(p,'#ovBuka')); const menuHid=await hid(p,'#ovMenu'); await p.keyboard.press('Escape'); await L.sleep(700);
      return {ok:on&&menuHid&&await hid(p,'#ovBuka'),note:`tampil=${on} menuTertutup=${menuHid}`}; });
    await S.t('C3','Putar ulang dua kali berturut-turut tidak menumpuk pewaktu (tidak lompat adegan)',async()=>{ await p.click('#btnMenu'); await L.sleep(120); await p.click('#bkReplay'); await L.sleep(300); await p.evaluate(()=>window.KN.putarPembuka()); await L.sleep(3600); const bt=await beat(p); await p.click('#bkSkip'); await L.sleep(700); return {ok:bt==='2',note:`adegan setelah 3,9 dtk = ${bt} (harus 2)`}; });
    await S.t('C4','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join('|')})); await ctx.close(); }

  // ---- D. logika sesi nyata (webdriver disamarkan)
  { const a=await open({wd:true,entry:true}); await a.go('/'); await L.sleep(500);
    await S.t('D1','Peluncuran pertama (sesi baru, tanpa webdriver): pembuka diputar sebelum halaman masuk',async()=>({ok:!(await hid(a.page,'#ovBuka'))&&!(await hid(a.page,'#ovMasuk'))&&await a.page.evaluate(()=>document.querySelector('#app').inert)}));
    await a.page.click('#bkSkip'); await L.sleep(800);
    await S.t('D2','Sesudah dilewati: halaman masuk terlihat, #app tetap inert (belum login), fokus di judul halaman masuk',async()=>{ const r=await a.page.evaluate(()=>({ob:document.querySelector('#ovBuka').hidden,om:!document.querySelector('#ovMasuk').hidden,inert:document.querySelector('#app').inert,foc:document.activeElement&&document.activeElement.tagName})); return {ok:r.ob&&r.om&&r.inert&&r.foc==='H1',note:JSON.stringify(r)}; });
    await a.page.reload({waitUntil:'load'}); await L.sleep(700);
    await S.t('D3','Muat ulang dalam sesi yang sama (mis. sesudah masuk/ganti pemain): pembuka TIDAK diputar lagi',async()=>({ok:await hid(a.page,'#ovBuka')}));
    await a.page.goto(await base('/?tamu'),{waitUntil:'load'}); await L.sleep(600);
    await S.t('D4','Tautan ?tamu (tautan guru/uji) melewati pembuka',async()=>({ok:await hid(a.page,'#ovBuka')}));
    await a.ctx.close();
    const c=await open({wd:true,entry:true}); await c.go('/'); await L.sleep(500);
    await S.t('D5','Sesi baru (peluncuran berikutnya): pembuka diputar lagi',async()=>({ok:!(await hid(c.page,'#ovBuka'))}));
    await c.page.click('#bkSkip'); await L.sleep(700);
    // matikan lewat menu: perlu masuk dulu → pakai tamu
    await c.page.goto(await base('/?tamu'),{waitUntil:'load'}); await L.sleep(400);
    await c.page.click('#btnMenu'); await L.sleep(120);
    await S.t('D6','Kotak centang menu "Putar cutscene pembuka" tercentang secara bawaan',async()=>({ok:await c.page.evaluate(()=>document.querySelector('#optBuka').checked)}));
    await c.page.click('#optBuka'); await L.sleep(100);
    await S.t('D7','Dimatikan di menu → tersimpan (kn_buka_off=1)',async()=>({ok:await c.page.evaluate(()=>localStorage.getItem('kn_buka_off')==='1')}));
    await c.ctx.close();
    const d=await open({wd:true,entry:true,pre:()=>{ try{ localStorage.setItem('kn_buka_off','1'); }catch(e){} }}); await d.go('/'); await L.sleep(500);
    await S.t('D8','Sesi baru dengan pembuka dimatikan: tidak diputar; dan ?pembuka tetap memaksa putar',async()=>{ const off=await hid(d.page,'#ovBuka'); await d.page.goto(await base('/?pembuka'),{waitUntil:'load'}); await L.sleep(500); return {ok:off&&!(await hid(d.page,'#ovBuka'))}; });
    await d.ctx.close();
    const e=await open({wd:true,entry:true,reduce:true}); await e.go('/'); await L.sleep(500);
    await S.t('D9','Gerak dikurangi (prefers-reduced-motion): pembuka tetap berjalan, tanpa transisi, dan menutup seketika',async()=>{ const noTr=await e.page.evaluate(()=>getComputedStyle(document.querySelector('.bk-title')).transitionDuration==='0s'); await e.page.click('#bkSkip'); await L.sleep(150); return {ok:noTr&&await hid(e.page,'#ovBuka'),note:`transisi 0s=${noTr}`}; });
    await e.ctx.close();
    const f=await open({wd:true,entry:true,pre:()=>{ Object.defineProperty(window,'localStorage',{get(){ throw new DOMException('denied','SecurityError'); }}); Object.defineProperty(window,'sessionStorage',{get(){ throw new DOMException('denied','SecurityError'); }}); }});
    await f.page.goto(await base('/'),{waitUntil:'load'}); await L.sleep(1200);
    await S.t('D10','Penyimpanan ditolak: halaman tidak rusak (tanpa galat tak tertangani); pembuka boleh diputar dan bisa dilewati',async()=>{ const unc=f.errors.filter(x=>/pageerror/.test(x)); if(!(await hid(f.page,'#ovBuka'))){ await f.page.click('#bkSkip'); await L.sleep(700); } return {ok:unc.length===0&&await hid(f.page,'#ovBuka'),note:unc.join('|')}; });
    await f.ctx.close(); }

  // ---- E. tata letak pembuka di beberapa layar
  for(const [w,h,tc,nm] of [[390,844,true,'HP 390×844'],[360,640,true,'HP kecil 360×640'],[320,568,true,'HP sangat kecil 320×568'],[768,1024,true,'tablet potret 768×1024'],[1280,720,false,'desktop 1280×720']]){
    const {ctx,page:p,errors,go}=await open({w,h,touch:tc}); await go('/?pembuka');
    await p.waitForFunction('document.querySelector("#ovBuka").dataset.beat==="4"',{timeout:14000}); await L.sleep(2200);
    await S.t('E-'+w+'x'+h,`${nm}: judul, teks, dan tombol berada di dalam layar; tidak ada gulir mendatar; tombol ≥ 44 px`,async()=>{
      const r=await p.evaluate(()=>{ const R=s=>{ const r=document.querySelector(s).getBoundingClientRect(); return {x:r.x,y:r.y,r:r.right,b:r.bottom,w:r.width,h:r.height}; }; const vw=innerWidth,vh=innerHeight; return {vw,vh,t:R('.bk-title b'),c:R('.bk-cap'),s:R('#bkSkip'),sw:document.documentElement.scrollWidth,bw:document.body.scrollWidth,tf:parseFloat(getComputedStyle(document.querySelector('.bk-title b')).fontSize),cf:parseFloat(getComputedStyle(document.querySelector('.bk-cap')).fontSize)}; });
      await p.screenshot({path:path.join(EV,`pembuka_layout_${w}x${h}.png`)});
      const inside=x=>x.x>=-1&&x.r<=r.vw+1&&x.y>=-1&&x.b<=r.vh+1;
      return {ok:inside(r.t)&&inside(r.c)&&inside(r.s)&&r.sw<=r.vw+1&&r.s.h>=44&&r.s.w>=44&&r.cf>=16,note:`judul ${Math.round(r.tf)}px, teks ${Math.round(r.cf)}px, tombol ${Math.round(r.s.w)}×${Math.round(r.s.h)}`}; });
    await S.t('E2-'+w+'x'+h,`${nm}: tidak ada galat konsol`,()=>({ok:errors.length===0,note:errors.join('|')})); await ctx.close(); }

  // ---- F. kunci potret
  const man=JSON.parse(fs.readFileSync(path.join(DIST,'manifest.webmanifest'),'utf8'));
  await S.t('F1','Manifest PWA: orientation = "portrait"',()=>({ok:man.orientation==='portrait',note:man.orientation}));
  const andr=path.resolve(process.env.ANDROID_MANIFEST||path.join(__dirname,'../android/android/app/src/main/AndroidManifest.xml'));
  if(fs.existsSync(andr)) await S.t('F2','AndroidManifest MainActivity: android:screenOrientation="portrait"',()=>({ok:/android:screenOrientation="portrait"/.test(fs.readFileSync(andr,'utf8'))}));
  else S.info('F2','AndroidManifest screenOrientation',`tidak diperiksa di sini (berkas tidak ditemukan: ${andr}); periksa dengan ANDROID_MANIFEST=…`);
  { const {ctx,page:p,errors,go}=await open({w:390,h:844,touch:true,pre:()=>{ window.__lock=[]; try{ screen.orientation.lock=function(m){ window.__lock.push(m); return Promise.resolve(); }; }catch(e){} }});
    await go('/?putar'); await L.sleep(300);
    await S.t('F3','HP tegak: layar "Putar ponselmu tegak" tersembunyi; screen.orientation.lock("portrait") dipanggil',async()=>({ok:await hid(p,'#ovPutar')&&JSON.stringify(await p.evaluate(()=>window.__lock))==='["portrait"]',note:await p.evaluate(()=>JSON.stringify(window.__lock))}));
    await p.setViewport({width:844,height:390,deviceScaleFactor:1,isMobile:true,hasTouch:true}); await L.sleep(500);
    await S.t('F4','HP diputar mendatar (844×390, tanpa muat ulang): layar "Putar ponselmu tegak" menutupi game',async()=>{ const r=await p.evaluate(()=>{ const e=document.querySelector('#ovPutar'); const b=e.getBoundingClientRect(); return {vis:!e.hidden,cover:b.width>=innerWidth-1&&b.height>=innerHeight-1,z:getComputedStyle(e).zIndex,top:document.elementFromPoint(innerWidth/2,innerHeight/2).closest('#ovPutar')!==null}; });
      await p.screenshot({path:path.join(EV,'putar_844x390.png')}); return {ok:r.vis&&r.cover&&r.top,note:JSON.stringify(r)}; });
    await p.setViewport({width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true}); await L.sleep(500);
    await S.t('F5','Diputar kembali tegak: layar tertutup otomatis dan game bisa dipakai (tombol Jalankan dapat diklik)',async()=>{ const hh=await hid(p,'#ovPutar'); const el=await p.evaluate(()=>{ const b=document.querySelector('#btnRun').getBoundingClientRect(); const t=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2); return t&&(t.id==='btnRun'||!!t.closest('#btnRun')); }); return {ok:hh&&el,note:`tersembunyi=${hh} tombolTerjangkau=${el}`}; });
    await S.t('F6','Tidak ada galat konsol pada alur putar',()=>({ok:errors.length===0,note:errors.join('|')})); await ctx.close(); }
  { const {ctx,page:p,go}=await open({w:1280,h:720,pre:()=>{ window.__lock=[]; try{ screen.orientation.lock=function(m){ window.__lock.push(m); return Promise.resolve(); }; }catch(e){} }});
    await go('/?putar'); await L.sleep(300);
    await S.t('F7','Desktop 1280×720 (mendatar, penunjuk halus): TIDAK dikunci dan layar putar tidak tampil; lock() tidak dipanggil',async()=>({ok:await hid(p,'#ovPutar')&&(await p.evaluate(()=>window.__lock.length))===0})); await ctx.close(); }
  { const {ctx,page:p,go}=await open({w:1024,h:768,touch:true}); await go('/?putar'); await L.sleep(300);
    await S.t('F8','Tablet mendatar 1024×768 (sisi pendek ≥ 600): tidak diblokir layar putar (game tetap bisa dimainkan mendatar)',async()=>({ok:await hid(p,'#ovPutar')})); await ctx.close(); }
  { const {ctx,page:p,go}=await open({w:844,h:390,touch:true}); await go('/'); await L.sleep(300);
    await S.t('F9','Otomatisasi tanpa ?putar: penjaga tidak aktif walau HP mendatar (suite tata letak 667×375 dan 844×390 tetap valid)',async()=>({ok:await hid(p,'#ovPutar')})); await ctx.close(); }

  await b.close(); S.save(); process.exit(0);
})();
