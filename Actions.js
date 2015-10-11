
// TWEEN FUNCTIONS
function linearTween(i, f, t, d){
	return t / d * (f-i) + i;
}

function easeInTween(i, f, t, d){
	return t*t/(d*d) * (f-i) + i;
}

function easeOutTween(i, f, t, d){
	var c = f-i;
	return -t*t/(d*d) * c + 2 * c * t / d + i;
}

function easeInOutTween(i, f, t, d){
	var c = f-i;
	if(t < d/2) return 2 * c * t*t/(d*d) + i;
	var ts = t - d/2;
	return -2 * c * ts*ts/(d*d) + 2 * c * ts/d + c/2 + i;
}


// TIMER
function Timer(parent, time, callWith, callback){

	if(typeof parent == 'number'){ 
		console.log('errorr');
		return;
	}

	this.actionName = 'D';

	this.time = time;
	this.timeLeft;
	this.callWith = callWith || null;
	this.callback = callback || function(){};

	this.parent_param = parent;

	this.start();
}

Timer.prototype.update = function(){
	if(this.paused)
		return;
	this.timeLeft -= 1;
	if(this.timeLeft <= 0)
		this.finish();
}

Timer.prototype.start = function(){
	removeFromParent(this);
	addChild(this.parent_param, this);
	
	this.timeLeft = this.time;
	this.resume();
}

Timer.prototype.pause = function(){
	this.paused = true;
}

Timer.prototype.resume = function(){
	this.paused = false;
}

Timer.prototype.finish = function(){
	this.callback.call(this.callWith);
	removeFromParent(this);
}


// ROBOT TWEEN
RobotTween = function(parent, prop, vi, vf, duration, tweenFunc, callWith, callback, startNow){
	if(!duration){
		parent[prop] = vf;
		return;
	}

	this.actionName = 'D';

	this.parent_param = parent;
	this.prop = prop;

	this.vi = vi;
	this.vf = vf;
	this.dv;
	this.duration = duration;

	this.tweenFunc = tweenFunc || linearTween;
	this.callWith = callWith || null;
	this.callback = callback || function(){};

	startNow = startNow || true;
	if(startNow)
		this.start();
}

RobotTween.prototype.update = function(){
	if(this.paused)
		return;
	this.t += 1;
	this.parent[this.prop] = this.tweenFunc(this.vi, this.vf, this.t, this.duration);
	if(this.t >= this.duration){
		this.finish();
		return;
	}
}

RobotTween.prototype.start = function(){
	removeFromParent(this);
	addChild(this.parent_param, this);

	this.t = 0;
	this.dv = this.vf - this.vi;
	this.resume();
}

RobotTween.prototype.pause = function(){
	this.paused = true;
}

RobotTween.prototype.resume = function(){
	this.paused = false;
}

RobotTween.prototype.finish = function(){
	this.parent[this.prop] = this.vf;
	removeFromParent(this);
	this.callback.call(this.callWith);
}


// ROBOT TWEEN TO
RobotTweenTo = function(parent, prop, v, duration, tweenFunc, callWith, callback){
	var o = new RobotTween(parent, prop, 0, v, duration, tweenFunc, callWith, callback, false);
	if(o.actionName){
		o.start = RobotTweenTo.prototype.start;
		o.start();
		return o;
	}
}

RobotTweenTo.prototype.start = function(){
	removeFromParent(this);
	addChild(this.parent_param, this);

	this.t = 0;
	this.vi = this.parent[this.prop];
	this.dv = this.vf - this.vi;
	this.resume();
}

// ROBOT TWEEN BY
RobotTweenBy = function(parent, prop, v, duration, tweenFunc, callWith, callback){
	var o = new RobotTween(parent, prop, 0, parent[prop]+v, duration, tweenFunc, callWith, callback, false);
	if(o.actionName){
		o.dv = v;
		o.start = RobotTweenBy.prototype.start;
		o.start();
		return o;
	}
}

RobotTweenBy.prototype.start = function(){
	removeFromParent(this);
	addChild(this.parent_param, this);

	this.t = 0;
	this.vi = this.parent[this.prop];
	this.vf = this.vi + this.dv;
	this.resume();
}



