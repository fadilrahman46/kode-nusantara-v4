// T1j — Senior SE01–SE10 (Papan Sistem): acuan lulus di semua keadaan; cara pintas gagal dengan pesan bermakna; kode semu; palet dan batas kartu.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1j_senior');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},misc:{}}, E={type:'akhir'};
    const K=(a,ak,n,j)=>({type:'kirim',alamat:a,aksi:ak,nama:n,jumlah:j}), JS=(s,m)=>({type:'jikaS',syarat:s,maka:m});
    const UL=n=>({type:'ulangi',n}), SEL=s=>({type:'selama',neg:false,s,op:null,neg2:false,s2:s});
    const SM={type:'simpan'}, TP=d=>({type:'terapkan',dari:d||null}), BC=n=>({type:'buatCabang',nama:n}), PI=k=>({type:'pindah',ke:k}), GB=c=>({type:'gabung',cabang:c}), PL=u=>({type:'pilih',ubahan:u});
    const MU={type:'mundur'}, BT={type:'buangT'}, TT={type:'terapkanT'}, MB=x=>({type:'masukBahan',bahan:x}), BP={type:'buatPeti'}, KP=p=>({type:'kirimPeti',pulau:p}), G=t=>({type:'gerbang',tahap:t}), R=k=>({type:'rollback',kapan:k}), PN=m=>({type:'pantau',metrik:m});
    const B='/barang',P='pesan',KO=(n,j)=>K(B,P,n,j);
    const W3=[KO('kopi',2),KO('gula',1),KO('teh',3)];
    const S10=[KO('Kayu',1),JS('habis','cadangan'),KO('Paku',1),JS('habis','cadangan'),SM,MB('Kayu'),MB('Paku'),BP,KP('Pulau Barat'),JS('ujiGagal','pulih'),KP('Pulau Timur'),JS('ujiGagal','pulih')];
    const REF={se01:W3,se02:[KO('kopi',2),JS('habis','cadangan'),JS('hilang','alamatBaru')],se03:W3,
      se04:[UL(6),SM,TP(),JS('petaRusak','kembaliTerakhir'),E],se05:[BC('Rani'),BC('Dodi'),PI('Rani'),TP('Rani'),PI('Dodi'),TP('Dodi')],
      se06:[GB('Rani'),GB('Dodi'),SEL('adaKonflik'),PL('keduanya'),E],se07:[SEL('petaRusak'),MU,E,BT,SEL('adaTertunda'),TT,E],
      se08:[MB('Python'),MB('Pustaka grafik'),MB('Font'),BP,KP('Pulau Barat'),KP('Pulau Timur')],se09:[G('staging'),PN('pengguna'),R(1)],se10:S10};
    const NEG={
      se01:{'alamat salah (/gudang)':[K('/gudang',P,'kopi',2),KO('gula',1),KO('teh',3)],'aksi salah (lihat)':[K(B,'lihat','kopi',2),KO('gula',1),KO('teh',3)],'jumlah 6 ditolak':[KO('kopi',2),KO('gula',1),KO('teh',6)],'kurang satu barang':[KO('kopi',2),KO('gula',1)],'barang tidak dipesan':[KO('kopi',2),KO('gula',1),KO('susu',3)]},
      se02:{'tanpa Jika':[KO('kopi',2)],'hanya stok habis':[KO('kopi',2),JS('habis','cadangan')],'hanya tidak ditemukan':[KO('kopi',2),JS('hilang','alamatBaru')],'tidak ditemukan ke /cadangan':[KO('kopi',2),JS('habis','cadangan'),JS('hilang','cadangan')],'selalu kirim ulang (tanpa memeriksa)':[KO('kopi',2),JS('berhasil','cadangan')]},
      se04:{'tanpa Jika':[UL(6),SM,TP(),E],'kembali ke versi pertama':[UL(6),SM,TP(),JS('petaRusak','kembaliPertama'),E],'simpan sesudah terapkan':[UL(6),TP(),SM,JS('petaRusak','kembaliTerakhir'),E],'ulangi 5 kali':[UL(5),SM,TP(),JS('petaRusak','kembaliTerakhir'),E],'ulangi 7 kali':[UL(7),SM,TP(),JS('petaRusak','kembaliTerakhir'),E],'kembali sebelum yang terakhir':[UL(6),SM,TP(),JS('petaRusak','kembaliSebelum'),E]},
      se05:{'semua di utama':[TP('Rani'),TP('Dodi')],'tanpa cabang Dodi':[BC('Rani'),PI('Rani'),TP('Rani')],'terapkan sebelum pindah':[BC('Rani'),BC('Dodi'),TP('Rani'),TP('Dodi')],'cabang kosong':[BC('Rani'),BC('Dodi')]},
      se06:{'selalu pilih ubahan Rani':[GB('Rani'),GB('Dodi'),SEL('adaKonflik'),PL('rani'),E],'selalu pilih ubahan Dodi':[GB('Rani'),GB('Dodi'),SEL('adaKonflik'),PL('dodi'),E],'tanpa memilih':[GB('Rani'),GB('Dodi')],'memilih tepat satu kali':[GB('Rani'),GB('Dodi'),PL('keduanya')],'hanya satu cabang digabung':[GB('Rani'),SEL('adaKonflik'),PL('keduanya'),E]},
      se07:{'mundur saja':[SEL('petaRusak'),MU,E],'tanpa membuang bug':[SEL('petaRusak'),MU,E,SEL('adaTertunda'),TT,E],'membuang tanpa menerapkan ulang':[SEL('petaRusak'),MU,E,BT]},
      se08:{'hanya Python':[MB('Python'),BP,KP('Pulau Barat'),KP('Pulau Timur')],'tanpa Font':[MB('Python'),MB('Pustaka grafik'),BP,KP('Pulau Barat'),KP('Pulau Timur')],'semua bahan (peti penuh)':[MB('Python'),MB('Pustaka grafik'),MB('Font'),MB('Basis data'),MB('Editor'),BP,KP('Pulau Barat'),KP('Pulau Timur')],'peti hanya ke Barat':[MB('Python'),MB('Pustaka grafik'),MB('Font'),BP,KP('Pulau Barat')],'kirim sebelum peti':[MB('Python'),KP('Pulau Barat')]},
      se09:{'tanpa gerbang':[PN('pengguna'),R(1)],'gerbang di uji saja':[G('uji'),PN('pengguna'),R(1)],'tanpa pemantau (rollback ditolak)':[G('staging'),R(1)],'pemantau kesehatan buta cacat senyap':[G('staging'),PN('kesehatan'),R(1)],'tanpa rollback':[G('staging'),PN('pengguna')],'gerbang di build tidak melihat apa pun':[G('build'),PN('pengguna'),R(1)],'pemantau beban server buta cacat aplikasi':[G('staging'),PN('beban'),R(1)],'rollback setelah 5 detak':[G('staging'),PN('pengguna'),R(5)],'rollback setelah 2 detak':[G('staging'),PN('pengguna'),R(2)],'rollback sebelum pemantau':[G('staging'),R(1),PN('pengguna')],'dua gerbang melebihi anggaran':[G('uji'),G('staging'),PN('pengguna')]},
      se10:{'tanpa cadangan':S10.filter(c=>!(c.type==='jikaS'&&c.maka==='cadangan')),'tanpa pulihkan':S10.filter(c=>!(c.type==='jikaS'&&c.maka==='pulih')),'tanpa simpan versi':S10.filter(c=>c.type!=='simpan'),'selalu kembali tanpa memeriksa':[...S10.slice(0,8),KP('Pulau Barat'),JS('habis','pulih'),KP('Pulau Timur'),JS('habis','pulih')],'selalu cadangan':[KO('Kayu',1),JS('berhasil','cadangan'),KO('Paku',1),JS('berhasil','cadangan'),SM,MB('Kayu'),MB('Paku'),BP,KP('Pulau Barat'),KP('Pulau Timur')]}
    };
    const cnt=p=>p.filter(c=>c.type!=='akhir').length;
    for(const id of Object.keys(REF)){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      const per=[]; for(let v=0;v<n;v++){ const r=T.simulate(REF[id],v); per.push(r.ok?'ok':`v${v}: ${r.msg}`); }
      out.ref[id]={ok:per.every(x=>x==='ok'),msg:per.filter(x=>x!=='ok').join(' | '),len:cnt(REF[id]),limit:st.limit,n,pal:['easy','medium','hard'].every(d=>REF[id].filter(c=>c.type!=='akhir').every(c=>st.palette[d].includes(c.type))),palMax:Math.max(...['easy','medium','hard'].map(d=>st.palette[d].length))};
      if(NEG[id]){ out.neg[id]={}; for(const [k,p] of Object.entries(NEG[id])){ let fail=null; for(let v=0;v<n&&!fail;v++){ const x=T.simulate(p,v); if(!x.ok) fail={v,msg:(x.msg||'').slice(0,200)}; } out.neg[id][k]=fail||{v:-1,msg:''}; out.neg[id][k].len=cnt(p); out.neg[id][k].limit=st.limit; } } }
    { const st=T.STAGES.find(s=>s.id==='se03'); T.setStage(st); out.neg.se03={}; out.misc.prefill=[];
      for(let v=0;v<st.variants.length;v++){ T.setSeed(v); const pf=st.prefill(); out.misc.prefill.push(pf.length); const x=T.simulate(pf,v); out.neg.se03['program teman apa adanya, keadaan '+v]={v:x.ok?-1:v,msg:(x.msg||'').slice(0,200),len:pf.length,limit:st.limit};
        const fixed=pf.map((c,i)=>W3[i]); const y=T.simulate(fixed,v); out.misc['fix'+v]=y.ok; } }
    for(const id of ['se02','se04','se06','se10']){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); T.loadStage(st); T.setProgram(REF[id]); out.misc['ps_'+id]=T.pseudo(); out.misc['tx_'+id]=REF[id].filter(c=>c.type!=='akhir').map(c=>T.cardText(c)); }
    out.order=T.STAGES.map(s=>s.code.split(' ')[0]).join(' ');
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1j_data.json',JSON.stringify(D,null,2));
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan; kartunya ada di palet; palet ≤ 7`,()=>({ok:r.ok&&r.len<=r.limit&&r.pal&&r.palMax<=7,note:r.msg||`kartu ${r.len}/${r.limit}, palet maks ${r.palMax}`}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,x] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: cara salah “${k}” gagal dengan pesan (atau melebihi batas kartu)`,()=>({ok:(x.v>=0&&x.msg.length>20)||x.len>x.limit,note:x.v>=0?`keadaan ${x.v}: ${x.msg}`:(x.len>x.limit?`benar tetapi ${x.len} > ${x.limit}`:'LULUS (cara pintas berhasil!)')}));
  await S.t('F3','SE03: program teman berisi 3 kartu = batas; memperbaiki satu bagian lulus di semua keadaan',()=>({ok:D.misc.prefill.every(n=>n===3)&&[0,1,2].every(v=>D.misc['fix'+v]),note:JSON.stringify(D.misc.prefill)}));
  await S.t('P1','Kode semu SE02: kirim(...) dan jika jawaban.status',()=>({ok:/jawaban = kirim\("\/barang", "pesan", \{nama: "kopi", jumlah: 2\}\)/.test(D.misc.ps_se02)&&/jika jawaban\.status == "stok habis":\n    kirim_ulang\("\/cadangan"\)/.test(D.misc.ps_se02),note:JSON.stringify(D.misc.ps_se02)}));
  await S.t('P2','Kode semu SE04: ulangi dengan simpan, terapkan, jika peta.rusak()',()=>({ok:/ulangi 6 kali:\n    versi = simpan\(\)\n    terapkan\(perubahan_berikutnya\)\n    jika peta\.rusak\(\):\n        kembali\(versi_terakhir\)/.test(D.misc.ps_se04),note:JSON.stringify(D.misc.ps_se04)}));
  await S.t('P3','Kode semu SE06: selama gabungan.ada_konflik()',()=>({ok:/gabungan\.ada_konflik\(\)/.test(D.misc.ps_se06)&&/konflik\.selesaikan\("keduanya"\)/.test(D.misc.ps_se06),note:JSON.stringify(D.misc.ps_se06)}));
  await S.t('P4','Teks kartu dibaca manusia (SE10)',()=>({ok:D.misc.tx_se10.includes('Kirim permintaan ke /barang, aksi pesan, isi Kayu × 1')&&D.misc.tx_se10.includes('Jika uji di pulau tadi gagal maka kembali ke versi tersimpan'),note:D.misc.tx_se10.join(' | ')}));
  await S.t('O1','Urutan menu: … MB10 lalu SE01 … SE10',()=>({ok:/MB10 SE01 SE02 SE03 SE04 SE05 SE06 SE07 SE08 SE09 SE10( EX\d\d)*$/.test(D.order),note:D.order.split(' ').slice(-12).join(' ')}));
  await S.t('E1','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
