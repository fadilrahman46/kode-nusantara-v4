// Harness uji prototipe Kode Nusantara (P0 + P1).
// Menjalankan halaman asli di Chromium headless; hanya MENAMBAH satu baris ekspor (window.__t)
// agar logika internal bisa diperiksa. Tidak ada kode game yang diubah.
const http=require('http'),fs=require('fs'),path=require('path');
const puppeteer=require('puppeteer-core');
const TARGET=process.env.TARGET||path.resolve(__dirname,'../kode-nusantara-prototipe.html');
const THREE_PATH=require.resolve('three/build/three.min.js'); // r128, sama dengan CDN yang dipakai halaman
const HOOK=";(function(){var R=THREE.WebGLRenderer;THREE.WebGLRenderer=function(a){var r=new R(a);window.__r=r;return r;};THREE.WebGLRenderer.prototype=R.prototype;})();";
const MARK="ready.then(()=>{ initThree(); loadStage(startStage()); });\n})();";
function patched(){
  const h=fs.readFileSync(TARGET,'utf8'); if(!h.includes(MARK)) throw new Error('penanda ekspor tidak ditemukan');
  let out=h;
  const ti=out.indexOf('<script id="three-inline">'); if(ti>=0){ const end=out.indexOf('</script>',ti)+9; out=out.slice(0,end)+'<script>'+HOOK+'</script>'+out.slice(end); }
  return out.replace(MARK,"ready.then(()=>{ initThree(); loadStage(startStage()); });\nwindow.__t={STAGES,apply,freshWorld,setStage:s=>{stage=s;},getStage:()=>stage,getRunning:()=>running,getAttempt:()=>attempt,getLogs:()=>logs,showVal,HINT_COST,MULT,RUNS_FOR_3,getProgram:()=>program,getScene:()=>({camera,meshes,labelSprites}),setSeed:i=>{seedIdx=i;pendingSeed=null;},showSeed:i=>{seedIdx=i;pendingSeed=null;buildScene();world=freshWorld();syncScene(true);},getSeed:()=>seedIdx,getPending:()=>pendingSeed,simulate,checkOtherSeeds,condText,cardText,pseudo,loadStage,interpret,execStep,getProgram:()=>program,T1_BANK,getTests:()=>tests,getTestRun:()=>testRun,t1Blocked,markWin:(id,st)=>{ const k=STAGES.find(x=>x.id===id); const keep=stage; stage=k; recordWin(st||3); stage=keep; },setProgram:p=>{program=p;programChanged();},GATES,gateChoices,gateTiles,gateTilesOk,openGate,gateAnswer,gateAfter,gateReady,lockReason,getGateRun:()=>gateRun,setDiff:d=>{diff=d;},getProgress:()=>progress,GATE_BONUS_MAKS_SALAH,TDEF,T2_BANK,T3_BANK,tBlocked,tPassed,tPrasyarat,tStatusText,waktuRun,turunRun,treeLists,brankasRun,gTick,EXS,openTest,tierDone,seniorOpen,tests:()=>tests,showResult};\n})();");
}
let server,PORT;
async function serve(){
  if(server) return PORT;
  server=http.createServer((q,s)=>{ s.setHeader('content-type','text/html; charset=utf-8'); s.end(q.url.startsWith('/raw')?fs.readFileSync(TARGET,'utf8'):patched()); });
  await new Promise(r=>server.listen(0,'127.0.0.1',r)); PORT=server.address().port; return PORT;
}
async function launch(){
  let p,args=[];
  if(process.env.CHROME_PATH) p=process.env.CHROME_PATH; else { const c=require('@sparticuz/chromium'); const ch=c.default||c; p=await ch.executablePath(); args=ch.args.filter(a=>!/single-process|no-zygote/.test(a)); }
  const browser=await puppeteer.launch({executablePath:p,headless:'shell',protocolTimeout:+(process.env.PROTO_TIMEOUT||60000),args:[...args,'--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox']});
  await serve(); return browser;
}
async function newPage(browser,o={}){
  const {w=1280,h=720,dpr=1,touch=false,dark=false,blockThree=false,denyStorage=false,offline=false,path:pth='/'}=o;
  const ctx=await browser.createBrowserContext(); const page=await ctx.newPage();
  await page.setViewport({width:w,height:h,deviceScaleFactor:dpr,isMobile:touch,hasTouch:touch});
  if(dark) await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:'dark'}]);
  // Uji lama membuka tahap mana pun: nyalakan "Buka semua tahap" kecuali uji meminta kunci aktif (o.locked).
  if(!denyStorage&&!o.locked) await page.evaluateOnNewDocument(()=>{ try{ localStorage.setItem('kn_buka_semua','1'); }catch(e){} });
  // v22: halaman pembuka (masuk/daftar) dilewati lewat sesi tamu, kecuali uji meminta o.entry.
  if(!o.entry) await page.evaluateOnNewDocument(()=>{ try{ sessionStorage.setItem('kn_sesi','~tamu'); }catch(e){} });
  if(denyStorage) await page.evaluateOnNewDocument(()=>{ Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError');}}); });
  await page.setRequestInterception(true);
  const net={three:0,fontsBlocked:0};
  page.on('request',req=>{ const u=req.url();
    if(offline&&!u.startsWith('http://127.0.0.1')){ net.offlineBlocked=(net.offlineBlocked||0)+1; return req.abort(); }
    if(/cdnjs\.cloudflare\.com.*three/.test(u)){ net.three++; if(blockThree) return req.abort(); return req.respond({status:200,contentType:'application/javascript',body:fs.readFileSync(THREE_PATH,'utf8')+HOOK}); }
    if(/fonts\.(googleapis|gstatic)\.com/.test(u)){ net.fontsBlocked++; return req.abort(); }
    req.continue(); });
  const errors=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',m=>{ const t=m.text(); if((m.type()==='error'||m.type()==='warning')&&!/ERR_FAILED|fonts\.(googleapis|gstatic)/.test(t)) errors.push(m.type()+': '+t); });
  await page.goto(`http://127.0.0.1:${PORT}${pth}`,{waitUntil:'load'});
  await page.waitForFunction('document.querySelector("#stageTitle").textContent.length>0',{timeout:15000});
  if(!blockThree) await page.waitForFunction('window.__r&&window.__t',{timeout:15000});
  return {page,ctx,errors,net};
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// ---- kerangka uji sederhana ----
function suite(name){
  const rows=[]; 
  const t=async(id,desc,fn)=>{ let r; try{ const v=await fn(); r=(v===true||v===undefined)?{ok:true}:(v&&v.ok!==undefined?v:{ok:!!v}); }catch(e){ r={ok:false,note:'EXCEPTION '+e.message.split('\n')[0]}; }
    rows.push({id,desc,ok:r.ok,note:r.note||''}); console.log((r.ok?'PASS':'FAIL')+' '+id+' '+desc+(r.note?'  → '+r.note:'')); };
  const info=(id,desc,note)=>{ rows.push({id,desc,ok:null,note}); console.log('INFO '+id+' '+desc+'  → '+note); };
  const save=()=>{ fs.writeFileSync(path.join(__dirname,'results',name+'.json'),JSON.stringify(rows,null,2)); const f=rows.filter(r=>r.ok===false).length, n=rows.filter(r=>r.ok!==null).length; console.log(`\n[${name}] ${n-f}/${n} lulus, ${f} gagal, ${rows.length-n} info`); return rows; };
  return {t,save,rows,info};
}
// ---- helper UI ----
const rect=async(page,sel,i=0)=>page.evaluate((s,i)=>{const e=document.querySelectorAll(s)[i]; if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2};},sel,i);
const bubble=page=>page.evaluate(()=>document.querySelector('#bubble').hidden?'':document.querySelector('#bubbleText').textContent);
const boardCards=page=>page.evaluate(()=>[...document.querySelectorAll('#boardList .card')].map(c=>c.textContent.replace(/\s+/g,' ').trim()));
const click=(page,sel)=>page.click(sel);
async function mouseDrag(page,from,to,steps=8){ await page.mouse.move(from.x,from.y); await page.mouse.down(); await page.mouse.move(from.x+6,from.y+6,{steps:2}); await page.mouse.move(to.x,to.y,{steps}); await page.mouse.up(); }
async function dragPaletteToBoard(page,palIdx=0,boardIdx=null){
  const p=await rect(page,'#palette .card',palIdx); const n=(await boardCards(page)).length;
  let to; const b=await rect(page,'#board');
  if(boardIdx===null||n===0) to={x:b.cx,y:b.y+Math.min(b.h-10,40+n*56)}; else { const li=await rect(page,'#boardList li',Math.min(boardIdx,n-1)); to={x:li.cx,y:boardIdx>=n?li.y+li.h+6:li.y+4}; }
  await mouseDrag(page,{x:p.cx,y:p.cy},to);
}
async function waitIdle(page,ms=20000){ await page.waitForFunction('window.__t.getRunning()===false',{timeout:ms}); await sleep(150); }
async function runAndWait(page,sel='#btnRun'){ await page.click(sel); await sleep(120); await waitIdle(page); await sleep(1900); } // modal hasil muncul 1,6 dtk setelah menang (F16)
const overlayOpen=(page,id)=>page.evaluate(i=>!document.querySelector(i).hidden,id);
async function pickChoice(page,cardIdx,choices){ // choices: [[judulGrup,teks],...]
  await page.evaluate(i=>{ const e=document.querySelectorAll('#boardList .card')[i]; if(e) e.scrollIntoView({block:'center'}); },cardIdx); await sleep(40); // kartu di papan yang panjang bisa berada di luar layar
  const r=await rect(page,'#boardList .card',cardIdx); await page.mouse.click(r.cx,r.cy); await sleep(60);
  for(const [g,txt] of choices){ await page.evaluate((g,txt)=>{ const grp=[...document.querySelectorAll('#pickBody .pick-group')].find(x=>x.querySelector('h3').textContent===g); const b=[...grp.querySelectorAll('button')].find(b=>b.textContent.trim()===txt||b.textContent.includes(txt)); if(!b) throw new Error('pilihan tidak ada: '+g+'/'+txt); b.click(); },g,txt); }
  await page.click('#pickDone'); await sleep(60);
}
const ID_BY_IDX=['p0','b7','b8']; // kompatibilitas: indeks lama 0/1/2 = p0/b7/b8
async function openStage(page,id){ if(typeof id==='number') id=ID_BY_IDX[id]; await page.click('#btnMenu'); await sleep(60); await page.evaluate(i=>document.querySelector('.stage-item[data-id="'+i+'"]').click(),id); await sleep(250); }
module.exports={launch,newPage,sleep,suite,rect,bubble,boardCards,click,mouseDrag,dragPaletteToBoard,waitIdle,runAndWait,overlayOpen,pickChoice,openStage,PORTF:()=>PORT};
