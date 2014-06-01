//XHR

var oriAJAXSend = XMLHttpRequest.prototype.send;
var newAJAXSend = function(){
	sendMsg(getCallerInfo(), "xhr sent", this.url);
	oriAJAXSend.apply(this);
}

XMLHttpRequest.prototype.send = newAJAXSend;

var oriAJAXOpen = XMLHttpRequest.prototype.open;

var newAJAXopen = function(method,url,async,user,password){
	this.url = url;
	oriAJAXOpen.apply(this,[method,url,async,user,password]);
}

XMLHttpRequest.prototype.open = newAJAXopen;

//LINK HREF
//changing existing link element href or creating a new link element and changing its href does not necessarily leads to network request; if the 'rel' property is set to, say, 'stylesheet', it will make a request.

var oriLinkHrefSetter = HTMLLinkElement.prototype.__lookupSetter__('href');

var newLinkHrefSetter = function(){
	sendMsg(getCallerInfo(), "link href set", arguments[0]);
	oriLinkHrefSetter.apply(this,arguments);
}

HTMLLinkElement.prototype.__defineSetter__('href',newLinkHrefSetter);

//OBJECT DATA

var oriObjectDataSetter = HTMLObjectElement.prototype.__lookupSetter__('data');

var newObjectDataSetter = function(){
	sendMsg(getCallerInfo(), "object data set", arguments[0]);
	oriObjectDataSetter.apply(this,arguments);
}

HTMLObjectElement.prototype.__defineSetter__('data',newObjectDataSetter);

//SOURCE SRC
//changing source src doesn't warrant network access. The source element has to be a child of audio/video element.

var oriSourceSrcSetter = HTMLSourceElement.prototype.__lookupSetter__('src');

var newSourceSrcSetter = function(){
	sendMsg(getCallerInfo(), "source src set", arguments[0]);
	oriSourceSrcSetter.apply(this,arguments);
}

HTMLSourceElement.prototype.__defineSetter__('src',newSourceSrcSetter);

//FORM submit
//A normal form submit would make the page navigate away, however tricks can be done to prevent that and make it a hidden submission.
var oriFormSubmit = HTMLFormElement.prototype.submit;

var newFormSubmit = function(){
	sendMsg(getCallerInfo(), "form submitted", this.action);
	oriFormSubmit.apply(this,arguments);
}

HTMLFormElement.prototype.submit = newFormSubmit;

//WebSocket constructor
var oriWebSocketCon = WebSocket;

var newWebSocketCon = function(){
	sendMsg(getCallerInfo(), "websocket opened", arguments[0]);
	return oriWebSocketCon.apply(this,arguments);
}

WebSocket = newWebSocketCon;