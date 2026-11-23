// T2l — Middle B MB01–MB03 lewat ANTARMUKA: picker cetakan/objek/atribut/method; menang; objek tampil dengan label; pesan cara pintas.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2l_middleB');
  async function open(p,id){ await L.openStage(p,id); await p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); }); try{ await p.click('#bubbleClose'); }catch(e){} await L.sleep(100); }
  const tap=async(p,...ts)=>{ for(const t of ts){ await p.click(`#palette .card[data-type="${t}"]`); await L.sleep(50); } };
  const close=async(p,i)=>{ await p.evaluate(i=>document.querySelectorAll('#boardList .card')[i].scrollIntoView({block:'center'}),i); const r=await L.rect(p,'#boardList .card',i); await p.mouse.click(r.cx,r.cy); await L.sleep(80); };
  const types=p=>p.evaluate(()=>window.__t.getProgram().map(c=>c.type+(c.closed?'✓':'')).join(','));
  const W=async(fn,o)=>{ const {page:p,ctx,errors}=await L.newPage(b,o||{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; } finally{ await ctx.close(); } };
  const finish=async(p,pre)=>{ await L.runAndWait(p); const ok=await L.overlayOpen(p,'#ovResult'); const t=ok?await p.evaluate(()=>document.querySelector('#resTitle').textContent):await L.bubble(p); return {ok:ok&&(pre?pre.ok:true),note:(pre?pre.note+' | ':'')+t}; };
  const labels=p=>p.evaluate(()=>[...document.querySelectorAll('#labels .lbl3d')].map(e=>e.textContent.replace(/\s+/g,' ')).filter(t=>/· (oranye|putih|hitam)|🔊/.test(t)));
  await S.t('MB01','MB01: Buat objek Belang, Mochi, Kopi; Ubah Mochi.warna putih, Kopi.warna hitam → menang; label objek menampilkan warnanya',()=>W(async p=>{ await open(p,'mb01');
    await tap(p,'buatObjek','buatObjek','buatObjek','ubahAtr','ubahAtr'); await L.pickChoice(p,1,[['Nama objek','Mochi']]); await L.pickChoice(p,2,[['Nama objek','Kopi']]);
    await L.pickChoice(p,3,[['Objek','Mochi'],['Nilai','putih']]); await L.pickChoice(p,4,[['Objek','Kopi'],['Nilai','hitam']]);
    const txt=(await L.boardCards(p)).join(' | '); const r=await finish(p,{ok:/Ubah Mochi.warna menjadi “putih”/.test(txt),note:txt.slice(0,90)}); const lb=await labels(p);
    r.ok=r.ok&&lb.some(t=>/Mochi · putih/.test(t))&&lb.some(t=>/Kopi · hitam/.test(t)); r.note+=' | '+lb.join(' / '); return r; }));
  await S.t('MB02','MB02: Cetakan Kucing [Atribut warna oranye, Method mengeong [Bersuara meong]] · Buat objek Belang · Suruh Belang mengeong → menang; label “🔊 meong”',()=>W(async p=>{ await open(p,'mb02');
    await tap(p,'cetakan','atribut','method','bersuara'); await L.pickChoice(p,1,[['Nilai awal','oranye']]); await close(p,4); await close(p,5); await tap(p,'buatObjek','suruh');
    const ty=await types(p); const r=await finish(p,{ok:ty==='cetakan,atribut,method,bersuara,akhir✓,akhir✓,buatObjek,suruh',note:ty}); const lb=await labels(p); r.ok=r.ok&&lb.some(t=>/Belang · oranye\s*🔊 meong/.test(t)); r.note+=' | '+lb.join(' / '); return r; }));
  await S.t('MB02x','MB02: Bersuara di luar method → pesan “Yang mengeong Bit, bukan Belang”',()=>W(async p=>{ await open(p,'mb02');
    await tap(p,'cetakan','atribut'); await L.pickChoice(p,1,[['Nilai awal','oranye']]); await close(p,2); await tap(p,'buatObjek','bersuara');
    await L.runAndWait(p); const m=await L.bubble(p); return {ok:!(await L.overlayOpen(p,'#ovResult'))&&/Yang mengeong Bit, bukan Belang/.test(m),note:m}; }));
  await S.t('MB03','MB03: Cetakan [Method [Bersuara]] · Untuk setiap [Buat objek isi rak sekarang, Suruh isi rak sekarang] → menang di semua keadaan',()=>W(async p=>{ await open(p,'mb03');
    await tap(p,'cetakan','method','bersuara'); await close(p,3); await close(p,4); await tap(p,'untuk','buatObjek','suruh');
    const ty=await types(p); const r=await finish(p,{ok:ty==='cetakan,method,bersuara,akhir✓,akhir✓,untuk,buatObjek,suruh,akhir',note:ty});
    await p.evaluate(()=>{ const r=document.querySelector('#ovResult'); if(r) r.hidden=true; }); await L.sleep(200); await p.screenshot({path:__dirname+'/results/mb03_hp.png'}); return r; },{w:390,h:844,dpr:1,touch:true}));
  await S.t('PK','Picker Ubah atribut di HP 360 px: tiga grup pilihan dan tombol Selesai terlihat tanpa keluar layar',()=>W(async p=>{ await open(p,'mb01'); await tap(p,'buatObjek','ubahAtr');
    const r0=await L.rect(p,'#boardList .card',1); await p.mouse.click(r0.cx,r0.cy); await L.sleep(120);
    const m=await p.evaluate(()=>{ const d=document.querySelector('#pickDone').getBoundingClientRect(); return {groups:document.querySelectorAll('#pickBody .pick-group').length,done:d.bottom<=innerHeight&&d.top>=0}; });
    return {ok:m.groups===3&&m.done,note:JSON.stringify(m)}; },{w:360,h:740,dpr:2,touch:true}));
  await S.t('LOCK','Profil baru: MB01 terkunci sampai semua Middle A selesai',async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true}); try{ await p.click('#btnMenu'); await L.sleep(100); const why=await p.evaluate(()=>(document.querySelector('.stage-item[data-id="mb01"] small')||{}).textContent||''); return {ok:/Middle A/.test(why),note:why}; } finally{ await ctx.close(); } });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
