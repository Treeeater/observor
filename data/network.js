var originalAJAXSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function(){
	sendMsg(getCallerInfo(), "xhr sent");
	originalAJAXSend();
}