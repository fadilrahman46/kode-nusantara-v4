// T2 — Fungsional lewat UI sungguhan (mouse + keyboard), desktop 1280×720.
const L=require('./lib'); const EV=__dirname+'/evidence/';
(async()=>{
  let b=await L.launch(); const S=L.suite('t2_ui_desktop');
  // browser baru per skenario: GPU perangkat lunak di mesin uji macet bila banyak konteks WebGL dalam satu browser
  const fresh=async(o={})=>{ await b.close().catch(()=>{}); b=await L.launch(); return L.newPage(b,o); };
  const stars=p=>p.evaluate(()=>document.querySelector('#resStars').getAttribute('aria-label'));
  const detail=p=>p.evaluate(()=>document.querySelector('#resDetail').textContent);
  const hintLabels=async p=>{ await p.click('#btnHint'); await L.sleep(60); return p.evaluate(()=>[...document.querySelectorAll('#hintActions button')].map(b=>b.textContent)); };
  const hintClick=async(p,i)=>{ await p.evaluate(i=>document.querySelectorAll('#hintActions button')[i].click(),i); await L.sleep(40); };
  const addTap=async(p,idx,n=1)=>{ for(let i=0;i<n;i++){ const r=await L.rect(p,'#palette .card',idx); await p.mouse.click(r.cx,r.cy); await L.sleep(40);} };
  const b8solve=async p=>{ await addTap(p,0); await addTap(p,1,2); await L.pickChoice(p,0,[['Isi dengan','3']]); await L.pickChoice(p,1,[['Operasi','×'],['Angka','4']]); await L.pickChoice(p,2,[['Operasi','+'],['Angka','2']]); };

  // ---------- P0 ----------
  let c=await fresh(); let p=c.page;
  await S.t('U01','Memuat: tidak ada error konsol; WebGL aktif; menggambar > 0 draw call',async()=>{ const i=await p.evaluate(()=>({calls:__r.info.render.calls,gl:!!__r.getContext()})); return {ok:c.errors.length===0&&i.gl&&i.calls>0,note:`draw calls=${i.calls}; error=${c.errors.join('|')}`}; });
  await S.t('U02','P0: bubble pengantar tampil dan kartu Maju berdenyut (menuntun pemain)',async()=>{ const t=await L.bubble(p); const pulse=await p.evaluate(()=>document.querySelector('#palette .card').classList.contains('pulse')); return t.includes('Dermaga gelap')&&pulse; });
  await L.dragPaletteToBoard(p,0);
  await S.t('U03','Seret kartu dari palet ke papan → 1 kartu; tutorial lanjut; tombol Jalankan berdenyut',async()=>{ const n=(await L.boardCards(p)).length; const t=await L.bubble(p); const pr=await p.evaluate(()=>document.querySelector('#btnRun').classList.contains('pulse')); return {ok:n===1&&t.includes('Bagus')&&pr,note:`kartu=${n}`}; });
  await L.runAndWait(p);
  await S.t('U04','Jalankan 1 kartu → pesan "Masih kurang 3 petak" (tutorial petunjuk jelas)',async()=>{ const t=await L.bubble(p); return {ok:t.includes('kurang 3 petak'),note:t}; });
  for(let i=0;i<3;i++) await L.dragPaletteToBoard(p,0,i+1);
  await L.runAndWait(p);
  await S.t('U05','P0: 4 kartu Maju → lampu menyala, hasil muncul, 3 bintang (2 kali jalankan)',async()=>{ const o=await L.overlayOpen(p,'#ovResult'); const s=await stars(p); return {ok:o&&s==='3 dari 3 bintang',note:s+' | '+await detail(p)}; });
  await p.screenshot({path:EV+'ui_p0_hasil.png'});
  await S.t('U24','Teks hasil menyebut jumlah percobaan SEBENARNYA (bukan batas ★)',async()=>{ const runs=await p.evaluate(()=>window.__t.getLogs().slice(-1)[0].runs); const d=await detail(p); return {ok:new RegExp('dalam '+runs+' kali').test(d),note:`runs sebenarnya=${runs}; teks="${d}"`}; });
  await S.t('U18a','"Lihat versi kode" P0 = 4 × maju()',async()=>{ await p.click('#resCode'); const t=await p.evaluate(()=>document.querySelector('#resCodeBox').textContent); return {ok:t==='maju()\nmaju()\nmaju()\nmaju()',note:JSON.stringify(t)}; });
  await S.t('U17a','Tombol "Coba lagi" tersembunyi saat 3 bintang',()=>p.evaluate(()=>document.querySelector('#resRetry').hidden));
  await S.t('U19a','Overlay hasil TIDAK tertutup oleh Esc (pemain harus memilih)',async()=>{ await p.keyboard.press('Escape'); return L.overlayOpen(p,'#ovResult'); });
  await c.ctx.close().catch(()=>{});

  // ---------- P0: kartu berlebih ----------
  c=await fresh(); p=c.page; await addTap(p,0,5);
  await L.runAndWait(p);
  await S.t('U06a','5 kartu Maju → Bit menabrak tong; pesan jelas; kartu penyebab berkedip merah; tong sampah berdenyut',async()=>{ const t=await L.bubble(p); const err=await p.evaluate(()=>[...document.querySelectorAll('#boardList .card')].findIndex(c=>c.classList.contains('error'))); const tr=await p.evaluate(()=>document.querySelector('#trash').classList.contains('pulse')); return {ok:err===4&&tr&&/Kebanyakan/.test(t),note:`indeks kartu error=${err}; ${t}`}; });
  await p.screenshot({path:EV+'ui_p0_kelebihan.png'});
  { const cr=await L.rect(p,'#boardList .card',4), tr=await L.rect(p,'#trash'); await L.mouseDrag(p,{x:cr.cx,y:cr.cy},{x:tr.cx,y:tr.cy}); }
  await S.t('U06b','Seret kartu ke tempat sampah → kartu terhapus (4 tersisa)',async()=>({ok:(await L.boardCards(p)).length===4}));
  await L.runAndWait(p);
  await S.t('U06c','Setelah buang kartu berlebih → berhasil',()=>L.overlayOpen(p,'#ovResult'));
  await c.ctx.close().catch(()=>{});

  // ---------- Batas papan, tap-add ----------
  c=await fresh(); p=c.page; await addTap(p,0,8);
  await S.t('U08a','Tap kartu palet 8× → 8 kartu (batas p0)',async()=>({ok:(await L.boardCards(p)).length===8}));
  await addTap(p,0,1);
  await S.t('U08b','Kartu ke-9 ditolak + toast "Papan penuh"',async()=>{ const t=await p.evaluate(()=>({n:document.querySelectorAll('#boardList .card').length,toast:document.querySelector('#toast').hidden?'':document.querySelector('#toast').textContent})); return {ok:t.n===8&&/penuh/.test(t.toast),note:JSON.stringify(t)}; });
  await S.t('U08c','Label papan menampilkan "8/8 kartu"',async()=>({ok:(await p.evaluate(()=>document.querySelector('#boardLabel').textContent)).includes('8/8')}));
  await c.ctx.close().catch(()=>{});

  // ---------- B7 ----------
  c=await fresh(); p=c.page; await L.openStage(p,1);
  await S.t('U09a','b7: ganti stage via menu → judul "Kotak Berbentuk"',async()=>({ok:(await p.evaluate(()=>document.querySelector('#stageTitle').textContent)).includes('Kotak Berbentuk')}));
  await p.screenshot({path:EV+'ui_b7_awal.png'});
  await addTap(p,0);
  await L.pickChoice(p,0,[['Kotak','jumlah ikan'],['Isi dengan','“lima”']]);
  await S.t('U10','Picker memperbarui teks kartu di papan',async()=>{ const t=(await L.boardCards(p))[0]; return {ok:/jumlah ikan/.test(t)&&/lima/.test(t),note:t}; });
  await L.runAndWait(p);
  await S.t('U09b','b7: teks ke kotak angka → "Tidak muat!"; kartu berkedip merah; Bit bereaksi',async()=>{ const t=await L.bubble(p); const e=await p.evaluate(()=>!!document.querySelector('#boardList .card.error')); return {ok:/Tidak muat/.test(t)&&e,note:t}; });
  await p.screenshot({path:EV+'ui_b7_tidak_muat.png'});
  await L.pickChoice(p,0,[['Isi dengan','5']]);
  await addTap(p,0,2);
  await L.pickChoice(p,1,[['Kotak','nama perahu'],['Isi dengan','“Kenari”']]);
  await L.pickChoice(p,2,[['Kotak','lampu mercusuar'],['Isi dengan','⏻ nyala']]);
  await S.t('U07','Seret-susun ulang: kartu pertama dipindah ke bawah → urutan berubah',async()=>{ const before=await L.boardCards(p); const a=await L.rect(p,'#boardList .card',0), z=await L.rect(p,'#boardList li',2); await L.mouseDrag(p,{x:a.cx,y:a.cy},{x:z.cx,y:z.y+z.h-2}); const after=await L.boardCards(p); return {ok:after[2]===before[0]&&after[0]===before[1],note:'sebelum: '+before.map(x=>x.slice(8,30)).join(' / ')+' → sesudah: '+after.map(x=>x.slice(8,30)).join(' / ')}; });
  await L.runAndWait(p);
  await S.t('U10b','b7: 3 kartu benar → berhasil; 3★ (2 kali jalankan, tanpa hint)',async()=>{ const s=await stars(p); return {ok:s==='3 dari 3 bintang',note:s}; });
  await S.t('U18b','"Lihat versi kode" b7 benar',async()=>{ await p.click('#resCode'); const t=await p.evaluate(()=>document.querySelector('#resCodeBox').textContent); return {ok:/jumlah_ikan = 5/.test(t)&&/nama_perahu = "Kenari"/.test(t)&&/lampu_mercusuar = nyala/.test(t),note:JSON.stringify(t)}; });
  await p.screenshot({path:EV+'ui_b7_hasil.png'});
  await c.ctx.close().catch(()=>{});

  // ---------- B8 + hint + skor ----------
  c=await fresh(); p=c.page; await L.openStage(p,2);
  await addTap(p,0); await addTap(p,1);
  await L.pickChoice(p,1,[['Operasi','÷'],['Angka','2']]); await L.pickChoice(p,0,[['Isi dengan','3']]);
  await L.runAndWait(p);
  await S.t('U11a','b8: 3 ÷ 2 → ditolak "tidak bisa dibagi rata"',async()=>{ const t=await L.bubble(p); return {ok:/dibagi rata/.test(t),note:t}; });
  await L.pickChoice(p,1,[['Operasi','×'],['Angka','4']]); await addTap(p,1); await L.pickChoice(p,2,[['Operasi','+'],['Angka','2']]);
  await L.runAndWait(p);
  await S.t('U11b','b8: 3 × 4 + 2 = 14 → berhasil',()=>L.overlayOpen(p,'#ovResult'));
  await S.t('U18c','"Lihat versi kode" b8 = berat = 3 / berat = berat * 4 / berat = berat + 2',async()=>{ await p.click('#resCode'); const t=await p.evaluate(()=>document.querySelector('#resCodeBox').textContent); return {ok:t==='berat = 3\nberat = berat * 4\nberat = berat + 2',note:JSON.stringify(t)}; });
  await c.ctx.close().catch(()=>{});

  // hint Easy
  c=await fresh(); p=c.page; await L.openStage(p,2);
  await S.t('U12a','Easy: urutan hint = 1 gratis → 2 gratis → 3 (−10%)',async()=>{ const a=await hintLabels(p); await hintClick(p,0); const bb=await hintLabels(p); await hintClick(p,0); const cc=await hintLabels(p); return {ok:a[0]==='Petunjuk 1 (gratis)'&&bb[0]==='Petunjuk 2 (gratis)'&&cc[0].includes('Petunjuk 3')&&cc[0].includes('−10%'),note:[a,bb,cc].map(x=>x.join('/')).join(' → ')}; });
  await hintClick(p,0);
  S.info('U12b','Teks hint 3 B10 yang tampil (kini parsial: kartu pertama saja)',await L.bubble(p));
  await b8solve(p); await L.runAndWait(p);
  await S.t('U12c','Easy + hint 3 dipakai + 1 kali jalankan → 2★, skor 60 (=100×1×2/3×0,9)',async()=>{ const s=await stars(p), d=await detail(p); return {ok:s==='2 dari 3 bintang'&&/Skor 60\b/.test(d),note:s+' | '+d}; });
  await S.t('U17b','Tombol "Coba lagi" tampil saat <3★ dan mempertahankan program',async()=>{ const vis=await p.evaluate(()=>!document.querySelector('#resRetry').hidden); await p.click('#resRetry'); await L.sleep(300); const n=(await L.boardCards(p)).length; return {ok:vis&&n===3&&!(await L.overlayOpen(p,'#ovResult')),note:'kartu setelah retry='+n}; });
  await c.ctx.close().catch(()=>{});

  // hint Medium & Hard
  c=await fresh(); p=c.page; await L.openStage(p,2); await p.select('#diff','medium'); await L.sleep(250);
  await S.t('U13a','Medium: hint 2 berbiaya −10%',async()=>{ await hintLabels(p); await hintClick(p,0); const l=await hintLabels(p); return {ok:l[0].includes('Petunjuk 2')&&l[0].includes('−10%'),note:l.join('/')}; });
  await c.ctx.close().catch(()=>{});
  c=await fresh(); p=c.page; await L.openStage(p,2); await p.select('#diff','hard'); await L.sleep(250);
  await S.t('U13b','Hard: hint 2 = −15% dan hint 3 TIDAK tersedia',async()=>{ await hintLabels(p); await hintClick(p,0); const l=await hintLabels(p); await hintClick(p,0); const after=await p.evaluate(()=>({n:document.querySelectorAll('#hintActions button').length,t:document.querySelector('#bubbleText').textContent})); const l2=await hintLabels(p); return {ok:l[0].includes('−15%')&&l2.length===0,note:l.join('/')+' | setelah hint 2: tombol='+l2.length}; });
  await c.ctx.close().catch(()=>{});

  // Hard + Langkah
  c=await fresh(); p=c.page; await L.openStage(p,2); await p.select('#diff','hard'); await L.sleep(250); await b8solve(p);
  let opened=[]; for(let i=0;i<4;i++){ if(await L.overlayOpen(p,'#ovResult')){ opened.push(true); continue; } await p.click('#btnStep'); await L.sleep(120); await L.waitIdle(p); await L.sleep(1900); opened.push(await L.overlayOpen(p,'#ovResult')); }
  await S.t('U14a','Langkah: hasil langsung dinilai begitu KARTU TERAKHIR selesai (3 kartu → hasil setelah langkah ke-3)',async()=>({ok:opened[2]===true,note:'overlay terbuka setelah langkah 1–4: '+opened.join(',')}));
  await S.t('U14b','Sulit + Langkah → pengali ×1,25; 3★ (1 kali jalankan) → skor 125',async()=>{ const d=await detail(p), s=await stars(p); return {ok:/1,25/.test(d)&&/Skor 125\b/.test(d)&&s==='3 dari 3 bintang',note:s+' | '+d}; });
  await c.ctx.close().catch(()=>{});
  c=await fresh(); p=c.page; await L.openStage(p,2); await p.select('#diff','hard'); await L.sleep(250); await b8solve(p); await L.runAndWait(p);
  await S.t('U15','Sulit tanpa Langkah, benar sekali jalan → 3★, skor 150 (pengali sementara ×1,5, F13)',async()=>{ const d=await detail(p), s=await stars(p); return {ok:/Skor 150\b/.test(d)&&s==='3 dari 3 bintang',note:d}; });
  await c.ctx.close().catch(()=>{});

  // ganti kesulitan membuang kartu
  c=await fresh(); p=c.page; await L.openStage(p,2); await p.select('#diff','hard'); await L.sleep(250); await addTap(p,2); await addTap(p,0);
  const before=(await L.boardCards(p)).length; await p.select('#diff','easy'); await L.sleep(300); const after=(await L.boardCards(p)).length;
  await S.t('U16','Ganti kesulitan yang membuang kartu → pemain diberi tahu (toast/pesan)',async()=>{ const toast=await p.evaluate(()=>document.querySelector('#toast').hidden?'':document.querySelector('#toast').textContent); const bub=await L.bubble(p); return {ok:before===2&&after===1&&(/dibuang|dihapus/.test(toast)||/dibuang|dihapus/.test(bub)),note:`${before} → ${after} kartu; toast="${toast}"`}; });
  await c.ctx.close().catch(()=>{});

  // overlay & keyboard
  c=await fresh(); p=c.page; await p.click('#btnMenu'); await L.sleep(80); await p.keyboard.press('Escape');
  await S.t('U19b','Esc menutup menu stage',async()=>!(await L.overlayOpen(p,'#ovMenu')));
  await L.openStage(p,1);
  await p.focus('#palette .card'); await p.keyboard.press('Enter'); await L.sleep(60);
  await S.t('U20a','Keyboard: Enter pada kartu palet menambah kartu',async()=>({ok:(await L.boardCards(p)).length===1}));
  await p.focus('#boardList .card'); await p.keyboard.press('Enter'); await L.sleep(80);
  await S.t('U20b','Keyboard: Enter pada kartu papan membuka pemilih',()=>L.overlayOpen(p,'#ovPick'));
  await p.keyboard.press('Escape'); await L.sleep(50);
  await p.focus('#boardList .card'); await p.keyboard.press('Delete'); await L.sleep(60);
  await S.t('U20c','Keyboard: Delete menghapus kartu',async()=>({ok:(await L.boardCards(p)).length===0}));
  await S.t('U20d','Fokus keyboard terlihat (outline ≥ 2px) pada kartu',async()=>{ await p.focus('#palette .card'); const o=await p.evaluate(()=>{const s=getComputedStyle(document.querySelector('#palette .card'));return {w:s.outlineWidth,st:s.outlineStyle};}); return {ok:parseFloat(o.w)>=2&&o.st!=='none',note:JSON.stringify(o)}; });
  await c.ctx.close().catch(()=>{});

  // kecepatan
  c=await fresh(); p=c.page; await addTap(p,0,4);
  const timeRun=async()=>{ const t0=Date.now(); await p.click('#btnRun'); await L.sleep(100); await L.waitIdle(p); return Date.now()-t0; };
  const t1=await timeRun(); await c.ctx.close().catch(()=>{});
  c=await fresh(); p=c.page; await p.click('#btnSpeed'); await addTap(p,0,4); const t2=await timeRun();
  await S.t('U23','Tombol 🐇 mempercepat animasi (4 kartu)',async()=>({ok:t2<t1*0.7,note:`normal=${t1}ms, cepat=${t2}ms`}));
  await c.ctx.close().catch(()=>{});

  // log: kebisingan saat ganti kesulitan tanpa bermain
  c=await fresh(); p=c.page; for(const d of ['medium','hard','easy']){ await p.select('#diff',d); await L.sleep(200); }
  await S.t('U21','Ganti kesulitan 3× tanpa bermain → TIDAK menambah entri catatan uji',async()=>{ const n=await p.evaluate(()=>window.__t.getLogs().length); return {ok:n===0,note:`entri catatan = ${n} (semua runs=0)`}; });
  await c.ctx.close().catch(()=>{});

  // race: Ulang lalu Jalankan saat animasi berjalan
  c=await fresh(); p=c.page; await addTap(p,0,4);
  await p.click('#btnRun'); await L.sleep(150); await p.click('#btnReset'); await L.sleep(40); await p.click('#btnRun'); await L.sleep(450);
  const st=await p.evaluate(()=>({running:window.__t.getRunning(),runDis:document.querySelector('#btnRun').disabled,stepDis:document.querySelector('#btnStep').disabled,hintDis:document.querySelector('#btnHint').disabled}));
  await S.t('U22','Ulang→Jalankan cepat: selama proses berjalan tombol tetap nonaktif dan status "running" benar',async()=>({ok:st.running&&st.runDis&&st.stepDis,note:JSON.stringify(st)}));
  await L.sleep(3500); await c.ctx.close().catch(()=>{});

  // klik ganda Jalankan
  c=await fresh(); p=c.page; await addTap(p,0,4); await p.click('#btnRun',{count:2,delay:30}); await L.sleep(200); await L.waitIdle(p);
  await S.t('U25','Klik ganda cepat ▶ Jalankan → hanya 1 eksekusi tercatat',async()=>{ const n=await p.evaluate(()=>window.__t.getLogs().slice(-1)[0]?.runs); return {ok:n===1,note:'runs='+n}; });
  await c.ctx.close().catch(()=>{});

  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
