// ssh root@45.89.66.225 (chelikon.space)
// scp -r /chatserver/chatroulette user@remotehost:/chats
const Koa = require('koa');
const fs = require('fs');
const https = require('https');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const { koaBody } = require('koa-body');
const axios = require("axios").default;
const { handleMediasoup, ev } = require("./libs/mediasoup_help3.js");
const passport = require('koa-passport');
const WebSocket = require('ws');
const Router = require('koa-router');
const url = require('url');
const Pool = require('pg-pool');
const PgStore = require('./libs/pg-sess.js');
const shortid = require('shortid');
const PS = require('pg-pubsub');
const pgtypes = require('pg').types;
const render = require('./libs/render.js');

const tg_api = '7129138329:AAGl9GvZlsK3RsL9Vb3PQGoXOdeoc97lpJ4';
const VIDEOCHAT_TG_ID = '-1002494074502';

const serve = require('koa-static');
const session = require('koa-session');
const pubrouter = require('./routes/pubrouter.js');
const adminrouter = require('./routes/adminrouter.js');
//const {meta, warnig, site_name} = require('./config/app.json');
var DB_URL = 'postgress://globi:globi@127.0.0.1:5432/slot';

//const pgn=require('pg').native.Client; // see test/pg.js for LD_LIBRARY_PATH
pgtypes.setTypeParser(1114, str => str);
const pars = url.parse(DB_URL);
const cauth = pars.auth.split(':');
const pg_opts = {
    user: cauth[0], password: cauth[1], host: pars.hostname, port: pars.port, database: pars.pathname.split('/')[1],
    ssl: false
    //Client:pgn
};
const pool = new Pool(pg_opts);
const pg_store = new PgStore(pool);
pool.on('connect', function (client) {
    console.log('pool connect')
})
pool.on('error', function (err, client) {
    console.log('db err in pool: ', err.name)
})
pool.on('acquire', function (client) {
})

const app = new Koa();

app.keys = ['your-secret']
app.use(serve(__dirname + '/public'));
app.use(session({/*store: pg_store,*/ maxAge: 24 * 60 * 60 * 1000}, app))

render(app, {root: 'views', development: (process.env.DEVELOPMENT == "yes" ? false : false)})
app.use(koaBody());
require('./auth/auth.js')(pool, passport)


app.use(passport.initialize())
app.use(passport.session())
app.use(async (ctx, next) => {
	ctx.state.site = 'site_name.com';
	
    ctx.db = pool;
	await next();
})

app.on('error', function (err, ctx) {
    console.log('APP ERROR: ', err.message, 'ctx.url : ', ctx.url);
});


async function rt() {
    try {
        await pg_store.setup()
    } catch (err) {
        console.log("err setup pg_store", err.name, '\n', err);
    }
    ;
}

rt()

app.use(pubrouter.routes()).use(pubrouter.allowedMethods());

app.use(adminrouter.routes()).use(adminrouter.allowedMethods());

async function some(){ 
try{
	//let d = await pool.query(`insert into users(bname,pwd, brole) values($1,$2,$3)`, ['s', '1','a']);
	//let d = await pool.query(`select*from users`, []);
	//console.log('d ', d.rows);
}catch(err){
	console.log(err);
}
}
some();
//etc/letsencrypt/live/chatikon.ru/fullchain.pem
//Key is saved at:         /etc/letsencrypt/live/chatikon.ru/privkey.pem

const dkey = "/etc/letsencrypt/live/chatikon.ru/privkey.pem";
const dcert = "/etc/letsencrypt/live/chatikon.ru/fullchain.pem";

const port = process.env.DEVELOPMENT=='yes'?3000:443;
var servi;
if(process.env.DEVELOPMENT == "yes"){
servi=app.listen(port, () => {
 console.log(`Started on localhost:${port}`);
})
}else{
servi = https.createServer({
     key: fs.readFileSync(dkey),
     cert: fs.readFileSync(dcert),
    },
    app.callback()).listen(port, ()=>{
    console.log('Started on https://example.ru:' + port);
  });
}



    const wss = new WebSocket.Server({
        server: servi, /*verifyClient:(info,cb)=>{
	console.log('info.origin: ', info.origin);
if(process.env.DEVELOPMENT === "yes"){cb(true);return;}else{
if(info.origin === ORIGINAL){cb(true);return;}
cb(false);
	}
	}*/
    });
    function noop() {}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 1000 * 60);

function heartbeat() {
  this.isAlive = true;
}

let obid = function () {
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
var ad=new Map();
let ada = [];
ad.set(1,{id:1,name:"alik"})
console.log(...ad)
for(const value of ad.values()){
	ada.push(value);
}
//console.log('ada ',ada)
var TOTALSPEAKERS = 0;
var TOTALCONSUMERS = 0;
var k=1;
  wss.on("connection", async function ws_connect(ws, req) {
	  console.log("websocket connected");
	const ip = req.socket.remoteAddress;
	setGuest(ip);
	 ws.isAlive = true;
	 ws.id=k;//obid();
	 ws.producer = false;
	 ws.consumer = false;
	 wsend(ws, { type: "welcome", yourid: ws.id });
	// ws.room_id="alik";
	 k++;
  ws.on("pong", heartbeat);
  botMessage('A guest joined chatikon.ru');
   broadcast_all({ type: "howmuch", value: wss.clients.size, count: TOTALSPEAKERS, consumerscount: TOTALCONSUMERS });
   let msg;
	ws.on('message', async function onMessage(msgi){
		//console.log(msgi);
		try{
     msg = JSON.parse(msgi)
}catch(e){return;}
if(msg.request == "mediasoup"){
	handleMediasoup( ws, msg, WebSocket, wss, pool ).mediasoup_t();
	return;
}
	});
	ws.on('close', async function onClose(){
		 broadcast_all({ type: "howmuch", value: wss.clients.size });
		 handleMediasoup( ws, msg, WebSocket, wss, pool ).cleanUpPeerDa();
	});
	ws.on('error', function(er){console.log(er)});
})
  ev.on('total_speakers',(data)=>{
	  TOTALSPEAKERS = data.count;
	  data.type = 'total_speakers';
	  broadcast_all(data);
  });
  ev.on('total_consumers', (data)=>{
	  TOTALCONSUMERS = data.count;
	  data.type = 'total_consumers';
	  broadcast_all(data);
  });
  function wsend(ws, obj) {
  let a;
  try {
    a = JSON.stringify(obj);
  //  console.log("type:", obj.type);
    if (ws.readyState === WebSocket.OPEN) ws.send(a);
  } catch (e) {}
}  
function broadcast_all(obj) {
  wss.clients.forEach(function each(client) {
    wsend(client, obj);
  });
}

const abstract_key = "7f87b155a0ca434a9d43ac2266264ad6";

const re = /([0-9]{1,3}[\.]){3}[0-9]{1,3}/;
function setGuest(ip){
	if(process.env.DEVELOPMENT == "yes"){return;}

// = "78.81.155.17";
//try{
var a = ip.match(re);
 var r = a[0];
 //var r = "78.81.155.17"
//}catch(e){
	//console.log(e);
//} 
setTimeout(function(){
	console.log('""R ', r );
	axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${abstract_key}&ip_address=${r}&fields=country,city,flag`).then(async response=>{
	//console.log('data: ', response.data, 'status', response.status, response.data.error);
	if(response.status == 200){
		//response.data.city response.data.country response.data.flag.unicode svg
		
		try{
		//await db.db.insertAsync({city: response.data.city, country: response.data.country, date: new Date()});
		await pool.query(`insert into guest(city,country) values($1,$2)`, [ response.data.city, response.data.country ]);
	}catch(er){
		console.log(er);
		
		}
	}
	
}).catch(async error=>{
	if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
	
})
}, 1000)
}
async function botMessage(txt){
	if(process.env.DEVELOPMENT == 'yes')return;
	try{
		await axios.post(`https://api.telegram.org/bot${tg_api}/sendMessage`, {
    chat_id: VIDEOCHAT_TG_ID,
    text: txt,
    parse_mode: 'html',
    disable_notification: false
  });
	}catch(e){
		console.log(e);
		}
}
