const Router = require('koa-router');
const shortid = require('shortid');
const passport = require('koa-passport');
const axios = require("axios").default;
const articles = require('../views/articles.js');
const pub = new Router();

const tg_api = '7129138329:AAGl9GvZlsK3RsL9Vb3PQGoXOdeoc97lpJ4';
const VIDEOCHAT_TG_ID = '-1002494074502';

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
	botMessage((ctx.state.user?ctx.state.user.name:'A guest ') + ' visited a wallet.');
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
