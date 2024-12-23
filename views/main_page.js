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
    <link href="/css/slot.css" rel="stylesheet">
    <link href="/css/tables.css" rel="stylesheet">
    <style>
   
    </style>
    <script src="/js/globalik.js"></script>
  <!--  <script src="/js/pdfmake.min.js"></script> -->
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    </head><body>
    <!-- hello world 
    <form name="loginform" method="post" action="/login">
    <input type="text" placeholder="your name" required name="username"/><br>
    <input type="password" name="password" required placeholder="your password"/><br>
    <input type="submit" value="login"/>
    </form> -->
    <main id="somemain"><nav></nav>
    <header class="h"><h1 class="a">Сыграть в слот и выиграть 1 биткоин!</h1></header>
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
       <section><header>На балансе <span id="btc">0</span> биткоинов.</header></section>
        <footer></footer>
        </main>
    <script src="/js/login.js"></script>
    <script src="/js/slot.js"></script>
    
    </body>
    
    </html>`;
}

module.exports = { main_page }
