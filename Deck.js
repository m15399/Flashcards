
function Deck(name){
	this.name = name;
	var t = this.titleCard = new Flashcard();
	t.front.setText(name);
	this.deckArray = [{
		name: name,
		version: 1.0
	}];
}
function loadDeck(name){
	var o = localStorage.getItem('com.markgardner.flashcards.' + name);
	if(!o){
		console.log('deck name not found');
		return;
	}
	o = JSON.parse(o);
	var d = new Deck(name);
	d.deckArray = o;
	return d;
	
}
Deck.prototype.changeName = function(name){

}
Deck.prototype.addCard = function(card){
	var f = card.front;
	var b = card.back;
	this.deckArray.push(f.text, f.alignment, f.size, b.text, b.alignment, b.size);
}
Deck.prototype.save = function(){
	var n = this.name;
	var decks = JSON.parse(localStorage.getItem('com.markgardner.flashcards._availableDecks'));
	if(!decks){
		localStorage.setItem('com.markgardner.flashcards._availableDecks', JSON.stringify(['_availableDecks', n]));
	} else {
		var found = false;
		for(var i = 0; i < decks.length; i++){
			if(decks[i] == n){
				found = true;
				break;
			}
		}
		if(!found){
			decks.push(n);
			localStorage.setItem('com.markgardner.flashcards._availableDecks', JSON.stringify(decks));
		}
	}
	localStorage.setItem('com.markgardner.flashcards.' + n, this.toString());
}
Deck.prototype.toString = function(){
	return JSON.stringify(this.deckArray);
}