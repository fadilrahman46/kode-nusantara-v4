// T2q — Ujian Senior (Test 2) dan Ujian Expert (Test 3) lewat UI + Gerbang Detak/Antrean: tawaran, penilaian, kunci tahap, tes ulang, varian, hapus progres, papan ketik, tata letak HP.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const S=L.suite('t2q_ujian_senior_expert');
  const ids=(p,re)=>p.evaluate(s=>window.__t.STAGES.filter(x=>new RegExp(s).test(x.code)).map(x=>x.id),re);
  const markAll=async(p,re)=>{ const l=await ids(p,re); await p.evaluate(l=>l.forEach(i=>window.__t.markWin(i)),l); };
  const BEG='^(?!J|MA|MB|SE|EX)', JUN='^J', MA='^MA', MB='^MB', SE='^SE';
  const menu=p=>p.evaluate(()=>{ document.querySelector('#btnMenu').click(); const g=id=>document.querySelector(id); const lk=id=>{ const e=document.querySelector(`.stage-item[data-id="${id}"]`); return e?e.classList.contains('locked'):null; };
    return {t1:{hidden:g('#menuTest').hidden,st:g('#menuTestStatus').textContent},t2:{hidden:g('#menuTest2').hidden,st:g('#menuTest2Status').textContent,dis:g('#menuTest2').getAttribute('aria-disabled')},t3:{hidden:g('#menuTest3').hidden,st:g('#menuTest3Status').textContent,dis:g('#menuTest3').getAttribute('aria-disabled')},
      se01:lk('se01'),se02:lk('se02'),ex01:lk('ex01'),ex02:lk('ex02'),ma01:lk('ma01')}; });
  const closeAny=p=>p.evaluate(()=>{ document.querySelectorAll('.overlay').forEach(o=>{ o.hidden=true; }); });
  const BANK={t2:'T2_BANK',t3:'T3_BANK'};
  // jawab satu ujian. wrong/dunno = indeks KONSEP
  const take=async(p,id,o={})=>{ await p.click('#testStart'); await L.sleep(80); const seen=[]; const n=await p.evaluate(()=>window.__t.getTestRun().n);
    for(let i=0;i<n;i++){ const r=await p.evaluate(()=>{ const R=window.__t.getTestRun(); const c=R.order[R.i]; return {c,v:R.varian[c]}; }); seen.push(r);
      const it=await p.evaluate((r,bk)=>window.__t[bk][r.c][r.v].pilihan.map(o=>o[1]),r,BANK[id]); let want; if((o.dunno||[]).includes(r.c)) want='tahu'; else { const ki=it.findIndex(x=>x===1); want=String((o.wrong||[]).includes(r.c)?(ki+1)%4:ki); }
      if(o.onQ) await o.onQ(i,r);
      await p.click(`#testBody .t-opt[data-v="${want}"]`); await L.sleep(30); await p.click('#testNext'); await L.sleep(50); }
    return seen; };
  const result=p=>p.evaluate(()=>({live:document.querySelector('#testLive').textContent,body:document.querySelector('#testBody').innerText}));
  const open=async(p,k)=>{ await p.evaluate(()=>document.querySelector('#btnMenu').click()); await L.sleep(60); await p.click(k); await L.sleep(80); };

  { const {page:p,ctx,errors}=await L.newPage(b,{locked:true,path:'/?benih=111111'});
    await S.t('Q1','Pemain baru: tombol Ujian Senior dan Ujian Expert tersembunyi; Ujian Si Teka tampil',async()=>{ const m=await menu(p); return {ok:m.t2.hidden&&m.t3.hidden&&!m.t1.hidden,note:JSON.stringify([m.t1.hidden,m.t2.hidden,m.t3.hidden])}; });
    await S.t('Q2','Setelah Beginner + Junior selesai: Ujian Senior tampil (“belum diambil”); Ujian Expert tetap tersembunyi',async()=>{ await closeAny(p); await markAll(p,BEG); await markAll(p,JUN); const m=await menu(p); return {ok:!m.t2.hidden&&/belum diambil/.test(m.t2.st)&&m.t3.hidden&&m.se01===true,note:`${m.t2.st} | t3 hidden=${m.t3.hidden} | se01 terkunci=${m.se01}`}; });
    await S.t('Q3','Layar hasil J14 menawarkan Ujian Senior; pembuka menyebut 10 teka-teki dan melewati Middle A dan B; “Nanti saja” tidak memakai kesempatan',async()=>{ await closeAny(p);
      const shown=await p.evaluate(()=>{ const T=window.__t; T.setStage(T.STAGES.find(s=>s.id==='j14')); T.showResult(3,100,true,true,1,3); return !document.querySelector('#resTest2Row').hidden; });
      await p.click('#resTest2'); await L.sleep(100); const intro=await result(p); const title=await p.evaluate(()=>document.querySelector('#testTitle').textContent); await p.click('#testLater'); await L.sleep(60);
      const n=await p.evaluate(()=>{ const t=window.__t.tests().t2; return t?t.percobaan.length:0; }); const hid=await p.evaluate(()=>{ const T=window.__t; T.setStage(T.STAGES.find(s=>s.id==='p0')); T.showResult(3,100,true,true,1,3); return document.querySelector('#resTest2Row').hidden; });
      return {ok:shown&&title==='Ujian Senior'&&/10 teka-teki/.test(intro.body)&&/melewati Middle A dan B/.test(intro.body)&&n===0&&hid,note:`tawaran=${shown} judul=${title} percobaan=${n} sembunyi di tahap lain=${hid} | ${intro.body.slice(0,90)}`}; });
    await S.t('Q4','Satu “Aku belum tahu” → Middle Programmer, SE01 tetap terkunci, konsep yang perlu dilatih disebut, tanpa kunci jawaban; log tercatat',async()=>{ await closeAny(p); await open(p,'#menuTest2'); const title=await p.evaluate(()=>document.querySelector('#testTitle').textContent);
      const live1=await (async()=>{ await p.click('#testStart'); await L.sleep(80); return p.evaluate(()=>document.querySelector('#testLive').textContent); })();
      await p.evaluate(()=>{ document.querySelector('#testBody'); }); // sudah di soal 1: ulangi alur penuh lewat reload ringan
      await closeAny(p); await p.evaluate(()=>{ window.__t.tests().t2=null; }); await open(p,'#menuTest2'); const seen=await take(p,'t2',{dunno:[4]}); const r=await result(p); const m=await menu(p);
      const lg=await p.evaluate(()=>window.__t.getLogs().filter(l=>l.jenis==='ujian-senior').pop());
      return {ok:title==='Ujian Senior'&&/Soal 1 dari 10/.test(live1)&&/9 dari 10/.test(r.live)&&/Middle Programmer/.test(r.body)&&/Tumpukan dan antrean/.test(r.body)&&!/✓/.test(r.body)&&m.se01===true&&/setelah 3 tahap baru/.test(m.t2.st)&&lg&&lg.benar===9&&lg.hasil==='middle',note:`${live1} | ${r.live} | ${m.t2.st} | log=${lg&&lg.benar}`}; });
    await S.t('Q5','Tes ulang Senior: tahap Senior dan tahap lama tidak dihitung; hanya 3 tahap Middle baru yang berbeda membukanya',async()=>{ await closeAny(p);
      const a=await p.evaluate(()=>{ const T=window.__t; T.markWin('se05'); const r0=T.tBlocked('t2'); T.markWin('ma01'); T.markWin('ma01'); const r1=T.tBlocked('t2'); T.markWin('ma02'); const r2=T.tBlocked('t2'); T.markWin('mb01'); return {r0,r1,r2,r3:T.tBlocked('t2'),n:T.tests().t2.tahapSejakTes.join()}; });
      return {ok:/3 tahap baru lagi/.test(a.r0||'')&&/2 tahap baru lagi/.test(a.r1||'')&&/1 tahap baru lagi/.test(a.r2||'')&&a.r3===null&&a.n==='ma01,ma02,mb01',note:JSON.stringify(a)}; });
    await S.t('Q6','Tes ulang lulus 10/10 → Senior Programmer, SE01 terbuka (SE02 masih terkunci), varian berbeda per konsep, Ujian Expert muncul',async()=>{ await closeAny(p); await open(p,'#menuTest2'); await take(p,'t2'); const r=await result(p); const goJ=await p.evaluate(()=>{ const e=document.querySelector('#testGoJ'); return e?e.textContent:''; }); await closeAny(p);
      const m=await menu(p); const t=await p.evaluate(()=>window.__t.tests().t2); const diff=t.percobaan[0].varian.every((v,i)=>v!==t.percobaan[1].varian[i]);
      return {ok:/10 dari 10/.test(r.live)&&/Senior Programmer/.test(r.body)&&/Ke SE01 Loket Pesanan/.test(goJ)&&m.se01===false&&m.se02===true&&diff&&t.terbaik==='senior'&&!m.t3.hidden&&/belum diambil/.test(m.t3.st)&&m.ex01===true,note:`${r.live} | ${goJ} | se01 terkunci=${m.se01} se02=${m.se02} | ${t.percobaan[0].varian} vs ${t.percobaan[1].varian} | t3=${m.t3.st}`}; });
    await S.t('Q7','Setelah lulus: tombol Ujian Senior menolak dengan alasan; data tetap setelah muat ulang; hasil terbaik berlaku',async()=>{ const why=await p.evaluate(()=>window.__t.tBlocked('t2')); await p.reload({waitUntil:'load'}); await L.sleep(700); const a=await p.evaluate(()=>({pass:window.__t.tPassed('t2'),n:window.__t.tests().t2.percobaan.length,hasil:window.__t.tests().t2.percobaan.map(x=>x.hasil).join()}));
      return {ok:/sudah lulus Ujian Senior/.test(why||'')&&a.pass&&a.n===2&&a.hasil==='middle,senior',note:`${why} | ${JSON.stringify(a)}`}; });
    await S.t('Q8','Ujian Expert: judul, “Soal 1 dari 8”, satu salah → tetap Senior Programmer (7 dari 8), EX01 terkunci; tes ulang butuh 3 tahap Senior baru',async()=>{ await closeAny(p); await open(p,'#menuTest3'); const title=await p.evaluate(()=>document.querySelector('#testTitle').textContent); const intro=await result(p);
      let live1=''; const seen=await take(p,'t3',{wrong:[2],onQ:async(i)=>{ if(i===0) live1=await p.evaluate(()=>document.querySelector('#testLive').textContent); }}); const r=await result(p); await closeAny(p); const m=await menu(p);
      const a=await p.evaluate(()=>{ const T=window.__t; T.markWin('ma01'); const r0=T.tBlocked('t3'); T.markWin('se01'); T.markWin('se02'); const r1=T.tBlocked('t3'); T.markWin('se03'); return {r0,r1,r2:T.tBlocked('t3')}; });
      return {ok:title==='Ujian Expert'&&/8 teka-teki/.test(intro.body)&&/Soal 1 dari 8/.test(live1)&&/7 dari 8/.test(r.live)&&/Senior Programmer/.test(r.body)&&/Dua pulau|Titik simpan/.test(r.body)&&m.ex01===true&&/3 tahap baru lagi/.test(a.r0||'')&&/1 tahap baru lagi/.test(a.r1||'')&&a.r2===null,note:`${title} | ${live1} | ${r.live} | ${JSON.stringify(a)}`}; });
    await S.t('Q9','Ujian Expert ulang 8/8 → Expert Programmer, EX01 terbuka (EX02 terkunci), tombol “Ke EX01”',async()=>{ await open(p,'#menuTest3'); await take(p,'t3'); const r=await result(p); const goJ=await p.evaluate(()=>{ const e=document.querySelector('#testGoJ'); return e?e.textContent:''; }); await closeAny(p); const m=await menu(p);
      return {ok:/8 dari 8/.test(r.live)&&/Expert Programmer/.test(r.body)&&/Ke EX01 Pabrik Otomatis/.test(goJ)&&m.ex01===false&&m.ex02===true,note:`${r.live} | ${goJ} | ex01 terkunci=${m.ex01} ex02=${m.ex02}`}; });
    await S.t('Q10','“Hapus progres” menghapus hasil Ujian Senior dan Ujian Expert; SE01 dan EX01 terkunci lagi',async()=>{ await p.evaluate(()=>document.querySelector('#btnMenu').click()); await L.sleep(60); await p.click('#progClear'); await p.click('#progClear'); await L.sleep(120); await closeAny(p);
      const a=await p.evaluate(()=>{ const t=window.__t.tests(); return {t2:t.t2&&t.t2.percobaan.length,t3:t.t3&&t.t3.percobaan.length,raw:localStorage.getItem('kn_tes_v1')}; }); const m=await menu(p);
      return {ok:!a.t2&&!a.t3&&m.se01===true&&m.ex01===true&&m.t2.hidden&&m.t3.hidden,note:`${JSON.stringify(a).slice(0,120)} | se01=${m.se01} ex01=${m.ex01} sembunyi=${m.t2.hidden},${m.t3.hidden}`}; });
    await S.t('Q11','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
    await ctx.close(); }

  await S.t('Q12','Tiga percobaan Ujian Senior memakai tiga varian berbeda per konsep; percobaan ke-4 ditolak (“habis”)',async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true,path:'/?benih=515151'}); try{
      await markAll(p,BEG); await markAll(p,JUN); const vars=[]; const mids=await ids(p,'^M[AB]'); 
      for(let k=0;k<3;k++){ if(k>0) await p.evaluate(l=>l.forEach(i=>window.__t.markWin(i)),mids.slice((k-1)*3,(k-1)*3+3)); await closeAny(p); await open(p,'#menuTest2'); const s=await take(p,'t2',{wrong:[0]}); vars.push(s.slice().sort((a,b)=>a.c-b.c).map(x=>x.v)); await closeAny(p); }
      await p.evaluate(l=>l.forEach(i=>window.__t.markWin(i)),mids.slice(6,9)); const why=await p.evaluate(()=>window.__t.tBlocked('t2'));
      const distinct=[0,1,2,3,4,5,6,7,8,9].every(c=>new Set(vars.map(v=>v[c])).size===3); return {ok:distinct&&/habis/.test(why||''),note:`${vars.map(v=>v.join('')).join(' / ')} | ${why}`}; } finally{ await ctx.close(); } });
  await S.t('Q13','Benih sesi sama → urutan soal dan urutan pilihan Ujian Senior sama',async()=>{ const get=async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true,path:'/?benih=333333'}); try{ await markAll(p,BEG); await markAll(p,JUN); await open(p,'#menuTest2'); await p.click('#testStart'); await L.sleep(80);
      const o=await p.evaluate(()=>{ const R=window.__t.getTestRun(); return R.order.join()+'|'+[...document.querySelectorAll('#testBody .t-opt')].map(e=>e.dataset.v).join(''); }); return o; } finally{ await ctx.close(); } };
    const a=await get(), c=await get(); return {ok:a===c,note:`${a} / ${c}`}; });
  await S.t('Q14','Papan ketik di Ujian Senior: panah memilih pilihan berikutnya, Lanjut aktif setelah memilih; kode soal (jika ada) tampil sebagai blok berlabel',async()=>{ const {page:p,ctx}=await L.newPage(b,{locked:true}); try{ await markAll(p,BEG); await markAll(p,JUN); await open(p,'#menuTest2'); await p.click('#testStart'); await L.sleep(80);
      const dis0=await p.evaluate(()=>document.querySelector('#testNext').disabled); await p.keyboard.press('ArrowDown'); await L.sleep(40); const r=await p.evaluate(()=>({checked:[...document.querySelectorAll('#testBody .t-opt')].map(e=>e.getAttribute('aria-checked')).join(','),dis:document.querySelector('#testNext').disabled,live:document.querySelector('#testLive').textContent,radios:document.querySelectorAll('#testBody [role=radiogroup] [role=radio]').length}));
      let pre=0; for(let i=0;i<9;i++){ await p.click('#testBody .t-opt'); await p.click('#testNext'); await L.sleep(40); pre+=await p.evaluate(()=>document.querySelectorAll('#testBody pre.g-code[aria-label]').length); }
      return {ok:dis0&&r.checked.split(',')[1]==='true'&&!r.dis&&/Soal 1 dari 10/.test(r.live)&&r.radios===5&&pre>=4,note:JSON.stringify(r)+` blok kode=${pre}`}; } finally{ await ctx.close(); } });

  // ---------- Gerbang Detak dan Gerbang Antrean lewat UI
  { const {page:p,ctx,errors}=await L.newPage(b,{locked:true,path:'/?benih=777777'});
    await S.t('E1','Menu menampilkan Gerbang Si Teka setelah EX03 dan EX06, terkunci sampai tahapnya selesai; selesai → terbuka tanpa mengunci tahap lain',async()=>{
      const m0=await p.evaluate(()=>{ document.querySelector('#btnMenu').click(); const g=id=>{ const e=document.querySelector(`.gate-item[data-id="${id}"]`); return e?e.classList.contains('locked'):null; }; return {a:g('g_ex03'),b:g('g_ex06'),after3:document.querySelector('.gate-item[data-id="g_ex03"]').previousElementSibling.dataset.id,after6:document.querySelector('.gate-item[data-id="g_ex06"]').previousElementSibling.dataset.id}; });
      await closeAny(p); await p.evaluate(()=>{ window.__t.markWin('ex03'); }); const m1=await p.evaluate(()=>{ document.querySelector('#btnMenu').click(); const g=id=>document.querySelector(`.gate-item[data-id="${id}"]`).classList.contains('locked'); return {a:g('g_ex03'),b:g('g_ex06'),ex04:window.__t.lockReason(window.__t.STAGES.find(s=>s.id==='ex04'))}; });
      return {ok:m0.a===true&&m0.b===true&&m0.after3==='ex03'&&m0.after6==='ex06'&&m1.a===false&&m1.b===true,note:JSON.stringify([m0,m1])}; });
    await S.t('E2','Layar hasil EX03 menawarkan Gerbang Detak; EX06 menawarkan Gerbang Antrean; tahap lain tidak',async()=>{ await closeAny(p);
      const r=await p.evaluate(()=>{ const T=window.__t, o={}; for(const id of ['ex03','ex06','ex02']){ T.setStage(T.STAGES.find(s=>s.id===id)); T.showResult(3,100,true,true,1,3); o[id]=document.querySelector('#resGateRow').hidden?'':document.querySelector('#resGate').textContent; } return o; });
      return {ok:/Gerbang Si Teka/.test(r.ex03)&&/Gerbang Si Teka/.test(r.ex06)&&r.ex02==='',note:JSON.stringify(r)}; });
    await S.t('E3','Semua 6 varian × 3 bentuk (Mudah, Sedang, Sulit) bisa dijawab benar lewat UI: bonus tercatat, gerbang terbuka',async()=>{ await closeAny(p); await p.evaluate(()=>{ window.__t.markWin('ex06'); });
      const out=[]; for(const gid of ['g_ex03','g_ex06']) for(let v=0;v<3;v++) for(const lv of ['easy','medium','hard']){
        const ok=await p.evaluate(async([gid,v,lv])=>{ const T=window.__t; T.setDiff(lv); delete T.getProgress().gerbang[gid]; T.openGate(gid,v); const r=T.getGateRun();
          if(r.bentuk==='pilihan'){ const i=r.opsi.findIndex(o=>o.ok); document.querySelector(`#gateBody .t-opt[data-i="${i}"]`).click(); }
          else { const need=r.q.jawab.split(''); for(const ch of need){ const i=r.ubin.findIndex((t,ix)=>t===ch&&!r.sel.includes(ix)); document.querySelector(`#gateBody .g-tile[data-i="${i}"]`).click(); } }
          document.querySelector('#gateGo').click(); const g2=T.getGateRun(); return {ok:g2.selesai&&g2.ok&&T.getProgress().gerbang[gid].bonus===true&&!document.querySelector('#gateTitle').textContent.includes('undefined'),title:document.querySelector('#gateTitle').textContent,form:r.bentuk}; },[gid,v,lv]);
        out.push(`${gid}/${v}/${lv}:${ok.ok}`); if(!ok.ok) out.push('!'+JSON.stringify(ok)); }
      return {ok:out.every(x=>!x.startsWith('!')&&!/:false/.test(x)),note:out.join(' ')}; });
    await S.t('E4','Gerbang Detak/Antrean: salah 3× → gerbang terbuka tanpa bonus, petunjuk muncul di kesalahan ke-2, penjelasan tampil, tahap berikut tidak terkunci',async()=>{
      const r=await p.evaluate(()=>{ const T=window.__t; T.setDiff('medium'); delete T.getProgress().gerbang.g_ex03; T.openGate('g_ex03',0); const out={}; const wrong=()=>{ const g=T.getGateRun(); const i=g.opsi.findIndex((o,ix)=>!o.ok&&!g.mati.includes(ix)); document.querySelector(`#gateBody .t-opt[data-i="${i}"]`).click(); document.querySelector('#gateGo').click(); };
        wrong(); out.h1=!!document.querySelector('#gateBody .g-hint'); wrong(); out.h2=!!document.querySelector('#gateBody .g-hint'); wrong(); const g=T.getGateRun(); out.sel=g.selesai; out.ok=g.ok; out.bonus=T.getProgress().gerbang.g_ex03.bonus; out.status=T.getProgress().gerbang.g_ex03.status; out.pen=/Jadi jawabannya/.test(document.querySelector('#gateBody').innerText); out.ex04=T.lockReason(T.STAGES.find(s=>s.id==='ex04')); return out; });
      return {ok:!r.h1&&r.h2&&r.sel&&!r.ok&&!r.bonus&&r.status==='terbuka'&&r.pen&&r.ex04===null,note:JSON.stringify(r)}; });
    await S.t('E5','Galat konsol: tidak ada',()=>({ok:errors.length===0,note:errors.join(' | ')}));
    await ctx.close(); }

  // ---------- tata letak HP: seluruh butir 3 percobaan × (10 + 8) soal
  for(const [vw,vh] of [[360,740],[667,375]]) await S.t(`V${vw}`,`Tata letak ${vw}×${vh}: tiap soal Ujian Senior dan Ujian Expert (semua varian): tanpa gulir mendatar, kode terbungkus, pilihan ≥ 44 px, tombol Lanjut dapat dijangkau`,async()=>{
    const {page:p,ctx}=await L.newPage(b,{w:vw,h:vh,touch:true,locked:true,path:'/?benih=909090'}); try{ await markAll(p,BEG); await markAll(p,JUN); const bad=[]; let n=0;
      const mids=await ids(p,'^M[AB]'), seni=await ids(p,'^SE');
      for(const [id,btn,pool] of [['t2','#menuTest2',mids],['t3','#menuTest3',seni]]){
        if(id==='t3'){ await p.evaluate(()=>{ window.__t.tests().t2={urutanVarian:[],percobaan:[{}],tahapSejakTes:[],terbaik:'senior'}; }); }
        for(let k=0;k<3;k++){ if(k>0) await p.evaluate(l=>l.forEach(i=>window.__t.markWin(i)),pool.slice((k-1)*3,(k-1)*3+3)); await closeAny(p); await open(p,btn);
          await take(p,id,{wrong:[0],onQ:async(i,r)=>{ n++; const m=await p.evaluate(()=>{ const sh=document.querySelector('#ovTest .sheet'); const pre=document.querySelector('#testBody pre'); const opts=[...document.querySelectorAll('#testBody .t-opt')]; const nx=document.querySelector('#testNext'); nx.scrollIntoView({block:'nearest'}); const rn=nx.getBoundingClientRect(), rs=sh.getBoundingClientRect();
              return {ovx:sh.scrollWidth>sh.clientWidth+1,preW:pre?pre.scrollWidth>pre.clientWidth+1:false,minH:Math.min(...opts.map(o=>o.getBoundingClientRect().height)),nxIn:rn.bottom<=window.innerHeight+1&&rn.top>=rs.top-1&&rn.height>=44}; });
            if(m.ovx||m.preW||m.minH<44||!m.nxIn) bad.push(`${id}k${k}q${i}c${r.c}${'ABC'[r.v]}:${JSON.stringify(m)}`); }});
          await closeAny(p); } }
      return {ok:!bad.length&&n===54,note:`${n} soal dicek; ${bad.slice(0,4).join(' | ')}`}; } finally{ await ctx.close(); } });
  S.save(); await b.close(); process.exit(0);
})();
