import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import vm from 'node:vm';

const [directory,reportPath,previewUrl]=process.argv.slice(2);
assert(directory&&path.isAbsolute(directory),'Absolute dist directory required');
assert(reportPath&&path.isAbsolute(reportPath),'Absolute report path required');
let checks=0;const check=(condition,name)=>{assert(condition,name);checks++;};
const read=name=>fs.readFileSync(path.join(directory,name),'utf8');
const html=read('index.html'),app=read('app.js');
const context=vm.createContext({window:{}});vm.runInContext(read('config.js'),context);
const config=context.window.PARSETTING_CONFIG;
check(config.mode==='brochure','Explicit public brochure mode');
check(config.trialDays===30&&config.trialSeats===15,'30-day / 15-person test period');
check(config.plans[0].seats===5&&config.plans[1].seats===15&&config.plans[0].price===2990&&config.plans[1].price===4990,'Approved tariffs');
check(config.telegramUsername==='denzelcrockker','Owner Telegram');
check(config.domain==='https://parsetting.ru','Configured public domain');
check(html.includes('rel="canonical" href="https://parsetting.ru/"'),'Canonical domain');
if(config.indexable){
 check(html.includes('content="index,follow"')&&!html.includes('content="noindex,nofollow"'),'Explicit brochure indexing');
 check(read('robots.txt').includes('Allow: /\n')&&read('robots.txt').includes('Disallow: /license-admin/')&&read('robots.txt').includes('Disallow: /license-api/')&&read('robots.txt').includes('Sitemap: https://parsetting.ru/sitemap.xml'),'Public sitemap and private route exclusions');
 check(read('sitemap.xml').includes('<loc>https://parsetting.ru/</loc>')&&(read('sitemap.xml').match(/<url>/g)||[]).length===1,'Sitemap contains only the public homepage');
}else check(html.includes('content="noindex,nofollow"')&&read('robots.txt').includes('Disallow: /'),'Default brochure remains noindex');
check(!/Atlassian|Asana|GWI|HedgeServ|Loopio|evidence-donut|evidence-bars|comparison-form|25%|84%/.test(html),'Unrelated research and fabricated comparison figures removed');
check((html.match(/class="process-panel /g)||[]).length===2&&(html.match(/class="work-change-row"/g)||[]).length===4,'Qualitative comparison has two views and four concrete workflow rows');
check(!/<input[^>]+(?:name="(?:name|email|phone|consent)"|type="(?:email|tel)")/i.test(html),'No identity/contact collection fields');
check(!/fetch\s*\(|XMLHttpRequest|sendBeacon|(?:localStorage|sessionStorage)\s*(?:\.\s*(?:setItem|getItem|removeItem|clear)\s*\(|\[)|document\.cookie\s*=/.test(app),'Page has no data submission, tracking or browser persistence');
check(!html.includes('{{')&&!html.includes('_SECTION -->'),'All source fragments and config placeholders rendered');
check(html.includes('Нижнем Новгороде')&&html.includes('22 года')&&html.includes('Следующий тендер'),'Approved founder and invitation content retained');
check((html.match(/data-stage="/g)||[]).length===6,'Six real application screens retained');
check(read('_headers').includes("connect-src 'none'")&&read('_headers').includes("frame-ancestors 'none'"),'Static-site security header declaration');
const allowed=['index.html','styles.css','app.js','evidence.css','process-story.css','favicon.svg','config.js','robots.txt','_headers','assets/brand-reference.png','assets/app-family.png','assets/supply-world.png','assets/screen-calculation.png','assets/screen-purchase.png','assets/screen-tenders.png','assets/screen-overview.png','assets/screen-reports.png','assets/screen-statistics.png'];
if(config.indexable)allowed.push('sitemap.xml');
const files=fs.readdirSync(directory,{recursive:true}).filter(name=>fs.statSync(path.join(directory,name)).isFile()).map(name=>name.replaceAll('\\','/'));
check(files.length===allowed.length&&files.every(name=>allowed.includes(name)),'Public output contains only approved static files');
const inventory=[];
for(const name of files){
 const bytes=fs.readFileSync(path.join(directory,name));
 inventory.push({name,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
 if(name.endsWith('.png')){
  const chunks=[];for(let at=8;at+12<=bytes.length;){const length=bytes.readUInt32BE(at),type=bytes.toString('ascii',at+4,at+8);chunks.push(type);at+=length+12;}
  check(!chunks.some(type=>['tEXt','zTXt','iTXt','eXIf'].includes(type)),name+': no textual/EXIF metadata');
 }
}
for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 if(/^(https?:|mailto:)/.test(url)){check(url.startsWith('https://t.me/denzelcrockker')||url==='https://parsetting.ru/','No unrelated external URL '+url);continue;}
 check(fs.existsSync(path.join(directory,url.split('#')[0])),'Local linked file exists '+url);
}
if(previewUrl){
 const base=new URL(previewUrl);check(base.hostname==='127.0.0.1','Smoke checks limited to local preview');
 for(const file of allowed.filter(f=>f!=='_headers')){const response=await fetch(new URL(file,base));check(response.status===200,'HTTP 200 '+file);}
 for(const file of ['site.config.json','README.md','comparison.js','.env','assets/employee.jpg']){const response=await fetch(new URL(file,base));check(response.status===404,'Private/removed file not served '+file);}
}
fs.writeFileSync(reportPath,JSON.stringify({checks,mode:config.mode,domain:config.domain,inventory,browserQA:'Unavailable: CUA reports no available browser; no current responsive browser verification claimed.',imageAudit:'All nine public images visually inspected on 2026-10-13. Six application renders contain synthetic data; no employee portraits/contact details/credentials observed.'},null,2));
console.log(`PASS ${checks} publication checks; ${files.length} approved files`);


