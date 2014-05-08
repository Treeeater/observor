const {Cc,Ci,Cr} = require("chrome");
var file = require("sdk/io/file");
var profilePath = require("sdk/system").pathFor("ProfD");
var fileComponent = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
var cleanResultDirectoryUponInit = true;

function fileNameSanitize(str)
{
	return str.replace(/[^a-zA-Z0-9]*/g,"").substr(0,32)+".txt";
}

exports.initOutputDir = function(){
	var dirPath = file.join(profilePath, "testResults");
	if (!file.exists(dirPath)) {
		file.mkpath(dirPath);
		return;
	}
	
	//Delete all existing records.
	if (cleanResultDirectoryUponInit){
		var existingFiles = file.list(dirPath);
		var i = 0;
		for (i = 0; i < existingFiles.length; i++)
		{
			file.remove(file.join(dirPath,existingFiles[i]));
		}
	}
};

exports.saveToFile = function(fileName, content)
{
	fileName = fileNameSanitize(fileName);
	var filePath = file.join(profilePath, "testResults", fileName);
	fileComponent.initWithPath(filePath);
	var foStream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
	foStream.init(fileComponent, 0x02 | 0x08 | 0x10, 0666, 0); 
	foStream.write(content+"\n", content.length+1);
	foStream.close();
};
