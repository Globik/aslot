const Router = require('koa-router');

const admin = new Router();

module.exports = admin;

admin.get("/dashboard", authed, async(ctx)=>{
	
	ctx.body = await ctx.render('dashboard', {});
})

admin.get("/users", authed, async(ctx)=>{
	let db = ctx.db;
	let users;
	try{
		let a = await db.query('select*from users order by id desc limit 100');
		users = a.rows;
	}catch(er){
		console.log(er);
	}
	ctx.body = await ctx.render('user', {users});
})
function auth(ctx, next) {
    //for xhr
    if (ctx.isAuthenticated() && ctx.state.user.brole == "superadmin") {
        return next()
    } else {
        ctx.throw(401, "Please log in.")
    }
}

function authed(ctx, next) {
    if (ctx.isAuthenticated() && ctx.state.user.brole == "admin") {
        return next()
    } else {
        ctx.redirect('/');
    }
}
