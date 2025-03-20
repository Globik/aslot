var isOpen = false;
var userId = gid('userId');
var db;
var transaction;
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
			let transi = db.transaction('address');
			let entry = localStorage.getItem(wallet);
			let addresses = transi.objectStore('address');
			
			let res = addresses.get(wallet);
			res.onerror = (event) => {
				console.log(event);
  // Handle errors!
};
res.onsuccess = (event) => {
  // Do something with the request.result!
  console.log(`Name for SSN 444-44-4444 is ${res }`);

			console.log('result ', res);
			if(res.result&&res.result.address){
				addresse.textContent = res.result.address;
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
};
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
	 transaction = db.transaction('address', 'readwrite');
	 let addresses = transaction.objectStore('address');
	  let book = {
		  wallet: wallet,
		  address: l.address
	  }
	  let request = addresses.add(book);
	  request.onsuccess = function(){
		  console.log('address added success');
	  }
	  request.onerror = function(){
		  console.error('err ', request.error);
	  }
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
	if(l.wallet){
	if(l.wallet == 'btc'){
		getBalance({walletId: gid('btcHidden'), balanceDiv: 'btcBalance', coin: 'btc' })
	}else if(l.wallet == 'ltc'){
getBalance({walletId: gid('ltcHidden'), balanceDiv: 'ltcBalance', coin: 'ltc' })
}else if(l.wallet == 'eth'){
	getBalance({walletId: gid('ethHidden'), balanceDiv: 'ethBalance', coin: 'eth' })
}else if(l.wallet == 'usdt-erc20'){
	getBalance({walletId: gid('usdtHidden'), balanceDiv: 'usdtBalance', coin: 'usdt-erc20' })
}else if(l.wallet == 'usdc-erc20'){
	getBalance({walletId: gid('usdcHidden'), balanceDiv: 'usdcBalance', coin: 'usdc-erc20' })
}else{}
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
async function getBalance({ walletId, balanceDiv, coin }){
	if(walletId.value == 'null') return;
	const wallet_id = walletId.value;//'ETHviSjvcPsm4epXYza7yMAKaTrw8UmFM3mEbNq91ApGgBUMQceDe';
	const url = 'https://api.bitaps.com/' + coin + '/v1/wallet/state/' + wallet_id;
	try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    let a = gid(balanceDiv);
    a.textContent = json.balance_amount;
  } catch (error) {
    console.error(error.message);
  }
}
getBalance({walletId: gid('btcHidden'), balanceDiv: 'btcBalance', coin: 'btc' })
getBalance({walletId: gid('ltcHidden'), balanceDiv: 'ltcBalance', coin: 'ltc' })
getBalance({walletId: gid('ethHidden'), balanceDiv: 'ethBalance', coin: 'eth' })
getBalance({walletId: gid('usdtHidden'), balanceDiv: 'usdtBalance', coin: 'usdt-erc20' })
getBalance({walletId: gid('usdcHidden'), balanceDiv: 'usdcBalance', coin: 'usdc-erc20' })
let openrequest = indexedDB.open("db", 1);
openrequest.onupgradeneeded = function(){
	console.log('upgrade needed');
	let dbi = openrequest.result;
	if(!dbi.objectStoreNames.contains('address'));
	dbi.createObjectStore('address', { keyPath: 'wallet' });
}

openrequest.onsuccess = function(){
	 db = openrequest.result;
	db.onversionchange = function(){
		db.close();
		window.location.reload();
	}
//	transaction = db.transaction('address', 'readwrite');
}
openrequest.onblocked = function(){
	console.log('blocked');
}
openrequest.onerror = function(){
	console.error(openrequest.error);
}

































