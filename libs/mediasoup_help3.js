const os = require('os')
const mediasoup = require('mediasoup')
const numWorkers =  Object.keys(os.cpus()).length;
const config = require('./config.js')
// one mediasoup worker and router
console.log('config ', config)
let worker, router, audioLevelObserver;
const log = console.log;
const warn = console.warn;
const err = console.error;
//
// and one "room" ...
//
const roomState = {
  // external
  peers: {},
  activeSpeaker: { producerId: null, volume: null, peerId: null },
  // internal
  transports: {},
  producers: [],
  consumers: []
}

async function startMediasoup() {
  let worker = await mediasoup.createWorker({
    logLevel: config.worker.logLevel,
    logTags: config.worker.logTags,
    rtcMinPort: config.worker.rtcMinPort,
    rtcMaxPort: config.worker.rtcMaxPort,
  });

  worker.on('died', () => {
    console.error('mediasoup worker died (this should never happen)');
    process.exit(1);
  });

  const mediaCodecs = config.router.mediaCodecs;
  const router = await worker.createRouter({ mediaCodecs });

  // audioLevelObserver for signaling active speaker
  //
  const audioLevelObserver = await router.createAudioLevelObserver({
		interval: 800
	});
	/*
  audioLevelObserver.on('volumes', (volumes) => {
    const { producer, volume } = volumes[0];
    //console.log('*****************audio-level volumes event', producer.appData.peerId, volume);
    roomState.activeSpeaker.producerId = producer.id;
    roomState.activeSpeaker.volume = volume;
    roomState.activeSpeaker.peerId = producer.appData.peerId;
  });*/
  audioLevelObserver.on('silence', () => {
    log('audio-level silence event');
    roomState.activeSpeaker.producerId = null;
    roomState.activeSpeaker.volume = null;
    roomState.activeSpeaker.peerId = null;
  });

  return { worker, router, audioLevelObserver };
}
console.log('starting mediasoup');
async function main(){
  ({ worker, router, audioLevelObserver } = await startMediasoup());
}
main();
  // start https server, falling back to http if https fails
  console.log('starting express');

 const handleMediasoup =  function(ws, msg, WebSocket, wss, pool){
	//ws, msg, WebSocket, wss, pool 
	//console.log('*** MSG ***', msg);
	const socket = ws;
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
			 //async function main() {
  // start mediasoup
  

	if(msg.type=='sync'){
		 let { peerId } = msg;
  try {
    // make sure this peer is connected. if we've disconnected the
    // peer because of a network outage we want the peer to know that
    // happened, when/if it returns
    if (!roomState.peers[peerId]) {
      throw new Error('not connected');
    }

    // update our most-recently-seem timestamp -- we're not stale!
    roomState.peers[peerId].lastSeenTs = Date.now();
//console.log("************** active speaker******************* ", roomState.activeSpeaker)
    wsend(ws,{type:msg.type,
      peers: roomState.peers,
      activeSpeaker: roomState.activeSpeaker
    });
  } catch (e) {
    console.error(e.message);
    wsend(ws, {type:msg.type, error: e.message });
  }
	}else if(msg.type=='join-as-new-peer'){
		

  try {
    let { peerId } = msg,
        now = Date.now();
    log('join-as-new-peer', peerId);
socket.peerId = peerId;
    roomState.peers[peerId] = {
      joinTs: now,
      lastSeenTs: now,
      media: {}, consumerLayers: {}, stats: {}
    };

    wsend(ws, {type:msg.type, routerRtpCapabilities: router.rtpCapabilities });
  } catch (e) {
    console.error('error in /signaling/join-as-new-peer', e);
    wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type == 'leave'){
	 try {
    let { peerId } = msg;
    log('leave', peerId);

    await closePeer(peerId);
    wsend(ws, {type:msg.type, left: true });
  } catch (e) {
    console.error('error in /signaling/leave', e);
    wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type=='create-transport'){
	try {
    let { peerId, direction } = msg;
    log('create-transport', peerId, direction);

    let transport = await createWebRtcTransport({ peerId, direction });
    roomState.transports[transport.id] = transport;

    let { id, iceParameters, iceCandidates, dtlsParameters } = transport;
    wsend(ws, {type:msg.type,
      transportOptions: { id, iceParameters, iceCandidates, dtlsParameters }
    });
  } catch (e) {
    console.error('error in /signaling/create-transport', e);
    wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type=='connect-transport'){
	try {
    let { peerId, transportId, dtlsParameters } = msg,
        transport = roomState.transports[transportId];

    if (!transport) {
      err(`connect-transport: server-side transport ${transportId} not found`);
      wsend(ws, {type:msg.type, error: `server-side transport ${transportId} not found` });
      return;
    }

    log('connect-transport', peerId, transport.appData);

    await transport.connect({ dtlsParameters });
    wsend(ws, {type:msg.type, connected: true });
  } catch (e) {
    console.error('error in /signaling/connect-transport', e);
    wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type=='close-transport'){
  try {
    let { peerId, transportId } = msg,
        transport = roomState.transports[transportId];

    if (!transport) {
      err(`close-transport: server-side transport ${transportId} not found`);
      wsend(ws, {type:msg.type, error: `server-side transport ${transportId} not found` });
      return;
    }

    log('close-transport', peerId, transport.appData);

    await closeTransport(transport);
    wsend(ws, {type:msg.type, closed: true });
  } catch (e) {
    console.error('error in /signaling/close-transport', e);
    wsend(ws, {type:msg.type, error: e.message });
  }
	
}else if(msg.type == 'close-producer'){
	
  try {
    let { peerId, producerId } = msg,
        producer = roomState.producers.find((p) => p.id === producerId);

    if (!producer) {
      err(`close-producer: server-side producer ${producerId} not found`);
      wsend(ws, {type:msg.type, error: `server-side producer ${producerId} not found` });
      return;
    }

    log('close-producer', peerId, producer.appData);

    await closeProducer(producer);
    wsend(ws, {type:msg.type, closed: true });
  } catch (e) {
    console.error(e);
    wsend(ws, {type:msg.type, error: e.message });
  }
}else if(msg.type == 'send-track'){
  try {
    let { peerId, transportId, kind, rtpParameters,
          paused=false, appData } = msg,
        transport = roomState.transports[transportId];

    if (!transport) {
      err(`send-track: server-side transport ${transportId} not found`);
      wsend(ws, {type:msg.type, error: `server-side transport ${transportId} not found`});
      return;
    }

    let producer = await transport.produce({
      kind,
      rtpParameters,
      paused,
      appData: { ...appData, peerId, transportId }
    });

    // if our associated transport closes, close ourself, too
    producer.on('transportclose', () => {
      log('producer\'s transport closed', producer.id);
      closeProducer(producer);
    });

    // monitor audio level of this producer. we call addProducer() here,
    // but we don't ever need to call removeProducer() because the core
    // AudioLevelObserver code automatically removes closed producers
    if (producer.kind === 'audio') {
     // audioLevelObserver.addProducer({ producerId: producer.id });
    }

    roomState.producers.push(producer);
    roomState.peers[peerId].media[appData.mediaTag] = {
      paused,
      encodings: rtpParameters.encodings
    };
    wsend(ws, { type: msg.type, id: producer.id });
    broadcast({ type: "Newproducer", id: producer.id });
  } catch (e) {
	  console.log(e);
	  wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type=='recv-track'){
	
  try {
    let { peerId, mediaPeerId, mediaTag, rtpCapabilities } = msg;

    let producer = roomState.producers.find(
      (p) => p.appData.mediaTag === mediaTag &&
             p.appData.peerId === mediaPeerId
    );

    if (!producer) {
      let msg = 'server-side producer for ' +
                  `${mediaPeerId}:${mediaTag} not found`;
      err('recv-track: ' + msg);
      wsend(ws, {type:msg.type, error: msg });
      return;
    }

    if (!router.canConsume({ producerId: producer.id,
                             rtpCapabilities })) {
      let msg = `client cannot consume ${mediaPeerId}:${mediaTag}`;
      err(`recv-track: ${peerId} ${msg}`);
      wsend(ws, {type:msg.type, error: msg });
      return;
    }

    let transport = Object.values(roomState.transports).find((t) =>
      t.appData.peerId === peerId && t.appData.clientDirection === 'recv'
    );

    if (!transport) {
      let msg = `server-side recv transport for ${peerId} not found`;
      err('recv-track: ' + msg);
      wsend(ws, {type:msg.type, error: msg });
      return;
    }

    let consumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: true, // see note above about always starting paused
      appData: { peerId, mediaPeerId, mediaTag }
    });

    // need both 'transportclose' and 'producerclose' event handlers,
    // to make sure we close and clean up consumers in all
    // circumstances
    consumer.on('transportclose', () => {
      log(`consumer's transport closed`, consumer.id);
      closeConsumer(consumer);
    });
    consumer.on('producerclose', () => {
      log(`consumer's producer closed`, consumer.id);
      closeConsumer(consumer);
    });

    // stick this consumer in our list of consumers to keep track of,
    // and create a data structure to track the client-relevant state
    // of this consumer
    roomState.consumers.push(consumer);
    roomState.peers[peerId].consumerLayers[consumer.id] = {
      currentLayer: null,
      clientSelectedLayer: null
    };

    // update above data structure when layer changes.
    consumer.on('layerschange', (layers) => {
      log(`consumer layerschange ${mediaPeerId}->${peerId}`, mediaTag, layers);
      if (roomState.peers[peerId] &&
          roomState.peers[peerId].consumerLayers[consumer.id]) {
        roomState.peers[peerId].consumerLayers[consumer.id]
          .currentLayer = layers && layers.spatialLayer;
      }
    });

    wsend(ws, {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused
    });
  } catch (e) {
    console.error('error in /signaling/recv-track', e);
    wsend (ws, {type:msg.type, error: e });
  }
	
	
}else if(msg.type=='pause-consumer'){
	 try {
    let { peerId, consumerId } = msg,
        consumer = roomState.consumers.find((c) => c.id === consumerId);

    if (!consumer) {
      err(`pause-consumer: server-side consumer ${consumerId} not found`);
      wsend(ws, {type:msg.type, error: `server-side producer ${consumerId} not found` });
      return;
    }

    log('pause-consumer', consumer.appData);

    await consumer.pause();

    wsend(ws, {type:msg.type, paused: true});
  } catch (e) {
    console.error('error in /signaling/pause-consumer', e);
    wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type=='resume-consumer'){
	 try {
    let { peerId, consumerId } = msg,
        consumer = roomState.consumers.find((c) => c.id === consumerId);

    if (!consumer) {
      err(`pause-consumer: server-side consumer ${consumerId} not found`);
      wsend(ws, {type:msg.type, error: `server-side consumer ${consumerId} not found` });
      return;
    }

    log('resume-consumer', consumer.appData);

    await consumer.resume();

    wsend(ws, {type:msg.type, resumed: true });
  } catch (e) {
    console.error('error in /signaling/resume-consumer', e);
    wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type=='close-consumer'){
	try {
  let { peerId, consumerId } = msg,
      consumer = roomState.consumers.find((c) => c.id === consumerId);

    if (!consumer) {
      err(`close-consumer: server-side consumer ${consumerId} not found`);
      wsend(ws, {type:msg.type, error: `server-side consumer ${consumerId} not found` });
      return;
    }

    await closeConsumer(consumer);

    wsend(ws, {type:msg.type, closed: true });
  } catch (e) {
    console.error('error in /signaling/close-consumer', e);
    wsend(ws, {type:msg.type, error: e });
  }
}else if(msg.type=='consumer-set-layers'){
	
  try {
    let { peerId, consumerId, spatialLayer } = msg,
        consumer = roomState.consumers.find((c) => c.id === consumerId);

    if (!consumer) {
      err(`consumer-set-layers: server-side consumer ${consumerId} not found`);
      wsend(ws, {type:msg.type, error: `server-side consumer ${consumerId} not found` });
      return;
    }

    log('consumer-set-layers', spatialLayer, consumer.appData);

    await consumer.setPreferredLayers({ spatialLayer });

    wsend(ws, {type:msg.type, layersSet: true });
  } catch (e) {
    console.error('error in /signaling/consumer-set-layers', e);
    wsend({type:msg.type, error: e });
  }
}else if(msg.type=='pause-producer'){
	try {
    let { peerId, producerId } = msg,
        producer = roomState.producers.find((p) => p.id === producerId);

    if (!producer) {
      err(`pause-producer: server-side producer ${producerId} not found`);
      wsend(ws, {type:msg.type, error: `server-side producer ${producerId} not found` });
      return;
    }

    log('pause-producer', producer.appData);

    await producer.pause();

    roomState.peers[peerId].media[producer.appData.mediaTag].paused = true;

    wsend(ws, {type:msg.type, paused: true });
  } catch (e) {
    console.error('error in /signaling/pause-producer', e);
    wsend(ws, {type:msg.type, error: e });
  }
	}else if(msg.type=='resume-producer'){
		 try {
    let { peerId, producerId } = msg,
        producer = roomState.producers.find((p) => p.id === producerId);

    if (!producer) {
      err(`resume-producer: server-side producer ${producerId} not found`);
      wsend(ws, {type:msg.type, error: `server-side producer ${producerId} not found` });
      return;
    }

    log('resume-producer', producer.appData);

    await producer.resume();

    roomState.peers[peerId].media[producer.appData.mediaTag].paused = false;

    wsend(ws, {type:msg.type, resumed: true });
  } catch (e) {
    console.error('error in /signaling/resume-producer', e);
    wsend(ws, {type:msg.type, error: e });
  }
	}else{}
}



audioLevelObserver.on('volumes', (volumes) => {
    const { producer, volume } = volumes[0];
   // console.log('*****************audio-level volumes event', producer.appData.peerId, volume);
    roomState.activeSpeaker.producerId = producer.id;
    roomState.activeSpeaker.volume = volume;
    roomState.activeSpeaker.peerId = producer.appData.peerId;
    wsend(ws,{type:'ok'});})
/*
function wsend(obj){
	//console.log('hallo wsend ', obj)
	let a;
	try{
		a = JSON.stringify(obj);
		if(ws.readyState === WebSocket.OPEN) socket.send(a);
		}catch(e){console.log(e)}
	}*/
  // periodically clean up peers that disconnected without sending us
  // a final "beacon"
  /*
  setInterval(() => {
    let now = Date.now();
    Object.entries(roomState.peers).forEach(([id, p]) => {
      if ((now - p.lastSeenTs) > config.httpPeerStale) {
        warn(`removing stale peer ${id}`);
     //   closePeer(id);
      }
    });
  }, 1000);*/

  // periodically update video stats we're sending to peers
 // setInterval(updatePeerStats, 3000);








		//}
	async function cleanUpPeerDa(){
			 try {
   // let { peerId } = msg;
   // log('leave', peerId);

    await closePeer(socket.peerId);
   // wsend({type:msg.type, left: true });
  } catch (e) {
    console.error('error in /signaling/leave', e);
  //  wsend({type:msg.type, error: e });
  }
	 // cleanUpPeer(ws);
  }
		return { mediasoup_t, cleanUpPeerDa  }
	}
	module.exports = { handleMediasoup: handleMediasoup }
	
function closePeer(peerId) {
  log('closing peer', peerId);
  for (let [id, transport] of Object.entries(roomState.transports)) {
    if (transport.appData.peerId === peerId) {
      closeTransport(transport);
    }
  }
  delete roomState.peers[peerId];
}

async function closeTransport(transport) {
  try {
    log('closing transport', transport.id, transport.appData);

    // our producer and consumer event handlers will take care of
    // calling closeProducer() and closeConsumer() on all the producers
    // and consumers associated with this transport
    await transport.close();

    // so all we need to do, after we call transport.close(), is update
    // our roomState data structure
    delete roomState.transports[transport.id];
  } catch (e) {
    err(e);
  }
}

async function closeProducer(producer) {
  log('closing producer', producer.id, producer.appData);
  try {
    await producer.close();

    // remove this producer from our roomState.producers list
    roomState.producers = roomState.producers
      .filter((p) => p.id !== producer.id);

    // remove this track's info from our roomState...mediaTag bookkeeping
    if (roomState.peers[producer.appData.peerId]) {
      delete (roomState.peers[producer.appData.peerId]
              .media[producer.appData.mediaTag]);
    }
  } catch (e) {
    err(e);
  }
}

async function closeConsumer(consumer) {
  log('closing consumer', consumer.id, consumer.appData);
  await consumer.close();

  // remove this consumer from our roomState.consumers list
  roomState.consumers = roomState.consumers.filter((c) => c.id !== consumer.id);

  // remove layer info from from our roomState...consumerLayers bookkeeping
  if (roomState.peers[consumer.appData.peerId]) {
    delete roomState.peers[consumer.appData.peerId].consumerLayers[consumer.id];
  }
}
/*config  {
  worker: {
    rtcMinPort: 10000,
    rtcMaxPort: 20100,
    logLevel: 'error',
    logTags: [ 'info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp' ]
  },
  router: { mediaCodecs: [ [Object], [Object], [Object], [Object], [Object] ] },
  webRtcTransport: { listenInfos: [ [Object], [Object] ] }
}

 * 
 * 
 * 
 */

async function createWebRtcTransport({ peerId, direction }) {
  //const {
    //listenIps,
   // initialAvailableOutgoingBitrate
 // } = config.mediasoup.webRtcTransport;
//console.log("**** ROUTER ****", router)
  const transport = await router.createWebRtcTransport({
    listenInfos: config.webRtcTransport.listenInfos,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate: 1000000,
    appData: { peerId, clientDirection: direction }
  });

  return transport;
}


async function updatePeerStats() {
  for (let producer of roomState.producers) {
    if (producer.kind !== 'video') {
      continue;
    }
    try {
      let stats = await producer.getStats(),
          peerId = producer.appData.peerId;
      roomState.peers[peerId].stats[producer.id] = stats.map((s) => ({
        bitrate: s.bitrate,
        fractionLost: s.fractionLost,
        jitter: s.jitter,
        score: s.score,
        rid: s.rid
      }));
    } catch (e) {
      warn('error while updating producer stats', e);
    }
  }

  for (let consumer of roomState.consumers) {
    try {
      let stats = (await consumer.getStats())
                    .find((s) => s.type === 'outbound-rtp'),
          peerId = consumer.appData.peerId;
      if (!stats || !roomState.peers[peerId]) {
        continue;
      }
      roomState.peers[peerId].stats[consumer.id] = [{
        bitrate: stats.bitrate,
        fractionLost: stats.fractionLost,
        score: stats.score
      }]
    } catch (e) {
      warn('error while updating consumer stats', e);
    }
  }
}
