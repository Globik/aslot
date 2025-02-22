const footer = function(n){
	let a = new Date();
	return `<footer>
	<div><a href="/rules">Правила</a></div>
	<div><span>&#9400; 2025 - </span><span>${a.getFullYear()}г.</span></div></footer>`;
}
module.exports = { footer }
