const axios = require('axios').default;
const url = 'https://api.bitaps.com/eth/testnet/v1/';
const wallet_id = 'ETHviSjvcPsm4epXYza7yMAKaTrw8UmFM3mEbNq91ApGgBUMQceDe';
const address = '0x2D981f69dD76aA2fa1d3296459ffA41160BD5203';
// 0x49eb086e2f1c6f8fe01ad77d92503670bdcf96a9b8909362f883b0ed3672631e
// https://sepolia.etherscan.io/address/0x16A8DaC8D2f04017DEa8184826171dCEa76E2bff
async function createWallet(){
	try{
		let d = await axios.post(url + 'create/wallet', {});
		if(d.status == 200){
			console.log('d ', d.data);
		}
	}catch(err){
		if(err.response){
			console.log(err.response.data);
		}else{
			console.log(err.name);
		}
	}
}
//createWallet()
async function createAddress(){
	try{
		let d = await axios.post(url + 'create/wallet/payment/address', { wallet_id: wallet_id });
		if(d.status == 200){
			console.log('d ', d.data);
		}
	}catch(err){
		if(err.response){
			console.log(err.response.data);
		}else{
			console.log(err.name);
		}
	}
}
//createAddress()
/*
  {
  invoice: 'invPHKM5Z68CQ2qqQtRhwwE5w4bXBxbg43LxrDrNaQVfiLHKVMuPt',
  payment_code: 'PMTvLTjpegU8wZZTWuiyGFspugFqX1dwT9ZymcwrH6HFxdcA3pPKu',
  address: '0x2D981f69dD76aA2fa1d3296459ffA41160BD5203'
			0x2D981f69dD76aA2fa1d3296459ffA41160BD5203
  confirmations: 12,
  callback_link: '',
  wallet_id: 'ETHviSjvcPsm4epXYza7yMAKaTrw8UmFM3mEbNq91ApGgBUMQceDe'
}

*/
 async function getState(){
	try{
		let d = await axios.get(url + 'wallet/state/' + wallet_id);
		if(d.status == 200){
			console.log('d ', d.data);
		}
	}catch(err){
		if(err.response){
			console.log(err.response.data);
		}else{
			console.log(err.name);
		}
	} 
 }
 getState();
 /*

*/
