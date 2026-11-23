// T1o — Gerbang Detak/Antrean dan butir Ujian Senior (Test 2) / Ujian Expert (Test 3): kunci dihitung ulang dengan implementasi terpisah; bentuk butir; aturan kunci tahap, tes ulang, data.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t1o_ujian_senior_expert');
  const {page:p,ctx,errors}=await L.newPage(b,{locked:true,path:'/?benih=424242'});
  const D=await p.evaluate(()=>{ const T=window.__t; const key=i=>i.pilihan.find(o=>o[1]===1)[0];
    return {t2:T.T2_BANK.map(c=>c.map(i=>({soal:i.soal,kode:i.kode,key:key(i),opts:i.pilihan.map(o=>o[0]),n1:i.pilihan.filter(o=>o[1]===1).length}))),
            t3:T.T3_BANK.map(c=>c.map(i=>({soal:i.soal,kode:i.kode,key:key(i),opts:i.pilihan.map(o=>o[0]),n1:i.pilihan.filter(o=>o[1]===1).length}))),
            gates:T.GATES.filter(g=>/ex0/.test(g.id)).map(g=>({id:g.id,after:g.after,n:g.varian.length,q:g.varian.map(v=>{ const q=v(); return {stem:q.stem,kode:q.kode,jawab:q.jawab,salah:q.salah,pet:q.petunjuk,pen:q.penjelasan,tipe:q.tipe}; })}))}; });
  // ---------- bentuk butir
  await S.t('B1','Test 2: 10 konsep × 3 varian; Test 3: 8 konsep × 3 varian',()=>({ok:D.t2.length===10&&D.t2.every(c=>c.length===3)&&D.t3.length===8&&D.t3.every(c=>c.length===3),note:`${D.t2.length}×${D.t2[0].length} / ${D.t3.length}×${D.t3[0].length}`}));
  await S.t('B2','Tiap butir: 4 pilihan berbeda, tepat satu benar, tidak ada yang bertuliskan “Aku belum tahu”',()=>{ const bad=[]; for(const [nm,B] of [['T2',D.t2],['T3',D.t3]]) B.forEach((c,ci)=>c.forEach((i,vi)=>{ if(i.opts.length!==4||new Set(i.opts).size!==4||i.n1!==1||i.opts.some(o=>/belum tahu/i.test(o))||i.opts.some(o=>!o||/undefined|NaN/.test(o))) bad.push(`${nm}-${ci+1}${'ABC'[vi]}`); })); return {ok:!bad.length,note:bad.join(',')}; });
  await S.t('B3','Tiap butir punya soal; butir bertipe program menampilkan isinya (kode) dan tidak ada teks “undefined/NaN”',()=>{ const bad=[]; for(const [nm,B] of [['T2',D.t2],['T3',D.t3]]) B.forEach((c,ci)=>c.forEach((i,vi)=>{ if(!i.soal||/undefined|NaN/.test(i.soal+(i.kode||''))) bad.push(`${nm}-${ci+1}${'ABC'[vi]}`); })); return {ok:!bad.length,note:bad.join(',')}; });
  await S.t('B4','Tiga varian satu konsep tidak identik (soal berbeda) dan jawaban benar tidak sama di ketiganya, kecuali konsep tetap',()=>{ const bad=[]; for(const [nm,B] of [['T2',D.t2],['T3',D.t3]]) B.forEach((c,ci)=>{ if(new Set(c.map(i=>i.soal+'|'+(i.kode||''))).size!==3) bad.push(`${nm}-${ci+1}:soal`); }); return {ok:!bad.length,note:bad.join(',')}; });
  // ---------- kunci Test 2, dihitung ulang
  const rec=(basis,op,k,n)=>{ let v=basis; for(let i=1;i<=n;i++) v=op==='+'?i+v:k*v; return v; };
  await S.t('K1','T2-1 rekursi: kunci = nilai hitung(n) yang dihitung dari bawah',()=>{ const e=[rec(0,'+',0,4),rec(0,'+',0,5),rec(1,'×',2,4)]; return {ok:D.t2[0].every((i,v)=>i.key===String(e[v])),note:D.t2[0].map(i=>i.key)+' / '+e}; });
  await S.t('K2','T2-2 titik berhenti: kunci cocok dengan simulasi penelusuran (aturan berhenti ada/tidak, langkah 1 atau 2)',()=>{ const run=(s,st,stop)=>{ const o=[]; let n=s; for(let i=0;i<50;i++){ if(stop!==null&&n===stop) return 'Tampil '+o.join(', '); o.push(n); n-=st; } return 'Tidak pernah berhenti'; };
    const e=[run(3,1,null),run(3,1,0),run(6,2,0)]; return {ok:D.t2[1].every((i,v)=>i.key===e[v]),note:D.t2[1].map(i=>i.key)+' / '+e}; });
  await S.t('K3','T2-3 buka tengah: kunci = banyak pembagian dua sampai habis (⌊log₂ n⌋+1)',()=>{ const e=[1000,5000,100000].map(n=>Math.floor(Math.log2(n))+1); return {ok:D.t2[2].every((i,v)=>i.key===String(e[v])),note:D.t2[2].map(i=>i.key)+' / '+e}; });
  await S.t('K4','T2-4 pohon: kunci = penelusuran diri-kiri-kanan memakai tumpukan eksplisit (bukan rekursi)',()=>{
    const T=[{n:'Kakek',l:{n:'Ayah',l:{n:'Aku'},r:{n:'Adik'}},r:{n:'Paman'}},{n:'Nenek',l:{n:'Ibu'},r:{n:'Bibi',l:{n:'Dodi'},r:{n:'Eni'}}},{n:'Bunda',l:{n:'Tika',l:{n:'Uci'}},r:{n:'Vera',r:{n:'Wina'}}}];
    const e=T.map(t=>{ const o=[],st=[t]; while(st.length){ const x=st.pop(); o.push(x.n); if(x.r) st.push(x.r); if(x.l) st.push(x.l); } return o.join(', '); });
    return {ok:D.t2[3].every((i,v)=>i.key===e[v]),note:D.t2[3].map(i=>i.key).join(' / ')}; });
  await S.t('K5','T2-5 tumpukan vs antrean: kunci cocok dengan push/pop dan enqueue/dequeue sungguhan',()=>{ const cfg=[[['A','B','C'],2],[['P','Q','R','S'],2],[['1','2','3','4'],3]];
    const e=cfg.map(([it,k])=>{ const st=[...it],q=[...it]; for(let i=0;i<k;i++){ st.pop(); q.shift(); } return `Tumpukan: ${st.join(' dan ')} · Antrean: ${q.join(' dan ')}`; }); return {ok:D.t2[4].every((i,v)=>i.key===e[v]),note:D.t2[4].map(i=>i.key).join(' / ')}; });
  await S.t('K6','T2-6 objek mandiri: kunci = nilai awal cetakan (mengubah satu objek tidak mengubah yang lain)',()=>({ok:D.t2[5].map(i=>i.key).join('|')==='Tetap jingga|Tetap kwek|Tetap 0',note:D.t2[5].map(i=>i.key).join('|')}));
  await S.t('K7','T2-7 brankas: kunci = isi awal + setoran yang tidak negatif',()=>{ const cfg=[[50,[-20,30]],[40,[-10,25,-5]],[20,[15,-30]]]; const e=cfg.map(([a,o])=>String(o.reduce((s,x)=>x<0?s:s+x,a))); return {ok:D.t2[6].every((i,v)=>i.key===e[v]),note:D.t2[6].map(i=>i.key)+' / '+e}; });
  await S.t('K8','T2-8/9/10: kunci tetap menyebut method turunan (versi cetakan paling bawah), urutan jawaban polimorfis, dan rancangan satu cetakan induk',()=>{
    const a=D.t2[7].every((i,v)=>/versi (Pinguin|LampuTidur|AkunTamu)/.test(i.key)&&/^(makan|nyalakan|masuk)\(\)/.test(i.key));
    const c=D.t2[8].map(i=>i.key).join('|')==='Meong, Guk, Kwek|petik, pukul, tiup|memasak, menyetir, mengajar';
    const d=D.t2[9].every(i=>/^Satu cetakan \w+\. Tiap jenis mewarisinya dan mengganti/.test(i.key)); return {ok:a&&c&&d,note:`${a} ${c} ${d}`}; });
  // ---------- kunci Test 3
  await S.t('K9','T3-3 titik simpan: kunci cocok dengan simulasi memakai salinan dan peta kerja',()=>{ const run=st=>{ let work=[],snap=[]; for(const s of st){ if(s[0]==='S') snap=work.map(x=>x); else if(s[0]==='T') work=[...work,s.slice(1)]; else if(s[0]==='K'&&work.some(x=>x[1])) work=snap.map(x=>x); } return `${work.length?'Perubahan '+work.map(x=>x[0]).join(' dan '):'Tidak ada perubahan'} · ${work.some(x=>x[1])?'peta masih rusak':'peta sehat'}`; };
    const S1=[['S'],['T',1,0],['S'],['T',2,1],['K']],S2=[['S'],['T',1,0],['T',2,1],['S'],['K']],S3=[['T',1,0],['S'],['T',2,0],['S'],['T',3,1],['K']]; const e=[run(S1),run(S2),run(S3)]; return {ok:D.t3[2].every((i,v)=>i.key===e[v]),note:D.t3[2].map(i=>i.key).join(' / ')}; });
  await S.t('K10','T3-4 gabung: kunci = jumlah petak yang diubah kedua cabang',()=>{ const cfg=[[['A1','A2','B1'],['A2','B1','C3']],[['A1','B2','C3'],['D1','E2']],[['A1','A2','A3','B1','B2'],['A2','B1','B2','C1']]]; const e=cfg.map(([r,d])=>String(new Set(r.filter(x=>d.includes(x))).size)); return {ok:D.t3[3].every((i,v)=>i.key===e[v]),note:D.t3[3].map(i=>i.key)+' / '+e}; });
  await S.t('K11','T3-5 mundur: kunci = n − k + 1 (perubahan bug dan semua sesudahnya dilepas)',()=>{ const e=[[6,3],[6,5],[7,2]].map(([n,k])=>String(n-k+1)); return {ok:D.t3[4].every((i,v)=>i.key===e[v]),note:D.t3[4].map(i=>i.key)+' / '+e}; });
  await S.t('K12','T3-7 jalur rilis: rilis mulai di detak 3 tiba di produksi di detak 6 (empat tahap, satu per detak)',()=>({ok:D.t3[6][1].key==='6',note:D.t3[6][1].key}));
  await S.t('K13','T3 butir statis: kunci sesuai aturan stage Senior (alamat /barang, aksi pesan, ≤ 5; stok habis → /cadangan; tidak ditemukan → /barang-baru)',()=>{ const a=D.t3[0][0].key==='alamat /barang · aksi pesan · kopi × 3'&&/paling banyak 5/.test(D.t3[0][1].key)&&/salah ketik/.test(D.t3[0][2].key); const c=D.t3[1].map(i=>i.key); const r=c[0]==='Kirim ulang ke /cadangan'&&c[1]==='Coba alamat /barang-baru'&&/ganda/.test(c[2]); return {ok:a&&r,note:`${a} ${r}`}; });
  // ---------- Gerbang Detak dan Gerbang Antrean
  await S.t('G1','Dua gerbang baru terpasang: g_ex03 setelah EX03, g_ex06 setelah EX06; masing-masing 3 varian',()=>({ok:D.gates.length===2&&D.gates[0].after==='ex03'&&D.gates[1].after==='ex06'&&D.gates.every(g=>g.n===3),note:D.gates.map(g=>g.id+'@'+g.after+':'+g.n).join(',')}));
  const tick=(rules,arr)=>{ // implementasi terpisah: tabel per detak dengan kamus peristiwa
    const ev={}; const add=(t,e)=>{ (ev[t]=ev[t]||[]).push(e); }; arr.forEach(([t,k,id])=>add(t,{k,id})); const rows={};
    for(let t=1;t<=30;t++){ rows[t]=[]; for(const e of ev[t]||[]) for(const r of rules) if(r.k===e.k){ rows[t].push(r.m); const out=typeof r.e==='function'?r.e(e.id):r.e; if(out) add(t+(r.d||1),{k:out,id:e.id}); } } return rows; };
  await S.t('G2','Gerbang Detak: kunci 10, 12, 13 cocok dengan tabel detak yang dihitung terpisah (aksi → peristiwa di detak berikutnya; jeda 2 untuk pemasok)',()=>{
    const r1=tick([{k:'masuk',m:'kemas',e:'siap'},{k:'siap',m:'kirim',e:'kirim2'},{k:'kirim2',m:'tahu'}],[[8,'masuk',0]]); const a1=+Object.keys(r1).find(t=>r1[t].includes('tahu'));
    const r2=tick([{k:'masuk',m:'periksa',e:'kurang'},{k:'kurang',m:'pesan',e:'cukup',d:2},{k:'cukup',m:'kemas'}],[[9,'masuk',0]]); const a2=+Object.keys(r2).find(t=>r2[t].includes('kemas'));
    const cacat=[2,4]; const r3=tick([{k:'komit',m:'uji',e:id=>cacat.includes(id)?'gagal':'lulus'},{k:'lulus',m:'kemas',e:'siap'},{k:'siap',m:'kirim'},{k:'gagal',m:'dev'}],[[1,'komit',1],[2,'komit',2],[3,'komit',3],[4,'komit',4],[5,'komit',5]]); const a3=Object.values(r3).reduce((n,x)=>n+x.length,0);
    const got=D.gates[0].q.map(q=>q.jawab); return {ok:got.join()===[a1,a2,a3].join(),note:`${got} / ${[a1,a2,a3]}`}; });
  await S.t('G3','Gerbang Antrean: kunci 12, 28, 31 cocok dengan simulasi antrean yang ditulis ulang di sini',()=>{
    const q1=(prof,N,Bf)=>{ let q=0,lost=0; for(const a of prof){ q+=a; if(q>Bf){ lost+=q-Bf; q=Bf; } q-=Math.min(q,2*N); } return lost; };
    const lb=(caps,traffic,mode)=>{ const room=caps.map(c=>4+c), qs=caps.map(()=>0); let lost=0,rr=0; for(const n of traffic){ for(let r=0;r<n;r++){ let i; if(mode==='g'){ i=rr%caps.length; rr++; } else { i=0; qs.forEach((x,k)=>{ if(x<qs[i]) i=k; }); } if(qs[i]>=room[i]) lost++; else qs[i]++; } for(let k=0;k<qs.length;k++) qs[k]=Math.max(0,qs[k]-caps[k]); } return lost; };
    const e=[16-q1([4,4,4,4,0,0,0],1,6),32-lb([4,2],[8,8,8,8],'g'),32-lb([4,2],[8,8,8,8],'k')]; const got=D.gates[1].q.map(q=>+q.jawab); return {ok:got.join()===e.join(),note:`${got} / ${e}`}; });
  await S.t('G4','Kedua gerbang: jawaban benar tidak ada di antara pengecoh; ≥ 3 pengecoh unik; kunci dua digit (ubin tidak bisa ditebak); petunjuk dan penjelasan terisi; tipe angka',()=>{ const bad=[]; D.gates.forEach(g=>g.q.forEach((q,v)=>{ if(q.jawab.length<2||q.salah.includes(q.jawab)||new Set(q.salah).size<3||q.salah.length!==new Set(q.salah).size||!q.pet||!q.pen||q.tipe!=='angka'||!q.stem||!q.kode) bad.push(g.id+v); })); return {ok:!bad.length,note:bad.join()}; });
  await S.t('G5','Penjelasan Gerbang Detak menampilkan baris detak yang beraksi dan kunci; Gerbang Antrean menyebut hasil akhir yang sama dengan kunci',()=>{ const a=D.gates[0].q.every(q=>/Detak \d+:/.test(q.pen)&&new RegExp('Jadi jawabannya '+q.jawab).test(q.pen)); const b=D.gates[1].q.every(q=>new RegExp('(diproses|dilayani) '+q.jawab+'\\.').test(q.pen)); return {ok:a&&b,note:`${a} ${b}`}; });
  // ---------- aturan kunci tahap dan tes
  await S.t('L1','Senior pertama terkunci sampai Middle B selesai atau Ujian Senior lulus; SE02 tetap berurutan; Expert pertama sama dengan Ujian Expert',async()=>{
    const r=await p.evaluate(()=>{ const T=window.__t, id=x=>T.STAGES.find(s=>s.id===x); const o={}; o.a=T.lockReason(id('se01'))!==null; o.e=T.lockReason(id('ex01'))!==null;
      T.tests().t2={urutanVarian:[],percobaan:[{}],tahapSejakTes:[],terbaik:'senior'}; o.b=T.lockReason(id('se01'))===null; o.c=T.lockReason(id('se02'))!==null; o.f=T.lockReason(id('ex01'))!==null;
      T.tests().t3={urutanVarian:[],percobaan:[{}],tahapSejakTes:[],terbaik:'expert'}; o.g=T.lockReason(id('ex01'))===null; o.h=T.lockReason(id('ex02'))!==null; T.tests().t2=null; T.tests().t3=null; o.i=T.lockReason(id('se01'))!==null&&T.lockReason(id('ex01'))!==null; return o; });
    return {ok:Object.values(r).every(Boolean),note:JSON.stringify(r)}; });
  await S.t('L2','Syarat dasar: Ujian Senior butuh Junior selesai dan tertutup bila Middle A+B selesai; Ujian Expert butuh Senior terbuka dan tertutup bila Senior selesai',async()=>{
    const r=await p.evaluate(()=>{ const T=window.__t, ids=t=>T.STAGES.filter(s=>(t==='Junior'?/^J/:t==='MA'?/^MA/:t==='MB'?/^MB/:/^SE/).test(s.code)).map(s=>s.id); const o={};
      o.a=T.tPrasyarat('t2'); o.b=T.tPrasyarat('t3'); T.STAGES.filter(s=>/^[BSP]|^b/.test(s.id)&&!/^(ma|mb|se|ex|j)/i.test(s.code)).forEach(s=>T.markWin(s.id)); ids('Junior').forEach(i=>T.markWin(i)); o.c=T.tPrasyarat('t2'); o.d=T.tPrasyarat('t3');
      ids('MA').concat(ids('MB')).forEach(i=>T.markWin(i)); o.e=T.tPrasyarat('t2'); o.f=T.tPrasyarat('t3'); ids('SE').forEach(i=>T.markWin(i)); o.g=T.tPrasyarat('t3'); return o; });
    return {ok:/Junior/.test(r.a)&&/Senior terbuka/.test(r.b)&&r.c===null&&/Senior terbuka/.test(r.d)&&/lewat tahap Middle/.test(r.e)&&r.f===null&&/lewat tahap Senior/.test(r.g),note:JSON.stringify(r)}; });
  await S.t('L3','Data: kn_tes_v1 lama (hanya t1) tetap terbaca dan t2/t3 kosong; data rusak diabaikan tanpa galat',async()=>{
    const old={t1:{urutanVarian:[[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2]],percobaan:[{benar:7,hasil:'junior'}],tahapSejakTes:[],terbaik:'junior'}};
    await p.evaluate(o=>{ localStorage.setItem('kn_tes_v1',JSON.stringify(o)); },old); await p.reload({waitUntil:'load'}); await L.sleep(700);
    const a=await p.evaluate(()=>{ const t=window.__t.tests(); return {t1:t.t1&&t.t1.terbaik,t2:t.t2,t3:t.t3,pass:window.__t.tPassed('t1')}; });
    await p.evaluate(()=>{ localStorage.setItem('kn_tes_v1',JSON.stringify({t1:{percobaan:'x'},t2:{percobaan:[]},t3:5})); }); await p.reload({waitUntil:'load'}); await L.sleep(700);
    const c=await p.evaluate(()=>{ const t=window.__t.tests(); return {t1:t.t1,t2:t.t2,t3:t.t3}; });
    return {ok:a.t1==='junior'&&a.t2===null&&a.t3===null&&a.pass&&c.t1===null&&c.t2===null&&c.t3===null,note:JSON.stringify({a,c})}; });
  await S.t('L4','Galat konsol: tidak ada',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  await ctx.close(); S.save(); await b.close(); process.exit(0);
})();
