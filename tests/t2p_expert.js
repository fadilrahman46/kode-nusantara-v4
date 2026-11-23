// T2p — Expert (EX01–EX03) lewat ANTARMUKA: menu, papan aturan, tabel detak, tombol 1×/4×/⏭, kemenangan, kegagalan, gerak berkurang, aria-live.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2p_expert');
  const W=async(fn,o)=>{ const {page:p,ctx,errors}=await L.newPage(b,o||{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; }catch(e){ return {ok:false,note:'EXC '+e.message.split('\n')[0]}; }finally{ await ctx.close(); } };
  const load=async(p,id)=>{ await p.evaluate(i=>window.__t.loadStage(window.__t.STAGES.find(s=>s.id===i)),id); await L.sleep(250); };
  const A=(a,b)=>({type:'aturan',ketika:a,maka:b});
  const REF={ex01:[A('pesananMasuk','kemas'),A('petiSiap','kirim'),A('petiTerkirim','beriTahu')],
    ex03:[A('komitBaru','jalankanUji'),A('ujiLulus','kemas'),A('petiSiap','kirimProduksi'),A('ujiGagal','beriTahuDev')]};
  const setP=(p,prog)=>p.evaluate(pr=>window.__t.setProgram(pr.map((c,i)=>({id:'q'+i,...c}))),prog);
  const view=p=>p.evaluate(()=>{ const e=document.querySelector('#sysView'); return {vis:getComputedStyle(e).display!=='none',rows:e.querySelectorAll('tbody tr').length,btns:[...e.querySelectorAll('[data-tick]')].map(x=>x.dataset.tick),txt:e.textContent.replace(/\s+/g,' ').trim(),live:(document.querySelector('#sysLive')||{}).textContent||''}; });
  await S.t('X1','Menu: tiga tahap EX tersedia dan berlabel “Pabrik Otomasi”; palet hanya kartu Aturan',()=>W(async p=>{
    const r=await p.evaluate(()=>{ const T=window.__t; return ['ex01','ex02','ex03'].map(id=>{ const s=T.STAGES.find(x=>x.id===id); return s&&s.code+'|'+s.palette.easy.join(); }); });
    return {ok:r.every(x=>x&&/Pabrik Otomasi\|aturan$/.test(x)),note:r.join(' ; ')}; }));
  await S.t('X2','EX01: papan kosong → Jalankan → kalah dengan pesan; dasbor menampilkan tabel detak',()=>W(async p=>{
    await load(p,'ex01'); await setP(p,[A('pesananMasuk','kirim')]); await L.runAndWait(p); await L.sleep(1500); const v=await view(p); const bb=await L.bubble(p);
    return {ok:v.vis&&v.rows>=1&&/(belum selesai dikemas|dikirim padahal)/.test(v.txt+bb),note:JSON.stringify({rows:v.rows,btns:v.btns,bb:bb.slice(0,120)})}; }));
  await S.t('X3','EX01: aturan acuan menang; tabel menampilkan detak, tombol 1×/4×/Lewati ada',()=>W(async p=>{
    await load(p,'ex01'); await setP(p,REF.ex01); await L.runAndWait(p); await L.sleep(300); const v0=await view(p);
    let ov=false; for(let i=0;i<40&&!ov;i++){ await L.sleep(500); ov=await L.overlayOpen(p,'#ovResult'); }
    return {ok:ov&&v0.btns.length>=2&&v0.rows>=1,note:JSON.stringify({ov,btns:v0.btns,rows:v0.rows})}; }));
  await S.t('X4','EX03: tombol ⏭ (lewati) menampilkan seluruh jejak sekaligus',()=>W(async p=>{
    await load(p,'ex03'); await setP(p,REF.ex03); await L.runAndWait(p); await L.sleep(300);
    const before=(await view(p)).rows; const skip=await p.evaluate(()=>{ const b=[...document.querySelectorAll('#sysView [data-tick]')].pop(); if(b) b.click(); return b?b.dataset.tick:null; }); await L.sleep(400); const after=await view(p);
    return {ok:!!skip&&after.rows>=before&&after.rows>=5,note:JSON.stringify({before,after:after.rows,skip})}; }));
  await S.t('X5','Gerak berkurang: hasil langsung tampil tanpa animasi (jendela 6 baris); aria-live berisi ringkasan',()=>W(async p=>{
    await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await load(p,'ex01'); await setP(p,REF.ex01); await L.runAndWait(p); await L.sleep(1200); const v=await view(p);
    return {ok:v.rows>=6&&v.live.length>5&&/10 dari 10/.test(v.live),note:JSON.stringify({rows:v.rows,live:v.live.slice(0,100)})}; }));
  await S.t('X6','Pindah tahap saat animasi berjalan menghentikan detak (tidak ada galat/sisa baris)',()=>W(async p=>{
    await load(p,'ex01'); await setP(p,REF.ex01); await L.runAndWait(p); await L.sleep(300); await load(p,'se01'); await L.sleep(1500); await load(p,'ex02'); const v=await view(p);
    return {ok:v.rows===0||/aturan/i.test(v.txt),note:JSON.stringify({rows:v.rows,txt:v.txt.slice(0,80)})}; }));
  await S.t('X7','HP 360×640: tabel dan tombol tidak melebihi lebar layar',()=>W(async p=>{
    await load(p,'ex02'); await setP(p,[A('pesananKecil','kemas')]); await L.runAndWait(p); await L.sleep(800);
    const m=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth,btn:[...document.querySelectorAll('#sysView .sy-btn')].map(b=>{const r=b.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})}));
    return {ok:m.sw<=m.iw+1&&m.btn.every(x=>x[1]>=44&&x[0]>=44),note:JSON.stringify(m)}; },{w:360,h:640}));
    await S.t('X8','EX04: picker memilih jumlah pekerja lewat ketukan; dasbor menampilkan biaya; menang dengan 2 pekerja + penyangga 24',()=>W(async p=>{
    await load(p,'ex04'); await setP(p,[{type:'pekerja',jumlah:2},{type:'penyangga',ukuran:24}]); await L.runAndWait(p);
    let ov=false; for(let i=0;i<40&&!ov;i++){ await L.sleep(500); ov=await L.overlayOpen(p,'#ovResult'); } const v=await view(p);
    return {ok:ov&&/Biaya 10 dari anggaran 11/.test(v.txt)&&v.btns.length>=2,note:JSON.stringify({ov,cost:(v.txt.match(/Biaya[^.]*/)||[''])[0],btns:v.btns})}; }));
  await S.t('X9','EX09: urutan kartu Coba dan Cadangan berpengaruh (dibalik → gagal, dasbor menyebut urutan)',()=>W(async p=>{
    await load(p,'ex09'); await setP(p,[{type:'cadangan'},{type:'coba',kali:2,jeda:2},{type:'pemutus',k:3}]); await L.runAndWait(p); await L.sleep(800); const bb=await L.bubble(p); const v=await view(p);
    return {ok:/Hanya \d+%/.test(bb)&&/cadangan → coba lagi/.test(v.txt),note:bb.slice(0,140)+' | '+(v.txt.match(/Urutan penanganan[^.]*/)||[''])[0]}; }));
  await S.t('X10','EX07: ketukan pada kartu Rak membuka picker dengan dua grup (kebijakan, ukuran)',()=>W(async p=>{
    await load(p,'ex07'); await p.evaluate(()=>window.__t.setProgram([{id:'r1',type:'rak',kebijakan:'fifo',ukuran:1}])); const r0=await L.rect(p,'#boardList .card',0); await p.mouse.click(r0.cx,r0.cy); await L.sleep(120);
    const g=await p.evaluate(()=>[...document.querySelectorAll('#pickBody .pick-group h3')].map(h=>h.textContent)); return {ok:g.length===2,note:g.join(' | ')}; }));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
