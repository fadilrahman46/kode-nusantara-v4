// T6 — PWA (v23): manifest, ikon, service worker, luring offline, alur pembaruan, tombol pasang, penjaga (guard).
// Menyajikan folder ../kode-nusantara-pwa lewat server HTTP lokal (127.0.0.1 dianggap konteks aman oleh Chromium).
// "Offline" = server benar-benar dimatikan (bukan emulasi jaringan), sehingga fetch milik service worker ikut gagal.
const L=require('./lib'),fs=require('fs'),path=require('path'),http=require('http'),os=require('os');
const DIST=process.env.DIST||path.resolve(__dirname,'../kode-nusantara-pwa');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.webmanifest':'application/manifest+json','.png':'image/png','.json':'application/json'};
let cur=DIST, server=null, PORT=0;
const handler=(q,s)=>{ const u=decodeURIComponent(q.url.split('?')[0]); let f=path.join(cur,u==='/'?'index.html':u);
  if(!f.startsWith(cur)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){ s.statusCode=404; return s.end('nf'); }
  s.setHeader('content-type',MIME[path.extname(f)]||'application/octet-stream'); s.setHeader('cache-control','no-cache'); s.end(fs.readFileSync(f)); };
const up=async()=>{ if(server) return; server=http.createServer(handler); await new Promise(r=>server.listen(PORT,'127.0.0.1',r)); PORT=server.address().port; };
const down=async()=>{ if(!server) return; server.closeAllConnections?.(); await new Promise(r=>server.close(r)); server=null; };
// salinan "versi 2": penanda baru di index.html dan CACHE_VERSION baru di sw.js
function makeV2(){ const d=fs.mkdtempSync(path.join(os.tmpdir(),'knpwa2-')); fs.cpSync(DIST,d,{recursive:true});
  fs.writeFileSync(path.join(d,'index.html'),fs.readFileSync(path.join(d,'index.html'),'utf8').replace('<title>','<!--KN-V2--><title>'));
  fs.writeFileSync(path.join(d,'sw.js'),fs.readFileSync(path.join(d,'sw.js'),'utf8').replace(/CACHE_VERSION = "[^"]+"/,'CACHE_VERSION = "kn-v23-2"')); return d; }
const noWd=p=>p.evaluateOnNewDocument(()=>{ Object.defineProperty(navigator,'webdriver',{get:()=>false}); }); // supaya penjaga otomatisasi tidak menonaktifkan SW
const ready=p=>p.waitForFunction('document.querySelector("#stageTitle")&&document.querySelector("#stageTitle").textContent.length>0',{timeout:20000});
const sws=p=>p.evaluate(async()=>{ const r=await navigator.serviceWorker.getRegistrations(); return r.length; });
const cacheKeys=p=>p.evaluate(()=>caches.keys());
async function fresh(b,{wd=false,pre}={}){ const ctx=await b.createBrowserContext(); const page=await ctx.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{ const t=m.text(); if((m.type()==='error'||m.type()==='warning')&&!/ERR_FAILED|ERR_CONNECTION|ERR_INTERNET|fonts\.(googleapis|gstatic)|Failed to load resource/.test(t)) errors.push(m.type()+': '+t); });
  await page.setRequestInterception(true);
  page.on('request',req=>{ if(/fonts\.(googleapis|gstatic)\.com/.test(req.url())) return req.abort(); req.continue(); });
  await page.evaluateOnNewDocument(()=>{ try{ sessionStorage.setItem('kn_sesi','~tamu'); sessionStorage.setItem('kn_buka','1'); localStorage.setItem('kn_buka_semua','1'); }catch(e){} });
  if(!wd) await noWd(page); if(pre) await page.evaluateOnNewDocument(pre);
  return {ctx,page,errors}; }
(async()=>{
  const b=await L.launch(); const S=L.suite('t6_pwa'); await up(); const base=()=>`http://127.0.0.1:${PORT}`;

  // ---- A. berkas statis
  const man=JSON.parse(fs.readFileSync(path.join(DIST,'manifest.webmanifest'),'utf8'));
  const pngSize=f=>{ const x=fs.readFileSync(path.join(DIST,f)); return x.readUInt32BE(16)+'x'+x.readUInt32BE(20); };
  await S.t('A1','Manifest berisi bidang wajib installability (name, start_url, display standalone, ikon 192 dan 512)',()=>{ const sz=man.icons.map(i=>i.sizes); return {ok:!!man.name&&!!man.short_name&&man.display==='standalone'&&!!man.start_url&&sz.includes('192x192')&&sz.includes('512x512'),note:`display=${man.display} start=${man.start_url}`}; });
  await S.t('A2','Setiap ikon di manifest ada, berformat PNG, dan ukuran berkas sama dengan yang dinyatakan',()=>{ const bad=man.icons.filter(i=>!fs.existsSync(path.join(DIST,i.src))||pngSize(i.src)!==i.sizes); return {ok:bad.length===0,note:bad.map(i=>i.src).join(',')||man.icons.length+' ikon cocok'}; });
  await S.t('A3','Ada ikon "maskable" 512 dan "any" 512 (bukan satu ikon dengan purpose gabungan)',()=>({ok:man.icons.some(i=>i.purpose==='maskable'&&i.sizes==='512x512')&&man.icons.some(i=>i.purpose==='any'&&i.sizes==='512x512')}));
  await S.t('A4','Ikon maskable: inti gambar berada di zona aman 80% (piksel sudut berwarna latar navy polos)',async()=>{ // periksa piksel di 4 sudut = latar
    const p=await b.newPage(); const data='data:image/png;base64,'+fs.readFileSync(path.join(DIST,'icons/maskable-512.png')).toString('base64');
    const r=await p.evaluate(async d=>{ const im=new Image(); im.src=d; await im.decode(); const c=document.createElement('canvas'); c.width=c.height=512; const x=c.getContext('2d'); x.drawImage(im,0,0);
      // lingkaran zona aman jari-jari 0,4*512=205 dari pusat; cek tidak ada piksel non-latar di luar lingkaran itu
      const bg=[...x.getImageData(2,2,1,1).data]; const px=x.getImageData(0,0,512,512).data; let out=0;
      for(let y=0;y<512;y++)for(let xx=0;xx<512;xx++){ const dx=xx-256,dy=y-256; if(dx*dx+dy*dy>205*205){ const i=(y*512+xx)*4; if(Math.abs(px[i]-bg[0])>40||Math.abs(px[i+1]-bg[1])>40||Math.abs(px[i+2]-bg[2])>40) out++; } } return {out,bg}; },data); await p.close();
    return {ok:r.out<200,note:`piksel non-latar di luar zona aman=${r.out} (toleransi 200 untuk tepi anti-alias bintang/ombak); latar=${r.bg.slice(0,3)}`}; });
  await S.t('A5','sw.js lolos pemeriksaan sintaks dan hanya menghapus cache berawalan "kn-"',()=>{ const s=fs.readFileSync(path.join(DIST,'sw.js'),'utf8'); new Function(s); return {ok:/startsWith\("kn-"\)/.test(s)}; });
  await S.t('A6','install tidak memanggil skipWaiting otomatis (hanya lewat pesan SKIP_WAITING dari tombol pemain)',()=>{ const s=fs.readFileSync(path.join(DIST,'sw.js'),'utf8'); const calls=s.match(/skipWaiting\(\)/g)||[]; const inMsg=/SKIP_WAITING"\)\s*self\.skipWaiting\(\)/.test(s); return {ok:calls.length===1&&inMsg,note:`panggilan=${calls.length}`}; });

  // ---- B. halaman + pendaftaran
  { const {ctx,page:p,errors}=await fresh(b);
    await p.goto(base()+'/',{waitUntil:'load'}); await ready(p);
    await S.t('B1','Halaman memuat <link rel=manifest>, theme-color, apple-touch-icon, ikon favicon',()=>p.evaluate(()=>({ok:!!document.querySelector('link[rel=manifest]')&&document.querySelector('meta[name=theme-color]')?.content==='#26345E'&&!!document.querySelector('link[rel=apple-touch-icon]')&&!!document.querySelector('link[rel=icon]')})));
    await S.t('B2','Manifest dan ikon bisa diambil dari server (200, tipe konten benar)',async()=>{ const r=await p.evaluate(async()=>{ const m=await fetch('manifest.webmanifest'); const i=await fetch('icons/icon-512.png'); return {m:m.status,mt:m.headers.get('content-type'),i:i.status,it:i.headers.get('content-type')}; }); return {ok:r.m===200&&/manifest\+json/.test(r.mt)&&r.i===200&&r.it==='image/png',note:JSON.stringify(r)}; });
    await S.t('B3','Service worker terdaftar, aktif, dan mengendalikan halaman setelah muat ulang',async()=>{ await p.waitForFunction('navigator.serviceWorker.getRegistration().then(r=>!!(r&&r.active))',{timeout:15000}); await p.reload({waitUntil:'load'}); await ready(p); const c=await p.evaluate(()=>!!navigator.serviceWorker.controller); return {ok:c}; });
    await S.t('B4','Cache terpasang berisi halaman, manifest, dan semua ikon inti',async()=>{ const r=await p.evaluate(async()=>{ const k=(await caches.keys()).filter(x=>x.startsWith('kn-')); const c=await caches.open(k[0]); const u=(await c.keys()).map(x=>new URL(x.url).pathname); return {k,u}; });
      const need=['/index.html','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png'];
      return {ok:r.k.length===1&&need.every(n=>r.u.includes(n)),note:`cache=${r.k} isi=${r.u.length} berkas`}; });
    await S.t('B5','Menu: blok PWA tersembunyi saat tidak ada prompt pasang (desktop biasa, tidak ada baris kosong)',()=>p.evaluate(()=>({ok:document.querySelector('#menuPwa').hidden&&document.querySelector('#menuPwa').getBoundingClientRect().height===0})));

    // ---- C. luring (server dimatikan)
    await down();
    await S.t('C1','Server mati: muat ulang tetap menampilkan game dari cache (judul tahap terisi, WebGL hidup)',async()=>{ await p.reload({waitUntil:'load',timeout:20000}); await ready(p); const ok=await p.evaluate(()=>!!document.querySelector('canvas')); return {ok}; });
    await S.t('C2','Server mati: alamat dengan query (?tamu) juga jatuh ke halaman cache',async()=>{ await p.goto(base()+'/?tamu',{waitUntil:'load',timeout:20000}); await ready(p); return {ok:true}; });
    await S.t('C3','Server mati: permainan bisa dimainkan (tombol Jalankan bekerja, tidak ada galat)',async()=>{ await p.evaluate(()=>{ const b=document.querySelector('#bubbleClose'); if(b) b.click(); }); const n=errors.length; await p.click('#palette .card[data-type="maju"]'); await L.sleep(100); await p.click('#btnRun'); await L.sleep(900); return {ok:errors.length===n,note:errors.slice(-2).join('|')}; });
    await S.t('C4','Tidak ada galat konsol selama pendaftaran SW dan mode luring',()=>({ok:errors.length===0,note:errors.join(' | ')}));
    await up(); await ctx.close(); }

  // ---- D. pembaruan
  { const v2=makeV2(); const {ctx,page:p,errors}=await fresh(b);
    await p.goto(base()+'/',{waitUntil:'load'}); await ready(p); await p.waitForFunction('navigator.serviceWorker.getRegistration().then(r=>!!(r&&r.active))',{timeout:15000}); await p.reload({waitUntil:'load'}); await ready(p);
    const marker=()=>p.evaluate(()=>document.documentElement.outerHTML.includes('KN-V2')||document.head.innerHTML.includes('KN-V2'));
    // simpan penanda bahwa halaman ini belum dimuat ulang
    await p.evaluate(()=>{ window.__stillSame=true; });
    cur=v2; await p.evaluate(()=>navigator.serviceWorker.getRegistration().then(r=>r.update())); // simulasi pemeriksaan berkala
    await S.t('D1','Versi baru terdeteksi: tombol "Versi baru tersedia" muncul di menu',async()=>{ await p.waitForFunction('!document.querySelector("#pwaUpdate").hidden',{timeout:15000}); await p.click('#btnMenu'); await L.sleep(120);
      const r=await p.evaluate(()=>{ const u=document.querySelector('#pwaUpdate'); const r=u.getBoundingClientRect(); return {vis:!document.querySelector('#menuPwa').hidden&&r.width>0&&r.height>=44,h:Math.round(r.height)}; }); return {ok:r.vis,note:`tinggi tombol=${r.h}px`}; });
    await S.t('D2','Versi baru TIDAK mengambil alih sendiri: halaman tidak dimuat ulang dan masih versi lama',async()=>{ await L.sleep(1200); const same=await p.evaluate(()=>window.__stillSame===true); const keys=await cacheKeys(p); return {ok:same&&!(await marker())&&keys.length===2,note:`cache=${keys}`}; });
    await S.t('D3','Menekan tombol: SW baru aktif, halaman dimuat ulang sekali, penanda versi 2 muncul',async()=>{ const nav=p.waitForNavigation({waitUntil:'load',timeout:20000}); await p.click('#pwaUpdate'); await nav; await ready(p); return {ok:await marker()}; });
    await S.t('D4','Cache versi lama dihapus; tersisa hanya kn-v23-2',async()=>{ await L.sleep(500); const k=await cacheKeys(p); return {ok:k.length===1&&k[0]==='kn-v23-2',note:String(k)}; });
    await S.t('D5','Setelah pembaruan: luring (server mati) tetap menyajikan versi 2',async()=>{ await down(); await p.reload({waitUntil:'load',timeout:20000}); await ready(p); const m=await marker(); await up(); return {ok:m}; });
    await S.t('D6','Tidak ada galat konsol selama alur pembaruan',()=>({ok:errors.length===0,note:errors.join(' | ')}));
    await ctx.close(); cur=DIST; }

  // ---- E. tombol pasang
  { await up(); const {ctx,page:p,errors}=await fresh(b);
    await p.goto(base()+'/',{waitUntil:'load'}); await ready(p);
    await S.t('E1','beforeinstallprompt: tombol "Pasang aplikasi" muncul di menu dan event default dicegah',async()=>{
      const r=await p.evaluate(()=>{ window.__prompted=0; const e=new Event('beforeinstallprompt',{cancelable:true}); e.prompt=async()=>{ window.__prompted++; }; e.userChoice=Promise.resolve({outcome:'accepted'}); window.dispatchEvent(e); return {prevented:e.defaultPrevented}; });
      await p.click('#btnMenu'); await L.sleep(120); const vis=await p.evaluate(()=>{ const x=document.querySelector('#pwaInstall'); return !x.hidden&&x.getBoundingClientRect().height>=44; });
      return {ok:r.prevented&&vis}; });
    await S.t('E2','Menekan tombol memanggil prompt() tepat satu kali dan menyembunyikan tombol (tidak bisa dipakai dua kali)',async()=>{ await p.click('#pwaInstall'); await L.sleep(200); const r=await p.evaluate(()=>({n:window.__prompted,hid:document.querySelector('#pwaInstall').hidden})); return {ok:r.n===1&&r.hid,note:JSON.stringify(r)}; });
    await S.t('E3','Peristiwa appinstalled menyembunyikan blok PWA',async()=>{ await p.evaluate(()=>{ const e=new Event('beforeinstallprompt',{cancelable:true}); e.prompt=async()=>{}; e.userChoice=Promise.resolve({}); window.dispatchEvent(e); }); await L.sleep(60); const shown=await p.evaluate(()=>!document.querySelector('#pwaInstall').hidden); await p.evaluate(()=>window.dispatchEvent(new Event('appinstalled'))); await L.sleep(60); const hid=await p.evaluate(()=>document.querySelector('#menuPwa').hidden); return {ok:shown&&hid}; });
    await ctx.close();
    // iOS: petunjuk "Bagikan > Tambah ke Layar Utama"
    const ios=await fresh(b,{pre:()=>{ Object.defineProperty(navigator,'userAgent',{get:()=>'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'}); }});
    await ios.page.goto(base()+'/',{waitUntil:'load'}); await ready(ios.page);
    await S.t('E4','Pada UA iPhone (tanpa beforeinstallprompt) menu menampilkan petunjuk Bagikan > Tambah ke Layar Utama',()=>ios.page.evaluate(()=>({ok:!document.querySelector('#pwaIos').hidden&&!document.querySelector('#menuPwa').hidden&&document.querySelector('#pwaInstall').hidden})));
    await ios.ctx.close();
    await S.t('E5','Tidak ada galat konsol pada alur pasang',()=>({ok:errors.length===0,note:errors.join(' | ')})); }

  // ---- F. penjaga: SW tidak boleh aktif di konteks yang salah
  { const a=await fresh(b,{wd:true}); await a.page.goto(base()+'/',{waitUntil:'load'}); await ready(a.page); await L.sleep(1200);
    await S.t('F1','navigator.webdriver=true (otomatisasi/uji regresi): service worker TIDAK didaftarkan',async()=>({ok:(await sws(a.page))===0})); await a.ctx.close();
    const c=await fresh(b,{pre:()=>{ window.Capacitor={isNativePlatform:()=>true}; }}); await c.page.goto(base()+'/',{waitUntil:'load'}); await ready(c.page); await L.sleep(1200);
    await S.t('F2','Di dalam Capacitor (APK): service worker TIDAK didaftarkan dan menu PWA tersembunyi',async()=>({ok:(await sws(c.page))===0&&await c.page.evaluate(()=>document.querySelector('#menuPwa').hidden)})); await c.ctx.close();
    const w=await fresh(b,{pre:()=>{ Object.defineProperty(navigator,'userAgent',{get:()=>'Mozilla/5.0 (Linux; Android 14; Pixel 7; wv) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'}); }}); await w.page.goto(base()+'/',{waitUntil:'load'}); await ready(w.page); await L.sleep(1200);
    await S.t('F3','Di Android WebView (UA "; wv)"): service worker TIDAK didaftarkan',async()=>({ok:(await sws(w.page))===0})); await w.ctx.close();
    const f=await fresh(b); await f.page.goto('file://'+path.join(DIST,'index.html'),{waitUntil:'load'}); await ready(f.page); await L.sleep(800);
    await S.t('F4','Dibuka sebagai berkas lokal (file://): game tetap jalan dan tanpa galat konsol',async()=>({ok:f.errors.length===0&&await f.page.evaluate(()=>!!document.querySelector('canvas')),note:f.errors.join('|')})); await f.ctx.close(); }

  await down(); await b.close(); S.save(); process.exit(0);
})();
