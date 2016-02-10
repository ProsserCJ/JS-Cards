var ctx;
var c;
var CARD_HEIGHT = 250;
var CARD_WIDTH = 175;
var pipHeight = 20;
var pipWidth = 15;
var displayDeck = new Card("A", "S");
var staticHand = new Array();

//Borrowed from http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
function resetCanvas()
{
	// Store the current transformation matrix
	ctx.save();

	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, c.width, c.height);

	// Restore the transform
	ctx.restore();
	
	displayDeck.draw(0,0);
}
//Compatibility
var requestAnimationFrame =  
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
          return setTimeout(callback, 1);
		  };
		  
		  
window.onload = function(){	
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

	displayDeck.draw(0,0);
	ctx.restore();
	
	var deck = buildDeck();
	
	$("#deal").click(function(){
		var hand = new Array();
		for (var i=0; i<5; i++) hand[i] = deck.pop();
		animate(hand);
		for (var i=0; i<5; i++) hand[i].flipped = false;		
	});
	
}

//Modified from http://codular.com/animation-with-html5-canvas
function animate(hand)
{	
	var duration = 1000;
	var startTime = new Date().getTime();
	var endTime = startTime + duration;	
	//alert(pos);
	
	var step = function(){
		
		var timestamp = new Date().getTime();
		var progress = Math.min((duration - (endTime - timestamp)) / duration, 1);
		
		resetCanvas();
		for (var i=0; i<5; i++)
		{	
			switch(i)
			{
			case 0:	var maxRot = -Math.PI/10; 	var x = 200; var y = 420; break;
			case 1:	var maxRot = -Math.PI/20; 	var x = 250; var y = 405; break;
			case 2:	var maxRot = 0; 			var x = 300; var y = 400; break;
			case 3: var maxRot = Math.PI/20; 	var x = 350; var y = 402; break;
			case 4:	var maxRot = Math.PI/10; 	var x = 400; var y = 411; break;
			}	
			ctx.save(); ctx.translate(x*progress, y*progress); ctx.rotate(maxRot * progress);
			hand[i].draw(0,0);
			ctx.restore();
		}		
		if (progress < 1) requestAnimationFrame(step);
	}
	
	return step();
}



/**********
* Card Class
***********/

function Card(val, suit){
	
	this.val = val;
	this.suit = suit;
	this.flipped = true;
}

//Borrowed from http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}

Card.prototype.draw = function(x,y){
	if(this.flipped)
	{
		ctx.drawImage(document.getElementById("cardback"), x, y, CARD_WIDTH, CARD_HEIGHT);
		return;
	}	
	ctx.fillStyle="white";
	ctx.roundRect(x,y, x + CARD_WIDTH, y + CARD_HEIGHT, 6).fill();
	
	this.offset = 30;
	drawLine(x+this.offset, y+this.offset, x+CARD_WIDTH-this.offset, y+this.offset);
	drawLine(x+this.offset, y+this.offset, x+this.offset, y+CARD_HEIGHT-this.offset);
	drawLine(x+CARD_WIDTH-this.offset, y+this.offset, x+CARD_WIDTH-this.offset, y+CARD_HEIGHT-this.offset);
	drawLine(x+this.offset, y+CARD_HEIGHT-this.offset, x+CARD_WIDTH-this.offset, y+CARD_HEIGHT-this.offset);	 
		
	this.setFillStyle();
	ctx.font="20px Courier bold";
	var numOffset = 7; if (this.val == "10") numOffset = 11;
	ctx.fillText(this.val, this.offset/2 - numOffset, this.offset + 5);	
	this.drawPip(13.5, 55);
	
	ctx.save();	
	ctx.translate(CARD_WIDTH, CARD_HEIGHT);
	ctx.rotate(Math.PI);
	ctx.fillText(this.val, this.offset/2 - numOffset, this.offset + 5);
	this.drawPip(13.5, 55);
	ctx.restore();
	
	//After used to draw lines, reset offset to add a margin for the pips
	this.offset = 35;

	this.drawPips();

}	

Card.prototype.drawPips = function(){
	switch(this.val)
	{
	case "A": 	this.drawPip(CARD_WIDTH/2, CARD_HEIGHT/2); break;
	
	case "3":	this.drawPip(CARD_WIDTH/2, CARD_HEIGHT/2);
	case "2": 	this.drawPip(CARD_WIDTH/2, pipHeight/2 + this.offset, true);
				this.drawPip(CARD_WIDTH/2, CARD_HEIGHT - pipHeight/2 - this.offset);
				break;
	
	case "5":	this.drawPip(CARD_WIDTH/2, CARD_HEIGHT/2);
	case "4":	
				//Four corners
				this.drawPip(this.offset+pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(CARD_WIDTH - this.offset-pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				break;
	
	case "7":	this.drawPip(CARD_WIDTH/2, CARD_HEIGHT/3);
	case "6":	
				//Four corners
				this.drawPip(this.offset+pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(CARD_WIDTH - this.offset-pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				
				//Two Edges
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT/2);
				break;			
	
	case "8":	
				//Middle two
				this.drawPip(CARD_WIDTH/2, CARD_HEIGHT/3, true);
				this.drawPip(CARD_WIDTH/2, 2*CARD_HEIGHT/3);
				
				//Four Corners
				this.drawPip(this.offset+pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(CARD_WIDTH - this.offset-pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				
				//Two Edges
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT/2);
				break;
				
	case "9":	
				//Four corners
				this.drawPip(this.offset+pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(CARD_WIDTH - this.offset-pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				
				//Middle
				this.drawPip(CARD_WIDTH/2, CARD_HEIGHT/2);
				
				//Inner four			
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT/4 + 3*pipHeight/2, true);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT/4 + 3*pipHeight/2, true);
				this.drawPip(this.offset+pipWidth/2, 3*CARD_HEIGHT/4 - 3*pipHeight/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, 3*CARD_HEIGHT/4 - 3*pipHeight/2);
				break;
				
	case "10":
				//Four corners
				this.drawPip(this.offset+pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(CARD_WIDTH - this.offset-pipWidth/2, this.offset+pipHeight/2, true);
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT - this.offset - pipHeight/2);
				
				//Middle two
				this.drawPip(CARD_WIDTH/2, CARD_HEIGHT/3, true);
				this.drawPip(CARD_WIDTH/2, 2*CARD_HEIGHT/3);
				
				//Inner four			
				this.drawPip(this.offset+pipWidth/2, CARD_HEIGHT/4 + 3*pipHeight/2, true);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, CARD_HEIGHT/4 + 3*pipHeight/2, true);
				this.drawPip(this.offset+pipWidth/2, 3*CARD_HEIGHT/4 - 3*pipHeight/2);
				this.drawPip(CARD_WIDTH - this.offset - pipWidth/2, 3*CARD_HEIGHT/4 - 3*pipHeight/2);
				break;
				
	case "J":	ctx.fillText("JACK", CARD_WIDTH/2-25, CARD_HEIGHT/2); break;
	case "Q":	ctx.fillText("QUEEN", CARD_WIDTH/2-35, CARD_HEIGHT/2); break;
	case "K":	ctx.fillText("KING", CARD_WIDTH/2-25, CARD_HEIGHT/2); break;
	}
}

Card.prototype.drawPip = function(x, y, rotate)
{
	if (rotate)
	{	
		ctx.save();	
		ctx.rotate(Math.PI);
		x = -x; y = -y;
	}
	switch(this.suit)
	{
	case "S": drawSpade(x-pipWidth/2, y-pipHeight/2); break;
	case "C": drawClub(x-pipWidth/2, y-pipHeight/2); break;
	case "H": drawHeart(x-pipWidth/2, y-pipHeight/2); break;
	case "D": drawDiamond(x-3-pipWidth/2, y-pipHeight/2); break;
	}
	
	if (rotate) ctx.restore();
}

Card.prototype.setFillStyle = function()
{
	switch(this.suit)
	{
		case "S": case "C": ctx.fillStyle = "black"; break;
		case "H": case "D": ctx.fillStyle = "red"; break;
	}
}

/**********
* Helpers
***********/
function drawLine(x1, y1, x2, y2)
{
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}

function drawHeart(x,y)
{	
	ctx.beginPath();	
	ctx.moveTo(x,y+pipHeight/2);
	ctx.arcTo(x+pipWidth/4, y-1500, x+pipWidth/2, y+pipHeight/2, pipWidth/4);
	ctx.arcTo(x+3*pipWidth/4, y-1500, x+pipWidth, y+pipHeight/2, pipWidth/4);	
	ctx.lineTo(x+pipWidth/2, y+pipHeight);
	ctx.lineTo(x,y+pipHeight/2);
	ctx.fillStyle = "red";
	ctx.fill();
}

function drawSpade(x,y)
{	
	//Transform coords to handle rotation
	x = -x; y = -y - 3; 
	
	ctx.save();
	ctx.translate(pipWidth, pipHeight);
	ctx.rotate(Math.PI);
	
	ctx.beginPath();	
	ctx.moveTo(x,y+pipHeight/2);
	ctx.arcTo(x+pipWidth/4, y-1500, x+pipWidth/2, y+pipHeight/2, pipWidth/4);
	ctx.quadraticCurveTo(x+pipWidth/2, y+3, x+pipWidth/4, y+3);
	ctx.lineTo(x+3*pipWidth/4, y+3);	
	ctx.quadraticCurveTo(x+pipWidth/2, y+3, x+pipWidth/2, y+pipHeight/2);
	ctx.arcTo(x+3*pipWidth/4, y-1500, x+pipWidth, y+pipHeight/2, pipWidth/4);	
	ctx.lineTo(x+pipWidth/2, y+pipHeight);
	ctx.lineTo(x,y+pipHeight/2);
	ctx.fillStyle = "black";
	ctx.fill();
	
	ctx.restore();

}

function drawClub(x,y)
{
	x = -x; y = -y-3;
	
	ctx.save();
	ctx.translate(pipWidth, pipHeight);
	ctx.rotate(Math.PI);
	
	var diff = 1;
	
	ctx.beginPath();
	ctx.moveTo(x+pipWidth/2, y+pipHeight/2+3);
	ctx.quadraticCurveTo(x+pipWidth/2, y+3, x+pipWidth/4, y+3);
	ctx.lineTo(x+3*pipWidth/4, y+3);	
	ctx.quadraticCurveTo(x+pipWidth/2, y+3, x+pipWidth/2, y+pipHeight/2+3);
	ctx.arc(x+pipWidth/2, y+pipHeight/2+1.5, 2, 0, 2*Math.PI);
	ctx.fillStyle = "black";
	ctx.arc(x+pipWidth/4 - diff, y+pipHeight/2, 3, 0, 2*Math.PI); 
	ctx.arc(x+3*pipWidth/4 + diff, y+pipHeight/2, 3, 0, 2*Math.PI);  
	ctx.closePath();
	ctx.arc(x+pipWidth/2, y+pipHeight - 4, 3, 0, 2*Math.PI); 
	
	ctx.fillStyle = "black";
	ctx.fill();	
	ctx.restore();
}

function drawDiamond(x,y)
{
	//Shrinkage to match the pip sizes better
	var diff = 2;	
	y += diff;
	x += diff;
	
	ctx.beginPath();
	ctx.moveTo(x+diff,y+pipHeight/2);
	ctx.lineTo(x+pipWidth/2,y+diff);
	ctx.lineTo(x+pipWidth-diff,y+pipHeight/2);
	ctx.lineTo(x+pipWidth/2, y+pipHeight-diff);
	ctx.lineTo(x+diff,y+pipHeight/2);
	ctx.fillStyle = "red";
	ctx.fill();
}

function buildDeck()
{
	var Deck = new Array();	
	var suits = ["S", "C", "H", "D"];
	
	for (var i=1; i<14; i++)
	{		
		for (var j=0; j<suits.length; j++)
		{			
			do {var index = Math.floor((Math.random() * 52));}
			while(Deck[index] != undefined);
			
			var val = i.toString();
			switch(val)
			{
			case "1": val="A"; break;
			case "11": val="J"; break;
			case "12": val="Q"; break;
			case "13": val="K"; break;
			}
			Deck[index] = new Card(val, suits[j]);		
		}		
	}	
	return Deck;		
}