/* Общий модуль аккаунтов. Данные хранятся в localStorage браузера (см. комментарий про Supabase в README). */
const UK='fitqaz_users',SK='fitqaz_session';
const UNIS=['KSTU','Университет Астана','КазНУ','ЕНУ им. Л.Н. Гумилева','КБТУ','SATB','КазНПУ','МУИТ','Другой вуз'];
const getU=()=>{try{return JSON.parse(localStorage.getItem(UK))||{}}catch(e){return{}}};
const setU=u=>localStorage.setItem(UK,JSON.stringify(u));
const curKey=()=>localStorage.getItem(SK);
const newSalt=()=>[...crypto.getRandomValues(new Uint8Array(12))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function hash(pw,salt){
 if(window.crypto&&crypto.subtle){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
  const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},k,256);
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
 let h=5381;for(const c of salt+pw)h=((h*33)^c.charCodeAt(0))>>>0;return 'w'+h}

if(document.body.dataset.page==='auth'){
 if(getU()[curKey()])location.replace('index.html');
 const app=document.getElementById('app');app.className='auth';let mode='choose';
 const fld=(id,ph,t,ac)=>`<input id="${id}" type="${t||'text'}" placeholder="${ph}" autocomplete="${ac||'off'}" required>`;
 const logo='<div class="logo" style="text-align:center">FIT<b>Q</b>AZ</div><p class="muted" style="text-align:center">Двигайся. Развивайся. Достигай.</p>';
 const V={
  choose:()=>`${logo}<div class="card stack"><h2>Добро пожаловать!</h2><small>Выберите, как продолжить</small>
   <button class="btn big" data-m="reg">Я новый пользователь — регистрация</button>
   <button class="btn big ghost" data-m="login">У меня уже есть аккаунт — войти</button></div>`,
  reg:()=>`${logo}<div class="card"><h2 style="margin-bottom:12px">Регистрация</h2><form id="f">
   ${fld('n','Имя (например, Асылхан Б.)','text','username')}
   <select id="u">${UNIS.map(x=>`<option>${x}</option>`).join('')}</select>
   ${fld('p','Пароль (от 6 символов)','password','new-password')}${fld('p2','Повторите пароль','password','new-password')}
   <div class="err" id="er"></div><button class="btn big">Создать аккаунт</button></form></div>
   <button class="lnk" data-m="login">Уже есть аккаунт? Войти</button><button class="lnk" data-m="choose">‹ Назад</button>`,
  login:()=>`${logo}<div class="card"><h2 style="margin-bottom:12px">Вход</h2><form id="f">
   ${fld('n','Имя','text','username')}${fld('p','Пароль','password','current-password')}
   <div class="err" id="er"></div><button class="btn big">Войти</button></form></div>
   <button class="lnk" data-m="reg">Нет аккаунта? Регистрация</button><button class="lnk" data-m="choose">‹ Назад</button>`};
 const draw=()=>{app.innerHTML=V[mode]();const n=document.getElementById('n');if(n)n.focus()};
 const v=id=>document.getElementById(id).value,fail=m=>document.getElementById('er').textContent=m;
 app.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b){mode=b.dataset.m;draw()}});
 app.addEventListener('submit',async e=>{e.preventDefault();
  const name=v('n').trim(),k=name.toLowerCase(),pw=v('p'),u=getU();
  if(mode==='reg'){
   if(name.length<2||name.length>20)return fail('Имя: от 2 до 20 символов');
   if(u[k])return fail('Такое имя уже занято — выберите другое или войдите');
   if(pw.length<6)return fail('Пароль: минимум 6 символов');
   if(pw!==v('p2'))return fail('Пароли не совпадают');
   const salt=newSalt();u[k]={name,uni:v('u'),salt,hash:await hash(pw,salt),s:{xp:0}};setU(u);
  }else{
   const r=u[k];if(!r||await hash(pw,r.salt)!==r.hash)return fail('Неверное имя или пароль');
  }
  localStorage.setItem(SK,k);location.replace('index.html')});
 draw();
}
