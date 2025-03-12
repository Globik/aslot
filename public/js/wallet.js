var isOpen = false;
var userId = gid('userId');
function panelOpen(el){
			var settingspanel = document.getElementById("settingspanel");
			if(!isOpen){
			settingspanel.className = "open";
			isOpen = true;	
			}else{
				settingspanel.className = "";
				isOpen = false;
			}
		}
		let kk = 0;
function openSection(el){
	let criddata = el.getAttribute('data-cr');
		if(criddata){
		let bel = gid(`${criddata}`);
		if(bel.style.display == 'block'){
			note({ content: 'Сперва создайте кошелек!', type: 'error', time: 5 });
			return;
		}
	}
	let c = el.getAttribute('data-section');
	const section = gid(`${c}`);
	let state = el.getAttribute('data-state');
	let b = el.getAttribute('data-span');
	let arrow = gid(`${b}`);
	if(state == 'close'){
		section.style.display = 'block';
		el.setAttribute('data-state', 'open');
		arrow.innerHTML = '&#9650;';
		let dataForm = el.getAttribute('data-form');
		if(dataForm){
			let su = gid(`${dataForm}`);
			if(su){
				su.reset();
				su.setAttribute('data-click', 'no');
			}
		}
		let wallet = el.getAttribute('data-wallet');
		let isClicked = el.getAttribute('data-click');
		let adr = el.getAttribute('data-receiver');
		let addresse = gid(`${adr}`);
		//alert(4);
		console.log(adr,' ', isClicked,' ',wallet);
		if(adr&&isClicked&&wallet){
			let entry = localStorage.getItem(wallet);
			if(entry){
				addresse.textContent = entry;
			}else{
			if(isClicked == 'yes') return;
			let data = {};
			data.wallet = wallet;
			data.userid = userId.value;
			data.username = userName.value;
			vax('post','/api/createAddresse', data, on_create_addresse, on_create_wallet_error, el, false);
	el.setAttribute('data-click', 'yes');
	el.classList.add('puls');
}
		}
	}else{
		section.style.display = 'none';
		el.setAttribute('data-state', 'close');
		el.setAttribute('data-click', 'yes');
		arrow.innerHTML = '&#9660;';
	}
}

function on_create_addresse(l, ev){
	ev.classList.remove('puls');
	if(l.error){
		note({ content: l.error, type: 'error', time: 5 });
		ev.setAttribute('data-click', 'no');
		return;
	}
	let adr = ev.getAttribute('data-receiver');
	let wallet = ev.getAttribute('data-wallet');
	let addresse = gid(`${adr}`);
	kk++;
	addresse.textContent = l.address?l.address:'some empty addresse '+kk;
	note({ content: l.info, type: 'info', time: 5 });
	
	 localStorage.setItem(wallet, l.address);
	  
}

function createWallet(el){
	const was = el.getAttribute('data-wallet');
	let isClicked = el.getAttribute('data-click');
	if(isClicked && isClicked == 'yes') return;
	//alert(was);
	let d = {};
	d.wallet = was;
	d.userid = userId.value;
	d.username = userName.value;
	vax('post','/api/createWallet', d, on_create_wallet, on_create_wallet_error, el, false);
	el.setAttribute('data-click', 'yes');
	el.classList.add('puls');
}
function on_create_wallet(l, ev){
	ev.classList.remove('puls');
	if(l.error){
		//ev.disabled = false;
		let a = ev.getAttribute('data-click');
		if(a && a == 'yes') ev.setAttribute('data-click', 'no');
		note({ content: l.error, type: 'error', time: 5 });
		return;
	}
	console.log('info: ', l.info);
	note({ content: l.info, type: 'info', time: 5 });
	if(!ev.name){
		ev.remove();
	}else{
		ev.reset();
	}
	
} 
function on_create_wallet_error(l, ev){
	note({ content: l, type: 'error', time: 5 });
	ev.classList.remove('puls');
	//ev.disabled = false;
	let a = ev.getAttribute('data-click');
	if(a && a == 'yes') ev.setAttribute('data-click', 'no');
}
function sendCoin(el){
	try{
		let criddata = el.getAttribute('data-cr');
		if(criddata){
		let bel = gid(`${criddata}`);
		if(bel.style.display == 'block'){
			note({ content: 'Сперва создайте кошелек!', type: 'error', time: 5 });
			return false;
		}
	}
	//alert(el.name+' '+el.adr.value+' '+el.amount.value);
	let isClicked = el.getAttribute('data-click');
	if(isClicked && isClicked == 'yes') return false;
	let d = {}; var valid;
	d.wallet = el.name;
	d.adr = el.adr.value;
	if(d.wallet == 'btc'){
	 valid = WAValidator.validate(d.adr, 'bitcoin');
	 if(!valid){
		 note({ content: 'Не валидный адрес!', type: 'error', time: 5 });
		 return false;
	 }
 }else if(d.wallet == 'eth'){
	 valid = WAValidator.validate(d.adr, 'ethereum');
	 if(!valid){
		 note({ content: 'Не валидный адрес!', type: 'error', time: 5 });
		 return false;
	 }
 }else if(d.wallet == 'ltc'){
	  valid = WAValidator.validate(d.adr, 'litecoin');
	 if(!valid){
		 note({ content: 'Не валидный адрес!', type: 'error', time: 5 });
		 return false;
	 }
 }else{
	 valid = WAValidator.validate(d.adr, 'ethereum');
	 if(!valid){
		 note({ content: 'Не валидный адрес!', type: 'error', time: 5 });
		 return false;
	 }
 }
	d.amount = el.amount.value;
	d.userid = userId.value;
	d.username = userName.value;
	vax('post','/api/sendCoin', d, on_create_wallet, on_create_wallet_error, el, false);
	el.classList.add('puls');
	//el.disabled = true;
	el.setAttribute('data-click', 'yes');
	return false;
}catch(err){
	alert(err);
	return false;
}
}
function copyAdr(el){
	let content = el.getAttribute('data-receiver');
	//alert(content);
	let a = gid(`${content}`);
	let b = a.textContent;
	if(!b)return;
	navigator.clipboard.writeText(b).then(function(){
		note({ content: "OK, copied!", type: "info", time: 5 });
	}, function(err){
		//alert(err);
		note({ content: err, type: "error", time: 5 });
		console.log(err);
	});
}
async function check(){
	const wallet_id = 'ETHviSjvcPsm4epXYza7yMAKaTrw8UmFM3mEbNq91ApGgBUMQceDe';
	const url = 'https://api.bitaps.com/eth/testnet/v1/wallet/state/' + wallet_id;
	try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
