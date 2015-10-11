
function Pile(){
	this.cards = [];
	this.x = width/2;
	this.y = height/2;
	this.scale = 1;
	this.scaleX = 1;
	this.rot = 0;

	this.pileOffsetX = 5;
	this.pileOffsetY = 3;

	this.children = {};
}
function PileFromDeck(deck){
	var p = new Pile();
	var da = deck.deckArray;
	for(var i = 1; i < da.length; i+=6){
		var c = new Flashcard(da[i], da[i+3]);
		c.front.alignment = da[i+1];
		c.front.size = da[i+2];
		c.back.alignment = da[i+4];
		c.back.size = da[i+5];
		p.addCard(c);
	}
	return p;
}
Pile.prototype.update = function(){
	for(i in this.children){
		var c = this.children[i];
		c.update();
	}
	for(var i = 0; i < this.cards.length; i++){
		var c = this.cards[i];
		if(c){
			c.x = this.x - this.pileOffsetX * this.scale * i;
			c.y = this.y - this.pileOffsetY * this.scale * i;
			c.scale = this.scale;
			c.rot = this.rot;
			c.parent_scaleX = this.scaleX;
			c.update();
		}
	}
}
Pile.prototype.draw = function(g){
	g.save();
	for(var i = this.cards.length-1; i >= 0; i--){
		var c = this.cards[i];
		if(c){
			var a = 1 - .03 * i;
			var a = 4/(i+1) - .004 * i;
			if(a < 0){
				continue;
			}
			g.globalAlpha = a;
			c.draw(g, (i > 1)); // draw cards after position 1 blank
		}
	}
	g.restore();
}
Pile.prototype.flipTopCard = function(){
	if(this.cards.length == 0)
		return;
	this.cards[0].flip();
}
Pile.prototype.flip = function(){
	var d = 12;
	var tween = linearTween;
	var outTween = easeOutTween;
	new RobotTween(this, 'scaleX', 1, 0, d, tween, this, function(){
		this.cards.reverse();
		for(var i = 0; i < this.cards.length; i++){
			this.cards[i].flipImmediate();
		}
		new RobotTween(this, 'scaleX', 0, 1, d, outTween, this, function(){});
	});	
}
Pile.prototype.shuffle = function(){
	this.cards.sort(function(a,b){
		return .5 - Math.random();
	});
	var d = 10;
	var tween = easeInOutTween;
	new RobotTweenTo(this, 'rot', Math.PI*2, d, tween, this, function(){this.rot = 0;});
}
Pile.prototype.addCard = function(card){
	this.cards.push(card);
}
Pile.prototype.addCardFront = function(card){
	this.cards.unshift(card);
}
Pile.prototype.moveAndScaleTo = function(x, y, s, callWith, callback){
	var d = 15;
	var tween = easeInOutTween;

	new RobotTweenTo(this, 'x', x, d, tween, callWith, callback);
	new RobotTweenTo(this, 'y', y, d, tween);
	new RobotTweenTo(this, 'scale', s, d, tween);
}
Pile.prototype.throwCardTo = function(pile, callWith, callback){
	var c = this.cards.shift();
	if(!c)
		return false;
	pile.addCardFront(c);
	c.moveTo(pile.x, pile.y);
	c.scaleTo(pile.scale, this, callWith, callback);
}