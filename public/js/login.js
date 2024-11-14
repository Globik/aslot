const formi = document.forms.loginform;
formi.addEventListener('submit', onformsubmit, false);

function onformsubmit(ev){
	ev.preventDefault();
	//alert(ev.target.username.value);
	let sdata = {};
	sdata.username = ev.target.username.value;
	sdata.password = ev.target.password.value;
	vax(ev.target.method, ev.target.action, sdata, on_login, on_login_error, ev.target, false);
}

function on_login(l, el){
	console.log(l);
} 
function on_login_error(l, el){
	console.error(l);
}
