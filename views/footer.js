const footer = function(n){
	let a = new Date();
	return `<footer>
	<div><a href="/policy">Правила</a></div>
	<div><span>&#9400; 2025 - </span><span>${a.getFullYear()}г.</span></div></footer>`;
}
module.exports = { footer }
