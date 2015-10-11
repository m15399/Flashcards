
// Flashcard

var FlashcardWidth = 500;
var flashcardHeight = 300;

function Flashcard(frontText, backText){
	this.front = new TextArea(frontText || '');
	this.back = new TextArea(backText || '');

	this.currentSide = this.front;
	this.scale = 1;
	this.scaleX = 1;
	this.parent_scaleX = 1;
	this.rot = 0;

	this.x = 0;
	this.y = 0;

	this.children = {};

}
Flashcard.prototype.update = function(){
	for(i in this.children){
		var c = this.children[i];
		c.update();
	}
	var cs = this.currentSide;
	cs.scaleX = this.scaleX;
	cs.update();
}
Flashcard.prototype.flip = function(){
	var d = 4;
	var tween = linearTween;
	var outTween = easeOutTween;
	new RobotTween(this, 'scaleX', 1, 0, d, tween, this, function(){
		this.flipImmediate();
		new RobotTween(this, 'scaleX', 0, 1, d, outTween, this, function(){});
	});	
}
Flashcard.prototype.flipImmediate = function(){
	if(this.currentSide == this.front){
		this.currentSide = this.back;
	} else {
		this.currentSide = this.front;
	}
}
Flashcard.prototype.moveTo = function(x, y, callWith, callback){
	var d = 15;
	var tween = easeInOutTween;

	new RobotTweenTo(this, 'x', x, d, tween, callWith, callback);
	new RobotTweenTo(this, 'y', y, d, tween);
}
Flashcard.prototype.scaleTo = function(s, callWith, callback){
	var d = 15;
	var tween = easeOutTween;

	new RobotTweenTo(this, 'scale', s, d, tween, callWith, callback);
}
Flashcard.prototype.drawBlank = function(g){
	this.draw(g, true);
}
Flashcard.prototype.draw = function(g, blank){
	g.save();
	g.translate(this.x, this.y);
	g.scale(this.scale, this.scale);
	g.scale(this.parent_scaleX*this.scaleX, 1);
	g.rotate(this.rot);
	g.fillStyle = '#ffffff';
	var sx = FlashcardWidth/2;
	var sy = flashcardHeight/2;
	g.fillRect(-sx, -sy, sx*2, sy*2);
	var value = 100;
	var color = 'rgb(' + value + ',' + value + ',' + value + ')';
	g.strokeStyle = color;
	g.lineWidth = 2;
	g.strokeRect(-sx, -sy, sx*2, sy*2);

	if(!blank)
		this.currentSide.draw(g);
	g.restore();
}