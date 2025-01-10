const tg_api = '7129138329:AAGl9GvZlsK3RsL9Vb3PQGoXOdeoc97lpJ4';
const grid = '-1002095475544';//-1002247446123
const { Blob } =require('node:buffer')
const fs = require('fs');
const os = require('os')
const {Duplex} = require('stream');
const crypto = require('crypto');
const Room = require('./Room')
const Peer = require('./Peer')

var BID = undefined;

const axios = require('axios').default;
const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
let onLine = new Map();
const numWorkers = Object.keys(os.cpus()).length;

let workers = []
let nextMediasoupWorkerIdx = 0 
let roomList = new Map()
 function on_producer_transport_close(){
		console.log("***************************************")
		console.log("producer transport closed")
		console.log("***********************************")
     if (videoProducer) {
        videoProducer.close();
        videoProducer = null;
      }
      if (audioProducer) {
        audioProducer.close();
        audioProducer = null;
      }
      
      producerTransport.observer.removeListener('close', on_producer_transport_close)
      console.log('producerTransport listeners ', producerTransport.observer.listeners('close'))
      producerTransport = null;
      console.log('videoproducer: ', videoProducer)
      console.log('audioproducer: ', audioProducer)
       
    }
   function on_video_transport_closed(){
	   console.log('**************************************')
	   console.log('video transport closed')
	   if (videoProducer) {
        videoProducer.close();
        videoProducer = null;
      }
	   }
	   function on_audio_transport_closed(){
	   console.log('**************************************')
	   console.log('audio transport closed')
	   if (audioProducer) {
        audioProducer.close();
        audioProducer = null;
      }
	   }
   function on_videoproducer_close(n) {
	   console.log("***************************************")
        console.log('videoProducer closed ---', n);
        console.log("***************************************")
      }
      
      function on_audioproducer_close(n) {
		  console.log("***************************************")
        console.log('audioProducer closed ---', n);
        console.log("***************************************")
      }
      
     eventEmitter.on('data', function(d){console.log("some emitter data ", d)});
      
const handleMediasoup =  function(/*ws, data, WebSocket, sock, pool*/ obj){
	let socket={};
	socket.id = obj.ws.id;
	function wsend(ws, ob){
	console.log('hallo wsend')
	let a;
	try{
		a = JSON.stringify(ob);
		//console.log('ws.readyState ', ws.readyState);
		if(ob.type != "producer_published")console.log('a : ', a)
		if(ws.readyState === obj.WebSocket.OPEN)ws.send(a)
		}catch(e){console.log(e)}
	}
	function broadcast(ob){
		obj.wss.clients.forEach(function(client){
			if( client !== obj.ws ) wsend( client, ob );
			})
		}
		
		function broadcast_all(ob){
		obj.wss.clients.forEach(function(client){
			wsend(client, ob);
			})
		}
	const ws = obj.ws;
	 function on_consumer_transport_close() {
      const id = getId(ws);
      console.log('--- consumerTransport closed. --')
      let consumer = getVideoConsumer(getId(ws));
      if (consumer) {
        consumer.close();
        removeVideoConsumer(id);
      }
      consumer = getAudioConsumer(getId(ws));
      if (consumer) {
        consumer.close();
        removeAudioConsumer(id);
      }
      removeConsumerTransport(id);
    }
      
	
	
	const mediasoup_t = async function(){
	
	let data = obj.msg;
	console.log("DATA : ", data);
	if(data.vid == "publish"){
//console.log("DATA : ", data);
    if (roomList.has(data.room_id)) {
     // callback('already exists')
      wsend(ws, {type: "error", info: "Трансляция идет! Повторите ппопытку позднее."})
    } else {
      console.log('Created room', { room_id:/* data.room_id*/obj.ws.id })
      const mediaCodecs = mediasoupOptions.router.mediaCodecs;
      let room_id = obj.ws.id
      let worker = await getMediasoupWorker()
      let router = await worker.createRouter({ mediaCodecs });
      
      

 router.on('workerclose', function(){ console.log('worker closed so router closed') })
 //router.observer.on('close', function(){console.log('router closed')})
	  worker.observer.on('close', function(){console.log('worker closed')})
  console.log('-- mediasoup worker start. --')
      roomList.set(room_id, new Room(room_id, router, eventEmitter))
      //callback(room_id)
      obj.ws.room_id = room_id
      let c=roomList.get(obj.ws.room_id);
      console.log('c', c);
     let d= c.getPeers();
     console.log('d ', d);
     let e =d.get(obj.ws.id);
     console.log('e ', e);
      wsend(ws, { type:'room_created', room_id: room_id });
    }
  //return;
	}//else
	 if(data.type == "join"){
		  console.log('User joined', {
      room_id: obj.ws.room_id,
      name: "alik"
    })

    if (!roomList.has(obj.ws.room_id)) {
     return wsend(ws, {type: "error", info: "Room does not exist"});
    }

    roomList.get(obj.ws.room_id).addPeer(new Peer(obj.ws.id, "alik"))
    

    wsend(ws, {type: "onjoin", roomer: roomList.get(obj.ws.room_id).toJson()})
	}else if(data.type == 'getRouterRtpCapabilities'){
	//	console.log('videoproducer: ', videoProducer)
	//	console.log('audioProducer: ', audioProducer)
		// console.log('Get RouterRtpCapabilities', {
     // name: `${roomList.get(obj.ws.room_id).getPeers().get(obj.ws.id).name}`
  //  })
				//console.log('router : ', router);
				/*
				if(data.vid == "publish"){
					if(producerTransport){
						wsend(ws, {type: "error", info: "Трансляция идет! Повторите ппопытку позднее."})
						return;
						}
			try{
				await	startWorker();
			}catch(e){console.log(e);return;}
			}else if(data.vid == "subscribe"){
				if(!producerTransport){
					wsend(ws, { type: "error", info: "Нет видеотрансляции!" });
					return;
					}
				}else{}
				*/
			//	roomList.get(ws.room_id).getRtpCapabilities() 
				//if (router) {
     // console.log('getRouterRtpCapabilities: ', router.rtpCapabilities);
      var ew = roomList.get(obj.ws.room_id).getRtpCapabilities();//router.rtpCapabilities;
     // ws.send(JSON.stringify({dura:'suka'}))
      wsend(ws, {type: data.type, routerrtpCapabilities: ew});
    //}
				}else if(data.type == 'createProducerTransport'){
    console.log('-- createProducerTransport ---');
   // producerSocketId = getId(ws);
   // console.log('producerSocketId: ', producerSocketId)
   // try{
   // const { transport, params } = await createTransport();
   // producerTransport = transport;
   // producerTransport.on('routerclose', function(){console.log('*** router closed ***')})
   // producerTransport.observer.on('close', on_producer_transport_close);
    //console.log('listeners transport close: ', producerTransport.observer.listeners('close'));
    
    //transport.on('routerclose', fn())
   // producerTransport.observer.removeListener('close', on_producer_close)
    
   // producerTransport.close();
    //console.log('-- createProducerTransport params:', params);
    
    
    
    
     console.log('Create webrtc transport', {
      name: `${roomList.get(obj.ws.room_id).getPeers().get(obj.ws.id).name}`
    })

    try {
      const { params } = await roomList.get(obj.ws.room_id).createWebRtcTransport(obj.ws.id)
obj.ws.publish = true;
    let r = {};
    r.type = "createProducerTransport";
    r.params = params
    wsend(ws, r);
   
    } catch (err) {
      
      obj.ws.publish = false;
	wsend(ws, {type: "error", info: er.toString()})
    }
 }else if(data.type == 'connectProducerTransport'){ 
	 console.log('connect producer transport',data);
	let b=data.dtlsParameters;
	
	
	 console.log('Connect transport', { name: `${roomList.get(obj.ws.room_id).getPeers().get(obj.ws.id).name}` })

    if (!roomList.has(obj.ws.room_id)) return
    await roomList.get(obj.ws.room_id).connectPeerTransport(obj.ws.id, data.transport_id, b)
wsend(ws, {type: "connectProducerTransport"});
   // callback('success')
	
	
	/*
	
	 try{
    await producerTransport.connect({ 'dtlsParameters': data.dtlsParameters });
    wsend(ws, {type: "connectProducerTransport"});
}catch(e){
	ws.publish = false;
	console.log('producer transport connect error ', e.toString());
	wsend(ws, {type: "error", info: e.toString()})
	}
    */
    }else if(data.type == 'produce'){
		
		console.log("**PRODUCE DATA *** ", data);
		 const { kind, rtpParameters, transportId } = data;
		
	
    if (!roomList.has(obj.ws.room_id)) {
      return wsend({type:"error", info: 'not is a room' })
    }

    let producer_id = await roomList.get(obj.ws.room_id).produce(obj.ws.id, transportId, rtpParameters, kind)

    console.log('Produce', {
      type: `${kind}`,
      name: `${roomList.get(obj.ws.room_id).getPeers().get(obj.ws.id).name}`,
      id: `${producer_id}`
    })

    wsend(ws, {type:"produce",
      id: producer_id
    })
  
		
		
		
		
		
		
		
   /*
    console.log('-- produce --- kind=', kind);
    if (kind === 'video') {
		try{
      videoProducer = await producerTransport.produce({ kind, rtpParameters });
      wsend(ws,{ type: 'produce', id: videoProducer.id });
  }catch(er){
	  ws.publish = false;
	  wsend(ws, {type: "error", info: er.toString()})
	  }
    }
    else if (kind === 'audio') {
		try{
      audioProducer = await producerTransport.produce({ kind, rtpParameters });
      
      wsend(ws, {type: 'produce', id: audioProducer.id });
  }catch(er){
	  ws.publish = false;
	  wsend(ws, {type: "error", info: er.toString()})
	  }
    }
    else {
      console.error('produce ERROR. BAD kind:', kind);
      ws.publish = false;
      wsend(ws, {type: "produce"});
      return;
    }
*/
    // inform clients about new producer
    console.log('--broadcast newProducer -- kind=', kind);
    broadcast({type: 'newProducer', kind: kind });

  }else if(data.type == 'createConsumerTransport'){
    console.log('-- createConsumerTransport ---');
    /*
    try{
    const { transport, params } = await createTransport();
    addConsumerTrasport(getId(ws), transport);
    transport.observer.on('close', function(){
		console.log('consumer transport closed')
		removeConsumerTransport(getId(ws));
		});
    //console.log('-- createTransport params:', params);
    wsend(ws,{type: data.type, params: params}); 
  }catch(er){
	  
	  wsend(ws, {type: "error", info: er.toString()})
  }
	  
	  */
	  
	  
     console.log('Create consumer transport', {
      name: `${roomList.get(obj.ws.room_id).getPeers().get(obj.ws.id).name}`
    })

    try {
      const { params } = await roomList.get(obj.ws.room_id).createWebRtcTransport(obj.ws.id)
//obj.ws.publish = true;
    let r = {};
    r.type = data.type;//"createProducerTransport";
    r.params = params
    wsend(ws, r);
   
    } catch (err) {
      
    //  obj.ws.publish = false;
	wsend(ws, {type: "error", info: er.toString()})
    }
	  
	  
	  
	  
	  
	  
	  
	  
  }else if(data.type == 'connectConsumerTransport'){
    console.log('-- connectConsumerTransport ---');
    
     console.log('connect consumer transport', data);
	let b=data.dtlsParameters;
	
	
	 console.log('Connect consumer transport', { name: `${roomList.get(obj.ws.room_id).getPeers().get(obj.ws.id).name}` })

    if (!roomList.has(obj.ws.room_id)) return
    await roomList.get(obj.ws.room_id).connectPeerTransport(obj.ws.id, data.transport_id, b)
wsend(ws, {type: "connectProducerTransport"});
    
    
    /*
    
    let transport = getConsumerTrasnport(getId(ws));
    if (!transport) {
      console.error('transport NOT EXIST for id=' + getId(ws));
      wsend(ws,{type: data.type});
      return;
    }
    await transport.connect({ dtlsParameters: data.dtlsParameters });
    wsend(ws,{type: data.type});
    */
  }else if(data.type == 'consume') {
  //  const kind = data.kind;
    console.log('-- consume --kind=, data ', data);

 const { kind, rtpParameters, consumerTransportId } = data;
		
	
    if (!roomList.has(obj.ws.room_id)) {
      return wsend({type:"error", info: 'not is a room' })
    }

   
 let params = await roomList.get(obj.ws.room_id).consume(obj.ws.id, consumerTransportId, producerId, rtpCapabilities)

    console.log('Consuming', {
      name: `${roomList.get(socket.room_id) && roomList.get(socket.room_id).getPeers().get(socket.id).name}`,
      producer_id: `${producerId}`,
      consumer_id: `${params.id}`
    })
    wsend(ws, {type:"consume",
    //  id: producer_id,
      params: params
    })
  
		







/*




    if (kind === 'video') {
      if (videoProducer) {
        let transport = getConsumerTrasnport(getId(ws));
        if (!transport) {
          console.error('transport NOT EXIST for id=' + getId(ws));
          return;
        }
        const { consumer, params } = await createConsumer(transport, videoProducer, data.rtpCapabilities); // producer must exist before consume
        //subscribeConsumer = consumer;
        const id = getId(ws);
        addVideoConsumer(id, consumer);
        consumer.observer.on('close', () => {
          console.log('consumer closed video---');
           removeVideoConsumer(id);
        })
        consumer.on('producerclose', () => {
          console.log('consumer -- on.producerclose');
          consumer.close();
          removeVideoConsumer(id);

          // -- notify to client ---
          wsend(ws,{type: 'producerClosed', localId: id, remoteId: producerSocketId, kind: 'video' });
        });

        console.log('-- consumer ready ---');
        wsend(ws,{type: data.type, params:params});
      }
      else {
        console.log('-- consume, but video producer NOT READY');
        const params = { type:'producerId', producerId: null, id: null, kind: 'video', rtpParameters: {} };
        wsend(ws, {type: data.type, params: params});
      }
    }
    else if (kind === 'audio') {
      if (audioProducer) {
        let transport = getConsumerTrasnport(getId(ws));
        if (!transport) {
          console.error('transport NOT EXIST for id=' + getId(ws));
          return;
        }
        //consumer_transport_id, producer_id, rtpCapabilities
        const { consumer, params } = await createConsumer(transport, audioProducer, data.rtpCapabilities); // producer must exist before consume
        //subscribeConsumer = consumer;
        const id = getId(ws);
        addAudioConsumer(id, consumer);
        consumer.observer.on('close', () => {
          console.log('consumer closed  audio---');
           removeAudioConsumer(id);
        })
        consumer.on('producerclose', () => {
          console.log('consumer -- on.producerclose');
          consumer.close();
          removeAudioConsumer(id);

          // -- notify to client ---
          wsend(ws, {type: 'producerClosed',  localId: id, remoteId: producerSocketId, kind: 'audio' });
        });

        console.log('-- consumer ready ---');
        wsend(ws, {type: data.type, params });
      }
      else {
        console.log('-- consume, but audio producer NOT READY');
        const params = { producerId: null, id: null, kind: 'audio', rtpParameters: {} };
        wsend(ws,{type: data.type, params: params});
      }
    }
    else {
      console.error('ERROR: UNKNOWN kind=' + kind);
    }
    */
  }else if(data.type == 'resume') {
    const kind = data.kind;
    console.log('-- resume -- kind=' + kind, '\n data ', data);
    if (kind === 'video') {
  //    let consumer = getVideoConsumer(getId(ws));
 let consumer =  await roomList.get(obj.ws.room_id).consumers.get(data.consumer_id)
      if (!consumer) {
        console.error('consumer NOT EXIST for id=' + getId(ws));
        wsend(ws, {type: data.type});
        return;
      }
      await consumer.resume();
      wsend(ws, {type: data.type});
    }
    else {
      console.warn('NO resume for audio');
    }

						
		}else if(data.type == 'stop'){
			cleanUpPeer(ws.pubId);
			}else if(data.type=='file'){
				let f = new FormData();
	console.log('data.file ', data.pile);
	try{
	
	}catch(e){console.log(e);}
			}else if( data.type == "pic" ){
				console.log(" **** PIC! ****");
				try{
			
		
		let b11 = data.img_data.split(',')[1];
		let kk = 0;
		let buf = Buffer.from(b11, "base64");
		try{
	let bot='887539364';
console.log('ws.nick ', ws.nick)
	var f = new FormData();
	f.append('chat_id', (data.isprem=="y"?grid:bot));
	f.append('parse_mode', 'html');
	f.append('caption', '<b>'+ws.nick+'</b>'+' запустил трансляцию. \nПосмотреть на <a href="https://rouletka.ru/about">https://rouletka.ru</a>\nВы можете купить подписку на уведомления о том, когда <b>' + ws.nick + '</b> онлайн');
	f.append('disable_notification', true);
	f.append('photo', new Blob([buf]));
    f.append('reply_markup', `{"inline_keyboard":[
	[{"text":"Купить за звездочки","callback_data":"usid=${ws.userId}&action=goldi&nick=${ws.nick}" }]
	]}`);
	
	

	await axios.post(`https://api.telegram.org/bot${tg_api}/sendPhoto`,
	f
	); 
	/*
	let ra = await pool.query('select * from usergold where usid=(?)', [ ws.userId ]);
	console.log('ra2 ', ra);
	if(ra.length > 0){
	const notifyUsers = ra.map(async (val)=>{
    await axios.post(`https://api.telegram.org/bot${tg_api}/sendPhoto`, {
		photo: 'https://rouletka.ru/img/gold/' + val.photo,
		chat_id: val.tgid.toString(),
		disable_notification:false,
		parse_mode: "html",
		caption: (val.lang=='ru'?`<b>${val.nick}</b> online в чат рулетке на <a href="https://rouletka.ru/about">https://rouletka.ru/about</a>`:`
		<b>${val.nick}</b> is online on <a href="https://rouletka.ru/about">https://rouletka.ru/about</a>`),
		reply_markup:`{"inline_keyboard":[
	[{"text":"Unsubscribe","callback_data":"lang=${val.lang}&usid=${val.usid}&action=unsub&nick=${val.nick}&tgid=${val.tgid}"}]]}`
})
	}); 


await Promise.all(notifyUsers);

	}*/
}catch(e){
	console.log(e);
	}

 if(!onLine.has(getId(ws)))onLine.set(getId(ws), { img_data: data.img_data, userId: ws.userId, publishedId: getId(ws), nick: ws.nick, value: 0 })
 eventEmitter.emit('producer_published', { img_data: data.img_data, userId: ws.userId, nick: ws.nick, value: 0, publishedId: ws.id  });
 ws.pubId = ws.id;
  broadcast({ type: "producer_published", img_data: data.img_data, userId: ws.userId, nick: ws.nick, value: 0, publishedId: ws.id });			
			}catch(e){
				console.log('db error: ', e.toString())
				wsend(ws, { type: "perror", info: e.toString() });
				}
				}else if( data.type == "onconsume" ){
					console.log(" *************** ONCONSUME ***************", data);
					ws.pubId = data.publishedId;
					try{
						oni("Jemand", "have subscribed to WebRTC");
						//let v = await pool.query("update vroom set v=v+1 returning v");
					if(onLine.has(data.publishedId)){
						let a = onLine.get(data.publishedId);
						a.value = a.value + 1;
						broadcast_all({ type: data.type, value: a.value });
						eventEmitter.emit(data.type, { value: a.value });
					}else{
						console.log(" ********** NO ONE !!!! *****");
					}
						}catch(err){
						wsend(ws, { type: "perror", info: err.toString() })
						}
					}else if(data.type == "unconsume"){
						unsubscribe(ws.pubId);
					}else{
				console.log("Unknown type: ", data.type);
				}
	}
	/*	
	function getPub(id){
		for (let el of sock.clients) {
    if (el.id == id) {
		console.log("el.target **** ", el.id, ' = ', id);
		return el.id
	}}
	
	}*/
		
		function unsubscribe(pubId){
		const id = getId(ws);
  const consumer = getVideoConsumer(id);
  if (consumer) {
	  try{
						
						}catch(err){
						console.log(err.toString());
						}
    consumer.close();
    removeVideoConsumer(id);
  }
const aconsumer = getAudioConsumer(id);
if(aconsumer){
	aconsumer.close();
removeAudioConsumer(id);
} 
  const transport = getConsumerTrasnport(id);
  if (transport) {
	  console.log("*************************")
	  console.log("closing consumer transport ", id)
	  console.log("*******************************");
	  if(onLine.has(pubId)){
						let a = onLine.get(pubId);
						a.value = a.value - 1;
						ws.pubId = null;
						broadcast_all({ type: "onconsume", value: a.value });
						eventEmitter.emit("onconsume", { value: a.value });
					}
    transport.close();
    removeConsumerTransport(id);
  }
  
}
		
		
const  cleanUpPeer = async function(pubId) {
	console.log("SOCKET CLOSED!!*******************************")
  const id = getId(ws);
  const consumer = getVideoConsumer(id);
  if (consumer) {
	 
    consumer.close();
    removeVideoConsumer(id);
  }
const aconsumer = getAudioConsumer(id);
if(aconsumer){
	aconsumer.close();
removeAudioConsumer(id);
} 
  const transport = getConsumerTrasnport(id);
  if (transport) {
	  console.log("*************************")
	  console.log("closing consumer transport ", id)
	  console.log("*******************************");
	  if(onLine.has(pubId)){
						let a = onLine.get(pubId);
						a.value = a.value - 1;
						ws.pubId = null;
						broadcast_all({ type: "onconsume", value: a.value });
						eventEmitter.emit("onconsume", { value: a.value });
					}
    transport.close();
    removeConsumerTransport(id);
  }
  
  
  
  
  
  
  if (producerSocketId === id) {
    console.log('---- cleanup producer ---');
    oni("Jemand", "have unpublished the WebRTC translation");
    eventEmitter.emit("producer_unpublished");
  
  /*
  
    try{
	
		 axios.post(`https://api.telegram.org/bot${tg_api}/sendMessage`, {
    chat_id: grid,
    text: '<b>'+ws.nick+'</b> закончил трансляцию',
    parse_mode: 'html',
    disable_notification: true
  });
	}catch(e){
		console.log(e);
		}
		*/ 
    if(onLine.has(getId(ws))){
		onLine.delete(getId(ws));
		
	}
    broadcast({ type: "producer_unpublished" })
    ws.pubId = null;
    
    try{
	//	await pool.query('delete from vroom');
	
		}catch(err){
			console.log(err.toString())
		wsend({ type: "perror", info: err.toString() });
		}
    
    if (videoProducer) {
     videoProducer.close();
     videoProducer = null;
     
    }
    if (audioProducer) {
      audioProducer.close();
     audioProducer = null;
     }

    if (producerTransport) {
      producerTransport.close();
      producerTransport = null;
    }

    producerSocketId = null;

    // --- clenaup all consumers ---
    //console.log('---- cleanup clenaup all consumers ---');
    removeAllConsumers();
    if(router){router.close(); router=null;}
    
    if(worker){worker.close();worker=null;}
    
    
     /*try{
	
	axios.post(`https://api.telegram.org/bot${tg_api}/sendMessage`, {
    chat_id: grid,
    text: '<b>'+ws.nick+'</b> закончил трансляцию',
    parse_mode: 'html',
    disable_notification: true
  });
	}catch(e){
		console.log(e.name);
		}*/
    
    
    
    
    
    
    
  }
}
		
		return { mediasoup_t, cleanUpPeer  }
		
	}
	
 
		
	module.exports = { handleMediasoup: handleMediasoup, ev: eventEmitter }
	
	
		
		function sendResponse(response, callback) {
    //console.log('sendResponse() callback:', callback);
    callback(null, response);
  }

  // --- send error to client ---
  function sendReject(error, callback) {
    callback(error.toString(), null);
  }

  function sendback(ws, message) {
    wsend(ws, message);
  }


function getId(ws) {
  return ws.id;
}

const mediasoup = require("mediasoup");
const mediasoupOptions = {
  // Worker settings
  worker: {
    rtcMinPort: 10000,
    rtcMaxPort: 20100,
    logLevel: 'error',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      // 'rtx',
      // 'bwe',
      // 'score',
      // 'simulcast',
      // 'svc'
    ],
  },
  // Router settings
  router: {
    mediaCodecs:
      [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters:
          {
            'x-google-start-bitrate': 1000
          }
        },
         {
			kind:'video',
			mimeType:'video/Vp9',
			clockRate:90000,
			parameters:{
				'profile-id':2,
				'x-google-start-bitrate':1000
			}
		},
		{
			kind:'video',
			mimeType:'video/h264',
			clockRate: 90000,
			parameters:{
				'packetization-mode':1,
				'profile-level-id':'4d0032',
				'level-asymmetry-allowed': 1,
				'x-google-start-bitrate':1000
			}
		},
		{
			kind:'video',
			mimeType:'video/h264',
			clockRate:90000,
			parameters:
			{
				'packetization-mode':1,
				'profile-level-id':'42e01f',
				'level-asymmetry-allowed':1,
				'x-google-start-bitrate':1000
			}
		}
      ]
  },
  // WebRtcTransport settings 45.12.18.172
  webRtcTransport: {
   /*    listenIps: [
      { ip: (process.env.DEVELOPMENT == "yes" ? '127.0.0.1' : "45.12.18.172") , announcedIp: null }
    ]*/
    listenInfos:[
    {
		protocol:"udp",
		ip:(process.env.DEVELOPMENT == "yes" ? '127.0.0.1' : "5.35.88.151"),
	},{
		protocol:"tcp",
		ip:(process.env.DEVELOPMENT == "yes" ? '127.0.0.1' : "5.35.88.151"),
	}
	],
   // enableUdp: true,
   // enableTcp: true,
   // preferUdp: true,
   // maxIncomingBitrate: 1500000,
   // initialAvailableOutgoingBitrate: 1000000,
  }
};

//let worker = null;
//let router = null;
let producerTransport = null;
let videoProducer = null;
let audioProducer = null;
let producerSocketId = null;
//let consumerTransport = null;
//let subscribeConsumer = null;

const dkey = "/etc/letsencrypt/live/rouletka.ru/privkey.pem";
const dcert = "/etc/letsencrypt/live/rouletka.ru/fullchain.pem";





createWorkers()


async function createWorkers() {
 // let { numWorkers } = numWorkers;// config.mediasoup

  for (let i = 0; i < numWorkers; i++) {
    let worker = await mediasoup.createWorker({
      logLevel: 'warn',
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp'
        // 'rtx',
        // 'bwe',
        // 'score',
        // 'simulcast',
        // 'svc'
      ],
   //   rtcMinPort: config.mediasoup.worker.rtcMinPort,
    //  rtcMaxPort: config.mediasoup.worker.rtcMaxPort
    })

    worker.on('died', () => {
      console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid)
   //   setTimeout(() => process.exit(1), 2000)
    })
    workers.push(worker)

    // log worker resource usage
    /*setInterval(async () => {
            const usage = await worker.getResourceUsage();

            console.info('mediasoup Worker resource usage [pid:%d]: %o', worker.pid, usage);
        }, 120000);*/
  }
}


async function startWorker() {
	try{
  const mediaCodecs = mediasoupOptions.router.mediaCodecs;
 
  worker = await mediasoup.createWorker(
/*  {
  dtlsCertificateFile : dcert,
  dtlsPrivateKeyFile  : dkey
}*/
  );
  router = await worker.createRouter({ mediaCodecs });
 // worker.fuck();
 router.on('workerclose', function(){ console.log('worker closed so router closed') })
 //router.observer.on('close', function(){console.log('router closed')})
	  worker.observer.on('close', function(){console.log('worker closed')})
  console.log('-- mediasoup worker start. --')
}catch(e){console.log(e);}

//worker.close();
}

// startWorker();

//
// Room {
//   id,
//   transports[],
//   consumers[],
//   producers[],
// }
//

// --- multi-consumers --
let transports = {};
let videoConsumers = {};
let audioConsumers = {};

function getConsumerTrasnport(id) {
  return transports[id];
}

function addConsumerTrasport(id, transport) {
  transports[id] = transport;
  console.log('consumerTransports count=' + Object.keys(transports).length);
}

function removeConsumerTransport(id) {
  delete transports[id];
  console.log('consumerTransports count=' + Object.keys(transports).length);
}

function getVideoConsumer(id) {
  return videoConsumers[id];
}

function addVideoConsumer(id, consumer) {
  videoConsumers[id] = consumer;
  console.log('videoConsumers count=' + Object.keys(videoConsumers).length);
}

function removeVideoConsumer(id) {
  delete videoConsumers[id];
  console.log('videoConsumers count=' + Object.keys(videoConsumers).length);
}

function getAudioConsumer(id) {
  return audioConsumers[id];
}

function addAudioConsumer(id, consumer) {
  audioConsumers[id] = consumer;
  console.log('audioConsumers count=' + Object.keys(audioConsumers).length);
}

function removeAudioConsumer(id) {
  delete audioConsumers[id];
  console.log('audioConsumers count=' + Object.keys(audioConsumers).length);
}

function removeAllConsumers() {
  for (const key in videoConsumers) {
    const consumer = videoConsumers[key];
    console.log('key=' + key + ',  consumer:', consumer);
    consumer.close();
    delete videoConsumers[key];
  }
  console.log('removeAllConsumers videoConsumers count=' + Object.keys(videoConsumers).length);

  for (const key in audioConsumers) {
    const consumer = audioConsumers[key];
    console.log('key=' + key + ',  consumer:', consumer);
    consumer.close();
    delete audioConsumers[key];
  }
}

async function createTransport() {
  const transport = await router.createWebRtcTransport(mediasoupOptions.webRtcTransport);
  console.log('-- create transport id=' + transport.id);

  return {
    transport: transport,
    params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    }
  };
}

async function createConsumer(transport, producer, rtpCapabilities) {
//	consumer_transport_id, producer_id, rtpCapabilities
  let consumer = null;
  if (!router.canConsume(
    {
      producerId: producer.id,
      rtpCapabilities,
    })
  ) {
    console.error('can not consume');
    return;
  }

  //consumer = await producerTransport.consume({ // NG: try use same trasport as producer (for loopback)
  consumer = await transport.consume({ // OK
    producerId: producer.id,
    rtpCapabilities,
    paused: producer.kind === 'video',
  }).catch(err => {
    console.error('consume failed', err);
    return;
  });

  //if (consumer.type === 'simulcast') {
  //  await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
  //}

  return {
    consumer: consumer,
    params: {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused
    }
  };
}


  
  function getMediasoupWorker() {
  const worker = workers[nextMediasoupWorkerIdx]

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0

  return worker
}
  
  
  
  
  
  

