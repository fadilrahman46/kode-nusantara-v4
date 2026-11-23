// T1l — Expert (EX01–EX03): mesin aturan + detak. Acuan, cara salah, dan pembuktian jalan pintas dengan menelusuri SEMUA himpunan aturan dalam batas kartu.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t1l_expert');
  const {page:p,errors}=await L.newPage(b,{w:1280,h:720});
  const D=await p.evaluate(()=>{
    const T=window.__t, A=(a,b)=>({type:'aturan',ketika:a,maka:b}), out={ref:{},neg:{},abl:{},misc:{}};
    const REF={ex01:[A('pesananMasuk','kemas'),A('petiSiap','kirim'),A('petiTerkirim','beriTahu')],
      ex02:[A('pesananKecil','kemas'),A('pesananBesar','periksaStok'),A('stokCukup','kemas'),A('stokKurang','pesanPemasok'),A('petiSiap','kirim'),A('petiTerkirim','beriTahu')],
      ex03:[A('komitBaru','jalankanUji'),A('ujiLulus','kemas'),A('petiSiap','kirimProduksi'),A('ujiGagal','beriTahuDev')]};
    const NEG={
      ex01:{'masuk langsung dikirim':[A('pesananMasuk','kirim')],'tanpa memberi tahu':[A('pesananMasuk','kemas'),A('petiSiap','kirim')],'tanpa mengirim':[A('pesananMasuk','kemas'),A('petiTerkirim','beriTahu')],'menghapus pesanan':[A('pesananMasuk','hapusPesanan')],'memberi tahu sebelum terkirim':[A('pesananMasuk','kemas'),A('petiSiap','beriTahu'),A('petiSiap','kirim')],'hanya pengecoh':[A('stokMenipis','cetakFaktur'),A('jamSibuk','cetakFaktur')]},
      ex02:{'tanpa cabang stok kurang':[A('pesananKecil','kemas'),A('pesananBesar','periksaStok'),A('stokCukup','kemas'),A('petiSiap','kirim'),A('petiTerkirim','beriTahu')],'besar langsung dikemas':[A('pesananKecil','kemas'),A('pesananBesar','kemas'),A('petiSiap','kirim'),A('petiTerkirim','beriTahu')],'tanpa kemas setelah stok cukup':[A('pesananKecil','kemas'),A('pesananBesar','periksaStok'),A('stokKurang','pesanPemasok'),A('petiSiap','kirim'),A('petiTerkirim','beriTahu')]},
      ex03:{'tanpa uji (langsung kemas)':[A('komitBaru','kemas'),A('petiSiap','kirimProduksi'),A('ujiGagal','beriTahuDev')],'tanpa memberi tahu pengembang':[A('komitBaru','jalankanUji'),A('ujiLulus','kemas'),A('petiSiap','kirimProduksi')],'tanpa mengirim':[A('komitBaru','jalankanUji'),A('ujiLulus','kemas'),A('ujiGagal','beriTahuDev')],'menghapus komit gagal':[A('komitBaru','jalankanUji'),A('ujiLulus','kemas'),A('petiSiap','kirimProduksi'),A('ujiGagal','hapusKomit')],'kirim saat uji lulus (tanpa kemas)':[A('komitBaru','jalankanUji'),A('ujiLulus','kirimProduksi'),A('ujiGagal','beriTahuDev')]}};
    for(const id of Object.keys(REF)){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      out.ref[id]={ok:st.variants.every((v,i)=>T.simulate(REF[id],i).ok),len:REF[id].length,limit:st.limit,n,pal:st.palette.easy.length,msg:st.variants.map((v,i)=>T.simulate(REF[id],i).msg||'ok').join('|')};
      out.neg[id]={}; for(const [k,pr] of Object.entries(NEG[id])){ let f=null; for(let v=0;v<n&&!f;v++){ const r=T.simulate(pr,v); if(!r.ok) f={v,msg:(r.msg||'').slice(0,160)}; } out.neg[id][k]=f||{v:-1,msg:''}; } }
    // Ablasi: seluruh himpunan aturan <= batas, urutan baku dan terbalik
    const ABL=(id)=>{ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const ke=st.sysKetika.map(x=>x.v), ma=st.sysMaka.map(x=>x.v); const all=[]; for(const k of ke) for(const m of ma) all.push(A(k,m)); const n=st.variants.length, lim=st.limit, req=REF[id].map(r=>{const k=r.ketika+'>'+r.maka; return (id==='ex03'&&k==='petiSiap>kirimProduksi')?[k,'ujiLulus>kirimProduksi']:(id==='ex03'&&k==='ujiLulus>kemas')?[k,'komitBaru>kemas','petiTerkirim>kemas']:(id==='ex03'&&k==='komitBaru>jalankanUji')?[k,'petiSiap>jalankanUji','petiTerkirim>jalankanUji']:[k];});
      let tried=0, pass=0, lacking=0, sample=null; const key=r=>r.ketika+'>'+r.maka;
      const test=pr=>{ for(let v=0;v<n;v++) if(!T.simulate(pr,v).ok) return false; return true; };
      const rec=(start,cur)=>{ if(cur.length){ tried++; if(test(cur)||test([...cur].reverse())){ pass++; const ks=cur.map(key); if(!req.every(alt=>alt.some(r=>ks.includes(r)))){ lacking++; if(!sample) sample=ks.join(' ; '); } } }
        if(cur.length>=lim) return; for(let i=start;i<all.length;i++){ cur.push(all[i]); rec(i+1,cur); cur.pop(); } };
      rec(0,[]); return {tried,pass,lacking,sample,lim,req:req.length}; };
    out.abl.ex01=ABL('ex01'); out.abl.ex03=ABL('ex03'); if(!window.__noEx02) out.abl.ex02=ABL('ex02');
    return out; });
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: aturan acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan; palet hanya kartu Aturan`,async()=>({ok:r.ok&&r.len<=r.limit&&r.pal===1,note:r.msg}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,x] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: cara salah “${k}” gagal dengan pesan bermakna`,async()=>({ok:x.v>=0&&x.msg.length>20,note:x.v>=0?`keadaan ${x.v}: ${x.msg}`:'LULUS (cara pintas berhasil!)'}));
  for(const [id,a] of Object.entries(D.abl)) await S.t('A-'+id,`${id}: dari ${a.tried} himpunan aturan ≤ ${a.lim} kartu, tidak ada yang lulus tanpa seluruh ${a.req} aturan inti`,async()=>({ok:a.pass>0&&a.lacking===0,note:JSON.stringify(a)}));
  await S.t('E1','Tidak ada galat konsol',async()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
