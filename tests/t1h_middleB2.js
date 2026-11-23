// T1h — Middle B MB04–MB10 (terkunci, pewarisan, override, polimorfisme, komposisi): acuan lulus di semua keadaan; cara pintas gagal; kode semu.
const L=require('./lib');
(async()=>{
  const b=await L.launch(); const {page,errors}=await L.newPage(b); const S=L.suite('t1h_middleB2');
  const D=await page.evaluate(()=>{
    const T=window.__t, out={ref:{},neg:{},misc:{}}, E={type:'akhir'}, UN={type:'untuk'};
    const CT=(n,induk)=>({type:'cetakan',nama:n,induk:induk||null}), AT=(a,v,k)=>({type:'atribut',attr:a,val:v,kunci:!!k}), MT=n=>({type:'method',nama:n}), BS=b=>({type:'bersuara',bunyi:b});
    const UA=(o,a,op,v)=>({type:'ubahAtr',obj:o,attr:a,op,val:v}), SR=(o,m,n)=>({type:'suruh',obj:o,method:m,n:n==null?null:n}), JW=(a,cmp,rhs)=>({type:'jikaW',attr:a,cmp,rhs});
    const CEL=k=>[CT('Celengan'),AT('saldo',0,k),MT('setor'),UA('diri','saldo','+','masukan'),E,MT('ambil'),JW('saldo','≥','masukan'),UA('diri','saldo','−','masukan'),E,E,E];
    const HEW=(k)=>[CT('Hewan'),AT('energi',0,k),MT('makan'),UA('diri','energi','+',1),E,E];
    const BUR=[CT('Burung','Hewan'),MT('terbang'),BS('wus'),E,E], BUR7=[CT('Burung','Hewan'),AT('sayap',2),MT('terbang'),BS('wus'),E,E];
    const REF={
      mb04:CEL(true),
      mb05:[...HEW(false),...BUR],
      mb06:[...HEW(true),CT('Burung','Hewan'),MT('terbang'),JW('energi','≥',2),UA('diri','energi','−',2),BS('wus'),E,E,E],
      mb07:[...HEW(false),...BUR7,CT('Pinguin','Burung'),MT('terbang'),BS('plung'),E,E],
      mb08:[CT('Kucing'),MT('bernyanyi'),BS('meong'),E,E,CT('Bebek'),MT('bernyanyi'),BS('kwek'),E,E,UN,SR('cur','bernyanyi'),E],
      mb09:[CT('Kamar'),AT('lampu','nyala'),MT('matikan'),UA('diri','lampu','=','mati'),E,E,CT('Rumah'),AT('kamar','Kamar baru'),MT('tidur'),SR('diri.kamar','matikan'),E,E],
      mb10:[CT('Hewan'),AT('energi',0,true),MT('makan'),UA('diri','energi','+',1),E,MT('tampil'),JW('energi','≥',1),UA('diri','energi','−',1),SR('diri','bernyanyi'),E,E,E,
            CT('Kucing','Hewan'),MT('bernyanyi'),BS('meong'),E,E,CT('Bebek','Hewan'),MT('bernyanyi'),BS('kwek'),E,E]
    };
    const NEG={
      mb04:{'saldo tidak dikunci':CEL(false),'ambil tanpa penjaga':[CT('Celengan'),AT('saldo',0,true),MT('setor'),UA('diri','saldo','+','masukan'),E,MT('ambil'),UA('diri','saldo','−','masukan'),E,E],
            'setor dan ambil tertukar':[CT('Celengan'),AT('saldo',0,true),MT('ambil'),UA('diri','saldo','+','masukan'),E,MT('setor'),JW('saldo','≥','masukan'),UA('diri','saldo','−','masukan'),E,E,E],
            'penjaga salah (>)':[CT('Celengan'),AT('saldo',0,true),MT('setor'),UA('diri','saldo','+','masukan'),E,MT('ambil'),JW('saldo','>','masukan'),UA('diri','saldo','−','masukan'),E,E,E]},
      mb05:{'Burung tidak mewarisi':[...HEW(false),CT('Burung'),MT('terbang'),BS('wus'),E,E],'makan disalin ke Burung':[...HEW(false),CT('Burung'),AT('energi',0),MT('makan'),UA('diri','energi','+',1),E,MT('terbang'),BS('wus'),E,E],
            'terbang di Hewan':[CT('Hewan'),AT('energi',0),MT('makan'),UA('diri','energi','+',1),E,MT('terbang'),BS('wus'),E,E,CT('Burung','Hewan'),E]},
      mb06:{'energi tidak dikunci':[...HEW(false),CT('Burung','Hewan'),MT('terbang'),JW('energi','≥',2),UA('diri','energi','−',2),BS('wus'),E,E,E],'terbang tanpa penjaga':[...HEW(true),CT('Burung','Hewan'),MT('terbang'),UA('diri','energi','−',2),BS('wus'),E,E],
            'penjaga ≥ 1':[...HEW(true),CT('Burung','Hewan'),MT('terbang'),JW('energi','≥',1),UA('diri','energi','−',2),BS('wus'),E,E,E]},
      mb07:{'terbang Burung diubah jadi plung':[...HEW(false),CT('Burung','Hewan'),AT('sayap',2),MT('terbang'),BS('plung'),E,E,CT('Pinguin','Burung'),E],'Pinguin tidak mewarisi':[...HEW(false),...BUR7,CT('Pinguin'),MT('terbang'),BS('plung'),E,E],
            'Pinguin mewarisi Hewan langsung':[...HEW(false),...BUR7,CT('Pinguin','Hewan'),MT('terbang'),BS('plung'),E,E],'sayap ditaruh di Hewan':[CT('Hewan'),AT('energi',0),AT('sayap',2),MT('makan'),UA('diri','energi','+',1),E,E,...BUR,CT('Pinguin','Hewan'),MT('terbang'),BS('plung'),E,E]},
      mb08:{'Bit yang bersuara':[UN,BS('meong'),E],'hanya cetakan Kucing':[CT('Kucing'),MT('bernyanyi'),BS('meong'),E,E,UN,SR('cur','bernyanyi'),E],'Bebek mengeong':[CT('Kucing'),MT('bernyanyi'),BS('meong'),E,E,CT('Bebek'),MT('bernyanyi'),BS('meong'),E,E,UN,SR('cur','bernyanyi'),E]},
      mb09:{'lampu milik Rumah (tanpa kamar)':[CT('Rumah'),AT('lampu','nyala'),MT('tidur'),UA('diri','lampu','=','mati'),E,E],'lampu kamar awalnya mati':[CT('Kamar'),AT('lampu','mati'),MT('matikan'),UA('diri','lampu','=','mati'),E,E,CT('Rumah'),AT('kamar','Kamar baru'),MT('tidur'),SR('diri.kamar','matikan'),E,E],
            'Rumah tidur tanpa menyuruh kamar':[CT('Kamar'),AT('lampu','nyala'),MT('matikan'),UA('diri','lampu','=','mati'),E,E,CT('Rumah'),AT('kamar','Kamar baru'),MT('tidur'),E,E]},
      mb10:{'energi tidak dikunci':[CT('Hewan'),AT('energi',0),MT('makan'),UA('diri','energi','+',1),E,MT('tampil'),JW('energi','≥',1),UA('diri','energi','−',1),SR('diri','bernyanyi'),E,E,E,CT('Kucing','Hewan'),MT('bernyanyi'),BS('meong'),E,E,CT('Bebek','Hewan'),MT('bernyanyi'),BS('kwek'),E,E],
            'tampil tanpa penjaga':[CT('Hewan'),AT('energi',0,true),MT('makan'),UA('diri','energi','+',1),E,MT('tampil'),UA('diri','energi','−',1),SR('diri','bernyanyi'),E,E,CT('Kucing','Hewan'),MT('bernyanyi'),BS('meong'),E,E,CT('Bebek','Hewan'),MT('bernyanyi'),BS('kwek'),E,E],
            'tampil ditulis di tiap cetakan (tanpa mewarisi)':[CT('Kucing'),AT('energi',0,true),MT('makan'),UA('diri','energi','+',1),E,MT('tampil'),JW('energi','≥',1),UA('diri','energi','−',1),BS('meong'),E,E,E,CT('Bebek'),AT('energi',0,true),MT('makan'),UA('diri','energi','+',1),E,MT('tampil'),JW('energi','≥',1),UA('diri','energi','−',1),BS('kwek'),E,E,E]}
    };
    const cnt=p=>p.filter(c=>c.type!=='akhir').length;
    for(const id of Object.keys(REF)){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); const n=st.variants.length;
      const per=[]; for(let v=0;v<n;v++){ const r=T.simulate(REF[id],v); per.push(r.ok?'ok':`v${v}: ${r.msg}`); }
      out.ref[id]={ok:per.every(x=>x==='ok'),msg:per.filter(x=>x!=='ok').join(' | '),len:cnt(REF[id]),limit:st.limit,n,pal:['easy','medium','hard'].every(d=>REF[id].filter(c=>c.type!=='akhir').every(c=>st.palette[d].includes(c.type))),palMax:Math.max(...['easy','medium','hard'].map(d=>st.palette[d].length))};
      out.neg[id]={}; for(const [k,p] of Object.entries(NEG[id])){ let fail=null; for(let v=0;v<n&&!fail;v++){ const x=T.simulate(p,v); if(!x.ok) fail={v,msg:(x.msg||'').slice(0,160)}; } out.neg[id][k]=fail||{v:-1,msg:''}; out.neg[id][k].len=cnt(p); out.neg[id][k].limit=st.limit; } }
    for(const id of ['mb04','mb09','mb10']){ const st=T.STAGES.find(s=>s.id===id); T.setStage(st); T.loadStage(st); T.setProgram(REF[id]); out.misc['ps_'+id]=T.pseudo(); }
    { const st=T.STAGES.find(s=>s.id==='mb06'); T.setStage(st); const w=T.freshWorld(); let last=null; for(const s of T.interpret([...REF.mb06],()=>w)){ last=T.execStep(w,s); if(!last.ok) break; } out.misc.locked=w.objek[0].kunci.join(',')+'|'+w.objek[0].attrs.energi; }
    out.order=T.STAGES.map(s=>s.code.split(' ')[0]).join(' ');
    return out;
  });
  require('fs').writeFileSync(__dirname+'/results/t1h_data.json',JSON.stringify(D,null,2));
  for(const [id,r] of Object.entries(D.ref)) await S.t('R-'+id,`${id}: program acuan (${r.len} kartu, batas ${r.limit}) lulus di semua ${r.n} keadaan; kartunya ada di palet; palet ≤ 7`,()=>({ok:r.ok&&r.len<=r.limit&&r.pal&&r.palMax<=7,note:r.msg||`kartu ${r.len}/${r.limit}, palet maks ${r.palMax}`}));
  for(const [id,o] of Object.entries(D.neg)) for(const [k,x] of Object.entries(o)) await S.t('N-'+id+'-'+k,`${id}: cara salah “${k}” gagal (atau melebihi batas kartu)`,()=>({ok:(x.v>=0&&x.msg.length>0)||x.len>x.limit,note:x.v>=0?`keadaan ${x.v}: ${x.msg}`:(x.len>x.limit?`benar tetapi ${x.len} > ${x.limit} kartu`:'LOLOS')}));
  await S.t('P1','Kode semu MB04: atribut terkunci, fungsi dengan masukan, += / -=',()=>({ok:/kelas Celengan:\n    saldo = 0  # terkunci\n    fungsi setor\(diri, masukan\):\n        diri.saldo \+= masukan\n    fungsi ambil\(diri, masukan\):\n        jika diri.saldo >= masukan:\n            diri.saldo -= masukan/.test(D.misc.ps_mb04),note:JSON.stringify(D.misc.ps_mb04)}));
  await S.t('P2','Kode semu MB09: komposisi kamar = Kamar(), diri.kamar.matikan()',()=>({ok:/kamar = Kamar\(\)/.test(D.misc.ps_mb09)&&/diri\.kamar\.matikan\(\)/.test(D.misc.ps_mb09),note:JSON.stringify(D.misc.ps_mb09)}));
  await S.t('P3','Kode semu MB10: kelas Kucing(Hewan), diri.bernyanyi()',()=>({ok:/kelas Kucing\(Hewan\):/.test(D.misc.ps_mb10)&&/diri\.bernyanyi\(\)/.test(D.misc.ps_mb10),note:JSON.stringify(D.misc.ps_mb10).slice(0,200)}));
  await S.t('O1','Urutan menu: … MB03 lalu MB04 … MB10',()=>({ok:/MB03 MB04 MB05 MB06 MB07 MB08 MB09 MB10( (SE|EX)\d\d)*$/.test(D.order),note:D.order.split(' ').slice(-8).join(' ')}));
  await S.t('E1','Tidak ada galat konsol',()=>({ok:errors.length===0,note:errors.join(' | ')}));
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
