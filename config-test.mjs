import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validate,renderPublicConfig,indexingPolicy} from './build.mjs';
const original=JSON.parse(fs.readFileSync(new URL('./site.config.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
assert.deepEqual(validate(original),[]);
assert(validate(original,true).includes('seller.name'));
// Synthetic values are validation fixtures only; never written into the real config or published.
const ready={...original,domain:'https://fixture-parsething.ru',contactEmail:'qa@fixture-parsething.ru',seller:{name:'Тестовая организация',inn:'1234567890',address:'Тестовый адрес'},privacyReviewed:true,termsReviewed:true,hostingPrivacyText:'Тестовый хостинг. Технические журналы удаляются через 7 дней.'};
assert.deepEqual(validate(ready,true),[]);
let checks=3;
assert.deepEqual(validate(original,'brochure'),[]);checks++;
for(const change of [{domain:'http://example.com'},{hostingPrivacyText:''},{telegramUsername:'',contactEmail:''}]){assert(validate({...original,...change},'brochure').length>0);checks++;}
assert(validate(original,'production').includes('seller.inn'));checks++;
for(const domain of ['http://fixture-parsething.ru','https://u:p@fixture-parsething.ru','https://fixture-parsething.ru/?a=1','https://fixture-parsething.ru/#x','https://fixture-parsething.ru/sub','https://example.com','https://localhost','https://fixture.test']){
 assert(validate({...ready,domain},true).some(e=>e.startsWith('domain')));checks++;
}
for(const email of ['qa@example.com\r\nBcc:other@example.com','qa','<script>@example.com']){assert(validate({...ready,contactEmail:email},true).includes('contactEmail'));checks++;}
assert(validate({...ready,privacyReviewed:false},true).includes('privacyReviewed / termsReviewed'));checks++;
assert(validate({...ready,hostingPrivacyText:''},true).some(e=>e.startsWith('hostingPrivacyText')));checks++;
assert(validate({...ready,seller:{...ready.seller,inn:'secret'}},true).includes('seller.inn'));checks++;
assert(validate({...ready,plans:[{id:'team',price:0,seats:3},{id:'department',price:4990,seats:10}]},true).includes('plan team'));checks++;
assert(validate({...ready,telegramUsername:'other?token=x'},true).includes('telegramUsername'));checks++;
assert.deepEqual(validate({...ready,contactEmail:''},true),[]);checks++;
assert(validate({...ready,contactEmail:'',telegramUsername:''},true).some(e=>e.startsWith('contactEmail')));checks++;
for(const trialDays of [0,-1,1.5,366,'30']){assert(validate({...ready,trialDays}).includes('trialDays'));checks++;}
assert(validate({...ready,trialSeats:0}).includes('trialSeats'));checks++;
assert(validate({...ready,plans:[...ready.plans,ready.plans[0]]}).includes('plans'));checks++;
assert(validate({...ready,plans:ready.plans.map(p=>({...p,seats:5}))}).includes('plan seat order'));checks++;
const source=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const changed={...original,trialDays:45,trialSeats:25,plans:[{id:'team',name:'A < B',price:3900,seats:7},{id:'department',name:'Расширенный',price:7900,seats:25}]};
const rendered=renderPublicConfig(source,changed);
for(const expected of ['45-дневный тестовый период','data-trial>45</span>','data-trial-seats>25</span>','data-seats="team">7</span>','data-seats="department">25</span>','data-plan-name="team">A &lt; B</h3>','data-team-range="team">До 7 человек','data-team-range="department">8–25 человек','data-team-range="custom">Больше 25 человек']){assert(rendered.includes(expected),expected);checks++;}
assert(!rendered.includes('{{'));checks++;
assert.equal(indexingPolicy(original,'brochure'),false);checks++;
assert.equal(indexingPolicy(original,'preview'),false);checks++;
assert.equal(indexingPolicy({...original,domain:'https://parsetting.ru'},'brochure',true),true);checks++;
for(const mode of ['preview','production']){assert.throws(()=>indexingPolicy(original,mode,true));checks++;}
for(const domain of ['https://179.254.106.31','https://[::1]','https://localhost','https://intranet.local','http://parsetting.ru','https://parsetting.ru/private','https://parsetting.ru/?x=1']){assert.throws(()=>indexingPolicy({...original,domain},'brochure',true));checks++;}
assert(validate({...original,domain:'https://parsetting.ru'},'production').includes('seller.inn'));checks++;
console.log(`PASS ${checks} configuration and static content checks`);
