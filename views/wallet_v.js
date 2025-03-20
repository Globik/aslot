const wallet_v = function(n){
	return `
	<input type="hidden" id="btcHidden" value="${n.user.dat&&n.user.dat.btcw?n.user.dat.btcw:null}"/>
	<input type="hidden" id="ltcHidden" value="${n.user.dat&&n.user.dat.ltcw?n.user.dat.ltcw:null}"/>
	<input type="hidden" id="ethHidden" value="${n.user.dat&&n.user.dat.ethw?n.user.dat.ethw:null}"/>
	<input type="hidden" id="usdtHidden" value="${n.user.dat&&n.user.dat['usdt-erc20w']?n.user.dat['usdt-erc20w']:null}"/>
	<input type="hidden" id="usdcHidden" value="${n.user.dat&&n.user.dat['usdc-erc20w']?n.user.dat['usdc-erc20w']:null}"/>
	<section id="walletVidget">
	<section class="coin-container even" data-state="close" data-section="btcaside" data-span="btcspani" onclick="openSection(this);"><div>BTC</div><div><span id="btcspani">&#9660;</span></div><div id="btcBalance">0</div></section>
	<section>
	<div id="crbtc" style="${n.user.dat&&n.user.dat.btcw?'display:none;':'display:block;'}" onclick="createWallet(this);" class="setka create" data-click="no" data-wallet="btc">Создать BTC кошелек</div>
	<aside id="btcaside" style="display:none;">
	<div class="setka send"  data-form="idbtc" data-state="close" data-section="btcsectionsend" data-span="sendbtcspan" onclick="openSection(this);">Отправить&nbsp;&nbsp;<span id="sendbtcspan">&#9660;</span></div>
	<section id="btcsectionsend" style="display:none;">
	<form class="f" data-cr="crbtc"  id="idbtc" name="btc" data-click="no" method="post" onsubmit="return sendCoin(this);">
	<div><input type="text" name="adr" placeholder="btc address" required/></div>
	<div><input type="number" name="amount" placeholder="amount" required min="0.00122" step="0.00001"/></div>
	<div><button>Отправить</button></div>
	</form>
	</section>
	<div class="setka receive" data-cr="crbtc" data-state="close" data-click="no" data-wallet="btc" data-receiver="btcReceiveAdr" data-section="btcsectionreceive" data-span="receivebtcspan" onclick="openSection(this);">Получить&nbsp;&nbsp;<span id="receivebtcspan">&#9660;</span></div>
	<section id="btcsectionreceive" style="display:none;">
	<div id="btcReceiveAdr" class="setka adr">some address</div>
	<div data-receiver="btcReceiveAdr" onclick="copyAdr(this);" class="setka copy">Copy</div></section>
	</section>
	</aside>
	<section class="coin-container odd" data-state="close" data-section="ltcaside" data-span="ltcspani" onclick="openSection(this);"><div>LTC</div><div><span id="ltcspani">&#9660;</span></div><div id="ltcBalance">0</div></section>
	<section>
	<div id="crltc" style="${n.user.dat&&n.user.dat.ltcw?'display:none;':'display:block;'}" onclick="createWallet(this);" data-click="no" data-wallet="ltc" class="setka create">Создать LTC кошелек</div>
	<aside id="ltcaside" style="display:none;">
	<div class="setka send" data-form="idltc" data-state="close" data-section="ltcsectionsend" data-span="sendltcspan" onclick="openSection(this);">Отправить&nbsp;&nbsp;<span id="sendltcspan">&#9660;</span></div>
	<section id="ltcsectionsend" style="display:none;">
	<form class="f" data-cr="crltc" id="idltc" name="ltc" data-click="no" method="post" onsubmit="return sendCoin(this);">
	<div><input name="adr" type="text" placeholder="ltc address" required/></div>
	<div><input name="amount" type="number" placeholder="amount" required min="0.00043546" step="0.00001"/></div>
	<div><button>Отправить</button></div>
	</form>
	</section>
	<div class="setka receive" data-cr="crltc" data-click="no" data-wallet="ltc" data-receiver="ltcReceiveAdr" data-state="close" data-section="ltcsectionreceive" data-span="receiveltcspan" onclick="openSection(this);">Получить&nbsp;&nbsp;<span id="receiveltcspan">&#9660;</span></div>
	<section id="ltcsectionreceive" style="display:none;">
	<div id="ltcReceiveAdr" class="setka adr">some address</div>
	<div data-receiver="ltcReceiveAdr" onclick="copyAdr(this);" class="setka copy">Copy</div></section>
	</aside>
	</section>
	<section class="coin-container even" data-state="close" data-section="ethaside" data-span="ethspani" onclick="openSection(this);"><div>ETH</div><div><span id="ethspani">&#9660;</span></div><div id="ethBalance">0</div></section>
	<section>
	<div class="setka create" id="creth" data-click="no" style="${n.user.dat&&n.user.dat.ethw?'display:none;':'display:block;'}" onclick="createWallet(this);" data-wallet="eth">Создать ETH кошелек</div>
	<aside id="ethaside" style="display:none;">
	<div class="setka send" data-form="ideth" data-state="close" data-section="ethsectionsend" data-span="sendethspan" onclick="openSection(this);">Отправить&nbsp;&nbsp;<span id="sendethspan">&#9660;</span></div>
	<section id="ethsectionsend" style="display:none;">
	<form class="f" data-cr="creth" id="ideth" name="eth" data-click="no" method="post" onsubmit="return sendCoin(this);">
	<div><input name="adr" type="text" placeholder="eth address" required/></div>
	<div><input name="amount" type="number" placeholder="amount" required min="0.0025" step="0.00001"/></div>
	<div><button>Отправить</button></div></form>
	</section>
	<div class="setka receive" data-cr="creth" data-click="no" data-wallet="eth" data-receiver="ethReceiveAdr" data-state="close" data-section="ethsectionreceive" data-span="receiveethspan" onclick="openSection(this);">Получить&nbsp;&nbsp;<span id="receiveethspan">&#9660;</span></div>
	<section id="ethsectionreceive" style="display:none;">
	<div class="setka adr" id="ethReceiveAdr">some address</div>
	<div class="setka copy" data-receiver="ethReceiveAdr" onclick="copyAdr(this);">Copy</div></section>
	</aside>
	</section>
	<section class="coin-container odd" data-state="close" data-section="usdtaside" data-span="usdtspani" onclick="openSection(this);"><div class="coff">USDT-erc20</div><div><span id="usdtspani">&#9660;</span></div><div id="usdtBalance">0</div></section>
	<section>
	<div class="setka create" id="crusdt" style="${n.user.dat&&n.user.dat['usdt-erc20w']?'display:none;':'display:block;'}" data-click="no" onclick="createWallet(this);" data-wallet="usdt-erc20">Создать USDT кошелек</div>
	<aside id="usdtaside" style="display:none;">
	<div class="setka send" data-form="idusdt" data-state="close" data-section="usdtsectionsend" data-span="sendusdtspan" onclick="openSection(this);">Отправить&nbsp;&nbsp;<span id="sendusdtspan">&#9660;</span></div>
	<section id="usdtsectionsend" style="display:none;">
	<form class="f" id="idusdt" data-cr="crusdt" name="usdt-erc20" data-click="no" method="post" onsubmit="return sendCoin(this);">
	<div><input name="adr" type="text" placeholder="usdt address" required/></div>
	<div><input name="amount" type="number" placeholder="amount" required min="10" step="0,01"/></div>
	<div><button>Отправить</button></div>
	</form>
	</section>
	<div class="setka receive" data-cr="crusdt" data-wallet="usdt-erc20" data-click="no" data-receiver="usdtReceiveAdr" data-state="close" data-section="usdtsectionreceive" data-span="receiveusdtspan" onclick="openSection(this);">Получить&nbsp;&nbsp;<span id="receiveusdtspan">&#9660;</span></div>
	<section id="usdtsectionreceive" style="display:none;">
	<div class="setka adr" id="usdtReceiveAdr">some address</div>
	<div class="setka copy" data-receiver="usdtReceiveAdr" onclick="copyAdr(this);">Copy</div></section>
	</aside>
	</section>
	<section class="coin-container even" data-state="close" data-section="usdcaside" data-span="usdcspani" onclick="openSection(this);"><div class="coff">USDC-erc20</div><div><span id="usdcspani">&#9660;</span></div><div id="usdcBalance">0</div></section>
	<section>
	<div class="setka create" id="crusdc" style="${n.user.dat&&n.user.dat['usdc-erc20w']?'display:none;':'display:block;'}" data-click="no" onclick="createWallet(this);" data-wallet="usdc-erc20">Создать USDC кошелек</div>
	<aside id="usdcaside" style="display:none;">
	<div class="setka send" data-form="idusdc" data-state="close" data-section="usdcsectionsend" data-span="sendusdcspan" onclick="openSection(this);">Отправить&nbsp;&nbsp;<span id="sendusdcspan">&#9660;</span></div>
	<section id="usdcsectionsend" style="display:none;">
	<form class="f" data-cr="crusdc" id="idusdc" name="usdc-erc20" data-click="no" method="post" onsubmit="return sendCoin(this);">
	<div><input name="adr" type="text" placeholder="usdc address" required/></div>
	<div><input name="amount" type="number" placeholder="amount" required min="10" step="0,01" /></div>
	<div><button>Отправить</button></div>
	</form>
	</section>
	<div class="setka receive" data-cr="crusdc" data-wallet="usdc-erc20" data-receiver="usdcReceiveAdr" data-click="no" data-state="close" data-section="usdcsectionreceive" data-span="receiveusdcspan" onclick="openSection(this);">Получить&nbsp;&nbsp;<span id="receiveusdcspan">&#9660;</span></div>
	<section id="usdcsectionreceive" style="display:none;">
	<div class="setka adr" id="usdcReceiveAdr">some address</div>
	<div class="setka copy" data-receiver="usdcReceiveAdr" onclick="copyAdr(this);">Copy</div></section>
	</aside>
	</section>
	</section>`;
}
module.exports = { wallet_v }
