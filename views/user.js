const user = function(n){
	return `<!DOCTYPE html><html lang="ru"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Users</title>
   <script src="/js/globalik.js"></script>
    </head><body>
  <nav><a href="/">home</a><a href="/users">users</a></nav>
  <h4>Users</h4>
  <section>${getUsers(n)}</section>
  </body></html>`;
}
  module.exports = { user }
  function getUsers(n){
	  let s = '';
	  n.users.forEach(function(el,i){
		  s+=`<div>${i+1}) <b>${el.bname}</b></div>`;
	  });
	  return s;
  }
