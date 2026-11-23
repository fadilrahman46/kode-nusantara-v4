// T2o — Senior lewat ANTARMUKA: menu dan kunci, memainkan SE02 dan SE03 dengan ketukan, picker, dasbor Papan Sistem, tampilan HP/desktop/gelap.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2o_senior');
  const W=async(fn,o)=>{ const {page:p,ctx,errors}=await L.newPage(b,o||{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; }catch(e){ return {ok:false,note:'EXC '+e.message.split('\n')[0]}; }finally{ await ctx.close(); } };
  const markUpTo=(p,id)=>p.evaluate(id=>{ const T=window.__t; const k=T.STAGES.findIndex(x=>x.id===id); for(let i=0;i<=k;i++) T.markWin(T.STAGES[i].id,3); },id);
  const load=async(p,id)=>{ await p.evaluate(i=>window.__t.loadStage(window.__t.STAGES.find(s=>s.id===i)),id); await L.sleep(250); };
  const dash=p=>p.evaluate(()=>{ const e=document.querySelector('#sysView'); return {vis:getComputedStyle(e).display!=='none',txt:e.textContent.replace(/\s+/g,' ').trim()}; });
  const bub=p=>L.bubble(p);
  const SE=['se01','se02','se03','se04','se05','se06','se07','se08','se09','se10'];
  await S.t('U1','Menu: kepala “Senior” (0 dari 10), SE01 terkunci sampai semua Middle B selesai, SE02 terkunci sampai SE01 selesai',()=>W(async p=>{
    await p.click('#btnMenu'); await L.sleep(100);
    const a=await p.evaluate(()=>({head:[...document.querySelectorAll('.tier-head')].map(e=>e.textContent.replace(/\s+/g,' ').trim()),se01:document.querySelector('.stage-item[data-id="se01"]').classList.contains('locked'),txt:document.querySelector('.stage-item[data-id="se01"]').textContent.replace(/\s+/g,' ').trim()}));
    await p.keyboard.press('Escape'); await markUpTo(p,'mb10'); await p.click('#btnMenu'); await L.sleep(100);
    const c=await p.evaluate(()=>({se01:document.querySelector('.stage-item[data-id="se01"]').classList.contains('locked'),se02:document.querySelector('.stage-item[data-id="se02"]').classList.contains('locked'),mb10:document.querySelector('.stage-item[data-id="mb10"]').classList.contains('locked'),n:document.querySelectorAll('.stage-item[data-id^="se"]').length}));
    return {ok:/Senior0 dari 10 selesai|Senior ?0 dari 10/.test(a.head.join('|'))&&a.se01&&/Middle B/.test(a.txt)&&!c.se01&&c.se02&&c.n===10,note:JSON.stringify({a,c})}; },{w:1280,h:720,locked:true}));
  await S.t('U2','SE02 dimainkan dengan ketukan: Kirim + dua Jika, picker menampilkan hanya pilihan yang berarti, lulus di semua keadaan, layar hasil',()=>W(async p=>{
    await load(p,'se02');
    for(let i=0;i<3;i++) await L.dragPaletteToBoard(p,i===0?0:1);
    await L.pickChoice(p,0,[['Jumlah','2']]);
    const g1=await (async()=>{ const r=await L.rect(p,'#boardList .card',1); await p.mouse.click(r.cx,r.cy); await L.sleep(80); const t=await p.evaluate(()=>[...document.querySelectorAll('#pickBody .pick-group h3')].map(h=>h.textContent)); await p.click('#pickDone'); await L.sleep(60); return t; })();
    await L.pickChoice(p,1,[['Jika','jawaban “stok habis”'],['Maka','kirim ulang ke /cadangan']]);
    await L.pickChoice(p,2,[['Jika','jawaban “tidak ditemukan”'],['Maka','kirim ulang ke /barang-baru']]);
    const cards=await L.boardCards(p); let ov=false, rounds=0;
    while(!ov&&rounds<5){ rounds++; await L.runAndWait(p); ov=await L.overlayOpen(p,'#ovResult'); }
    const title=await p.evaluate(()=>document.querySelector('#resTitle').textContent);
    return {ok:ov&&g1.join(',')==='Jika,Maka'&&/Kirim permintaan ke \/barang, aksi pesan, isi kopi × 2/.test(cards[0])&&/tepat/.test(title),note:JSON.stringify({ov,rounds,g1,cards,title})}; },{w:1280,h:720}));
  await S.t('U3','SE03: papan sudah berisi 3 kartu dari temanmu (penuh); Jalankan menunjukkan jawaban loket di dasbor; satu perbaikan menyelesaikannya',()=>W(async p=>{
    await load(p,'se03'); await p.evaluate(()=>window.__t.setSeed(0));
    const cards=await L.boardCards(p); const lab=await p.evaluate(()=>document.querySelector('#boardLabel').textContent);
    await L.runAndWait(p); const d=await dash(p), bb=await bub(p);
    for(const [i,[nm,j]] of [['kopi',2],['gula',1],['teh',3]].entries()) await L.pickChoice(p,i,[['Alamat','/barang'],['Aksi','pesan'],['Barang',nm],['Jumlah',String(j)]]);
    let ov=false,rounds=0; while(!ov&&rounds<5){ rounds++; await L.runAndWait(p); ov=await L.overlayOpen(p,'#ovResult'); }
    return {ok:cards.length===3&&/3\/3/.test(lab)&&/(tidak ditemukan|aksi tidak boleh|isi ditolak)/.test(d.txt)&&/belum sampai/.test(bb)&&ov,note:JSON.stringify({cards:cards.length,lab,dash:d.txt.slice(0,160),bb,ov,rounds})}; },{w:1280,h:720}));
  await S.t('U4','Picker: kartu tanpa pilihan (Simpan) memberi pesan; Jika di SE04 hanya menampilkan grup “Maka”; Kirim di SE01 punya 4 grup',()=>W(async p=>{
    await load(p,'se04'); await p.evaluate(()=>window.__t.setProgram([{id:'x1',type:'simpan'},{id:'x2',type:'jikaS',syarat:'petaRusak',maka:'kembaliPertama'}]));
    const r0=await L.rect(p,'#boardList .card',0); await p.mouse.click(r0.cx,r0.cy); await L.sleep(80); const open0=await L.overlayOpen(p,'#ovPick'); const toast=await p.evaluate(()=>document.querySelector('#toast')?document.querySelector('#toast').textContent:'');
    const r1=await L.rect(p,'#boardList .card',1); await p.mouse.click(r1.cx,r1.cy); await L.sleep(80); const g=await p.evaluate(()=>[...document.querySelectorAll('#pickBody .pick-group h3')].map(h=>h.textContent)); await p.click('#pickDone');
    await load(p,'se01'); await p.evaluate(()=>window.__t.setProgram([{id:'x3',type:'kirim',alamat:'/gudang',aksi:'lihat',nama:'kopi',jumlah:1}]));
    const r2=await L.rect(p,'#boardList .card',0); await p.mouse.click(r2.cx,r2.cy); await L.sleep(80); const g2=await p.evaluate(()=>[...document.querySelectorAll('#pickBody .pick-group h3')].map(h=>h.textContent));
    return {ok:!open0&&/tidak punya pilihan/.test(toast)&&g.join()==='Maka'&&g2.join()==='Alamat,Aksi,Barang,Jumlah',note:JSON.stringify({open0,toast,g,g2})}; },{w:1280,h:720}));
  await S.t('U5','SE09: kartu Gerbang memperbarui dasbor (gerbang terpasang, tabel rilis menunjukkan ⛔); kartu kedua ditolak karena anggaran; dasbor menampilkan baris Pemantau',()=>W(async p=>{
    await load(p,'se09'); const d0=await dash(p); await p.evaluate(()=>window.__t.setProgram([{type:'gerbang',tahap:'staging'}])); await L.runAndWait(p); const d1=await dash(p);
    await load(p,'se09'); await p.evaluate(()=>window.__t.setProgram([{type:'gerbang',tahap:'uji'},{type:'gerbang',tahap:'staging'}])); await L.runAndWait(p); const bb=await bub(p);
    return {ok:/Gerbang: belum ada/.test(d0.txt)&&/Pemantau: belum ada/.test(d0.txt)&&/Gerbang: staging/.test(d1.txt)&&d1.txt.includes('⛔')&&/Anggaran gerbang habis/.test(bb),note:JSON.stringify({d0:d0.txt.slice(0,90),d1:d1.txt.slice(0,120),bb})}; },{w:1280,h:720}));
  await S.t('U6','Selesai SE04 lewat UI: kode semu menampilkan ulangi / simpan / terapkan / jika peta.rusak()',()=>W(async p=>{
    await load(p,'se04'); await p.evaluate(()=>window.__t.setProgram([{type:'ulangi',n:6},{type:'simpan'},{type:'terapkan',dari:null},{type:'jikaS',syarat:'petaRusak',maka:'kembaliTerakhir'},{type:'akhir'}]));
    let ov=false,rounds=0; while(!ov&&rounds<5){ rounds++; await L.runAndWait(p); ov=await L.overlayOpen(p,'#ovResult'); }
    await p.click('#resCode'); await L.sleep(100); const code=await p.evaluate(()=>document.querySelector('#resCodeBox').textContent);
    return {ok:ov&&/ulangi 6 kali:/.test(code)&&/jika peta\.rusak\(\):/.test(code),note:JSON.stringify({ov,rounds,code})}; },{w:1280,h:720}));
  for(const [name,w,h,t] of [['HP potret 375×667',375,667,true],['HP potret 360×640',360,640,true],['HP lanskap 667×375',667,375,true],['Desktop 1280×720',1280,720,false]])
    await S.t('L-'+w+'x'+h,`${name}: dasbor semua tahap Senior terlihat di dalam dunia, tombol Jalankan terlihat, tanpa gulir horizontal`,()=>W(async p=>{
      const bad=[];
      for(const id of SE){ await load(p,id); await p.evaluate(()=>{ const bd=document.querySelector('#bubbleClose'); if(bd&&!document.querySelector('#bubble').hidden) bd.click(); });
        const m=await p.evaluate(()=>{ const sv=document.querySelector('#sysView').getBoundingClientRect(), ww=document.querySelector('#worldWrap').getBoundingClientRect(), rn=document.querySelector('#btnRun').getBoundingClientRect(), pal=document.querySelector('#palette').getBoundingClientRect();
          return {svw:sv.width,svh:sv.height,inside:sv.left>=ww.left-1&&sv.right<=ww.right+1&&sv.top>=ww.top-1&&sv.bottom<=ww.bottom+1,run:rn.top>=0&&rn.bottom<=innerHeight+1&&rn.left>=0&&rn.right<=innerWidth+1,sx:document.documentElement.scrollWidth<=innerWidth+1,palN:document.querySelectorAll('#palette .card').length,palR:pal.right<=innerWidth+1}; });
        if(!(m.svh>40&&m.inside&&m.run&&m.sx&&m.palR)) bad.push(id+':'+JSON.stringify(m)); }
      return {ok:bad.length===0,note:bad.join(' | ')||'10 tahap rapi'}; },{w,h,touch:t}));
  const CONTRAST=(p)=>p.evaluate(()=>{ const root=document.querySelector('#sysView'); const pc=s=>{ const m=s.match(/[\d.]+/g).map(Number); return {r:m[0],g:m[1],b:m[2],a:m[3]==null?1:m[3]}; };
    const lum=c=>{ const f=v=>{ v/=255; return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b); };
    const bgOf=e=>{ for(let n=e;n;n=n.parentElement){ const c=pc(getComputedStyle(n).backgroundColor); if(c.a>0.5) return c; } return {r:255,g:255,b:255,a:1}; };
    let worst=99, who='', n=0; root.querySelectorAll('*').forEach(e=>{ const own=[...e.childNodes].some(x=>x.nodeType===3&&x.textContent.trim()); if(!own) return; n++;
      const fg=pc(getComputedStyle(e).color), bg=bgOf(e), L1=lum(fg), L2=lum(bg), cr=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05); if(cr<worst){ worst=cr; who=e.className+':'+e.textContent.trim().slice(0,20); } });
    return {worst:+worst.toFixed(2),who,n,panel:getComputedStyle(root).backgroundColor,card:getComputedStyle(document.querySelector('#palette .card .ic')||document.body).backgroundColor}; });
  for(const dark of [true,false]) await S.t(dark?'DK':'LT',(dark?'Mode gelap':'Mode terang')+': semua teks dasbor Papan Sistem (se04, se06, se09, se10, ex01, ex03, ex04, ex07, ex09) berkontras ≥ 4,5:1 terhadap latarnya sendiri',()=>W(async p=>{
    const out=[]; let ok=true;
    for(const id of ['se04','se06','se09','se10','ex01','ex03','ex04','ex07','ex09']){ await load(p,id);
      const prog={se04:"[{type:'ulangi',n:6},{type:'simpan'},{type:'terapkan',dari:null},{type:'jikaS',syarat:'petaRusak',maka:'kembaliTerakhir'},{type:'akhir'}]",se06:"[{type:'gabung',cabang:'Rani'},{type:'gabung',cabang:'Dodi'}]",se09:"[{type:'gerbang',tahap:'staging'},{type:'pantau',metrik:'pengguna'},{type:'rollback',kapan:1}]",se10:"[{type:'kirim',alamat:'/barang',aksi:'pesan',nama:'Kayu',jumlah:1}]",ex01:"[{id:'e1',type:'aturan',ketika:'pesananMasuk',maka:'kemas'},{id:'e2',type:'aturan',ketika:'petiSiap',maka:'kirim'}]",ex03:"[{id:'e3',type:'aturan',ketika:'komitBaru',maka:'jalankanUji'},{id:'e4',type:'aturan',ketika:'ujiGagal',maka:'beriTahuDev'}]",ex04:"[{id:'f1',type:'pekerja',jumlah:1},{id:'f2',type:'penyangga',ukuran:6}]",ex07:"[{id:'f3',type:'rak',kebijakan:'fifo',ukuran:2}]",ex09:"[{id:'f4',type:'cadangan'},{id:'f5',type:'coba',kali:2,jeda:2}]"}[id];
      await p.evaluate(`window.__t.setProgram(${prog})`); await p.click('#btnRun'); await L.sleep(1500);
      const m=await CONTRAST(p); const isDark=await p.evaluate(()=>getComputedStyle(document.body).color); out.push(id+':'+m.worst+'('+m.who+')'); if(m.worst<4.5||m.n<3) ok=false; if(dark&&m.panel.replace(/\s/g,'')==='rgba(255,255,255,0.97)') ok=false; }
    return {ok,note:out.join(' | ')}; },{w:1280,h:720,dark}));
  await S.t('LV','Pembaca layar: catatan langkah diumumkan lewat daerah aria-live sopan (status), bukan seluruh dasbor',()=>W(async p=>{
    await load(p,'se01'); await p.evaluate(()=>window.__t.setProgram([{type:'kirim',alamat:'/barang',aksi:'pesan',nama:'kopi',jumlah:2}])); await p.click('#btnRun'); await L.sleep(1500);
    const m=await p.evaluate(()=>{ const l=document.querySelector('#sysLive'), v=document.querySelector('#sysView'); return {live:l&&l.getAttribute('aria-live'),role:l&&l.getAttribute('role'),txt:l?l.textContent:'',viewLive:v.getAttribute('aria-live'),inside:v.contains(l)}; });
    return {ok:m.live==='polite'&&m.role==='status'&&/Loket menjawab/.test(m.txt)&&!m.viewLive&&!m.inside,note:JSON.stringify(m)}; },{w:1280,h:720}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
