var i = 0;

for (i = 0; i < self.options.urls.length; i++){
	var script = document.createElement("script");
	script.src = self.options.urls[i];
	document.documentElement.appendChild(script);
}

window.addEventListener('message', function(evt){
	if (evt.data.observerStack != null && evt.data.accessType != null){
		self.port.emit("saveToFile",evt.data.accessType + "\n" + evt.data.observerStack);
		//console.log(evt.data.observerData);
		//console.log(evt.origin);
	}
});