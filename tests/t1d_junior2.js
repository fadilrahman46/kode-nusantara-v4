// T1d — Junior J07–J14 (Mesin, masukan, keluaran, Rak, Untuk setiap, penutup): program acuan lulus di semua keadaan;
// program salah gagal; tanpa Mesin / Untuk setiap / Selama tidak ada program ≤ batas kartu yang lulus (BFS menurut biaya, Ulangi k [satu kartu] dihitung 2 kartu);
// perilaku penafsir (masukan, Keluarkan, larangan Mesin memanggil diri, isi rak sekarang).
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1d_junior2');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},flat:{},misc:{}};
    const M={type:'maju'},E={type:'akhir'},MS={type:'mesin'},Sx={type:'susun'},A={type:'atap'},UT={type:'untuk'},Tk={type:'tekan'},Bg={type:'buang'};
    const U=n=>({type:'ulangi',n}), P=a=>({type:'pakai',arg:a===undefined?null:a}), K=(op,num)=>({type:'keluar',op,num});
    const isiH=(box,v)=>({type:'isi',box,value:{t:'hasil',v}}), isiN=(box,v)=>({type:'isi',box,value:{t:'num',v}}), ub=(box,op,num)=>({type:'ubah',box,op,num});
    const AR=i=>({type:'ambilRak',idx:i}), JR={type:'jika',sensor:'rusak',then:'buang',else:null}, JP={type:'jika',sensor:'tanda',then:'pakai',else:null};
    const W=s=>({type:'selama',s,neg:false,op:null,s2:s,neg2:false});
    const REF={
      j07:[MS,Sx,Sx,A,E,M,P(),M,M,P(),M,M,M,P()],
      j08:[MS,U('masukan'),Sx,E,A,E,M,P(2),M,M,P(4),M,M,M,P(3)],
      j09:[MS,K('×',4),E,isiH('bahanA',2),isiH('bahanB',3),isiH('bahanC',5)],
      j10:[MS,U(3),Sx,E,A,E,U(5),M,JP,E],
      j11:[AR(2),AR(4)],
      j12:[UT,JR,E],
      j13:[isiN('total',0),UT,ub('total','+','cur'),E],
      j14:[isiN('minyak',0),UT,ub('minyak','+','cur'),E,W('jalan'),M,E,Tk]
    };
    const NEG={
      j07:{'Mesin tanpa atap':[MS,Sx,Sx,E,M,P(),M,M,P(),M,M,M,P()],'Jalankan tanpa Buat Mesin':[M,P(),M,M,P(),M,M,M,P()],'Mesin dijalankan di lahan salah':[MS,Sx,Sx,A,E,P(),M,M,P(),M,M,M,P()]},
      j08:{'tinggi tetap 3':[MS,U(3),Sx,E,A,E,M,P(2),M,M,P(4),M,M,M,P(3)],'masukan tertukar':[MS,U('masukan'),Sx,E,A,E,M,P(4),M,M,P(2),M,M,M,P(3)]},
      j09:{'dikali 3':[MS,K('×',3),E,isiH('bahanA',2),isiH('bahanB',3),isiH('bahanC',5)],'Mesin tanpa Keluarkan':[MS,E,isiH('bahanA',2),isiH('bahanB',3),isiH('bahanC',5)],'ditambah 4':[MS,K('+',4),E,isiH('bahanA',2),isiH('bahanB',3),isiH('bahanC',5)]},
      j10:{'tanpa Jika':[MS,U(3),Sx,E,A,E,U(5),M,P(),E],'Jika hanya Susun':[U(5),M,{type:'jika',sensor:'tanda',then:'susun',else:null},E]},
      j11:{'menghitung dari 1':[AR(3),AR(5)],'urutan terbalik':[AR(4),AR(2)]},
      j12:{'buang semua':[UT,Bg,E],'Ulangi, bukan Untuk setiap':[U(4),JR,E]},
      j13:{'lupa mengisi 0':[UT,ub('total','+','cur'),E],'menambah 1 tiap barang':[isiN('total',0),UT,ub('total','+',1),E]},
      j14:{'lupa tekan':[isiN('minyak',0),UT,ub('minyak','+','cur'),E,W('jalan'),M,E],'jalan dihitung tetap':[isiN('minyak',0),UT,ub('minyak','+','cur'),E,U(3),M,E,Tk]}
    };
    const cnt=p=>p.filter(c=>c.type!=='akhir').length;
    for(const id of Object.keys(REF)){
      const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      const run=p=>{ const res=[]; for(let i=0;i<n;i++){ T.setSeed(i); const r=T.simulate(p,i); res.push({ok:r.ok,msg:r.msg||'',label:st.variants[i].label}); } return res; };
      out.ref[id]={n,limit:st.limit,len:cnt(REF[id]),res:run(REF[id]),pal:['easy','medium','hard'].every(d=>REF[id].filter(c=>c.type!=='akhir').every(c=>st.palette[d].includes(c.type)))};
      out.neg[id]={}; for(const [k,p] of Object.entries(NEG[id])) out.neg[id][k]=run(p).map(x=>x.ok?'✓':'✗: '+x.msg.slice(0,70));
      if(id==='j11') continue;
      // BFS menurut biaya tanpa Mesin/Untuk setiap/Selama
      const hard=st.palette.hard, boxes=Object.keys(st.boxLabels||{}), single=[];
      for(const t of hard){
        if(['mesin','untuk','selama','pakai','keluar','ulangi'].includes(t)) continue;
        if(t==='isi'){ for(const bx of boxes) for(const v of (st.values||[])) if(v.t!=='hasil') single.push({type:'isi',box:bx,value:v}); }
        else if(t==='ubah'){ for(const bx of boxes) for(const op of ['+','−','×','÷']) for(const nn of st.nums) single.push({type:'ubah',box:bx,op,num:nn}); }
        else if(t==='ambilRak'){ for(const i of st.rakIdx) single.push({type:'ambilRak',idx:i}); }
        else if(t==='jika'){ for(const a of st.jikaActs||[]) if(a!=='pakai') single.push({type:'jika',sensor:st.sensors[0],then:a,else:null}); }
        else single.push({type:t});
      }
      const atoms=single.map(a=>({cost:1,seq:[a]}));
      if(hard.includes('ulangi')) for(const k of (st.loopNums||[]).filter(x=>typeof x==='number')) for(const a of single) atoms.push({cost:2,seq:Array(k).fill(a)});
      const mk=()=>{ const ws=[]; for(let i=0;i<n;i++){ T.setSeed(i); ws.push(T.freshWorld()); } return ws; };
      const seen=new Map(), layers=Array.from({length:st.limit+1},()=>[]); const w0=mk(); seen.set(JSON.stringify(w0),0); layers[0].push(w0);
      let found=null, explored=0;
      for(let k=0;k<st.limit&&!found;k++) for(const ws of layers[k]){ for(const at of atoms){ const c2=k+at.cost; if(c2>st.limit) continue;
          const ws2=JSON.parse(JSON.stringify(ws)); let ok=true;
          for(let i=0;i<n&&ok;i++){ T.setSeed(i); for(const a of at.seq){ if(!T.apply(ws2[i],a).ok){ ok=false; break; } } }
          if(!ok) continue; const kk=JSON.stringify(ws2); if(seen.has(kk)&&seen.get(kk)<=c2) continue; seen.set(kk,c2); layers[c2].push(ws2); explored++;
          let all=true; for(let i=0;i<n;i++){ T.setSeed(i); if(!st.check(ws2[i]).ok){ all=false; break; } } if(all){ found=c2; break; } }
        if(found||explored>300000) break; }
      out.flat[id]={found,explored,atoms:atoms.length,capped:explored>300000};
    }
    // penafsir
    const steps=(id,prog,seed)=>{ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); T.setSeed(seed||0); const w=T.freshWorld(); const seq=[]; let last=null; for(const s of T.interpret(prog,()=>w)){ const r=T.execStep(w,s); seq.push(s.index+(s.ctl?'c':'')+(r.ok?'':'!')); last=r; if(!r.ok||seq.length>80) break; } return {seq:seq.join(' '),last,w}; };
    { const r=steps('j08',[MS,U('masukan'),Sx,E,A,E,M,P(3)]); out.misc.masukan={seq:r.seq,h:r.w.lots[0].h,roof:r.w.lots[0].roof}; }
    { const r=steps('j08',[MS,P(2),E,M,P(2)]); out.misc.recursion=r.last.msg; }
    { const r=steps('j08',[U('masukan'),Sx,E]); out.misc.masukanOutside=r.last.msg; }
    { const r=steps('j09',[MS,K('×',4),Sx,E,isiH('bahanA',2)]); out.misc.keluarStops={seq:r.seq,val:r.w.boxes.bahanA.value}; }
    { const r=steps('j12',[UT,JR,E],0); out.misc.cur={seq:r.seq,cur:r.w.cur,thrown:r.w.rak.filter(x=>x.buang).map(x=>x.nama).join(',')}; }
    { const r=steps('j12',[JR],0); out.misc.rusakOutside=r.last.msg; }
    { const r=steps('j11',[AR(5)]); out.misc.offByOne=r.last.msg; }
    T.setSeed(0); out.order=T.STAGES.map(s=>s.code.slice(0,3)).join(' ');
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1d_data.json',JSON.stringify(D,null,2));
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan; kartunya ada di palet ketiga tingkat`,()=>({ok:r.res.every(x=>x.ok)&&r.len<=r.limit&&r.pal,note:r.res.filter(x=>!x.ok).map(x=>x.label+': '+x.msg).join(' | ')||`kartu ${r.len}/${r.limit}`}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,res] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: program salah “${k}” gagal di minimal satu keadaan`,()=>({ok:res.some(x=>x!=='✓'),note:res.join(' | ')}));
  for(const [id,o] of Object.entries(D.flat)) await S.t('F-'+id,`${id}: tanpa Mesin / Untuk setiap / Selama tidak ada program ≤ batas kartu yang lulus semua keadaan`,()=>({ok:o.found===null&&!o.capped,note:`atom=${o.atoms}, keadaan dijelajahi=${o.explored}, solusi=${o.found}`}));
  await S.t('M1','Masukan: Mesin [Ulangi masukan [Susun], Atap] dijalankan dengan 3 → menara 3 balok beratap',()=>({ok:D.misc.masukan.h===3&&D.misc.masukan.roof,note:JSON.stringify(D.misc.masukan)}));
  await S.t('M2','Mesin yang menjalankan Mesin di dalam dirinya ditolak dengan pesan (rekursi = materi Middle)',()=>({ok:/tidak boleh menjalankan Mesin/.test(D.misc.recursion||''),note:D.misc.recursion}));
  await S.t('M3','“masukan” di luar Mesin ditolak dengan pesan',()=>({ok:/hanya punya nilai di dalam Mesin/.test(D.misc.masukanOutside||''),note:D.misc.masukanOutside}));
  await S.t('M4','Keluarkan menghentikan Mesin (kartu sesudahnya tidak dijalankan) dan hasilnya mengisi kotak',()=>({ok:D.misc.keluarStops.val&&D.misc.keluarStops.val.v===8&&!/ 2( |$)/.test(D.misc.keluarStops.seq),note:JSON.stringify(D.misc.keluarStops)}));
  await S.t('M5','Untuk setiap: “isi rak sekarang” berganti per isi rak dan kosong lagi sesudahnya; yang dibuang tepat yang rusak',()=>({ok:D.misc.cur.cur===null&&D.misc.cur.thrown==='beras,jagung',note:JSON.stringify(D.misc.cur)}));
  await S.t('M6','Pertanyaan “rusak?” di luar Untuk setiap ditolak dengan pesan',()=>({ok:/hanya bisa dipakai di dalam kartu Untuk setiap/.test(D.misc.rusakOutside||''),note:D.misc.rusakOutside}));
  await S.t('M7','Rak nomor 5 pada rak 5 barang ditolak dengan pesan “dimulai dari 0”',()=>({ok:/0 sampai 4.*dimulai dari 0/.test(D.misc.offByOne||''),note:D.misc.offByOne}));
  await S.t('O1','Urutan menu: B01–B13 lalu J01–J14',()=>({ok:/B13 J01 J02 J03 J04 J05 J06 J07 J08 J09 J10 J11 J12 J13 J14/.test(D.order),note:D.order}));
  await S.t('E1','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
