
// TOUCH OBJECT
function Touch(x, y, identifier, owner){
	this.x = x;
	this.y = y;
	this.identifier = identifier;
	this.owner = owner || null;
}
Touch.prototype.start = function(){
	if(this.owner)
		this.owner.touchStart(this.x, this.y);
}
Touch.prototype.move = function(x, y){
	this.x = x;
	this.y = y;
	if(this.owner)
		this.owner.touchMove(x, y);
}
Touch.prototype.end = function(){
	if(this.owner)
		this.owner.touchEnd();
}

function getActiveButtons(){
	return;
}

var Input = {
	keysDown: {},
	keyFuncs: {},

	touches: {},
	lastTouch: 0,

	currentMouseX: -100,
	currentMouseY: -100,
		
	init: function(){
		if(true || PLATFORM != MOBILE && PLATFORM != EJECTA){
			window.addEventListener('keydown',Input.onKeyDown, false);
			window.addEventListener('keyup',Input.onKeyUp,false);

			canvas.addEventListener('mousedown',Input.onTouchStart,false);
			canvas.addEventListener('mouseup',Input.onTouchEnd,false);
			canvas.addEventListener('mousemove',Input.onTouchMove,false);

			console.log('adding key/mouse listeners');
		} else if(PLATFORM == EJECTA){
			document.addEventListener('touchstart',Input.onTouchStart,false);
			document.addEventListener('touchmove',Input.onTouchMove,false);
			document.addEventListener('touchend',Input.onTouchEnd,false);
			
			console.log('adding touch listeners');

		} else {
			canvas.addEventListener('touchstart',Input.onTouchStart,false);
			canvas.addEventListener('touchmove',Input.onTouchMove,false);
			canvas.addEventListener('touchend',Input.onTouchEnd,false);

			console.log('adding touch listeners');
		}
	},

	// check if there's a button that will intercept the touch
	tryAllButtons: function(x, y){
		var buttons = getActiveButtons();
		if(!buttons)
			return false;
		
		for(var i = 0; i < buttons.length; i++){
			if(buttons[i].containsPoint(x,y)){
				return buttons[i];
			}
		}
		return false;
	},

	onTouchStart: function(e){
		e.preventDefault();
		Input.lastTouch = currentTime;

		if(e.changedTouches){
			for(var i = 0; i < e.changedTouches.length; i++){
				Input.touchStart(e.changedTouches[i]);
			}
		} else {
			Input.mouseDown(e);
		}
	},

	touchStart: function(touch){
		var button = this.tryAllButtons(touch.pageX/screenScale, touch.pageY/screenScale);
		
		var t = this.touches[touch.identifier] = new Touch(touch.pageX/screenScale, touch.pageY/screenScale, touch.identifier, button);
		t.start();
	},

	mouseDown: function(click){
		click.identifier = -1;
		this.currentMouseX = -1000;
		this.currentMouseY = -1000;
		this.touchStart(click);
	},
	
	onTouchMove: function(e){
		e.preventDefault();

		if(e.changedTouches){
			for(var i = 0; i < e.changedTouches.length; i++){
				Input.touchMove(e.changedTouches[i]);
			}
		} else {
			Input.mouseMove(e);
		}
	},

	touchMove: function(touch){
		var t = this.touches[touch.identifier];
		if(!t){
			this.currentMouseX = touch.pageX/screenScale;
			this.currentMouseY = touch.pageY/screenScale;
			return;
		} 
		t.move(touch.pageX/screenScale, touch.pageY/screenScale);
	},

	mouseMove: function(click){
		click.identifier = -1;
		this.touchMove(click);
	},
	
	onTouchEnd: function(e){
		if(e.changedTouches){
			for(var i = 0; i < e.changedTouches.length; i++){
				Input.touchEnd(e.changedTouches[i]);
			}
		} else {
			Input.mouseUp(e);
		}
	},

	touchEnd: function(touch){
		var t = this.touches[touch.identifier];
		t.end();
		delete this.touches[touch.identifier];
	},

	mouseUp: function(click){
		click.identifier = -1;
		this.touchEnd(click);
	},

	drawIgnoreTransform: function(g){
		g.fillStyle = '#ffffff';
		g.globalAlpha = .8;
		//g.globalCompositeOperation = 'lighter';
		var s = 30;
		for(i in this.touches){
			var t = this.touches[i];
			g.fillRect(t.x-s/2, t.y-s/2, s, s);
		}
	},

	// is key down?
	keyDown: function(key){
		if(this.keysDown[key])
			return true;
		else
			return false;
	},

	// assign a function to a key
	assignKey: function(key, callWith, callback){
		this.keyFuncs[key] = {callWith: callWith, callback: callback};
	},

	unassignKey: function(key){
		delete this.keyFuncs[key];
	},
	
	onKeyDown: function(e){
		var key = Input.getKeyCodeValue(e.keyCode);
		Input.keysDown[key] = true;
		var kf = Input.keyFuncs[key];
		if(kf){
			kf.callback.call(kf.callWith);
		}
	},
	
	onKeyUp: function(e){
		var key = Input.getKeyCodeValue(e.keyCode);
		delete Input.keysDown[key];
	},

    getKeyCodeValue : function(keyCode) {
        var shiftKey = this.keyDown('shift');
        var value = null;
        if(shiftKey) {
            value = this.modifiedByShift[keyCode] || this.keyCodeMap[keyCode];
        } else {
            value = this.keyCodeMap[keyCode];
        }
        return value;
    },

    keyCodeMap: {
        8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"ctrl", 18:"alt", 19:"pausebreak", 20:"capslock", 27:"escape", 32:" ", 33:"pageup",
        34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 43:"+", 44:"printscreen", 45:"insert", 46:"delete",
        48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
        61:"=", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
        77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
        96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9",
        106: "*", 107:"+", 109:"-", 110:".", 111: "/",
        112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
        144:"numlock", 145:"scrolllock", 186:";", 187:"=", 188:",", 189:"-", 190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"'"
    },

    modifiedByShift: {
        192:"~", 48:")", 49:"!", 50:"@", 51:"#", 52:"$", 53:"%", 54:"^", 55:"&", 56:"*", 57:"(", 109:"_", 61:"+",
        219:"{", 221:"}", 220:"|", 59:":", 222:"\"", 188:"<", 189:">", 191:"?",
        96:"insert", 97:"end", 98:"down", 99:"pagedown", 100:"left", 102:"right", 103:"home", 104:"up", 105:"pageup"
    }
}

