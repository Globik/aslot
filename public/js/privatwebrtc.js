var dc, pc;
function handlePrivat(a){
if(a.subtype == 'einladen'){
	//	if(confirm(`Звонок от ${a.fromname}. Принять?`)){
			wsend({ type: 'msg', subtype: "einladenok", target: a.fromid, fromname: gid('myName').value, fromid: myPeerId });
//			wsend({ type: 'msg', subtype: 'einladennotok', target: a.fromid, fromname: gid('myName').value, fromid: myPeerId  });
//		}
	}else if(a.subtype == 'einladennotok'){
	//	alert(a.type);
		note({ content: "От " + a.fromname + " отказ", type: 'info', time: 15 });
	}else if(a.subtype == "einladenok"){
		console.log('webrtc');
		histarget = a.fromid;
		goWebrtc(a);
	}else if(a.subtype == 'offer'){
		handle_offer(a.offer, a.fromid);
	}else if(a.subtype == "answer"){
	handle_answer(a.answer);	
	}else if(a.subtype == "candidate"){
	handle_candidate(a.candidate);	
	}else{} 
	}


function getPrivat(el){
	let a = el.getAttribute('data-hispeerid');
	if(!a)return;
	if(a == myPeerId){
		note({ content: "Вы не можете себе звонить.", type: "info", time: 5 });
		return;
	}
	wsend({ target: a, type: 'msg', subtype: "einladen", fromid: myPeerId, fromname: gid('myName').value });
}

async function goWebrtc(obj){
	stopStreams();
	try{
	 localCam = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
 makeVideo(localCam, 'localVideo');
  pc = createPeer();
 // stream.getTracks().forEach(function(track){pc.addTrack(track, stream)})
  localCam.getTracks().forEach(function(track){
	  pc.addTrack(track, localCam);
  });
  pc.createOffer().then(function(offer){
	 return pc.setLocalDescription(offer)}).then(function(){
		 wsend({ type: 'msg', subtype: 'offer', offer: pc.localDescription, fromname: gid('myName').value, fromid: myPeerId, target: obj.fromid });
	 }); 
  
}catch(err){
	console.error(err);
}
}
 function makeVideo(localCam, vidi){
    let vi = document.createElement('video');
   
  // replace the tracks we are sending
   let li = document.getElementById('remote-video');
  let anotherdiv = document.createElement('div');
  anotherdiv.setAttribute('data-peerid', myPeerId);
 
  let mynamediv = document.createElement('div');
  mynamediv.className = "for-name";
  mynamediv.textContent ="myname";
  anotherdiv.appendChild(mynamediv);
  anotherdiv.className = "video-box";
 vi.srcObject = localCam;

 vi.id = vidi;
  vi.volume = 0;
 // vi.play();
 vi.setAttribute('autoplay', true);
 anotherdiv.appendChild(vi)
 let stopdiv = document.createElement('div');
  stopdiv.className = "stop-div";
 stopdiv.innerHTML = `<div onclick="stopVideo(this);"><span class="my-krestik">&#x274C;</span></div>`;
 
 anotherdiv.appendChild(stopdiv);
  li.appendChild(anotherdiv);
}

function createPeer(){
	try{
	pc = new RTCPeerConnection({ iceServers: iceServersid });
}catch(e){
	alert(e);
	return;
}
pc.onicecandidate = on_ice_candidate;
pc.oniceconnectionstatechange = on_ice_connection_state_change;
pc.onicegatheringstatechange = on_ice_gathering_state_change;
pc.onicecandidaterror = on_ice_candidate_error;
pc.onnegotiationneeded = on_negotiation_needed;
pc.signalingstatechange = signaling_state_change;
pc.onconnectionstatechange = on_connection_state_change;
//if(!owner()){
dc = pc.createDataChannel('globi');
dc.onopen = on_channel_state_change;
dc.onclose = on_channel_state_change;
dc.onmessage = on_receive_message;
//}
pc.ondatachannel = receive_channel_cb;
pc.ontrack = on_track;
return pc;
}


function on_track({ track, streams }){
	//remoteVideo.srcObject = event.streams[0];
	//alert('remote video'+ event.streams[0]);
//alert(track.kind)
	track.onunmute = function(){
	//if(gid('remoteVideo').srcObject){alert('yes');return;}
		
	//alert('onunmute');
	console.error("MAKING REMOTE VIDEO");
//	makeVideo(streams[0], 'remoteVideo2');
		//setTimeout(function(){
	
	 let li = document.getElementById('remote-video');
	 let vi = document.createElement('video');
  let anotherdiv = document.createElement('div');
  anotherdiv.setAttribute('data-peerid', histarget);
 
  let mynamediv = document.createElement('div');
  mynamediv.className = "for-name";
  mynamediv.textContent ="myname";
  anotherdiv.appendChild(mynamediv);
  anotherdiv.className = "video-box";
  vi.setAttribute('playsinline', true);
    vi.setAttribute('autoplay', true);
    vi.setAttribute('muted', true);
 vi.srcObject = streams[0];

 vi.id = 'remoteVideo';
  vi.volume = 0;
 // vi.play();
if(track.kind == 'video'){
	vi.volume = 1.0;
 anotherdiv.appendChild(vi)
 let stopdiv = document.createElement('div');
 stopdiv.className = "stop-div";
 stopdiv.innerHTML = `<div onclick="stopVideo();"><span class="my-krestik">&#x274C;</span></div>`;
 
 anotherdiv.appendChild(stopdiv);
  li.appendChild(anotherdiv);
	}
	//}, 0)

}}
function on_channel_state_change(){
var readyState = dc.readyState;
console.log('send channel state is: ', readyState);
if(readyState == "open"){
	//on_display(false);
	}else{
	//	on_display(true);
		}	
	
}

function receive_channel_cb(event){
	dc = event.channel;
	dc.onmessage = on_receive_message;
	dc.onopen = on_channel_state_change;
	dc.onclose = on_channel_state_change;
}
function send(){
	let chat = gid('chat');
	let div = document.createElement("div");
	div.innerHTML = '<span class="text-span">hello world!</span>';
	chat.appendChild(div);
    chat.scrollTop = chat.clientHeight + chat.scrollHeight;
}
function insertMessage(obj){
var div = document.createElement("div");
div.className = "msg-container";
try{
//msg_came();
var a = JSON.parse(obj);
div.innerHTML = '<b>' + a.from + ': </b><span>' + a.msg + '</span>';
}catch(e){return;}
chat.appendChild(div);
chat.scrollTop = chat.clientHeight + chat.scrollHeight;
let btnSend = gid('btnSend');
//btnSend.classList.remove('puls');
}
function on_receive_message(event){
console.log('data channel: ', event.data);
insertMessage(event.data)
}

function sendText(el){
	let Area = gid('Area');
	let myName = gid('myName');
	
	if(!Area.value)return;
	//el.classList.add('puls');
	send_channel({ type: "privatmsg", msg: Area.value , from: myName.value });
	insertMessage(JSON.stringify({ msg: Area.value, from: "You" }));
	Area.value = "";
}
function send_channel(obj){
if(dc){
	try{
dc.send(JSON.stringify(obj));	
}catch(e){}
}	
}
function on_ice_candidate(event){
if(event.candidate){
console.warn("ON ICE CANDIDATE!");
let d = {};
d.type = 'msg';
d.subtype = "candidate";
d.candidate = event.candidate;
d.fromname = gid('myName').value;
d.fromid = myPeerId;
d.target = histarget;
if(d.target)wsend(d);	
}	
}

function handle_candidate(cand){
if(pc)pc.addIceCandidate(cand)	
}

function on_ice_connection_state_change(){
console.log('ice connection state: ',this.iceConnectionState);
if(this.iceConnectionState == "disconnected"){
//STOP_PRIVAT();
}else if(this.iceConnectionState == "closed"){
//STOP_PRIVAT();
stopVideo();

}else if(this.iceConnectionState == "connected"){
//v.className = "start";
	//BEGIN_PRIVAT();
	gid('send-camera').disabled = true;
}else if(this.iceConnectionState == "completed"){
//v.className = "start";
gid('send-camera').disabled = true;
}else if(this.iceConnectionState == "failed"){
//STOP_PRIVAT();
gid('send-camera').disabled = false;
}else{}	
}


function on_ice_gathering_state_change(){
	console.log("ice gathering: ",this.iceGatheringState);
}

function on_ice_candidate_error(err){
	console.error('ice candidate err: ', err);
	}

 function on_negotiation_needed(){
	console.warn("ON NEGOTIATION NEEDED!");
	}
	
function signaling_state_change(){
	console.log('signaling state: ',this.signalingState);
	}

function on_connection_state_change(){
console.log('connection state: ', this.connectionState);
if(this.connectionState == "disconnected"){
//STOP_PRIVAT();
gid('send-camera').disabled = false;
stopVideo();

}else if(this.connectionState == "failed"){
gid('send-camera').disabled = false;
}else if(this.connectionState == "connecting"){

}else if(this.connectionState == "connected"){
	gid('send-camera').disabled = true;
	}else{}	
	}




async function handle_offer(sdp, target){
	await stopStreams();
pc = createPeer();
pc.setRemoteDescription(sdp).then(function(){
return navigator.mediaDevices.getUserMedia({video:true,audio:true})}).then(function(stream){

//localVideo.srcObject = stream;
makeVideo(stream, 'localVideo');
//pc = createPeer()
stream.getTracks().forEach(function(track){pc.addTrack(track, stream)})
}).then(function(){
return pc.createAnswer();
}).then(function(answer){
return pc.setLocalDescription(answer);	
}).then(function(){
wsend({ type: 'msg', subtype: "answer", "answer": pc.localDescription, "fromname": gid('myName').value, fromid: myPeerId, "target": target });
}).catch(function(e){
console.log(e);
	
})
}

function handle_answer(sdp){
console.log("answer came");
console.log("PC: ", pc);
pc.setRemoteDescription(sdp);	
}

function stopVideo(){
console.log('stop video');
if(remoteVideo&&remoteVideo.srcObject){
remoteVideo.srcObject.getTracks().forEach(function(track){track.stop();
})
remoteVideo.srcObjetc = null;
}
if(localVideo&&localVideo.srcObject){
localVideo.srcObject.getTracks().forEach(function(track){track.stop();
	})
localVideo.srcObject = null;
}
 let elloc = document.querySelector(`[data-peerid="${myPeerId}"]`); 
 
  if(elloc)elloc.remove();
   let elrem = document.querySelector(`[data-peerid="${histarget}"]`); 
 
  if(elrem)elrem.remove();
if(!pc){console.log('no pc');return;}
clearPeer();
}

function clearPeer(){

console.log('pc: ', pc.signalingState);
pc.close();
pc.onicecandidate = null;
pc.oniceconnectionstatechange = null;
pc.onicegatheringstatechange = null;
pc.onicecandidaterror = null;
pc.onnegotiationneeded = null;
pc.signalingstatechange = null;
pc.onconnectionstatechange = null;
pc.on_track = null;
histarget = null;
gid('send-camera').disabled = false;
pc.oniceconnectionstatechange = null;
pc.onicegatheringstatechange = null;
pc.onicecandidaterror = null;
pc.onnegotiationneeded = null;
pc.signalingstatechange = null;
pc.onconnectionstatechange=null;
pc.on_track = null;
pc = null;
console.log('pc: ',pc);
}


