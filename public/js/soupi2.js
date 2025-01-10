let device = null;
let producerTransport = null;
let videoProducer = null;
let audioProducer = null;
let consumerTransport = null;
let videoConsumer = null;
let audioConsumer = null;
var SENDER = false;
let loci = null;
let vV = gid("vV");
/*
function getPubId(){
	let a = gid('publishedid');
	if(!a)return;
	return a.value == 'null'?false:true;
}
var publishedId = getPubId()?gid('publishedid').value:null;
*/
function goMedia(data){
	console.log('data:', data);
 if (data.type == "onconsume") {
       if (vV) vV.textContent = data.value;
    } else if (data.type == "producer_unpublished") {
       if (vV) vV.textContent = 0;
   //  if(gid('kartina'))  gid('kartina').setAttribute('poster',  "");
       publishedId = null;
      if(gid('playContainer')) gid("playContainer").setAttribute("data-state", "niemand");
        pauseVideo(remote);
         let a = document.querySelector('div#playContainer #kresti');
         if(a)a.className = "";//a.classList.toggle('show');
               if(a){
				 //if(a.classList.contains('show'))   a.classList.toggle('show');
				}
				/*gid("txtvalue2").setAttribute("data-publish", "none");
				gid("txtvalue").setAttribute("data-publish", "none");
				mobileChat.className="hide";
				textarea2.className = "hide";*/
				//hideChat();
				/*
       while(chatbox2.firstChild){
				   chatbox2.firstChild.remove();
			   }
			   while(chatbox.firstChild){
				   chatbox.firstChild.remove();
			   }
			   */ 
			   CONNECTED = false;
      //  enableElement("startMediaBtn");
       // enableElement("stopMediaBtn");
    } else if (data.type == "producer_published") {
		//alert('p');
      //  disableElement("startMediaBtn");
      //  disableElement("stopMediaBtn");
      gid("playContainer").setAttribute("data-state", "busy");
    //  if(!FLAGVK)  gid('kartina').setAttribute('poster',  data.img_data);
        publishedId = data.publishedId;
        let a = document.querySelector('div#playContainer svg');
        if(a) a.style.fill = 'rgba(234,223,244,0.6)';
        //claimMenu.setAttribute("data-vip", data.userId);
        //console.log("userId *** ", data.userId);
        //alert(data.img_data);
    } else if (data.type == "perror") {

      if(!FLAGVK)  note({content: data.info, type: "error", time: 5});
    } else {
        console.warn("Unknown type: ", data.type);
    }
}
function sendRequest(obj) {
    return new Promise((resolve, reject) => {
        obj.request = "mediasoup";
        if(!sock) {
			let s = L()=="ru"?"Повторите попытку позднее":L()=='en'?"Try later":
			L()=='zh'?'稍后再试':
			L()=='id'?'coba lagi nanti':'';
			reject({ info: s });
			return;
		}
		if(sock.readyState === 0) {
			let s = L()=="ru"?"Повторите попытку позднее":L()=='en'?"Try later":
			L()=='zh'?'稍后再试':
			L()=='id'?'coba lagi nanti':'';
			reject({ info: s });
			return;
		}
      
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
            } else if(a.type == "onjoin"){
				resolve(a.roomer);
			}else if (a.type == "error") {
                reject(a.info);
            } else {
                on_msg(a);
            }
        }

    });

}
function on_msg(data){
	 // console.log('data ',data);
	  if(data.type == "howmuch"){
		  onlinecount.textContent = data.value;
	  }else if(data.type == "room_created"){
		  
	  }else{
		 // console.log("UNknown type ", data.type);
	  }
  }
function Screenshot2() {
	if(!remote.srcObject) return;
    let cnv = document.createElement('canvas');
    let w = 180;
    let h = 180;
   
    var c = cnv.getContext('2d');
    console.log(remote.videoWidth,remote.videoHeight);
    var ww = remote.videoWidth;
    var hh = remote.videoHeight;
     cnv.width = ww;
    cnv.height = hh;
    c.drawImage(remote, 0, 0, ww, hh);
    var imgdata = cnv.toDataURL('image/png', 1.0);
    
    let file = null;
let blob = cnv.toBlob(function(blob) {
				file = new File([blob], 'image.png', { type: 'image/png' });
				 console.log('file ', file);
				 //wsend({clientId: userId.value, pile: JSON.stringify(file), type: "file", request: "mediasoup"});
			}, 'image/png');
console.log('blob: ', blob)
   // wsend({clientId: userId.value, file: blob, type: "file", request: "mediasoup"});
    
    
    cnv.remove();
    return imgdata;
    
}








function addRemoteTrack(id, track) {
    //if(SENDER)return;
   
    let video = findRemoteVideo(id);
    // if (!video) {
    video = addRemoteVideo(id);
    // }

    if (video.srcObject) {
		
        video.srcObject.addTrack(track);
        return;
    }

    const newStream = new MediaStream();
    newStream.addTrack(track);
    playVideo(video, newStream)
        .then(() => {
            video.volume = 1.0
        })
        .catch(err => {
            note({content: err, type: "error", time: 5})
        });
}


function addRemoteVideo(id) {
    let element = document.getElementById('remote');
    element.width = 240;
    element.height = 180;
    element.volume = 0;
    //element.controls = true;
    element.style = 'border: solid black 1px;';
    return element;
}

function findRemoteVideo(id) {
    let element = document.getElementById('remote');
    return element;
}

function stopLocalStream(stream) {
    let tracks = stream.getTracks();
    if (!tracks) {
        console.warn('NO tracks');
        return;
    }

    tracks.forEach(track => track.stop());
   // knopkaSubscribe.style.display = "block";
   // anketaForms.classList.toggle("open");
  //  enableElement("startMediaBtn");
  //  enableElement("stopMediaBtn");

}


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

function startMedia(el) {
  /*  if (local.srcObject) {
        console.warn('WARN: local media ALREADY started');
        let s = L()=="ru"?"Нажмите сперва на стоп, а потом уже запускайте трансляцию!":
        L()=='en'?"Press first 'stop' then get a stream":
        L()=='zh'?'先按“停止”然后获取流':
        L()=='id'?'Tekan dulu \'berhenti\' lalu dapatkan streaming':'';
        note({ content: s, type: "warn", time: 5 });
        return;
    }*/
PSENDER = true;
  // if(!sock)get_socket();

    navigator.mediaDevices.getUserMedia({audio: true, video: true })
        .then((stream) => {
			loci = stream;
            remote.srcObject = stream;
          
            remote.volume = 0;
             remote.play();
           // playVideo(localVideo, localStream);
          //  updateButtons();
           el.setAttribute("data-state", "begin");
          publish(el);
         
        
        })
        .catch(err => {
            console.error('media ERROR:', err);
            note({ content: err, type: "error", time: 5 });
        });
}

function stopMedia(el) {
    // if(SENDER){
    if (loci) {
        pauseVideo(remote);
        stopLocalStream(loci);
        loci = null;
        SENDER = false;
    }
  //  el.setAttribute('disabled', 1);
}
//if(Login())location.href="#setPrem";
 //window.location.href='#confirmAGE';
async function publish(el) {
	console.warn('publish');
  //  if (SENDER) return;
//console.log("after sender")
    if (!loci) {
        console.warn('WARN: local media NOT READY');
      //  return;
    }

    try {
        const data = await sendRequest({type: 'getRouterRtpCapabilities', vid: "publish"});
        console.log("data ", data);
        const somesuka = await sendRequest({type:'join'});
       // console.log('somesuka ', JSON.parse(somesuka.roomer));
        console.log('after somesuka');
        await loadDevice(data.routerrtpCapabilities);
        // SENDER = true;
        console.log("after device load");
    } catch (e) {
		console.error(e);
        note({content:e.info?e.info : e.toString(), type: "error", time: 5});
        SENDER = false;
        return;
    }
    //updateButtons();
    const params = await sendRequest({type: 'createProducerTransport'});
    console.log('transport params:', params);
    producerTransport = device.createSendTransport(params.params);
    console.log(' --- join & start publish --');
    producerTransport.on('connect', async ({dtlsParameters}, callback, errback) => {
        console.log('--trasnport connect', dtlsParameters);

        try {
            await sendRequest({
                type: 'connectProducerTransport',
                transportId: producerTransport.id,
                dtlsParameters: dtlsParameters
            })
            callback();
        } catch (er) {
			console.error(er);
            note({content: er.toString(), type: "error", time: 5});
            errback(er);
        }
        ;
    });

    producerTransport.on('produce', async ({kind, rtpParameters}, callback, errback) => {
        console.log('--trasnport produce');
        try {
            const {id} = await sendRequest({type: 'produce', transportId: producerTransport.id, kind, rtpParameters});
            console.log('id ', id);
            callback({id});
        } catch (err) {
			console.error(err);
            note({content: err.toString(), type: "error", time: 5});
            errback(err);
        }
        
        /*
         transport.on("produce", async (parameters, callback, errback) =>
{
  // Signal parameters to the server side transport and retrieve the id of 
  // the server side new producer.
  try
  {
    const data = await mySignaling.send(
      "transport-produce",
      {
        transportId   : transport.id, 
        kind          : parameters.kind,
        rtpParameters : parameters.rtpParameters,
        appData       : parameters.appData
      });

    // Let's assume the server included the created producer id in the response
    // data object.
    const { id } = data;

    // Tell the transport that parameters were transmitted and provide it with the
    // server side producer's id.
    callback({ id });
         */
    });

    producerTransport.on('connectionstatechange', async(state) => {
        console.warn("state: ", state);
        switch (state) {
            case 'connecting':
                console.log('publishing...');
                break;

            case 'connected':
           // startbtn.disabled = true;
           // nextbtn.disabled = true;
                SENDER = true;
                el.setAttribute("data-state", "published");
               // alert('published');
              //  let s = L()=="ru"?"Вы в эфире!":L()=='en'?"On air!":L()=='zh'?'正在播出！':L()=='id'?'mengudara!':'';
                note({content: "Вы в эфире!" , type: "info", time: 5});
               // getReklama();
               /*
                publishedId = MYSOCKETID;
               txtvalue.disabled = false;
               txtvalue2.disabled = false;
               let abbi = document.querySelectorAll('.send');
               abbi[0].setAttribute('data-publish', 'publish');
               abbi[1].setAttribute('data-publish', 'publish');
               let a = document.querySelector('div#playContainer #kresti');
               if(a) a.classList.toggle('show');
               let sa = document.querySelector("#kartinasvg");
               if(sa) sa.style.display="none";*/
               /*
                setTimeout(()=>{;
               let img_data = Screenshot2();
            
                wsend({isprem: (Prem.value=="y"?"y":"n"), clientId: userId.value, img_data: img_data, type: "pic", request: "mediasoup"});
               }, 1000)
              */
                break;

            case 'disconnected':
                note({content: "Disconnected!", type: "info", time: 5});
                if (producerTransport) producerTransport.close();
               // el.removeAttribute('disabled');
                unpublish();
                break;

            case 'failed':
            /* s = L()=="ru"?"Не удалось сконнектиться с сервером!":L()=='en'?"No luck connect to server":
             L()=='zh'?'没有运气连接到服务器':
             L()=='id'?'Tidak berhasil terhubung ke server':'';
                note({content: s, type: "error", time: 5});
                */ 
                if (producerTransport) producerTransport.close();
                unpublish();
                break;

            default:
                break;
        }
    });

  //  const useVideo = checkUseVideo();
  //  const useAudio = checkUseAudio();
   // if (useVideo) {
        const videoTrack = remote.srcObject.getVideoTracks()[0];
        if (videoTrack) {
            const trackParams = {track: videoTrack};
            try {
				//alert('videoproducer');
                videoProducer = await producerTransport.produce(trackParams);
            } catch (err) {
				console.error(err);
                note({content: err.toString(), type: "error", time: 5});
            }
        }
  //  }
   // if (useAudio) {
        const audioTrack = remote.srcObject.getAudioTracks()[0];
        if (audioTrack) {
            const trackParams = {track: audioTrack};
            try {
                audioProducer = await producerTransport.produce(trackParams);
            } catch (err) {
				console.error(err);
                note({content: err.toString(), type: "error", time: 5})
            }
        }
   // }

    updateButtons();
}

//location.href="#gopremium";
//location.href="#goinfo";
function updateButtons() {}
/*
function premi(){
	
	if(!Login())return;
	//if(Lang.value !=="ru") return;
	 if(Prem.value == "y") return;
let a = localStorage.getItem("prem");
if(!a&&a!=="0"){
 location.href="#gopremium";
 let faka = document.querySelector('.overlay:target');
if(faka){
	faka.onclick=function(e){
		//e.preventDefault();
	localStorage.setItem("prem", "0");
	//window.location.href="#goinfo";

	
	}
}}}
//premi();
function premiInfo(){
	if(!Login())return;
	//if(Lang.value !=="ru") return;
	 if(Prem.value == "y") return;
let a = localStorage.getItem("prem");
if(!a&&a!=="0"){
 location.href="#goinfo";
 let faka = document.querySelector('.overlay:target');
if(faka){
	faka.onclick=function(e){
		//e.preventDefault();
	localStorage.setItem("prem", "0");

	
	}
}}}
//premiInfo();
function logp(t) {
    let out = gid("out7");
    if (out) {
        return out.innerHTML += t + "<br>";
    }
}*/

var myusername;
/*
function showAnketaForms(el) {
    anketaForms.classList.toggle("open");
    startMedia();
    enableElement("stopMediaBtn");
    el.setAttribute('disabled', 1);
}

disableElement('stopMediaBtn');
disableElement("stopTranslation");
*/

async function subscribe(el) {
	/* if (local.srcObject) {
        console.warn('WARN: local media ALREADY started');
        let s = L()=="ru"?"Нажмите сперва на стоп, а потом уже подписывайтесь на трансляцию!":
        L()=='en'?"First press 'stop' then subscribe to translation":
        L()=='zh'?"首先按“停止”，然后订阅翻译":
        L()=='id'?"Pertama tekan 'stop' lalu berlangganan terjemahan":'';
        note({ content: s, type: "warn", time: 5 });
        return;
    }
   if (SENDER) {
	   let s = L()=="ru"?"Вы не можете на себя подписаться!":
	   L()=='en'?"You cannot subscribe to yourself!":
	   L()=='zh'?"您无法订阅自己！":
	   L()=='id'?"Anda tidak dapat berlangganan diri Anda sendiri!":'';
        note({content: s, type: "warn", time: 5});
        return;
    }
     if(!sock){
		 get_socket();
	 }*/
    //alert("SUBSCRIBE");
    try {
        const data = await sendRequest({type: 'getRouterRtpCapabilities', vid: 'subscribe'});
        await loadDevice(data.routerrtpCapabilities);
    } catch (err) {
		console.log(err);
        note({content: err.info?err.info:err, type: "error", time: 5});
        if(err == "Нет видеотрансляции!"){
			wsend({ type: 'clearproducer' });
			//gid('kartina').setAttribute('poster',  "");
       publishedId = null;
     //  gid("playContainer").setAttribute("data-state", "niemand");
       
         let a = document.querySelector('div#playContainer #kresti');
         if(a)a.className = "";
		}
        return;
    }

    updateButtons();

    let params;
    try {
        params = await sendRequest({type: 'createConsumerTransport'});
    } catch (err) {
        note({content: err, type: "error", time: 5});
        return;
    }
    consumerTransport = device.createRecvTransport(params.params);

    consumerTransport.on('connect', async ({dtlsParameters}, callback, errback) => {
        try {
            await sendRequest({type: 'connectConsumerTransport', dtlsParameters: dtlsParameters})
            callback()
        } catch (er) {
			console.error(er);
            note({content: er.toString(), type: "error", time: 5});
            errback(er);
        }
    });

    consumerTransport.on('connectionstatechange', (state) => {
        console.log("state: ", state);
        switch (state) {
            case 'connecting':
                console.log('subscribing...');
                break;

            case 'connected':
            PSENDER = true;
            CONNECTED = true;
           
           /* startbtn.disabled = true;
            nextbtn.disabled = true;
            let s = L()=="ru"?"Вы подключились к трансляции!":
            L()=='en'?"You subscribed to translation!":
            L()=='zh'?"您订阅了翻译！":
            L()=='id'?"Anda berlangganan terjemahan!":'';
                note({content: s, type: "info", time: 5});
                gid("playContainer").setAttribute("data-state", "subscribed");
                gid("txtvalue2").setAttribute("data-publish", "publish");
                gid("txtvalue").setAttribute("data-publish", "publish");
                txtvalue.disabled = false;
               txtvalue2.disabled = false;
                */
                wsend({type: "onconsume", publishedId: publishedId, request: "mediasoup"})
                 let a = document.querySelector('div#playContainer #kresti');
               if(a) a.classList.toggle('show');
               let sa = document.querySelector("#kartinasvg");
               if(sa) sa.style.display="none";
                break;
            case 'disconnected':
                note({content: 'Disconnected!', type: 'info', time: 5});
                CONNECTED = false;
                PSENDER = false;
                if (vV) vV.textContent = 0;
     //  gid('kartina').setAttribute('poster',  "");
       publishedId = null;
      /* gid("playContainer").setAttribute("data-state", "niemand");
       gid("txtvalue2").setAttribute("data-publish", "none");
       gid("txtvalue").setAttribute("data-publish", "none");
        txtvalue.disabled = true;
         txtvalue2.disabled = true;
         startbtn.disabled = false;*/
      // mobileChat.className="";
      //hideChat();
    //  mobileChat.className="hide";
	/*			textarea2.className = "hide";
       while(chatbox2.firstChild){
				   chatbox2.firstChild.remove();
			   }
			   while(chatbox.firstChild){
				   chatbox.firstChild.remove();
			   }*/
        pauseVideo(remote);
         let a1 = document.querySelector('div#playContainer #kresti');
               if(a1) a1.className = ""; //a1.classList.toggle('show');
                break;

            case 'failed':
               // note({content: 'Failed to subscribe!', type: "error", time: 5});
                //  producerTransport.close();
                gid("txtvalue2").setAttribute("data-publish", "none");
                gid("txtvalue").setAttribute("data-publish", "none");
                // txtvalue.disabled = true;
               //txtvalue2.disabled = true;
                CONNECTED = false;
                PSENDER = false;
                consumerTransport.close();
                break;

            default:
                break;
        }
    });

    videoConsumer = await consumeAndResume(consumerTransport, 'video');
    audioConsumer = await consumeAndResume(consumerTransport, 'audio');

    updateButtons();
}


async function consumeAndResume(transport, kind) {
    let consumer;
    try {
        consumer = await consume(consumerTransport, kind);
        
    } catch (err) {
	
		console.error("err: ", err);
        note({content: err.toString(), type: "error", time: 10 });
    }
    if (consumer) {
		
        console.log('-- track exist, consumer ready. kind=' + kind);
        console.log('----- consumer: ', consumer);
        updateButtons();
        if (kind === 'video') {
            console.log('-- resume kind=' + kind);
            try {
                await sendRequest({type: 'resume', kind: kind})

                console.log('resume OK');
               
                return consumer;
            } catch (err) {
				console.error(err);
                note({content: err.toString(), type: "error", time: 10 });
                return consumer;
            }
        } else {
            console.log('-- do not resume kind=' + kind);
        }
    } else {
        console.log('-- no consumer yet. kind=' + kind);
        return null;
    }
}

async function loadDevice(routerRtpCapabilities) {
    try {
       // device = new MediasoupClient.Device();
        device = new window.mediasoup.Device();
    } catch (error) {
        if (error.name === 'UnsupportedError') {
            note({content: 'Browser not supported!', type: "error", time: 5});
        }
    }
    try {
        await device.load({routerRtpCapabilities});
    } catch (err) {
		console.error(err);
        note({content: err.toString(), type: "error", time: 5});
    }
}

async function consume(transport, trackKind) {
    console.log('--start of consume --kind=' + trackKind);
    const {rtpCapabilities} = device;
    var data;
    try {
        data = await sendRequest({type: 'consume', rtpCapabilities: rtpCapabilities, kind: trackKind})
    } catch (err) {
		console.error(err);
        note({contrent: 'Consume ERROR: ' + err.toString(), type: "error", time: 5});
    }
    ;
//console.error(data)

    const producerId = data.params.producerId;
    const id = data.params.id;
    const kind = data.params.kind;
    const rtpParameters = data.params.rtpParameters;

    if (producerId) {
        let codecOptions = {};
        let consumer;
        try {
            consumer = await transport.consume({
                id,
                producerId,
                kind,
                rtpParameters,
                codecOptions,
            });
        } catch (err) {
			console.error(err);
            note({content: err.toString(), type: "error", time: 5});
            return null;
        }
     
          addRemoteTrack(MYSOCKETID, consumer.track);
       

        return consumer;
    } else {
        note({content: 'Remote producer NOT READY', type: "info", time: 5});

        return null;
    }
}


function unpublish() {
    if (!SENDER) {
        return;
    }
    wsend({ type: "stop", request: "mediasoup"});
    if (loci) {
        pauseVideo(remote);
        stopLocalStream(loci);
        loci = null;
    }
    if (videoProducer) {
        videoProducer.close();
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
    updateButtons();
    // updateButtons2();
    SENDER = false;
    CONNECTED = false;
    if (vV) vV.textContent = 0;
   // disableElement("stopTranslation");
   playContainer.setAttribute("data-state", "niemand");
   PSENDER = false;
   let s = L()=="ru"?"Вы закончили трансляцию.":
   L()=='en'?"You finished translation!":
   L()=='zh'?'你翻译完了':
   L()=='id'?'Anda menyelesaikan terjemahan!':'';
    note({content: s, type: "info", time: 5});
    
    txtvalue.disabled = true;
   txtvalue2.disabled = true;
   txtvalue.setAttribute('data-publish', 'none');
   txtvalue2.setAttribute('data-publish', 'none');
    let abbi = document.querySelectorAll('.send');
               abbi[0].setAttribute('data-publish', 'none');
               abbi[1].setAttribute('data-publish', 'none');
     let a = document.querySelector('div#playContainer #kresti');
               if(a) a.classList.toggle('show');
               let sa = document.querySelector("#kartinasvg");
               if(sa) sa.style.display="block";
    startbtn.disabled = false;
    nextbtn.disabled = true;
    chatbox.innerHTML="";
	  chatbox2.innerHTML="";
	mobileChat.className = "hide";
	mobChat = false;
	textarea2.classList.add('hide');
}

function disconnect2() {
	
    if (videoConsumer) {
        videoConsumer.close();
        videoConsumer = null;
    }
    if (audioConsumer) {
        audioConsumer.close();
        audioConsumer = null;
    }
    SENDER = false;
    if (consumerTransport) {
        consumerTransport.close();
        consumerTransport = null;
        wsend({ type: "unconsume", publishedId: publishedId, request: "mediasoup"});
    }
    // updateButtons2();
gid("playContainer").setAttribute("data-state", "busy");

        pauseVideo(remote);
       // stopLocalStream(remote.srcObject);
        loci = null;
        PSENDER = false;
        startbtn.disabled = false;
        let s = L()=="ru"?"Вы отписались от трансляции":
        L()=='en'?"You unsubscribed from translation":
        L()=='zh'?'您取消订阅翻译':
        L()=='id'?'Anda berhenti berlangganan terjemahan':'';
   note({ content: s, type: "info", time: 5 });
   gid("txtvalue2").setAttribute("data-publish", "none");
   gid("txtvalue").setAttribute("data-publish", "none");
   txtvalue.disabled = true;
   txtvalue2.disabled = true;
    let abbi = document.querySelectorAll('.send');
               abbi[0].setAttribute('data-publish', 'none');
               abbi[1].setAttribute('data-publish', 'none');
    let a = document.querySelector('div#playContainer #kresti');
   if(a)a.className = "";
   let sa = document.querySelector("#kartinasvg");
               if(sa) sa.style.display="block";
               if(a) {
				// if(!a.classList.contains('show'))  a.classList.toggle('show');
			   }
			
			 mobileChat.className="hide";
				textarea2.className = "hide";
       
			   while(chatbox2.firstChild){
				   chatbox2.firstChild.remove();
			   }
			     while(chatbox.firstChild){
				   chatbox.firstChild.remove();
			   }
}


function hide_chat(el) {
    chatsection.classList.toggle("hide");
}

/*
function buser(){
return (buserBname.value ? true : false);
}
function sendi(ev){
if(ev.key === "Enter"){
send_up();
}
} */

/*
textarea.addEventListener('keydown', sendi, false);

function send_up(el){
if(!textarea.value)return;
let d = {};
d.type = "msg";
d.msg = textarea.value;
d.roomname = 'gesamt';//modelName.value;
d.from = myusername;// yourNick.value;
console.log(d)
wsend(d);	
//if(el)el.className = "puls";
textarea.value = "";
}
function insert_message(ob){
//sendChat.className = "";
let m = document.createElement('div');
m.className = "chat-div";
m.innerHTML = '<span class="chat-user">' + ob.from + ': </span><br><span class="chat-message">' + ob.msg + '</span>';
chat.appendChild(m);
chat.scrollTop = chat.clientHeight + chat.scrollHeight;
}
function set_username(){
myusername = (buser() ? buserBname.value :  clientNick);
wsend({type: "username", owner: false, name: myusername, roomname: "gesamt"});
}
function broadcasting(el){
	alert("To be implemented.");
	}
*/

function enableElement(id) {
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

function beginTranslation(el){
	//alert(1);
	if(el.getAttribute("data-state") == "niemand"){
		let s = (L()=="ru"?'Запустить трансляцию? Вас увидят сотня потенциальных зрителей!':
		L()=='en'?'Enable the stream? Many viewers will watch you!':
		L()=='zh'?'启用流吗？很多观众都会看你的！':
		L()=='id'?'Aktifkan streaming? Banyak pemirsa akan menonton Anda!':'')
	//	alert(L());
	if(is_dialogi()){
	gid('inbox').innerHTML=s;
     gid('mydialog').showModal();
     gid('mydialog').addEventListener("close", function(e){
		 if(mydialog.returnValue === "cancel"){
			 
		 }else if(gid('mydialog').returnValue === "confirm"){
			 	var gg = G();
	if(gg == 1 || gg == 2){
		window.location.href = "#banned";
		return;
	}
			 startMedia(el);
		 }
		 })
	 }else{
		 if(window.confirm(s)){
			 	var gg = G();
	if(gg == 1 || gg == 2){
		window.location.href = "#banned";
		return;
	}
			startMedia(el);
			//el.setAttribute("data-state", "begin");
		}
	 }
		
	}else if(el.getAttribute("data-state") == "published"){
		unpublish();
	}else if(el.getAttribute("data-state") == "busy"){
		subscribe();
	}else if(el.getAttribute("data-state") == "subscribed"){
		disconnect2(); 
	}
}

