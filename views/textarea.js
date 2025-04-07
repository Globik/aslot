const textarea = function(n){
	return `
	<header class="header"> Chat</header>
	<div id="chatWrapper">
	<section id="chatBox">
	<div id="chat"></div>
	</section>
	<div id="textArea">
	<div id="text"><textarea placeholder="your message"></textarea></div>
	<div id="btnBox"><button class="chat-btn" onclick="sendText();">Отправить</button></div>
	</div>
	
	</div>
	<div class="su" ><button onclick="send();">send</button></div>
	`;
}
module.exports = { textarea }
