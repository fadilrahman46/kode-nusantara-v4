const {chromium}=require('playwright'); const path=require('path');
const OUT=path.join(__dirname,'icons'); const NAVY='#26345E';
const art=`<g><circle cx="54" cy="40" r="19" fill="#FFC23C" opacity=".28"/><circle cx="54" cy="40" r="12" fill="#FFC23C" opacity=".35"/>
<rect x="52" y="46" width="4" height="30" rx="1.5" fill="#E2C48A"/><circle cx="54" cy="40" r="8" fill="#FFD76A"/><circle cx="51.5" cy="37.5" r="2.2" fill="#FFF3C4"/>
<ellipse cx="54" cy="79" rx="26" ry="7" fill="#C9A66B"/><path d="M33 78 Q43 62 54 62 Q65 62 75 78 Z" fill="#2F7D58"/>
<path d="M28 88 Q35 85 42 88 T56 88 T70 88 T82 88" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/></g>`;
const stars=`<g fill="#fff"><circle cx="30" cy="30" r="1.2" opacity=".8"/><circle cx="78" cy="26" r="1.5" opacity=".9"/><circle cx="84" cy="48" r="1" opacity=".7"/><circle cx="24" cy="52" r="1" opacity=".6"/></g>`;
const svg=(s,vb)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="${vb}"><rect x="-20" y="-20" width="150" height="150" fill="${NAVY}"/>${stars}${art}</svg>`;
(async()=>{ const b=await chromium.launch(); const pg=await b.newPage();
 const shot=async(s,vb,name)=>{ await pg.setViewportSize({width:s,height:s}); await pg.setContent(`<html><body style="margin:0">${svg(s,vb)}</body></html>`); await pg.screenshot({path:path.join(OUT,name)}); };
 const ANY='18 18 72 72', MASK='-4 -4 116 116';
 await shot(192,ANY,'icon-192.png'); await shot(512,ANY,'icon-512.png');
 await shot(192,MASK,'maskable-192.png'); await shot(512,MASK,'maskable-512.png');
 await shot(180,MASK,'apple-touch-icon.png'); await shot(32,ANY,'favicon-32.png');
 await b.close(); console.log('ok'); })();
