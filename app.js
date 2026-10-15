'use strict';
const config=window.PARSETTING_CONFIG||{brand:'Parsetting',mode:'preview',trialDays:30,plans:[],seller:{}};
const isBrochure=config.mode==='brochure';
const isLive=config.mode==='production'||isBrochure;
const hasContact=Boolean(config.telegramUsername||config.contactEmail);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
$$('[data-brand]').forEach(e=>e.textContent=config.brand);
$$('[data-trial]').forEach(e=>e.textContent=config.trialDays);
$$('[data-trial-seats]').forEach(e=>e.textContent=config.trialSeats||15);
$('#preview-note').hidden=isLive;
for(const plan of config.plans){
 for(const [key,value] of [['plan-name',plan.name],['price',new Intl.NumberFormat('ru-RU').format(plan.price)],['seats',plan.seats]]){$$('[data-'+key+'="'+plan.id+'"]').forEach(el=>el.textContent=value);}
 const option=document.querySelector('#request-form [name="plan"] option[value="'+plan.id+'"]');if(option)option.textContent=plan.name;
}
if(config.telegramUsername){$$('#footer-telegram,.direct-contact').forEach(e=>e.href='https://t.me/'+config.telegramUsername);}
else {$$('#footer-telegram,.direct-contact').forEach(e=>e.hidden=true);}
if(config.contactEmail){$('#footer-contact').href='mailto:'+config.contactEmail;$('#footer-contact').textContent=config.contactEmail;$('#footer-contact').hidden=false;}
if(config.mode==='production')$('#seller-line').textContent='© 2026 '+config.brand+' · '+config.seller.name+' · ИНН '+config.seller.inn;
else if(isBrochure)$('#seller-line').textContent='© 2026 '+config.brand+' · Знакомство с продуктом и подключение';
const stageKeys=['calc','buy','tenders','overview','reports','statistics'];let currentStage='calc',playTimer=null;
const screens={
 calc:{file:'assets/screen-calculation.png',width:1366,height:768,title:'Вся поставка складывается здесь.',name:'Расчёт',description:'Группируйте позиции, указывайте количество и стоимость. Расчёт остаётся рядом с тендером.',alt:'Экран расчёта: группы товаров, количество, цены и итоговая стоимость'},
 buy:{file:'assets/screen-purchase.png',width:1366,height:768,title:'От расчёта — к закупке.',name:'Закупка',description:'Поставщики, статусы позиций, номера резерва и даты поставки — в карточке закупки.',alt:'Экран закупки: поставщики, статусы позиций, номера резерва и даты поставки'},
 tenders:{file:'assets/screen-tenders.png',width:900,height:800,title:'Свои тендеры — перед глазами.',name:'Тендеры',description:'Рабочий список специалиста: заказчики, статусы, сроки, суммы и состояние комплектующих.',alt:'Рабочий список тендеров специалиста: заказчик, статус, сроки и суммы'},
 overview:{file:'assets/screen-overview.png',width:1366,height:900,title:'Общая картина для команды.',name:'Обзор работы',description:'План месяца и текущие задачи: подать заявки, проверить закупку, оплату и комплектующие.',alt:'Обзор работы: общий план месяца и задачи, требующие внимания'},
 reports:{file:'assets/screen-reports.png',width:1060,height:650,title:'Итоги работы по периодам.',name:'Отчёты',description:'Договоры, оплата, закупка и прибыль — в отчётах по выбранному периоду.',alt:'Отчёты по периодам: договоры, оплата, закупка и прибыль'},
 statistics:{file:'assets/screen-statistics.png',width:1060,height:650,title:'Динамика, которую видно.',name:'Статистика',description:'График показывает, как меняется сумма договоров по месяцам. На снимке — демонстрационные данные.',alt:'Статистика приложения: динамика суммы договоров по месяцам'}
};
function stopDemo(){if(playTimer)clearInterval(playTimer);playTimer=null;$('#demo-play').setAttribute('aria-pressed','false');$('#demo-play').textContent='▶ Показ экранов';}
function setStage(stage,manual=false){if(!stageKeys.includes(stage))return;if(manual)stopDemo();currentStage=stage;const s=screens[stage];$('#screen-image').src=s.file;$('#screen-image').alt=s.alt;$('#screen-image').width=s.width;$('#screen-image').height=s.height;$('#screen-title').textContent=s.title;$('#screen-description').textContent=s.description;$('#screen-open').setAttribute('aria-label','Открыть экран «'+s.name+'» крупно');$('#caption-number').textContent=String(stageKeys.indexOf(stage)+1).padStart(2,'0')+' / '+String(stageKeys.length).padStart(2,'0');$$('[data-stage]').forEach(tab=>{const active=tab.dataset.stage===stage;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});$('#demo-panel').setAttribute('aria-labelledby','tab-'+stage);}
$$('[data-stage]').forEach((tab,index)=>{tab.addEventListener('click',()=>setStage(tab.dataset.stage,true));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(index+1)%stageKeys.length;else if(e.key==='ArrowLeft')n=(index+stageKeys.length-1)%stageKeys.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=stageKeys.length-1;else return;e.preventDefault();const target=$$('[data-stage]')[n];setStage(target.dataset.stage,true);target.focus();});});
$('#demo-play').addEventListener('click',()=>{if(playTimer){stopDemo();return;}$('#demo-play').setAttribute('aria-pressed','true');$('#demo-play').textContent='Ⅱ Остановить';playTimer=setInterval(()=>setStage(stageKeys[(stageKeys.indexOf(currentStage)+1)%stageKeys.length]),5000);});
$('#screen-open').addEventListener('click',()=>{stopDemo();const s=screens[currentStage];$('#screen-large').src=s.file;$('#screen-large').alt=s.alt;$('#screen-large').width=s.width;$('#screen-large').height=s.height;$('#screen-dialog-title').textContent=s.name;$('#screen-original').href=s.file;$('#screen-dialog').showModal();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDemo();});
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.05});$$('.reveal').forEach(el=>observer.observe(el));}
setStage('calc');
function syncRequestHeading(){const service=$('#request-form').elements.plan.selectedOptions[0]?.hasAttribute('data-service');$('#request-title').innerHTML=service?'Обсудим вашу задачу.':'Давайте посмотрим<br>один тендер.';$('#request-dialog > .eyebrow').textContent=service?'ВНЕДРЕНИЕ И ПОДДЕРЖКА':'ЗНАКОМСТВО С ВАШИМ ПРОЦЕССОМ';}
function openRequest(topic){const dialog=$('#request-dialog');$('#request-form').elements.plan.value=topic;syncRequestHeading();$('#request-form').hidden=false;$('#request-result').hidden=true;dialog.showModal();}
$('#request-form').elements.plan.addEventListener('change',syncRequestHeading);
$$('[data-request]').forEach(button=>button.addEventListener('click',()=>openRequest(button.dataset.request)));
$$('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
$('#request-form').addEventListener('submit',e=>{
 e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
 const fields=new FormData(form);
 const selectedOption=form.elements.plan.selectedOptions[0];
 const selectedPlan=selectedOption?.textContent||'Тестовый период';
 const serviceRequest=selectedOption?.hasAttribute('data-service');
 const nextStep=serviceRequest?'Хочу согласовать объём работ, сроки и стоимость до начала.':`Удобно начать с короткой демонстрации и ${config.trialDays}-дневного тестового периода.`;
 const message=`Здравствуйте! Хочу обсудить ${config.brand}.\nКоманда: ${fields.get('team')}.\nИнтересует: ${selectedPlan}.\nЗадача: ${String(fields.get('task')).trim()||'Обсудим на встрече'}.\n${nextStep}`;
 $('#message-preview').value=message;form.hidden=true;$('#request-result').hidden=false;
 $('#request-status').textContent=hasContact?'Сообщение подготовлено, но ещё не отправлено. Скопируйте текст и отправьте его в Telegram.':'Сообщение подготовлено, но контакт для отправки пока не настроен.';
 const email=$('#send-email');email.hidden=!config.contactEmail; if(config.contactEmail)email.href=`mailto:${config.contactEmail}?subject=${encodeURIComponent((serviceRequest?'Внедрение и поддержка ':'Тестовый период ')+config.brand)}&body=${encodeURIComponent(message)}`;
 const telegram=$('#send-telegram');telegram.hidden=!config.telegramUsername;if(!telegram.hidden)telegram.href=`https://t.me/${config.telegramUsername}`;
 $('#copy-message').focus();
});
$('#edit-message').addEventListener('click',()=>{$('#request-result').hidden=true;$('#request-form').hidden=false;$('#request-form').elements.team.focus();});
$('#copy-message').addEventListener('click',async()=>{const field=$('#message-preview');try{await navigator.clipboard.writeText(field.value);$('#request-status').textContent='Текст скопирован. Отправьте его выбранным способом.';}catch{field.focus();field.select();$('#request-status').textContent='Выделили текст. Скопируйте его сочетанием Ctrl+C или через меню телефона.';}});
const legalText={
 privacy:()=>isBrochure?`Связаться с автором проекта: Telegram @${config.telegramUsername}.

Это информационный сайт. Размер команды и описание задачи используются только в вашем браузере, чтобы подготовить текст сообщения. Форма ничего не отправляет на сервер, не сохраняет ввод в cookie или localStorage. Подготовленное сообщение отправляете вы сами в личной переписке Telegram. Не указывайте в нём пароли, данные сотрудников или содержимое рабочей базы.

Аналитика, рекламные пиксели и сторонние шрифты не подключены. ${config.hostingPrivacyText}

При переходе в Telegram действуют правила этого сервиса. Переписка используется для ответа на ваш запрос и согласования демонстрации. Вопросы об обращении и просьбу удалить его можно направить автору по тому же контакту. Рекламная рассылка автоматически не подключается. До передачи рабочих данных и заключения договора отдельно согласуем условия их обработки.`:`${isLive?'':'Проект для предпросмотра. До публикации владелец заполняет реквизиты и утверждает этот текст.\n\n'}Оператор: ${config.seller.name||'[ФИО / наименование владельца]'}, ИНН ${config.seller.inn||'[ИНН]'}. Адрес: ${config.seller.address||'[адрес для обращений]'}. Контакт: ${config.contactEmail||('Telegram @'+config.telegramUsername)}.

На сайте можно подготовить сообщение о тестовом периоде. Размер команды и описание задачи обрабатываются в вашем браузере; сайт не отправляет их на сервер и не сохраняет в cookie или localStorage. Открытие почтового приложения ещё не означает отправку письма. Передача оператору происходит после того, как вы сами отправите письмо или сообщение в мессенджере.

Данные из поступившего обращения используются для ответа, демонстрации и согласования тестового периода. Не присылайте пароли, паспортные данные или выгрузки рабочей базы. Рекламная рассылка не подключается автоматически. Если договор не заключён, обращения удаляются через 30 дней после завершения обсуждения, кроме случаев, когда хранение требуется законом. Обращение об удалении или отзыве согласия направляется на указанный контакт.

Сайт не использует аналитику, сторонние шрифты и рекламные cookie. Хостинг может вести технические журналы обращений (IP-адрес, время и запрошенный URL) для защиты сервиса. ${config.hostingPrivacyText||'Сведения о хостинге и сроке хранения технических журналов будут добавлены до публикации.'}

При самостоятельном переходе в почту или Telegram применяются также правила выбранного сервиса.`,
 terms:()=>`${isBrochure?'Условия знакомства с продуктом. Сайт не принимает оплату и не заключает договор. Контакт автора: Telegram @'+config.telegramUsername+'.':(isLive?'':'Проект условий тестового периода, не готовая публичная оферта.\n\n')+'Правообладатель и контакт: '+(config.seller.name||'[заполнить]')+', '+(config.contactEmail||('Telegram @'+config.telegramUsername))+'.'}

Тестовый период длится ${config.trialDays} дней с согласованной даты запуска. Тестовая лицензия рассчитана на ${config.trialSeats} активных сотрудников. Перед началом согласуются организация, число сотрудников, конфигурация сервера и тестовые данные. Банковская карта для тестового периода не требуется; автоматического продления и списаний нет.

После тестового периода стороны решают, продолжать ли работу. Срок лицензии, тариф, число пользователей, состав поставки, порядок обновлений и поддержка фиксируются в отдельном лицензионном договоре до оплаты. Цены на сайте относятся к стартовому предложению, а не к уже заключённому договору.

Лицензия привязывается к PServer организации и активируется администратором. Активная учётная запись сотрудника занимает одно место, в том числе администратор и руководители; сервис парсинга и неактивные сотрудники не занимают места. Проверка лицензии работает на сервере организации без постоянного подключения к серверу лицензирования.

После окончания срока база не удаляется: доступны просмотр в пределах роли и резервное копирование, а новые записи, изменения и импорт приостанавливаются до продления. Смена тарифа и перенос лицензии на другой сервер согласуются с правообладателем.

Клиент Windows и PServer устанавливаются в согласованной инфраструктуре. Платный доступ к сторонним источникам, серверное оборудование и нестандартные доработки в помесячную цену не входят. Использование Bico требует собственного разрешённого доступа клиента.

Поддержка — в рабочие дни; целевой первый ответ на обращение — следующий рабочий день. Это не гарантия времени устранения любого сбоя и не круглосуточный SLA. Ошибки программы разбираются отдельно от времени консультаций.

До переноса рабочих данных создаётся резервная копия. Ответственность за инфраструктуру, расписание копирования, прекращение использования, доступ к данным после окончания периода и возвраты стороны согласуют в договоре. Сайт не принимает оплату и не заключает договор автоматически.`
};
$$('[data-legal]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.legal;$('#legal-title').textContent=key==='privacy'?'Обработка данных':'Условия тестового периода';$('#legal-content').textContent=legalText[key]();$('#legal-dialog').showModal();}));

const requestedService=new URLSearchParams(window.location.search).get('service');
if(['install','implementation','hourly','support'].includes(requestedService))openRequest(requestedService);

