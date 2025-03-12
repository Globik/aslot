const axios = require('axios').default;//usdt-erc20
const url = 'https://api.bitaps.com/usdt-erc20/testnet/v1/';
const wallet_id = 'ETHvDfcMmEJmZTn1pZ72DpDjEVxwCvDRWfDiTJS1XoQwNGJnJHqVs';
const address = '0xbc97109690EA4E90efedc08d4523ea4E717e389D';
// 0x0945d43af296d39c2b7a2d0ac322a49b68838def2d6b5f87b635bf91402fef7e
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
 /*{
  invoice: 'invP1xtq1YLjnAhSRRT9nrb5xpxBPjXeL4abVCeGNxToeQtEcZ15G',
  payment_code: 'PMTvQABPPcJRoMMJW7muPmfbTjAfm4X8dRSbLMZfWPAE1CxJEJRie',
  address:  0xbc97109690EA4E90efedc08d4523ea4E717e389D
  confirmations: 12,
  callback_link: '',
  wallet_id: 'ETHvDfcMmEJmZTn1pZ72DpDjEVxwCvDRWfDiTJS1XoQwNGJnJHqVs'
}*/
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
{
  address_count: 1,
  pending_received_amount: 0,
  pending_sent_amount: 0,
  received_amount: 0,
  sent_amount: 0,
  service_fee_paid_amount: 0,
  sent_tx: null,
  received_tx: null,
  pending_sent_tx: 0,
  pending_received_tx: 0,
  invalid_tx: null,
  balance_amount: 0,
  create_date: '2025-03-11T21:42:55Z',
  create_date_timestamp: 1741729375,
  last_used_nonce: null,
  wallet_id: 'ETHvDfcMmEJmZTn1pZ72DpDjEVxwCvDRWfDiTJS1XoQwNGJnJHqVs'
}
*/
