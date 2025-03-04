const { yametrika } = require('./yametrika');
const { login } = require('./login.js');
const { footer } = require('./footer.js'); 

const blog = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Блог</title>
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
    
  
    
    
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    <!-- <script async src="https://yastatic.net/share2/share.js"></script> -->
    
     ${yametrika({})}
    </head><body> <main id="somemain"><nav class="vhod">
     <div><a ${n.user?`onclick="logout(this);"`:''} href="${n.user?'#':'#login'}">${n.user?'Выход':'Вход'}</a></div>
    </nav><a href="/" style="padding-left:10px;font-size:1rem;">На главную</a> 
    <section id="articlesArea">${n.a?get_articles(n.a):'<b>Нет пока статей.</b>'}</section>
      ${login({ })}
      
</main><script src="/js/login.js"></script><script src="/js/wallet.js"></script>
    ${footer({})} </body></html>`;
}
module.exports = { blog }
function get_articles(arr){
	let s = '';
	arr.forEach(function(el, i){
		s+=`<article><h2>${el.name}</h2><br><br>
		<p>${el.txt.substring(0,400)}...</p><p><a href="/blog/${el.slug}">Читать дальше</a></p></article><hr>`;
	});
	return s;
}
