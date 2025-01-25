const Router = require('koa-router');
const shortid = require('shortid');
const passport = require('koa-passport');

const pub = new Router();

pub.get('/', async ctx => {
    let db = ctx.db;
    console.log("USER ", ctx.state.user);
    ctx.body = await ctx.render('main_page2', {randomStr: shortid.generate() })
})

pub.get('/subscribe', async ctx => {
    let db = ctx.db;
    console.log("USER ", ctx.state.user);
    ctx.body = await ctx.render('subscribe', {randomStr: shortid.generate() })
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
