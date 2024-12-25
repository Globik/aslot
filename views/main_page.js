const main_page = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Слот машина - игра</title>
    <!-- <meta name="viewport" content="width=device-width,initial-scale=1.0"> -->
    <meta name="viewport" content="initial-scale=0.60, minimum-scale=0.60, maximum-scale=0.60">
    
    <meta name="description" content="Але, братан, а где поднять бабла? На чатикон! Крути бесплатно барабан и получай биткоины!" />
 
  <meta property="og:title" content="Игра слот машина чатикон" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="//chatikon.ru/" />
  <meta property="og:image" content="//chatikon.ru/img/home.jpg" />
  <meta property="og:site_name" content="Игра слот машина чатикон" />
  <meta property="og:description" content="Але, братан, а где поднять бабла? На чатикон! Крути бесплатно барабан и получай биткоины!" />
  
  <meta itemprop="name" content="Игра слот машина чатикон"/>
<meta itemprop="description" content="Але, братан, а где поднять бабла? На чатикон! Крути бесплатно барабан и получай биткоины!" />
<meta name="description" content="Але, братан, а где поднять бабла? На чатикон! Крути бесплатно барабан и получай биткоины!"/>
    
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
    </head><body>
  
    <main id="somemain"><nav class="vhod"><div><span id="onlinecount">0</span></div><div><a ${n.user?`onclick="logout(this);"`:''} href="${n.user?'#':'#login'}">${n.user?'Выход':'Вход'}</a></div></nav>
    ${n.user&&n.user.brole=='admin'?`<div><a style="font-size:2rem;" href="/dashboard">Админка</a></div>`:''}
    <header class="h"><h1 class="a">Сыграть в слот и выиграть 1 биткоин!</h1></header>
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
       <h2>Таблица выигрышей.</h2>

<table style="width:100%">
  <tr>
    <th>Комбинация</th>
    <th>Выигрыш</th>
    
  </tr>
  
  <tr>
    <td>777</td>
    <td>1 биткоин</td>
    </tr><tr>
    <td>666</td>
    <td>0,028786 биткоинов</td></tr><tr>
    <td>Любые две одинаковые цифры(например, 055 или 550)</td>
    <td>0,009595 биткоинов</td>
    
  </tr>
</table>
       </section>
       <section><header>На балансе <span id="btc">0</span> биткоинов.</header>
       <div><button onclick="vyvod(this);">Запросить выплату</button></div>
       </section>
       <section><header>Платежные реквизиты.</header>
       <form name="mybtcaddress"><h3>Мой биткоин адрес:</h3>
       <div id="btcdiv"><input id="btcinp" type="text" name="btcadr" required placeholder="биткоин адрес" /></div>
       <div><input type="reset" value="Сбросить" /><input type="submit" value="Сохранить" /></div>
       </form>
       </section>
       
       <a href="#."  class="overlay" id="login"></a>
    <output id="loginoutput" class="popi">
        <div class="modal-header">Авторизация / Регистрация'</div>
      
        <div class="modal-body">
          <div class="error-message" id="errormsg"></div>
         <form name="formlogin" id="myform">
            <label for="name" class="lb" style="margin-top: 5px;">Имя </label>
            <input  class="inp" name="username" type="text" placeholder="Введите" id="name" required minlength="2" maxlength="20">

            <label for="name" class="lb">Пароль</label>
            <input  class="inp" name="userpassword" type="password" autocomplete="on" placeholder="Введите пароль" id="password" required minlength="2" maxlength="20">
			 <button  class="login-button" id="btnlogin">Войти</button>
         <button class="register-button" id="btnregister">Зарегистрироваться</button>
          </form> </div>
    </output>
       
       
        <footer></footer>
        </main>
    <script src="/js/login.js"></script>
    <script src="/js/slot.js"></script>
    
    </body>
    
    </html>`;
}

module.exports = { main_page }
