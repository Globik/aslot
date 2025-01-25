const os = require('os')

const numWorkers =  Object.keys(os.cpus()).length;

 const handleMediasoup =  function(ws, msg, WebSocket, wss, pool){
	//ws, msg, WebSocket, wss, pool 
	console.log('*** MSG ***', msg);
	function wsend(ws, obj){
	console.log('hallo wsend ', obj)
	let a;
	try{
		a = JSON.stringify(obj);
		//console.log('ws.readyState ', ws.readyState);
		//if(obj.type != "producer_published")console.log('a : ', a)
		if(ws.readyState === WebSocket.OPEN)ws.send(a)
		}catch(e){console.log(e)}
	}
	function broadcast(obj){
		console.log("*** BROADCASTING !!!");
		wss.clients.forEach(function(client){
			if( client !== ws ) wsend( client, obj );
			})
		}
		function broadcast_room(target, obj){
			wss.clients.forEach(function(client){
			if( client.roomname == target ) wsend( client, obj );
			})
		}
		function broadcast_all(obj){
		wss.clients.forEach(function(client){
			console.log("*** BROADCASTING !!!");
			wsend(client, obj);
			})
		}
		
		const mediasoup_t = async function(){
			
  if(msg.type == 'disconnect'){
    // close user connection
    console.log('client disconnected. socket id=' + getId(ws) + '  , total clients=' + wss.clients.size);
    cleanUpPeer(ws);
  }else if(msg.type =='getRouterRtpCapabilities'){
	  //console.log("***** router ****", router);
    if (router) {
		console.warn('sending rtpcapabilities');
      wsend(ws, {type: msg.type, capabilities: router.rtpCapabilities});
    }
    else {
      wsend(ws,{ type: "error", info: 'ERROR- router NOT READY' });
    }
  }else if(msg.type == 'createProducerTransport'){
    console.log('-- createProducerTransport ---');
    const { transport, params } = await createTransport();
    addProducerTrasport(getId(ws), transport);
    transport.observer.on('close', () => {
      const id = getId(ws);
      const videoProducer = getProducer(id, 'video');
      if (videoProducer) {
        videoProducer.close();
        removeProducer(id, 'video');
      }
      const audioProducer = getProducer(id, 'audio');
      if (audioProducer) {
        audioProducer.close();
        removeProducer(id, 'audio');
      }
      removeProducerTransport(id);
    });
    console.log('-- createProducerTransport params:', params);
    wsend(ws,{type: msg.type, params: params});
  }else if(msg.type == 'connectProducerTransport'){
    const transport = getProducerTrasnport(getId(ws));
    await transport.connect({ dtlsParameters: msg.dtlsParameters });
    wsend(ws,{type: msg.type});
  }else if(msg.type == 'produce'){
    const { kind, rtpParameters } = msg;
    console.log('-- produce --- kind=' + kind);
    const id = getId(ws);
    const transport = getProducerTrasnport(id);
    if (!transport) {
      wsend(ws, {type:'error', info: 'transport NOT EXIST for id=' + id});
      return;
    }
    const producer = await transport.produce({ kind, rtpParameters });
    addProducer(id, producer, kind);
    producer.observer.on('close', () => {
      console.log('producer closed --- kind=' + kind);
    })
    wsend(ws,{type: msg.type, id: producer.id });

    // inform clients about new producer
    console.log('--broadcast newProducer ---');
    broadcast({type : 'newProducer' , socketId: id, producerId: producer.id, kind: producer.kind });
    
  //wsend(ws,{type : 'newProducer' , socketId: id, producerId: producer.id, kind: producer.kind });
  }else if(msg.type=='createConsumerTransport'){
    console.log('-- createConsumerTransport -- id=' + getId(ws));
    const { transport, params } = await createTransport();
    addConsumerTrasport(getId(ws), transport);
    transport.observer.on('close', () => {
      const localId = getId(ws);
      removeConsumerSetDeep(localId);
      /*
      let consumer = getConsumer(getId(socket));
      if (consumer) {
        consumer.close();
        removeConsumer(id);
      }
      */
      removeConsumerTransport(id);
    });
    console.log('-- createTransport params:', params);
    wsend(ws,{type: 'createConsumerTransport', params: params});
  }else if(msg.type == 'connectConsumerTransport'){
	 console.error('connect consumer transport');
    console.log('-- connectConsumerTransport -- id=' + getId(ws));
    let transport = getConsumerTrasnport(getId(ws));
    if (!transport) {
      wsend(ws, {type: 'error', info: 'transport NOT EXIST for id=' + getId(ws)});
      return;
    }
    await transport.connect({ dtlsParameters: msg.dtlsParameters });
    wsend(ws, {type: msg.type });
  }else if(msg.type == 'consume'){
    wsend(ws, {type: 'error', info: '-- ERROR: consume NOT SUPPORTED ---'});
    return;
  }else if(msg.type == 'resume'){
    wsend(ws, {type: 'error', info: '-- ERROR: resume NOT SUPPORTED ---'});
    return;
  }else if(msg.type == 'getCurrentProducers'){
    const clientId = msg.localId;
    console.log('-- getCurrentProducers for Id=' + clientId);

    const remoteVideoIds = getRemoteIds(clientId, 'video');
    console.log('-- remoteVideoIds:', remoteVideoIds);
    const remoteAudioIds = getRemoteIds(clientId, 'audio');
    console.log('-- remoteAudioIds:', remoteAudioIds);

    wsend(ws, {type:msg.type, remoteVideoIds: remoteVideoIds, remoteAudioIds: remoteAudioIds });
  }else if(msg.type == 'consumeAdd'){
    const localId = getId(ws);
    const kind = msg.kind;
    console.log('-- consumeAdd -- localId=%s kind=%s', localId, kind);

    let transport = getConsumerTrasnport(localId);
    if (!transport) {
		console.log('transport NOT EXIST for id=' + localId);
      wsend(ws, {type: 'error', info: 'transport NOT EXIST for id=' + localId});
      return;
    }
    const rtpCapabilities = msg.rtpCapabilities;
    const remoteId = msg.remoteId;
    console.log('-- consumeAdd - localId=' + localId + ' remoteId=' + remoteId + ' kind=' + kind);
    const producer = getProducer(remoteId, kind);
    if (!producer) {
      wsend(ws,{type: 'error', info: 'producer NOT EXIST for remoteId=%s kind=%s' +  remoteId + ' ' + kind});
      return;
    }
    const { consumer, params } = await createConsumer(transport, producer, rtpCapabilities); // producer must exist before consume
    //subscribeConsumer = consumer;
    addConsumer(localId, remoteId, consumer, kind); // TODO: MUST comination of  local/remote id
    console.log('addConsumer localId=%s, remoteId=%s, kind=%s', localId, remoteId, kind);
    consumer.observer.on('close', () => {
      console.log('consumer closed ---');
    })
    consumer.on('producerclose', () => {
      console.log('consumer -- on.producerclose');
      consumer.close();
      removeConsumer(localId, remoteId, kind);

      // -- notify to client ---
      wsend(ws, {type: 'producerClosed',  localId: localId, remoteId: remoteId, kind: kind });
    });

    console.log('-- consumer ready ---');
    wsend(ws, {type: msg.type, params: params});
  }else if(msg.type == 'resumeAdd'){
    const localId = getId(ws);
    const remoteId = msg.remoteId;
    const kind = msg.kind;
    console.log('-- resumeAdd localId=%s remoteId=%s kind=%s', localId, remoteId, kind);
    let consumer = getConsumer(localId, remoteId, kind);
    if (!consumer) {
      wsend(ws, {type: 'error', info: 'consumer NOT EXIST for remoteId=' + remoteId});
      return;
    }
    await consumer.resume();
    wsend(ws, {type: msg.type });
  }

  // ---- sendback welcome message with on connected ---
  const newId = getId(ws);
  wsend(ws, { type: 'welcome', id: newId });

  // --- send response to client ---
  function sendResponse(response, callback) {
    //console.log('sendResponse() callback:', callback);
    callback(null, response);
  }

  // --- send error to client ---
  function sendReject(error, callback) {
    callback(error.toString(), null);
  }

  function sendback(socket, message) {
    socket.emit('message', message);
  }
  
		//	return { mediasoup_t, cleanUpPeerDa  }
		}
		function cleanUpPeerDa(){
	  cleanUpPeer(ws);
  }
		return { mediasoup_t, cleanUpPeerDa  }
	}
	
	module.exports = { handleMediasoup: handleMediasoup }


function getId(ws) {
  return ws.id;
}
function cleanUpPeer(socket) {
  const id = getId(socket);
  removeConsumerSetDeep(id);
  /*
  const consumer = getConsumer(id);
  if (consumer) {
    consumer.close();
    removeConsumer(id);
  }
  */

  const transport = getConsumerTrasnport(id);
  if (transport) {
    transport.close();
    removeConsumerTransport(id);
  }

  const videoProducer = getProducer(id, 'video');
  if (videoProducer) {
    videoProducer.close();
    removeProducer(id, 'video');
  }
  const audioProducer = getProducer(id, 'audio');
  if (audioProducer) {
    audioProducer.close();
    removeProducer(id, 'audio');
  }

  const producerTransport = getProducerTrasnport(id);
  if (producerTransport) {
    producerTransport.close();
    removeProducerTransport(id);
  }
}

// ========= mediasoup ===========
const mediasoup = require("mediasoup");
const mediasoupOptions = {
  // Worker settings
  worker: {
    rtcMinPort: 10000,
    rtcMaxPort: 10100,
    logLevel: 'warn',
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
  // WebRtcTransport settings
  webRtcTransport: {
    listenIps: [
      { ip: '127.0.0.1', announcedIp: null }
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    maxIncomingBitrate: 1500000,
    initialAvailableOutgoingBitrate: 1000000,
  }
};

let worker = null;
let router = null;
//let producerTransport = null;
//let producer = null;
//let consumerTransport = null;
//let subscribeConsumer = null;


async function startWorker() {
  const mediaCodecs = mediasoupOptions.router.mediaCodecs;
  worker = await mediasoup.createWorker();
  router = await worker.createRouter({ mediaCodecs });
  //producerTransport = await router.createWebRtcTransport(mediasoupOptions.webRtcTransport);
  console.log('-- mediasoup worker start. --')
}

startWorker();

//
// Room {
//   id,
//   transports[],
//   consumers[],
//   producers[],
// }
//

// --- multi-producers --
let producerTransports = {};
let videoProducers = {};
let audioProducers = {};

function getProducerTrasnport(id) {
  return producerTransports[id];
}

function addProducerTrasport(id, transport) {
  producerTransports[id] = transport;
  console.log('producerTransports count=' + Object.keys(producerTransports).length);
}

function removeProducerTransport(id) {
  delete producerTransports[id];
  console.log('producerTransports count=' + Object.keys(producerTransports).length);
}

function getProducer(id, kind) {

  if (kind === 'video') {
    return videoProducers[id];
  }
  else if (kind === 'audio') {
    return audioProducers[id];
  }
  else {
    console.warn('UNKNOWN producer kind=' + kind);
  }
}

/*
function getProducerIds(clientId) {
  let producerIds = [];
  for (const key in producers) {
    if (key !== clientId) {
      producerIds.push(key);
    }
  }
  return producerIds;
}
*/

function getRemoteIds(clientId, kind) {
  let remoteIds = [];
  if (kind === 'video') {
    for (const key in videoProducers) {
      if (key !== clientId) {
        remoteIds.push(key);
      }
    }
  }
  else if (kind === 'audio') {
    for (const key in audioProducers) {
      if (key !== clientId) {
        remoteIds.push(key);
      }
    }
  }
  return remoteIds;
}


function addProducer(id, producer, kind) {
  if (kind === 'video') {
    videoProducers[id] = producer;
    console.log('videoProducers count=' + Object.keys(videoProducers).length);
  }
  else if (kind === 'audio') {
    audioProducers[id] = producer;
    console.log('audioProducers count=' + Object.keys(audioProducers).length);
  }
  else {
    console.warn('UNKNOWN producer kind=' + kind);
  }
}

function removeProducer(id, kind) {
  if (kind === 'video') {
    delete videoProducers[id];
    console.log('videoProducers count=' + Object.keys(videoProducers).length);
  }
  else if (kind === 'audio') {
    delete audioProducers[id];
    console.log('audioProducers count=' + Object.keys(audioProducers).length);
  }
  else {
    console.warn('UNKNOWN producer kind=' + kind);
  }
}


// --- multi-consumers --
let consumerTransports = {};
let videoConsumers = {};
let audioConsumers = {};

function getConsumerTrasnport(id) {
  return consumerTransports[id];
}

function addConsumerTrasport(id, transport) {
  consumerTransports[id] = transport;
  console.log('consumerTransports count=' + Object.keys(consumerTransports).length);
}

function removeConsumerTransport(id) {
  delete consumerTransports[id];
  console.log('consumerTransports count=' + Object.keys(consumerTransports).length);
}

function getConsumerSet(localId, kind) {
  if (kind === 'video') {
    return videoConsumers[localId];
  }
  else if (kind === 'audio') {
    return audioConsumers[localId];
  }
  else {
    console.warn('WARN: getConsumerSet() UNKNWON kind=%s', kind);
  }
}
function getConsumer(localId, remoteId, kind) {
  const set = getConsumerSet(localId, kind);
  if (set) {
    return set[remoteId];
  }
  else {
    return null;
  }
}

function addConsumer(localId, remoteId, consumer, kind) {
  const set = getConsumerSet(localId, kind);
  if (set) {
    set[remoteId] = consumer;
    console.log('consumers kind=%s count=%d', kind, Object.keys(set).length);
  }
  else {
    console.log('new set for kind=%s, localId=%s', kind, localId);
    const newSet = {};
    newSet[remoteId] = consumer;
    addConsumerSet(localId, newSet, kind);
    console.log('consumers kind=%s count=%d', kind, Object.keys(newSet).length);
  }
}

function removeConsumer(localId, remoteId, kind) {
  const set = getConsumerSet(localId, kind);
  if (set) {
    delete set[remoteId];
    console.log('consumers kind=%s count=%d', kind, Object.keys(set).length);
  }
  else {
    console.log('NO set for kind=%s, localId=%s', kind, localId);
  }
}

function removeConsumerSetDeep(localId) {
  const set = getConsumerSet(localId, 'video');
  delete videoConsumers[localId];
  if (set) {
    for (const key in set) {
      const consumer = set[key];
      consumer.close();
      delete set[key];
    }

    console.log('removeConsumerSetDeep video consumers count=' + Object.keys(set).length);
  }

  const audioSet = getConsumerSet(localId, 'audio');
  delete audioConsumers[localId];
  if (audioSet) {
    for (const key in audioSet) {
      const consumer = audioSet[key];
      consumer.close();
      delete audioSet[key];
    }

    console.log('removeConsumerSetDeep audio consumers count=' + Object.keys(audioSet).length);
  }
}

function addConsumerSet(localId, set, kind) {
  if (kind === 'video') {
    videoConsumers[localId] = set;
  }
  else if (kind === 'audio') {
    audioConsumers[localId] = set;
  }
  else {
    console.warn('WARN: addConsumerSet() UNKNWON kind=%s', kind);
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
    rtpCapabilities:rtpCapabilities,
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

