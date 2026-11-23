// T2g — Junior J07–J14 lewat ANTARMUKA: Mesin dengan isi bersarang, masukan, hasil Mesin, Rak, Untuk setiap, penutup.
// PART=1: J07 J08 J09 J10 | PART=2: J11 J12 J13 J14
const L=require('./lib'); const PART=+(process.env.PART||0);
(async()=>{
  const b=await L.launch(); const S=L.suite('t2g_junior2'+(PART?'_p'+PART:''));
  async function open(p,id,seed){ await L.openStage(p,id); if(seed!==undefined) await p.evaluate(s=>window.__t.showSeed(s),seed); await p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); }); try{ await p.click('#bubbleClose'); }catch(e){} await L.sleep(100); }
  const tap=async(p,t)=>{ await p.click(`#palette .card[data-type="${t}"]`); await L.sleep(50); };
  const close=async(p,i)=>{ const r=await L.rect(p,'#boardList .card',i); await p.mouse.click(r.cx,r.cy); await L.sleep(80); };
  const types=p=>p.evaluate(()=>window.__t.getProgram().map(c=>c.type+(c.closed?'✓':'')).join(','));
  const won=p=>L.overlayOpen(p,'#ovResult'); const title=p=>p.evaluate(()=>document.querySelector('#resTitle').textContent);
  const W=async fn=>{ const {page:p,ctx,errors}=await L.newPage(b,{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; } finally{ await ctx.close(); } };
  const finish=async(p,extra)=>{ await L.runAndWait(p); const ok=await won(p); return {ok:ok&&(extra?extra.ok:true),note:(extra?extra.note+' | ':'')+(ok?await title(p):await L.bubble(p))}; };
  if(!PART||PART===1){
    await S.t('J07','J07: Buat Mesin [Susun, Susun, Atap] → tutup → Maju/Jalankan Mesin ke tiga lahan → menang',()=>W(async p=>{ await open(p,'j07');
      for(const t of ['mesin','susun','susun','atap']) await tap(p,t); await close(p,4); for(const t of ['maju','pakai','maju','maju','pakai','maju','maju','maju','pakai']) await tap(p,t);
      const ty=await types(p); const cnt=await p.evaluate(()=>document.querySelector('#boardCount').textContent); return finish(p,{ok:ty.startsWith('mesin,susun,susun,atap,akhir✓,maju,pakai')&&cnt==='13/13',note:cnt}); }));
    await S.t('J08a','J08: Mesin [Ulangi masukan [Susun], Atap] dengan masukan 2, 4, 3 lewat picker → menang',()=>W(async p=>{ await open(p,'j08');
      for(const t of ['mesin','ulangi','susun']) await tap(p,t); await close(p,3); await tap(p,'atap'); await close(p,5);
      for(const t of ['maju','pakai','maju','maju','pakai','maju','maju','maju','pakai']) await tap(p,t);
      await L.pickChoice(p,1,[['Berapa kali','masukan']]); await L.pickChoice(p,7,[['Masukan','2']]); await L.pickChoice(p,10,[['Masukan','4']]); await L.pickChoice(p,14,[['Masukan','3']]);
      const ind=await p.evaluate(()=>[...document.querySelectorAll('#boardList li')].slice(0,6).map(l=>l.className||'-').join(' '));
      return finish(p,{ok:ind==='- in1 in2 in1 in1 -',note:'indentasi '+ind}); }));
    await S.t('J08b','J08: kode semu Mesin bermasukan berindentasi benar',()=>W(async p=>{ await open(p,'j08');
      for(const t of ['mesin','ulangi','susun']) await tap(p,t); await close(p,3); await tap(p,'atap'); await close(p,5); await tap(p,'pakai'); await L.pickChoice(p,1,[['Berapa kali','masukan']]); await L.pickChoice(p,6,[['Masukan','4']]);
      const t=await p.evaluate(()=>window.__t.pseudo()); return {ok:t==='fungsi mesin(masukan):\n    ulangi masukan kali:\n        susun_balok()\n    pasang_atap()\nmesin(4)',note:JSON.stringify(t)}; }));
    await S.t('J09','J09: Mesin [Keluarkan masukan × 4] lalu Isi kotak dengan hasil Mesin(2), (3), (5) → menang',()=>W(async p=>{ await open(p,'j09');
      await tap(p,'mesin'); await tap(p,'keluar'); await L.pickChoice(p,1,[['Operasi','masukan ×'],['Angka','4']]); await close(p,2);
      for(const [i,bx,v] of [[3,'bahan A','hasil Mesin(2)'],[4,'bahan B','hasil Mesin(3)'],[5,'bahan C','hasil Mesin(5)']]){ await tap(p,'isi'); await L.pickChoice(p,i,[['Kotak',bx],['Isi dengan',v]]); }
      return finish(p); }));
    for(const sd of [0,2]) await S.t('J10-v'+sd,`J10 (keadaan ${sd}): Mesin [Ulangi 3 [Susun], Atap] · Ulangi 5 [Maju, Jika tanda → Jalankan Mesin] → menang`,()=>W(async p=>{ await open(p,'j10',sd);
      for(const t of ['mesin','ulangi','susun']) await tap(p,t); await close(p,3); await tap(p,'atap'); await close(p,5); await tap(p,'ulangi'); await tap(p,'maju'); await tap(p,'jika');
      await L.pickChoice(p,1,[['Berapa kali','3']]); await L.pickChoice(p,6,[['Berapa kali','5']]); const ty=await types(p);
      return finish(p,{ok:ty==='mesin,ulangi,susun,akhir✓,atap,akhir✓,ulangi,maju,jika,akhir',note:ty}); }));
  }
  if(!PART||PART===2){
    await S.t('J11a','J11: Ambil dari rak nomor 2 lalu 4 → menang',()=>W(async p=>{ await open(p,'j11'); await tap(p,'ambilRak'); await tap(p,'ambilRak'); await L.pickChoice(p,0,[['Nomor rak','2']]); await L.pickChoice(p,1,[['Nomor rak','4']]); return finish(p); }));
    await S.t('J11b','J11: menghitung dari 1 (nomor 3 lalu 5) → gagal dengan pesan “dimulai dari 0”',()=>W(async p=>{ await open(p,'j11'); await tap(p,'ambilRak'); await tap(p,'ambilRak'); await L.pickChoice(p,0,[['Nomor rak','3']]); await L.pickChoice(p,1,[['Nomor rak','5']]); await L.runAndWait(p); const m=await L.bubble(p); return {ok:!(await won(p))&&/dimulai dari 0/.test(m),note:m}; }));
    for(const sd of [0,1,2,3]) await S.t('J12-v'+sd,`J12 (keadaan ${sd}): Untuk setiap [Jika rusak → Buang] → menang`,()=>W(async p=>{ await open(p,'j12',sd); await tap(p,'untuk'); await tap(p,'jika'); return finish(p); }));
    for(const sd of [0,2]) await S.t('J13-v'+sd,`J13 (keadaan ${sd}): Isi total 0 · Untuk setiap [Ubah total + isi rak sekarang] → menang`,()=>W(async p=>{ await open(p,'j13',sd); await tap(p,'isi'); await tap(p,'untuk'); await tap(p,'ubah');
      const txt=(await L.boardCards(p))[2]; return finish(p,{ok:/isi rak sekarang/.test(txt),note:txt.replace(/\s+/g,' ').slice(0,60)}); }));
    for(const sd of [0,3]) await S.t('J14-v'+sd,`J14 (keadaan ${sd}): minyak dengan Untuk setiap, jalan dengan Selama, Tekan tombol → menang`,()=>W(async p=>{ await open(p,'j14',sd);
      await tap(p,'isi'); await tap(p,'untuk'); await tap(p,'ubah'); await close(p,3); await tap(p,'selama'); await tap(p,'maju'); await close(p,6); await tap(p,'tekan');
      const ty=await types(p); return finish(p,{ok:ty==='isi,untuk,ubah,akhir✓,selama,maju,akhir✓,tekan',note:ty}); }));
    await S.t('J14x','J14: lupa Isi 0 → gagal di kartu Ubah dengan pesan kotak kosong',()=>W(async p=>{ await open(p,'j14',0); await tap(p,'untuk'); await tap(p,'ubah'); await L.runAndWait(p); const m=await L.bubble(p); return {ok:!(await won(p))&&/masih kosong/.test(m),note:m}; }));
  }
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
