// T3c — Pada jumlah kartu berapa tiap tombol kontrol keluar dari layar? (Stage Pengantar, kartu ditambah dengan ketuk)
const L=require('./lib'); const fs=require('fs');
(async()=>{
  const b=await L.launch(); const out={};
  for(const v of [{n:'360x740',w:360,h:740},{n:'390x844',w:390,h:844},{n:'667x375',w:667,h:375},{n:'844x390',w:844,h:390}]){
    const {page:p,ctx}=await L.newPage(b,{w:v.w,h:v.h,dpr:2,touch:true}); out[v.n]=[];
    const vis=()=>p.evaluate(()=>{const f=s=>{const e=document.querySelector(s); if(e.offsetParent===null) return 'disembunyikan'; const r=e.getBoundingClientRect();const vis=Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0))/r.height;return vis>=0.99?'penuh':vis<=0.01?'HILANG':Math.round(vis*100)+'%';};
      return {run:f('#btnRun'),step:f('#btnStep'),reset:f('#btnReset'),hint:f('#btnHint'),trash:f('#trash')};});
    out[v.n].push({kartu:0,...await vis()});
    for(let i=1;i<=8;i++){ const r=await L.rect(p,'#palette .card',0); await p.touchscreen.tap(r.cx,r.cy); await L.sleep(90); if([1,2,3,4,6,8].includes(i)) out[v.n].push({kartu:i,...await vis()}); }
    await ctx.close();
  }
  fs.writeFileSync(__dirname+'/results/t3c_visibilitas_data.json',JSON.stringify(out,null,2));
  for(const [k,a] of Object.entries(out)){ console.log(k); for(const r of a) console.log('  kartu',r.kartu,'| Jalankan',r.run,'| Langkah',r.step,'| Ulang',r.reset,'| Hint',r.hint,'| Sampah',r.trash); }
  await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
