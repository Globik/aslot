const main_page = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Машина</title>
    <!-- <meta name="viewport" content="width=device-width,initial-scale=1.0"> -->
    <meta name="viewport" content="initial-scale=0.60, minimum-scale=0.60, maximum-scale=0.60">
    
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
    
    <link rel="icon" href="/img/w4.png">
    <link href="/css/note.css" rel="stylesheet">
    <link href="/css/slot.css" rel="stylesheet">
    <link href="/css/tables.css" rel="stylesheet">
    <link href="/css/output.css" rel="stylesheet">
    <link href="/css/login3.css" rel="stylesheet"> 
    <style>
   
    </style>
    <script src="/js/wallet-address-validator.min.js"></script>
    <script src="/js/globalik.js"></script>
  <!--  <script src="/js/pdfmake.min.js"></script> -->
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    </head><body>
  
    <main id="somemain"><nav class="vhod"><div><span id="onlinecount">0</span></div><div><a ${n.user?`onclick="logout(this);"`:''} href="${n.user?'#':'#login'}">${n.user?'Выход':'Вход'}</a></div></nav>
    ${n.user&&n.user.brole=='admin'?`<div><a style="font-size:2rem;" href="/dashboard">Админка</a></div>`:''}
    <header class="h"><h1 class="a">Крути руль и собирай по дороге сердечки &#x1f496</h1></header>
    ${n.user?`<div style="font-size:2rem;">Добро пожаловать, ${n.user.bname}!</div>`:''}
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
       <!-- <input type="button" class="st" value="СДЕЛАТЬ СТАВКУ"> -->
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
      <!-- <button onclick="fuck();">fuck</button> -->
       <br><br>
       <section class="table">
       <h2>Сводная таблица.</h2>

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
</table>
       </section>
       <section><header>У Вас <span id="btc">0</span> сердечек &#x1f496.</header>
      <!-- <div><button onclick="vyvod(this);">Запросить выплату</button></div>
       </section>
       <section><header>Платежные реквизиты.</header>
       <form name="mybtcaddress"><h3>Мой биткоин адрес:</h3>
       <div id="btcdiv"><input id="btcinp" type="text" name="btcadr" required placeholder="биткоин адрес" /></div>
       <div><input type="reset" value="Сбросить" /><input type="submit" value="Сохранить" /></div>
       </form>
       </section>
       -->
       <a href="#."  class="overlay" id="login"></a>
    <output id="loginoutput" class="popi">
        <div class="modal-header">Авторизация / Регистрация'</div>
      
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
    <header>Добро пожаловать в машину!</header>
    <p> 
    Если Вам хочется расслабиться, то покрутите колесо. 
    В сводной таблице представлены нужные комбинации и их эквивалент в эмодзи. Собирайте сердечки
    и получайте положительные эмоции. Последовательность ходов можно экспортировать в pdf файл.
    Всем добра!
    </p>
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
       
        <footer>
        <section>Сайт разработан искусственным интеллектом от ChatGPT OpenAI.</section>
        <section><span>&#9400; 2024 - </span><span>${new Date().getFullYear()} Chatikon.ru</span></section>
        </footer>
        </main>
    <script src="/js/login.js"></script>
    <script src="/js/slot.js"></script>
    
    </body>
    
    </html>`;
}

module.exports = { main_page }
