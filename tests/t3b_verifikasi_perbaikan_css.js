// T3b — Memverifikasi USULAN perbaikan CSS (disuntikkan ke halaman uji; file asli TIDAK diubah).
const L=require('./lib'); const fs=require('fs'); const EV=__dirname+'/evidence/';
const CSS_A="#editor{min-height:0}";
const CSS_B=CSS_A+`
@media (orientation:landscape) and (max-width:760px){
  main{flex-direction:row} #worldWrap{flex:0 0 52%} #editor{border-top:0;border-left:2px solid var(--line);flex:1 1 48%}
  .palette{flex-wrap:wrap;overflow:visible}
}
@media (max-height:450px){ .topbar{padding:2px 8px;gap:6px} .brand{font-size:16px} .zone-label{display:none} .controls{gap:6px} .ctl{padding:2px 10px;min-height:44px} .bubble{padding:6px 40px 6px 8px} .bubble p{font-size:14px} .stage-title{padding:2px 8px;font-size:14px} .stage-title span{display:none} }`;
const m=p=>p.evaluate(()=>{ const R=s=>{const r=document.querySelector(s).getBoundingClientRect();return {y:Math.round(r.y),h:Math.round(r.height),w:Math.round(r.width)}}; const c=R('.controls'),w=R('#worldWrap'),b=R('#board');
  const tops=new Set([...document.querySelectorAll('.controls > *')].map(e=>Math.round(e.getBoundingClientRect().top)));
  return {vh:innerHeight,controlsBottom:c.y+c.h,controlsVisible:c.y+c.h<=innerHeight,controlRows:tops.size,worldH:w.h,worldW:w.w,boardH:b.h,boardRows:Math.floor((b.h-16)/54)}; });
(async()=>{
  const b=await L.launch(); const S=L.suite('t3b_verifikasi_css'); const out={};
  for(const v of [{n:'360x740',w:360,h:740,dpr:2},{n:'390x844',w:390,h:844,dpr:2},{n:'667x375',w:667,h:375,dpr:2},{n:'844x390',w:844,h:390,dpr:2}]){
    out[v.n]={};
    for(const [label,css] of [['asli',''],['A: #editor{min-height:0}',CSS_A],['B: A + landscape + layar pendek',CSS_B]]){
      const {page:p,ctx}=await L.newPage(b,{w:v.w,h:v.h,dpr:v.dpr,touch:true});
      if(css) await p.addStyleTag({content:css});
      await L.openStage(p,1); await p.click('#bubbleClose'); await L.sleep(100);
      for(let i=0;i<3;i++){ const r=await L.rect(p,'#palette .card',0); await p.touchscreen.tap(r.cx,r.cy); await L.sleep(120); }
      out[v.n][label]=await m(p);
      if(label.startsWith('B')) await p.screenshot({path:EV+`perbaikan_B_${v.n}.png`});
      await ctx.close();
    }
  }
  fs.writeFileSync(__dirname+'/results/t3b_data.json',JSON.stringify(out,null,2));
  for(const [vp,o] of Object.entries(out)) for(const [lab,r] of Object.entries(o)) console.log(vp.padEnd(8),lab.padEnd(34),`kontrol terlihat=${r.controlsVisible} (dasar ${r.controlsBottom}/${r.vh}) baris=${r.controlRows} dunia=${r.worldW}×${r.worldH} papan=${r.boardH}px (${r.boardRows} baris)`);
  for(const vp of Object.keys(out)){ const a=out[vp]['A: #editor{min-height:0}'], bb=out[vp]['B: A + landscape + layar pendek'];
    await S.t('V-'+vp+'-A','Usulan A (#editor{min-height:0}) membuat tombol kontrol terlihat',()=>({ok:a.controlsVisible,note:`dasar kontrol ${a.controlsBottom}/${a.vh}`}));
    await S.t('V-'+vp+'-B','Usulan B (A + landscape + layar pendek) membuat tombol kontrol terlihat DAN dunia ≥ 200 px tinggi',()=>({ok:bb.controlsVisible&&bb.worldH>=200,note:`kontrol ${bb.controlsBottom}/${bb.vh}; dunia ${bb.worldW}×${bb.worldH}; papan ${bb.boardH}px`})); }
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
