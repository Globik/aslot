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
module.exports = mediasoupOptions;
