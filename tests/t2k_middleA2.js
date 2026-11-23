// T2k — Middle A MA04–MA10 lewat ANTARMUKA: susun program acuan dengan ketuk + picker, jalankan, menang di semua keadaan; pesan cara salah; panel pohon.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2k_middleA2');
  async function open(p,id){ await L.openStage(p,id); await p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); }); try{ await p.click('#bubbleClose'); }catch(e){} await L.sleep(100); }
  const tap=async(p,...ts)=>{ for(const t of ts){ await p.click(`#palette .card[data-type="${t}"]`); await L.sleep(50); } };
  const close=async(p,i)=>{ await p.evaluate(i=>document.querySelectorAll('#boardList .card')[i].scrollIntoView({block:'center'}),i); const r=await L.rect(p,'#boardList .card',i); await p.mouse.click(r.cx,r.cy); await L.sleep(80); };
  const types=p=>p.evaluate(()=>window.__t.getProgram().map(c=>c.type+(c.closed?'✓':'')).join(','));
  const W=async fn=>{ const {page:p,ctx,errors}=await L.newPage(b,{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; } finally{ await ctx.close(); } };
  const finish=async(p,pre)=>{ await L.runAndWait(p); const ok=await L.overlayOpen(p,'#ovResult'); const t=ok?await p.evaluate(()=>document.querySelector('#resTitle').textContent):await L.bubble(p); return {ok:ok&&(pre?pre.ok:true),note:(pre?pre.note+' | ':'')+t}; };
  const fails=async(p,re)=>{ await L.runAndWait(p); const m=await L.bubble(p); return {ok:!(await L.overlayOpen(p,'#ovResult'))&&re.test(m),note:m}; };
  const STOP=[['Maka','Ambil lalu berhenti mencari']];
  await S.t('MA04','MA04: Untuk setiap [Jika isi rak sekarang = yang dicari → Ambil lalu berhenti] → menang',()=>W(async p=>{ await open(p,'ma04'); await tap(p,'untuk','jika'); await L.pickChoice(p,1,STOP); const ty=await types(p); return finish(p,{ok:ty==='untuk,jika,akhir',note:ty}); }));
  await S.t('MA04x','MA04: pilihan bawaan “Ambil (terus mencari)” → pesan “berhentilah mencari”',()=>W(async p=>{ await open(p,'ma04'); await tap(p,'untuk','jika'); return fails(p,/terus membuka/); }));
  await S.t('MA05','MA05: Selama belum ketemu [Buka tengah, Jika = → Ambil berhenti, Jika < → buang kiri selain itu kanan] → menang',()=>W(async p=>{ await open(p,'ma05'); await tap(p,'selama','buka','jika','jika');
    await L.pickChoice(p,2,[['Pembanding','='],...STOP]); await L.pickChoice(p,3,[['Selain itu','Buang separuh kanan']]); const ty=await types(p); return finish(p,{ok:ty==='selama,buka,jika,jika,akhir',note:ty}); }));
  await S.t('MA05x','MA05: Untuk setiap satu per satu → ditolak karena melebihi 3 buku',()=>W(async p=>{ await p.evaluate(()=>{}); await open(p,'ma05'); await p.evaluate(()=>document.querySelector('#diff').value); await p.select('#diff','medium'); await L.sleep(150); await tap(p,'untuk','jika'); await L.pickChoice(p,1,[['Pembanding','='],...STOP]); return fails(p,/hanya mengizinkan membuka 3 buku/); }));
  await S.t('MA06','MA06: Mesin [satu per satu] · Jika rak acak → Jalankan Mesin · Selama belum ketemu [buka tengah …] → menang',()=>W(async p=>{ await open(p,'ma06'); await tap(p,'mesin','untuk','jika'); await L.pickChoice(p,2,[['Pembanding','='],...STOP]); await close(p,3); await close(p,4);
    await tap(p,'jika','selama','buka','jika','jika'); await L.pickChoice(p,5,[['Jika','Rak ini acak (tidak terurut)?'],['Maka','Jalankan Mesin']]); await L.pickChoice(p,8,[['Pembanding','='],...STOP]); await L.pickChoice(p,9,[['Selain itu','Buang separuh kanan']]);
    const ty=await types(p); return finish(p,{ok:ty==='mesin,untuk,jika,akhir✓,akhir✓,jika,selama,buka,jika,jika,akhir',note:ty}); }));
  await S.t('MA07','MA07: Untuk setiap [Taruh di atas tumpukan] · Selama tumpukan berisi [Ambil dari atas] → menang',()=>W(async p=>{ await open(p,'ma07'); await tap(p,'untuk','tumpukMasuk'); await close(p,2); await tap(p,'selama','tumpukAmbil'); const ty=await types(p); return finish(p,{ok:ty==='untuk,tumpukMasuk,akhir✓,selama,tumpukAmbil,akhir',note:ty}); }));
  await S.t('MA08','MA08: Untuk setiap [Masuk antrean, Jika lonceng → Layani depan] · Selama antrean berisi [Layani depan] → menang',()=>W(async p=>{ await open(p,'ma08'); await tap(p,'untuk','antreMasuk','jika'); await L.pickChoice(p,2,[['Maka','Layani yang paling depan']]); await close(p,3);
    await tap(p,'selama','antreAmbil'); await L.pickChoice(p,4,[['Syarat','antrean masih berisi']]); const ty=await types(p); return finish(p,{ok:ty==='untuk,antreMasuk,jika,akhir✓,selama,antreAmbil,akhir',note:ty}); }));
  await S.t('MA08x','MA08: pakai tumpukan → pesan urutan dilayani salah',()=>W(async p=>{ await open(p,'ma08'); await tap(p,'untuk','tumpukMasuk','jika'); await close(p,3); return fails(p,/datang lebih dulu|Baru \d/); }));
  await S.t('MA09','MA09: Mesin [Kunjungi, Jika anak kiri → Mesin kiri, Jika anak kanan → Mesin kanan] · Jalankan di akar → menang; panel pohon tampil dengan nomor urut kunjungan',()=>W(async p=>{ await open(p,'ma09');
    const vis=await p.evaluate(()=>getComputedStyle(document.querySelector('#treeView')).display!=='none'&&document.querySelectorAll('#treeView .nd').length>=4);
    await tap(p,'mesin','kunjungi','jika','jika'); await L.pickChoice(p,3,[['Jika','Punya anak kanan?'],['Maka','Jalankan Mesin di anak kanan']]); await close(p,4); await tap(p,'pakai');
    const ty=await types(p); const r=await finish(p,{ok:vis&&ty==='mesin,kunjungi,jika,jika,akhir✓,pakai',note:`panel=${vis} ${ty}`}); return r; }));
  await S.t('MA09v','MA09: setelah dijalankan, setiap map di panel bertanda sudah dikunjungi',()=>W(async p=>{ await open(p,'ma09'); await tap(p,'mesin','kunjungi','jika','jika'); await L.pickChoice(p,3,[['Jika','Punya anak kanan?'],['Maka','Jalankan Mesin di anak kanan']]); await close(p,4); await tap(p,'pakai');
    await L.runAndWait(p); const r=await p.evaluate(()=>({n:document.querySelectorAll('#treeView .nd').length,seen:document.querySelectorAll('#treeView .nd.seen').length})); return {ok:r.n>0&&r.n===r.seen,note:JSON.stringify(r)}; }));
  await S.t('MA10','MA10: Mesin [Kunjungi, Jika map = dicari → Ambil berhenti, Jika map < dicari → Mesin kanan selain itu kiri] · Jalankan di akar → menang',()=>W(async p=>{ await open(p,'ma10'); await tap(p,'mesin','kunjungi','jika','jika');
    await L.pickChoice(p,2,STOP); await L.pickChoice(p,3,[['Pembanding','<'],['Maka','Jalankan Mesin di anak kanan'],['Selain itu','Jalankan Mesin di anak kiri']]); await close(p,4); await tap(p,'pakai');
    const ty=await types(p); return finish(p,{ok:ty==='mesin,kunjungi,jika,jika,akhir✓,pakai',note:ty}); }));
  await S.t('TV0','Panel pohon tersembunyi di tahap bukan pohon (MA08)',()=>W(async p=>{ await open(p,'ma09'); await open(p,'ma08'); const d=await p.evaluate(()=>getComputedStyle(document.querySelector('#treeView')).display); return {ok:d==='none',note:d}; }));
  await S.t('LOCK','Profil baru: MA04 terkunci sampai MA03 selesai',async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true}); try{ await p.click('#btnMenu'); await L.sleep(100); const why=await p.evaluate(()=>(document.querySelector('.stage-item[data-id="ma04"] small')||{}).textContent||''); return {ok:/MA03/.test(why),note:why}; } finally{ await ctx.close(); } });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
