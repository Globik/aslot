function removeAllList(el){
	vax("POST", "/api/deleteList", {}, on_remove, on_error, el, false);
	//el.className = "puls";
}
function on_remove(l, el){
	note({ content: l.message, type: "info", time: 5 });
	//el.className = "";
	while(listSec.firstChild){
		listSec.firstChild.remove();
	}
}
function on_error(l, el){
	note({ content: l, type: "error", time: 5 });
	//el.className = "";
}
