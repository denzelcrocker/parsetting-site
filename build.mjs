import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isIP} from 'node:net';
export function indexingPolicy(config,mode,indexableBrochure=false){
 if(indexableBrochure&&mode!=='brochure')throw new Error('--indexable-brochure требует --brochure.');
 if(indexableBrochure){
  const errors=validate(config,'brochure');if(errors.length)throw new Error(errors.join(', '));
  const host=new URL(config.domain).hostname;
  if(isIP(host)||host.startsWith('[')||!host.includes('.')||host.endsWith('.local'))throw new Error('Индексируемая brochure требует публичный DNS-домен, не IP.');
 }
 return mode==='production'||indexableBrochure;
}
export function validate(config,mode=false){
 const production=mode===true||mode==='production',brochure=mode==='brochure';
 const errors=[];
 if(typeof config.brand!=='string'||!config.brand.trim())errors.push('brand');
 if(!Number.isSafeInteger(config.trialDays)||config.trialDays<1||config.trialDays>365)errors.push('trialDays');
 if(!Number.isSafeInteger(config.trialSeats)||config.trialSeats<1)errors.push('trialSeats');
 const plans=Array.isArray(config.plans)?config.plans:[];
 if(plans.length!==2||new Set(plans.map(p=>p.id)).size!==2||plans.some(p=>!['team','department'].includes(p.id)))errors.push('plans');
 for(const id of ['team','department']){const p=plans.find(p=>p.id===id);if(!p||typeof p.name!=='string'||!p.name.trim()||!Number.isSafeInteger(p.price)||p.price<1||!Number.isSafeInteger(p.seats)||p.seats<1)errors.push('plan '+id);}
 if(plans.find(p=>p.id==='department')?.seats<=plans.find(p=>p.id==='team')?.seats)errors.push('plan seat order');
 if(config.telegramUsername&&!/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(config.telegramUsername))errors.push('telegramUsername');
 if(config.contactEmail&&!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(config.contactEmail))errors.push('contactEmail');
 if(production||brochure){
  if(!config.telegramUsername&&!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(config.contactEmail||''))errors.push('contactEmail / telegramUsername');
  if(typeof config.hostingPrivacyText!=='string'||config.hostingPrivacyText.trim().length<30)errors.push('hostingPrivacyText (хостинг и технические журналы)');
  try{const u=new URL(config.domain);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.pathname!=='/'||/localhost|example\.|\.test$/.test(u.hostname))throw new Error();}catch{errors.push('domain (реальный HTTPS origin)');}
 }
 if(production){
  for(const key of ['name','address'])if(!config.seller?.[key]?.trim()||/\[|заполнить/i.test(config.seller[key]))errors.push('seller.'+key);
  if(!/^(\d{10}|\d{12})$/.test(config.seller?.inn||''))errors.push('seller.inn');
  if(!config.privacyReviewed||!config.termsReviewed)errors.push('privacyReviewed / termsReviewed');
 }
 return errors;
}
const htmlEscape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderPublicConfig(html,config){
 const update=(attribute,value)=>{const pattern=new RegExp('(<[^>]+\\b'+attribute+'(?:="")?[^>]*>)[^<]*(</[^>]+>)','g');html=html.replace(pattern,(_match,start,end)=>start+htmlEscape(value)+end);};
 html=html.replaceAll('{{trialDays}}',String(config.trialDays));
 update('data-trial(?![-\\w])',config.trialDays);
 update('data-trial-seats',config.trialSeats);
 for(const plan of config.plans){
  for(const [field,value] of [['plan-name',plan.name],['price',new Intl.NumberFormat('ru-RU').format(plan.price)],['seats',plan.seats]])update('data-'+field+'="'+plan.id+'"',value);
 }
 const team=config.plans.find(p=>p.id==='team'), department=config.plans.find(p=>p.id==='department');
 update('data-team-range="team"','До '+team.seats+' человек');
 update('data-team-range="department"',(team.seats+1)+'–'+department.seats+' человек');
 update('data-team-range="custom"','Больше '+department.seats+' человек');
 return html;
}
const root=path.dirname(fileURLToPath(import.meta.url));
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8').replace(/^\uFEFF/,''));const production=process.argv.includes('--production'),brochure=process.argv.includes('--brochure');
 if(production&&brochure)throw new Error('Выберите один режим: --production или --brochure.');
 const mode=production?'production':brochure?'brochure':'preview';const errors=validate(config,mode);if(errors.length){console.error('Не заполнены настройки публикации: '+errors.join(', '));process.exit(1);}
 config.mode=mode;config.indexable=indexingPolicy(config,mode,process.argv.includes('--indexable-brochure'));const outIndex=process.argv.indexOf('--out-dir');
 if(outIndex>=0&&(!process.argv[outIndex+1]||!path.isAbsolute(process.argv[outIndex+1])))throw new Error('--out-dir требует абсолютный путь.');
 const dist=outIndex>=0?path.resolve(process.argv[outIndex+1]):path.join(root,'dist');fs.mkdirSync(dist,{recursive:true});
 // These generated assets belonged to the removed comparison calculator.
 for(const obsolete of ['comparison.css','comparison.js','comparison.html'])fs.rmSync(path.join(dist,obsolete),{force:true});
 for(const file of ['styles.css','app.js','evidence.css','process-story.css','favicon.svg'])fs.copyFileSync(path.join(root,file),path.join(dist,file));
 fs.mkdirSync(path.join(dist,'assets'),{recursive:true});
 // Explicit public allowlist: future screenshots, employee photos or archives cannot leak through a folder copy.
 for(const file of ['brand-reference.png','app-family.png','supply-world.png','screen-calculation.png','screen-purchase.png','screen-tenders.png','screen-overview.png','screen-reports.png','screen-statistics.png'])fs.copyFileSync(path.join(root,'assets',file),path.join(dist,'assets',file));
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const [marker,file] of [['EVIDENCE_SECTION','evidence.html'],['INTAKE_SECTION','process-intake.html'],['STORY_SECTION','story.html']])html=html.replace('<!-- '+marker+' -->',fs.readFileSync(path.join(root,file),'utf8'));
 html=renderPublicConfig(html,config);
 if(config.indexable)html=html.replace('content="noindex,nofollow" data-robots','content="index,follow" data-robots');
 if(production||brochure)html=html.replace('</head>','<link rel="canonical" href="'+new URL(config.domain).origin+'/">\n<meta property="og:url" content="'+new URL(config.domain).origin+'/">\n</head>');
 fs.writeFileSync(path.join(dist,'index.html'),html);fs.writeFileSync(path.join(dist,'config.js'),'window.PARSETTING_CONFIG = '+JSON.stringify(config).replaceAll('<','\\u003c').replaceAll('>','\\u003e')+';\n');
 const origin=(production||brochure)?new URL(config.domain).origin:'';
 fs.writeFileSync(path.join(dist,'robots.txt'),config.indexable?'User-agent: *\nAllow: /\nDisallow: /license-admin/\nDisallow: /license-api/\nSitemap: '+origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n');
 if(config.indexable)fs.writeFileSync(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+origin+'/</loc></url></urlset>\n');
 else fs.rmSync(path.join(dist,'sitemap.xml'),{force:true});
 fs.writeFileSync(path.join(dist,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; font-src \'self\'; connect-src \'none\'; object-src \'none\'; base-uri \'self\'; frame-ancestors \'none\'; form-action \'none\'\n');
 console.log(`Built ${mode}: ${dist}`);
}
