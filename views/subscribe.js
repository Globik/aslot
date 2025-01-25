const subscribe = function(n){
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
    
    <link href="/css/output.css" rel="stylesheet">
    <link href="/css/login3.css" rel="stylesheet"> 
    <style>
   
    </style>
   
    <script src="/js/globalik.js"></script>
    <script src="/js/mediasoup-client.min.js"></script>
  
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    <script async src="https://yastatic.net/share2/share.js"></script>
     <script src="/pwabuilder-sw-register.js"></script>
    </head><body>
     <button id="start_video_button" onclick="startMedia();">Start Media</button>
  <button id="stop_video_button" onclick="stopMedia();">Stop Media</button>
  &nbsp;
  <button id="connect_button" onclick="connect();">Connect</button>
  <button id="disconnect_button" onclick="disconnect();">Disconnect</button>
  <div>
    local video<br />
    <video id="local_video" autoplay style="width: 120px; height: 90px; border: 1px solid black;"></video>
    <span id="state_span"></span>
  </div>
  remote video<br />
  <div id="remote_container"></div>
  <script src="/js/soup4.js"></script>
    </body></html>`;
}
module.exports = { subscribe}
