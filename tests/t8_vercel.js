// T8 — Kesiapan deploy Vercel: vercel.json (header, tanpa redirect), struktur repo, dan PWA tetap jalan di bawah aturan header itu.
// Vercel tidak bisa dijalankan di sini (tanpa akun/jaringan). Uji ini MENIRUKAN penerapan "headers" memakai path-to-regexp
// (pustaka yang sama dengan rumus pencocokan Vercel) dan menyajikan folder statis; hasilnya bukan bukti deploy sungguhan.
const L=require('./lib'),fs=require('fs'),path=require('path'),http=require('http');
const {pathToRegexp}=require(process.env.PTR||'path-to-regexp');
const ROOT=path.resolve(__dirname,'..');
const PWA=fs.existsSync(path.join(ROOT,'pwa'))?path.join(ROOT,'pwa'):path.join(ROOT,'kode-nusantara-pwa');
const ROOTCFG=path.join(ROOT,'vercel.json'), PWACFG=path.join(PWA,'vercel.json');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.webmanifest':'application/octet-stream','.png':'image/png'}; // webmanifest sengaja "salah" agar header vercel.json yang menentukan
const KNOWN=new Set(['$schema','framework','buildCommand','installCommand','outputDirectory','headers','devCommand','ignoreCommand','cleanUrls','trailingSlash','rewrites','redirects','regions','github','functions','crons','public']);
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
function emulate(cfg,dir){ const rules=(cfg.headers||[]).map(r=>({re:pathToRegexp(r.source),h:r.headers}));
  return (q,s)=>{ const u=decodeURIComponent(q.url.split('?')[0]); let f=path.join(dir,u==='/'?'index.html':u);
    if(!f.startsWith(dir)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){ s.statusCode=404; return s.end('nf'); }
    s.setHeader('content-type',MIME[path.extname(f)]||'application/octet-stream');
    for(const r of rules) if(r.re.test(u)) for(const h of r.h) s.setHeader(h.key,h.value);
    s.end(fs.readFileSync(f)); }; }
let server=null, PORT=0;
const up=async(cfg,dir)=>{ if(server) return; server=http.createServer(emulate(cfg,dir)); await new Promise(r=>server.listen(PORT,'127.0.0.1',r)); PORT=server.address().port; };
const down=async()=>{ if(!server) return; server.closeAllConnections?.(); await new Promise(r=>server.close(r)); server=null; };
(async()=>{
  const S=L.suite('t8_vercel'); const cfg=read(PWACFG); const haveRoot=fs.existsSync(ROOTCFG); const rcfg=haveRoot?read(ROOTCFG):null;
  await S.t('A1','pwa/vercel.json: JSON valid, hanya kunci tingkat atas yang dikenal, tidak ada build/instal (situs statis)',()=>{ const bad=Object.keys(cfg).filter(k=>!KNOWN.has(k)); return {ok:bad.length===0&&cfg.buildCommand===null&&cfg.installCommand===null&&cfg.framework===null,note:bad.join(',')}; });
  await S.t('A2','Tidak memakai cleanUrls/rewrites/redirects: pengalihan membuat respons SW "redirected" dan ditolak browser untuk navigasi',()=>({ok:!('cleanUrls' in cfg)&&!('redirects' in cfg)&&!('rewrites' in cfg)&&!('trailingSlash' in cfg)}));
  await S.t('A3','Setiap aturan header bersumber path valid (dikompilasi path-to-regexp) dan berformat {key,value}',()=>{ let ok=true; for(const r of cfg.headers){ try{ pathToRegexp(r.source); }catch(e){ ok=false; } if(!r.headers.every(h=>h.key&&typeof h.value==='string')) ok=false; } return {ok}; });
  await S.t('A4','Berkas yang dirujuk game ada di folder terbit: index.html, sw.js, manifest.webmanifest, ikon manifest',()=>{ const m=read(path.join(PWA,'manifest.webmanifest')); const miss=['index.html','sw.js','manifest.webmanifest',...m.icons.map(i=>i.src)].filter(f=>!fs.existsSync(path.join(PWA,f))); return {ok:miss.length===0,note:miss.join(',')}; });
  if(haveRoot){
    await S.t('A5','vercel.json akar repo: outputDirectory="pwa" menunjuk folder yang berisi index.html; header identik dengan pwa/vercel.json',()=>({ok:rcfg.outputDirectory==='pwa'&&fs.existsSync(path.join(ROOT,'pwa/index.html'))&&JSON.stringify(rcfg.headers)===JSON.stringify(cfg.headers)}));
    await S.t('A6','.vercelignore akar mengecualikan android, tests, docs (unggahan CLI tidak membawa ratusan MB)',()=>{ const t=fs.readFileSync(path.join(ROOT,'.vercelignore'),'utf8'); return {ok:['android','tests','docs'].every(x=>new RegExp('^/?'+x+'/?$','m').test(t))}; });
    await S.t('A7','Akar repo tidak punya package.json (Vercel tidak menjalankan instal/pembuatan yang tidak perlu)',()=>({ok:!fs.existsSync(path.join(ROOT,'package.json'))}));
  } else S.info('A5-A7','Cek akar repo',`dilewati: ${ROOTCFG} tidak ada (jalankan dari repo lengkap)`);

  const b=await L.launch(); await up(cfg,PWA); const base=()=>`http://127.0.0.1:${PORT}`;
  const hdr=async p=>{ const r=await fetch(base()+p); return {s:r.status,h:Object.fromEntries(r.headers.entries()),red:r.redirected}; };
  await S.t('B1','/sw.js: no-cache (max-age=0, must-revalidate), tipe JavaScript, Service-Worker-Allowed "/"',async()=>{ const r=await hdr('/sw.js'); return {ok:r.s===200&&/max-age=0/.test(r.h['cache-control'])&&/javascript/.test(r.h['content-type'])&&r.h['service-worker-allowed']==='/',note:JSON.stringify(r.h)}; });
  await S.t('B2','/manifest.webmanifest: application/manifest+json dan no-cache (menimpa tipe bawaan server)',async()=>{ const r=await hdr('/manifest.webmanifest'); return {ok:/application\/manifest\+json/.test(r.h['content-type'])&&/max-age=0/.test(r.h['cache-control'])}; });
  await S.t('B3','/ dan /index.html: 200 langsung (tanpa pengalihan), no-cache',async()=>{ const a=await hdr('/'), c=await hdr('/index.html'); return {ok:a.s===200&&c.s===200&&!a.red&&!c.red&&/max-age=0/.test(a.h['cache-control'])&&/max-age=0/.test(c.h['cache-control'])}; });
  await S.t('B4','/icons/*: cache 1 hari; semua respons membawa nosniff dan Referrer-Policy',async()=>{ const r=await hdr('/icons/icon-192.png'), s=await hdr('/sw.js'); return {ok:/max-age=86400/.test(r.h['cache-control'])&&r.h['x-content-type-options']==='nosniff'&&s.h['x-content-type-options']==='nosniff'&&!!r.h['referrer-policy']}; });
  await S.t('B5','Jalur yang tidak ada → 404 (bukan jatuh ke index.html): tidak menutupi salah ketik',async()=>({ok:(await hdr('/tidak-ada')).s===404}));

  // PWA di bawah header tersebut
  const ctx=await b.createBrowserContext(); const p=await ctx.newPage(); const errors=[];
  p.on('pageerror',e=>errors.push('pageerror: '+e.message)); p.on('console',m=>{ const t=m.text(); if((m.type()==='error'||m.type()==='warning')&&!/ERR_FAILED|ERR_CONNECTION|fonts\.(googleapis|gstatic)|Failed to load resource/.test(t)) errors.push(m.type()+': '+t); });
  await p.setRequestInterception(true); p.on('request',r=>{ if(/fonts\.(googleapis|gstatic)\.com/.test(r.url())) return r.abort(); r.continue(); });
  await p.evaluateOnNewDocument(()=>{ Object.defineProperty(navigator,'webdriver',{get:()=>false}); try{ sessionStorage.setItem('kn_sesi','~tamu'); sessionStorage.setItem('kn_buka','1'); }catch(e){} });
  const ready=()=>p.waitForFunction('document.querySelector("#stageTitle")&&document.querySelector("#stageTitle").textContent.length>0',{timeout:20000});
  await p.goto(base()+'/',{waitUntil:'load'}); await ready();
  await S.t('C1','Dengan header Vercel: service worker terdaftar, aktif, dan mengendalikan halaman',async()=>{ await p.waitForFunction('navigator.serviceWorker.getRegistration().then(r=>!!(r&&r.active))',{timeout:15000}); await p.reload({waitUntil:'load'}); await ready(); return {ok:await p.evaluate(()=>!!navigator.serviceWorker.controller)}; });
  await S.t('C2','Cache SW memuat halaman dan ikon; tidak ada respons "redirected" tersimpan (jebakan SW + pengalihan)',async()=>{ const r=await p.evaluate(async()=>{ const k=(await caches.keys()).filter(x=>x.startsWith('kn-')); const c=await caches.open(k[0]); const rs=await Promise.all((await c.keys()).map(x=>c.match(x))); return {n:rs.length,red:rs.filter(x=>x.redirected).length,k}; }); return {ok:r.n>=7&&r.red===0,note:JSON.stringify(r)}; });
  await down();
  await S.t('C3','Server mati (simulasi luring): game tetap tampil dari cache dan WebGL hidup',async()=>{ await p.reload({waitUntil:'load',timeout:20000}); await ready(); return {ok:await p.evaluate(()=>!!document.querySelector('canvas'))}; });
  await S.t('C4','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join('|')}));
  await ctx.close();
  if(haveRoot){ // alur "root directory = akar repo": sajikan outputDirectory
    await up(rcfg,path.join(ROOT,rcfg.outputDirectory)); const r=await hdr('/sw.js'); const m=await hdr('/manifest.webmanifest');
    await S.t('D1','Konfigurasi akar repo (outputDirectory=pwa): /sw.js dan manifest mendapat header yang sama',()=>({ok:r.s===200&&m.s===200&&/manifest\+json/.test(m.h['content-type'])&&r.h['service-worker-allowed']==='/'})); await down(); }
  await b.close(); S.save(); process.exit(0);
})();
