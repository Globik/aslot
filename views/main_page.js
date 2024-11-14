const main_page = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    <meta charset="utf-8">
    <title>world</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="/img/w4.png">
    <script src="/js/globalik.js"></script>
    </head><body>hello world 
    <form name="loginform" method="post" action="/login">
    <input type="text" placeholder="your name" required name="username"/><br>
    <input type="password" name="password" required placeholder="your password"/><br>
    <input type="submit" value="login"/>
    </form>
    <script src="/js/login.js"></script>
    </body>
    
    </html>`;
}

module.exports = { main_page }
