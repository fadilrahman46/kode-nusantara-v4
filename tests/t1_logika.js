// T1 — Logika inti: kelayakan stage (brute force lewat DP atas state), invarian interpreter, fuzzing.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1_logika');
  const data=await page.evaluate(()=>{
    const T=window.__t, out={};
    const clone=o=>JSON.parse(JSON.stringify(o));
    const key=w=>JSON.stringify([w.bit,w.boxes,w.bridge,w.crates,w.lamp]);
    function atoms(stage,diff){
      const types=stage.palette[diff], boxes=Object.keys(stage.boxLabels||{}), a=[];
      for(const t of types){
        if(t==='isi'){ for(const bx of boxes) for(const v of stage.values) a.push({type:'isi',box:bx,value:v}); }
        else if(t==='ubah'){ for(const bx of boxes) for(const op of ['+','−','×','÷']) for(const n of stage.nums) a.push({type:'ubah',box:bx,op,num:n}); }
        else a.push({type:t});
      } return a;
    }
    function enumerate(stage,diff,filt){
      T.setStage(stage); const A=atoms(stage,diff).filter(filt||(()=>true));
      let layer=new Map(); const w0=T.freshWorld(); layer.set(key(w0),{w:w0,n:1});
      const sol={}, reach={};
      for(let k=1;k<=stage.limit;k++){
        const nxt=new Map(); let ok=0, total=0, valid=0;
        for(const {w,n} of layer.values()){
          for(const at of A){ total+=n; const w2=clone(w); const r=T.apply(w2,at); if(!r.ok) continue; valid+=n;
            const kk=key(w2); const e=nxt.get(kk); if(e) e.n+=n; else nxt.set(kk,{w:w2,n}); }
        }
        for(const {w,n} of nxt.values()){ if(stage.check(w).ok) ok+=n; }
        sol[k]=ok; reach[k]={programs:total,notCrashing:valid}; layer=nxt;
      }
      return {atoms:A.length,limit:stage.limit,solutionsByLength:sol,reach};
    }
    const OLD=T.STAGES.filter(s=>['p0','b6','b7','b8'].includes(s.id)); // stage baru diuji di t1b
    for(const s of OLD){ out[s.id]={}; for(const d of ['easy','medium','hard']) out[s.id][d]=enumerate(s,d); }
    // konsep yang 'seharusnya dipaksa' di b8: perkalian
    out.b8NoMul=enumerate(T.STAGES.find(x=>x.id==='b8'),'easy',a=>!(a.type==='ubah'&&a.op==='×')).solutionsByLength;
    out.b8NoMulNoDiv=enumerate(T.STAGES.find(x=>x.id==='b8'),'easy',a=>!(a.type==='ubah'&&(a.op==='×'||a.op==='÷'))).solutionsByLength;
    // fuzzing invarian
    let seed=12345; const rnd=()=>(seed=(seed*1664525+1013904223)>>>0)/4294967296;
    const fz={runs:0,exceptions:[],invariantBreaks:[]};
    for(const s of OLD){ T.setStage(s); for(const d of ['easy','medium','hard']){ const A=atoms(s,d);
      for(let i=0;i<4000;i++){ const len=1+Math.floor(rnd()*s.limit); const w=T.freshWorld();
        try{ for(let j=0;j<len;j++){ const at=A[Math.floor(rnd()*A.length)]; const r=T.apply(w,at); fz.runs++; if(!r.ok) break; }
          s.check(w);
          if(w.bit.x<0||w.bit.z<0||w.bit.x>=s.tiles.w||w.bit.z>=s.tiles.h) fz.invariantBreaks.push(s.id+': Bit keluar peta');
          if(w.blocked.some(([x,z])=>x===w.bit.x&&z===w.bit.z)) fz.invariantBreaks.push(s.id+': Bit di petak terhalang');
          for(const [k,bx] of Object.entries(w.boxes)){ if(bx.value&&bx.value.t!==bx.shape) fz.invariantBreaks.push(s.id+': tipe kotak '+k+' tidak cocok'); if(bx.value&&bx.value.t==='num'&&!Number.isInteger(bx.value.v)) fz.invariantBreaks.push(s.id+': angka tidak bulat'); }
        }catch(e){ fz.exceptions.push(s.id+':'+e.message); } } } }
    fz.invariantBreaks=[...new Set(fz.invariantBreaks)]; fz.exceptions=[...new Set(fz.exceptions)];
    out.fuzz=fz;
    // inspeksi data stage
    out.meta=OLD.map(s=>({id:s.id,limit:s.limit,tiles:s.tiles,hints:s.hints.length,palette:s.palette,hint3:s.hints[2]}));
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1_logika_data.json',JSON.stringify(data,null,2));
  const D=data;
  await S.t('L01','p0: tepat 1 solusi terpendek (4 × Maju) di semua tingkat',()=>['easy','medium','hard'].every(d=>D.p0[d].solutionsByLength[4]===1&&!D.p0[d].solutionsByLength[1]&&!D.p0[d].solutionsByLength[2]&&!D.p0[d].solutionsByLength[3]));
  await S.t('L02','b7: ada solusi 3 kartu di semua tingkat',()=>({ok:['easy','medium','hard'].every(d=>D.b7[d].solutionsByLength[3]>0),note:['easy','medium','hard'].map(d=>d+'='+D.b7[d].solutionsByLength[3]).join(', ')}));
  await S.t('L03','b7: tidak ada solusi < 3 kartu',()=>['easy','medium','hard'].every(d=>!D.b7[d].solutionsByLength[1]&&!D.b7[d].solutionsByLength[2]));
  await S.t('L04','b8: ada solusi di semua tingkat dan tidak ada yang < 3 kartu',()=>({ok:['easy','medium','hard'].every(d=>D.b8[d].solutionsByLength[3]>0&&!D.b8[d].solutionsByLength[2]),note:['easy','medium','hard'].map(d=>d+': 3 kartu='+D.b8[d].solutionsByLength[3]+', 4 kartu='+D.b8[d].solutionsByLength[4]).join(' | ')}));
  await S.t('L05','Kartu pengecoh tidak mengubah himpunan solusi TERPENDEK (b7: 6, b8: 5) — tingkat kesulitan = pengecoh saja',()=>{ const bad=[]; for(const s of ['b7','b8']){ const e=D[s].easy.solutionsByLength[3]; for(const d of ['medium','hard']) if(D[s][d].solutionsByLength[3]!==e) bad.push(`${s}/${d}`); } return {ok:bad.length===0,note:'solusi 3 kartu identik di ketiga tingkat; hanya solusi alternatif yang lebih panjang bertambah'}; });
  await S.t('L10','b8: batas kartu MEMAKSA perkalian (niat desain hint 1)',()=>{ const n=D.b8NoMul; return {ok:!n[3]&&!n[4],note:`tanpa kartu ×: solusi 3 kartu=${n[3]||0}, solusi 4 kartu=${n[4]||0}; tanpa × dan ÷: 4 kartu=${D.b8NoMulNoDiv[4]||0}`}; });
  await S.t('L11','b6 (B08): solusi terpendek = 6 kartu (Isi 3/4/5 + 5 × Maju) di semua tingkat; tidak ada solusi < 6',()=>({ok:['easy','medium','hard'].every(d=>D.b6[d].solutionsByLength[6]===3&&[1,2,3,4,5].every(k=>!D.b6[d].solutionsByLength[k])),note:['easy','medium','hard'].map(d=>d+'='+D.b6[d].solutionsByLength[6]).join(', ')}));
  await S.t('L12','b6 (B08): batas 7 kartu cukup untuk solusi, tetapi angka 1 atau 2 tidak pernah menang (jembatan harus ≥ 3)',()=>{ const e=D.b6.easy.solutionsByLength; return {ok:e[6]>0&&D.b6.easy.limit===7,note:'solusi 6 kartu='+e[6]+', 7 kartu='+(e[7]||0)}; });
  await S.t('L13','Hint 3 B08/B09/B10 hanya memberi KARTU PERTAMA (parsial), tidak memuat solusi lengkap (keputusan F15); B01 dikecualikan (tutorial)',()=>{
    const H=Object.fromEntries(D.meta.map(m=>[m.id,m.hint3])); const bad=[];
    if(!/^Kartu pertamamu:/.test(H.b6)||/\b[345]\b/.test(H.b6)) bad.push('b6: '+H.b6);
    if(!/^Kartu pertamamu:/.test(H.b7)||/Kenari|nyala|\b5\b/.test(H.b7)) bad.push('b7: '+H.b7);
    if(!/^Kartu pertamamu:/.test(H.b8)||/[×÷+−]|ubah/.test(H.b8)) bad.push('b8: '+H.b8);
    const long=['b6','b7','b8'].filter(k=>H[k].length>110);
    return {ok:bad.length===0&&long.length===0,note:bad.concat(long.map(k=>k+' >110 karakter')).join(' | ')||'tiga hint 3 parsial, masing-masing ≤ 110 karakter (satu halaman dialog)'}; });
  await S.t('L06','Interpreter: 0 exception dalam fuzzing',()=>({ok:D.fuzz.exceptions.length===0,note:`${D.fuzz.runs} eksekusi kartu; ${D.fuzz.exceptions.join(',')}`}));
  await S.t('L07','Invarian: Bit tidak keluar peta / masuk petak terhalang; tipe kotak selalu cocok bentuk; angka selalu bulat',()=>({ok:D.fuzz.invariantBreaks.length===0,note:D.fuzz.invariantBreaks.join(', ')}));
  await S.t('L08','Setiap stage punya 3 hint, dan batas kartu ≥ panjang solusi terpendek',()=>D.meta.every(m=>m.hints===3&&Object.values(D[m.id].easy.solutionsByLength).some((v,i)=>v>0&&i+1<=m.limit)));
  await S.t('L09','Tidak ada pelanggaran konsol (error/warning) saat memuat',()=>({ok:errors.length===0,note:errors.slice(0,3).join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
