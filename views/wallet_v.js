const wallet_v = function(n){
	return `<section id="walletVidget">
	<section class="coin-container"><div>BTC</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div>Создать кошелек</div>
	<div>Отправить</div>
	<section><div><input type="text" placeholder="btc address" required/></div>
	<div><input type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div>Copy</div></section>
	</section>
	<section class="coin-container"><div>LTC</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div>Создать кошелек</div>
	<div>Отправить</div>
	<section><div><input type="text" placeholder="ltc address" required/></div>
	<div><input type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div>Copy</div></section>
	</section>
	<section class="coin-container"><div>ETH</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div>Создать кошелек</div>
	<div>Отправить</div>
	<section><div><input type="text" placeholder="eth address" required/></div>
	<div><input type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div>Copy</div></section>
	</section>
	<section class="coin-container"><div class="coff">USDT-erc20</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div>Создать кошелек</div>
	<div>Отправить</div>
	<section><div><input type="text" placeholder="usdt address" required/></div>
	<div><input type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div>Copy</div></section>
	</section>
	<section class="coin-container"><div class="coff">USDC-erc20</div><div>&#9660;</div><div>0</div></section>
	<section>
	<div>Создать кошелек</div>
	<div>Отправить</div>
	<section><div><input type="text" placeholder="usdc address" required/></div>
	<div><input type="number" placeholder="amount" required /></div>
	<div><button>Отправить</button>
	</section>
	<div>Получить</div>
	<section><div>some address</div><div>Copy</div></section>
	</section>
	</section>`;
}
module.exports = { wallet_v }
