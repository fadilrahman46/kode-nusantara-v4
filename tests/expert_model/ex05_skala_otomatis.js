const mkP=(amp,base,sus,L=8)=>({A:[...Array(6).fill(base),...Array(L).fill(amp),...Array(20-6-L).fill(base)],B:[...Array(L).fill(amp),...Array(20-L).fill(base)],C:Array(20).fill(sus)});
function sim(prof,Bf,policy){ // policy:{N} statis | {T,down,delay,max}
  let queue=0,lost=0,w=policy.N||1,pend=[],cost=0; for(let t=0;t<prof.length+6;t++){ const a=prof[t]||0; pend=pend.filter(p=>{ if(p<=t){ w=Math.min(policy.max||6,w+1); return false;} return true; }); queue+=a; if(queue>Bf){lost+=queue-Bf;queue=Bf;} queue-=Math.min(queue,2*w); cost+=w; if(policy.T!=null){ if(queue>policy.T&&w+pend.length<(policy.max||6)) pend.push(t+policy.delay); else if(queue<=policy.down&&w>1) w--; } } return {ok:lost===0&&queue===0,cost}; }
for(const amp of [8,9,10]) for(const Bf of [12,24]) for(const delay of [1,2]) for(const budget of [30,34,38,42,46,50,56,62]){ const P=mkP(amp,1,2); 
  const stat=[]; for(let N=1;N<=6;N++) if(Object.values(P).every(p=>{const r=sim(p,Bf,{N}); return r.ok&&r.cost<=budget;})) stat.push(N);
  const au=[]; for(const T of [0,2,4,6,8,10]) for(const down of [0,2]) if(Object.values(P).every(p=>{const r=sim(p,Bf,{N:1,T,down,delay}); return r.ok&&r.cost<=budget;})) au.push(`T${T}/d${down}`);
  if(stat.length===0&&au.length>=1&&au.length<=3) console.log('amp',amp,'Bf',Bf,'delay',delay,'budget',budget,'statis',stat.join(),'auto',au.join(' ')); }
