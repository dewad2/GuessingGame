function generateWinningNumber() {

	function returnValue(num) {
		if((num * 100) === 0) {
			return 1;
		} else {
			return Math.floor((num * 100) + 1);
		}
	}
	
	
	return returnValue(Math.random());

}


function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var randomIndx = Math.floor(Math.random() * (i + 1));
		var hold = array[i];
		array[i] = array[randomIndx];
		array[randomIndx] = hold;
	}

	return array;
}


function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
	if(this.playersGuess > this.winningNumber){
		return this.playersGuess - this.winningNumber;
	} 

		else if (this.winningNumber > this.playersGuess) {
			return this.winningNumber - this.playersGuess;
		}

}

Game.prototype.isLower = function() {
	return this.playersGuess < this.winningNumber;
}



Game.prototype.playersGuessSubmission = function(guess) {

	if(typeof guess !== 'number' || guess <= 0 || guess > 100) {
		throw 'That is an invalid guess.';
	}

	this.playersGuess = guess;


	return this.checkGuess();
}

Game.prototype.checkGuess = function() {
	
	if(this.playersGuess === this.winningNumber) {
		$('#hint','#submit').prop("disabled", true);
		$('#rollup').text('');
		return 'You read my mind: ' + this.playersGuess + ' !';
	}

	else {
		if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
		$('#rollup').text('You already guessed that number...guess again!!')
		return '';
	
		}
		else {
			this.pastGuesses.push(this.playersGuess);
			$('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
				
			if(this.pastGuesses.length === 5) {
				$('#rollup').text('I was thinking of ' + this.playersGuess);
				$('#question').text('Press reset to play again!')
				$('#hint','#submit').prop("disabled", true);
					return 'You lose';
			}
			else {
				var diff = this.difference();

				  if(this.isLower()) {
                    $('#rollup').text("Higher than that...")
                } else {
                    $('#rollup').text("Try going down from there...")
                }


				if (diff < 10) {
					return 'You\'re burning up!';
				} else if (diff < 25) {
					return 'You\'re lukewarm.';
				} else if (diff < 50) {
					return 'You\'re a bit chilly...';
				} else {
					return 'You\'re ice cold!';
				}
			}
		}
	}
}


function newGame() {
	return new Game;
}

Game.prototype.provideHint = function() {
	var num1 = generateWinningNumber();
	var num2 = generateWinningNumber();

	return shuffle([num1, num2, this.winningNumber]);
}

function makeAGuess(game) {
	$('#question').text('');
	var guess = $('#player-input').val();
	$('#player-input').val('');
	var output = game.playersGuessSubmission(parseInt(guess,10));
	$('#title').text(output);
}

$(document).ready(function() {

	var game = new Game();


	$('#submit').on('click', function() {
		makeAGuess(game);	
	})

	$('#player-input').on('keypress', function(event) {
		if(event.which == 13) {
			makeAGuess(game);
		}
	});

	$('#reset').on('click', function() {
		game = newGame();
		$('#title').text('GUESSING GAME');
		$('#rollup').text('Roll up! Roll up! Get out your slumber!');
		$('#question').text('Between one and a hundred...can you guess my NUMBER??');
		$('#guess-list li').text('-');
		$('#hint','#submit').prop('disabled', false);
	})

	$('#hint').on('click', function() {
		$('#title').text('');
		var hints = game.provideHint();
		$('#rollup').text('Within these three, a winning number you see...')
		$('#question').text(+hints[0]+ ', ' +hints[1]+ ', ' +hints[2]);
		
	})



});



