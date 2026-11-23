// T1k — Senior: bukti eksak bahwa tidak ada jalan pintas di SE10 (pencarian ruang keadaan), SE09 lengkap, dan batas panjang intro per halaman.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t1k_senior_ablasi');
  const {page:p}=await L.newPage(b,{w:1280,h:720});
  const R=await p.evaluate(()=>{
    const T=window.__t, st=T.STAGES.find(s=>s.id==='se10'); T.setStage(st);
    const K=(n,j=1,a='pesan')=>({type:'kirim',alamat:'/barang',aksi:a,nama:n,jumlah:j});
    const ALL={kK:K('Kayu'),kP:K('Paku'),kC:K('Cat'),kK2:K('Kayu',2),kP2:K('Paku',2),kKl:K('Kayu',1,'lihat'),kPl:K('Paku',1,'lihat'),
      jH:{type:'jikaS',syarat:'habis',maka:'cadangan'},jU:{type:'jikaS',syarat:'ujiGagal',maka:'pulih'},jHp:{type:'jikaS',syarat:'habis',maka:'pulih'},jUc:{type:'jikaS',syarat:'ujiGagal',maka:'cadangan'},
      sv:{type:'simpan'},mK:{type:'masukBahan',bahan:'Kayu'},mP:{type:'masukBahan',bahan:'Paku'},mC:{type:'masukBahan',bahan:'Cat'},bp:{type:'buatPeti'},
      pB:{type:'kirimPeti',pulau:'Pulau Barat'},pT:{type:'kirimPeti',pulau:'Pulau Timur'}};
    const V=st.variants;
    const ap=(v,w,card)=>{ stage=st; if(card.type==='jikaS'){ if(!v.sysSense(w.sys,card.syarat)) return {ok:true}; return v.sysApply(w.sys,{type:'aksi',id:card.maka})||{ok:true}; } return v.sysApply(w.sys,card)||{ok:true}; };
    const run=(excl,maxD,cap)=>{ const keys=Object.keys(ALL).filter(k=>!excl.includes(k)); const ws0=V.map(v=>v.init()); let layer=[{ws:ws0,path:[]}]; const seen=new Set(); let passes=[],n=0,capped=false;
      const ser=ws=>JSON.stringify(ws.map(w=>{const o={...w.sys};delete o.log;delete o.terima;return o;})); seen.add(ser(ws0));
      for(let d=0;d<maxD&&layer.length&&!capped;d++){ const next=[];
        for(const node of layer){ for(const k of keys){ const nws=node.ws.map(w=>JSON.parse(JSON.stringify(w))); let ok=true; for(let i=0;i<nws.length&&ok;i++) ok=ap(V[i],nws[i],ALL[k]).ok; if(!ok) continue;
          const sg=ser(nws); if(seen.has(sg)) continue; seen.add(sg); n++; if(n>cap){capped=true;break;} const path=[...node.path,k]; if(V.every((v,i)=>v.check(nws[i]).ok)) passes.push(path); next.push({ws:nws,path}); } if(capped) break; } layer=next; }
      return {n,capped,passN:passes.length,min:passes.length?Math.min(...passes.map(x=>x.length)):null,sample:passes[0]||null}; };
    const X=['kC','kK2','kP2','kKl','kPl','mC'], out={};
    out.full=run(X,13,1500000); out.noJH=run([...X,'jH'],13,1500000); out.noJU=run([...X,'jU'],13,1500000); out.noSv=run([...X,'sv'],13,1500000); out.noBp=run([...X,'bp'],13,1500000);
    out.noPeti=run([...X,'mK','mP'],13,1500000);
    // SE09 lengkap
    const s9=T.STAGES.find(s=>s.id==='se09'); T.setStage(s9); const tk=[...['build','uji','staging'].map(t=>({type:'gerbang',tahap:t})),...['beban','kesehatan','pengguna'].map(m=>({type:'pantau',metrik:m})),...[1,2,3,5].map(k=>({type:'rollback',kapan:k}))]; let n9=0,p9=[];
    const rec=pr=>{ if(pr.length){ n9++; if(pr.length<=s9.limit&&s9.variants.every((v,i)=>T.simulate(pr,i).ok)) p9.push(pr.map(c=>c.type+(c.tahap||c.kapan||c.metrik)).join(' ')); } if(pr.length>=s9.limit+2) return; for(const t of tk) rec([...pr,t]); }; rec([]);
    out.se09={tried:n9,pass:p9};
    return out; });
  const f=R.full;
  await S.t('A1','SE10: pencarian ruang keadaan penuh selesai (tanpa batas) dan menemukan program lulus terpendek 12 kartu',async()=>({ok:!f.capped&&f.passN>0&&f.min===12,note:JSON.stringify(f)}));
  await S.t('A2','SE10: tanpa “Jika jawaban stok habis” tidak ada program yang lulus',async()=>({ok:!R.noJH.capped&&R.noJH.passN===0,note:JSON.stringify(R.noJH)}));
  await S.t('A3','SE10: tanpa “Jika uji gagal → kembali ke versi tersimpan” tidak ada program yang lulus',async()=>({ok:!R.noJU.capped&&R.noJU.passN===0,note:JSON.stringify(R.noJU)}));
  await S.t('A4','SE10: tanpa Simpan versi tidak ada program yang lulus',async()=>({ok:!R.noSv.capped&&R.noSv.passN===0,note:JSON.stringify(R.noSv)}));
  await S.t('A5','SE10: tanpa Buat peti, atau tanpa memasukkan bahan, tidak ada program yang lulus',async()=>({ok:!R.noBp.capped&&R.noBp.passN===0&&!R.noPeti.capped&&R.noPeti.passN===0,note:JSON.stringify({bp:R.noBp,peti:R.noPeti})}));
  await S.t('A6','SE09: seluruh ruang program ≤ batas+2 kartu hanya memuat 3 jawaban (gerbang staging, pemantau keluhan pengguna, rollback segera; pemantau sebelum rollback)',async()=>({ok:R.se09.pass.length===3&&R.se09.pass.every(x=>/gerbangstaging/.test(x)&&/pantaupengguna/.test(x)&&/rollback1/.test(x)&&x.indexOf('pantau')<x.indexOf('rollback')),note:JSON.stringify(R.se09)}));
  const I=await p.evaluate(()=>window.__t.STAGES.filter(s=>/^(se|ex)/.test(s.id)).map(s=>[s.id,s.intro]));
  const pag=(t,lim)=>{const parts=t.match(/[^.!?]+[.!?]*\s*/g)||[t];const pages=[];let cur="";for(const x of parts){if(cur&&(cur+x).length>lim){pages.push(cur.trim());cur=x}else cur+=x}if(cur.trim())pages.push(cur.trim());return pages};
  await S.t('P1','Intro Senior dan Expert: paling banyak 4 halaman dan tiap halaman ≤ 100 karakter (ukuran layar HP, batas halaman 80)',async()=>{ const bad=I.map(([id,t])=>{const pg=pag(t,80);return {id,n:pg.length,mx:Math.max(...pg.map(x=>x.length))}}).filter(x=>x.n>4||x.mx>100); return {ok:bad.length===0,note:bad.length?JSON.stringify(bad):'13 intro ringkas'}; });
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
