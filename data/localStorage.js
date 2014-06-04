/*
//not needed if not in console.
var old_scriptNode_innerHTML_setter = HTMLScriptElement.prototype.__lookupSetter__('innerHTML');

if (old_scriptNode_innerHTML_setter)
{
	new_scriptNode_innerHTML_setter = function(str){
		var temp = getCallerInfo().replace(/\n/g,'\\n');
		__extraStack = _extraStack.replace(/\n/g,'\\n');
		if (temp!=""){
			str = "__extraStack = '" + temp + "';" + str + ";__extraStack = '" + __extraStack + "';";
		}
		return old_scriptNode_innerHTML_setter.apply(this,[str]);
	};
}
HTMLScriptElement.prototype.__defineSetter__("innerHTML",new_scriptNode_innerHTML_setter);

var oldSetTimeout = window.setTimeout;

if (oldSetTimeout)
{
	newSetTimeout = function(f,time){
		if (typeof f != "string"){
			var temp = getCallerInfo();
			var __oldExtraStack = __extraStack;
			if (temp!=""){
				var g = function(){
					__extraStack = temp + __extraStack;
					var rv = f();
					__extraStack = __oldExtraStack;
					return rv;
				}
			}
		}
		return oldSetTimeout.apply(this,[g,time]);
	};
}
window.setTimeout = newSetTimeout;


var oldAddEventListener = window.addEventListener;

if (oldAddEventListener)
{
	newAddEventListener = function(type,f,bubble){
		if (typeof f == "function"){
			var temp = getCallerInfo();
			var __oldExtraStack = __extraStack;
			if (temp!=""){
				var g = function(){
					__extraStack = temp + __extraStack;
					var rv = f();
					__extraStack = __oldExtraStack;
					return rv;
				}
			}
		}
		return oldAddEventListener.apply(this,[type,g,bubble]);
	};
}
window.addEventListener = newAddEventListener;


var old_Attr_Value_Setter = Attr.prototype.__lookupSetter__('value');

if (old_Attr_Value_Setter)
{
	new_Attr_Value_Setter = function(v){
		var temp = getCallerInfo().replace(/\n/g,'\\n');
		__extraStack = __extraStack.replace(/\n/g,'\\n');
		if (this.name == 'onclick'){
			v = "__extraStack = '" + temp + "';" + v + ";__extraStack = '" + __extraStack + "';";
		}
		return old_Attr_Value_Setter.apply(this,[v]);
	};
}

Attr.prototype.__defineSetter__("value",new_Attr_Value_Setter);
*/

//cookie
var old_cookie_getter = HTMLDocument.prototype.__lookupGetter__('cookie');

if (old_cookie_getter)
{
	newCookieGetter = function(){
		//console.log(getCallerInfo());
		sendMsg(getCallerInfo(),"cookie read");
		return old_cookie_getter.apply(this);
	};
}

HTMLDocument.prototype.__defineGetter__("cookie",newCookieGetter);

//indexedDB
oriindexedDBOpen = indexedDB.open;

var newIndexedDBOpen = function(){
	sendMsg(getCallerInfo(), "indexedDB accessed");
	oriindexedDBOpen.apply(this, arguments);
}

indexedDB.open = newIndexedDBOpen;

//localStorage
//localStorage is immutable in Gecko or Webkit...

var handler = {
    get: function(target, name){
		sendMsg(getCallerInfo(), "localStorage read");
        return target[name];
    },
	set: function(obj, prop, newval) {
		sendMsg(getCallerInfo(), "localStorage set");
        obj[prop] = newval;
	}
};

var p = new Proxy(localStorage, handler);