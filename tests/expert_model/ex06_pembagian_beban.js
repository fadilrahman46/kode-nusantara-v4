const P={A:[...Array(6).fill(2),...Array(4).fill(9),...Array(10).fill(2)],B:[...Array(4).fill(9),...Array(16).fill(2)],C:Array(20).fill(4)};
function auto(prof,T,Bf,down,delay){ let queue=0,lost=0,w=1,pend=[],cost=0; for(let t=0;t<prof.length+6;t++){ const a=prof[t]||0; pend=pend.filter(p=>{ if(p<=t){ w=Math.min(6,w+1); return false;} return true; }); queue+=a; if(queue>Bf){lost+=queue-Bf;queue=Bf;} queue-=Math.min(queue,2*w); cost+=w; if(queue>T&&w+pend.length<6) pend.push(t+delay); else if(queue<=down&&w>1) w--; } return {ok:lost===0&&queue===0,cost}; }
console.log('EX05 Bf=12 delay=2');
for(const down of [0,2]) for(const T of [0,2,3,4,6,8]){ const r=Object.entries(P).map(([k,p])=>[k,auto(p,T,12,down,2)]); console.log('down',down,'T',T,r.map(([k,x])=>`${k}:${x.ok?'ok':'X'}/${x.cost}`).join(' ')); }
// static: N=2 B=12 (EX04 pilihan murah) cost worker-ticks 2*26
console.log('static N2 B12', Object.entries(P).map(([k,p])=>{ let q=0,l=0; for(let t=0;t<p.length+6;t++){ q+=p[t]||0; if(q>12){l+=q-12;q=12;} q-=Math.min(q,4);} return k+':'+(l===0&&q===0?'ok':'X'); }).join(' '));
// EX06
function lb(cap,S,strat,traffic,Q=4){ const caps=Array.from({length:S},(_,i)=>cap[i]??4); let queues=Array(S).fill(0),drop=0,rr=0; for(const tr of traffic){ for(let r=0;r<tr;r++){ let i; if(strat==='satu') i=0; else if(strat==='bergilir'){ i=rr%S; rr++; } else { i=queues.indexOf(Math.min(...queues.map((x,k)=>x))); } if(queues[i]>=Q+caps[i]) drop++; else queues[i]++; } queues=queues.map((x,i)=>Math.max(0,x-caps[i])); } return {drop}; }
const traffic=[...Array(3).fill(4),...Array(6).fill(11),...Array(4).fill(4)];
console.log('EX06');
const V={ normal:[4,4,4,4,4,4], lambat:[4,2,4,4,4,4], kecil:[4,4,2,2,4,4] };
for(const S of [2,3,4,5]) for(const st of ['satu','bergilir','kosong']){ const res=Object.entries(V).map(([k,c])=>lb(c,S,st,traffic).drop); if(res.every(x=>x===0)) console.log('LULUS S',S,st,res); }
for(const S of [2,3,4]) for(const st of ['bergilir','kosong']) console.log('S',S,st,Object.entries(V).map(([k,c])=>k+':'+lb(c,S,st,traffic).drop).join(' '));
