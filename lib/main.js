const {Cc,Ci,Cr} = require("chrome");
var window = Cc["@mozilla.org/appshell/appShellService;1"].getService(Ci.nsIAppShellService).hiddenDOMWindow;

exports.main = function() {

    var data = require("sdk/self").data;
    var pageMod = require("sdk/page-mod");
	var core = require("./core");
	
    pageMod.PageMod({
		include: "*",
		contentScriptFile: [data.url("injector.js")],
		contentScriptWhen: 'start',
		contentScriptOptions: {
			urls:[data.url("getCallerInfo.js"), data.url("network.js"),data.url("localStorage.js")]
		},
		onAttach: function(worker) {
			core.initInjector(worker);
		},
		attachTo: ["top"]
    });
}