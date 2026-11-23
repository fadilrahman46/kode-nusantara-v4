// T3 — Tata letak & keterbacaan di berbagai ukuran layar (screenshot + pengukuran DOM), kontras warna.
const L=require('./lib'); const fs=require('fs'); const EV=__dirname+'/evidence/';
const VPS=[
  {n:'desktop-1280x720',w:1280,h:720,dpr:1,touch:false},
  {n:'chromebook-1366x768',w:1366,h:768,dpr:1,touch:false},
  {n:'hp-portrait-360x740',w:360,h:740,dpr:2,touch:true},
  {n:'hp-portrait-390x844',w:390,h:844,dpr:2,touch:true},
  {n:'hp-landscape-667x375',w:667,h:375,dpr:2,touch:true},
  {n:'hp-landscape-844x390',w:844,h:390,dpr:2,touch:true},
  {n:'tablet-portrait-768x1024',w:768,h:1024,dpr:1,touch:true},
];
const measure=p=>p.evaluate(()=>{
  const R=s=>{const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  const tops=new Set([...document.querySelectorAll('.controls > *')].filter(e=>e.offsetParent!==null).map(e=>Math.round(e.getBoundingClientRect().top)));
  const small=[...document.querySelectorAll('.ctl,.tb-btn,.tb-select,.palette .card,.board .card,.trash,.bubble .close,.hint-actions button,.talk')].filter(e=>e.offsetParent!==null).map(e=>{const r=e.getBoundingClientRect();return {e:(e.id?'#'+e.id:e.className.split(' ')[0])+':'+(e.textContent||'').trim().slice(0,12),w:Math.round(r.width),h:Math.round(r.height)};}).filter(x=>x.w<44||x.h<44);
  const world=R('#worldWrap'), bub=document.querySelector('#bubble').hidden?null:R('#bubble');
  const pal=document.querySelector('#palette'), brd=document.querySelector('#board');
  return {vw:innerWidth,vh:innerHeight,topbar:R('.topbar'),world,editor:R('#editor'),palette:R('#palette'),board:R('#board'),controls:R('.controls'),controlRows:tops.size,
    bubble:bub,bubbleCover:bub?Math.round(100*Math.max(0,Math.min(bub.y+bub.h,world.y+world.h)-Math.max(bub.y,world.y))/world.h):0,smallTargets:small,
    docOverflowX:document.documentElement.scrollWidth>innerWidth, paletteOverflowX:pal.scrollWidth>pal.clientWidth+1,
    boardVisibleRows:(()=>{ const br=brd.getBoundingClientRect(); const lis=[...brd.querySelectorAll('li:not(.drop-line)')]; if(!lis.length) return Math.floor((brd.clientHeight-16)/54); return lis.filter(l=>{const r=l.getBoundingClientRect(); return r.top>=br.top-1&&r.bottom<=br.bottom+1;}).length; })(),
    boardCards:brd.querySelectorAll('li:not(.drop-line)').length, controlsBottomVisible:R('.controls')&&(R('.controls').y+R('.controls').h)<=innerHeight};
});
(async()=>{
  let b=await L.launch(); const S=L.suite('t3_layout'); const all={};
  const retries={};
  const PART=__dirname+'/results/t3_parts/'; fs.mkdirSync(PART,{recursive:true});
  const ONLY=process.env.T3_VP, MERGE=process.env.T3_MERGE;
  if(MERGE){ for(const v of VPS){ const f=PART+v.n+'.json'; if(!fs.existsSync(f)) throw new Error('bagian belum ada: '+v.n); const d=JSON.parse(fs.readFileSync(f,'utf8')); all[v.n]=d.data; if(d.retries) retries[v.n]=d.retries; } }
  for(const v of (MERGE?[]:VPS.filter(x=>!ONLY||x.n===ONLY))){ for(let attempt=1;attempt<=3;attempt++){ try{
    await b.close().catch(()=>{}); b=await L.launch(); // browser baru per layar: menghindari GPU perangkat lunak macet
    const {page:p,ctx,errors}=await L.newPage(b,{w:v.w,h:v.h,dpr:v.dpr,touch:v.touch}); const m={};
    const tap=async(sel,i=0)=>{ if(v.touch){ const r=await L.rect(p,sel,i); await p.touchscreen.tap(r.cx,r.cy); } else { const r=await L.rect(p,sel,i); await p.mouse.click(r.cx,r.cy); } await L.sleep(120); };
    m.p0_awal=await measure(p); if(v.n==='hp-portrait-360x740'||v.n==='desktop-1280x720') await p.screenshot({path:EV+`${v.n}_p0_awal.png`});
    await L.openStage(p,1);
    m.b7_bubble=await measure(p); await p.screenshot({path:EV+`${v.n}_b7_bubble.png`});
    m.b7_occl=await p.evaluate(()=>{ const wr=document.querySelector('#worldWrap').getBoundingClientRect();
      const blockers=[...document.querySelectorAll('#bubble,.stage-title,#btnTalk')].filter(e=>e.offsetParent!==null&&e.closest('#worldWrap')).map(e=>({id:e.id||e.className,r:e.getBoundingClientRect()}));
      const sc=window.__t.getScene(); const pts=[];
      // label HTML (kotak + perahu): kotak pembatas sebenarnya
      document.querySelectorAll('#labels .lbl3d').forEach(el=>{ const r=el.getBoundingClientRect(); pts.push({name:'label '+el.textContent.split(/\s/)[0],r,font:parseFloat(getComputedStyle(el.querySelector('small')||el).fontSize)}); });
      // objek kotak 3D: titik pusat yang diproyeksikan
      Object.entries(sc.meshes).forEach(([k,o])=>{ if(!k.startsWith('box_')) return; const v=o.getWorldPosition(new THREE.Vector3()).project(sc.camera); const x=wr.left+(v.x+1)/2*wr.width, y=wr.top+(1-v.y)/2*wr.height; pts.push({name:k,r:{left:x,right:x,top:y,bottom:y}}); });
      const inter=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
      const res=pts.map(p=>{ const cx=(p.r.left+p.r.right)/2, cy=(p.r.top+p.r.bottom)/2; const hit=blockers.find(b=>cx>=b.r.left&&cx<=b.r.right&&cy>=b.r.top&&cy<=b.r.bottom);
        const out=p.r.left<wr.left-1||p.r.right>wr.right+1||p.r.top<wr.top-1||p.r.bottom>wr.bottom+1; return {name:p.name,tertutup:hit?hit.id:null,terpotong:out,font:p.font}; });
      const labs=pts.filter(p=>p.name.startsWith('label')); const overl=[];
      for(let i=0;i<labs.length;i++) for(let j=i+1;j<labs.length;j++){ const A=labs[i].r,B=labs[j].r; const ar=Math.min((A.right-A.left)*(A.bottom-A.top),(B.right-B.left)*(B.bottom-B.top)); if(inter(A,B)>0.1*ar) overl.push(labs[i].name+' × '+labs[j].name); }
      window.__labelText=labs.map(l=>({k:l.name,px:l.font})); window.__overlap=overl; return res; });
    m.b7_overlap=await p.evaluate(()=>window.__overlap||[]);
    m.b7_labelText=await p.evaluate(()=>window.__labelText||[]);
    await p.click('#bubbleClose'); await L.sleep(100);
    await tap('#palette .card',0); await tap('#palette .card',0); await tap('#palette .card',0); await L.sleep(150);
    m.b7_isi=await measure(p); await p.screenshot({path:EV+`${v.n}_b7_papan.png`});
    if(v.n==='hp-portrait-360x740'){ await tap('#boardList .card',0); await L.sleep(250); await p.screenshot({path:EV+`${v.n}_b7_picker.png`}); m.picker=await p.evaluate(()=>{const s=document.querySelector('#ovPick .sheet').getBoundingClientRect();return {sheetH:Math.round(s.height),vh:innerHeight,btnMin:Math.min(...[...document.querySelectorAll('#pickBody button')].map(b=>Math.round(b.getBoundingClientRect().height)))};}); await p.click('#pickDone'); }
    await L.openStage(p,2); await p.select('#diff','hard'); await L.sleep(300); await p.click('#bubbleClose').catch(()=>{});
    for(let i=0;i<4;i++) await tap('#palette .card',i%4);
    m.b8_hard=await measure(p); await p.screenshot({path:EV+`${v.n}_b8_hard.png`});
    all[v.n]={m,errors}; await ctx.close(); console.log('selesai',v.n); fs.writeFileSync(PART+v.n+'.json',JSON.stringify({data:all[v.n],retries:attempt>1?attempt-1:0})); break;
  }catch(e){ retries[v.n]=attempt; console.log('ULANG',v.n,attempt,e.message.split('\n')[0].slice(0,80)); if(attempt===3) throw e; } } }
  if(ONLY){ console.log('bagian tersimpan',ONLY); await b.close(); process.exit(0); }
  fs.writeFileSync(__dirname+'/results/t3_layout_data.json',JSON.stringify(all,null,2));
  S.info('X-infra','Percobaan ulang karena GPU perangkat lunak macet (infrastruktur uji, bukan halaman)',JSON.stringify(retries));
  // ----- asersi -----
  for(const v of VPS){ const m=all[v.n].m, o=v.n;
    await S.t('X-'+o+'-a','Tidak ada scroll horizontal pada dokumen (semua keadaan)',()=>({ok:Object.values(m).every(x=>!x.vw||!x.docOverflowX),note:''}));
    await S.t('X-'+o+'-b','Papan Program menampilkan seluruh kartu (3) tanpa scroll (b7/b8)',()=>({ok:m.b7_isi.boardVisibleRows>=m.b7_isi.boardCards&&m.b8_hard.boardVisibleRows>=m.b8_hard.boardCards,note:`b7: ${m.b7_isi.boardVisibleRows}/${m.b7_isi.boardCards} kartu terlihat utuh (papan ${m.b7_isi.board.h}px); b8: ${m.b8_hard.boardVisibleRows}/${m.b8_hard.boardCards} (${m.b8_hard.board.h}px)`}));
    S.info('X-'+o+'-c','[proksi lama, diganti X-h] Bubble dialog menutupi tinggi area dunia saat stage dibuka (b7)',`${m.b7_bubble.bubbleCover}% dari tinggi dunia (bubble ${m.b7_bubble.bubble?m.b7_bubble.bubble.h:0}px; dunia ${m.b7_bubble.world.h}px)`);
    await S.t('X-'+o+'-d','Semua tombol/kartu ≥ 44×44 px (target sentuh)',()=>({ok:m.b8_hard.smallTargets.length===0,note:m.b8_hard.smallTargets.map(x=>`${x.e} ${x.w}×${x.h}`).join('; ')}));
    await S.t('X-'+o+'-e','Baris tombol kontrol muat ≤ 2 baris dan seluruhnya terlihat di layar',()=>({ok:m.b7_isi.controlRows<=2&&m.b7_isi.controlsBottomVisible,note:`${m.b7_isi.controlRows} baris; dasar kontrol di y=${m.b7_isi.controls.y+m.b7_isi.controls.h} dari ${m.b7_isi.vh}`}));
    await S.t('X-'+o+'-f','Area dunia 3D ≥ 200 px tinggi dan ≥ 280 px lebar (cukup untuk membaca adegan)',()=>({ok:m.b7_isi.world.h>=200&&m.b7_isi.world.w>=280,note:`${m.b7_isi.world.w}×${m.b7_isi.world.h}`}));
    await S.t('X-'+o+'-j','Label kunci Stage 7 tidak saling tumpuk (>10% luas)',()=>({ok:(m.b7_overlap||[]).length===0,note:(m.b7_overlap||[]).join('; ')}));
    await S.t('X-'+o+'-i','Teks label 3D kunci Stage 7 (kotak, papan nama perahu) ≥ 12 px CSS',()=>{ const L=m.b7_labelText||[]; const mn=Math.min(...L.map(x=>x.px)); return {ok:L.length>0&&mn>=12,note:L.map(x=>x.k.replace('label ','')+' '+x.px+'px').join(', ')}; });
    await S.t('X-'+o+'-h','Stage 7 saat dialog terbuka: kotak & label kunci (3 kotak + papan nama perahu) tidak tertutup dialog/judul dan tidak terpotong tepi',()=>{ const bad=(m.b7_occl||[]).filter(x=>x.tertutup||x.terpotong); return {ok:m.b7_occl&&bad.length===0,note:bad.map(x=>x.name+(x.tertutup?' tertutup '+x.tertutup:'')+(x.terpotong?' terpotong':'')).join('; ')||`${(m.b7_occl||[]).length} titik diperiksa`}; });
    if(v.touch&&v.w<500) await S.t('X-'+o+'-g','Palet kartu b8 Hard tidak meluap horizontal (agar tidak butuh scroll)',()=>({ok:!m.b8_hard.paletteOverflowX,note:`palette ${m.b8_hard.palette.w}px`}));
  }
  await S.t('X-err','Tidak ada error/warning konsol di semua ukuran layar',()=>({ok:Object.values(all).every(x=>x.errors.length===0),note:Object.entries(all).filter(([k,x])=>x.errors.length).map(([k,x])=>k+': '+x.errors[0]).join(' | ')}));
  // ----- kontras -----
  const contrast=async(dark)=>{ const {page:p,ctx}=await L.newPage(b,{dark,blockThree:true}); await L.openStage(p,1); // kontras hanya membaca gaya DOM: tanpa WebGL agar tidak macet
    const r=await p.evaluate(()=>{
      const lum=([r,g,b])=>{const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
      const parse=s=>{const m=s.match(/rgba?\(([^)]+)\)/); if(!m) return null; const a=m[1].split(',').map(x=>parseFloat(x)); return {c:a.slice(0,3),a:a[3]===undefined?1:a[3]};};
      const bg=e=>{ while(e){ const c=parse(getComputedStyle(e).backgroundColor); if(c&&c.a>0.9) return c.c; e=e.parentElement; } return [255,255,255]; };
      const ratio=(a,b)=>{const l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)};
      const pairs=[['.stage-title span','Subjudul stage'],['.zone-label','Label zona'],['#bubble b','Nama NPC'],['#bubbleText','Teks dialog'],['.board-empty','Teks papan kosong'],['.card','Teks kartu'],['.ctl.run','Tombol Jalankan'],['.ctl','Tombol kontrol'],['.brand small','Subjudul brand']];
      return pairs.map(([s,n])=>{ const e=document.querySelector(s); if(!e) return null; const fg=parse(getComputedStyle(e).color).c; return {n,s,ratio:+ratio(fg,bg(e)).toFixed(2),size:getComputedStyle(e).fontSize}; }).filter(Boolean);
    }); await ctx.close(); return r; };
  const cl=await contrast(false), cd=await contrast(true);
  fs.writeFileSync(__dirname+'/results/t3_kontras.json',JSON.stringify({light:cl,dark:cd},null,2));
  for(const [mode,arr] of [['terang',cl],['gelap',cd]]) await S.t('K-'+mode,`Kontras teks ≥ 4,5:1 (mode ${mode})`,()=>{ const bad=arr.filter(x=>x.ratio<4.5); return {ok:bad.length===0,note:bad.map(x=>`${x.n} ${x.ratio}:1 (${x.size})`).join('; ')||'terendah '+Math.min(...arr.map(x=>x.ratio))+':1'}; });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
