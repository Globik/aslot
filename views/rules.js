const { footer } = require('./footer.js');
const { login } = require('./login.js');
const { yametrika } = require('./yametrika.js');

const rules = function(n){
	let { a } = n;
	return `<!DOCTYPE html><html lang="ru"><head>
    
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Правила</title>
   <meta name="viewport" content="width=device-width,initial-scale=1.0"> 
    
    <link rel="icon" type="image/png" href="/img3/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/img3/favicon.svg" />
<link rel="shortcut icon" href="/img3/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/img3/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="Chatikon" />
    <meta name="description" content="Правила пользования групповым видеочатом" />
  <meta property="og:title" content="Правила" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://chatikon.ru/" />
  <meta property="og:image" content="https://chatikon.ru/img/home.jpg" />
  <meta property="og:site_name" content="Правила" />
  <meta property="og:description" content="Правила пользования групповым видеочатом" />
  
  <meta itemprop="name" content="Правила"/>
<meta itemprop="description" content="Правила пользования групповым видеочатом" />
<meta name="description" content="Правила пользования групповым видеочатом"/>
    
    <!-- <link rel="icon" href="/img/w4.png"> -->
     <link href="/css/slot2.css" rel="stylesheet">
     <link href="/css/slug.css" rel="stylesheet">
    <link href="/css/note.css" rel="stylesheet">
    
    <link href="/css/output.css" rel="stylesheet">
    <link href="/css/login3.css" rel="stylesheet"> 
    
    <script src="/js/globalik.js"></script>
   <!-- <script>window.yaContextCb=window.yaContextCb||[]</script>
    <script src="https://yandex.ru/ads/system/context.js" async></script>
    -->
    <script async src="https://yastatic.net/share2/share.js"></script>
    ${yametrika({})}
    </head><body> <main id="somemain"><nav class="vhod">
    <div><a ${n.user?`onclick="logout(this);"`:''} href="${n.user?'#':'#login'}">${n.user?'Выход':'Вход'}</a></div>
    </nav><a href="/">На главную</a>
    <article><h1>Правила пользования групповым видеочатом</h1>
   <p> 1. <strong>Уважение к другим участникам</strong>  
   - Не допускается оскорбление, унижение, дискриминация или травля других пользователей.  
   - Будьте вежливы и доброжелательны.
</p><p>
2. <strong>Запрет на нецензурную лексику</strong>  
   - Использование мата, грубых выражений и непристойных шуток запрещено.  
   - Соблюдайте культурный и уважительный тон общения.
</p><p>
3. <strong>Запрет на демонстрацию обнажённого тела</strong>  
   - Запрещено показывать себя или других людей обнажёнными, а также транслировать контент сексуального характера.  
   - Нарушение этого правила приведёт к немедленному удалению из чата.
</p><p>
4. <strong>Запрет на рекламу запрещённых веществ и услуг</strong> 
   - Нельзя рекламировать или пропагандировать наркотики, алкоголь, табак, оружие, а также любые другие запрещённые законом вещества или услуги.  
   - Запрещено распространение ссылок на сомнительные или незаконные ресурсы.
</p><p>
5. <strong>Соблюдение законов</strong>  
   - Запрещено нарушать законодательство страны, в которой вы находитесь, а также правила платформы, на которой проводится видеочат.  
   - Нельзя призывать к насилию, экстремизму или другим противоправным действиям.
</p><p>
6. <strong>Конфиденциальность</strong>  
   - Не распространяйте личную информацию других участников без их согласия.  
   - Запрещено записывать или транслировать видеочат без разрешения всех участников.
</p><p>
7. <strong>Запрет на спам и флуд</strong>  
   - Не отправляйте повторяющиеся сообщения, рекламу или бесполезный контент, который мешает общению.  
   - Используйте чат по назначению.
</p><p>
8. <strong>Соблюдение тематики чата</strong>  
   - Придерживайтесь темы обсуждения, если она задана.  
   - Не уводите разговор в сторону, если это мешает другим участникам.
</p><p>
9. <strong>Реакция на нарушения</strong>  
   - Администраторы чата имеют право удалять нарушителей, блокировать их доступ или выдавать предупреждения.  
   - Если вы стали свидетелем нарушения, сообщите об этом администратору.
</p><p>
10. <strong>Технические требования</strong>  
    - Убедитесь, что ваше оборудование (камера, микрофон) работает корректно.  
    - Не создавайте лишнего шума или помех для других участников.
</p>
    
    </article>
    </main>${login({})}${footer({})}</body></html>`;
}
module.exports = { rules }
