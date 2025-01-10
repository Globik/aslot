const main_page = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Машина</title>
    <!-- <meta name="viewport" content="width=device-width,initial-scale=1.0"> -->
    <meta name="viewport" content="initial-scale=0.60, minimum-scale=0.60, maximum-scale=0.60">
    
    <link rel="icon" type="image/png" href="/img3/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/img3/favicon.svg" />
<link rel="shortcut icon" href="/img3/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/img3/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="Chatikon" />
<link rel="manifest" href="/img3/site.webmanifest" />
    
    
    
    <meta name="description" content="Крути руль и собирай по дороге сердечки" />
 
  <meta property="og:title" content="Машина" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="//chatikon.ru/" />
  <meta property="og:image" content="//chatikon.ru/img/home.jpg" />
  <meta property="og:site_name" content="Машина" />
  <meta property="og:description" content="Крути руль и собирай по дороге сердечки" />
  
  <meta itemprop="name" content="Машина"/>
<meta itemprop="description" content="Крути руль и собирай по дороге сердечки" />
<meta name="description" content="Крути руль и собирай по дороге сердечки"/>
    
    <!-- <link rel="icon" href="/img/w4.png"> -->
    <link href="/css/note.css" rel="stylesheet">
    <link href="/css/slot.css" rel="stylesheet">
    <link href="/css/tables.css" rel="stylesheet">
    <link href="/css/output.css" rel="stylesheet">
    <link href="/css/login3.css" rel="stylesheet"> 
    <style>
   
    </style>
    <script src="/js/wallet-address-validator.min.js"></script>
    <script src="/js/globalik.js"></script>
    <script src="/js/mediasoup-client.min.js"></script>
  <!--  <script src="/js/pdfmake.min.js"></script> -->
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    <script async src="https://yastatic.net/share2/share.js"></script>
     <script src="/pwabuilder-sw-register.js"></script>
    </head><body>
  <video id="remote" playsinline autoplay></video>
  <button id="Publish" onclick="startMedia(this);">publish</button> | <button id="Subscribe" onclick="subscribe(this);">subscribe</button>
    <main id="somemain"><nav class="vhod">
<div class="ya-share2" data-curtain data-size="m" data-shape="round"  data-services="vkontakte,telegram,odnoklassniki" data-url="https://chatikon.ru" data-image="https://chatikon.ru/img/home.jpg"></div>
    <div><span id="onlinecount">0</span></div><div><a ${n.user?`onclick="logout(this);"`:''} href="${n.user?'#':'#login'}">${n.user?'Выход':'Вход'}</a></div></nav>
    ${n.user&&n.user.brole=='admin'?`<div><a style="font-size:2rem;" href="/dashboard">Админка</a></div>`:''}
    <header class="h"><h1 class="a">${!n.user?'Рулить и собирать по дороге сердечки &#x1f496': 'Сыграть в слот на интерес'}</h1></header>
    ${n.user?`<div style="font-size:2rem;">Привет, ${n.user.bname}! Удачи в игре!</div>`:''}
    <article class="slot">
   
    <aside id="slotinfo">
    <div id="stagecontainer"><div id="proem" class=""></div>
    <div id="stage">
            <div id="ring-1" class="ring"></div>
            <div id="ring-2" class="ring"></div>
            <div id="ring-3" class="ring"></div>
        </div>
        </div>
       <footer id="foot"> 
       ${n.user?'<input type="button" class="st" value="КУПИТЬ &#x1f496&#x1f496">':''}
       <input type="button" class="startSpinn" value="КРУТИТЬ">
        </footer> 
        </aside>
        <aside id="boxinfo">
       <div id="chatbox"></div>
       <footer id="pdf"> 
       
       <input type="button" class="pdf" value="PDF">
        </footer> 
        </aside>
       
       </article>
        <section><header>У Вас <span id="btc">0</span> сердечек &#x1f496.</header>
      <!-- <button onclick="fuck();">fuck</button> -->
       <br><br>
       <section class="table">
       ${n.user?getProd():getTest()}
       </section>
      
       <a href="#."  class="overlay" id="login"></a>
    <output id="loginoutput" class="popi">
        <div class="modal-header">Авторизация / Регистрация</div>
      
        <div class="modal-body">
          <div class="error-message" id="errormsg"></div>
         <form name="formlogin" id="myform">
            <label for="name" class="lb" style="margin-top: 5px;">Имя </label>
            <input  class="inp" name="username" type="text" placeholder="Введите имя" id="name" required minlength="2" maxlength="20">

            <label for="name" class="lb">Пароль</label>
            <input  class="inp" name="userpassword" type="password" autocomplete="on" placeholder="Введите пароль" id="password" required minlength="2" maxlength="20">
			 <button  class="login-button" id="btnlogin">Войти</button>
         <button class="register-button" id="btnregister">Зарегистрироваться</button>
          </form> </div>
    </output>
    <article class="beschreibung">
    ${!n.user?`
    <header>Добро пожаловать в машину!</header>
    <p> 
    Если Вам хочется расслабиться, то покрутите колесо. 
    В сводной таблице представлены нужные комбинации и их эквивалент в эмодзи. Собирайте сердечки
    и получайте положительные эмоции. Последовательность ходов можно экспортировать в pdf файл.
    Всем добра!
    </p>`:getTxtArticle()}
    </article>
      <!-- <div id="yandex_rtb_R-A-13472717-1"></div>
       <script>
       window.yaContextCb.push(()=>{
       Ya.Context.AdvManager.render({
       "blockId":"R-A-13472717-1",
       "renderTo":"yandex_rtb_R-A-13472717-1"
   })
})
       </script> -->
       <section id="reklama">
       <div id="suka1" class="reklama-box abba">
      <!-- <div>Место для вашей рекламы от 500 руб/неделя. Обращаться в телеграм <a rel="nofollow" href="https://t.me/Globik2">@Globik2</a></div> -->
       <div class="aa-control"><p>Видео чат-рулетка. <a rel="nofollow" href="https://rouletka.ru/about">Перейти на сайт</a></p></div>
       </div>
       <div class="reklama-box">
       <div>Место для вашей рекламы от 500 руб/неделя. Обращаться в телеграм <a rel="nofollow" href="https://t.me/Globik2">@Globik2</a></div>
       </div>
       <div class="reklama-box">
       <div>Место для вашей рекламы от 500 руб/неделя. Обращаться в телеграм <a rel="nofollow" href="https://t.me/Globik2">@Globik2</a></div>
       </div>
       </section>
        <footer>
        <section>Сайт разработан искусственным интеллектом на базе ChatGPT от OpenAI.</section>
        <section><span>&#9400; 2024 - </span><span>${new Date().getFullYear()} Chatikon.ru</span></section>
        </footer>
        </main>
    <script src="/js/login.js"></script>
    <script src="/js/slot.js"></script>
     <script src="/js/soupi2.js"></script>
    </body>
    
    </html>`;
}

module.exports = { main_page }

function getTest(){
	let s=`<h2>Сводная таблица.</h2>

<table style="width:100%">
  <tr>
    <th>Комбинация</th>
    <th>Эмодзи</th>
    
  </tr>
  
  <tr>
    <td>777</td>
    <td>3 сердечка &#x1f496&#x1f496&#x1f496</td>
    </tr><tr>
    <td>666</td>
    <td>2 сердечка &#x1f496 &#x1f496</td></tr><tr>
    <td>Любые две одинаковые цифры(например, 055 или 550)</td>
    <td>1 сердечко &#x1f496</td>
    
  </tr>
</table>`;
return s;
}

function getProd(){
	return `
	<h3>Один прокрут - одно сердечко &#x1f496 сгорает</h3>
	<h2>Таблица выигрышей.</h2>

<table style="width:100%">
  <tr>
    <th>Комбинация</th>
    <th>Выигрыш</th>
    
  </tr>
  
  <tr>
    <td>777</td>
    <td>Сердечки х3</td>
    </tr><tr>
    <td>666</td>
    <td>Сердечки х2</td></tr><tr>
    <td>Любые две одинаковые цифры(например, 055 или 550)</td>
    <td>Бесплатный прокрут</td>
    
  </tr>
</table>`;
}
function getTxtArticle(){
	return `<header>Добро пожаловать в слот!</header>
    <p> Один прокрут - одно сердечко &#x1f496 сгорает. 
    В таблице представлены выигрышные комбинации и умножение количества сердечек.
     Последовательность прокрутов можно экспортировать в pdf файл.
     Сердечко &#x1f496 это внутрисайтовая валюта.
     Одно сердечко = 0.000011 <b>BTC</b>.
     Вознаграждения выплачиваются биткоинами на Ваш криптокошелек.
    Удачи!
    </p>`
}
