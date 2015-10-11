
function r(value){
	return Math.floor(value);
}

function pointInRect(px, py, x, y, sx, sy){
	if(px > x && py > y && px < x + sx && py < y + sy)
		return true; 
	else
		return false;
}


// generates unique id's
var lastUID = 9001;
function nextUID(){
	return lastUID++;
}

addChild = function(o, c){
	if(!o.children)
		o.children = {};

	if(c.UID){
		console.log("Error: Object already attached to a parent:");
		console.log(c);
		return;
	}

	var x = nextUID();
	c.UID = x;
	c.parent = o;
	o.children[x] = c;
}

removeChild = function(o, c){
	delete o.children[c.UID];
	delete c.UID;
}

removeFromParent = function(o){
	if(o.parent)
		removeChild(o.parent, o);
}

