const main_page = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Слот машина - игра</title>
    <!-- <meta name="viewport" content="width=device-width,initial-scale=1.0"> -->
    <meta name="viewport" content="initial-scale=0.60, minimum-scale=0.60, maximum-scale=0.60">
    <link rel="icon" href="/img/w4.png">
    <link href="/css/slot.css" rel="stylesheet">
    <script src="/js/globalik.js"></script>
    </head><body>
    <!-- hello world 
    <form name="loginform" method="post" action="/login">
    <input type="text" placeholder="your name" required name="username"/><br>
    <input type="password" name="password" required placeholder="your password"/><br>
    <input type="submit" value="login"/>
    </form> -->
    <main><nav></nav>
    <article class="slot">
    <section id="hauptcontainer">
    <aside id="slotinfo">
    <div id="stagecontainer">
    <div id="stage">
            <div id="ring-1" class="ring"></div>
            <div id="ring-2" class="ring"></div>
            <div id="ring-3" class="ring"></div>
        </div>
        </div>
        <footer id="foot">
        <input type="button" class="startSpinn" value="Start">
        </footer>
        </aside>
        <aside id="boxinfo"></aside>
        </section>
       </article>
        <footer></footer>
        </main>
    <script src="/js/login.js"></script>
    <script src="/js/slot.js"></script>
    </body>
    
    </html>`;
}

module.exports = { main_page }
