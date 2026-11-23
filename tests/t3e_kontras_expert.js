// T3e — kontras dasbor Expert (EX04, EX07, EX08, EX09, EX10) setelah Jalankan: tabel detak dan catatan, mode terang dan gelap.
const L=require('./lib');
let bad=0;
(async()=>{const b=await L.launch();for(const dark of [true,false]){const {page:p}=await L.newPage(b,{w:1280,h:720,dark}); for(const [id,prog] of [['ex04',[{id:'a',type:'pekerja',jumlah:1},{id:'b',type:'penyangga',ukuran:6}]],['ex07',[{id:'a',type:'rak',kebijakan:'fifo',ukuran:2}]],['ex09',[{id:'a',type:'cadangan'},{id:'b',type:'coba',kali:2,jeda:2}]],['ex08',[{id:'a',type:'server',jumlah:2},{id:'b',type:'strategi',cara:'satu'}]],['ex10',[{id:'a',type:'skala',naik:4,turun:2},{id:'b',type:'server',jumlah:2}]]]){
await p.evaluate(ID=>{const T=window.__t;T.loadStage(T.STAGES.find(s=>s.id===ID));},id);await L.sleep(300);
await p.evaluate(pr=>window.__t.setProgram(pr),prog);await p.click('#btnRun');await L.sleep(3500);
const r=await p.evaluate(()=>{const root=document.querySelector('#sysView');const pc=s=>{const m=s.match(/[\d.]+/g).map(Number);return{r:m[0],g:m[1],b:m[2],a:m[3]==null?1:m[3]}};const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)};
const bgOf=e=>{for(;e;e=e.parentElement){const c=pc(getComputedStyle(e).backgroundColor);if(c.a>.9)return c}return{r:255,g:255,b:255,a:1}};let worst=99,who='',n=0;
root.querySelectorAll('*').forEach(e=>{if(![...e.childNodes].some(x=>x.nodeType===3&&x.textContent.trim()))return;n++;const f=pc(getComputedStyle(e).color),g=bgOf(e);const a=lum(f),c=lum(g);const cr=(Math.max(a,c)+.05)/(Math.min(a,c)+.05);if(cr<worst){worst=cr;who=e.className+':'+e.textContent.trim().slice(0,20)}});return{worst:+worst.toFixed(2),who,n,rows:root.querySelectorAll('tbody tr').length}});
const ok=r.worst>=4.5&&r.rows>=1; if(!ok) bad++; console.log((ok?'PASS ':'FAIL ')+'K-'+id+'-'+(dark?'gelap':'terang')+' kontras tabel+catatan setelah Jalankan ≥ 4,5:1 → '+JSON.stringify(r));} }
console.log('[t3e_kontras_expert] '+(bad?bad+' gagal':'semua lulus')); await b.close();process.exit(bad?1:0)})()
