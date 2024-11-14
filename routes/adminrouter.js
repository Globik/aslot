const Router = require('koa-router');

const admin = new Router();

module.exports = admin;


function auth(ctx, next) {
    //for xhr
    if (ctx.isAuthenticated() && ctx.state.user.brole == "superadmin") {
        return next()
    } else {
        ctx.throw(401, "Please log in.")
    }
}

function authed(ctx, next) {
    if (ctx.isAuthenticated() && ctx.state.user.brole == "superadmin") {
        return next()
    } else {
        ctx.redirect('/');
    }
}
