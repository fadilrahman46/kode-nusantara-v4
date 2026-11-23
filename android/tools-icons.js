const {chromium}=require('playwright'); const fs=require('fs'), path=require('path'), cp=require('child_process');
const RES=path.join(__dirname,'kode-nusantara-android/android/app/src/main/res');
const NAVY='#26345E';
const art=`<g><circle cx="54" cy="40" r="19" fill="#FFC23C" opacity=".28"/><circle cx="54" cy="40" r="12" fill="#FFC23C" opacity=".35"/>
<rect x="52" y="46" width="4" height="30" rx="1.5" fill="#E2C48A"/><circle cx="54" cy="40" r="8" fill="#FFD76A"/><circle cx="51.5" cy="37.5" r="2.2" fill="#FFF3C4"/>
<ellipse cx="54" cy="79" rx="26" ry="7" fill="#C9A66B"/><path d="M33 78 Q43 62 54 62 Q65 62 75 78 Z" fill="#2F7D58"/>
<path d="M28 88 Q35 85 42 88 T56 88 T70 88 T82 88" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/></g>`;
const stars=`<g fill="#fff"><circle cx="30" cy="30" r="1.2" opacity=".8"/><circle cx="78" cy="26" r="1.5" opacity=".9"/><circle cx="84" cy="48" r="1" opacity=".7"/><circle cx="24" cy="52" r="1" opacity=".6"/></g>`;
const svgFg=s=>`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 108 108">${art}</svg>`;
const svgLegacy=(s,round)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="18 18 72 72"><defs><clipPath id="c"><circle cx="54" cy="54" r="36"/></clipPath></defs><g ${round?'clip-path="url(#c)"':''}><rect x="0" y="0" width="108" height="108" fill="${NAVY}"/>${stars}${art}</g></svg>`;
const svgSplash=(w,h)=>{ const s=Math.round(Math.min(w,h)*0.42); return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${NAVY}"/><g transform="translate(${(w-s)/2},${(h-s)/2}) scale(${s/108})">${stars}${art}</g></svg>`; };
(async()=>{ const b=await chromium.launch(); const pg=await b.newPage();
 const shot=async(svg,w,h,out,transparent)=>{ await pg.setViewportSize({width:w,height:h}); await pg.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`); await pg.screenshot({path:out,omitBackground:!!transparent}); };
 const dens={mdpi:[48,108],hdpi:[72,162],xhdpi:[96,216],xxhdpi:[144,324],xxxhdpi:[192,432]};
 for(const [d,[l,f]] of Object.entries(dens)){ const dir=path.join(RES,'mipmap-'+d);
   await shot(svgLegacy(l,false),l,l,path.join(dir,'ic_launcher.png'),true); await shot(svgLegacy(l,true),l,l,path.join(dir,'ic_launcher_round.png'),true); await shot(svgFg(f),f,f,path.join(dir,'ic_launcher_foreground.png'),true); }
 const files=cp.execSync(`find ${RES} -name splash.png`).toString().trim().split('\n');
 for(const f of files){ const m=cp.execSync(`file -b ${f}`).toString().match(/(\d+) x (\d+)/); await shot(svgSplash(+m[1],+m[2]),+m[1],+m[2],f,false); }
 await b.close(); console.log('ikon',Object.keys(dens).length*3,'splash',files.length); })();
