
var videoInput1, videoInput2;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const localVideo = gid('localVideo');

var kK = 0;
const myPeerId = uuidv4();
var isSocketOpened = false;
let device,
           joined,
           localCam,
           localScreen,
           recvTransport,
           sendTransport,
           camVideoProducer,
           camAudioProducer,
           screenVideoProducer,
           screenAudioProducer,
           currentActiveSpeaker = {},
           lastPollSyncData = {},
           consumers = [];

//
// entry point -- called by document.body.onload
//

 async function main() {
  console.log(`starting up ... my peerId is ${myPeerId}`);
  try {
    device = new window.mediasoup.Device();//new mediasoup.Device();
   device.observer.on('newtransport', function(t){
	//	alert('transport');
		t.observer.on('newproducer', function(p){
			//alert('new producer '+p.appData.mediaTag+' '+p.appData.peerId+' '+p.id);
			
			
			
			setTimeout(function(){

			if(camVideoProducer){
					//alert('my peerId: '+ myPeerId+' mediTag '+camVideoProducer.appData.mediaTag+' producerId: '+camVideoProducer.id);
					wsend({ 
						type: 'Newproducer', 
						request: 'mediasoup',
						 mediaTag: camVideoProducer.appData.mediaTag, 
						 peerId: myPeerId ,
						 id: camVideoProducer.id
						 });
			}else{
				alert('cavideoProducer '+camVideoProducer);
			}
	},100);
		setTimeout(function(){
			if(camAudioProducer){
			//	alert('my peerId: '+ myPeerId+' mediTag '+camAudioProducer.appData.mediaTag+' producerId: '+camAudioProducer.id);
			wsend({
			type: 'Newproducer', 
						request: 'mediasoup',
						 mediaTag: camAudioProducer.appData.mediaTag, 
						 peerId: myPeerId,
						 id: camAudioProducer.id 		
			});
			}else{
				alert('camAudioProducer '+camAudioProducer);
			}
	},101);
			
		
			
			
			
			
			
		});
	});
  } catch (e) {
    if (e.name === 'UnsupportedError') {
      console.error('browser not supported for video calls');
      return;
    } else {
      console.error(e);
    }
  }

  // use sendBeacon to tell the server we're disconnecting when
  // the page unloads
//  window.addEventListener('unload', () => sig('leave', {}, true));
}
main()
//
// meeting control actions
//

var loc1 = location.hostname + ":" + location.port;
var loc2 = location.hostname;
var loc3 = loc1 || loc2;
var new_uri;
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
	// alert('open');
	isSocketOpened  = true;
joinRoom()
  };
  sock.onerror = function (e) {
	  console.error(e);
  };
  sock.onclose=function(){
	console.log('websocket closed');
	isSocketOpened  = false;
  }
   sock.addEventListener('message',function (e) {
	      let a;
            try {
                a = JSON.parse(e.data);
              
            } catch (er) {
               // reject(er);
               console.error(er);
               return;
            }
            //res(a);
           on_msg(a);
   },false)

}
getSocket();
async function on_msg(a){
	console.log('msg type ', a.type);
	if(a.type == 'ok'){
		alert('a  '+ a);
		//pollAndUpdate(a);
	}else if(a.type == "Newproducer"){
	//pollAndUpdate();
	if(a.mediaTag=='video'){
		//setTimeout(async ()=>{	
			//await 
			subscribeToTrack(a.peerId, a.mediaTag) 
		//	},1000)
		}
	else{
		//setTimeout(async ()=>{
			//await 
			subscribeToTrack(a.peerId, a.mediaTag)
			//}, 100) 
	 }
	}else if(a.type == 'oksync'){
		pollAndUpdate();
	}else{console.log("unknown type ", a.type);}

	
}
 function sendRequest(obj) {
    return new Promise((resolve, reject) => {
        obj.request = "mediasoup";
        obj.peerId = myPeerId; 
     
     
        sock.send(JSON.stringify(obj));
        sock.onmessage = async function (e) {
			
            let a;
           // console.log('a ', a);
            try {
                a = JSON.parse(e.data);
            } catch (er) {
                reject(er);
                
            }
          
			console.log('B ', a);
		
			if (a.type == obj.type) {
				console.log("d ", a.type," = ", obj.type);
                resolve(a);
            }else if (a.type == "error") {
                reject(a.info);
            }else if(a.type == "simulcast"){
			console.log(e.data);
				resolve(a);
			}else if(a.type =='simple'){
				resolve(a);
			}
			else{
				console.log(a.type);
				
				}
			}
        

    });

}




async function joinRoom() {
  if (joined) {
    return;
  }

  console.log('join room');
  //$('#join-control').style.display = 'none';

  try {
    // signal that we're a new peer and initialize our
    // mediasoup-client device, if this is our first time connecting
    let { routerRtpCapabilities } = await sendRequest({type:'join-as-new-peer'});
    if (!device.loaded) {
      await device.load({ routerRtpCapabilities });
    }
    joined = true;
   // $('#leave-room').style.display = 'initial';
  } catch (e) {
    console.error(e);
    return;
  }

}

async function sendCameraStreams() {
  console.log('send camera streams');
  $('#send-camera').style.display = 'none';

  // make sure we've joined the room and started our camera. these
  // functions don't do anything if they've already been called this
  // session
  await joinRoom();
  await startCamera();

  // create a transport for outgoing media, if we don't already have one
  if (!sendTransport) {
	 // alert('send transport');
    sendTransport = await createTransport('send');
  }

  // start sending video. the transport logic will initiate a
  // signaling conversation with the server to set up an outbound rtp
  // stream for the camera video track. our createTransport() function
  // includes logic to tell the server to start the stream in a paused
  // state, if the checkbox in our UI is unchecked. so as soon as we
  // have a client-side camVideoProducer object, we need to set it to
  // paused as appropriate, too.
  camVideoProducer = await sendTransport.produce({
    track: localCam.getVideoTracks()[0],
    encodings: camEncodings(),
    appData: { mediaTag: 'cam-video' }
  });
  /*
  	if(camVideoProducer){
					//alert('my peerId: '+ myPeerId+' mediTag '+camVideoProducer.appData.mediaTag+' producerId: '+camVideoProducer.id);
					wsend({ 
						type: 'Newproducer', 
						request: 'mediasoup',
						 mediaTag: camVideoProducer.appData.mediaTag, 
						 peerId: myPeerId ,
						 id: camVideoProducer.id
						 });
			}else{
				alert('cavideoProducer '+camVideoProducer);
			}
  */
  
  if (getCamPausedState()) {
    try {
      await camVideoProducer.pause();
    } catch (e) {
      console.error(e);
    }
  }

  // same thing for audio, but we can use our already-created
  camAudioProducer = await sendTransport.produce({
    track: localCam.getAudioTracks()[0],
    appData: { mediaTag: 'cam-audio' }
  });
  if (getMicPausedState()) {
    try {
      camAudioProducer.pause();
    } catch (e) {
      console.error(e);
    }
  }
  
  /*
  
setTimeout(function(){

			if(camVideoProducer){
					//alert('my peerId: '+ myPeerId+' mediTag '+camVideoProducer.appData.mediaTag+' producerId: '+camVideoProducer.id);
					wsend({ 
						type: 'Newproducer', 
						request: 'mediasoup',
						 mediaTag: camVideoProducer.appData.mediaTag, 
						 peerId: myPeerId ,
						 id: camVideoProducer.id
						 });
			}else{
				alert('cavideoProducer '+camVideoProducer);
			}
			},6);
			setTimeout(function(){
			if(camAudioProducer){
			//	alert('my peerId: '+ myPeerId+' mediTag '+camAudioProducer.appData.mediaTag+' producerId: '+camAudioProducer.id);
			wsend({
			type: 'Newproducer', 
						request: 'mediasoup',
						 mediaTag: camAudioProducer.appData.mediaTag, 
						 peerId: myPeerId,
						 id: camAudioProducer.id 		
			});
			}else{
				alert('camAudioProducer '+camAudioProducer);
			}
		},2);
	*/
  $('#stop-streams').style.display = 'initial';
  showCameraInfo();
}

async function startScreenshare() {
  console.log('start screen share');
  $('#share-screen').style.display = 'none';

  // make sure we've joined the room and that we have a sending
  // transport
  await joinRoom();
  if (!sendTransport) {
    sendTransport = await createTransport('send');
  }

  // get a screen share track
  localScreen = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  });

  // create a producer for video
  screenVideoProducer = await sendTransport.produce({
    track: localScreen.getVideoTracks()[0],
    encodings: screenshareEncodings(),
    appData: { mediaTag: 'screen-video' }
  });

  // create a producer for audio, if we have it
  if (localScreen.getAudioTracks().length) {
    screenAudioProducer = await sendTransport.produce({
      track: localScreen.getAudioTracks()[0],
      appData: { mediaTag: 'screen-audio' }
    });
  }

  // handler for screen share stopped event (triggered by the
  // browser's built-in screen sharing ui)
  screenVideoProducer.track.onended = async () => {
    console.log('screen share stopped');
    try {
      await screenVideoProducer.pause();
      let { error } = await sendRequest({type: 'close-producer',
                                producerId: screenVideoProducer.id });
      await screenVideoProducer.close();
      screenVideoProducer = null;
      if (error) {
        err(error);
      }
      if (screenAudioProducer) {
        let { error } = await sendRequest({type: 'close-producer',
                                  producerId: screenAudioProducer.id });
        await screenAudioProducer.close();
        screenAudioProducer = null;
        if (error) {
          err(error);
        }
      }
    } catch (e) {
      console.error(e);
    }
    $('#local-screen-pause-ctrl').style.display = 'none';
    $('#local-screen-audio-pause-ctrl').style.display = 'none';
    $('#share-screen').style.display = 'initial';
  }

  $('#local-screen-pause-ctrl').style.display = 'block';
  if (screenAudioProducer) {
    $('#local-screen-audio-pause-ctrl').style.display = 'block';
  }
}

 async function startCamera() {
  if (localCam) {
    return;
  }
  console.log('start camera');
  try {
    localCam = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    localVideo.srcObject = localCam;
    localVideo.volume = 0;
     localVideo.play();
  } catch (e) {
    console.error('start camera error', e);
  }
}

// switch to sending video from the "next" camera device in our device
// list (if we have multiple cameras)
var curd = undefined;
async function cycleCamera(el) {
  if (!(camVideoProducer && camVideoProducer.track)) {
    alert('cannot cycle camera - no current camera track');
    return;
  }
 
	
 // alert('cycle camera');
try{
	camVideoProducer.track.stop();
  // find "next" device in device list
  let deviceId = await getCurrentDeviceId(),
      allDevices = await navigator.mediaDevices.enumerateDevices(),
      vidDevices = allDevices.filter((d) => d.kind === 'videoinput');
  if (!vidDevices.length > 1) {
    alert('cannot cycle camera - only one camera');
    return;
  }
  let idx = vidDevices.findIndex((d) => d.deviceId === deviceId);
  if (idx === (vidDevices.length-1)) {
    idx = 0;
  } else {
    idx += 1;
  }


	var dura;

	if(curd !== videoInput2){
		//alert('back 1  cam '+videoInput2);
	
	curd = videoInput2
	dura = videoInput2;
}else{
	//alert('front 2  cam '+videoInput1);
	
	dura = videoInput1;
	curd = dura;
}

		let constraints = {
			audio:{
      echoCancellation: {exact: true}
    }, 
    video:{deviceId: dura ? {exact: dura} : undefined}
    };





  // get a new video stream. might as well get a new audio stream too,
  // just in case browsers want to group audio/video streams together
  // from the same device when possible (though they don't seem to,
  // currently)
 // alert('getting a video stream from new device '+ vidDevices[idx].label);
  localCam = await navigator.mediaDevices.getUserMedia(
  constraints
  /*{
    video: { deviceId: { exact: vidDevices[idx].deviceId } },
    audio: true
  }*/
  );

  // replace the tracks we are sending
  localVideo.srcObject = localCam;
  localVideo.volume = 0;
  localVideo.play();
  await camVideoProducer.replaceTrack({ track: localCam.getVideoTracks()[0] });
 // await camAudioProducer.replaceTrack({ track: localCam.getAudioTracks()[0] });

  // update the user interface
  showCameraInfo();
}catch(err){
	alert(err);
}
}

 async function stopStreams() {
  if (!(localCam || localScreen)) {
    return;
  }
  if (!sendTransport) {
    return;
  }

  console.log('stop sending media streams');
  $('#stop-streams').style.display = 'none';

  let { error } = await sendRequest({ type: 'close-transport',
                            transportId: sendTransport.id });
  if (error) {
    console.error(error);
  }
  // closing the sendTransport closes all associated producers. when
  // the camVideoProducer and camAudioProducer are closed,
  // mediasoup-client stops the local cam tracks, so we don't need to
  // do anything except set all our local variables to null.
  try {
    await sendTransport.close();
  } catch (e) {
    console.error(e);
  }
  sendTransport = null;
  camVideoProducer = null;
  camAudioProducer = null;
  screenVideoProducer = null;
  screenAudioProducer = null;
  stopLocalStream(localCam);
  localCam = null;
  localScreen = null;
        pauseVideo(localVideo);
        
    
  //  el.setAttribute('disabled', 1);

  // update relevant ui elements
  $('#send-camera').style.display = 'initial';
  $('#share-screen').style.display = 'initial';
  $('#local-screen-pause-ctrl').style.display = 'none';
  $('#local-screen-audio-pause-ctrl').style.display = 'none';
  leaveRoom();
  showCameraInfo();
}

function pauseVideo(element) {
    element.pause();
    element.srcObject = null;
}
function stopLocalStream(stream) {
    let tracks = stream.getTracks();
    if (!tracks) {
        console.warn('NO tracks');
        return;
    }
	tracks.forEach(track => track.stop());
}
async function leaveRoom() {
  if (!joined) {
    return;
  }

  console.log('leave room');
  //$('#leave-room').style.display = 'none';


  // close everything on the server-side (transports, producers, consumers)
  let { error } = await sendRequest({ type: 'leave' });
  if (error) {
    console.error(error);
  }

  // closing the transports closes all producers and consumers. we
  // don't need to do anything beyond closing the transports, except
  // to set all our local variables to their initial states
  try {
    recvTransport && await recvTransport.close();
    sendTransport && await sendTransport.close();
  } catch (e) {
    console.error(e);
  }
  recvTransport = null;
  sendTransport = null;
  camVideoProducer = null;
  camAudioProducer = null;
  screenVideoProducer = null;
  screenAudioProducer = null;
  localCam = null;
  localScreen = null;
  lastPollSyncData = {};
  consumers = [];
  joined = false;

  // hacktastically restore ui to initial state
//  $('#join-control').style.display = 'initial';
  $('#send-camera').style.display = 'initial';
  $('#stop-streams').style.display = 'none';
  $('#remote-video').innerHTML = '';
  $('#share-screen').style.display = 'initial';
  $('#local-screen-pause-ctrl').style.display = 'none';
  $('#local-screen-audio-pause-ctrl').style.display = 'none';
  showCameraInfo();
  updateCamVideoProducerStatsDisplay();
  updateScreenVideoProducerStatsDisplay();
  updatePeersDisplay();
}

async function subscribeToTrack(peerId, mediaTag) {
  console.log('subscribe to track', peerId, mediaTag);
if(mediaTag == 'video'){
	mediaTag = 'cam-video';
}else if(mediaTag == 'audio'){
	mediaTag = 'cam-audio';
}else{
	
}
try{
  // create a receive transport if we don't already have one
  if (!recvTransport) {
    recvTransport = await createTransport('recv');
  }

  // if we do already have a consumer, we shouldn't have called this
  // method
 // let consumer = findConsumerForTrack(peerId, mediaTag);
 // if (consumer) {
    console.error('already have consumer for track', peerId, mediaTag)
   // return;
 // };
  
  //alert('mediatag ' + mediaTag);
 //videoConsumer = 
if(mediaTag == 'cam-video'){
  videoConsumer =  await consumeAndResume(recvTransport, mediaTag, peerId);
}else{
  audioConsumer = await consumeAndResume(recvTransport, mediaTag, peerId);
}
  // ask the server to create a server-side consumer object and send
  // us back the info we need to create a client-side consumer
  
  
  //bconsumer = await bconsume(recvTransport, mediaTag);
  /*
  let consumerParameters = await sendRequest({type:'recv-track', // consume
    mediaTag,
    mediaPeerId: peerId,
    rtpCapabilities: device.rtpCapabilities
  });
  console.log('consumer parameters', consumerParameters);
  consumer = await recvTransport.consume({
    ...consumerParameters,
    appData: { peerId, mediaTag }
  });
  console.log('created new consumer', consumer.id);
*/
  // the server-side consumer will be started in paused state. wait
  // until we're connected, then send a resume request to the server
  // to get our first keyframe and start displaying video
 // while (recvTransport.connectionState !== 'connected') {
   // console.log('  transport connstate', recvTransport.connectionState );
  //  await sleep(100);
  //}
  // okay, we're ready. let's ask the peer to send us media
 // await resumeConsumer(consumer);

  // keep track of all our consumers
 // consumers.push(consumer);
}catch(e){
	console.error(e);
alert(e);
}
 // ui
  //await addVideoAudio(consumer);
 // updatePeersDisplay();
}


async function resumeConsumer(consumer) {
  if (consumer) {
    console.log('resume consumer', consumer.appData.peerId, consumer.appData.mediaTag);
    try {
      await sendRequest({type:'resume-consumer',  consumerId: consumer.id });
      await consumer.resume();
    } catch (e) {
      console.error(e);
    }
  }
}
async function consumeAndResume(recvTransport, kind, peerId) {
    let consumer;
    try {
        consumer = await bconsume(recvTransport, kind, peerId);
        
    } catch (err) {
	
		console.error("err: ", err);
        note({content: err.toString(), type: "error", time: 10 });
    }
    if (consumer) {
		
        console.log('-- track exist, consumer ready. kind=' + kind);
        console.log('----- consumer: ', consumer);
      //alert(kind);
        if (kind === 'cam-video' || 'cam-audio') {
			
            console.log('-- resume kind=' + kind + ' --consumer.id = ' + consumer.id);
            try {
                await sendRequest({type: 'resume-consumer' , kind: kind, consumerId: consumer.id })

                console.log('resume OK');
               
                return consumer;
            } catch (err) {
				console.error(err);
                note({content: err.toString(), type: "error", time: 10 });
                return consumer;
            }
        } else {
            console.log('-- do not resume kind=' + kind);
           return consumer;
        }
    } else {
        console.log('-- no consumer yet. kind=' + kind);
        return null;
    }
}
async function bconsume(transport, trackKind, peerId) {
    console.log('--start of consume --kind=' + trackKind);
    const {rtpCapabilities} = device;
    var data;
    
    let consumerParameters;
    try {
		// mediaTag,
   // mediaPeerId: peerId,
   // rtpCapabilities: device.rtpCapabilities
      //  data
      consumerParameters   = await sendRequest({type: 'recv-track' /*'consume'*/, rtpCapabilities, mediaTag: trackKind, mediaPeerId: peerId })
    } catch (err) {
		console.error(err);
        note({contrent: 'Consume ERROR: ' + err.toString(), type: "error", time: 5});
    }
    ;
//console.error(data)
console.log('consumerParameters ', JSON.stringify(consumerParameters))

   const producerId = consumerParameters.producerId;
  //  const id = data.params.id;
  //  const kind = data.params.kind;
  //  const rtpParameters = data.params.rtpParameters;
mediaTag = trackKind;
    if (producerId) {
        let codecOptions = {};
        let consumer;
        try {
            consumer = await transport.consume({
                //id,
              //  producerId,
              //  kind,
              //  rtpParameters,
               // codecOptions,
               ...consumerParameters,
    appData: { peerId, mediaTag }
            });
        } catch (err) {
			console.error(err);
            note({content: err.toString(), type: "error", time: 5});
            return null;
        }
     
        //  addRemoteTrack(MYSOCKETID, consumer.track);
      await addVideoAudio(consumer);
		//updatePeersDisplay();

        return consumer;
    } else {
        note({content: 'Remote producer NOT READY', type: "info", time: 5});

        return null;
    }
}

async function unsubscribeFromTrack(peerId, mediaTag) {
  let consumer = findConsumerForTrack(peerId, mediaTag);
  if (!consumer) {
    return;
  }

  console.log('unsubscribe from track', peerId, mediaTag);
  try {
    await closeConsumer(consumer);
  } catch (e) {
    console.error(e);
  }
  // force update of ui
  updatePeersDisplay();
}

async function pauseConsumer(consumer) {
  if (consumer) {
    console.log('pause consumer', consumer.appData.peerId, consumer.appData.mediaTag);
    try {
      await sendRequest({type:'pause-consumer',  consumerId: consumer.id });
      await consumer.pause();
    } catch (e) {
      console.error(e);
    }
  }
}
/*
async function resumeConsumer(consumer) {
  if (consumer) {
    console.log('resume consumer', consumer.appData.peerId, consumer.appData.mediaTag);
    try {
      await sendRequest({type:'resume-consumer',  consumerId: consumer.id });
      await consumer.resume();
    } catch (e) {
      console.error(e);
    }
  }
}
*/
async function pauseProducer(producer) {
  if (producer) {
    console.log('pause producer', producer.appData.mediaTag);
    try {
      await sendRequest({type:'pause-producer',  producerId: producer.id });
      await producer.pause();
    } catch (e) {
      console.error(e);
    }
  }
}

async function resumeProducer(producer) {
  if (producer) {
    console.log('resume producer', producer.appData.mediaTag);
    try {
      await sendRequest({type:'resume-producer',  producerId: producer.id });
      await producer.resume();
    } catch (e) {
      console.error(e);
    }
  }
}

async function closeConsumer(consumer) {
  if (!consumer) {
    return;
  }
  console.log('closing consumer', consumer.appData.peerId, consumer.appData.mediaTag);
  try {
    // tell the server we're closing this consumer. (the server-side
    // consumer may have been closed already, but that's okay.)
    await sendRequest({type:'close-consumer',  consumerId: consumer.id });
    await consumer.close();

    consumers = consumers.filter((c) => c !== consumer);
    removeVideoAudio(consumer);
  } catch (e) {
    console.error(e);
  }
}

// utility function to create a transport and hook up signaling logic
// appropriate to the transport's direction
//
async function createTransport(direction) {
  console.log(`create ${direction} transport`);

  // ask the server to create a server-side transport object and send
  // us back the info we need to create a client-side transport
  let transport,
      { transportOptions } = await sendRequest({type:'create-transport',  direction });
  console.log ('transport options', transportOptions);

  if (direction === 'recv') {
    transport = await device.createRecvTransport(transportOptions);
  } else if (direction === 'send') {
    transport = await device.createSendTransport(transportOptions);
  } else {
    throw new Error(`bad transport 'direction': ${direction}`);
  }

  // mediasoup-client will emit a connect event when media needs to
  // start flowing for the first time. send dtlsParameters to the
  // server, then call callback() on success or errback() on failure.
  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    console.log('transport connect event', direction);
    let { error } = await sendRequest({type:'connect-transport', 
      transportId: transportOptions.id,
      dtlsParameters
    });
    if (error) {
      console.error('error connecting transport', direction, error);
      errback();
      return;
    }
    callback();
  });

  if (direction === 'send') {
    // sending transports will emit a produce event when a new track
    // needs to be set up to start sending. the producer's appData is
    // passed as a parameter
    transport.on('produce', async ({ kind, rtpParameters, appData },
                                   callback, errback) => {
      console.log('transport produce event', appData.mediaTag);
      // we may want to start out paused (if the checkboxes in the ui
      // aren't checked, for each media type. not very clean code, here
      // but, you know, this isn't a real application.)
      let paused = false;
      if (appData.mediaTag === 'cam-video') {
        paused = getCamPausedState();
      } else if (appData.mediaTag === 'cam-audio') {
        paused = getMicPausedState();
      }
      // tell the server what it needs to know from us in order to set
      // up a server-side producer object, and get back a
      // producer.id. call callback() on success or errback() on
      // failure.
      let { id } = await sendRequest({type:'send-track', 
        transportId: transportOptions.id,
        kind,
        rtpParameters,
        paused,
        appData
      });
     // alert(id);
    //  if (error) {err('error setting up server-side producer', error); errback(); return;}
      callback({ id });
    });
  }

  // for this simple demo, any time a transport transitions to closed,
  // failed, or disconnected, leave the room and reset
  //
  transport.on('connectionstatechange', async (state) => {
	  //alert(state);
    console.log(`transport ${transport.id} connectionstatechange ${state}`);
    // for this simple sample code, assume that transports being
    // closed is an error (we never close these transports except when
    // we leave the room)
    if(state == "connected"){
		if(direction == 'send'){
			//alert(direction+camVideoProducer+camAudioProducer);
			/*
			setTimeout(function(){
			if(camVideoProducer){
					//alert('my peerId: '+ myPeerId+' mediTag '+camVideoProducer.appData.mediaTag+' producerId: '+camVideoProducer.id);
					wsend({ 
						type: 'Newproducer', 
						request: 'mediasoup',
						 mediaTag: camVideoProducer.appData.mediaTag, 
						 peerId: myPeerId ,
						 id: camVideoProducer.id
						 });
			}else{
				alert('cavideoProducer '+camVideoProducer);
			}
			},100);
			setTimeout(function(){
			if(camAudioProducer){
			//	alert('my peerId: '+ myPeerId+' mediTag '+camAudioProducer.appData.mediaTag+' producerId: '+camAudioProducer.id);
			wsend({
			type: 'Newproducer', 
						request: 'mediasoup',
						 mediaTag: camAudioProducer.appData.mediaTag, 
						 peerId: myPeerId,
						 id: camAudioProducer.id 		
			});
			}else{
				alert('camAudioProducer '+camAudioProducer);
			}
		},1000); */
		}else{
		//	alert('no send');
		}
	//	alert('connected');
		note({ content: (direction=='send'?"Вы в эфире!":"Вы подписались!"), type: "info", time: 5 });
	}else if (state === 'closed' || state === 'failed' || state === 'disconnected') {
      console.log('transport closed ... leaving the room and resetting');
      leaveRoom();
    }
  });

  return transport;
}

//
// polling/update logic
//

async function pollAndUpdate() {
	//alert(1);
  let { peers, activeSpeaker, error } = await sendRequest({type:'sync'});
 // console.log('polling peers', peers);
 // console.log('polling active speaker ',activeSpeaker);
  if (error) {
	  console.error(error);
    return ({ error });
  }

  // always update bandwidth stats and active speaker display
  if(activeSpeaker)currentActiveSpeaker = activeSpeaker;
  updateActiveSpeaker();
  updateCamVideoProducerStatsDisplay();
  updateScreenVideoProducerStatsDisplay();
  updateConsumersStatsDisplay();

  // decide if we need to update tracks list and video/audio
  // elements. build list of peers, sorted by join time, removing last
  // seen time and stats, so we can easily do a deep-equals
  // comparison. compare this list with the cached list from last
  // poll.
  if(peers){
  let thisPeersList = sortPeers(peers),
      lastPeersList = sortPeers(lastPollSyncData);
  if (!deepEqual(thisPeersList, lastPeersList)) {
    updatePeersDisplay(peers, thisPeersList);
  }

  // if a peer has gone away, we need to close all consumers we have
  // for that peer and remove video and audio elements
  for (let id in lastPollSyncData) {
    if (!peers[id]) {
      console.log(`peer ${id} has exited`);
      consumers.forEach((consumer) => {
        if (consumer.appData.peerId === id) {
          closeConsumer(consumer);
        }
      });
    }
  }
}

  // if a peer has stopped sending media that we are consuming, we
  // need to close the consumer and remove video and audio elements
  if(peers){
  consumers.forEach((consumer) => {
    let { peerId, mediaTag } = consumer.appData;
    if (!peers[peerId].media[mediaTag]) {
      console.log(`peer ${peerId} has stopped transmitting ${mediaTag}`);
      closeConsumer(consumer);
    }
  });
}
 if(peers) lastPollSyncData = peers;
  return ({}); // return an empty object if there isn't an error
}

function sortPeers(peers) {
  return  Object.entries(peers)
    .map(([id, info]) => ({id, joinTs: info.joinTs, media: { ...info.media }}))
    .sort((a,b) => (a.joinTs>b.joinTs) ? 1 : ((b.joinTs>a.joinTs) ? -1 : 0));
}

function findConsumerForTrack(peerId, mediaTag) {
  return consumers.find((c) => (c.appData.peerId === peerId &&
                                c.appData.mediaTag === mediaTag));
}

//
// -- user interface --
//

function getCamPausedState() {
  return !$('#local-cam-checkbox').checked;
}

function getMicPausedState() {
  return !$('#local-mic-checkbox').checked;
}

function getScreenPausedState() {
  return !$('#local-screen-checkbox').checked;
}

function getScreenAudioPausedState() {
  return !$('#local-screen-audio-checkbox').checked;
}

 async function changeCamPaused() {
  if (getCamPausedState()) {
    pauseProducer(camVideoProducer);
    $('#local-cam-label').innerHTML = 'camera (paused)';
  } else {
    resumeProducer(camVideoProducer);
    $('#local-cam-label').innerHTML = 'camera';
  }
}

 async function changeMicPaused() {
  if (getMicPausedState()) {
    pauseProducer(camAudioProducer);
    $('#local-mic-label').innerHTML = 'mic (paused)';
  } else {
    resumeProducer(camAudioProducer);
    $('#local-mic-label').innerHTML = 'mic';
  }
}

async function changeScreenPaused() {
  if (getScreenPausedState()) {
    pauseProducer(screenVideoProducer);
    $('#local-screen-label').innerHTML = 'screen (paused)';
  } else {
    resumeProducer(screenVideoProducer);
    $('#local-screen-label').innerHTML = 'screen';
  }
}

 async function changeScreenAudioPaused() {
  if (getScreenAudioPausedState()) {
    pauseProducer(screenAudioProducer);
    $('#local-screen-audio-label').innerHTML = 'screen (paused)';
  } else {
    resumeProducer(screenAudioProducer);
    $('#local-screen-audio-label').innerHTML = 'screen';
  }
}


async function updatePeersDisplay(peersInfo = lastPollSyncData,
                                         sortedPeers = sortPeers(peersInfo)) {
  console.log('room state updated', peersInfo);

  $('#available-tracks').innerHTML = '';
  if (camVideoProducer) {
    $('#available-tracks')
      .appendChild(makeTrackControlEl('my', 'cam-video',
                                      peersInfo[myPeerId].media['cam-video']));
  }
  if (camAudioProducer) {
    $('#available-tracks')
      .appendChild(makeTrackControlEl('my', 'cam-audio',
                                      peersInfo[myPeerId].media['cam-audio']));
  }
  if (screenVideoProducer) {
    $('#available-tracks')
      .appendChild(makeTrackControlEl('my', 'screen-video',
                                    peersInfo[myPeerId].media['screen-video']));
  }
  if (screenAudioProducer) {
    $('#available-tracks')
      .appendChild(makeTrackControlEl('my', 'screen-audio',
                                    peersInfo[myPeerId].media['screen-audio']));
  }

  for (let peer of sortedPeers) {
    if (peer.id === myPeerId) {
      continue;
    }
    for (let [mediaTag, info] of Object.entries(peer.media)) {
      $('#available-tracks')
        .appendChild(makeTrackControlEl(peer.id, mediaTag, info));
    }
  }
}

function makeTrackControlEl(peerName, mediaTag, mediaInfo) {
	
  let div = document.createElement('div'),
      peerId = (peerName === 'my' ? myPeerId : peerName),
      consumer = findConsumerForTrack(peerId, mediaTag);
  div.classList = `track-subscribe track-subscribe-${peerId}`;

  let sub = document.createElement('button');
  if (!consumer) {
    sub.innerHTML += 'подписаться на спикера в качестве зрителя или слушателя'
    sub.onclick = () => 
    subscribeToTrack(peerId, mediaTag);
    div.appendChild(sub);

  } else {
    sub.innerHTML += 'отписаться от спикера видео или аудио'
   sub.onclick = () => unsubscribeFromTrack(peerId, mediaTag);
   div.appendChild(sub);
  }

  let trackDescription = document.createElement('span');
  trackDescription.innerHTML = `${peerName} ${mediaTag}`
  div.appendChild(trackDescription);

  try {
    if (mediaInfo) {
      let producerPaused = mediaInfo.paused;
      let prodPauseInfo = document.createElement('span');
      prodPauseInfo.innerHTML = producerPaused ? '[producer paused]'
                                               : '[producer playing]';
      div.appendChild(prodPauseInfo);
    }
  } catch (e) {
    console.error(e);
  }

  if (consumer) {
    let pause = document.createElement('span'),
        checkbox = document.createElement('input'),
        label = document.createElement('label');
    pause.classList = 'nowrap';
    checkbox.type = 'checkbox';
    checkbox.checked = !consumer.paused;
    checkbox.onchange = async () => {
      if (checkbox.checked) {
        await resumeConsumer(consumer);
      } else {
        await pauseConsumer(consumer);
      }
      updatePeersDisplay();
    }
    label.id = `consumer-stats-${consumer.id}`;
    if (consumer.paused) {
      label.innerHTML = '[consumer paused]'
    } else {
      let stats = lastPollSyncData[myPeerId].stats[consumer.id],
          bitrate = '-';
      if (stats) {
        bitrate = Math.floor(stats.bitrate / 1000.0);
      }
      label.innerHTML = `[consumer playing ${bitrate} kb/s]`;
    }
    pause.appendChild(checkbox);
    pause.appendChild(label);
    div.appendChild(pause);

    if (consumer.kind === 'video') {
      let remoteProducerInfo = document.createElement('span');
      remoteProducerInfo.classList = 'nowrap track-ctrl';
      remoteProducerInfo.id = `track-ctrl-${consumer.producerId}`;
      div.appendChild(remoteProducerInfo);
    }
  }

  return div;
}

function addVideoAudio(consumer) {
  if (!(consumer && consumer.track)) {
    return;
  }
  let el = document.createElement(consumer.kind);
  // set some attributes on our audio and video elements to make
  // mobile Safari happy. note that for audio to play you need to be
  // capturing from the mic/camera
  if (consumer.kind === 'video') {
    el.setAttribute('playsinline', true);
  } else {
    el.setAttribute('playsinline', true);
    el.setAttribute('autoplay', true);
  }
  $(`#remote-${consumer.kind}`).appendChild(el);
  el.srcObject = new MediaStream([ consumer.track.clone() ]);
  el.consumer = consumer;
  // let's "yield" and return before playing, rather than awaiting on
  // play() succeeding. play() will not succeed on a producer-paused
  // track until the producer unpauses.
  el.play()
    .then(()=>{})
    .catch((e) => {
      console.error(e);
    });
}

function removeVideoAudio(consumer) {
  document.querySelectorAll(consumer.kind).forEach((v) => {
    if (v.consumer === consumer) {
      v.parentNode.removeChild(v);
    }
  });
}

async function showCameraInfo() {
  let deviceId = await getCurrentDeviceId(),
      infoEl = $('#camera-info');
  if (!deviceId) {
    infoEl.innerHTML = '';
    return;
  }
  let devices = await navigator.mediaDevices.enumerateDevices(),
      deviceInfo = devices.find((d) => d.deviceId === deviceId);
  infoEl.innerHTML = `
      ${ deviceInfo.label }
      <button data-current="" onclick="cycleCamera(this);">switch camera</button>
  `;
}

async function getCurrentDeviceId() {
  if (!camVideoProducer) {
    return null;
  }
  let deviceId = camVideoProducer.track.getSettings().deviceId;
  if (deviceId) {
    return deviceId;
  }
  // Firefox doesn't have deviceId in MediaTrackSettings object
  let track = localCam && localCam.getVideoTracks()[0];
  if (!track) {
    return null;
  }
  let devices = await navigator.mediaDevices.enumerateDevices(),
      deviceInfo = devices.find((d) => d.label.startsWith(track.label));
  return deviceInfo.deviceId;
}

function gotDevices(deviceInfos){
	let a = navigator.mediaDevices.getSupportedConstraints();
	
	for(var i=0; i !== deviceInfos.length; ++i){
		
		const deviceInfo = deviceInfos[i];
		if(deviceInfo.kind === 'videoinput'){
			if(kK == 0){
				videoInput1 = deviceInfo.deviceId;
			curd = videoInput1;
	
			}else if(kK == 1){
				
				videoInput2 = deviceInfo.deviceId;
			}
			
			kK++;
		}
	}
}
function getDevice(){
if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
note({ content: "Your browser navigator.mediaDevices not supported", type: "warn", time: 5 });
}else{
navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(function(err){console.error(err)});
}
}

getDevice();

function updateActiveSpeaker() {
  $$('.track-subscribe').forEach((el) => {
    el.classList.remove('active-speaker');
  });
  if (currentActiveSpeaker.peerId) {
    $$(`.track-subscribe-${currentActiveSpeaker.peerId}`).forEach((el) => {
      el.classList.add('active-speaker');
    });
  }
}

function updateCamVideoProducerStatsDisplay() {
  let tracksEl = $('#camera-producer-stats');
  tracksEl.innerHTML = '';
  if (!camVideoProducer || camVideoProducer.paused) {
    return;
  }
  makeProducerTrackSelector({
    internalTag: 'local-cam-tracks',
    container: tracksEl,
    peerId: myPeerId,
    producerId: camVideoProducer.id,
    currentLayer: camVideoProducer.maxSpatialLayer,
    layerSwitchFunc: (i) => {
      console.log('client set layers for cam stream');
      camVideoProducer.setMaxSpatialLayer(i) }
  });
}

function updateScreenVideoProducerStatsDisplay() {
  let tracksEl = $('#screen-producer-stats');
  tracksEl.innerHTML = '';
  if (!screenVideoProducer || screenVideoProducer.paused) {
    return;
  }
  makeProducerTrackSelector({
    internalTag: 'local-screen-tracks',
    container: tracksEl,
    peerId: myPeerId,
    producerId: screenVideoProducer.id,
    currentLayer: screenVideoProducer.maxSpatialLayer,
    layerSwitchFunc: (i) => {
      console.log('client set layers for screen stream');
      screenVideoProducer.setMaxSpatialLayer(i) }
  });
}

async function updateConsumersStatsDisplay() {
  try {
    for (let consumer of consumers) {
      let label = $(`#consumer-stats-${consumer.id}`);
      if (label) {
        if (consumer.paused) {
          label.innerHTML = '(consumer paused)'
        } else {
          let stats = lastPollSyncData[myPeerId].stats[consumer.id],
              bitrate = '-';
          if (stats) {
            bitrate = Math.floor(stats.bitrate / 1000.0);
          }
          label.innerHTML = `[consumer playing ${bitrate} kb/s]`;
        }
      }

      let mediaInfo = lastPollSyncData[consumer.appData.peerId] &&
                      lastPollSyncData[consumer.appData.peerId]
                        .media[consumer.appData.mediaTag];
      if (mediaInfo && !mediaInfo.paused) {
        let tracksEl = $(`#track-ctrl-${consumer.producerId}`);
        if (tracksEl && lastPollSyncData[myPeerId]
                               .consumerLayers[consumer.id]) {
          tracksEl.innerHTML = '';
          let currentLayer = lastPollSyncData[myPeerId]
                               .consumerLayers[consumer.id].currentLayer;
          makeProducerTrackSelector({
            internalTag: consumer.id,
            container: tracksEl,
            peerId: consumer.appData.peerId,
            producerId: consumer.producerId,
            currentLayer: currentLayer,
            layerSwitchFunc: async(i) => {
              console.log('ask server to set layers');
              await sendRequest({type: 'consumer-set-layers',  consumerId: consumer.id,
                                           spatialLayer: i });
            }
          });
        }
      }
    }
  } catch (e) {
    console.log('error while updating consumers stats display', e);
  }
}

function makeProducerTrackSelector({ internalTag, container, peerId, producerId,
                                     currentLayer, layerSwitchFunc }) {
  try {
    let pollStats = lastPollSyncData[peerId] &&
                    lastPollSyncData[peerId].stats[producerId];
    if (!pollStats) {
      return;
    }

    let stats = [...Array.from(pollStats)]
                  .sort((a,b) => a.rid > b.rid ? 1 : (a.rid<b.rid ? -1 : 0));
    let i=0;
    for (let s of stats) {
      let div = document.createElement('div'),
          radio = document.createElement('input'),
          label = document.createElement('label'),
          x = i;
      radio.type = 'radio';
      radio.name = `radio-${internalTag}-${producerId}`;
      radio.checked = currentLayer == undefined ?
                          (i === stats.length-1) :
                          (i === currentLayer);
      radio.onchange = () => layerSwitchFunc(x);
      let bitrate = Math.floor(s.bitrate / 1000);
      label.innerHTML = `${bitrate} kb/s`;
      div.appendChild(radio);
      div.appendChild(label);
      container.appendChild(div);
      i++;
    }
    if (i) {
      let txt = document.createElement('div');
      txt.innerHTML = 'tracks';
      container.insertBefore(txt, container.firstChild);
    }
  } catch (e) {
    console.log('error while updating track stats display', e);
  }
}

//
// encodings for outgoing video
//

// just two resolutions, for now, as chrome 75 seems to ignore more
// than two encodings
//
const CAM_VIDEO_SIMULCAST_ENCODINGS =
[
  { maxBitrate:  96000, scaleResolutionDownBy: 4 },
  { maxBitrate: 680000, scaleResolutionDownBy: 1 },
];

function camEncodings() {
  return CAM_VIDEO_SIMULCAST_ENCODINGS;
}

// how do we limit bandwidth for screen share streams?
//
function screenshareEncodings() {
  null;
}

//
// our "signaling" function -- just an http fetch
//

//
// simple uuid helper function
//
function obid(){
  let tst = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    tst +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};
function uuidv4() {
  //return ('111-111-1111').replace(/[018]/g, () =>
    //     (crypto.getRandomValues(new Uint8Array(1))[0] & 15).toString(16));
    let d = obid();
         return d;

}

//
// promisified sleep
//

//async function sleep(ms) {
  //return new Promise((r) => setTimeout(() => r(), ms));
//}
function deepEqual(x, y) {
  if (x === y) {
    return true;
  }
  else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length)
      return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop))
      {  
        if (! deepEqual(x[prop], y[prop]))
          return false;
      }
      else
        return false;
    }
    
    return true;
  }
  else 
    return false;
}
function wsend(obj){
	if(isSocketOpened){
		let a;
		try{
		a = JSON.stringify(obj);
		sock.send(a);
		}catch(e){console.error(e);}
	} 
}
