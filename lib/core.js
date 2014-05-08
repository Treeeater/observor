var Utils = require('./utils');

var injectorWorker;

Utils.initOutputDir();

exports.initInjector = function(w){
	injectorWorker = w;
	injectorWorker.port.on('saveToFile',function(msg){
		Utils.saveToFile('fileName', msg);
	});
};
