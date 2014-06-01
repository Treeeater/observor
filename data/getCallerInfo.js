var trustedDomains = ["0.1"];

var sendMsg = function(msg, accessType, additionalInfo){
	window.postMessage({observerStack:msg, accessType:accessType, extra:additionalInfo}, '*');
}

var getCallerInfo = function(caller) {
    
	var entireStack = (new Error()).stack;
	var ignored = "";
	var untrustedStack = "";
	var recordedDomains = [];
	var excludedPatterns = ['getCallerInfo'];
	if (entireStack.length>3000) 
	{
		entireStack = entireStack.substr(entireStack.length-3000,entireStack.length);		//Assumes the total call stack is less than 3000 characters. avoid the situation when arguments becomes huge and regex operation virtually stalls the browser.  This could very well happen when innerHTML is changed. For example, flickr.com freezes our extension without this LOC.
		ignored = "; stack trace > 3000 chars.";					//notify the record that this message is not complete.
	}
	while (entireStack != "")
	{
		//assuming a http or https protocol, which is true >99% of the time.
		var curLine = "";
		curLine = entireStack.replace(/([\s\S]*?@http.*\n)[\s\S]*/m, "$1");
		if (curLine=="") return null;		//giveup if it's not http/https protocol
		entireStack = entireStack.substr(curLine.length,entireStack.length);	//entireStack is adjusted to remove curLine
		curLine = curLine.replace(/[\s\S]*@(http.*\n)$/,"$1");				//get rid of the whole arguments
		curDomain = curLine.replace(/.*?\/\/(.*?)\/.*/,"$1");				//http://www.google.com/a.html, w/ third slash.
		if (curDomain==curLine) curDomain = curLine.replace(/.*?\/\/(.*)/,"$1");	//http://www.google.com, no third slash.
		if ((curDomain==curLine) || (curDomain.substr(0,12).toLowerCase()=="@javascript:"))
		{
			curTopDomain="javascript pseudo protocol";								//maybe this is a javascript pseudo protocol
		}
		else
		{
			curTopDomain = curDomain.replace(/.*\.(.*\..*)/,"$1");				//get the top domain
		}
		if (curTopDomain[curTopDomain.length-1]=="\n") curTopDomain=curTopDomain.substr(0,curTopDomain.length-1);	//chomp
		var i = 0;
		var trusted = false;
		var recorded = false;
		for (i=0; i < trustedDomains.length; i++)
		{
			if (curTopDomain.indexOf(trustedDomains[i])>-1 || curTopDomain.indexOf(excludedPatterns[i])>-1)
			{
				trusted = true;
				break;
			}
		}
		if (!trusted)
		{
			for (i=0; i < recordedDomains.length; i++)
			{
				//See if we have already recorded this domain in this access.
				if (curTopDomain.indexOf(recordedDomains[i])>-1)
				{
					recorded = true;
					break;
				}
			}
		}
		if ((!trusted)&&(!recorded)) 
		{
			untrustedStack += curTopDomain+"\n";
			if (curTopDomain!="javascript pseudo protocol") recordedDomains.push(curTopDomain);		//Now we ignore pseudo-protocol
		}
	}
	if (untrustedStack == "") return null;
	return __extraStack+untrustedStack+ignored;
};

var __extraStack = "";
