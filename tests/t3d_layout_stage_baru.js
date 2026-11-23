// T3d — Tata letak stage baru: tombol kontrol harus terlihat dan papan harus memuat ≥ 2 baris kartu, per stage × tingkat × layar.
const L=require('./lib'); const fs=require('fs');
const VP=(process.env.T3D_VP||'360x740,390x844,667x375,844x390').split(',');
const IDS=(process.env.T3D_IDS||'s02,s03,s04,s05,s06,s07,s11,s12,s13,j01,j02,j03,j04,j05,j06,j07,j08,j09,j10,j11,j12,j13,j14,ma01,ma02,ma03,ma04,ma05,ma06,ma07,ma08,ma09,ma10,mb01,mb02,mb03,mb04,mb05,mb06,mb07,mb08,mb09,mb10,se01,se02,se03,se04,se05,se06,se07,se08,se09,se10,ex01,ex02,ex03,ex04,ex05,ex06,ex07,ex08,ex09,ex10').split(',');
(async()=>{
  const S=L.suite('t3d_layout_stage_baru'+(process.env.T3D_VP?'_'+process.env.T3D_VP.replace(/x/g,'_').replace(/,/g,'-'):'')); const out=[];
  for(const v of VP){ const [w,h]=v.split('x').map(Number);
    const b=await L.launch();
    try{
      const {page:p,ctx}=await L.newPage(b,{w,h,dpr:2,touch:true});
      for(const id of IDS) for(const d of ['easy','medium','hard']){
        await L.openStage(p,id); await p.select('#diff',d); await L.sleep(250); try{ await p.click('#bubbleClose'); }catch(e){} await L.sleep(100);
        // tambah 3 kartu pertama dengan mengetuk
        for(let i=0;i<3;i++){ const r=await L.rect(p,'#palette .card',0); if(r) await p.touchscreen.tap(r.cx,r.cy); await L.sleep(80); }
        const m=await p.evaluate(()=>{ const R=s=>document.querySelector(s).getBoundingClientRect(); const run=R('#btnRun'), bd=R('#board'), wd=R('#worldWrap'), pal=R('#palette');
          const ctl=['#btnRun','#btnStep','#btnReset','#btnHint'].map(s=>{const r=R(s);return Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,0))/r.height;});
          return {vh:innerHeight,controlsFull:ctl.every(x=>x>=0.99),boardH:Math.round(bd.height),worldH:Math.round(wd.height),palH:Math.round(pal.height),runBottom:Math.round(run.bottom)}; });
        out.push({vp:v,id,d,...m});
        await S.t(`${v}-${id}-${d}`,`${v} ${id}/${d}: tombol kontrol terlihat penuh, dunia ≥ 150 px, papan ≥ 100 px`,()=>({ok:m.controlsFull&&m.worldH>=150&&m.boardH>=100,note:`kontrol ${m.runBottom}/${m.vh}; dunia ${m.worldH}; papan ${m.boardH}; palet ${m.palH}`}));
      }
      await ctx.close();
    } finally { await b.close(); }
  }
  fs.writeFileSync(__dirname+'/results/t3d_data'+(process.env.T3D_VP?'_'+process.env.T3D_VP:'')+'.json',JSON.stringify(out,null,1));
  S.save(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
