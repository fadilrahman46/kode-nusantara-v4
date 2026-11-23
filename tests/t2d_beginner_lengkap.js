// T2d — Stage Beginner baru lewat ANTARMUKA (ketuk kartu, picker, Jalankan): menang, penilaian lintas-variasi, picker kartu Jika, kode semu.
// PART=1: s02 s03 s04 s11 | PART=2: s05 s06 s07 | PART=3: s12 s13 + kasus penilaian lintas-variasi
const L=require('./lib');
const PART=+(process.env.PART||0);
const J=(sensor,o,then,els)=>({type:'jika',sensor,then,else:els===undefined?null:els,...o});
(async()=>{
  const b=await L.launch(); const S=L.suite('t2d_beginner_lengkap'+(PART?'_p'+PART:''));
  const lbl={maju:'Maju',kiri:'Belok kiri',kanan:'Belok kanan'};
  async function open(page,id,seed){ await L.openStage(page,id); if(seed!==undefined) await page.evaluate(s=>window.__t.showSeed(s),seed); await page.evaluate(()=>{ if(document.querySelector('#btnSpeed').textContent==='🐢') document.querySelector('#btnSpeed').click(); }); try{ await page.click('#bubbleClose'); }catch(e){} await L.sleep(100); }
  async function tap(page,type){ await page.click(`#palette .card[data-type="${type}"]`); await L.sleep(40); }
  async function build(page,items){ // items: string | {type:'jika',...} | {type:'isi',box,value} | {type:'ubah',...}
    for(const it of items){
      if(typeof it==='string'){ await tap(page,it); continue; }
      await tap(page,it.type); const n=(await L.boardCards(page)).length-1;
      if(it.type==='jika'){
        const ch=[]; ch.push(['Jika',({tembok:'Ada tembok',warna:'Warna lantai',kotak:'Isi kotak dibandingkan',sakelar:'Sakelar nyala'})[it.sensor]]);
        if(it.sensor==='warna') ch.push(['Warna',it.color]);
        if(it.sensor==='kotak'){ ch.push(['Kotak',it.box]); ch.push(['Pembanding',it.cmp]); ch.push(['Angka',String(it.n)]); }
        if(it.sensor==='sakelar') ch.push(['Sakelar',it.box]);
        ch.push(['Maka',({maju:'Maju',kiri:'Belok kiri',kanan:'Belok kanan',tekan:'Tekan tombol'})[it.then]]);
        if(it.else) ch.push(['Selain itu',({maju:'Maju',kiri:'Belok kiri',kanan:'Belok kanan',tekan:'Tekan tombol'})[it.else]]);
        // pilihan harus berurutan karena memilih sensor membangun ulang picker
        await L.pickChoice(page,n,ch);
      } else if(it.type==='isi'){ await L.pickChoice(page,n,[['Kotak',it.box],['Isi dengan',it.show]]); }
      else if(it.type==='ubah'){ await L.pickChoice(page,n,[['Kotak',it.box],['Operasi',it.op],['Angka',String(it.num)]]); }
    }
  }
  const resultOpen=page=>L.overlayOpen(page,'#ovResult');
  const title=page=>page.evaluate(()=>document.querySelector('#resTitle').textContent);
  const bubbleTxt=page=>L.bubble(page);
  async function win(page,id,items,seeds,name,expectTitle){
    for(const sd of (seeds||[undefined])){
      await S.t(`W-${id}${sd!==undefined?'-v'+sd:''}`,`${name}${sd!==undefined?` (variasi ${sd})`:''}: susun lewat UI → Jalankan → layar hasil terbuka`,async()=>{
        const {page:p,ctx,errors}=await L.newPage(b,{w:1280,h:720});
        try{ await open(p,id,sd); await build(p,items); await L.runAndWait(p); const ok=await resultOpen(p), t=await title(p); const bt=ok?'':await bubbleTxt(p);
          return {ok:ok&&(!expectTitle||t===expectTitle)&&errors.length===0,note:ok?`judul “${t}”`:`tidak menang: ${bt}`+(errors.length?' | galat: '+errors.join(' | '):'')}; }
        finally{ await ctx.close(); } });
    }
  }
  const P1=PART===0||PART===1, P2=PART===0||PART===2, P3=PART===0||PART===3;
  if(P1){
    await win(null,'s02',['maju','maju','maju','kanan','maju','maju'],undefined,'B02 Tikungan','Tikungan terlewati!');
    await win(null,'s03',['maju','ambil','maju','maju','taruh','maju','maju','tekan'],undefined,'B03 Peti & Tombol','Peti di perahu, lampu menyala!');
    await win(null,'s04',['maju','ambil','maju','ambil','maju','ambil','maju','kanan','maju','maju','kanan','maju','taruh'],undefined,'B04 Rute Memutar (13 kartu)','Ketiga peti sampai!');
    await win(null,'s11',[{type:'isi',box:'muatan',show:'3'},{type:'ubah',box:'muatan',op:'×',num:4},{type:'isi',box:'tujuan',show:'Timur'},{type:'isi',box:'lampu',show:'nyala'},'maju','maju','maju','maju','maju'],undefined,'B11 Gudang Campur','Pesanan kapal lengkap!');
  }
  if(P2){
    await win(null,'s05',['maju','maju',J('warna',{color:'merah'},'tekan'),'maju','maju','maju'],[0,1],'B05 Jembatan Angkat (Jika)','Jembatan terpasang, sampai di pasar!');
    await win(null,'s06',['maju','maju',J('tembok',{},'kanan','maju'),'maju','maju'],[0,1],'B06 Dua Jalan (Jika + selain itu)','Dua jalan, satu jawaban!');
    await win(null,'s07',['maju','maju',J('tembok',{},'kanan','maju'),'maju','maju',J('tembok',{},'kiri','maju'),'maju',J('warna',{color:'merah'},'tekan'),'maju','maju','maju'],[0,5],'B07 Pasar Ramai (3 kartu Jika)','Pasar Ramai terlewati!');
  }
  if(P3){
    const s12=['maju','maju','maju',J('kotak',{box:'muatan',cmp:'>',n:5},'kiri','kanan'),'maju',J('sakelar',{box:'sakelar'},'tekan')];
    await win(null,'s12',s12,[0,1,2,3],'B12 Pintu Kembar (sensor kotak + sakelar)','Gerbang yang tepat!');
    await win(null,'s13',[{type:'ubah',box:'lilin',op:'×',num:3},'maju','ambil','maju',J('tembok',{},'kanan','maju'),'maju','maju','taruh','tekan'],[0,1],'B13 Mercusuar Urutan (gabungan)','Mercusuar menyala!');
    // ---- penilaian lintas-variasi ----
    await S.t('X1','B05: “Tekan” tanpa syarat berhasil di lantai merah tetapi DITOLAK karena variasi biru gagal; keadaan berikutnya berpindah ke variasi gagal',async()=>{
      const {page:p,ctx}=await L.newPage(b,{w:1280,h:720});
      try{ await open(p,'s05',0); await build(p,['maju','maju','tekan','maju','maju','maju']); await L.runAndWait(p);
        const res=await resultOpen(p), msg=await bubbleTxt(p), pend=await p.evaluate(()=>window.__t.getPending());
        const a1=!res&&/keadaan lain/.test(msg)&&/lantai biru/.test(msg)&&pend===1;
        await p.click('#btnRun'); await L.sleep(150); await L.waitIdle(p); await L.sleep(500);
        const seed2=await p.evaluate(()=>window.__t.getSeed()), msg2=await bubbleTxt(p), res2=await resultOpen(p);
        return {ok:a1&&seed2===1&&!res2&&/Byur/.test(msg2),note:`pesan1=“${msg.slice(0,110)}…” tertunda=${pend}; run2: variasi=${seed2}, pesan=“${msg2.slice(0,70)}”`}; }
      finally{ await ctx.close(); } });
    await S.t('X2','B06: tanpa “selain itu” — gagal bermakna di variasi lurus (pesan menyebut sisa petak)',async()=>{
      const {page:p,ctx}=await L.newPage(b,{w:1280,h:720});
      try{ await open(p,'s06',1); await build(p,['maju','maju',J('tembok',{},'kanan'),'maju','maju']); await L.runAndWait(p);
        const msg=await bubbleTxt(p); return {ok:/Masih kurang 1 petak/.test(msg),note:msg}; }
      finally{ await ctx.close(); } });
    await S.t('X3','Kode semu setelah menang memuat jika/selain_itu dengan sintaks yang benar',async()=>{
      const {page:p,ctx}=await L.newPage(b,{w:1280,h:720});
      try{ await open(p,'s06',0); await build(p,['maju','maju',J('tembok',{},'kanan','maju'),'maju','maju']); await L.runAndWait(p);
        await p.click('#resCode'); const t=await p.evaluate(()=>document.querySelector('#resCodeBox').textContent);
        return {ok:/jika ada_tembok_di_depan\(\):\n    belok_kanan\(\)\nselain_itu:\n    maju\(\)/.test(t),note:JSON.stringify(t)}; }
      finally{ await ctx.close(); } });
    await S.t('X4','Picker Jika: ganti sensor membangun ulang pilihan (warna → kotak → sakelar) dan menyetel nilai bawaan',async()=>{
      const {page:p,ctx}=await L.newPage(b,{w:1280,h:720});
      try{ await open(p,'s12',0); await tap(p,'jika'); const r=await L.rect(p,'#boardList .card',0); await p.mouse.click(r.cx,r.cy); await L.sleep(80);
        const g1=await p.evaluate(()=>[...document.querySelectorAll('#pickBody .pick-group h3')].map(h=>h.textContent));
        await p.evaluate(()=>[...document.querySelectorAll('#pickBody .pick-group')].find(x=>x.querySelector('h3').textContent==='Jika').querySelectorAll('button')[1].click()); await L.sleep(60);
        const g2=await p.evaluate(()=>[...document.querySelectorAll('#pickBody .pick-group h3')].map(h=>h.textContent));
        return {ok:g1.includes('Pembanding')&&g1.includes('Angka')&&g2.includes('Sakelar')&&!g2.includes('Pembanding'),note:`kotak: ${g1.join('/')} | sakelar: ${g2.join('/')}`}; }
      finally{ await ctx.close(); } });
    await S.t('X5','Kartu Jika di papan terbaca penuh (teks kartu tidak terpotong) di HP 360 px',async()=>{
      const {page:p,ctx}=await L.newPage(b,{w:360,h:740,dpr:2,touch:true});
      try{ await open(p,'s13'); await build(p,[J('kotak',{box:'lilin',cmp:'>',n:4},'kiri','kanan')]);
        const m=await p.evaluate(()=>{ const c=document.querySelector('#boardList .card'), r=c.getBoundingClientRect(); return {txt:c.textContent.replace(/\s+/g,' ').trim(),clipped:c.scrollWidth>c.clientWidth+1||c.scrollHeight>c.clientHeight+1,w:Math.round(r.width),h:Math.round(r.height),ctl:document.querySelector('#btnRun').getBoundingClientRect().bottom<=innerHeight}; });
        return {ok:!m.clipped&&m.ctl,note:JSON.stringify(m)}; }
      finally{ await ctx.close(); } });
  }
  S.save(); await b.close(); process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
