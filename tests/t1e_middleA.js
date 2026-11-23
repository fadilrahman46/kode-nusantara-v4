// T1e — Middle A misi 1 (MA01–MA03, rekursi): acuan lulus; program salah gagal; cara tanpa rekursi melebihi batas kartu; pengaman rekursi tanpa titik berhenti.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1e_middleA');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},alt:{},misc:{}};
    const M={type:'maju'},E={type:'akhir'},MS={type:'mesin'},Sx={type:'susun'},A={type:'atap'};
    const U=n=>({type:'ulangi',n}), P=a=>({type:'pakai',arg:a}), JM=(cmp,n,then)=>({type:'jika',sensor:'masukan',cmp,n,then,else:null});
    const KR={type:'keluar',op:'rek',num:1}, isiH=(box,v)=>({type:'isi',box,value:{t:'hasil',v}}), isiN=(box,v)=>({type:'isi',box,value:{t:'num',v}}), ub=(box,op,num)=>({type:'ubah',box,op,num});
    const REF={
      ma01:[MS,Sx,JM('>',1,'pakaiTurun'),E,M,P(7),A],
      ma02:[MS,JM('=',0,'keluar0'),KR,E,isiH('total',6)],
      ma03:[MS,M,U('masukan'),Sx,E,A,JM('>',1,'pakaiTurun'),E,P(4)]
    };
    const NEG={
      ma01:{'titik berhenti salah (> 0)':[MS,Sx,JM('>',0,'pakaiTurun'),E,M,P(7),A],'tanpa titik berhenti':[MS,Sx,{type:'pakai',arg:7},E,M,P(7),A]},
      ma02:{'tanpa titik berhenti':[MS,KR,E,isiH('total',6)],'titik berhenti > 0':[MS,JM('>',0,'keluar0'),KR,E,isiH('total',6)],'hasil Mesin(5)':[MS,JM('=',0,'keluar0'),KR,E,isiH('total',5)]},
      ma03:{'berhenti di masukan > 0':[MS,M,U('masukan'),Sx,E,A,JM('>',0,'pakaiTurun'),E,P(4)],'masukan awal 3':[MS,M,U('masukan'),Sx,E,A,JM('>',1,'pakaiTurun'),E,P(3)]}
    };
    // cara tanpa rekursi yang benar tetapi terlalu panjang
    const ALT={
      ma01:{'tanpa Mesin':[M,...Array(7).fill(Sx),A],'Mesin 2 balok dipanggil 3 kali':[MS,Sx,Sx,E,M,P(2),P(2),P(2),Sx,A]},
      ma02:{'Isi lalu Ubah':[isiN('total',6),ub('total','+',3),ub('total','+',3),ub('total','+',3),ub('total','+',3),ub('total','+',3)]},
      ma03:{'Mesin bermasukan dipanggil 4 kali':[MS,M,U('masukan'),Sx,E,A,E,P(4),P(3),P(2),P(1)]}
    };
    const cnt=p=>p.filter(c=>c.type!=='akhir').length;
    for(const id of Object.keys(REF)){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); T.setSeed(0);
      const r=T.simulate(REF[id],0); out.ref[id]={ok:r.ok,msg:r.msg||'',len:cnt(REF[id]),limit:st.limit,pal:['easy','medium','hard'].every(d=>REF[id].filter(c=>c.type!=='akhir').every(c=>st.palette[d].includes(c.type)))};
      out.neg[id]={}; for(const [k,p] of Object.entries(NEG[id])){ const x=T.simulate(p,0); out.neg[id][k]={ok:x.ok,msg:(x.msg||'').slice(0,90)}; }
      out.alt[id]={}; for(const [k,p] of Object.entries(ALT[id])){ const x=T.simulate(p,0); out.alt[id][k]={ok:x.ok,len:cnt(p),limit:st.limit,msg:(x.msg||'').slice(0,80)}; } }
    { const st=T.STAGES.find(s=>s.id==='j08'); T.setStage(st); const r=T.simulate([MS,Sx,{type:'pakai',arg:2},E,M,P(2)],0); out.misc.juniorGuard=r.msg; }
    { const st=T.STAGES.find(s=>s.id==='ma01'); T.setStage(st); T.loadStage(st); T.setProgram([MS,Sx,JM('>',1,'pakaiTurun'),E,M,P(7),A]); out.misc.pseudo=T.pseudo(); }
    out.order=T.STAGES.map(s=>s.code.split(' ')[0]).join(' ');
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1e_data.json',JSON.stringify(D,null,2));
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus; kartunya ada di palet ketiga tingkat`,()=>({ok:r.ok&&r.len<=r.limit&&r.pal,note:r.msg||`kartu ${r.len}/${r.limit}`}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,x] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: program salah “${k}” gagal dengan pesan`,()=>({ok:!x.ok&&x.msg.length>0,note:x.msg}));
  for(const [id,o] of Object.entries(D.alt)) for(const [k,x] of Object.entries(o)) await S.t('A-'+id+'-'+k,`${id}: cara tanpa rekursi “${k}” benar tetapi melebihi batas kartu (${x.len} > ${x.limit})`,()=>({ok:x.ok&&x.len>x.limit,note:x.ok?`${x.len} kartu`:'tidak benar: '+x.msg}));
  await S.t('M0','MA01: kartu Ulangi tidak ada di palet mana pun (Ulangi 2 [Ulangi 3 [Susun]] + Susun akan muat 6 kartu tanpa rekursi)',async()=>{ const r=await page.evaluate(()=>{ const st=window.__t.STAGES.find(s=>s.id==='ma01'); return ['easy','medium','hard'].map(d=>st.palette[d].includes('ulangi')); }); return {ok:r.every(x=>!x),note:JSON.stringify(r)}; });
  await S.t('M1','Rekursi tanpa titik berhenti dihentikan dengan pesan “tanpa berhenti”',()=>({ok:/tanpa berhenti/.test(D.neg.ma01['tanpa titik berhenti'].msg+D.neg.ma02['tanpa titik berhenti'].msg),note:D.neg.ma02['tanpa titik berhenti'].msg}));
  await S.t('M2','Di Junior (J08) Mesin memanggil dirinya tetap ditolak',()=>({ok:/tidak boleh menjalankan Mesin/.test(D.misc.juniorGuard||''),note:D.misc.juniorGuard}));
  await S.t('M3','Kode semu rekursi: fungsi mesin(masukan) dengan jika masukan > 1: mesin(masukan - 1)',()=>({ok:/fungsi mesin\(masukan\):\n    susun_balok\(\)\n    jika masukan > 1:\n        mesin\(masukan - 1\)\nmaju\(\)\nmesin\(7\)\npasang_atap\(\)/.test(D.misc.pseudo),note:JSON.stringify(D.misc.pseudo)}));
  await S.t('O1','Urutan menu: … J14 lalu MA01 MA02 MA03',()=>({ok:/J14 MA01 MA02 MA03( |$)/.test(D.order),note:D.order.split(' ').slice(-5).join(' ')}));
  await S.t('E1','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
