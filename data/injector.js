var i = 0;

for (i = 0; i < self.options.urls.length; i++){
	var script = document.createElement("script");
	script.src = self.options.urls[i];
	document.documentElement.appendChild(script);
}

//there's a timing issue here. although injector.js is executed before everything, the script element it injects are not necessarily.  If the host page contains an inline script at the beginning, that script is likely to execute first.

window.addEventListener('message', function(evt){
	var msg = "";
	if (evt.data.observerStack != null && evt.data.accessType != null){
		switch (evt.data.accessType){
			case "xhr sent":
			case "link href set":
			case "object data set":
			case "source src set":
			case "form submitted":
			case "websocket opened":
				msg = evt.data.accessType + "\nFrom: " + evt.data.observerStack + (evt.data.extra != null ? "To: " + evt.data.extra+"\n" : "\n");
				break;
			case "cookie read":
			case "indexedDB accessed":
			case "localStorage read":
			case "localStorage set":
				msg = evt.data.accessType + "\nFrom: " + evt.data.observerStack;
				break;
			default:
		}
		self.port.emit("saveToFile",msg);
		//console.log(evt.data.observerData);
		//console.log(evt.origin);
	}
});