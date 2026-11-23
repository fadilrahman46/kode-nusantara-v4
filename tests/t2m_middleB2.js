// T2m — Middle B MB04–MB10 lewat ANTARMUKA: picker terkunci, cara ubah, masukan, Jika wadah, mewarisi, atribut berisi objek; menang; pesan cara pintas.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2m_middleB2');
  async function open(p,id){ await L.openStage(p,id); await p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); }); try{ await p.click('#bubbleClose'); }catch(e){} await L.sleep(100); }
  const tap=async(p,...ts)=>{ for(const t of ts){ await p.click(`#palette .card[data-type="${t}"]`); await L.sleep(50); } };
  const close=async(p,...is)=>{ for(const i of is){ await p.evaluate(i=>document.querySelectorAll('#boardList .card')[i].scrollIntoView({block:'center'}),i); const r=await L.rect(p,'#boardList .card',i); await p.mouse.click(r.cx,r.cy); await L.sleep(80); } };
  const types=p=>p.evaluate(()=>window.__t.getProgram().map(c=>c.type+(c.closed?'✓':'')).join(','));
  const W=async(fn,o)=>{ const {page:p,ctx,errors}=await L.newPage(b,o||{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; } finally{ await ctx.close(); } };
  const finish=async(p,pre)=>{ await L.runAndWait(p); const ok=await L.overlayOpen(p,'#ovResult'); const t=ok?await p.evaluate(()=>document.querySelector('#resTitle').textContent):await L.bubble(p); return {ok:ok&&(pre?pre.ok:true),note:(pre?pre.note+' | ':'')+t}; };
  const fails=async(p,re)=>{ await L.runAndWait(p); const m=await L.bubble(p); return {ok:!(await L.overlayOpen(p,'#ovResult'))&&re.test(m),note:m}; };
  async function buildMB04(p,lock){ await tap(p,'cetakan','atribut','method','ubahAtr'); if(lock) await L.pickChoice(p,1,[['Terkunci','ya 🔒']]); await L.pickChoice(p,3,[['Cara','tambah'],['Nilai','masukan']]); await close(p,4);
    await tap(p,'method','jikaW','ubahAtr'); await L.pickChoice(p,5,[['Nama method','ambil']]); await L.pickChoice(p,6,[['Pembanding','≥']]); await L.pickChoice(p,7,[['Cara','kurang'],['Nilai','masukan']]); }
  await S.t('MB04','MB04: Celengan [saldo 0 🔒; setor [+ masukan]; ambil [Jika diri.saldo ≥ masukan [− masukan]]] → menang di semua keadaan',()=>W(async p=>{ await open(p,'mb04'); await buildMB04(p,true);
    const ty=await types(p); const txt=(await L.boardCards(p)).join(' | '); return finish(p,{ok:ty==='cetakan,atribut,method,ubahAtr,akhir✓,method,jikaW,ubahAtr,akhir,akhir,akhir'&&/Atribut saldo awalnya 0 🔒/.test(txt)&&/Ubah diri.saldo kurang masukan/.test(txt),note:ty}); }));
  await S.t('MB04x','MB04: saldo tidak dikunci → pesan “berhasil diubah dari luar … Kunci”',()=>W(async p=>{ await open(p,'mb04'); await buildMB04(p,false); return fails(p,/diubah dari luar/); }));
  await S.t('MB07','MB07: Hewan · Burung mewarisi Hewan [sayap 2; terbang wus] · Pinguin mewarisi Burung [terbang plung] lewat picker Mewarisi → menang',()=>W(async p=>{ await open(p,'mb07');
    await tap(p,'cetakan','atribut','method','ubahAtr'); await L.pickChoice(p,3,[['Cara','tambah'],['Nilai','1']]); await close(p,4,5);
    await tap(p,'cetakan','atribut','method','bersuara'); await L.pickChoice(p,6,[['Nama cetakan','Burung'],['Mewarisi','Hewan']]); await L.pickChoice(p,7,[['Atribut','sayap'],['Nilai awal','2']]); await L.pickChoice(p,8,[['Nama method','terbang']]); await close(p,10,11);
    await tap(p,'cetakan','method','bersuara'); await L.pickChoice(p,12,[['Nama cetakan','Pinguin'],['Mewarisi','Burung']]); await L.pickChoice(p,13,[['Nama method','terbang']]); await L.pickChoice(p,14,[['Bunyi','plung']]);
    const txt=(await L.boardCards(p)).join(' | '); return finish(p,{ok:/Buat Cetakan Pinguin mewarisi Burung/.test(txt),note:txt.slice(0,60)}); }));
  await S.t('MB09','MB09: Kamar [lampu nyala; matikan] · Rumah [kamar = objek Kamar baru; tidur [Suruh diri.kamar matikan]] → menang; label kamar tampil',()=>W(async p=>{ await open(p,'mb09');
    await tap(p,'cetakan','atribut','method','ubahAtr'); await L.pickChoice(p,0,[['Nama cetakan','Kamar']]); await L.pickChoice(p,2,[['Nama method','matikan']]); await L.pickChoice(p,3,[['Nilai','mati']]); await close(p,4,5);
    await tap(p,'cetakan','atribut','method','suruh'); await L.pickChoice(p,7,[['Atribut','kamar'],['Nilai awal','objek Kamar baru']]); await L.pickChoice(p,9,[['Objek','diri.kamar'],['Method','matikan']]);
    const r=await finish(p,{ok:true,note:''}); const lb=await p.evaluate(()=>[...document.querySelectorAll('#labels .lbl3d')].map(e=>e.textContent).filter(t=>/kamar/.test(t)).join(' / '));
    await p.evaluate(()=>{ const r=document.querySelector('#ovResult'); if(r) r.hidden=true; }); await L.sleep(200); await p.screenshot({path:__dirname+'/results/mb09_hp.png'});
    r.ok=r.ok&&/lampu: (mati|nyala)/.test(lb); r.note+=' | '+lb.slice(0,160); return r; },{w:390,h:844,dpr:1,touch:true}));
  await S.t('PK2','Picker Atribut MB04 di HP 360 px: grup Atribut, Nilai awal, Terkunci terlihat dan tombol Selesai terjangkau',()=>W(async p=>{ await open(p,'mb04'); await tap(p,'cetakan','atribut');
    const r0=await L.rect(p,'#boardList .card',1); await p.mouse.click(r0.cx,r0.cy); await L.sleep(120);
    const m=await p.evaluate(()=>{ const d=document.querySelector('#pickDone'); d.scrollIntoView({block:'nearest'}); const r=d.getBoundingClientRect(); return {groups:document.querySelectorAll('#pickBody .pick-group').length,done:r.bottom<=innerHeight&&r.top>=0}; });
    return {ok:m.groups===3&&m.done,note:JSON.stringify(m)}; },{w:360,h:740,dpr:2,touch:true}));
  await S.t('LOCK','Profil baru: MB04 terkunci sampai MB03 selesai',async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true}); try{ await p.click('#btnMenu'); await L.sleep(100); const why=await p.evaluate(()=>(document.querySelector('.stage-item[data-id="mb04"] small')||{}).textContent||''); return {ok:/MB03/.test(why),note:why}; } finally{ await ctx.close(); } });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
