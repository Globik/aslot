const Router = require('koa-router');
const shortid = require('shortid');
const passport = require('koa-passport');
const axios = require("axios").default;
const articles = require('../views/articles.js');
const pub = new Router();

const tg_api = '7129138329:AAGl9GvZlsK3RsL9Vb3PQGoXOdeoc97lpJ4';
const VIDEOCHAT_TG_ID = '-1002494074502';
const BITAPS_API = 'https://api.bitaps.com/';

pub.get('/', async ctx => {
    let db = ctx.db;
    console.log("USER ", ctx.state.user);
    ctx.body = await ctx.render('main_page2', {randomStr: shortid.generate(), articles: articles[1] })
})

pub.get('/blog', async ctx=>{
	let a = articles.filter(n=>{
		return n.number > 2;
	});
	botMessage('A guest in blog');
	ctx.body = await ctx.render('blog', { a });
})

pub.get('/blog/:slug', async ctx=>{
	let a = articles.find(el=>{return el.slug === ctx.params.slug});
	botMessage('A guest in ' + ctx.params.slug);
	ctx.body = await ctx.render('slug', { a });
})

pub.get('/rules', async ctx=>{
	botMessage("A guest in rules");
	ctx.body = await ctx.render('rules', {});
})

pub.get('/wallet', async ctx=>{
	console.log("USER ", ctx.state.user);
	botMessage((ctx.state.user?ctx.state.user.bname:'A guest ') + ' visited a wallet.');
	ctx.body = await ctx.render('wallet', {});
})

pub.get('/subscribe', async ctx => {
    let db = ctx.db;
   // console.log("USER ", articles);
    ctx.body = await ctx.render('subscribe', {randomStr: shortid.generate()  })
}) 

pub.post('/login', (ctx, next) => {
   if (!ctx.isAuthenticated()) {
    return passport.authenticate('local', function (err, user, info, status) {
		console.log('err, user, info, staatus ', err, user, info, status);
            
                if (err) {
                    ctx.body = {success: false, info: err.message};
                    ctx.throw(500, err.message);
                }
                if (user === false) {
                    ctx.body = {success: false, info: info.message}
                   // ctx.throw(401, info.message)
                } else {
                    ctx.body = {
                        success: true,
                        info: info.message,
                        nick: info.nick,
                        id: info.id,
                        redirect:/*ctx.session.dorthin ||*/ '/'
                    }
                    return ctx.login(user)
                }
           
        }
    )(ctx, next)
}
})

pub.post('/logout', async(ctx) => {

    ctx.logout()
    
    ctx.body = { message:"ok"}
   
   
   
   
});


pub.post('/signup', (ctx, next) => {

   
    return passport.authenticate('local-signup', async (err, user, info, status) => {
        console.log(err, user, info, status)

        if (user) {
           
        }


        
            console.log('XHR!!!!');
            //23505 name already in use
            if (err) {
                ctx.throw(409, err.message)
            }

            if (!user) {
                ctx.body = {success: false, info: info.message, code: info.code, bcode: info.bcode}
            } else {
                ctx.body = {
                    success: true,
                    message: info.message,
                    username: info.username,
                    user_id: info.user_id,
                    redirect:/*ctx.session.dorthin ||*/ '/'
                }
                
                return ctx.login(user)
            }
        
    })(ctx, next)
})

pub.get('/guests', async ctx=>{
	let db = ctx.db;
	let guests;
	try{
		let a = await db.query(`select * from guest`);
		guests = a.rows;
		//console.log('quests ', guests);
	}catch(e){
		console.log(e);
	}
	//console.log(guests);
	ctx.body = await ctx.render('suka', { guests });
})

pub.post("/api/deleteList", async ctx=>{
	let db = ctx.db;
	try{
		await db.query(`delete from guest`);
	}catch(e){
		ctx.throw(400, e)
	}
	ctx.body = { message: "OK, deleted"}
})

pub.post('/api/sendCoin', auth, async ctx=>{
	console.log('body : ', ctx.request.body);
	let { wallet, adr, amount, userid, username } = ctx.request.body;
	if(!wallet || !adr || !amount || !userid)ctx.throw(400, 'Not enough data.');
	console.log('WALLET ', ctx.state.user.dat[wallet+'w']);
	let z = (0.00060+0.00001+(0.0012*900))
	let sat = 100000000;//8 zeros satoshi so litoshi
	console.log('zifra: ', z);
	let z1 = 0.0012;//BTC=100 dollars or 174.46140213207795 satoshi=100 dollars
	let z2 = 174.46140213207795;//satoshi надо биткоин в сатоши переводить
	let ltc1 = 1.02390741 ;//ltc=100 dollars
	let ltc2 = ltc1*sat;// litoshi переводить
	let eth1 = 0.052;//100 usd// wei 10x18
	let eth2 = eth1*1e18;
	var suka = "10.004000";
	//console.log('USDT ', usdt12.toFixed(6));
	
	var d;
	try{
		 d = await axios.post(BITAPS_API + wallet + '/v1/wallet/send/payment/' + ctx.state.user.dat[wallet+'w'],{
			receivers_list: [{ "address": adr, "amount": suka}] //btc 900
		});
		console.log('data: ', d.data);
		
		if(d.status == 200){
	ctx.body = { info: "OK!" };
}else{
	ctx.body = { error: 'some error', code: 222 }
}
}catch(err){
	//console.log('erri ', err);
	if(err.response){
		if(err.response.data.error_code == 22){//26 = invalid amount
		ctx.body = { error: "Недостаточно средств!", code: 22 }
	}else if(err.response.data.error_code == 9){
		ctx.body = { error: "Слишком маленькая сумма", code: 9 }
	}else{
		ctx.body = { error: err.response.data.message, code: err.response.data.error_code }
	}
	}else{
	console.error('status ',err.status,' name ', err.name,' message ',err.message);
	//ctx.throw(400, err.name);
	ctx.body = { error: err.name, code: 333 }
}
}
})
pub.post('/api/createWallet', auth, async ctx=>{
	let a = ctx.request.body;
	let db = ctx.db;
	console.log(a);
	let { wallet, userid, username } = ctx.request.body;
	if(!wallet || !userid)ctx.throw(400, 'No wallet');
	let data;
	try{
		data = await axios.post(`${BITAPS_API}${wallet}/v1/create/wallet`, { callback_link: `https://chatikon.ru/cb${wallet}/${userid}` });
		console.log('data ', data.data, ' ', data.error);
		if(data.status == 200){
			//await db.query(`update users set dat=jsonb_insert(dat,'{${wallet}w}','"${data.data.wallet_id}"') where id=$1`, [ userid ]);
			await db.query(`update users set dat=jsonb_insert(dat,'{${wallet}w}',to_jsonb($1::text)) where id=$2`, [ data.data.wallet_id, userid ]);
			ctx.body = { info: "BTC кошелек создан успешно!" }
		}else{
			ctx.body = { error: 'not ok' }
		}
	}catch(err){
		console.log(err.name+' : '+err.message);
		ctx.throw(400, err)
	}
	//ctx.body = { info: a };
})
pub.post('/api/createAddresse', auth, async ctx=>{
	let { wallet, userid, username } = ctx.request.body;
	if(!wallet)ctx.throw(400, 'No wallet');
	if(!ctx.state.user.dat[wallet + 'w'])ctx.throw(400, 'no wallet id')
	let d;
	try{
		d = await axios.post(BITAPS_API + wallet+ '/v1/create/wallet/payment/address', {
			wallet_id: ctx.state.user.dat[wallet+'w']
		});
		console.log('data ', d.data);
	}catch(err){console.log(err);ctx.throw(400, err.message)}
	ctx.body = { info: 'OK', address: d.data.address };
})
module.exports = pub;

function auth(ctx, next) {
    //for xhr
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.throw(401, "Please log in.")
    }
}

function authed(ctx, next) {
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        ctx.redirect('/');
    }
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
