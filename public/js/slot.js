var loc1 = location.hostname + ":" + location.port;
var loc2 = location.hostname;
var loc3 = loc1 || loc2;
var new_uri;

var sock = null;
if (window.location.protocol === "https:") {
  new_uri = "wss:";
} else {
  new_uri = "ws:";
}

const onlinecount = document.getElementById('onlinecount');
const btc = document.getElementById("btc");
 var stagecontainer = document.getElementById('stage');
 const mybtcaddress = document.forms.mybtcaddress;
 mybtcaddress.addEventListener('submit', onsaveaddress, false);
 mybtcaddress.addEventListener('reset', onReset, false);
 var heightrad = window.getComputedStyle(stagecontainer, null).getPropertyValue("height");
console.log(parseFloat(heightrad));
//var fln = parseFloat(heightrad)/4.2;
var fln= 200;//120;
 var FACES_PER_RING = 12;
            var RING_RADIUS = fln;//heightrad;//200;
            var FACE_ANGLE = 360 / FACES_PER_RING;
var lets = [];
            function setup_faces (row)
            {
                for (var i = 0; i < FACES_PER_RING; i ++) {
                    var face = document.createElement('div');
                    face.className = 'face';
                    //face.setAttribute('data-number', i);
                    // compute and assign the transform for this face
                    var transform = 'rotateX(' + getDefaultRotation(i) + 'deg) translateZ(' + RING_RADIUS + 'px)';
                    face.style.transform = transform;
                    // setup the number to show inside the face
                    var content = face.appendChild(document.createElement('p'));
                    content.textContent = i;
                    // add the face to the row
                    row.appendChild(face);
                }
            }

            function getDefaultRotation(index) {
                return FACE_ANGLE * index;
            }

            var styleElement;
            function updateDynamicCss(css){
                if (!styleElement){                
                    var head = document.head || document.getElementsByTagName('head')[0],
                        styleElement = document.createElement('style');

                    head.appendChild(styleElement);
                }

                styleElement.type = 'text/css';
                if (styleElement.styleSheet){
                    styleElement.styleSheet.cssText = css;
                } else {
                    styleElement.innerHTML = css;
                }
            }
		var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		var proem = document.getElementById("proem");
		var chatbox = document.getElementById("chatbox");
		//let k = arr[Math.floor(Math.random()*arr.length)];
		//alert(k);
            var timeRun = 0;
            var defaultAnimationStuff = 'animation-duration: 5s; animation-iteration-count: 1; animation-fill-mode: forwards; animation-timing-function: ease-in-out;';

            var currentState = [0,0,0];
			var winarr = []
			var si = 0;
            function init ()
            {
                setup_faces(document.getElementById('ring-1'));
                setup_faces(document.getElementById('ring-2'));
                setup_faces(document.getElementById('ring-3'));
              //  alert(0+Number(0.009595));
				//	localStorage.clear();
                const mybtc = localStorage.getItem("mybtc");
                const mybtcadr = localStorage.getItem("mybtcadr");
                if(mybtc){
					btc.textContent = mybtc;
				}

				if(mybtcadr){
					//alert(mybtcaddress.btcadr.value);
					mybtcaddress.btcadr.value = mybtcadr;
				}



                document.querySelector('.startSpinn').addEventListener('click', function(ev){
					proem.className = "";
					ev.target.disabled = true;
                    var cssStr = [];

                    var i = 4;
                    while(--i) {
                        var input = document.getElementById('input'+i);

                       // var num = Number(input.value) || 0;
                       
		var  ka = arr[Math.floor(Math.random()*arr.length)];
	//var num = 7;
						
                        var num = ka;
                        winarr[si]=num;
                        si++;
                        var nextState = num = (0 - getDefaultRotation(num));    
                        num -= (5 * 360);                       

                        cssStr.push('@keyframes ringAnimation' + i + '' + timeRun + ' { 0% { transform: rotateX(' + currentState[i] + 'deg); } 100% { transform: rotateX(' + num + 'deg); }}');

                        var ring = document.getElementById('ring-' + i);                  
                        ring.setAttribute('style', 'transform: rotateX(' + currentState[i] + 'deg);'); 
						//ring.setAttribute('data-number', i );
                        currentState[i] = nextState;
                    }

                    updateDynamicCss(cssStr.join(''));

                    i = 4;
                    while(--i){                  
                        window.setTimeout(function(i, timeRun){ 
                            return function() {
                                document.getElementById('ring-' + i).setAttribute('style', 'animation-name: ringAnimation' + i + '' + timeRun +';' + defaultAnimationStuff); 
                                var li = document.getElementById('ring-' + i).getAttribute('data-number');
                                document.getElementById('ring-' + i).onanimationend=function(){
									
									if(i === 1){
										let bu = winarr.reverse();
								//var b = 0;
									insertMessage("У вас: "  + bu.join(', '));
									lets.push({ type:"1", txt: "У вас: "  + bu.join(', ') });
									
									if((bu[0]===bu[1]&&bu[2]!=6&&bu[2]!=7) || (bu[1]===bu[2] && bu[0]!=6&&bu[0]!=7)){
										var b = 0.009595;
										//let a = Number.parseFloat(btc.textContent).toFixed(6);
										let a = Number(btc.textContent);
										let c = a + b;
										btc.textContent = c.toFixed(6);
										localStorage.setItem("mybtc", btc.textContent);
										let ni = "Поздравляем Вы выиграли " + b + " биткоинов!";
										lets.push({ type: "2", txt: ni });
										insertMessage("<span class=\"doublewin\">" + ni + "</span>");
									}
									if(bu[0]==6&&bu[1]==6&&bu[2]==6){
										var b = 0.028786;
										let a = Number.parseFloat(btc.textContent).toFixed(6);
										let c = a + b;
										btc.textContent = c;
										localStorage.setItem("mybtc", btc.textContent);
										let ni1 = "Вы выиграли " + b + " биткоинов!";
										lets.push({ type: "3", txt: ni1 });
										insertMessage("<span class=\"swin\">" + ni1 + "</span>");
									}
									if(bu[0]==7&&bu[1]==7&&bu[2]==7){
										var b = 1;
										let a = Number.parseFloat(btc.textContent).toFixed(6);
										let c = a + b;
										btc.textContent = c;
										localStorage.setItem("mybtc", btc.textContent);
										let ni2 = "Вы выиграли " + b + " биткоин!";
										lets.push({ type: "4", txt: ni2 });
										insertMessage("<span class=\"sevenwin\"></span>");
									}
										winarr = [];
										si = 0;
										proem.className = "active";
										ev.target.disabled = false;
									}
									}
                            }
                        }(i, timeRun), 50 + (Math.random() * 750));
                    }

                    timeRun+=1;
                });
            }

            // call init once the document is fully loaded
            window.addEventListener('load', init, false);
            
            function insertMessage(txt){
				
				let div = document.createElement("div");
				div.className = "msg";
				div.innerHTML = '<b>' + txt + '</b>';
				chatbox.appendChild(div);
				chatbox.scrollTop = chatbox.clientHeight + chatbox.scrollHeight;
			}
function fuck(){
	insertMessage("<span class=\"6win\">Вы выиграли 0,028786 биткоинов!</span>");
}
//alert(new Date().toJSON())
var pdf = document.querySelector(".pdf");
pdf.addEventListener('click', makepdf, false);
function makepdf(ev){
	//alert('pdf');
	if(lets.length == 0){
		alert('No content!');
		return;
	}
	const element = document.querySelector("#chatbox");
	    const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.addFont('/css/Roboto-Regular.ttf', 'Roboto', 'normal'); 
    doc.setFont('Roboto');
    let ot = 10;
    let k = 0;
    lets.forEach(function(el,i){
		if(el.type == "1"){
		doc.setTextColor(0, 0, 0);	
		}else if(el.type == "2"){
			doc.setTextColor(0, 255, 0);
		}else if(el.type == "3"){
			doc.setTextColor(0, 0, 255);
		}else if(el.type == "4"){
			doc.setTextColor(255, 0, 0);
		}
		if(k == 15){
			doc.addPage();
			k = 0;
			ot = 10;
		}
            doc.text(el.txt, 10, ot);
            ot+=20;
            k++;
		})
            doc.save("chatikon_" + new Date().toJSON() + ".pdf"); 
}

function onsaveaddress(ev){
	ev.preventDefault();
	let a = ev.target.btcadr.value;
	var valid = WAValidator.validate(a, 'bitcoin');
if(valid){
	localStorage.setItem('mybtcadr', a);
	//note({ content: "Сохранено!", type: "info", time: 5 })
}else{
	alert('no valid');
}
}
function onReset(ev){
	localStorage.removeItem('mybtcadr');
}
let dd = 0
function vyvod(el){
	if(btc.textContent == "0"){
		alert("Ноль биткоинов!");
		return;
	}
	if(!mybtcaddress.btcadr.value){
		alert("Пржалуйста, заполните поле вашего биткоин адреса в платежных реквизитах!");
		return;
	}
	let b = localStorage.getItem('turn');
	if(b){
		let c = Number(b);
		let d = c - dd;
		localStorage.setItem("turn", d);
	alert("Ваша очередь на " + d + " месте.");
	if(d < 5) localStorage.setItem("turn", "100000000000");
	}else{
	let a = 100000000000 - dd;
	localStorage.setItem("turn", a);
	alert("Ваша очередь на " + a + " месте.");
}
	dd++;
}


 if(!sock) sock = new  WebSocket(new_uri + "//" + loc3 + "/gesamt");

  sock.onopen = function () {
	 console.log("websocket opened");
	// heartbeat();
	// wsend({ type: "helloServer", VK: isVK.value, userId: gid("userId").value?gid("userId").value:'anonim3', isprem: Prem.value, nick: userName.value, logged:  Login()?"yes":"no", LANG: L });
  };
  sock.onerror = function (e) {
   // note({ content: "Websocket error: " + e, type: "error", time: 5 });
  };
  
  sock.onmessage = function (evt) {
	  
    let a;
    try {
      a = JSON.parse(evt.data);
      on_msg(a);
    } catch (e) {
    //  note({ content: e, type: "error", time: 5 });
    }
  };
  sock.onclose = function () {
    sock = null;
   
  };
  function on_msg(data){
	  console.log(data);
	  if(data.type == "howmuch"){
		  onlinecount.textContent = data.value;
	  }
  }
   function wsend(ws, obj) {
  let a;
  try {
    a = JSON.stringify(obj);
   ws.send(a);
  } catch (e) {}
}  
