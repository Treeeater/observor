var originalAJAXSend = XMLHttpRequest.prototype.send;
var newAJAXSend = function(){
	sendMsg(getCallerInfo(), "xhr sent", this.url);
	originalAJAXSend.apply(this);
}

XMLHttpRequest.prototype.send = newAJAXSend;

var originalAJAXOpen = XMLHttpRequest.prototype.open;

var newAJAXopen = function(method,url,async,user,password){
	this.url = url;
	//sendMsg(getCallerInfo(), "xhr opened");
	originalAJAXOpen.apply(this,[method,url,async,user,password]);
}

XMLHttpRequest.prototype.open = newAJAXopen;