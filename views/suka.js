const suka=function(n){
	//console.log(n);
	return `<!DOCTYPE html><html lang="ru">
<head>
		<title>chatikon - guests</title>
	<script src="/js/globalik.js"></script>
		</head><body>
		<main id="pagewrap">
		<a href="/">home</a>
		<h1>Guests</h1>
		<button onclick="removeAllList(this);">Remove All</button>
		<hr>
		<section id="listSec">
		${n.guests ? getGuests(n.guests) : "No one else"}
		</section>
		</main> <script src="/js/guest.js"></script> </body></html>`;
}
module.exports = {suka}
function getGuests(arr){
		
		//console.log('arr ', arr);
		let arr2 = arr.sort(function(a, b){
			return new Date(a.d) - new Date(b.d);
		});
		let arr3 = arr2.reverse();
		let s = "";
		arr3.forEach(function(el, i){
s+=`<div>${i + 1}) ${el.country}, ${el.city}, ${new Date(el.d).toLocaleString('ru-RU', {year:'numeric',weekday:'long',month:'long',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',hour12:false})}.</div>`;
//toLocaleString('ru-RU', {year:'numeric',weekday:'long',month:'long',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',hour12:false});
		});
		return s;
	};
