var readline = require('readline');

READER = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// function HumanPlayer() {
//    this.get_input = function()
// }

function TicTacToe(num_humans) {
  // pass two players?
  this.players = this.getPlayers(num_humans)
  this.turn = 0

  // board as 3 strings?
  this.board = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]];
}

TicTacToe.prototype.getPlayers = function(num_humans) {
  // 1 is human, 0 is computer
  switch(num_humans) {
  case 0:
    return [0, 0];
  case 1:
    return [1, 0];
  case 2:
    return [1, 1];
  default:
    console.log("Call play with number of humans");
  }
}

TicTacToe.prototype.changeTurn = function() {
  // make 0 1;
  if (this.turn === 0) {
    this.turn = 1;
  } else {
    // make 1 0;
    this.turn = 0;
  }
}

TicTacToe.prototype.gameOver = function() {
  // board full or win state
  if (this.winState() || this.draw()) {
    return true;
  }
  return false;
}

TicTacToe.prototype.draw = function() {
  if (this.winState()) {
    return false;
  } else if (this.hasOpenSquares()) {
    return false;
  }
  return true;

}

TicTacToe.prototype.hasOpenSquares = function() {
  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board[i].length; j++) {
      if (this.board[i][j] === "_") {
        return true;
      }
    }
  }

  return false;
}

TicTacToe.prototype.winState = function() {
  // column
  for (var i = 0; i < this.board.length; i++) {
    if (this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
      if (this.board[0][i] != "_") {
        return true;
      }
    }
  }

  // row
  for (var i = 0; i < this.board.length; i++) {
    if (this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
      if (this.board[i][0] != "_") {
        return true;
      }
    }
  }

  // diagonal
  if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
    if (this.board[0][0] != "_") {
      return true;
    }
  }
  if (this.board[2][0] === this.board[1][1] && this.board[1][1] === this.board[0][2]) {
    if (this.board[2][0] != "_") {
      return true;
    }
  }

  return false
}

TicTacToe.prototype.play = function() {
  this.loop();
}

TicTacToe.prototype.render = function() {


  console.log("  _____");

  for (var i = 0; i < this.board.length; i++) {
    string = i + "|";
    for (var j = 0; j < this.board[i].length; j++) {
      string += this.board[i][j] + "|";
    }
    console.log(string);
  }

  console.log("  0 1 2");
}

TicTacToe.prototype.loop = function() {
  that = this
  that.render();
  if (that.gameOver()){
    if (that.winState()) {
      console.log("You Win!");
    } else {
      console.log("Draw!");
    }
    READER.close();
  } else if (that.players[that.turn] === 1) {
    READER.question("Where would you like to move? '0 1' (row, col)", function(stringInput) {
      var re = /^([012]) ([012])$/;
      reArray = re.exec(stringInput);
      if (re.test(stringInput) === false) {
        that.loop();
      } else {
        move_array = [parseInt(reArray[1]), parseInt(reArray[2])];
        that.move(move_array);
      }
    });
  } else if (that.players[that.turn] === 0) {
    move_array = that.getRandomOpenMove();
    that.move(move_array);
  }
};

TicTacToe.prototype.getRandomOpenMove = function(move_array) {
  openMoves = [];
  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board[i].length; j++) {
      if (this.board[i][j] === "_") {
        openMoves.push([i, j]);
      }
    }
  }

  index = Math.floor((Math.random() * openMoves.length));
  return openMoves[index];
}

TicTacToe.prototype.move = function(move_array) {
  // check to see if square is open

  if (this.board[move_array[0]][move_array[1]] !== "_") {
    this.loop();
  } else {
    if (this.turn === 0) {
      move = "X";
    } else {
      move = "O";
    }

    this.board[move_array[0]][move_array[1]] = move
    this.changeTurn();
    this.loop();
  }
}

var game = new TicTacToe(0);
game.play();

// function ask(question, format, callback) {
//  var stdin = process.stdin, stdout = process.stdout;
//
//  stdin.resume();
//  stdout.write(question + ": ");
//
//  stdin.once('data', function(data) {
//    data = data.toString().trim();
//
//    if (format.test(data)) {
//      callback(data);
//    } else {
//      stdout.write("It should match: "+ format +"\n");
//      ask(question, format, callback);
//    }
//  });
// }
//
// input = ask("Name", /.+/, function(name) {
//   return name;
//
//     process.exit();
//   });
// });