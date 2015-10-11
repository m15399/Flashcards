
function ReviewView(deck){
	this.deck = deck = deck || new Deck();
	var middlePile = this.middlePile = new PileFromDeck(deck);
	
	var sideOffset = 150;
	var bottomOffset = 100;
	var smallScale = .4;

	var leftPile = this.leftPile = new Pile();
	leftPile.x = sideOffset;
	leftPile.y = height-bottomOffset;
	leftPile.scale = smallScale;

	var rightPile = this.rightPile = new Pile();
	rightPile.x = width - sideOffset;
	rightPile.y = height - bottomOffset;
	rightPile.scale = smallScale;


	Input.assignKey('/', this, this.slash);
	Input.assignKey('up', this, this.upArrow);
	Input.assignKey('down', this, this.downArrow);
	Input.assignKey('left', this, this.leftArrow);
	Input.assignKey('right', this, this.rightArrow);
	
	Input.assignKey('d', this, function(){
		var name = prompt('NEW deck name:');
		if(!name)
			return;
		var names = JSON.parse(localStorage.getItem('com.markgardner.flashcards._availableDecks'));
		for(var i = 0; i < names.length; i++){
			if(names[i] == name){
				alert('Name already in use!');
				return;
			}
		}
		activeView = new ReviewView(new Deck(name));
	});
	Input.assignKey('n', this, function(){
		var f = prompt('Front text:');
		var b = prompt('Back text:');
		if(!f || !b)
			return;
		var c = new Flashcard(f, b);
		this.deck.addCard(c);
		this.middlePile.addCardFront(c);
	});
	Input.assignKey('l', this, function(){
		var name = prompt('Deck name:');
		if(!name)
			return;
		activeView = new ReviewView(loadDeck(name));
	});
	Input.assignKey('s', this, function(){
		this.deck.save();
	});

	this.controlsActive = true;
		
	// for(var i = 0; i < 40; i++){
	// 	middlePile.addCard(new Flashcard());
	// }
}
ReviewView.prototype.onRemove = function(){
	Input.unassignKey('/');
	Input.unassignKey('up');
	Input.unassignKey('down');
	Input.unassignKey('left');
	Input.unassignKey('right');
}
ReviewView.prototype.update = function(){
	this.middlePile.update();
	this.leftPile.update();
	this.rightPile.update();
}
ReviewView.prototype.draw = function(g){
	this.middlePile.draw(g);
	this.leftPile.draw(g);
	this.rightPile.draw(g);

	var t = new TextArea('Deck name: ' + this.deck.name + 
'\n\nControls:\nUP: flip\nDOWN: flip deck\nLEFT/RIGHT: send to left/right pile\n\n\
D: new deck\nN: new card\nL: load deck\nS: save deck\n');
	t.x = 220;
	t.alignment = 'left';
	t.y = 135;
	t.draw(g);
}
ReviewView.prototype.slash = function(){
	if(!this.controlsActive)
		return;
	this.middlePile.shuffle();
}
ReviewView.prototype.upArrow = function(){
	if(!this.controlsActive)
		return;
	this.middlePile.flipTopCard();
}
ReviewView.prototype.downArrow = function(){
	if(!this.controlsActive)
		return;
	this.middlePile.flip();
}
ReviewView.prototype.rightArrow = function(){
	if(!this.controlsActive)
		return;
	if(this.middlePile.cards.length > 0)
		this.middlePile.throwCardTo(this.rightPile);
	else 
		this.pickupRightPile();
}
ReviewView.prototype.leftArrow = function(){
	if(!this.controlsActive)
		return;
	if(this.middlePile.cards.length > 0)
		this.middlePile.throwCardTo(this.leftPile);
	else 
		this.pickupLeftPile();
}
ReviewView.prototype.pickupRightPile = function(){
	if(this.rightPile.cards.length == 0)
		return;
	this.controlsActive = false;
	var rp = this.rightPile;
	var mp = this.middlePile;
	mp.moveAndScaleTo(rp.x, rp.y, rp.scale);
	rp.moveAndScaleTo(mp.x, mp.y, mp.scale, this, function(){
		var rp = this.rightPile;
		this.rightPile = this.middlePile;
		this.middlePile = rp;
		this.controlsActive = true;
	});
}
ReviewView.prototype.pickupLeftPile = function(){
	if(this.leftPile.cards.length == 0)
		return;
	this.controlsActive = false;
	var lp = this.leftPile;
	var mp = this.middlePile;
	mp.moveAndScaleTo(lp.x, lp.y, lp.scale);
	lp.moveAndScaleTo(mp.x, mp.y, mp.scale, this, function(){
		var lp = this.leftPile;
		this.leftPile = this.middlePile;
		this.middlePile = lp;
		this.controlsActive = true;
	});
}



