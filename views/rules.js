const { footer } = require('./footer.js');
const { login } = require('./login.js');
const { yametrika } = require('./yametrika.js');
const { pravila } = require('./pravila.js');

const rules = function(n){
	let { a } = n;
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Правила</title>
   <meta name="viewport" content="width=device-width,initial-scale=1.0"> 
    
    <link rel="icon" type="image/png" href="/img3/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/img3/favicon.svg" />
<link rel="shortcut icon" href="/img3/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/img3/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="Chatikon" />
    <meta name="description" content="Правила пользования групповым видеочатом" />
  <meta property="og:title" content="Правила" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chatikon.ru/" />
  <meta property="og:image" content="https://chatikon.ru/img/home.jpg" />
  <meta property="og:site_name" content="Правила" />
  <meta property="og:description" content="Правила пользования групповым видеочатом" />
  
  <meta itemprop="name" content="Правила"/>
<meta itemprop="description" content="Правила пользования групповым видеочатом" />
<meta name="description" content="Правила пользования групповым видеочатом"/>
    
    <!-- <link rel="icon" href="/img/w4.png"> -->
     <link href="/css/slot2.css" rel="stylesheet">
     <link href="/css/slug.css" rel="stylesheet">
    <link href="/css/note.css" rel="stylesheet">
    
    <link href="/css/output.css" rel="stylesheet">
    <link href="/css/login3.css" rel="stylesheet"> 
    
    <script src="/js/globalik.js"></script>
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    <script async src="https://yastatic.net/share2/share.js"></script>
    ${yametrika({})}
    </head><body> <main id="somemain"><nav class="vhod">
    <div><a ${n.user?`onclick="logout(this);"`:''} href="${n.user?'#':'#login'}">${n.user?'Выход':'Вход'}</a></div>
    </nav><a href="/">На главную</a>
   ${pravila({})}
    </main>${login({})}${footer({})}</body></html>`;
}
module.exports = { rules }
