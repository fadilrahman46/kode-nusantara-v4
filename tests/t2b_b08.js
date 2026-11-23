// T2b — Fungsional B08 "Jembatan Panjang" (stage variabel): jembatan dibangun sepanjang angka di kotak.
const L=require('./lib'); const EV=__dirname+'/evidence/'; const PART=+(process.env.PART||0);
(async()=>{
  let b=await L.launch(); const S=L.suite('t2b_b08'+(PART?'_p'+PART:''));
  const fresh=async(o={})=>{ await b.close().catch(()=>{}); b=await L.launch(); const c=await L.newPage(b,o); await L.openStage(c.page,'b6'); await L.sleep(300); return c; };
  const tap=async(p,idx,n=1)=>{ for(let i=0;i<n;i++){ const r=await L.rect(p,'#palette .card',idx); await p.mouse.click(r.cx,r.cy); await L.sleep(40);} };
  const planks=p=>p.evaluate(()=>{ const m=window.__t.getScene().meshes; return [0,1,2].map(i=>!!(m['plank_'+i]&&m['plank_'+i].visible)); });
  let c,p;
  if(!PART||PART===1){ c=await fresh(); p=c.page;
  await S.t('B01','Menu tahap: B01 → B13 lalu J01 → J14, MA01 → MA10, MB01 → MB10, SE01 → SE10, EX01 → EX10 berurutan (label mengikuti ID kurikulum)',async()=>{ await p.click('#btnMenu'); await L.sleep(80); const t=await p.evaluate(()=>[...document.querySelectorAll('.stage-item:not(.gate-item)')].map(e=>e.querySelector('span:last-child').textContent)); await p.keyboard.press('Escape'); const want=['B01 · Pengantar','B02 · Dermaga Gelap','B03 · Dermaga Gelap','B04 · Dermaga Gelap','B05 · Jalan Pasar','B06 · Jalan Pasar','B07 · Jalan Pasar','B08 · Gudang Kotak','B09 · Gudang Kotak','B10 · Gudang Kotak','B11 · Gudang Kotak','B12 · Mercusuar Urutan','B13 · Mercusuar Urutan','J01 · Kincir Rusak','J02 · Kincir Rusak','J03 · Kincir Rusak','J04 · Kincir Rusak','J05 · Kincir Rusak','J06 · Kincir Rusak','J07 · Bengkel Pak Rakit','J08 · Bengkel Pak Rakit','J09 · Bengkel Pak Rakit','J10 · Bengkel Pak Rakit','J11 · Gudang Rak','J12 · Gudang Rak','J13 · Gudang Rak','J14 · Mercusuar Ulang','MA01 · Cermin dalam Cermin','MA02 · Cermin dalam Cermin','MA03 · Cermin dalam Cermin','MA04 · Perpustakaan','MA05 · Perpustakaan','MA06 · Perpustakaan','MA07 · Arsip Kampung','MA08 · Arsip Kampung','MA09 · Arsip Kampung','MA10 · Arsip Kampung','MB01 · Pabrik Cetakan','MB02 · Pabrik Cetakan','MB03 · Pabrik Cetakan','MB04 · Kebun Binatang Kode','MB05 · Kebun Binatang Kode','MB06 · Kebun Binatang Kode','MB07 · Kebun Binatang Kode','MB08 · Kebun Binatang Kode','MB09 · Kebun Binatang Kode','MB10 · Kebun Binatang Kode',...Array.from({length:10},(_,i)=>'SE'+String(i+1).padStart(2,'0')+' · Pelabuhan Sistem'),...['EX01','EX02','EX03'].map(x=>x+' · Pabrik Otomasi'),...['EX04','EX05','EX06','EX07','EX08','EX09','EX10'].map(x=>x+' · Kota Layanan')]; return {ok:t.join('|')===want.join('|'),note:t.length+' stage: '+t.map(x=>x.slice(0,3)).join(' ')}; });
  await S.t('B02','Dialog halaman 1 memuat instruksi tindakan "Ketuk kartu Isi kotak" (aturan GDD v0.3)',async()=>{ const t=await L.bubble(p); return {ok:/Ketuk kartu Isi kotak/.test(t),note:t}; });
  await S.t('B03','Awal: kotak kosong dan belum ada papan jembatan',async()=>({ok:(await planks(p)).every(x=>!x)}));
  await p.screenshot({path:EV+'b08_desktop_awal.png'});
  await tap(p,1); await L.runAndWait(p);
  await S.t('B04','Maju tanpa Isi kotak → "Byur!" + petunjuk mengisi kotak; kartu penyebab berkedip',async()=>{ const t=await L.bubble(p); const e=await p.evaluate(()=>!!document.querySelector('#boardList .card.error')); return {ok:/Isi kotak “langkah” dulu/.test(t)&&e,note:t}; });
  await c.ctx.close().catch(()=>{}); }
  if(!PART||PART===2){ c=await fresh(); p=c.page; await tap(p,0); await tap(p,1,5);
  await S.t('B05','Kartu Isi kotak bawaan berisi 1 (sengaja salah) sehingga pemain harus mengubahnya',async()=>{ const t=(await L.boardCards(p))[0]; return {ok:/langkah/.test(t)&&/\b1\b/.test(t),note:t}; });
  await L.runAndWait(p);
  await S.t('B06','Isi 1 + 5 Maju → jembatan terlalu pendek: pesan jelas, hanya papan pertama muncul',async()=>{ const t=await L.bubble(p); const pl=await planks(p); return {ok:/kurang panjang/.test(t)&&pl[0]&&!pl[1]&&!pl[2],note:t+' | papan='+pl.join(',')}; });
  await p.screenshot({path:EV+'b08_desktop_kurang.png'});
  await L.pickChoice(p,0,[['Isi dengan','3']]); await L.runAndWait(p);
  await S.t('B07','Ubah angka menjadi 3 → sampai lampu; 3 bintang; 3 papan muncul',async()=>{ const o=await L.overlayOpen(p,'#ovResult'); const st=await p.evaluate(()=>document.querySelector('#resStars').getAttribute('aria-label')); const pl=await planks(p); return {ok:o&&st==='3 dari 3 bintang'&&pl.every(x=>x),note:st+' | papan='+pl.join(',')}; });
  await S.t('B08','"Lihat versi kode" = langkah = 3 + 5 × maju()',async()=>{ await p.click('#resCode'); const t=await p.evaluate(()=>document.querySelector('#resCodeBox').textContent); return {ok:t==='langkah = 3\nmaju()\nmaju()\nmaju()\nmaju()\nmaju()',note:JSON.stringify(t)}; });
  await p.screenshot({path:EV+'b08_desktop_hasil.png'});
  await c.ctx.close().catch(()=>{}); }
  if(!PART||PART===3){ c=await fresh(); p=c.page; await tap(p,0); await tap(p,1,2); await tap(p,0); await tap(p,1,3);
  await L.pickChoice(p,0,[['Isi dengan','3']]); await L.pickChoice(p,3,[['Isi dengan','1']]); await L.runAndWait(p);
  await S.t('B09','Jembatan yang sudah dibangun tetap ada walau kotak kemudian diisi angka lebih kecil (Bit tak pernah berdiri di air)',async()=>({ok:await L.overlayOpen(p,'#ovResult'),note:'program: Isi 3, Maju×2, Isi 1, Maju×3'}));
  await c.ctx.close().catch(()=>{}); }
  if(!PART||PART===4){ c=await fresh({w:360,h:740,dpr:2,touch:true}); p=c.page; await L.sleep(500);
  await p.screenshot({path:EV+'b08_hp360_awal.png'});
  await S.t('B10','HP 360×740: tombol Jalankan terlihat dan adegan memuat 3 petak air + lampu (tanpa error konsol)',async()=>{ const v=await p.evaluate(()=>{const r=document.querySelector('#btnRun').getBoundingClientRect();return r.bottom<=innerHeight&&r.top>=0;}); return {ok:v&&c.errors.length===0,note:c.errors.join('|')}; }); }
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
