const axios = require('axios').default;
const url = 'https://api.bitaps.com/usdc-erc20/testnet/v1/';
const wallet_id = 'ETHvXYq92V2845BEk6CoEszqfVp4EbKEJZn1RTTy1De4Bfm6E3853';
const address = '0x16A8DaC8D2f04017DEa8184826171dCEa76E2bff';
// 0x1c4229f7feb735561b8fff92ed0246dbf215ecf9073085ba341f17a12140a6ca
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
  invoice: 'invPYs53vMje5EzpYKRfSRieWhsSKVZTcdLUJuAoDG2DkcrcZPDZb',
  payment_code: 'PMTvaPLHjcZvKmobADDWy8yF6BM5LgW8bqbqbPYF51QYconTPFFsR',
  address: 0x16A8DaC8D2f04017DEa8184826171dCEa76E2bff
  confirmations: 12,
  callback_link: '',
  wallet_id: 'ETHvXYq92V2845BEk6CoEszqfVp4EbKEJZn1RTTy1De4Bfm6E3853'
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
0x16A8DaC8D2f04017DEa8184826171dCEa76E2bff
*/
