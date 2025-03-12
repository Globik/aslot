const axios = require('axios').default;
const url = 'https://api.bitaps.com/ltc/testnet/v1/';
const wallet_id = 'LTCuhRrCKdzTxGMPg5E6gM17jnveArcVZYfBvPhyh6QNHBD7EpQkb';
const address = 'QN5iBwvQegBkPipqDiTiCDMQdTNP1jFpFo';
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
  invoice: 'invNTVLgwmcnWyUb9wp9gKXG9NFSYBLgdsiWELZf7aguXRz1VSVpQ',
  payment_code: 'PMTvuzMaZXdwCN7CY4qWCEMMGG8ptZvYt4YYp4M8ktjVSr9vPUbi5',
  address: 'QN5iBwvQegBkPipqDiTiCDMQdTNP1jFpFo',
  confirmations: 'depends on the amount',
  notification_link_domain: null,
  wallet_id_hash: '63cb1680917dd92aec434038b61382c0b3fb53dcce2d2442451799dd74391e2c',
  currency: 'tLTC'
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
