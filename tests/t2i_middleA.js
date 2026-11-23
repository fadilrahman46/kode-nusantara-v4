// T2i — Middle A MA01–MA03 lewat ANTARMUKA: rekursi dengan picker Jika masukan, Keluarkan rekursif, hasil Mesin.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2i_middleA');
  async function open(p,id){ await L.openStage(p,id); await p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); }); try{ await p.click('#bubbleClose'); }catch(e){} await L.sleep(100); }
  const tap=async(p,t)=>{ await p.click(`#palette .card[data-type="${t}"]`); await L.sleep(50); };
  const close=async(p,i)=>{ await p.evaluate(i=>document.querySelectorAll('#boardList .card')[i].scrollIntoView({block:'center'}),i); const r=await L.rect(p,'#boardList .card',i); await p.mouse.click(r.cx,r.cy); await L.sleep(80); };
  const types=p=>p.evaluate(()=>window.__t.getProgram().map(c=>c.type+(c.closed?'✓':'')).join(','));
  const W=async fn=>{ const {page:p,ctx,errors}=await L.newPage(b,{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; } finally{ await ctx.close(); } };
  const finish=async(p,pre)=>{ await L.runAndWait(p); const ok=await L.overlayOpen(p,'#ovResult'); const t=ok?await p.evaluate(()=>document.querySelector('#resTitle').textContent):await L.bubble(p); return {ok:ok&&(pre?pre.ok:true),note:(pre?pre.note+' | ':'')+t}; };
  await S.t('MA01','MA01: Mesin [Susun, Jika masukan > 1 → Jalankan Mesin(masukan − 1)] · Maju · Jalankan Mesin(7) · Atap → menang',()=>W(async p=>{ await open(p,'ma01');
    await tap(p,'mesin'); await tap(p,'susun'); await tap(p,'jika'); await L.pickChoice(p,2,[['Angka','1'],['Maka','Jalankan Mesin dengan masukan − 1']]); await close(p,3);
    for(const t of ['maju','pakai','atap']) await tap(p,t); await L.pickChoice(p,5,[['Masukan','7']]);
    const ty=await types(p); return finish(p,{ok:ty==='mesin,susun,jika,akhir✓,maju,pakai,atap',note:ty}); }));
  await S.t('MA01x','MA01: titik berhenti bawaan (masukan > 0) → menara 8 balok, pesan menyebut tinggi yang salah',()=>W(async p=>{ await open(p,'ma01');
    await tap(p,'mesin'); await tap(p,'susun'); await tap(p,'jika'); await L.pickChoice(p,2,[['Maka','Jalankan Mesin dengan masukan − 1']]); await close(p,3); for(const t of ['maju','pakai','atap']) await tap(p,t); await L.pickChoice(p,5,[['Masukan','7']]);
    await L.runAndWait(p); const m=await L.bubble(p); return {ok:!(await L.overlayOpen(p,'#ovResult'))&&/tingginya 8, seharusnya 7/.test(m),note:m}; }));
  await S.t('MA02','MA02: Mesin [Jika masukan = 0 → Keluarkan 0, Keluarkan masukan + hasil Mesin(masukan − 1)] · Isi total hasil Mesin(6) → menang',()=>W(async p=>{ await open(p,'ma02');
    await tap(p,'mesin'); await tap(p,'jika'); await L.pickChoice(p,1,[['Pembanding','='],['Angka','0'],['Maka','Keluarkan 0']]); await tap(p,'keluar'); await L.pickChoice(p,2,[['Operasi','masukan + hasil Mesin(masukan − 1)']]); await close(p,3);
    await tap(p,'isi'); await L.pickChoice(p,4,[['Isi dengan','hasil Mesin(6)']]); const txt=(await L.boardCards(p))[2].replace(/\s+/g,' ');
    return finish(p,{ok:/masukan \+ hasil Mesin\(masukan − 1\)/.test(txt),note:txt.slice(0,70)}); }));
  await S.t('MA03','MA03: Mesin [Maju, Ulangi masukan [Susun], Atap, Jika masukan > 1 → Mesin(masukan − 1)] · Jalankan Mesin(4) → menang',()=>W(async p=>{ await open(p,'ma03');
    for(const t of ['mesin','maju','ulangi','susun']) await tap(p,t); await close(p,4); await tap(p,'atap'); await tap(p,'jika'); await close(p,7); await tap(p,'pakai');
    await L.pickChoice(p,2,[['Berapa kali','masukan']]); await L.pickChoice(p,6,[['Angka','1'],['Maka','Jalankan Mesin dengan masukan − 1']]); await L.pickChoice(p,8,[['Masukan','4']]);
    const ty=await types(p); return finish(p,{ok:ty==='mesin,maju,ulangi,susun,akhir✓,atap,jika,akhir✓,pakai',note:ty}); }));
  await S.t('LOCK','Profil baru: MA01 terkunci sampai semua Junior selesai',async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true}); try{ await p.click('#btnMenu'); await L.sleep(100); const why=await p.evaluate(()=>(document.querySelector('.stage-item[data-id="ma01"] small')||{}).textContent||''); return {ok:/semua tahap Junior dulu \(kurang 14\)/.test(why),note:why}; } finally{ await ctx.close(); } });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
