/* Model murni Expert EX04–EX10. Satu sumber untuk game dan pencarian eksak. */
const EXS=(function(){
const rep=(v,n)=>Array(n).fill(v);
/* EX04: antrean, penyangga, pekerja */
const WCOST=3, BCOST={6:1,12:2,24:4}, EX04_BUDGET=11;
const EX04_PROF={A:[...rep(2,6),...rep(9,4),...rep(2,10)],B:[...rep(9,4),...rep(2,16)],C:rep(4,20)};
function qSim(prof,N,Bf){ let q=0,lost=0,first=null; const tr=[]; const arr=[...prof,0,0,0];
  arr.forEach((a,t)=>{ q+=a; let l=0; if(q>Bf){ l=q-Bf; q=Bf; lost+=l; if(!first) first={t:t+1,lost:l,q:Bf}; } const done=Math.min(q,2*N); q-=done; tr.push({t:t+1,in:a,q,lost:l,done}); });
  return {ok:lost===0&&q===0,lost,left:q,first,tr,cost:WCOST*N+(BCOST[Bf]||99)}; }
/* EX05: skala otomatis (lonjakan 8 detak) */
const mkP5=(amp,base,sus,L)=>({A:[...rep(base,6),...rep(amp,L),...rep(base,20-6-L)],B:[...rep(amp,L),...rep(base,20-L)],C:rep(sus,20)});
const EX05_PROF=mkP5(8,1,2,8), EX05_BUDGET=56, EX05_BUF=24;
function autoSim(prof,pol){ const Bf=pol.Bf||EX05_BUF, max=6, delay=1; let q=0,lost=0,w=pol.N||1,pend=[],cost=0,first=null; const tr=[];
  for(let t=0;t<prof.length+6;t++){ const a=prof[t]||0; pend=pend.filter(p=>{ if(p<=t){ w=Math.min(max,w+1); return false;} return true; });
    q+=a; let l=0; if(q>Bf){ l=q-Bf; q=Bf; lost+=l; if(!first) first={t:t+1,lost:l}; } q-=Math.min(q,2*w); cost+=w; tr.push({t:t+1,in:a,q,w,lost:l});
    if(pol.T!=null){ if(q>pol.T&&w+pend.length<max) pend.push(t+delay); else if(q<=pol.D&&w>1) w--; } }
  return {ok:lost===0&&q===0&&cost<=EX05_BUDGET,drained:lost===0&&q===0,lost,left:q,cost,first,tr}; }
/* EX06: pembagian beban */
const EX06_TRAFFIC=[...rep(4,3),...rep(11,6),...rep(4,4)], EX06_Q=4;
const EX06_CAPS={normal:[4,4,4,4,4,4],lambat:[4,2,4,4,4,4],kecil:[4,4,2,2,4,4]};
function lbSim(capAll,S,strat,traf){ const caps=capAll.slice(0,S); let qs=rep(0,S),drop=0,rr=0,first=null; const tr=[];
  (traf||EX06_TRAFFIC).forEach((tr0,t)=>{ let d=0; const before=[]; for(let r=0;r<tr0;r++){ let i; if(strat==="satu") i=0; else if(strat==="bergilir"){ i=rr%S; rr++; } else i=qs.indexOf(Math.min(...qs));
      if(qs[i]>=EX06_Q+caps[i]){ drop++; d++; if(!first) first={t:t+1,server:i+1}; } else qs[i]++; }
    const snap=qs.slice(); qs=qs.map((x,i)=>Math.max(0,x-caps[i])); tr.push({t:t+1,in:tr0,qs:snap,lost:d}); });
  return {ok:drop===0,lost:drop,first,tr,cost:S}; }
/* EX07: rak (cache) */
const EX07_SEQ={populer:"a b a c a b a d a b a e a b a f a b a c a b a d".split(" "),rentetan:"a a a a b b b b c c c c d d d d e e e e f f f f".split(" "),campur:"a b a b c d a b a b e f a b a b c d a b a b e f".split(" ")};
function cacheSim(seq,pol,size){ let cache=[],hit=0,freq={},t=0,last={},tr=[],evicted={}; for(const x of seq){ t++; freq[x]=(freq[x]||0)+1; const h=cache.includes(x); let ev=null;
    if(h){ hit++; last[x]=t; } else { if(cache.length>=size){ let v; if(pol==="fifo") v=cache[0]; else if(pol==="lru") v=cache.reduce((a,b)=>last[a]<=last[b]?a:b); else v=cache.reduce((a,b)=>freq[a]<=freq[b]?a:b); cache=cache.filter(c=>c!==v); ev=v; evicted[v]=(evicted[v]||0)+1; } cache.push(x); last[x]=t; }
    tr.push({t,x,hit:h,cache:cache.slice(),ev}); }
  const top=Object.entries(evicted).sort((a,b)=>b[1]-a[1])[0]; return {rate:hit/seq.length,pct:Math.round(100*hit/seq.length),hit,n:seq.length,tr,evicted:top?top[0]:null,evN:top?top[1]:0}; }

/* EX08: server + rak digabung. Permintaan yang kena rak tidak membebani server. */
const EX08_BUDGET=4, EX08_PEAK=16, EX08_TRAFFIC=[...rep(4,3),...rep(16,6),...rep(4,4)];
const EX08_CAPS={normal:[4,3,4,4,4],lambat:[2,4,3,4,4],kecil:[4,4,2,2,4]};
function comboSim(capAll,seq,S,strat,pol,size){ const cs=capAll.slice(0,S); let qs=rep(0,S),drop=0,rr=0,cache=[],freq={},last={},t=0,idx=0,hits=0,first=null; const tr=[];
  EX08_TRAFFIC.forEach((n0,tk)=>{ let h=0,d=0; for(let r=0;r<n0;r++){ const x=seq[idx++%seq.length]; t++; freq[x]=(freq[x]||0)+1; let hit=false;
      if(size>0&&cache.includes(x)){ hit=true; last[x]=t; } else if(size>0){ if(cache.length>=size){ let v; if(pol==="fifo") v=cache[0]; else if(pol==="lru") v=cache.reduce((a,b)=>last[a]<=last[b]?a:b); else v=cache.reduce((a,b)=>freq[a]<=freq[b]?a:b); cache=cache.filter(c=>c!==v); } cache.push(x); last[x]=t; }
      if(hit){ h++; hits++; continue; }
      let i; if(strat==="satu") i=0; else if(strat==="bergilir"){ i=rr%S; rr++; } else i=qs.indexOf(Math.min(...qs));
      if(qs[i]>=EX06_Q+cs[i]){ drop++; d++; if(!first) first={t:tk+1,server:i+1}; } else qs[i]++; }
    const snap=qs.slice(); qs=qs.map((x,i)=>Math.max(0,x-cs[i])); tr.push({t:tk+1,in:n0,hit:h,qs:snap,lost:d}); });
  return {ok:drop===0,lost:drop,hits,total:idx,first,tr,cost:S+size}; }
/* EX09: coba lagi, cadangan, pemutus */
const EX09_P={R:3,TICKS:12,PC:6,BC:5,OPEN:3};
function failSim(variant,H){ const {R,TICKS,PC,BC,OPEN}=EX09_P; const chain=H.chain||[]; let id=0,pend={},consec=0,openUntil=-1,succ=0,succP=0,total=0,lost=0,overload=null,cnt=0; const tr=[];
  const down=t=>variant==="sementara"?(t===3||t===4):variant==="permanen"?t>=6:false;
  for(let t=0;t<TICKS+12;t++){
    const att=[...(pend[t]||[])]; delete pend[t];
    if(t<TICKS) for(let i=0;i<R;i++){ total++; att.push({step:0,ret:0}); }
    const isOpen=t<=openUntil; const fails=[]; let anyOk=false, ok=0;
    if(isOpen) att.forEach(r=>fails.push(r));
    else { if(att.length>PC&&!overload) overload={t:t+1,load:att.length};
      att.forEach((r,i)=>{ cnt++; const bad=down(t)||(variant==="kedip"&&cnt%3===0)||i>=PC; if(bad) fails.push(r); else { succ++; succP++; ok++; anyOk=true; } });
      if(att.length>0){ if(!anyOk) consec++; else consec=0; if(H.k&&consec>=H.k){ openUntil=t+OPEN; consec=0; } } }
    let bUsed=0;
    for(const r of fails){ let done=false; while(!done){ const h=chain[r.step];
        if(!h){ lost++; done=true; }
        else if(h==="coba"){ if(r.ret<H.n){ r.ret++; (pend[t+H.jeda]=pend[t+H.jeda]||[]).push(r); done=true; } else r.step++; }
        else { if(bUsed<BC){ bUsed++; succ++; done=true; } else r.step++; } } }
    if(t<TICKS||att.length||Object.keys(pend).length) tr.push({t:t+1,load:isOpen?0:att.length,ok,fail:fails.length,backup:bUsed,open:isOpen});
    else break;
  }
  const rate=succ/total, prim=succP/total; const need=variant==="permanen"?rate:prim;
  return {ok:need>=0.9&&rate>=0.9&&!overload,rate,prim,overload,lost,tr,total}; }

/* EX10: toko terbuka = lima subsistem, satu anggaran */
const EX10_BUDGET=13, EX10_CHANGE=[[...EX07_SEQ.populer.slice(0,12),...EX07_SEQ.campur.slice(0,12)],[...EX07_SEQ.rentetan.slice(0,12),...EX07_SEQ.populer.slice(0,12)]];
function ex10Cost(c){ return c.N+(BCOST[c.Bf]||99)+(c.auto?1:0)+c.S+(c.rak?c.rak.size:0)+(c.H.chain.includes("cadangan")?1:0)+(c.H.k?1:0); }
function ex10Variants(c){ const pol=c.auto?{N:c.N,T:c.auto.T,D:c.auto.D,Bf:c.Bf}:{N:c.N,Bf:c.Bf};
  const caps=Object.values(EX08_CAPS), seqs=Object.values(EX07_SEQ), pols=c.rak?c.rak.pol:"fifo", sz=c.rak?c.rak.size:0;
  return [
   {label:"hari promo",run:()=>{ const rs=Object.entries(EX05_PROF).map(([k,p])=>[k,autoSim(p,pol)]); const bad=rs.find(([k,r])=>!r.drained); const tr=(bad||rs[0])[1].tr;
     if(bad){ const r=bad[1]; return {ok:false,tr,head:"promo",msg:r.first?`Hari promo: di detak ${r.first.t} antrean penuh (${c.Bf}), ${r.first.lost} pesanan hilang. Hanya ${tr[r.first.t-1].w} pekerja aktif.`:`Hari promo: ${r.left} pesanan masih tertinggal di antrean saat hari berakhir.`}; }
     const over=rs.find(([k,r])=>r.cost>EX05_BUDGET); if(over) return {ok:false,tr,head:"promo",msg:`Hari promo: biaya pekerja ${over[1].cost} pekerja-detak melebihi batas ${EX05_BUDGET}.`}; return {ok:true,tr,head:"promo"}; }},
   {label:"jam sibuk",run:()=>{ const rs=caps.map((cp,i)=>comboSim(cp,seqs[i],c.S,c.strat,pols,sz)); const bad=rs.find(r=>!r.ok); const r=bad||rs[0];
     return bad?{ok:false,tr:r.tr,head:"sibuk",msg:`Jam sibuk: di detak ${r.first.t}, server ${r.first.server} melimpah; ${r.lost} permintaan hilang.`}:{ok:true,tr:r.tr,head:"sibuk"}; }},
   {label:"server rusak",run:()=>{ const vs=["sementara","permanen","kedip"].map(v=>[v,failSim(v,c.H)]); const bad=vs.find(([v,r])=>!r.ok); const r=(bad||vs[1])[1];
     const nm={sementara:"mati sebentar",permanen:"mati permanen",kedip:"berkedip"};
     if(!bad) return {ok:true,tr:r.tr,head:"gagal"}; const [v]=bad; const why=r.overload?`di detak ${r.overload.t} server utama menerima ${r.overload.load} percobaan padahal kapasitasnya ${EX09_P.PC} (badai coba ulang)`:`hanya ${Math.round(100*(v==="permanen"?r.rate:r.prim))}% sukses lewat jalur yang diizinkan (butuh 90%)`;
     return {ok:false,tr:r.tr,head:"gagal",msg:`Server rusak (${nm[v]}): ${why}.`}; }},
   {label:"pola berubah",run:()=>{ const rs=EX10_CHANGE.map(q=>cacheSim(q,pols,sz)); const bad=rs.find(r=>r.pct<55); const r=bad||rs[0];
     return bad?{ok:false,tr:r.tr,head:"rak",msg:`Pola permintaan berubah: kena rak hanya ${r.pct}% (butuh 55%).`+(r.evicted?` Barang ${r.evicted} paling sering diusir (${r.evN} kali).`:"")}:{ok:true,tr:r.tr,head:"rak"}; }}];
}
return {EX10_BUDGET,ex10Cost,ex10Variants,EX08_BUDGET,EX08_TRAFFIC,EX08_CAPS,comboSim,EX09_P,failSim,rep,WCOST,BCOST,EX04_BUDGET,EX04_PROF,qSim,EX05_PROF,EX05_BUDGET,EX05_BUF,autoSim,EX06_TRAFFIC,EX06_CAPS,lbSim,EX07_SEQ,cacheSim};
})();
if(typeof module!=="undefined") module.exports=EXS;
