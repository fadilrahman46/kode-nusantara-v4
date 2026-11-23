// T2n — Gerbang Si Teka lewat ANTARMUKA: baris menu, tombol di layar hasil, jawab dengan ketuk/klaviatur, petunjuk, terbuka tanpa bonus, ubin (Sulit), progres tersimpan, tampilan HP.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2n_gerbang');
  const W=async(fn,o)=>{ const {page:p,ctx,errors}=await L.newPage(b,o||{w:1280,h:720}); try{ const r=await fn(p); if(errors.length){ r.ok=false; r.note+=' | galat: '+errors.join(' | '); } return r; }catch(e){ return {ok:false,note:'EXC '+e.message.split('\n')[0]}; }finally{ await ctx.close(); } };
  const gate=p=>p.evaluate(()=>({open:!document.querySelector('#ovGate').hidden,title:document.querySelector('#gateTitle').textContent,stem:document.querySelector('#gateStem')&&document.querySelector('#gateStem').textContent,live:document.querySelector('#gateLive').textContent,hint:!!document.querySelector('#gateBody .g-hint'),mati:document.querySelectorAll('#gateBody .t-opt.mati').length,opts:[...document.querySelectorAll('#gateBody .t-opt')].map(e=>e.textContent.trim()),fb:(document.querySelector('#gateBody .g-fb')||{}).textContent||''}));
  const clickOpt=async(p,txt)=>{ const i=await p.evaluate(t=>[...document.querySelectorAll('#gateBody .t-opt')].findIndex(e=>e.textContent.replace(/ \(salah\)$/,'').trim()===t),txt); if(i<0) throw new Error('opsi tidak ada: '+txt); await p.evaluate(i=>document.querySelectorAll('#gateBody .t-opt')[i].scrollIntoView({block:'center'}),i); const r=await L.rect(p,'#gateBody .t-opt',i); await p.mouse.click(r.cx,r.cy); await L.sleep(60); };
  const go=async p=>{ await p.evaluate(()=>document.querySelector('#gateGo').scrollIntoView({block:'center'})); const r=await L.rect(p,'#gateGo'); await p.mouse.click(r.cx,r.cy); await L.sleep(80); };
  const jawab=p=>p.evaluate(()=>window.__t.getGateRun().q.jawab);
  const salahOpt=p=>p.evaluate(()=>{ const r=window.__t.getGateRun(); const o=r.opsi.find((o,i)=>!o.ok&&!r.mati.includes(i)); return o.t; });
  const markUpTo=(p,id)=>p.evaluate(id=>{ const T=window.__t; const k=T.STAGES.findIndex(x=>x.id===id); for(let i=0;i<=k;i++) T.markWin(T.STAGES[i].id,3); },id);
  const MA03="[{type:'mesin'},{type:'maju'},{type:'ulangi',n:'masukan'},{type:'susun'},{type:'akhir'},{type:'atap'},{type:'jika',sensor:'masukan',cmp:'>',n:1,then:'pakaiTurun',else:null},{type:'akhir'},{type:'pakai',arg:4}]";
  await S.t('U1','Menu: baris “Gerbang Si Teka” muncul setelah MA03, MA06, MB03, MB06, EX03, EX06 dan terkunci sampai tahap itu selesai; tahap lain tidak terkunci olehnya',()=>W(async p=>{
    await p.click('#btnMenu'); await L.sleep(100);
    const before=await p.evaluate(()=>[...document.querySelectorAll('.gate-item')].map(e=>({id:e.dataset.id,locked:e.classList.contains('locked'),txt:e.textContent.replace(/\s+/g,' ').trim()})));
    await p.keyboard.press('Escape'); await markUpTo(p,'ma03'); await p.click('#btnMenu'); await L.sleep(100);
    const after=await p.evaluate(()=>({g:[...document.querySelectorAll('.gate-item')].map(e=>({id:e.dataset.id,locked:e.classList.contains('locked')})),ma04:document.querySelector('.stage-item[data-id="ma04"]').classList.contains('locked'),prev:document.querySelector('.gate-item[data-id="g_ma03"]').previousElementSibling.dataset.id}));
    return {ok:before.length===6&&before.every(x=>x.locked)&&!after.g[0].locked&&after.g[1].locked&&!after.ma04&&after.prev==='ma03',note:JSON.stringify({before:before.map(x=>x.id+':'+x.locked),after})}; },{w:1280,h:720,locked:true}));
  await S.t('U2','Menang MA03 → tombol “Gerbang Si Teka” di layar hasil → gerbang terbuka dengan teka-teki hitung(n)',()=>W(async p=>{
    await markUpTo(p,'ma02'); await p.evaluate(id=>window.__t.loadStage(window.__t.STAGES.find(s=>s.id===id)),'ma03'); await L.sleep(300);
    await p.evaluate(`window.__t.setProgram(${MA03})`); await L.runAndWait(p);
    const ov=await L.overlayOpen(p,'#ovResult'), vis=await p.evaluate(()=>!document.querySelector('#resGateRow').hidden);
    await p.click('#resGate'); await L.sleep(150); const g=await gate(p);
    return {ok:ov&&vis&&g.open&&/hitung\(\d\)/.test(g.stem)&&g.opts.length===4&&!(await L.overlayOpen(p,'#ovResult')),note:JSON.stringify({ov,vis,stem:g.stem,opts:g.opts})}; },{w:1280,h:720,locked:true}));
  await S.t('U3','Jawab benar dengan ketukan → “Benar!”, penjelasan, bonus; Lanjut → memuat MA04 (tahap berikutnya)',()=>W(async p=>{
    await markUpTo(p,'ma03'); await p.evaluate(()=>window.__t.openGate('g_ma03')); await L.sleep(100);
    const dis=await p.evaluate(()=>document.querySelector('#gateGo').disabled); await clickOpt(p,await jawab(p)); const en=await p.evaluate(()=>!document.querySelector('#gateGo').disabled); await go(p);
    const g=await gate(p), body=await p.evaluate(()=>document.querySelector('#gateBody').textContent);
    await p.click('#gateNext'); await L.sleep(400); const t=await p.evaluate(()=>document.querySelector('#stageTitle').textContent);
    return {ok:dis&&en&&/Benar!/.test(g.live)&&/Bonus misi/.test(body)&&/MA04/.test(t),note:JSON.stringify({dis,en,live:g.live,t})}; },{w:1280,h:720,locked:true}));
  await S.t('U4','Salah dua kali lewat ketukan: pilihan tercoret, petunjuk Si Teka muncul, wilayah live memberi tahu; jawab benar → gerbang terbuka tanpa bonus (salah 2)',()=>W(async p=>{
    await markUpTo(p,'mb03'); await p.evaluate(()=>window.__t.openGate('g_mb03')); await L.sleep(100);
    await clickOpt(p,await salahOpt(p)); await go(p); const g1=await gate(p);
    await clickOpt(p,await salahOpt(p)); await go(p); const g2=await gate(p);
    await clickOpt(p,await jawab(p)); await go(p); const g3=await gate(p);
    return {ok:!g1.hint&&g1.mati===1&&g2.hint&&g2.mati===2&&/petunjuk/.test(g2.live)&&/Benar/.test(g3.live),note:JSON.stringify({g1:[g1.hint,g1.mati],g2:[g2.hint,g2.mati,g2.live]})}; },{w:1280,h:720,locked:true}));
  await S.t('U5','Salah tiga kali: gerbang terbuka tanpa bonus, jawaban + penjelasan tampil; menu menandai “Terbuka tanpa bonus”; Lanjut tetap ada',()=>W(async p=>{
    await markUpTo(p,'mb06'); await p.evaluate(()=>window.__t.openGate('g_mb06')); await L.sleep(100);
    for(let i=0;i<3;i++){ await clickOpt(p,await salahOpt(p)); await go(p); }
    const g=await gate(p), txt=await p.evaluate(()=>document.querySelector('#gateBody').textContent), nx=await p.evaluate(()=>!!document.querySelector('#gateNext'));
    await p.evaluate(()=>document.querySelector('#gateClose').click()); await p.click('#btnMenu'); await L.sleep(100);
    const row=await p.evaluate(()=>document.querySelector('.gate-item[data-id="g_mb06"]').textContent.replace(/\s+/g,' '));
    return {ok:/Jawabannya/.test(g.fb)&&/tidak diberikan/.test(txt)&&nx&&/Terbuka tanpa bonus/.test(row),note:row}; },{w:1280,h:720,locked:true}));
  await S.t('U6','Klaviatur: panah memilih opsi (opsi tercoret dilewati), Escape menutup tanpa mencatat',()=>W(async p=>{
    await markUpTo(p,'ma06'); await p.evaluate(()=>window.__t.openGate('g_ma06')); await L.sleep(100);
    const f=await p.evaluate(()=>document.activeElement.className+'|'+document.activeElement.getAttribute('role'));
    await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown'); const ck=await p.evaluate(()=>document.querySelectorAll('#gateBody .t-opt[aria-checked="true"]').length);
    await p.keyboard.press('Escape'); await L.sleep(60); const closed=await p.evaluate(()=>document.querySelector('#ovGate').hidden), rec=await p.evaluate(()=>!!window.__t.getProgress().gerbang.g_ma06);
    return {ok:/t-opt/.test(f)&&/radio/.test(f)&&ck===1&&closed&&!rec,note:`${f} checked=${ck} closed=${closed} rec=${rec}`}; },{w:1280,h:720,locked:true}));
  await S.t('U7','Tingkat Sulit: gerbang berbentuk ubin; ketuk ubin menyusun jawaban, ketuk lagi melepas, Hapus; benar → bonus',()=>W(async p=>{
    await markUpTo(p,'ma03'); await p.select('#diff','hard'); await L.sleep(300); await p.evaluate(()=>window.__t.openGate('g_ma03',0)); await L.sleep(100);
    const st=await p.evaluate(()=>({tiles:[...document.querySelectorAll('#gateBody .g-tile')].map(e=>e.textContent),opts:document.querySelectorAll('#gateBody .t-opt').length,ans:window.__t.getGateRun().q.jawab}));
    const tapT=async d=>{ const i=await p.evaluate(d=>{ const r=window.__t.getGateRun(); return [...document.querySelectorAll('#gateBody .g-tile')].findIndex((e,k)=>e.textContent===d&&e.getAttribute('aria-pressed')==='false'); },d); const rc=await L.rect(p,'#gateBody .g-tile',i); await p.mouse.click(rc.cx,rc.cy); await L.sleep(60); };
    await tapT('0'); const s1=await p.evaluate(()=>document.querySelectorAll('#gateBody .g-chip').length); await p.click('#gateUndo'); const s2=await p.evaluate(()=>document.querySelectorAll('#gateBody .g-chip').length);
    for(const d of st.ans.split('')) await tapT(d); await go(p); const g=await gate(p);
    return {ok:st.opts===0&&st.tiles.length>=4&&st.tiles.length<=8&&s1===1&&s2===0&&/Benar/.test(g.live),note:JSON.stringify({st,s1,s2,live:g.live})}; },{w:1280,h:720,locked:true}));
  await S.t('U8','Progres gerbang tersimpan di perangkat: muat ulang halaman → status, bonus, dan ✓ di menu bertahan; “Hapus progres” menghapusnya',()=>W(async p=>{
    await markUpTo(p,'ma03'); await p.evaluate(()=>window.__t.openGate('g_ma03')); await L.sleep(100); await clickOpt(p,await jawab(p)); await go(p);
    await p.reload({waitUntil:'load'}); await p.waitForFunction('window.__t',{timeout:15000}); await L.sleep(300);
    const rec=await p.evaluate(()=>window.__t.getProgress().gerbang.g_ma03); await p.click('#btnMenu'); await L.sleep(100);
    const row=await p.evaluate(()=>document.querySelector('.gate-item[data-id="g_ma03"]').textContent.replace(/\s+/g,' '));
    await p.click('#progClear'); await p.click('#progClear'); await L.sleep(150); const gone=await p.evaluate(()=>Object.keys(window.__t.getProgress().gerbang).length);
    return {ok:rec&&rec.status==='benar'&&rec.bonus&&/Terjawab/.test(row)&&gone===0,note:JSON.stringify(rec)+' | '+row}; },{w:1280,h:720,locked:true}));
  await S.t('U9','Buka lewat tautan: ?gerbang=g_mb06&varian=1 membuka soal “kambing” (untuk memutar ulang laporan)',()=>W(async p=>{ await L.sleep(300);
    const g=await gate(p); return {ok:g.open&&/kambing/.test(g.stem),note:g.stem}; },{w:1280,h:720,path:'/?gerbang=g_mb06&varian=1'}));
  // ---- tata letak di HP ----
  const lay=async(p,o)=>p.evaluate(o=>{ const sh=document.querySelector('#ovGate .sheet'), r=sh.getBoundingClientRect(); const btns=[...sh.querySelectorAll('button')].map(b=>b.getBoundingClientRect()); const bodyW=document.documentElement.scrollWidth;
    return {sheetW:Math.round(r.width),vw:innerWidth,vh:innerHeight,fits:r.left>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,hscroll:bodyW>innerWidth+1||sh.scrollWidth>sh.clientWidth+1,minBtn:Math.round(Math.min(...btns.map(b=>Math.min(b.width,b.height)))),scrollable:sh.scrollHeight>sh.clientHeight}; },o);
  const VPS=[['hp-tegak 360×740',{w:360,h:740,dpr:2,touch:true}],['hp-tegak 390×844',{w:390,h:844,dpr:2,touch:true}],['hp-mendatar 667×375',{w:667,h:375,dpr:2,touch:true}],['tablet 820×1180',{w:820,h:1180,dpr:2,touch:true}]];
  for(const [nm,vp] of VPS) for(const lv of ['easy','hard']) await S.t(`L-${nm}-${lv}`,`Tata letak ${nm}, ${lv==='easy'?'pilihan':'ubin'}: lembar muat di layar, tanpa gulir mendatar, tombol ≥ 44 px, tombol Jawab terjangkau`,()=>W(async p=>{
    await markUpTo(p,'mb06'); await p.select('#diff',lv); await L.sleep(250); const res=[];
    for(const id of ['g_ma03','g_ma06','g_mb03','g_mb06']) for(const vi of [0,1,2]){ await p.evaluate((i,v)=>window.__t.openGate(i,v),id,vi); await L.sleep(40); const m=await lay(p); 
      const reach=await p.evaluate(()=>{ const sh=document.querySelector('#ovGate .sheet'), g=document.querySelector('#gateGo'); g.scrollIntoView({block:'nearest'}); const a=g.getBoundingClientRect(), s=sh.getBoundingClientRect(); return a.top>=s.top-1&&a.bottom<=s.bottom+1; });
      res.push({id,vi,...m,reach}); }
    const bad=res.filter(m=>!m.fits||m.hscroll||m.minBtn<44||!m.reach);
    if(lv==='hard'&&vp.w===360){ await p.evaluate(()=>window.__t.openGate('g_mb06',1)); await L.sleep(80); await p.screenshot({path:__dirname+'/results/gerbang_hard_hp.png'}); }
    if(lv==='easy'&&vp.w===667){ await p.evaluate(()=>window.__t.openGate('g_mb03',0)); await L.sleep(80); await p.screenshot({path:__dirname+'/results/gerbang_mendatar.png'}); }
    return {ok:bad.length===0,note:bad.length?JSON.stringify(bad.slice(0,3)):`12 soal diperiksa`}; },Object.assign({locked:true},vp)));
  await S.t('DK','Mode gelap: teks soal, kotak kode, dan opsi terbaca (kontras ≥ 4,5:1)',()=>W(async p=>{
    await markUpTo(p,'mb03'); await p.evaluate(()=>window.__t.openGate('g_mb03',0)); await L.sleep(100);
    const c=await p.evaluate(()=>{ const lum=([r,g,b])=>{ const f=v=>{ v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4); }; return .2126*f(r)+.7152*f(g)+.0722*f(b); };
      const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number); const bgOf=e=>{ for(;e;e=e.parentElement){ const c=getComputedStyle(e).backgroundColor; if(c&&!/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return rgb(c); } return [255,255,255]; };
      const ratio=sel=>{ const e=document.querySelector(sel), a=lum(rgb(getComputedStyle(e).color)), bg=lum(bgOf(e)); return +((Math.max(a,bg)+.05)/(Math.min(a,bg)+.05)).toFixed(2); };
      return {stem:ratio('#gateStem'),code:ratio('#gateBody .g-code'),opt:ratio('#gateBody .t-opt'),meta:ratio('#gateBody .t-meta')}; });
    return {ok:Object.values(c).every(v=>v>=4.5),note:JSON.stringify(c)}; },{w:1280,h:720,dark:true,locked:true}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
