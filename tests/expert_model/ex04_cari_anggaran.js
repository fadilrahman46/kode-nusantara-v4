const mk=(amp)=>({A:[...Array(6).fill(2),...Array(4).fill(amp),...Array(10).fill(2)],B:[...Array(4).fill(amp),...Array(16).fill(2)],C:Array(20).fill(4)});
function q(prof,N,Bf){ let queue=0,lost=0; for(const a of [...prof,0,0,0]){ queue+=a; if(queue>Bf){lost+=queue-Bf;queue=Bf;} queue-=Math.min(queue,2*N);} return lost===0&&queue===0; }
const BC={6:1,12:2,24:4};
for(const amp of [8,9,10]) for(const wc of [2,3]) for(const budget of [8,9,10,11,12,13]){ const P=mk(amp); const sol=[]; for(let N=1;N<=6;N++) for(const Bf of [6,12,24]){ const c=wc*N+BC[Bf]; if(c>budget) continue; if(Object.values(P).every(p=>q(p,N,Bf))) sol.push(`N${N}/B${Bf}`);} if(sol.length&&sol.length<=2) console.log('amp',amp,'wc',wc,'budget',budget,sol.join(' ')); }
