const seqs={
 populer:'a b a c a b a d a b a e a b a f a b a c a b a d'.split(' '),
 rentetan:'a a a a b b b b c c c c d d d d e e e e f f f f'.split(' '),
 campur:'a b a b c d a b a b e f a b a b c d a b a b e f'.split(' ')};
function run(seq,pol,size){ let cache=[],hit=0,freq={},t=0,last={}; for(const x of seq){ t++; freq[x]=(freq[x]||0)+1; if(cache.includes(x)){ hit++; last[x]=t; continue; } if(cache.length>=size){ let v; if(pol==='fifo') v=cache[0]; else if(pol==='lru') v=cache.reduce((a,b)=>last[a]<=last[b]?a:b); else if(pol==='lfu') v=cache.reduce((a,b)=>freq[a]<=freq[b]?a:b); cache=cache.filter(c=>c!==v); } cache.push(x); last[x]=t; } return hit/seq.length; }
for(const size of [1,2,3,4]) for(const pol of ['fifo','lru','lfu']) console.log(size,pol,Object.entries(seqs).map(([k,s])=>k+':'+Math.round(100*run(s,pol,size))).join(' '));
