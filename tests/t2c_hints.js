// T2c — Petunjuk 3 yang TAMPIL di dialog untuk B08/B09/B10 (Easy): parsial, satu halaman, biaya −10% tetap.
const L=require('./lib'); const PART=+(process.env.PART||0);
const CASES=[['b6','B08',[/^Kartu pertamamu:/],[/\b[345]\b/]],['b7','B09',[/^Kartu pertamamu:/,/jumlah ikan/],[/Kenari/,/nyala/,/\b5\b/]],['b8','B10',[/^Kartu pertamamu:/,/berat/],[/[×÷+−]/,/ubah/i]]];
(async()=>{
  const S=L.suite('t2c_hints'+(PART?'_p'+PART:''));
  for(let i=0;i<CASES.length;i++){ if(PART&&PART!==i+1) continue; const [id,label,must,never]=CASES[i];
    const b=await L.launch(); const {page:p,ctx}=await L.newPage(b); await L.openStage(p,id); await L.sleep(300);
    const labels=[];
    for(let lv=1;lv<=3;lv++){ await p.click('#btnHint'); await L.sleep(70); labels.push(await p.evaluate(()=>[...document.querySelectorAll('#hintActions button')].map(b=>b.textContent).join('/'))); await p.evaluate(()=>document.querySelectorAll('#hintActions button')[0].click()); await L.sleep(70); }
    const text=await L.bubble(p); const btns=await p.evaluate(()=>document.querySelectorAll('#hintActions button').length);
    await S.t('H-'+label+'-a','Petunjuk 3 di '+label+' hanya memberi kartu pertama (tidak memuat solusi lengkap)',()=>({ok:must.every(r=>r.test(text))&&never.every(r=>!r.test(text)),note:text}));
    await S.t('H-'+label+'-b','Petunjuk 3 di '+label+' muat satu halaman dialog (tanpa tombol "Lanjut")',()=>({ok:btns===0,note:'tombol di dialog='+btns}));
    await S.t('H-'+label+'-c','Urutan biaya hint Easy tetap: 1 gratis, 2 gratis, 3 −10%',()=>({ok:/Petunjuk 1.*gratis/.test(labels[0])&&/Petunjuk 2.*gratis/.test(labels[1])&&/Petunjuk 3.*−10%/.test(labels[2]),note:labels.join(' → ')}));
    await ctx.close().catch(()=>{}); await b.close().catch(()=>{});
  }
  S.save(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
