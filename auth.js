/* Подхватываем свежий style.css, даже если браузер держит старый в кеше */
(function(){const l=document.querySelector&&document.querySelector('link[href^="style.css"]');if(l&&!/[?]v=/.test(l.getAttribute('href')))l.setAttribute('href','style.css?v=8')})();
/* Настройки оформления (тема, размер текста, анимации) — хранятся на устройстве */
function applyPrefs(){const r=document.documentElement;if(!r)return;const g=k=>{try{return localStorage.getItem('fitqaz_'+k)}catch(e){return null}};
 r.dataset.theme=g('theme')||'dark';r.dataset.size=g('size')||'normal';r.dataset.anim=g('anim')||'on'}
function setPref(k,v){try{localStorage.setItem('fitqaz_'+k,v)}catch(e){}applyPrefs()}
applyPrefs();
/* ===== Иконки (свои, линейные, скруглённые) ===== */
const IC={
 home:'<path d="M4.2 11.2 12 4.6l7.8 6.6"/><path d="M6.2 10v8.2c0 .9.7 1.6 1.6 1.6h2.7v-4.6h3v4.6h2.7c.9 0 1.6-.7 1.6-1.6V10"/>',
 calendar:'<rect x="3.8" y="5.4" width="16.4" height="14.8" rx="4.6"/><path d="M8.2 3.6v3.4M15.8 3.6v3.4M3.8 10.4h16.4"/><circle cx="8.6" cy="14.4" r=".7" fill="currentColor"/><circle cx="12" cy="14.4" r=".7" fill="currentColor"/><circle cx="15.4" cy="14.4" r=".7" fill="currentColor"/>',
 calcheck:'<rect x="3.8" y="5.4" width="16.4" height="14.8" rx="4.6"/><path d="M8.2 3.6v3.4M15.8 3.6v3.4M3.8 10.4h16.4"/><path d="m9.2 15 2 2 3.8-4"/>',
 chart:'<path d="M6 19v-6.2M12 19V5.4M18 19v-9"/>',
 user:'<circle cx="12" cy="8.4" r="3.7"/><path d="M4.8 19.6c.8-3.6 3.6-5.4 7.2-5.4s6.4 1.8 7.2 5.4"/>',
 bot:'<rect x="4.6" y="8" width="14.8" height="11" rx="5"/><path d="M12 8V5.6"/><circle cx="12" cy="4.6" r="1.1"/><circle cx="9.4" cy="13.1" r=".9" fill="currentColor"/><circle cx="14.6" cy="13.1" r=".9" fill="currentColor"/><path d="M9.8 16.1c1.3.8 3.1.8 4.4 0"/>',
 cap:'<path d="M2.8 9.6 12 5l9.2 4.6L12 14.2 2.8 9.6Z"/><path d="M6.4 12v4.2c1.5 1.7 3.5 2.6 5.6 2.6s4.1-.9 5.6-2.6V12"/><path d="M21.2 9.6v4.6"/>',
 task:'<circle cx="12" cy="12" r="8.3"/><path d="m8.3 12.4 2.7 2.7 4.9-5.4"/>',
 trophy:'<path d="M7.8 4.6h8.4v5a4.2 4.2 0 0 1-8.4 0v-5Z"/><path d="M7.8 6.6H5c0 2.7 1 4.2 3.2 4.6M16.2 6.6H19c0 2.7-1 4.2-3.2 4.6M12 13.8v3.4M8.4 19.6h7.2"/>',
 flame:'<path d="M12 3.6c.7 3.1-3.9 4.7-3.9 9.1a4 4 0 0 0 8 .6c0-1.4-.6-2.3-1.4-3.1-.3 1-.9 1.5-1.7 1.6.6-3.1-.1-5.7-1-8.2Z"/>',
 bolt:'<path d="M13.2 3.6 6.6 13h5.5l-1 7.4 6.6-9.5h-5.5l1-7.3Z"/>',
 star:'<path d="m12 4 2.4 5.1 5.5.7-4 3.8 1 5.4-4.9-2.7-4.9 2.7 1-5.4-4-3.8 5.5-.7L12 4Z"/>',
 crown:'<path d="M4.6 17.6 3.9 8.2l4.6 3.8L12 6.2l3.5 5.8 4.6-3.8-.7 9.4H4.6Z"/><path d="M5.2 20.4h13.6"/>',
 spark:'<path d="M12 3.8v4.4M12 15.8v4.4M3.8 12h4.4M15.8 12h4.4"/><path d="m6.6 6.6 2.4 2.4M15 15l2.4 2.4M17.4 6.6 15 9M9 15l-2.4 2.4"/>',
 gear:'<circle cx="12" cy="12" r="3.1"/><path d="M12 3.6v2.3M12 18.1v2.3M3.6 12h2.3M18.1 12h2.3M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6"/>',
 moon:'<path d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8Z"/>',
 sun:'<circle cx="12" cy="12" r="3.7"/><path d="M12 3.6v1.9M12 18.5v1.9M3.6 12h1.9M18.5 12h1.9M6.1 6.1l1.3 1.3M16.6 16.6l1.3 1.3M17.9 6.1l-1.3 1.3M7.4 16.6l-1.3 1.3"/>',
 monitor:'<rect x="3.8" y="5" width="16.4" height="11.2" rx="3.4"/><path d="M9 19.8h6M12 16.2v3.6"/>',
 key:'<circle cx="8.4" cy="12" r="3.6"/><path d="M12 12h8.2M17.2 12v3.2M20.2 12v2.2"/>',
 logout:'<path d="M10.2 4.8H7.8a2.6 2.6 0 0 0-2.6 2.6v9.2a2.6 2.6 0 0 0 2.6 2.6h2.4"/><path d="m14.2 8.4 3.8 3.6-3.8 3.6M18 12H9.6"/>',
 reset:'<path d="M5.2 12a6.9 6.9 0 1 1 2.1 5"/><path d="M5.2 18.4V13h5.4"/>',
 back:'<path d="m14.6 6-6 6 6 6"/>',
 chev:'<path d="m9.4 6 6 6-6 6"/>',
 send:'<path d="M20.2 4 4 10.9l6.2 2.4 2.5 6.7L20.2 4Z"/><path d="m10.2 13.3 4.6-4.4"/>',
 warn:'<path d="M12 4.6 3.9 18.6h16.2L12 4.6Z"/><path d="M12 10.2v3.6"/><circle cx="12" cy="16.6" r=".6" fill="currentColor"/>',
 clock:'<circle cx="12" cy="12" r="8.3"/><path d="M12 7.6V12l3 2"/>',
 check:'<path d="m5.6 12.6 4 4 8.8-9.2"/>'
};
const ic=n=>IC[n]?`<svg class="ic ${n}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`:'';
/* Если в html забыли подключить config.js — подгружаем его сами */
if(typeof window.FITQAZ_DB_URL==='undefined'){try{const x=new XMLHttpRequest();x.open('GET','config.js?'+Date.now(),false);x.send();if(x.status===200)(0,eval)(x.responseText)}catch(e){}}
/* Хранилище аккаунтов + вход/регистрация. */
if(window.addEventListener){const showErr=m=>{const a=document.getElementById('app');if(a&&!a.innerHTML.trim())a.innerHTML='<div class="card"><h2>Ошибка загрузки</h2><p class="err" style="margin-top:8px">'+String(m).replace(/</g,'&lt;')+'</p><small>Сделайте скриншот этого экрана</small></div>'};
 window.addEventListener('error',e=>showErr(e.message+' ('+(e.filename||'').split('/').pop()+':'+e.lineno+')'));
 window.addEventListener('unhandledrejection',e=>showErr((e.reason&&e.reason.message)||e.reason))}
const UK='fitqaz_users',SK='fitqaz_session',DBURL=(window.FITQAZ_DB_URL||'').replace(/\/$/,'');
let U={},G={},SCH={};const touched={};
const clean=x=>String(x).replace(/["<>]/g,'').trim();
const normG=g=>{const o={};if(typeof g==='string'){g.split(/[,;\n]/).map(clean).filter(x=>x.length>1).forEach(x=>o[x]=x);return o}if(g&&typeof g==='object')for(const[k,v]of Object.entries(g)){if(v==null)continue;o[k]=typeof v==='string'?v:(v.name||String(k))}return o};const normSch=s=>{const o={};if(typeof s==='string'){s.split(/[;\n]/).forEach(e=>{const i=e.indexOf(':');if(i>0)o[clean(e.slice(0,i))]=e.slice(i+1).trim()})}else if(s&&typeof s==='object'){for(const[k,v]of Object.entries(s))if(typeof v==='string')o[k]=v}return o};
const NET={s:DBURL?'wait':'local',m:''};
const netText=()=>({local:'Локальный режим: данные только на этом устройстве',ok:'Онлайн: общая база',wait:'Подключение…',err:NET.m})[NET.s];
const netErr=e=>{NET.s='err';NET.m=e.message==='Failed to fetch'?'Нет связи с базой: проверьте адрес в config.js и интернет':e.message};
const enc=k=>String(k).replace(/[.$#$$$$\/]/g,'_');
const upath=k=>`${DBURL}/fitqaz/users/${encodeURIComponent(enc(k))}`;
const curKey=()=>localStorage.getItem(SK);
const localISO=()=>new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
const newSalt=()=>[...crypto.getRandomValues(new Uint8Array(12))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function hash(pw,salt){
 if(window.crypto&&crypto.subtle){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
  const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},k,256);
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
 let h=5381;for(const c of salt+pw)h=((h*33)^c.charCodeAt(0))>>>0;return 'w'+h}
async function loadUsers(){let raw={},gr=null,sc=null;
 try{if(DBURL){const r=await fetch(DBURL+'/fitqaz.json');
  if(!r.ok)throw new Error(r.status===401||r.status===403?'Нет доступа к базе: во вкладке Rules вставьте правила и нажмите «Опубликовать»':r.status===404?'Неверный адрес базы в config.js':'Ошибка базы '+r.status);
  const all=(await r.json())||{};raw=all.users||{};gr=all.groups;sc=all.schedule;NET.s='ok'}else{raw=JSON.parse(localStorage.getItem(UK))||{};gr=JSON.parse(localStorage.getItem('fitqaz_groups')||'null');sc=JSON.parse(localStorage.getItem('fitqaz_schedule')||'null')}SCH=normSch(sc);G=normG(gr);if(!Object.keys(G).length)G={'СИБ-25-7':'СИБ-25-7'}}catch(e){if(DBURL)netErr(e)}
 const n={},mig=[];
 for(const[k,r]of Object.entries(raw))if(r&&typeof r==='object'){r.k=r.k||k;
  if(DBURL&&k!==enc(r.k)){mig.push([k,r]);if(raw[enc(r.k)])continue}
  n[r.k]=r}
 /* переносим старые записи с «непонятными» ключами на читаемые */
 for(const[k,r]of mig){const del=()=>fetch(`${DBURL}/fitqaz/users/${encodeURIComponent(k)}.json`,{method:'DELETE'}).catch(()=>{});
  const ex=raw[enc(r.k)];
  if(!ex||!ex.hash)fetch(upath(r.k)+'.json',{method:'PUT',body:JSON.stringify(r)}).then(del).catch(()=>{});else del()}
 return n}
async function refresh(){const n=await loadUsers();for(const k in n)if(!touched[k]||Date.now()-touched[k]>4000)U[k]=n[k]}
function putUserNow(k){touched[k]=Date.now();U[k].k=k;
 if(!DBURL){localStorage.setItem(UK,JSON.stringify(U));return Promise.resolve()}
 return fetch(upath(k)+'.json',{method:'PUT',keepalive:true,body:JSON.stringify(U[k])}).then(r=>{if(!r.ok)throw new Error(r.status===401||r.status===403?'нет доступа к базе: во вкладке Rules вставьте правила и нажмите «Опубликовать»':'ошибка базы, код '+r.status)})}
function putUser(k){touched[k]=Date.now();U[k].k=k;
 if(DBURL)fetch(upath(k)+'.json',{method:'PUT',keepalive:true,body:JSON.stringify(U[k])}).then(r=>{if(!r.ok)netErr(new Error('Не удалось сохранить в базу (код '+r.status+')'))}).catch(netErr);
 else localStorage.setItem(UK,JSON.stringify(U))}
function putS(k){touched[k]=Date.now();
 if(DBURL)fetch(upath(k)+'/s.json',{method:'PUT',keepalive:true,body:JSON.stringify(U[k].s||{})}).then(r=>{if(!r.ok)netErr(new Error('Не удалось сохранить в базу (код '+r.status+')'))}).catch(netErr);
 else localStorage.setItem(UK,JSON.stringify(U))}
const DEMO=[
 {k:'student',name:'student',fio:'Алимжан',role:'student',pw:'student123',s:{xp:0}},
 {k:'teacher',name:'teacher',fio:'Ерлан',role:'teacher',pw:'teacher123'}];
async function seed(){for(const d of DEMO){
 if(!U[d.k]){const{pw,...r}=d,salt=newSalt();U[d.k]={...r,salt,hash:await hash(pw,salt),v:2,created:localISO()};putUser(d.k)}
 else if(U[d.k].fio!==d.fio){U[d.k].fio=d.fio;putUser(d.k)}}}
const READY=(async()=>{U=await loadUsers();await seed()})();

if(document.body.dataset.page==='auth')READY.then(()=>{
 if(U[curKey()]){location.replace('index.html');return}
 const app=document.getElementById('app');app.className='auth';let mode='choose';
 const fld=(id,ph,t,ac)=>`<input id="${id}" type="${t||'text'}" placeholder="${ph}" autocomplete="${ac||'off'}" required>`;
 const logo='<div class="logo" style="text-align:center">FIT<b>Q</b>AZ</div><p class="muted" style="text-align:center">Двигайся. Развивайся. Достигай.</p>';
 const V={
  choose:()=>`${logo}<div class="card stack"><h2>Добро пожаловать!</h2><small>Выберите, как продолжить</small>
   <button class="btn big" data-m="reg">Я новый пользователь — регистрация</button>
   <button class="btn big ghost" data-m="login">У меня уже есть аккаунт — войти</button></div>`,
  reg:()=>`${logo}<div class="card"><h2 style="margin-bottom:12px">Регистрация студента</h2><form id="f">
   ${fld('n','Ваше имя','text','username')}
   <select id="g">${Object.entries(G).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
   ${fld('p','Пароль (от 6 символов)','password','new-password')}${fld('p2','Повторите пароль','password','new-password')}
   <div class="err" id="er"></div><button class="btn big">Создать аккаунт</button></form></div>
   <button class="lnk" data-m="login">Уже есть аккаунт? Войти</button><button class="lnk" data-m="choose">${ic('back')}Назад</button>`,
  login:()=>`${logo}<div class="card"><h2 style="margin-bottom:12px">Вход</h2><form id="f">
   ${fld('n','Имя','text','username')}${fld('p','Пароль','password','current-password')}
   <div class="err" id="er"></div><button class="btn big">Войти</button></form></div>
   <button class="lnk" data-m="reg">Нет аккаунта? Регистрация</button><button class="lnk" data-m="choose">${ic('back')}Назад</button>`};
 const draw=()=>{app.innerHTML=V[mode]()+'';const n=document.getElementById('n');if(n)n.focus()};
 const v=id=>document.getElementById(id).value,fail=m=>document.getElementById('er').textContent=m;
 app.addEventListener('click',e=>{const b=e.target.closest('[data-m]');
  if(b){mode=b.dataset.m;draw()}});
 let busy=false;
 app.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;busy=true;
  try{
   fail('Подождите…');await refresh();
   const name=v('n').trim(),k=name.toLowerCase(),pw=v('p');
   if(mode==='reg'){
    if(name.length<2||name.length>20)return fail('Имя: от 2 до 20 символов');
    if(U[k])return fail('Такое имя уже занято — выберите другое или войдите');
    if(pw.length<6)return fail('Пароль: минимум 6 символов');
    if(pw!==v('p2'))return fail('Пароли не совпадают');
    const salt=newSalt();U[k]={k,name,group:v('g'),role:'student',salt,hash:await hash(pw,salt),s:{xp:0},v:2,created:localISO()};
    try{await putUserNow(k)}catch(err){delete U[k];return fail('Не удалось создать аккаунт: '+(err.message==='Failed to fetch'?'нет связи с базой, проверьте адрес в config.js и интернет':err.message))}
   }else{const r=U[k];if(!r||await hash(pw,r.salt)!==r.hash)return fail('Неверное имя или пароль')}
   localStorage.setItem(SK,k);location.replace('index.html');
  }catch(err){fail('Ошибка: '+(err&&err.message||err))}
  finally{busy=false}});
 draw();
});
