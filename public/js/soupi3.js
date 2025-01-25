 var loc1 = location.hostname + ":" + location.port;
var loc2 = location.hostname;
var loc3 = loc1 || loc2;
var new_uri;
const localVideo = document.getElementById('local_video');
  const remoteContainer = document.getElementById('remote_container');
  const stateSpan = document.getElementById('state_span');
  let localStream = null;
  let clientId = null;
  let device = null;
  let producerTransport = null;
  let videoProducer = null;
  let audioProducer = null;
  let consumerTransport = null;
  let videoConsumers = {};
  let audioConsumers = {};


var sock = null;
if (window.location.protocol === "https:") {
  new_uri = "wss:";
} else {
  new_uri = "ws:";
}
 function getSocket(){
	 
 
 if(!sock) sock = new  WebSocket(new_uri + "//" + loc3 + "/gesamt");
//return new Promise(function(res, rej){
  sock.onopen = function () {
	 console.log("websocket opened");
	//res();
	// heartbeat();
	// wsend({ type: "helloServer", VK: isVK.value, userId: gid("userId").value?gid("userId").value:'anonim3', isprem: Prem.value, nick: userName.value, logged:  Login()?"yes":"no", LANG: L });
  };
  sock.onerror = function (e) {
	  alert(e);
	 // rej(e);
   // note({ content: "Websocket error: " + e, type: "error", time: 5 });
  };
  sock.onclose=function(){
	//  alert('socket closed');
  }
   sock.onmessage = function (e) {
	      let a;
            try {
                a = JSON.parse(e.data);
               // res(a);
            } catch (er) {
               // reject(er);
            }
            //res(a);
        //   on_msg(a);
   }
//})
}
getSocket();
 function sendRequest(obj) {
    return new Promise((resolve, reject) => {
        obj.request = "mediasoup";
      
     
        sock.send(JSON.stringify(obj));
        sock.onmessage = function (e) {
            let a;
            try {
                a = JSON.parse(e.data);
            } catch (er) {
                reject(er);
            }
if (a.type == obj.type) {
                resolve(a);
            }else if(a.type=='newProducer'){
				console.log('here new producer');
				//resolve(a);
				 const remoteId = a.socketId;
        const prdId = a.producerId;
        const kind = a.kind;
        if (kind === 'video') {
          console.log('--try consumeAdd remoteId=' + remoteId + ', prdId=' + prdId + ', kind=' + kind);
        //  alert(consumerTransport);
          consumeAdd(consumerTransport, remoteId, prdId, kind);
        }
        else if (kind === 'audio') {
          //console.warn('-- audio NOT SUPPORTED YET. skip remoteId=' + remoteId + ', prdId=' + prdId + ', kind=' + kind);
          console.log('--try consumeAdd remoteId=' + remoteId + ', prdId=' + prdId + ', kind=' + kind);
          consumeAdd(consumerTransport, remoteId, prdId, kind);
     }
			}else if (a.type == "error") {
                reject(a.info);
            } else if(a.type=='welcome'){
               // on_msg(a);
                
		  console.warn("welcome");
		   clientId = a.yourid;
	  }else{}
        

    

}})}
var suka = false;
 async function on_msg(data){
	 // console.log('data ',data);
	  if(data.type == "howmuch"){
		 // onlinecount.textContent = data.value;
	  }else if(data.type == "welcome"){
		  console.warn("welcome");
		   clientId = data.yourid;
	  }else if(data.type =='newProducer'){
		// alert('new producer');
		if(!suka)return;
		//startMedia();
		 
		 //connect();
		// setTimeout(function(){
			// connect();
		   console.log('socket.io newProducer:', data);
		 // if(!suka) return;
		// alert('new producer');
       // console.log('socket.io newProducer:', data);
      // return;
        const remoteId = data.socketId;
        const prdId = data.producerId;
        const kind = data.kind;
        if (kind === 'video') {
          console.log('--try consumeAdd remoteId=' + remoteId + ', prdId=' + prdId + ', kind=' + kind);
        //  alert(consumerTransport);
          consumeAdd(consumerTransport, remoteId, prdId, kind);
        }
        else if (kind === 'audio') {
          //console.warn('-- audio NOT SUPPORTED YET. skip remoteId=' + remoteId + ', prdId=' + prdId + ', kind=' + kind);
          console.log('--try consumeAdd remoteId=' + remoteId + ', prdId=' + prdId + ', kind=' + kind);
          consumeAdd(consumerTransport, remoteId, prdId, kind);
     //   }},1000)
      }}else if(data.type == 'producerClosed'){
        console.log('socket.io producerClosed:', data);
        const localId = data.localId;
        const remoteId = data.remoteId;
        const kind = data.kind;
        console.log('--try removeConsumer remoteId=%s, localId=%s, track=%s', remoteId, localId, kind);
        removeConsumer(remoteId, kind);
        removeRemoteVideo(remoteId);
      } else{
		 // console.log("UNknown type ", data.type);
	  }
  }
  function wsend(obj){
	  let a;
	  try{
		  a = JSON.stringify(obj);
	  }catch(e){
		  console.log(e);
		  return
	  }
	  if(sock)sock.send(a);
  }
function stopLocalStream(stream) {
    let tracks = stream.getTracks();
    if (!tracks) {
      console.warn('NO tracks');
      return;
    }

    tracks.forEach(track => track.stop());
  }

  // return Promise
  function playVideo(element, stream) {
    if (element.srcObject) {
      console.warn('element ALREADY playing, so ignore');
      return;
    }
    element.srcObject = stream;
    element.volume = 0;
    return element.play();
  }

  function pauseVideo(element) {
    element.pause();
    element.srcObject = null;
  }

  function addRemoteTrack(id, track) {
    let video = findRemoteVideo(id);
    if (!video) {
      video = addRemoteVideo(id);
      video.controls = '1';
    }

    if (video.srcObject) {
      video.srcObject.addTrack(track);
      return;
    }

    const newStream = new MediaStream();
    newStream.addTrack(track);
    playVideo(video, newStream)
      .then(() => { video.volume = 1.0 })
      .catch(err => { console.error('media ERROR:', err) });
  }

  function addRemoteVideo(id) {
    let existElement = findRemoteVideo(id);
    if (existElement) {
      console.warn('remoteVideo element ALREADY exist for id=' + id);
      return existElement;
    }

    let element = document.createElement('video');
    remoteContainer.appendChild(element);
    element.id = 'remote_' + id;
    element.width = 240;
    element.height = 180;
    element.volume = 0;
    //element.controls = true;
    element.style = 'border: solid black 1px;';
    return element;
  }

  function findRemoteVideo(id) {
    let element = document.getElementById('remote_' + id);
    return element;
  }

  function removeRemoteVideo(id) {
    console.log(' ---- removeRemoteVideo() id=' + id);
    let element = document.getElementById('remote_' + id);
    if (element) {
      element.pause();
      element.srcObject = null;
      remoteContainer.removeChild(element);
    }
    else {
      console.log('child element NOT FOUND');
    }
  }

  function removeAllRemoteVideo() {
    while (remoteContainer.firstChild) {
      remoteContainer.firstChild.pause();
      remoteContainer.firstChild.srcObject = null;
      remoteContainer.removeChild(remoteContainer.firstChild);
    }
  }

  // ============ UI button ==========

  function checkUseVideo() {
   // const useVideo = document.getElementById('use_video').checked;
  //  return useVideo;
  }

  function checkUseAudio() {
  //  const useAudio = document.getElementById('use_audio').checked;
 //   return useAudio;
  }

  function startMedia() {
	//  alert(1);
    if (localStream) {
      console.warn('WARN: local media ALREADY started');
      return;
    }
//alert(2)
    const useVideo = true;//checkUseVideo();
    const useAudio = true;//checkUseAudio();

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
		  //alert(3);
        localStream = stream;
        
        localVideo.srcObject = stream;
          
           localVideo.volume = 0;
             localVideo.play();
        
        
        
       // playVideo(localVideo, stream);
        updateButtons();
      })
      .catch(err => {
        console.error('media ERROR:', err);
      });
  }

  function stopMedia() {
    if (localStream) {
      pauseVideo(localVideo);
      stopLocalStream(localStream);
      localStream = null;
    }
    updateButtons();
  }

  async function connect() {
	  suka = true;
    if (!localStream) {
      console.warn('WARN: local media NOT READY');
      return;
    }
  //  alert('connect');

    // --- connect socket.io ---
  //  await connectSocket().catch(err => {
    //  console.error(err);
      //return;
    //});
if(!sock){
	try{
  //getSocket()
 console.log('socket ok');
}catch(e){
	
	//console.error(e)
	//return
	}
    updateButtons();
}
    // --- get capabilities --
    //alert('send request');
    const data = await sendRequest({type: 'getRouterRtpCapabilities'});
   // alert('data');
    console.log('getRouterRtpCapabilities:', data);
    await loadDevice(data.capabilities);

    // --- get transport info ---
    console.log('--- createProducerTransport --');
    const params = await sendRequest({type: 'createProducerTransport'});
    console.log('transport params:', params.params);
    producerTransport = device.createSendTransport(params.params);
    console.log('createSendTransport:', producerTransport);

    // --- join & start publish --
    producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      console.log('--trasnport connect');
      sendRequest({type: 'connectProducerTransport', dtlsParameters: dtlsParameters })
        .then(callback)
        .catch(errback);
    });

    producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      console.log('--trasnport produce');
      try {
        const { id } = await sendRequest({type: 'produce', 
          transportId: producerTransport.id,
          kind,
          rtpParameters,
        });
        callback({ id });
        console.log('--produce requested, then subscribe ---');
       subscribe();
      } catch (err) {
        errback(err);
      }
    });

    producerTransport.on('connectionstatechange', (state) => {
      switch (state) {
        case 'connecting':
          console.log('publishing...');
          break;

        case 'connected':
       // alert('connected');
          console.log('published');
          break;

        case 'failed':
          console.log('failed');
          producerTransport.close();
          break;

        default:
          break;
      }
    });

    const useVideo = true;//checkUseVideo();
    const useAudio = true;//checkUseAudio();
   
   
   /*
    if (useVideo) {
      const videoTrack = localVideo.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        const trackParams = { track: videoTrack };
        try{
        videoProducer = await producerTransport.produce(trackParams);
	}catch(e){console.error(e);}
      }
    }
    
    */
    
      const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            const trackParams = {track: videoTrack};
            console.log(trackParams);
            try {
				//alert('videoproducer');
                videoProducer = await producerTransport.produce(trackParams);
            } catch (err) {
				console.error(err);
                note({content: err.toString(), type: "error", time: 5});
            }
        }
    
    
    
    
    
    
    
    
    
      const audioTrack = localVideo.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        const trackParams = { track: audioTrack };
        audioProducer = await producerTransport.produce(trackParams);
      }  
      
    /*  const videoTrack = localVideo.srcObject.getVideoTracks()[0];
        if (videoTrack) {
            const trackParams = {track: videoTrack};
            try {
				//alert('videoproducer');
                videoProducer = await producerTransport.produce(trackParams);
            } catch (err) {
				console.error(err);
                note({content: err.toString(), type: "error", time: 5});
            }
        }*/
    

    updateButtons();
  }
var me = true;
  async function subscribe() {
  //  if (!isSocketConnected()) {
    //  await connectSocket().catch(err => {
      //  console.error(err);
       // return;
      //});
 //alert('subscribe')
      // --- get capabilities --
     // alert(4);
     if(!device){
		//await getSocket();
	
     try{
		// alert('suka');
    //var data = await sendRequest({type:'getRouterRtpCapabilities'});//getRouterRtpCapabilities 'getRouterRtpCapabilities'
    //  alert('getRouterRtpCapabilities: '+ data);
  // await loadDevice(data.capabilities);
    
}catch(e){alert(e)}
    
}
//alert(3)
    // --- prepare transport ---
    console.log('--- createConsumerTransport --');
    if (!consumerTransport) {
		//alert('no consumer transport');
		//alert("NO consumer transport");
      const params = await sendRequest({type:'createConsumerTransport'});
     // alert('device '+device);
      console.log('transport params:', params);
      consumerTransport = device.createRecvTransport(params.params);
      console.log('createConsumerTransport:', consumerTransport);

      // --- join & start publish --
      consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
		//  alert('connect consumer transport');
        console.log('--consumer trasnport connect');
        sendRequest({type:'connectConsumerTransport', dtlsParameters: dtlsParameters })
          .then(callback)
          .catch(errback);
      });

      consumerTransport.on('connectionstatechange', (state) => {
        switch (state) {
          case 'connecting':
            console.log('subscribing...');
            break;

          case 'connected':
            console.log('subscribed');
            //consumeCurrentProducers(clientId);
            break;

          case 'failed':
            console.log('failed');
            producerTransport.close();
            break;

          default:
            break;
        }
      });

      consumeCurrentProducers(clientId);
    }
  }

  async function consumeCurrentProducers(clientId) {
    console.log('-- try consuleAll() --');
    const remoteInfo = await sendRequest({type:'getCurrentProducers',  localId: clientId })
      .catch(err => {
        console.error('getCurrentProducers ERROR:', err);
        return;
      });
    //console.log('remoteInfo.producerIds:', remoteInfo.producerIds);
    console.log('remoteInfo.remoteVideoIds:', remoteInfo.remoteVideoIds);
    console.log('remoteInfo.remoteAudioIds:', remoteInfo.remoteAudioIds);
    consumeAll(consumerTransport, remoteInfo.remoteVideoIds, remoteInfo.remoteAudioIds);
  }

  function disconnect() {
	  wsend({type: 'disconnect', request:'mediasoup'});
    if (localStream) {
      pauseVideo(localVideo);
      stopLocalStream(localStream);
      localStream = null;
    }
    if (videoProducer) {
      videoProducer.close(); // localStream will stop
      videoProducer = null;
    }
    if (audioProducer) {
      audioProducer.close(); // localStream will stop
      audioProducer = null;
    }
    if (producerTransport) {
      producerTransport.close(); // localStream will stop
      producerTransport = null;
    }

    for (const key in videoConsumers) {
      const consumer = videoConsumers[key];
      consumer.close();
      delete videoConsumers[key];
    }
    for (const key in audioConsumers) {
      const consumer = audioConsumers[key];
      consumer.close();
      delete audioConsumers[key];
    }

    if (consumerTransport) {
      consumerTransport.close();
      consumerTransport = null;
    }

    removeAllRemoteVideo();

   // disconnectSocket();
    updateButtons();
  }

  async function loadDevice(routerRtpCapabilities) {
    try {
		//alert('load device before');
     // device = new MediasoupClient.Device();
       device = new window.mediasoup.Device();
    } catch (error) {
		console.log(error);
	//	alert('error');
      if (error.name === 'UnsupportedError') {
        console.error('browser not supported');
      }
    }
    await device.load({ routerRtpCapabilities });
  }

  /*--
  async function consume(transport) {
    console.log('--start of consume --');
    const { rtpCapabilities } = device;
    //const data = await socket.request('consume', { rtpCapabilities });
    const data = await sendRequest('consume', { rtpCapabilities })
      .catch(err => {
        console.error('consume ERROR:', err);
      });
    const {
      producerId,
      id,
      kind,
      rtpParameters,
    } = data;

    let codecOptions = {};
    const consumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      codecOptions,
    });
    //const stream = new MediaStream();
    //stream.addTrack(consumer.track);

    addRemoteTrack(clientId, consumer.track);

    console.log('--end of consume');
    //return stream;
  }
  --*/

  function consumeAll(transport, remoteVideoIds, remotAudioIds) {
    console.log('----- consumeAll() -----')
    remoteVideoIds.forEach(rId => {
      consumeAdd(transport, rId, null, 'video');
    });
    remotAudioIds.forEach(rId => {
      consumeAdd(transport, rId, null, 'audio');
    });
  };

  async function consumeAdd(transport, remoteSocketId, prdId, trackKind) {
    console.log('--start of consumeAdd -- kind=%s', trackKind);
   // alert('transport ' + transport);
   console.log('device ', device);
   if(!device){
	   return;
	  // var data2 = await sendRequest({type:'getRouterRtpCapabilities'});//getRouterRtpCapabilities 'getRouterRtpCapabilities'
    //  alert('getRouterRtpCapabilities: '+ data);
   //  await loadDevice(data2.capabilities);
   }
    const { rtpCapabilities } = device;
    //const data = await socket.request('consume', { rtpCapabilities });
    const data = await sendRequest({type:'consumeAdd', rtpCapabilities: rtpCapabilities, remoteId: remoteSocketId, kind: trackKind })
      .catch(err => {
        console.error('consumeAdd ERROR:', err);
      });
      console.warn('data', data);
    const {
      producerId,
      id,
      kind,
      rtpParameters,
    } = data.params;
    if (prdId && (prdId !== producerId)) {
      console.warn('producerID NOT MATCH');
      //return
    }

    let codecOptions = {};
    const consumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      codecOptions,
    });
    //const stream = new MediaStream();
    //stream.addTrack(consumer.track);

    addRemoteTrack(remoteSocketId, consumer.track);
    addConsumer(remoteSocketId, consumer, kind);
    consumer.remoteId = remoteSocketId;
    consumer.on("transportclose", () => {
      console.log('--consumer transport closed. remoteId=' + consumer.remoteId);
      //consumer.close();
      //removeConsumer(remoteId);
      //removeRemoteVideo(consumer.remoteId);
    });
    consumer.on("producerclose", () => {
      console.log('--consumer producer closed. remoteId=' + consumer.remoteId);
      consumer.close();
      removeConsumer(remoteId, kind);
      removeRemoteVideo(consumer.remoteId);
    });
    consumer.on('trackended', () => {
      console.log('--consumer trackended. remoteId=' + consumer.remoteId);
      //consumer.close();
      //removeConsumer(remoteId);
      //removeRemoteVideo(consumer.remoteId);
    });

    console.log('--end of consumeAdd');
    //return stream;

    if (kind === 'video') {
      console.log('--try resumeAdd --');
      sendRequest({type:'resumeAdd', remoteId: remoteSocketId, kind: kind })
        .then(() => {
          console.log('resumeAdd OK');
        })
        .catch(err => {
          console.error('resumeAdd ERROR:', err);
        });
    }
  }


  function getConsumer(id, kind) {
    if (kind === 'video') {
      return videoConsumers[id];
    }
    else if (kind === 'audio') {
      return audioConsumers[id];
    }
    else {
      console.warn('UNKNOWN consumer kind=' + kind);
    }
  }

  function addConsumer(id, consumer, kind) {
    if (kind === 'video') {
      videoConsumers[id] = consumer;
      console.log('videoConsumers count=' + Object.keys(videoConsumers).length);
    }
    else if (kind === 'audio') {
      audioConsumers[id] = consumer;
      console.log('audioConsumers count=' + Object.keys(audioConsumers).length);
    }
    else {
      console.warn('UNKNOWN consumer kind=' + kind);
    }
  }

  function removeConsumer(id, kind) {
    if (kind === 'video') {
      delete videoConsumers[id];
      console.log('videoConsumers count=' + Object.keys(videoConsumers).length);
    }
    else if (kind === 'audio') {
      delete audioConsumers[id];
      console.log('audioConsumers count=' + Object.keys(audioConsumers).length);
    }
    else {
      console.warn('UNKNOWN consumer kind=' + kind);
    }
  }

  // ---- UI control ----
  function updateButtons() {
    if (localStream) {
      disableElement('start_video_button');
      disableElement('use_video');
      disableElement('use_audio');
      if (sock==true) {
        disableElement('stop_video_button');
        disableElement('connect_button');
        enabelElement('disconnect_button');
      }
      else {
        enabelElement('stop_video_button');
        enabelElement('connect_button');
       // disableElement('disconnect_button');
      }
    }
    else {
      enabelElement('start_video_button');
      enabelElement('use_video');
      enabelElement('use_audio');
      disableElement('stop_video_button');
      disableElement('connect_button');
      enabelElement('disconnect_button');
    }
  }

  function enabelElement(id) {
    let element = document.getElementById(id);
    if (element) {
      element.removeAttribute('disabled');
    }
  }

  function disableElement(id) {
    let element = document.getElementById(id);
    if (element) {
      element.setAttribute('disabled', '1');
    }
  }

  updateButtons();
  console.log('=== ready ==='); 
