const main_page = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Слот машина - игра</title>
    <!-- <meta name="viewport" content="width=device-width,initial-scale=1.0"> -->
    <meta name="viewport" content="initial-scale=0.60, minimum-scale=0.60, maximum-scale=0.60">
    
    <meta name="description" content="Але, братан, а где поднять бабла? На чатикон три топора! Крути барабан и выигрывай сто миллиардов рублей!" />
 
  <meta property="og:title" content="Игра слот машина чатикон" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="//chatikon.ru/" />
  <meta property="og:image" content="//chatikon.ru/img/home.jpg" />
  <meta property="og:site_name" content="Игра слот машина чатикон" />
  <meta property="og:description" content="Але, братан, а где поднять бабла? На чатикон три топора! Крути барабан и выигрывай сто миллиардов рублей!" />
  
  <meta itemprop="name" content="Игра слот машина чатикон"/>
<meta itemprop="description" content="Але, братан, а где поднять бабла? На чатикон три топора! Крути барабан и выигрывай сто миллиардов рублей!" />
<meta name="description" content="Але, братан, а где поднять бабла? На чатикон три топора! Крути барабан и выигрывай сто миллиардов рублей!"/>
    
    <link rel="icon" href="/img/w4.png">
    <link href="/css/slot.css" rel="stylesheet">
    <link href="/css/tables.css" rel="stylesheet">
    <style>
   
    </style>
    <script src="/js/globalik.js"></script>
    </head><body>
    <!-- hello world 
    <form name="loginform" method="post" action="/login">
    <input type="text" placeholder="your name" required name="username"/><br>
    <input type="password" name="password" required placeholder="your password"/><br>
    <input type="submit" value="login"/>
    </form> -->
    <main><nav></nav>
    <header><H1 class="a">Сыграть в слот и выиграть 100 000 000 000 рублей!<?h1></header>
    <article class="slot">
    <section id="hauptcontainer">
    <aside id="slotinfo">
    <div id="stagecontainer"><div id="proem"></div>
    <div id="stage">
            <div id="ring-1" class="ring"></div>
            <div id="ring-2" class="ring"></div>
            <div id="ring-3" class="ring"></div>
        </div>
        </div>
        <footer id="foot">
        <input type="button" class="st" value="СДЕЛАТЬ СТАВКУ">
        <input type="button" class="startSpinn" value="КРУТИТЬ">
        </footer>
        </aside>
        <aside id="boxinfo"><footer id="pdf">
        <input type="button" class="startpdf" value="PDF">
        </footer></aside>
        </section>
       </article>
       <section>
       <h2>Таблица выигрышей.</h2>

<table style="width:100%">
  <tr>
    <th>Комбинация</th>
    <th>Выигрыш</th>
    
  </tr>
  
  <tr>
    <td>777</td>
    <td>100 000 000 000 рублей</td>
    </tr><tr>
    <td>666</td>
    <td>100 000 биткоинов</td></tr><tr>
    <td>Любые две одинаковые цифры(например, 055 или 550)</td>
    <td>100 биткоинов</td>
    
  </tr>
</table>
       </section>
        <footer></footer>
        </main>
    <script src="/js/login.js"></script>
    <script src="/js/slot.js"></script>
    </body>
    
    </html>`;
}

module.exports = { main_page }
