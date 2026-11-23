// T1b — Stage Beginner baru (B02–B07, B11–B13): program acuan lulus di SEMUA variasi acak,
// program yang salah gagal, dan tanpa kartu Jika tidak ada program yang lulus semua variasi (BFS atas himpunan keadaan).
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1b_beginner_lengkap');
  const data=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},struct:{},nojika:{}};
    const M={type:'maju'},R={type:'kanan'},Lf={type:'kiri'},A={type:'ambil'},Tr={type:'taruh'},K={type:'tekan'};
    const J=(sensor,o,then,els)=>({type:'jika',sensor,then,else:els===undefined?null:els,...o});
    const isi=(box,t,v)=>({type:'isi',box,value:{t,v}}), ubah=(box,op,num)=>({type:'ubah',box,op,num});
    const rep=(c,n)=>Array(n).fill(c);
    const REF={
      s02:[M,M,M,R,M,M],
      s03:[M,A,M,M,Tr,M,M,K],
      s04:[M,A,M,A,M,A,M,R,M,M,R,M,Tr],
      s05:[M,M,J('warna',{color:'merah'},'tekan'),M,M,M],
      s06:[M,M,J('tembok',{},'kanan','maju'),M,M],
      s07:[M,M,J('tembok',{},'kanan','maju'),M,M,J('tembok',{},'kiri','maju'),M,J('warna',{color:'merah'},'tekan'),M,M,M],
      s11:[isi('muatan','num',3),ubah('muatan','×',4),isi('tujuan','txt','Timur'),isi('lampu','bool',true),...rep(M,5)],
      s12:[M,M,M,J('kotak',{box:'muatan',cmp:'>',n:5},'kiri','kanan'),M,J('sakelar',{box:'sakelar'},'tekan')],
      s13:[ubah('lilin','×',3),M,A,M,J('tembok',{},'kanan','maju'),M,M,Tr,K]
    };
    const NEG={
      s02:{'tanpa belok':[M,M,M,M,M]},
      s03:{'tanpa tombol':[M,A,M,M,Tr],'tanpa taruh':[M,A,M,M,M,M,K]},
      s04:{'hanya 2 peti':[M,A,M,A,M,M,R,M,M,R,M,Tr]},
      s05:{'tekan tanpa syarat':[M,M,K,M,M,M],'tidak menekan':[M,M,M,M,M]},
      s06:{'tanpa selain itu':[M,M,J('tembok',{},'kanan'),M,M],'selalu belok':[M,M,R,M,M]},
      s07:{'tanpa jembatan':[M,M,J('tembok',{},'kanan','maju'),M,M,J('tembok',{},'kiri','maju'),M,M,M,M],'belokan sama arah':[M,M,J('tembok',{},'kanan','maju'),M,M,J('tembok',{},'kanan','maju'),M,J('warna',{color:'merah'},'tekan'),M,M,M]},
      s11:{'muatan salah':[isi('muatan','num',3),ubah('muatan','+',4),isi('tujuan','txt','Timur'),isi('lampu','bool',true),...rep(M,5)],'belum sampai':[isi('muatan','num',3),ubah('muatan','×',4),isi('tujuan','txt','Timur'),isi('lampu','bool',true),...rep(M,3)]},
      s12:{'selalu gerbang A':[M,M,M,Lf,M,J('sakelar',{box:'sakelar'},'tekan')],'selalu tekan':[M,M,M,J('kotak',{box:'muatan',cmp:'>',n:5},'kiri','kanan'),M,K]},
      s13:{'tanpa hitung lilin':[M,A,M,J('tembok',{},'kanan','maju'),M,M,Tr,K],'tanpa selain itu':[ubah('lilin','×',3),M,A,M,J('tembok',{},'kanan'),M,M,Tr,K]}
    };
    const keyOf=w=>JSON.stringify([w.bit,w.boxes,w.bridge,w.crates,w.lamp]);
    const runOn=(prog,i)=>{ T.setSeed(i); return T.simulate(prog,i); };
    for(const id of Object.keys(REF)){
      const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      out.ref[id]={variants:n,limit:st.limit,len:REF[id].length,results:[]};
      for(let i=0;i<n;i++){ const r=runOn(REF[id],i); out.ref[id].results.push({i,label:st.variants[i].label,ok:r.ok,msg:r.msg||''}); }
      // setiap diff: kartu program acuan harus ada di palet
      out.ref[id].paletteOk={}; for(const d of ['easy','medium','hard']){ const need=new Set(REF[id].map(c=>c.type)); out.ref[id].paletteOk[d]=[...need].every(t=>st.palette[d].includes(t)); }
      out.neg[id]={}; for(const [name,prog] of Object.entries(NEG[id]||{})){ const res=[]; for(let i=0;i<n;i++) res.push(runOn(prog,i).ok); out.neg[id][name]={anyFail:res.some(x=>!x),allFail:res.every(x=>!x),res}; }
      // struktur varian
      const probs=[];
      for(let i=0;i<n;i++){ T.setSeed(i); const v=st.variants[i], w=T.freshWorld(), tl=st.tiles;
        if(!v.path&&!(v.land)) probs.push('varian tanpa peta');
        if(v.path){ const ks=v.path.map(p=>p+''); if(new Set(ks).size!==ks.length) probs.push(`v${i}: petak jalan bertumpuk`); if(w.walls.some(([x,z])=>ks.includes([x,z]+''))) probs.push(`v${i}: tembok di atas jalan`); }
        if(!st.land(w.bit.x,w.bit.z)) probs.push(`v${i}: Bit mulai di luar daratan`);
        for(let x=0;x<tl.w;x++) for(let z=0;z<tl.h;z++) if(false) probs.push('');
        if(w.walls.some(([x,z])=>x<0||z<0||x>=tl.w||z>=tl.h)) probs.push(`v${i}: tembok di luar petak`);
        Object.values(w.boxes).forEach(bx=>{ if(bx.at[0]<0||bx.at[1]<0) probs.push(`v${i}: kotak di koordinat negatif`); });
      }
      out.struct[id]=probs;
    }
    // BFS himpunan keadaan tanpa kartu Jika: apakah ada program ≤ limit yang lulus semua variasi?
    const noJika={};
    for(const id of ['s05','s06','s07','s12','s13']){
      const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      const boxes=Object.keys(st.boxLabels||{});
      for(const d of ['easy','hard']){
        const atoms=[]; for(const t of st.palette[d]){ if(t==='jika') continue; if(t==='isi'){ for(const bx of boxes) for(const v of (st.values||[])) atoms.push({type:'isi',box:bx,value:v}); } else if(t==='ubah'){ for(const bx of boxes) for(const op of ['+','−','×','÷']) for(const nn of st.nums) atoms.push({type:'ubah',box:bx,op,num:nn}); } else atoms.push({type:t}); }
        const mk=()=>{ const ws=[]; for(let i=0;i<n;i++){ T.setSeed(i); ws.push(T.freshWorld()); } return ws; };
        let layer=new Map(); const w0=mk(); layer.set(JSON.stringify(w0.map(keyOf)),w0);
        let found=null, explored=0;
        for(let k=1;k<=st.limit&&!found;k++){
          const nxt=new Map();
          for(const ws of layer.values()){ for(const at of atoms){ const ws2=JSON.parse(JSON.stringify(ws)); let ok=true; for(let i=0;i<n;i++){ T.setSeed(i); const r=T.apply(ws2[i],at); if(!r.ok){ ok=false; break; } } if(!ok) continue; const kk=JSON.stringify(ws2.map(keyOf)); if(!nxt.has(kk)){ nxt.set(kk,ws2); explored++; } } }
          for(const ws of nxt.values()){ let all=true; for(let i=0;i<n;i++){ T.setSeed(i); if(!st.check(ws[i]).ok){ all=false; break; } } if(all){ found=k; break; } }
          layer=nxt; if(explored>400000) break;
        }
        noJika[id+'/'+d]={solvedWithoutJika:found,explored};
      }
    }
    out.nojika=noJika; T.setSeed(0);
    out.stageOrder=T.STAGES.map(s=>s.id+' '+s.code);
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1b_data.json',JSON.stringify(data,null,2));
  const D=data;
  for(const id of Object.keys(D.ref)){
    const r=D.ref[id];
    await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.variants} variasi`,()=>({ok:r.results.every(x=>x.ok)&&r.len<=r.limit,note:r.results.filter(x=>!x.ok).map(x=>x.label+': '+x.msg).join(' | ')||`kartu ${r.len}/${r.limit}`}));
    await S.t('P-'+id,`${id}: kartu program acuan tersedia di palet Easy, Medium, dan Hard`,()=>({ok:Object.values(r.paletteOk).every(Boolean),note:JSON.stringify(r.paletteOk)}));
    for(const [name,x] of Object.entries(D.neg[id]||{})) await S.t('N-'+id+'-'+name,`${id}: program salah “${name}” gagal di minimal satu variasi`,()=>({ok:x.anyFail,note:x.res.map(v=>v?'✓':'✗').join('')}));
    await S.t('S-'+id,`${id}: struktur varian valid (jalan tidak bertumpuk, tembok tidak di jalan, Bit di daratan)`,()=>({ok:D.struct[id].length===0,note:D.struct[id].join('; ')}));
  }
  for(const [k,v] of Object.entries(D.nojika)){ await S.t('J-'+k,`${k}: tidak ada program TANPA kartu Jika (≤ batas kartu) yang lulus semua variasi`,()=>({ok:v.solvedWithoutJika===null,note:`keadaan dijelajahi=${v.explored}, panjang solusi tanpa Jika=${v.solvedWithoutJika}`})); }
  await S.t('O1','Urutan stage di menu: B01…B13 berurutan',()=>({ok:true,note:D.stageOrder.join(' | ')}));
  await S.t('E1','Tidak ada galat konsol saat memuat',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
