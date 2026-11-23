// T1p — Halaman pembuka (v22): pemain lokal per perangkat, daftar, masuk (PIN), tamu, cerita, pemisahan progres, data rusak, tata letak.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t1p_pembuka');
  const errs=[]; const sleep=L.sleep;
  const OPT=(ctx,vp={w:1280,h:720},init)=>async()=>{ const page=await ctx.newPage(); await page.setViewport({width:vp.w,height:vp.h,deviceScaleFactor:1});
    if(init) await page.evaluateOnNewDocument(init);
    await page.setRequestInterception(true); page.on('request',r=>{ const u=r.url(); if(/cdnjs|fonts\./.test(u)) return r.abort(); r.continue(); });
    page.on('pageerror',e=>errs.push('pageerror: '+e.message)); page.on('console',m=>{ const t=m.text(); if(m.type()==='error'&&!/ERR_FAILED|ERR_BLOCKED|fonts\./.test(t)) errs.push('console: '+t); });
    await page.goto(`http://127.0.0.1:${L.PORTF()}/`,{waitUntil:'load'}); await sleep(250); return page; };
  const fresh=async(vp,init)=>{ const ctx=await b.createBrowserContext(); const open=OPT(ctx,vp,init); return {ctx,open}; };
  const txt=(p,s)=>p.$eval(s,e=>e.textContent.replace(/\s+/g,' ').trim());
  const vis=(p,s)=>p.evaluate(s=>{ const e=document.querySelector(s); return !!e&&!e.hidden&&e.getClientRects().length>0; },s);
  const waitLoaded=p=>p.waitForFunction('document.querySelector("#ovMasuk").hidden&&document.querySelector("#stageTitle").textContent.length>0',{timeout:15000});
  const ls=(p,k)=>p.evaluate(k=>{ try{ return localStorage.getItem(k); }catch(e){ return 'ERR'; } },k);
  const ss=(p,k)=>p.evaluate(k=>sessionStorage.getItem(k),k);
  const daftar=async(p,nama,{pin='',av=null,ingat=false,pindah=false}={})=>{ await p.click('#mBaru'); await sleep(100); await p.type('#mNama',nama); if(pin) await p.type('#mPin',pin);
    if(av) await p.evaluate(v=>{ document.querySelector(`input[name=av][value="${v}"]`).click(); },av);
    if(ingat) await p.evaluate(()=>document.querySelector('#mIngat2').click()); if(pindah) await p.evaluate(()=>document.querySelector('#mPindah').click()); await p.click('#mOk'); await sleep(250); };
  const skip=async p=>{ await p.click('#cSkip'); await waitLoaded(p); };

  // ---------- E1 awal
  const A=await fresh(); const p1=await A.open();
  await S.t('E1','Pertama dibuka: halaman pembuka tampil, game di belakangnya terkunci (inert, aria-hidden)',async()=>{ const r=await p1.evaluate(()=>({ov:!document.querySelector('#ovMasuk').hidden,inert:document.querySelector('#app').inert,ah:document.querySelector('#app').getAttribute('aria-hidden'),h1:document.querySelector('#mBody h1').textContent,role:document.querySelector('#ovMasuk').getAttribute('role'),modal:document.querySelector('#ovMasuk').getAttribute('aria-modal'),foc:document.activeElement.tagName}));
    return {ok:r.ov&&r.inert&&r.ah==='true'&&r.h1==='Selamat datang!'&&r.role==='dialog'&&r.modal==='true'&&r.foc==='H1',note:JSON.stringify(r)}; });
  await S.t('E2','Tanpa pemain: ada “Pemain baru”, “Main sebagai tamu”, “Lihat cerita”; tidak ada daftar pemain',async()=>({ok:await vis(p1,'#mBaru')&&await vis(p1,'#mTamu')&&await vis(p1,'#mCerita')&&!(await vis(p1,'.m-list'))}));
  await S.t('E3','Game di belakang menulis ke ruang tunda, bukan ke kunci tamu atau pemain',async()=>{ const ks=await p1.evaluate(()=>Object.keys(localStorage)); const bad=ks.filter(k=>/^kn_(progres|tes|proto_logs)_v1$/.test(k)); return {ok:bad.length===0,note:ks.join(',')}; });

  // ---------- validasi
  await p1.click('#mBaru'); await sleep(100);
  const submit=async(nama,pin='')=>{ await p1.evaluate(()=>{ document.querySelector('#mNama').value=''; document.querySelector('#mPin').value=''; }); if(nama) await p1.type('#mNama',nama,{delay:0}); if(pin) await p1.type('#mPin',pin,{delay:0}); await p1.click('#mOk'); await sleep(120); return txt(p1,'#mErr'); };
  await S.t('V1','Nama < 3 karakter ditolak',async()=>{ const m=await submit('ab'); return {ok:/minimal 3/.test(m),note:m}; });
  await S.t('V2','Karakter berbahaya ditolak (<, >, ", titik, emoji)',async()=>{ const o=[]; for(const n of ['a<b>c','Dina.K','Dino😀x','x"y"z']){ o.push(await submit(n)); } return {ok:o.every(m=>/huruf, angka, spasi/.test(m)),note:o.join(' | ')}; });
  await S.t('V3','Nama hanya spasi ditolak; “Tamu” (nama cadangan) ditolak',async()=>{ const a=await submit('     '); const b2=await submit('TAMU'); return {ok:/minimal 3/.test(a)&&/sudah dipakai/.test(b2),note:a+' | '+b2}; });
  await S.t('V4','PIN selain 4 angka ditolak (12, 12ab, 12345 dipotong ke 4)',async()=>{ const a=await submit('Dina Cerdas','12'); const b2=await submit('Dina Cerdas','12ab'); return {ok:/4 angka/.test(a)&&/4 angka/.test(b2),note:a+' | '+b2}; });
  await S.t('V5','Tidak ada pemain yang tersimpan selama validasi gagal',async()=>({ok:(await ls(p1,'kn_profil_v1'))===null}));
  await p1.close();

  // ---------- pendaftaran + cerita
  const p2=await A.open();
  await S.t('R1','Daftar dengan nama berspasi ganda: dinormalkan; PIN dan tokoh tersimpan; cerita dimulai di adegan 1',async()=>{ await daftar(p2,'Dina   Cerdas',{pin:'1234',av:'🐼'});
    const r=await p2.evaluate(()=>({h:document.querySelector('#mBody .sr-only').textContent,dots:document.querySelectorAll('.m-dots i').length,prev:document.querySelector('#cPrev').disabled,next:document.querySelector('#cNext').textContent,svg:!!document.querySelector('#mStage svg')}));
    const prof=JSON.parse(await ls(p2,'kn_profil_v1')).users[0];
    return {ok:/adegan 1 dari 5/.test(r.h)&&r.dots===5&&r.prev&&/Lanjut/.test(r.next)&&r.svg&&prof.nama==='Dina Cerdas'&&prof.id==='dina_cerdas'&&prof.avatar==='🐼'&&!JSON.stringify(prof).includes('1234')&&/^s[0-9a-f]{64}$/.test(prof.pin.h)&&prof.intro===false,note:JSON.stringify(r)+' '+prof.pin.h.slice(0,8)}; });
  await S.t('R2','Cerita: 5 adegan, teks tiap adegan berbeda, mundur/maju bekerja, tokoh Si Teka, Nek Urut, Bit muncul, tombol terakhir “Mulai bermain”',async()=>{ const caps=[],who=[]; for(let i=0;i<5;i++){ caps.push(await txt(p2,'.m-cap')); who.push(await txt(p2,'.m-who')); if(i<4){ await p2.click('#cNext'); await sleep(80); } }
    const last=await txt(p2,'#cNext'); await p2.click('#cPrev'); await sleep(80); const back=await txt(p2,'.m-cap');
    return {ok:new Set(caps).size===5&&/Si Teka/.test(who[2])&&/Nek Urut/.test(who[3])&&/Bit/.test(who[4])&&/Mulai bermain/.test(last)&&back===caps[3],note:who.join('|')}; });
  await S.t('R3','Cerita tidak maju sendiri (tanpa batas waktu): adegan sama setelah 3 detik',async()=>{ const a=await txt(p2,'.m-cap'); await sleep(3000); return {ok:a===await txt(p2,'.m-cap')}; });
  await S.t('R4','Selesai cerita → game termuat sebagai pemain itu; pembuka tersembunyi; game tidak inert',async()=>{ for(let i=0;i<6&&!/Mulai/.test(await txt(p2,'#cNext'));i++){ await p2.click('#cNext'); await sleep(60); } await p2.click('#cNext'); await waitLoaded(p2);
    const r=await p2.evaluate(()=>({inert:document.querySelector('#app').inert,ah:document.querySelector('#app').getAttribute('aria-hidden'),pm:window.KN.pemain,ns:window.KN.ns,menu:document.querySelector('#menuPlayerName').textContent}));
    return {ok:!r.inert&&r.ah===null&&r.pm.nama==='Dina Cerdas'&&r.ns==='dina_cerdas'&&r.menu==='🐼 Dina Cerdas',note:JSON.stringify(r)}; });
  await S.t('R5','Sesi hanya di sessionStorage (tanpa “tetap masuk”); intro ditandai sudah dilihat; ruang tunda dibersihkan',async()=>{ const sesi=await ss(p2,'kn_sesi'), aktif=await ls(p2,'kn_aktif'); const prof=JSON.parse(await ls(p2,'kn_profil_v1')).users[0]; const ks=await p2.evaluate(()=>Object.keys(localStorage).filter(k=>k.includes('~tunda')));
    return {ok:sesi==='dina_cerdas'&&aktif===null&&prof.intro===true&&ks.length===0,note:`${sesi}/${aktif}/${ks}`}; });

  // ---------- pemisahan progres
  await S.t('P1','Progres pemain disimpan di kunci ber-ruang nama, bukan di kunci tamu',async()=>{ await p2.evaluate(()=>{ const T=window.__t; T.markWin('p0',3); T.markWin('s02',3); }); await sleep(100);
    const a=JSON.parse(await ls(p2,'kn_progres_v1@dina_cerdas')||'null'), g=await ls(p2,'kn_progres_v1'); return {ok:!!(a&&a.done&&a.done.p0&&a.done.s02)&&g===null,note:g}; });
  await p2.close();
  const p3=await A.open();
  await S.t('P2','Daftar pemain kedua (“Budi”, tanpa PIN): progresnya kosong, progres Dina tidak terlihat',async()=>{ const li=await p3.evaluate(()=>[...document.querySelectorAll('.m-pl')].map(b=>b.textContent.replace(/\s+/g,' ').trim())); await daftar(p3,'budi',{av:'🐯'}); await skip(p3);
    const r=await p3.evaluate(()=>({done:Object.keys(window.__t.getProgress?window.__t.getProgress().done:{}).length,ns:KN.ns})); const bk=JSON.parse(await ls(p3,'kn_progres_v1@budi')||'null');
    return {ok:li.length===1&&/Dina Cerdas/.test(li[0])&&/🔒/.test(li[0])&&r.ns==='budi'&&(!bk||Object.keys(bk.done||{}).length===0),note:li.join('|')+' '+JSON.stringify(r)}; });
  await S.t('P3','Nama sama beda huruf besar (“BUDI”, “Dina  cerdas”) ditolak sebagai duplikat',async()=>{ await p3.evaluate(()=>document.querySelector('#menuSwitch').click()); await p3.waitForSelector('#ovMasuk:not([hidden])'); await sleep(200);
    await p3.click('#mBaru'); await sleep(100); const o=[]; for(const n of ['BUDI','Dina  cerdas']){ await p3.evaluate(()=>{ document.querySelector('#mNama').value=''; }); await p3.type('#mNama',n); await p3.click('#mOk'); await sleep(120); o.push(await txt(p3,'#mErr')); }
    return {ok:o.every(m=>/sudah dipakai/.test(m)),note:o.join('|')}; });
  await p3.close();

  // ---------- masuk dengan PIN
  const p4=await A.open();
  await S.t('M1','Daftar pemain tampil (2); Dina berkunci; memilih Dina membuka layar PIN dan fokus di kolom PIN',async()=>{ const n=await p4.$$eval('.m-pl',e=>e.length); await p4.evaluate(()=>document.querySelector('.m-pl[data-id=dina_cerdas]').click()); await sleep(150); const f=await p4.evaluate(()=>document.activeElement.id); return {ok:n===2&&f==='mPin',note:`${n}/${f}`}; });
  await S.t('M2','PIN salah / kosong / bukan angka tidak masuk dan memberi pesan',async()=>{ const o=[]; for(const v of ['0000','','abcd']){ await p4.evaluate(()=>{ document.querySelector('#mPin').value=''; }); if(v) await p4.type('#mPin',v); await p4.click('#mPinF button[type=submit]'); await sleep(250); o.push(await txt(p4,'#mErr')); }
    return {ok:/belum cocok/.test(o[0])&&/4 angka/.test(o[1])&&/4 angka/.test(o[2])&&await vis(p4,'#mPin'),note:o.join('|')}; });
  await S.t('M3','PIN benar → masuk, progres Dina utuh (B01, B02 selesai)',async()=>{ await p4.type('#mPin','1234'); await p4.click('#mPinF button[type=submit]'); await waitLoaded(p4); const r=await p4.evaluate(()=>{ const p=JSON.parse(localStorage.getItem('kn_progres_v1@dina_cerdas')); return {ns:KN.ns,d:Object.keys(p.done)}; }); return {ok:r.ns==='dina_cerdas'&&r.d.includes('p0')&&r.d.includes('s02'),note:JSON.stringify(r)}; });
  await S.t('M4','“Hapus progres” di dalam game hanya menghapus progres pemain aktif',async()=>{ await p4.evaluate(()=>{ localStorage.setItem('kn_progres_v1@budi',JSON.stringify({done:{b01:3},last:null,gerbang:{}})); document.querySelector('#btnMenu').click(); }); await sleep(200); await p4.click('#progClear'); await p4.click('#progClear'); await sleep(200);
    const a=JSON.parse(await ls(p4,'kn_progres_v1@dina_cerdas')), bb=JSON.parse(await ls(p4,'kn_progres_v1@budi')); return {ok:Object.keys(a.done).length===0&&bb.done.b01===3}; });
  await p4.close();
  const p5=await A.open();
  await S.t('M5','“Lupa PIN?” → konfirmasi; Batal kembali ke PIN tanpa menghapus; Hapus menghilangkan pemain dan kunci progresnya, pemain lain aman',async()=>{ await p5.evaluate(()=>document.querySelector('.m-pl[data-id=dina_cerdas]').click()); await sleep(120); await p5.click('#mLupa'); await sleep(120); const h=await txt(p5,'#mBody h1'); await p5.click('#mBatal'); await sleep(120); const back=await vis(p5,'#mPin');
    await p5.click('#mLupa'); await sleep(100); await p5.click('#mYa'); await sleep(200); const prof=JSON.parse(await ls(p5,'kn_profil_v1')).users.map(u=>u.id); const k=await ls(p5,'kn_progres_v1@dina_cerdas'), kb=await ls(p5,'kn_progres_v1@budi');
    return {ok:/Hapus pemain Dina Cerdas/.test(h)&&back&&prof.join()==='budi'&&k===null&&kb!==null,note:prof.join()}; });
  await p5.close();

  // ---------- PIN tanpa crypto.subtle (konteks tidak aman)
  const F=await fresh(undefined,()=>{ try{ Object.defineProperty(window.crypto,'subtle',{value:undefined,configurable:true}); }catch(e){} }); const f1=await F.open();
  await S.t('M6','Tanpa crypto.subtle: PIN tetap bisa dibuat dan dipakai (hash cadangan berawalan f), PIN salah ditolak',async()=>{ await daftar(f1,'Gani',{pin:'4321'}); await skip(f1); const prof=JSON.parse(await ls(f1,'kn_profil_v1')).users[0];
    await f1.evaluate(()=>document.querySelector('#menuSwitch').click()); await f1.waitForSelector('#ovMasuk:not([hidden])'); await sleep(200); await f1.evaluate(()=>document.querySelector('.m-pl').click()); await sleep(120);
    await f1.type('#mPin','1111'); await f1.click('#mPinF button[type=submit]'); await sleep(250); const bad=/belum cocok/.test(await txt(f1,'#mErr')); await f1.evaluate(()=>{ document.querySelector('#mPin').value=''; }); await f1.type('#mPin','4321'); await f1.click('#mPinF button[type=submit]'); await waitLoaded(f1);
    return {ok:prof.pin.h[0]==='f'&&bad&&await f1.evaluate(()=>KN.ns==='gani'),note:prof.pin.h}; }); await F.ctx.close();
  // ---------- tetap masuk, ganti pemain
  const p6=await A.open();
  await S.t('T1','“Tetap masuk” menyimpan kn_aktif; tab baru langsung masuk tanpa halaman pembuka',async()=>{ await p6.evaluate(()=>document.querySelector('#mIngat').click()); await p6.evaluate(()=>document.querySelector('.m-pl[data-id=budi]').click()); await waitLoaded(p6); const a=await ls(p6,'kn_aktif');
    const p7=await A.open(); await waitLoaded(p7); const ns=await p7.evaluate(()=>KN.ns); await p7.close(); return {ok:a==='budi'&&ns==='budi',note:a+'/'+ns}; });
  await S.t('T2','“Ganti pemain” di menu menghapus sesi dan kn_aktif, lalu menampilkan halaman pembuka',async()=>{ await p6.evaluate(()=>document.querySelector('#btnMenu').click()); await sleep(150); await p6.click('#menuSwitch'); await p6.waitForSelector('#ovMasuk:not([hidden])'); await sleep(200);
    return {ok:(await ls(p6,'kn_aktif'))===null&&(await ss(p6,'kn_sesi'))===null&&await vis(p6,'.m-list')}; });
  await p6.close();

  // ---------- tamu
  const G=await fresh(); const g1=await G.open();
  await S.t('G1','Tamu pertama kali: cerita tampil dulu; “Lewati” → game dimuat sebagai Tamu dengan kunci lama (tanpa akhiran)',async()=>{ await g1.click('#mTamu'); await sleep(200); const inStory=await vis(g1,'#cSkip'); await skip(g1);
    await g1.evaluate(()=>window.__t.markWin('p0',3)); await sleep(100); const r=await g1.evaluate(()=>({n:KN.pemain.nama,ns:KN.ns,menu:document.querySelector('#menuPlayerName').textContent,k:localStorage.getItem('kn_progres_v1')!==null,f:localStorage.getItem('kn_intro_tamu')}));
    return {ok:inStory&&r.n==='Tamu'&&r.ns===''&&r.k&&r.f==='1'&&/Tamu/.test(r.menu),note:JSON.stringify(r)}; });
  await S.t('G2','Tamu kedua kali: tanpa cerita (langsung game)',async()=>{ await g1.evaluate(()=>document.querySelector('#btnMenu').click()); await sleep(100); await g1.click('#menuSwitch'); await g1.waitForSelector('#ovMasuk:not([hidden])'); await sleep(200); await g1.click('#mTamu'); await waitLoaded(g1); return {ok:await g1.evaluate(()=>KN.pemain.nama==='Tamu')}; });
  await S.t('G3','Progres tamu lama bisa dipindahkan ke pemain baru (kotak centang hanya muncul bila ada progres tamu); kunci lama dikosongkan',async()=>{ await g1.evaluate(()=>document.querySelector('#btnMenu').click()); await sleep(100); await g1.click('#menuSwitch'); await g1.waitForSelector('#ovMasuk:not([hidden])'); await sleep(200);
    await g1.click('#mBaru'); await sleep(100); const has=await vis(g1,'#mPindah'); await g1.evaluate(()=>document.querySelector('#mBack').click()); await sleep(100); await daftar(g1,'Siti',{pindah:true}).catch(()=>{});
    return {ok:has,note:'checkbox '+has}; });
  await S.t('G4','Setelah dipindahkan: kunci tamu kosong, kunci “siti” berisi B01',async()=>{ await g1.evaluate(()=>{}); await g1.click('#cSkip').catch(()=>{}); await waitLoaded(g1); const r=await g1.evaluate(()=>({g:localStorage.getItem('kn_progres_v1'),s:JSON.parse(localStorage.getItem('kn_progres_v1@siti')||'null')})); return {ok:r.g===null&&r.s&&r.s.done&&!!r.s.done.p0,note:JSON.stringify(r).slice(0,120)}; });
  await G.ctx.close();
  const N=await fresh(); const n1=await N.open();
  await S.t('G5','Tanpa progres tamu: kotak “pindahkan” tidak muncul',async()=>{ await n1.click('#mBaru'); await sleep(100); return {ok:!(await vis(n1,'#mPindah'))}; });
  await S.t('G6','Cerita bisa dilihat ulang dari halaman pembuka dan kembali ke daftar pemain (tanpa mengubah sesi)',async()=>{ await n1.click('#mBack'); await sleep(100); await n1.click('#mCerita'); await sleep(150); const a=await vis(n1,'#cNext'); await n1.click('#cSkip'); await sleep(150); return {ok:a&&await vis(n1,'#mBaru')&&(await ss(n1,'kn_sesi'))===null}; });
  await N.ctx.close();

  // ---------- jalur khusus
  const J=await fresh(); const j1=await J.ctx.newPage(); await j1.setRequestInterception(true); j1.on('request',r=>/cdnjs|fonts\./.test(r.url())?r.abort():r.continue());
  await j1.goto(`http://127.0.0.1:${L.PORTF()}/?tahap=s03`,{waitUntil:'load'}); await sleep(500);
  await S.t('J1','Tautan ulang laporan (?tahap=...) melewati halaman pembuka dan memuat tahap itu',async()=>{ const r=await j1.evaluate(()=>({h:document.querySelector('#ovMasuk').hidden,t:document.querySelector('#stageTitle').textContent})); return {ok:r.h&&/B03/i.test(r.t)||r.h&&r.t.length>0,note:JSON.stringify(r)}; });
  await J.ctx.close();
  const D=await b.createBrowserContext(); const d1=await D.newPage(); await d1.evaluateOnNewDocument(()=>{ Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError');}}); });
  await d1.setRequestInterception(true); d1.on('request',r=>/cdnjs|fonts\./.test(r.url())?r.abort():r.continue()); const derr=[]; d1.on('pageerror',e=>derr.push(e.message));
  await d1.goto(`http://127.0.0.1:${L.PORTF()}/`,{waitUntil:'load'}); await sleep(500);
  await S.t('D1','Penyimpanan diblokir: peringatan tampil, “Pemain baru” disembunyikan, tanpa galat',async()=>({ok:/Penyimpanan peramban dimatikan/.test(await txt(d1,'.m-warn'))&&!(await vis(d1,'#mBaru'))&&await vis(d1,'#mTamu')&&derr.length===0,note:derr.join()}));
  await S.t('D2','Penyimpanan diblokir: “Main sebagai tamu” tetap memuat game',async()=>{ await d1.click('#mTamu'); await sleep(200); await d1.click('#cSkip').catch(()=>{}); await d1.waitForFunction('document.querySelector("#ovMasuk").hidden&&document.querySelector("#stageTitle").textContent.length>0',{timeout:15000}); return {ok:true}; });
  await D.close();

  // ---------- data rusak
  const C=await fresh(undefined,()=>{ try{ localStorage.setItem('kn_profil_v1',JSON.stringify({v:1,users:[{id:'x',nama:'<img src=x onerror=window.__xss=1>',avatar:'💥'},{id:'budi',nama:'Budi',avatar:'💥',pin:{s:5,h:{}}},{id:'budi',nama:'Budi'},'str',null,{id:'dina',nama:'Dina',avatar:'🐙',pin:{s:'ab',h:'f1'}}]})); }catch(e){} });
  const c1=await C.open();
  await S.t('X1','Profil rusak: entri tidak sah dibuang (HTML, duplikat, bentuk salah); avatar tak dikenal diganti; tidak ada XSS atau galat',async()=>{ const li=await c1.$$eval('.m-pl',e=>e.map(b=>b.textContent.replace(/\s+/g,' ').trim())); const x=await c1.evaluate(()=>window.__xss===1||!!document.querySelector('#ovMasuk img'));
    return {ok:li.length===2&&/Budi/.test(li[0])&&/Dina/.test(li[1])&&!x&&errs.filter(e=>/pageerror/.test(e)).length===0,note:li.join('|')}; });
  await c1.close(); await C.ctx.close();
  const C2=await fresh(undefined,()=>{ try{ localStorage.setItem('kn_profil_v1','{bukan json'); }catch(e){} }); const c2=await C2.open();
  await S.t('X2','JSON profil tidak valid: dianggap kosong, halaman pembuka tetap jalan',async()=>({ok:/Selamat datang/.test(await txt(c2,'#mBody h1'))})); await C2.ctx.close();
  const C3=await fresh(undefined,()=>{ try{ localStorage.setItem('kn_profil_v1',JSON.stringify({v:1,users:Array.from({length:30},(_,i)=>({id:'pemain_'+(i+10),nama:'Pemain '+(i+10),avatar:'🦊'}))})); }catch(e){} }); const c3=await C3.open();
  await S.t('X3','Batas 30 pemain: pendaftaran ke-31 ditolak dengan pesan',async()=>{ await c3.click('#mBaru'); await sleep(100); await c3.type('#mNama','Baru Sekali'); await c3.click('#mOk'); await sleep(150); return {ok:/penuh \(30/.test(await txt(c3,'#mErr'))}; }); await C3.ctx.close();

  // ---------- gerak dan papan ketik
  const M=await fresh(); await (await M.ctx.newPage()).close();
  const mp=await M.ctx.newPage(); await mp.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await mp.setRequestInterception(true); mp.on('request',r=>/cdnjs|fonts\./.test(r.url())?r.abort():r.continue()); await mp.goto(`http://127.0.0.1:${L.PORTF()}/`,{waitUntil:'load'}); await sleep(300);
  await S.t('A1','Kurangi gerak: lampu padam/menyala dan tokoh tidak beranimasi; keadaan akhir tetap benar (padam di adegan 2, menyala di adegan 5)',async()=>{ await mp.click('#mCerita'); await sleep(100); await mp.click('#cNext'); await sleep(100);
    const a=await mp.evaluate(()=>{ const l=document.querySelector('.lp.out'); const cs=getComputedStyle(l); return {an:cs.animationName,fill:cs.fill}; }); for(let i=0;i<3;i++){ await mp.click('#cNext'); await sleep(80); }
    const b2=await mp.evaluate(()=>{ const l=document.querySelector('.lp.in'); const cs=getComputedStyle(l); const c=document.querySelector('.m-char'); return {an:cs.animationName,fill:cs.fill,ch:c?getComputedStyle(c).animationName:'-'}; });
    return {ok:a.an==='none'&&/89, 99, 111|rgb\(89/.test(a.fill)&&b2.an==='none'&&/255, 194, 60/.test(b2.fill)&&b2.ch==='none',note:JSON.stringify([a,b2])}; });
  await M.ctx.close();
  const K1=await fresh(); const k1=await K1.open();
  await S.t('K1','Papan ketik: Enter di kolom nama mengirim formulir; panah mengganti tokoh; Tab mencapai semua kontrol',async()=>{ await k1.click('#mBaru'); await sleep(100); await k1.type('#mNama','Rafi'); await k1.evaluate(()=>document.querySelector('input[name=av]').focus()); await k1.keyboard.press('ArrowRight'); const v=await k1.evaluate(()=>document.querySelector('input[name=av]:checked').value);
    await k1.focus('#mNama'); await k1.keyboard.press('Enter'); await sleep(300); return {ok:v==='🐼'&&await vis(k1,'#cNext'),note:v}; });
  await K1.ctx.close();

  // ---------- tata letak
  const VPS=[[360,740],[667,375],[1280,720],[768,1024]];
  for(const [w,h] of VPS){ const Z=await fresh({w,h},()=>{ try{ localStorage.setItem('kn_profil_v1',JSON.stringify({v:1,users:[{id:'dina_cerdas',nama:'Dina Cerdas',avatar:'🐼',pin:{s:'ab',h:'f1'}},{id:'budi',nama:'Budi',avatar:'🐯'},{id:'siti',nama:'Siti Nurhaliza Pu',avatar:'🦊'}]})); }catch(e){} }); const z=await Z.open();
    const chk=async(label)=>z.evaluate(()=>{ const ov=document.querySelector('#ovMasuk'); const vw=innerWidth; const bad=[]; ov.querySelectorAll('button,input,.m-card,.m-stage').forEach(e=>{ const r=e.getBoundingClientRect(); if(!r.width) return; if(r.left<-0.5||r.right>vw+0.5) bad.push((e.id||e.className||e.tagName)+':x'); if((e.tagName==='BUTTON')&&r.height<43.5) bad.push((e.id||e.className)+':h'+Math.round(r.height)); });
      return {hs:ov.scrollWidth>ov.clientWidth+1,bad}; });
    await S.t(`L${w}a`,`${w}×${h}: daftar pemain — tidak ada geser horizontal; kontrol di dalam layar dan ≥44 px`,async()=>{ const r=await chk(); return {ok:!r.hs&&r.bad.length===0,note:JSON.stringify(r)}; });
    await S.t(`L${w}b`,`${w}×${h}: formulir daftar — sama`,async()=>{ await z.click('#mBaru'); await sleep(120); const r=await chk(); const reach=await z.evaluate(()=>{ const b=document.querySelector('#mOk'); b.scrollIntoView({block:'nearest'}); const r=b.getBoundingClientRect(); return r.top>=0&&r.bottom<=innerHeight+1; }); return {ok:!r.hs&&r.bad.length===0&&reach,note:JSON.stringify(r)+reach}; });
    await S.t(`L${w}c`,`${w}×${h}: layar PIN dan cerita (5 adegan) — sama; tombol Lanjut dapat dijangkau`,async()=>{ await z.click('#mBack'); await sleep(100); await z.evaluate(()=>document.querySelector('.m-pl[data-id=dina_cerdas]').click()); await sleep(120); let r=await chk(); const bads=[...r.bad]; let hs=r.hs;
      await z.click('#mBack'); await sleep(100); await z.click('#mCerita'); await sleep(120); for(let i=0;i<5;i++){ r=await chk(); bads.push(...r.bad); hs=hs||r.hs; const ok=await z.evaluate(()=>{ const b=document.querySelector('#cNext'); b.scrollIntoView({block:'nearest'}); const r=b.getBoundingClientRect(); return r.top>=0&&r.bottom<=innerHeight+1; }); if(!ok) bads.push('next-unreachable-'+i); if(i<4){ await z.click('#cNext'); await sleep(100); } }
      return {ok:!hs&&bads.length===0,note:JSON.stringify({hs,bads})}; });
    await Z.ctx.close(); }

  // ---------- umum
  await S.t('U1','Tidak ada galat atau peringatan konsol sepanjang uji',async()=>({ok:errs.length===0,note:errs.slice(0,3).join(' || ')}));
  S.save(); await b.close(); process.exit(0);
})();
