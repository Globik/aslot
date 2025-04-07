const { login } = require('./login.js');
const { wallet_v } = require('./wallet_v.js');
const { yametrika } = require('./yametrika.js');

const wallet2 = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Wallet</title>
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
    
    <link href="/css/note.css" rel="stylesheet">
    
    <link href="/css/output.css" rel="stylesheet">
    <link href="/css/login3.css" rel="stylesheet"> 
     <link href="/css/wallet.css" rel="stylesheet">
    <script src="/js/globalik.js"></script>
    
  
    
  <!--  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script> -->
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    <script async src="https://yastatic.net/share2/share.js"></script>
    ${n.user?'<script src="/js/wallet-address-validator.min.js"></script>':''}
    <!-- <script src="/pwabuilder-sw-register.js"></script> -->
     ${process.env.DEVELOPMENT=='yes'?'':yametrika({})}
    </head><body> <main id="somemain">
    <nav class="vhod">
     <div id="settings" class="ita" onclick="panelOpen(this);"><img class="setimg" src="/img/set2.svg"></div>
     <div id="settingspanel">
     ${n.user?'<div class="settingspanel" ><a href="#" onclick="logout(this);">Выход</a></div>':``}
     </div>
    </nav><!-- <a href="/" style="padding-left:10px;font-size:1rem;">Назад</a> -->
    <input type="hidden" id="userId" value="${n.user?n.user.id:'0'}" />
	<input type="hidden" id="userName" value="${n.user?n.user.bname:null}" />
    <section id="contentContainer" class="${n.user?'wallet-flex':''}">
      ${n.user?wallet_v(n):login({ ohne: true })}
      </section>
</main><script src="/js/login.js"></script>${n.user?'<script src="/js/wallet.js"></script>':''}
    </body></html>`;
}
module.exports = { wallet2 }
