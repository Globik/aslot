const { login } = require('./login.js');
const { footer } = require('./footer.js');
const { yametrika } = require('./yametrika.js');

const main_page2 = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Видеочат</title>
   <meta name="viewport" content="width=device-width,initial-scale=1.0"> 
    
 <!--   <link rel="icon" type="image/png" href="/img3/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/img3/favicon.svg" />
<link rel="shortcut icon" href="/img3/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/img3/apple-touch-icon.png" /> -->
<meta name="apple-mobile-web-app-title" content="Chatikon" />
<link rel="manifest" href="/img3/site.webmanifest" />
    
    
    
    <meta name="description" content="Групповой видеочат на десятерых" />
 
  <meta property="og:title" content="Групповой видеочат" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chatikon.ru/" />
  <meta property="og:image" content="https://chatikon.ru/img/chatikon.png" />
  <meta property="og:site_name" content="Групповой видеочат" />
  <meta property="og:description" content="Групповой видеочат на десятерых" />
  
  <meta itemprop="name" content="Групповой видеочат"/>
<meta itemprop="description" content="Групповой видеочат на десятерых" />
<meta name="description" content="Групповой видеочат на десятерых"/>
    
     <link rel="icon" href="/img/favicon.png"> 
     <link href="/css/slot2.css" rel="stylesheet">
    <link href="/css/note.css" rel="stylesheet">
    
    <link href="/css/output.css" rel="stylesheet">
    <link href="/css/login3.css" rel="stylesheet"> 
    
    <script src="/js/globalik.js"></script>
    <script src="/js/mediasoup-client.min.js"></script>
  
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    <script async src="https://yastatic.net/share2/share.js"></script>
     <script src="/pwabuilder-sw-register.js"></script>
     ${yametrika({})}
    </head><body> <main id="somemain"><nav class="vhod">
    <b>online: </b><span id="onlineCount">0</span> <span>|</span> <b>Спикеров: </b><span id="totalSpeakers">0</span> <span>|</span> <b>Подписчиков: </b><span id="consumerCount">0</span>
    <div><a ${n.user?`onclick="logout(this);"`:''} href="${n.user?'#':'#login'}">${n.user?'Выход':'Вход'}</a></div>
    </nav>
    <a href="/wallet" style="padding-left:10px;font-size:1rem;">Криптокошелек</a>
    <div class="btns">
    <header>Пoкер-рум</header>
    <button id="send-camera" disabled="true" data-state="start" onclick="sendCameraStreams(this)">
      Войти в чат
    </button>
     <button id="join-button" onclick="joinRoom()" disabled="true" data-state="start">
      Подписаться
    </button>
  </div>
 
   <div id="remote-video"></div><hr>
 <article>
 <h1>${n.articles.name}</h1>
${n.articles.txt}
</article>

</main>
${login({})}
  <script src="/js/soup4.js"></script>
  ${footer({})}
    </body></html>`;
}
module.exports = { main_page2 }

