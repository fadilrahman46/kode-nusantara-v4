// T1i — Gerbang Si Teka (Middle A dan B): jawaban dicek ke perhitungan independen, pengecoh, ubin, aturan anti-blokir (GDD §3.8), tidak mengunci progres.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b,{locked:true}); const S=L.suite('t1i_gerbang');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={};
    // ---- perhitungan independen (kode berbeda dari yang dipakai game) ----
    const sum=n=>{ let t=0; for(let i=1;i<=n;i++) t+=i; return t; };
    const worstBin=n=>{ const a=Array.from({length:n},(_,i)=>i); let worst=0; for(let tgt=0;tgt<n;tgt++){ let lo=0,hi=n-1,c=0; while(lo<=hi){ const mid=(lo+hi)>>1; c++; if(a[mid]===tgt) break; if(a[mid]<tgt) lo=mid+1; else hi=mid-1; } worst=Math.max(worst,c); } return worst; };
    class Kucing{ constructor(){ this.warna='jingga'; } }
    class Kucing2{ constructor(){ this.energi=12; } makan(){ this.energi++; } }
    class Hewan{ constructor(){ this.energi=10; } makan(){ this.energi++; } }
    class Burung extends Hewan{ terbang(){} }
    const names=o=>{ const r=[]; for(let p=Object.getPrototypeOf(o);p&&p!==Object.prototype;p=Object.getPrototypeOf(p)) for(const k of Object.getOwnPropertyNames(p)) if(k!=='constructor') r.unshift(k+'()'); return r; };
    const k1=new Kucing(),k2=new Kucing(); k1.warna='hitam';
    const q1=new Kucing2(),q2=new Kucing2(); q1.makan(); q1.makan();
    const k3=new Kucing(); k3.warna='hitam'; const k4=new Kucing();
    const b1=new Burung(); b1.makan(); b1.makan();
    const EXP={g_ma03:[String(sum(4)),String(sum(5)),String(2**4)], g_ma06:[1000,5000,100000].map(n=>String(worstBin(n))),
      g_mb03:['Tetap '+k2.warna,String(q2.energi),'Warna '+k4.warna],
      g_mb06:[names(new Burung()).join(' dan '),'Tidak bisa, kambing bukan Burung',String(b1.energi)]};
    // pastikan model kambing benar secara independen
    out.kambingTerbang=typeof new Hewan().terbang==='function';
    out.exp=EXP; out.gates=T.GATES.map(g=>({id:g.id,after:g.after,n:g.varian.length}));
    out.q={}; for(const g of T.GATES){ out.q[g.id]=g.varian.map(f=>{ const q=f(); return {stem:q.stem,jawab:q.jawab,salah:q.salah,tipe:q.tipe,urut:q.urut||null,petunjuk:q.petunjuk,pen:q.penjelasan,kode:q.kode}; }); }
    // opsi dan ubin
    out.opts=[]; out.tiles=[];
    for(const g of T.GATES) g.varian.forEach((f,vi)=>{ const q=f(); for(const lv of ['easy','medium']){ const o=T.gateChoices(q,lv,'k'+vi); out.opts.push({g:g.id,vi,lv,n:o.length,ok:o.filter(x=>x.ok).length,uniq:new Set(o.map(x=>x.t)).size,t:o.filter(x=>!x.ok).map(x=>x.t),salah:q.salah}); }
      const tt=T.gateTiles(q,'k'+vi), u=q.tipe==='angka'?q.jawab.split(''):q.urut;
      const rest=tt.ubin.slice(); let hasAll=true; for(const x of u){ const i=rest.indexOf(x); if(i<0){ hasAll=false; break; } rest.splice(i,1); }
      const perm=u.slice().reverse(), shuffledOk=T.gateTilesOk(q,u.slice()), revOk=T.gateTilesOk(q,perm), bad=T.gateTilesOk(q,[tt.ubin.find(x=>!u.includes(x))||'?']), empty=T.gateTilesOk(q,[]);
      out.tiles.push({g:g.id,vi,len:u.length,n:tt.ubin.length,hasAll,shuffledOk,revOk,bebas:!!q.bebasUrut,bad,empty,tipe:q.tipe}); });
    out.after=T.GATES.map(g=>{ const i=T.STAGES.findIndex(s=>s.id===g.after); return {g:g.id,i,cur:T.STAGES[i]&&T.STAGES[i].code.slice(0,4),nx:T.STAGES[i+1]&&T.STAGES[i+1].code.slice(0,4)}; });
    return out;
  });
  const flat=Object.entries(D.q).flatMap(([id,arr])=>arr.map((q,vi)=>({id,vi,...q})));
  await S.t('G0','6 gerbang × 3 varian; dipasang tepat setelah MA03, MA06, MB03, MB06, EX03, EX06',()=>({ok:D.gates.length===6&&D.gates.every(g=>g.n===3)&&D.after.map(a=>a.cur).join()==='MA03,MA06,MB03,MB06,EX03,EX06'&&D.after.map(a=>a.nx).join()==='MA04,MA07,MB04,MB07,EX04,EX07',note:JSON.stringify(D.after)}));
  for(const x of flat.filter(x=>D.exp[x.id])) await S.t(`G1-${x.id}-${x.vi}`,`${x.id} varian ${x.vi}: jawaban “${x.jawab}” sama dengan perhitungan independen`,()=>({ok:x.jawab===D.exp[x.id][x.vi],note:`game=${x.jawab} independen=${D.exp[x.id][x.vi]}`}));
  await S.t('G1k','Model benar: objek dari cetakan Hewan tidak punya terbang()',()=>D.kambingTerbang===false);
  for(const x of flat) await S.t(`G2-${x.id}-${x.vi}`,`${x.id} varian ${x.vi}: ≥4 pengecoh, unik, tidak ada yang sama dengan jawaban, petunjuk dan penjelasan terisi`,()=>({ok:x.salah.length>=4&&new Set(x.salah).size===x.salah.length&&!x.salah.includes(x.jawab)&&x.salah.every(t=>t&&t.length)&&x.petunjuk.length>20&&x.pen.length>20&&x.stem.length>5,note:x.salah.join(' | ')}));
  await S.t('G3','Mudah dan Sedang: 4 pilihan, tepat satu benar, semua unik; Sedang memakai 3 pengecoh termirip, Mudah 3 terjauh',()=>{ const bad=D.opts.filter(o=>!(o.n===4&&o.ok===1&&o.uniq===4&&(o.lv==='medium'?o.t.every(t=>o.salah.slice(0,3).includes(t)):o.t.every(t=>o.salah.slice(-3).includes(t))))); return {ok:bad.length===0&&D.opts.length===D.gates.length*6,note:JSON.stringify(bad.slice(0,2))}; });
  await S.t('G4','Sulit: ubin memuat semua kepingan jawaban, ≤ 8 ubin, jawaban susunan benar diterima, kosong/salah ditolak',()=>{ const bad=D.tiles.filter(t=>!(t.hasAll&&t.n<=8&&t.shuffledOk&&!t.bad&&!t.empty)); return {ok:bad.length===0,note:JSON.stringify(bad.slice(0,2))}; });
  await S.t('G4b','Sulit: urutan terbalik ditolak kecuali soal himpunan (bebasUrut)',()=>{ const bad=D.tiles.filter(t=>t.len>1&&(t.bebas?!t.revOk:t.revOk)); return {ok:bad.length===0,note:JSON.stringify(bad)}; });
  await S.t('G4c','Jawaban angka punya ≥ 2 ubin (jawaban 1 digit bisa ditebak dari 5 ubin)',()=>{ const bad=D.tiles.filter(t=>t.tipe==='angka'&&t.len<2); return {ok:bad.length===0,note:JSON.stringify(bad)}; });
  // ---- aturan anti-blokir lewat API yang sama dengan antarmuka ----
  const R=await page.evaluate(()=>{
    const T=window.__t, P=T.getProgress, out={};
    const idxWrong=(r)=>r.opsi.findIndex((o,i)=>!o.ok&&!r.mati.includes(i)), idxRight=r=>r.opsi.findIndex(o=>o.ok);
    const ans=(wrong,right)=>{ const r=T.getGateRun(); r.pilih=wrong?idxWrong(r):idxRight(r); return T.gateAnswer(); };
    T.setDiff('easy');
    // A: benar di percobaan pertama
    T.openGate('g_ma03',0); ans(false); let r=T.getGateRun(); out.A={ok:r.ok,salah:r.salah,rec:{...P().gerbang.g_ma03},done:r.selesai};
    // B: salah 1×, lalu benar
    delete P().gerbang.g_ma06; T.openGate('g_ma06',0); ans(true); const b1=T.getGateRun(); const hint1=document.querySelector('#gateBody .g-hint'); ans(false); const b2=T.getGateRun();
    out.B={salah:b2.salah,ok:b2.ok,hint1:!!hint1,rec:{...P().gerbang.g_ma06}};
    // C: salah 2×: petunjuk muncul, belum selesai; lalu benar → bonus (aturan GDD)
    delete P().gerbang.g_mb03; T.openGate('g_mb03',0); ans(true); ans(true); const c1=T.getGateRun(); const hint2=!!document.querySelector('#gateBody .g-hint'), unfinished=!c1.selesai, mati=c1.mati.length; ans(false);
    out.C={hint2,unfinished,mati,ok:T.getGateRun().ok,salah:T.getGateRun().salah,rec:{...P().gerbang.g_mb03}};
    T.openGate('g_mb03'); const c2v=T.getGateRun().vi; ans(false); out.C2={vNext:c2v,rec:{...P().gerbang.g_mb03}};
    // D: salah 3×: gerbang terbuka tanpa bonus, jawaban dibuka, tidak ada status “benar”
    delete P().gerbang.g_mb06; T.openGate('g_mb06'); ans(true); ans(true); ans(true); const d=T.getGateRun();
    out.D={selesai:d.selesai,ok:d.ok,salah:d.salah,rec:{...P().gerbang.g_mb06},fb:document.querySelector('#gateBody .g-fb')&&document.querySelector('#gateBody .g-fb').textContent,msg:document.querySelector('#gateBody').textContent.includes('tidak diberikan'),btn:!!document.querySelector('#gateNext')};
    // E: coba lagi dari menu: varian berbeda, menang → bonus; kegagalan berikutnya tidak menurunkan bonus
    const v0=d.vi; T.openGate('g_mb06'); const e=T.getGateRun(); const v1=e.vi; ans(false); out.E={v0,v1,rec:{...P().gerbang.g_mb06}};
    T.openGate('g_mb06'); ans(true); ans(true); ans(true); out.E2={rec:{...P().gerbang.g_mb06}};
    // F: tidak mengunci: tahap sesudah gerbang terbuka walau gerbang belum dijawab
    delete P().gerbang.g_ma03; for(const s of T.STAGES) if(T.STAGES.indexOf(s)<=T.STAGES.findIndex(x=>x.id==='ma03')) T.markWin(s.id,3);
    out.F={lock:T.lockReason(T.STAGES.find(x=>x.id==='ma04')),gate:!!P().gerbang.g_ma03,ready:T.gateReady(T.GATES[0]),readyMA06:T.gateReady(T.GATES[1])};
    // G: log tercatat
    out.logs=T.getLogs().filter(l=>l.jenis==='gerbang').map(l=>({g:l.gerbang,h:l.hasil,s:l.salah,b:l.bentuk}));
    // H: Sulit: ubin
    T.setDiff('hard'); delete P().gerbang.g_ma03; T.openGate('g_ma03',0); let h=T.getGateRun(); const hb=h.bentuk; const q=h.q;
    const pickTiles=(txts)=>{ const used=[]; return txts.map(t=>{ const i=h.ubin.findIndex((x,k)=>x===t&&!used.includes(k)); used.push(i); return i; }); };
    h.sel=pickTiles(['0','1']); T.gateAnswer(); const afterWrong={salah:h.salah,sel:h.sel.length};
    h.sel=pickTiles(q.jawab.split('')); T.gateAnswer(); out.H={bentuk:hb,afterWrong,ok:h.ok,salah:h.salah,rec:{...P().gerbang.g_ma03}};
    // I: Sulit, 3 salah
    delete P().gerbang.g_ma06; T.openGate('g_ma06',0); h=T.getGateRun(); for(let i=0;i<3;i++){ h.sel=[h.ubin.length-1]; T.gateAnswer(); } out.I={selesai:h.selesai,ok:h.ok,salah:h.salah,rec:{...P().gerbang.g_ma06}};
    T.setDiff('easy'); return out; });
  await S.t('R-A','Benar di percobaan pertama: status benar, bonus, 0 salah',()=>({ok:R.A.ok&&R.A.salah===0&&R.A.rec.status==='benar'&&R.A.rec.bonus===true&&R.A.rec.salah===0,note:JSON.stringify(R.A)}));
  await S.t('R-B','Salah sekali: pilihan salah ditandai, petunjuk belum muncul, lalu benar → bonus',()=>({ok:R.B.ok&&R.B.salah===1&&!R.B.hint1&&R.B.rec.bonus===true,note:JSON.stringify(R.B)}));
  await S.t('R-C','Salah 2 kali: petunjuk Si Teka muncul, gerbang belum selesai, 2 pilihan tercoret; benar sesudahnya membuka gerbang TANPA bonus (bonus hanya bila salah ≤ 1)',()=>({ok:R.C.hint2&&R.C.unfinished&&R.C.mati===2&&R.C.ok&&R.C.rec.status==='benar'&&R.C.rec.bonus===false&&R.C.rec.salah===2,note:JSON.stringify(R.C)}));
  await S.t('R-C2','Terjawab tanpa bonus lalu mencoba lagi dari menu dan benar di percobaan pertama → bonus didapat',()=>({ok:R.C2.rec.status==='benar'&&R.C2.rec.bonus===true&&R.C2.rec.salah===0&&R.C2.rec.buka===2,note:JSON.stringify(R.C2)}));
  await S.t('R-D','Salah 3 kali: gerbang terbuka, jawaban ditampilkan, TANPA bonus, ada tombol Lanjut',()=>({ok:R.D.selesai&&!R.D.ok&&R.D.salah===3&&R.D.rec.status==='terbuka'&&R.D.rec.bonus===false&&/Jawabannya/.test(R.D.fb)&&R.D.msg&&R.D.btn,note:JSON.stringify(R.D)}));
  await S.t('R-E','Kembali untuk bonus: soal berbeda dari yang pertama; menang → status benar dan bonus',()=>({ok:R.E.v0!==R.E.v1&&R.E.rec.status==='benar'&&R.E.rec.bonus===true,note:JSON.stringify(R.E)}));
  await S.t('R-E2','Percobaan ulang yang gagal tidak menurunkan status maupun bonus yang sudah diperoleh',()=>({ok:R.E2.rec.status==='benar'&&R.E2.rec.bonus===true,note:JSON.stringify(R.E2)}));
  await S.t('R-F','Gerbang tidak mengunci: MA04 terbuka walau Gerbang MA03 belum dijawab; MA06 gerbang masih terkunci',()=>({ok:R.F.lock===null&&!R.F.gate&&R.F.ready&&!R.F.readyMA06,note:JSON.stringify(R.F)}));
  await S.t('R-G','Setiap hasil gerbang tercatat di catatan uji (gerbang, hasil, jumlah salah, bentuk)',()=>({ok:R.logs.length>=6&&R.logs.every(l=>l.g&&l.h&&Number.isInteger(l.s)&&l.b),note:JSON.stringify(R.logs.slice(0,3))}));
  await S.t('R-H','Sulit: bentuk ubin; susunan salah dikosongkan dan dihitung salah; susunan benar → bonus',()=>({ok:R.H.bentuk==='ubin'&&R.H.afterWrong.salah===1&&R.H.afterWrong.sel===0&&R.H.ok&&R.H.rec.bonus===true,note:JSON.stringify(R.H)}));
  await S.t('R-I','Sulit: 3 susunan salah → terbuka tanpa bonus (sama dengan pilihan ganda)',()=>({ok:R.I.selesai&&!R.I.ok&&R.I.rec.status==='terbuka'&&R.I.rec.bonus===false,note:JSON.stringify(R.I)}));
  await S.t('ERR','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
