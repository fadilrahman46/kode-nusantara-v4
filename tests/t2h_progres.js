// T2h — Progres pemain dan kunci tahap (#1), keadaan acak yang bisa diputar ulang + ekspor catatan (#2).
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2h_progres');
  const fast=p=>p.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); });
  const menu=async p=>{ await p.click('#btnMenu'); await L.sleep(80); return p.evaluate(()=>[...document.querySelectorAll('.stage-item')].map(e=>({id:e.dataset.id,locked:e.classList.contains('locked'),why:(e.querySelector('small')||{}).textContent||'',stars:(e.querySelector('em')||{}).textContent||''}))); };
  const closeMenu=p=>p.evaluate(()=>document.querySelector('#ovMenu [data-close]').click());
  const title=p=>p.evaluate(()=>document.querySelector('#stageMini').textContent);
  const winB01=async p=>{ try{ await p.click('#bubbleClose'); }catch(e){} await fast(p); for(let i=0;i<4;i++){ await p.click('#palette .card[data-type="maju"]'); await L.sleep(60); } await L.runAndWait(p); return L.overlayOpen(p,'#ovResult'); };
  // ---- #1 progres & kunci
  { const {page:p,ctx,errors}=await L.newPage(b,{locked:true});
    await S.t('P1','Profil baru: hanya B01 terbuka; B02 terkunci dengan alasan; J01 terkunci sampai semua Beginner selesai',async()=>{ const m=await menu(p); const g=id=>m.find(x=>x.id===id);
      return {ok:!g('p0').locked&&g('s02').locked&&/Selesaikan B01/.test(g('s02').why)&&g('j01').locked&&/semua tahap Beginner dulu \(kurang 13\)/.test(g('j01').why)&&m.filter(x=>!x.locked).length===1,note:`terbuka=${m.filter(x=>!x.locked).map(x=>x.id)} | J01: ${g('j01').why}`}; });
    await S.t('P2','Mengetuk tahap terkunci tidak membukanya dan menampilkan alasannya',async()=>{ const t0=await title(p); await p.evaluate(()=>document.querySelector('.stage-item[data-id="s05"]').click()); await L.sleep(120); const t1=await title(p), toast=await p.evaluate(()=>document.querySelector('#toast').textContent); await closeMenu(p); return {ok:t0===t1&&/Selesaikan/.test(toast),note:`${t0} → ${t1} | ${toast}`}; });
    await S.t('P3','Menang B01 → bintang tercatat, B02 terbuka, tombol hasil “Tahap berikutnya” membuka B02',async()=>{ const won=await winB01(p); const lbl=await p.evaluate(()=>document.querySelector('#resNext').textContent); await p.click('#resNext'); await L.sleep(300); const t=await title(p); const m=await menu(p); await closeMenu(p);
      const g=id=>m.find(x=>x.id===id); return {ok:won&&lbl==='Tahap berikutnya'&&t==='Tikungan'&&/★/.test(g('p0').stars)&&!g('s02').locked&&g('s03').locked,note:`hasil=${won} tombol=${lbl} sekarang=${t} B01=${g('p0').stars}`}; });
    await S.t('P4','Muat ulang halaman: progres tetap ada dan permainan lanjut di tahap terakhir (B02)',async()=>{ await p.reload({waitUntil:'load'}); await L.sleep(800); const t=await title(p); const m=await menu(p); await closeMenu(p); const g=id=>m.find(x=>x.id===id);
      return {ok:t==='Tikungan'&&!g('s02').locked&&/★/.test(g('p0').stars),note:`mulai di ${t}; B01=${g('p0').stars}`}; });
    await S.t('P5','Hapus progres butuh dua ketukan; sesudahnya B02 terkunci lagi',async()=>{ await p.click('#btnMenu'); await L.sleep(80); await p.click('#progClear'); await L.sleep(60); const armed=await p.evaluate(()=>document.querySelector('#progClear').textContent);
      const mid=await p.evaluate(()=>document.querySelector('.stage-item[data-id="s02"]').classList.contains('locked')); await p.click('#progClear'); await L.sleep(120); const after=await p.evaluate(()=>document.querySelector('.stage-item[data-id="s02"]').classList.contains('locked')); await closeMenu(p);
      return {ok:/Ketuk lagi/.test(armed)&&!mid&&after,note:`ketukan 1: “${armed}”, terkunci sesudah ketukan 2=${after}`}; });
    await S.t('P6','“Buka semua tahap (pengajar)” membuka semua dan tetap aktif setelah muat ulang',async()=>{ await p.click('#btnMenu'); await L.sleep(80); await p.click('#optOpenAll'); await L.sleep(100); const a=(await p.evaluate(()=>document.querySelectorAll('.stage-item.locked').length)); await closeMenu(p); await p.reload({waitUntil:'load'}); await L.sleep(600); const m=await menu(p); await closeMenu(p);
      return {ok:a===0&&m.every(x=>!x.locked),note:`terkunci sesudah centang=${a}, sesudah muat ulang=${m.filter(x=>x.locked).length}`}; });
    await S.t('P7','Tidak ada galat konsol selama alur progres',()=>({ok:errors.length===0,note:errors.join(' | ')}));
    await ctx.close(); }
  await S.t('P8','Penyimpanan diblokir: permainan tetap jalan dan B01 bisa dimenangkan (progres hanya di memori)',async()=>{ const {page:p,ctx,errors}=await L.newPage(b,{denyStorage:true}); try{ const won=await winB01(p); return {ok:won&&errors.length===0,note:`menang=${won} galat=${errors.length}`}; } finally{ await ctx.close(); } });
  // ---- #2 benih & catatan
  const seq=async(path)=>{ const {page:p,ctx}=await L.newPage(b,{path}); try{ return await p.evaluate(()=>{ const T=window.__t, st=T.STAGES.find(s=>s.id==='s07'), out=[]; for(let i=0;i<8;i++){ T.loadStage(st); out.push(T.getSeed()); } return out.join(''); }); } finally{ await ctx.close(); } };
  const a1=await seq('/?benih=424242'), a2=await seq('/?benih=424242'), a3=await seq('/?benih=777001');
  await S.t('R1','Benih sesi sama → urutan keadaan acak B07 (8 kemungkinan) sama persis; benih lain → urutan lain',()=>({ok:a1===a2&&a1!==a3&&new Set(a1).size>1,note:`424242: ${a1} · ulang: ${a2} · 777001: ${a3}`}));
  await S.t('R2','Tautan ulang ?tahap=s07&keadaan=5 membuka B07 di keadaan 5 walau tahapnya terkunci',async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true,path:'/?tahap=s07&keadaan=5&benih=1234'}); try{ await L.sleep(300); const r=await p.evaluate(()=>({t:document.querySelector('#stageMini').textContent,s:window.__t.getSeed()})); return {ok:r.t==='Pasar Ramai'&&r.s===5,note:JSON.stringify(r)}; } finally{ await ctx.close(); } });
  await S.t('R3','Catatan: tiap Jalankan dicatat dengan keadaan + tautan ulang; ekspor memuat versi, kode sesi, progres',async()=>{ const {page:p,ctx}=await L.newPage(b,{path:'/?tahap=s05&keadaan=0&benih=555555'}); try{ try{ await p.click('#bubbleClose'); }catch(e){} await fast(p);
      for(const t of ['maju','maju','tekan','maju','maju','maju']){ await p.click(`#palette .card[data-type="${t}"]`); await L.sleep(50); } await L.runAndWait(p); // menang di merah, gagal di biru → pindah ke keadaan 1
      await L.runAndWait(p); await L.openStage(p,'s02'); await p.click('#btnLog'); await L.sleep(150);
      const j=JSON.parse(await p.evaluate(()=>document.querySelector('#logText').value)); const e=j.catatan.find(x=>x.stage==='s05')||{}; const tr=e.jejak||[];
      return {ok:/^v\d+$/.test(j.versi)&&j.sesi===555555&&tr.length>=2&&tr[0].keadaan===0&&tr[1].keadaan===1&&/\?tahap=s05&keadaan=1&benih=555555/.test(tr[1].ulang)&&typeof j.progres==='object',note:JSON.stringify(tr.map(x=>({k:x.keadaan,ok:x.ok,u:x.ulang}))).slice(0,240)}; } finally{ await ctx.close(); } });
  await S.t('R4','Tombol Unduh .json membuat berkas bernama kode-nusantara-catatan-…-<sesi>.json berisi JSON yang sah',async()=>{ const {page:p,ctx}=await L.newPage(b,{path:'/?benih=246810'}); try{
      await p.evaluate(()=>{ window.__dl=null; const orig=HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click=function(){ if(this.download){ const a=this; fetch(a.href).then(r=>r.text()).then(t=>{ window.__dl={name:a.download,text:t}; }); return; } return orig.call(this); }; });
      await p.click('#btnLog'); await L.sleep(100); await p.click('#logDownload'); await L.sleep(400); const d=await p.evaluate(()=>window.__dl); let okJ=false; try{ okJ=JSON.parse(d.text).sesi===246810; }catch(e){}
      return {ok:!!d&&/^kode-nusantara-catatan-\d{8}-\d{4}-246810\.json$/.test(d.name)&&okJ,note:d?d.name:'tidak ada unduhan'}; } finally{ await ctx.close(); } });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
