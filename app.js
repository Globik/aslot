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
app.use(session({store: pg_store, maxAge: 24 * 60 * 60 * 1000}, app))

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
const dkey = "/etc/letsencrypt/live/rouletka.ru-0001/privkey.pem";
const dcert = "/etc/letsencrypt/live/rouletka.ru-0001/fullchain.pem";

const port = process.env.DEVELOPMENT=='yes'?3000:443;
var servi;
if(process.env.DEVELOPMENT == "yes"){
servi=app.listen(port, () => {
 console.log(`Started on localhost:${port}`);
})
}else{
servi = https
  .createServer({
     key: fs.readFileSync(dkey),
     cert: fs.readFileSync(dcert),
    },
    app)
  .listen(port, ()=>{
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
    
    
    
