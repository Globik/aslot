const main_page2 = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Машина</title>
   <meta name="viewport" content="width=device-width,initial-scale=1.0"> 
    
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
     <link href="/css/slot.css" rel="stylesheet">
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
   <section id="localcamContaiiner"><header>Local cam</header>
   <video id="localVideo" muted ></video>
   </section>
<div id="local-control">
  <div id="join-control">
    <button id="join-button" onclick="joinRoom()">
      join room
    </button>
    <span class="arrow"> &#x21E2; </span>
  </div>

  <div id="camera-control">
    <button id="send-camera" onclick="sendCameraStreams()">
      send camera streams
    </button>
    <button id="stop-streams" onclick="stopStreams()">
      stop streams
    </button>
    <span id="camera-info"></span>
    <button id="share-screen" onclick="startScreenshare()">
      share screen
    </button>
    <div id="outgoing-cam-streams-ctrl">
      <div><input id="local-cam-checkbox" type="checkbox" checked
                  onchange="changeCamPaused()"></input>
           <label id="local-cam-label">camera</label>
        <span id="camera-producer-stats" class="track-ctrl"></span>
      </div>
      <div><input id="local-mic-checkbox" type="checkbox" checked
                  onchange="changeMicPaused()"></input>
           <label id="local-mic-label">mic</label></div>
      <div id="local-screen-pause-ctrl">
           <input id="local-screen-checkbox" type="checkbox" checked
                  onchange="changeScreenPaused()"></input>
           <label id="local-screen-label">screen</label>
           <span id="screen-producer-stats" class="track-ctrl"></span>
      </div>      
      <div id="local-screen-audio-pause-ctrl">
           <input id="local-screen-audio-checkbox" type="checkbox" checked
                  onchange="changeScreenAudioPaused()"></input>
           <label id="local-screen-audio-label">screen audio</label>
           <span id="screen-audio-producer-stats" class="track-ctrl"></span>
      </div>
    </div>
  </div>

  <button id="leave-room" onclick="leaveRoom()">
    leave room
  </button>

</div>

<div id="available-tracks">
</div>

<div id="remote-video">
</div>

<div id="remote-audio">
</div>

  <script src="/js/soup4.js"></script>
    </body></html>`;
}
module.exports = { main_page2 }
