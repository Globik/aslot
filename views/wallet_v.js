const wallet_v = function(n){
	return `<section id="walletVidget">
	<section class="coin-container"><div>BTC</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div onclick="createBTCWallet(this);">Создать BTC кошелек</div>
	<div>Отправить</div>
	<section>
	<form name="btcform" method="post" onsubmit="sendBTC(this);">
	<div><input type="text" name="btcadr" placeholder="btc address" required/></div>
	<div><input type="number" name="btcamount" placeholder="amount" required /></div>
	<div><button>Отправить</button>
	</form>
	</section>
	<div onclick="getBTCadr(this);">Получить</div>
	<section><div>some address</div><div onclick="copyBTCadr(this);">Copy</div></section>
	</section>
	<section class="coin-container"><div>LTC</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div onclick="createLTCWallet(this);">Создать LTC кошелек</div>
	<div>Отправить</div>
	<section><form name="ltcform" method="post" onsubmit="sendLTC(this);"><div><input name="ltcadr" type="text" placeholder="ltc address" required/></div>
	<div><input name="ltcamount" type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button></form>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div onclick="copyLTCadr(this);">Copy</div></section>
	</section>
	<section class="coin-container"><div>ETH</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div onclick="createETHWallet(this);">Создать ETH кошелек</div>
	<div>Отправить</div>
	<section><form name="ethform" method="post" onsubmit="sendETH(this);"><div><input name="ethadr" type="text" placeholder="eth address" required/></div>
	<div><input name="ethamount" type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button></form>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div onclick="copyETHadr(this);">Copy</div></section>
	</section>
	<section class="coin-container"><div class="coff">USDT-erc20</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div onclick="createUSDTWallet(this);">Создать USDT кошелек</div>
	<div>Отправить</div>
	<section><form name="usdtform" method="post" onsubmit="sendUSDT(this);"><div><input name="usdtadr" type="text" placeholder="usdt address" required/></div>
	<div><input name="usdtamount" type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button</form>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div onclick="copyUSDTadr(this);">Copy</div></section>
	</section>
	<section class="coin-container"><div class="coff">USDC-erc20</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div onclick="createUSDCWallet(this);">Создать USDC кошелек</div>
	<div>Отправить</div>
	<section><form name="usdcform" method="post" onsubmit="sendUSDC(this);"><div><input name="usdcadr" type="text" placeholder="usdc address" required/></div>
	<div><input name="usdcamount" type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button></form>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div onclick="copyUSDCadr(this);">Copy</div></section>
	</section>
	</section>`;
}
module.exports = { wallet_v }
