var script = document.createElement("script");
script.src = self.options.url;
document.documentElement.appendChild(script);

window.addEventListener('message', function(evt){
	if (evt.data.observerData != null){
		self.port.emit("saveToFile",evt.data.observerData);
		//console.log(evt.data.observerData);
		//console.log(evt.origin);
	}
});