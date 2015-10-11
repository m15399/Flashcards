
// TEXT AREA
function TextArea(text){
	this.text = text;
	//this.text = 'aas;ldfkja;slkdjfa;lskjdfa;lskj-dfa;lskjdfa;lksjfa;lksjfda;lkjsfa;lfjksfa;lskjf;aldfjka';
	this.alignment = 'center';
	this.size = 16;

	this.x = 0;
	this.y = 0;
	this.width = 400;
	//this.height = 200;
}
TextArea.prototype.insertStringAt = function(c, i){
	this.setText(this.text.substring(0, i) + c + this.text.substring(i));
}
TextArea.prototype.setText = function(s){
	this.text = s;
	delete this.lines;
}
TextArea.prototype.update = function(){

}
TextArea.prototype.draw = function(g){
	g.save();
	g.translate(this.x, this.y);

	g.fillStyle = '#000000';
	g.font = this.size + 'pt Arial';
	g.textAlign = this.alignment;

	if(this.alignment == 'center')
		g.translate(0,0);
	else if(this.alignment == 'left')
		g.translate(-this.width/2,0);
	else
		g.translate(this.width/2,0);
	

	function wordsThatFitOneLine(string){
		if(!string || string.length == 0)
			return false;

		// check for newline characters
		for(var i = 0; i < string.length; i++){
			if(string.charAt(i) == '\n')
				return string.substring(0,i+1);
		}

		// clip text if too long
		var s = string;
		while(true){
			var l = g.measureText(s).width;
			if(l > this.width){ // string longer than line
				// remove one word
				var i = s.length-2;
				while(true){
					var c = s.charAt(i); 
					if(c == ' ' || c == '-'){ // chop at a space or dash
						s = s.substring(0, i+1);
						break;
					} 
					i--;

					if(i < 0){ // no spaces found, chop string to size
						while(true){
							if(s.length == 1)
								return s;
							var l = g.measureText(s).width;
							if(l < this.width)
								return s;
							s = s.substring(0, s.length-1);
						}
					};
				}
			} else {
				return s;
			}
		}
	}

	if(!this.lines){
		this.lines = [];
		var s = this.text;
		var s2;
		var i = 0;
		while(s2 = wordsThatFitOneLine.call(this, s)){
			if(s2){
				s = s.substring(s2.length);
				var c = s2.charAt(s2.length-1);
				if(c == '\n' || c == ' ')
				 	s2 = s2.substring(0, s2.length-1);
				this.lines[i] = s2;
				//console.log('"' + s2 + '"');
				i++;
			} else 
				break;
		}
	}

	// draw lines
	var spacing = 1.3;
	var dy = -(this.lines.length-1)/2*(this.size*spacing);
	g.translate(0, dy);
	for(var i = 0; i < this.lines.length; i++){
		g.fillText(this.lines[i], 0, 0);
		g.translate(0, this.size * spacing);
	}

	g.restore();
}



