var readline = require('readline');

READER = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function HumanPlayer(tictactoe) {
  this.tictactoe = tictactoe;
}

HumanPlayer.prototype.get_input = function() {
  var that = this;

  READER.question("Where would you like to move? '0 1' (row, col)", function(stringInput) {
    var re = /^([012]) ([012])$/;
    reArray = re.exec(stringInput);
    if (re.test(stringInput) === false) {
      that.tictactoe.loop();

    } else {
      move_array = [parseInt(reArray[1]), parseInt(reArray[2])];
      that.tictactoe.move(move_array);
    }
  });
};

function ComputerPlayer(tictactoe) {
  this.tictactoe = tictactoe;
}

ComputerPlayer.prototype.get_input = function() {
  return this.getWinningMoveOrRandomOpenMove();
};

// Chooses a move for the AI player.
ComputerPlayer.prototype.getWinningMoveOrRandomOpenMove = function() {
  openMoves = this.getOpenMoves();

  for(var i = 0; i < openMoves.length; i++) {
    if (this.tictactoe.turn === 0) {
      move = "X";
    } else {
      move = "O";
    }
    move_array = openMoves[i];
    this.tictactoe.board[move_array[0]][move_array[1]] = move;

    if (this.tictactoe.winState()) {
      this.tictactoe.board[move_array[0]][move_array[1]] = "_";
      return openMoves[i];
    } else {
      this.tictactoe.board[move_array[0]][move_array[1]] = "_";
    }
  }

  return this.getRandomOpenMove(openMoves);
};

ComputerPlayer.prototype.getRandomOpenMove = function(openMoves) {
  index = Math.floor((Math.random() * openMoves.length));
  return openMoves[index];
};

ComputerPlayer.prototype.getOpenMoves = function() {
  openMoves = [];
  for (var i = 0; i < this.tictactoe.board.length; i++) {
    for (var j = 0; j < this.tictactoe.board[i].length; j++) {
      if (this.tictactoe.board[i][j] === "_") {
        openMoves.push([i, j]);
      }
    }
  }

  return openMoves;
};

function TicTacToe(num_humans) {
  // pass two players?
  this.playerObjects = [];
  this.players = this.getPlayers(num_humans);

  this.turn = 0;

  // board as 3 strings?
  this.board = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]];
}

// Starts game with given number of human players. when num_humans is 1,
// the human player is X. When num_humans is -1, the computer player is X,
// and the human is O.
TicTacToe.prototype.getPlayers = function(num_humans) {
  // 1 is human, 0 is computer
  switch(num_humans) {
  case 0:
    this.playerObjects.push(new ComputerPlayer(this));
    this.playerObjects.push(new ComputerPlayer(this));
    return [0, 0];
  case -1:
    this.playerObjects.push(new HumanPlayer(this));
    this.playerObjects.push(new ComputerPlayer(this));
    return [0, 1];
  case 1:
    this.playerObjects.push(new ComputerPlayer(this));
    this.playerObjects.push(new HumanPlayer(this));
    return [1, 0];
  case 2:
    this.playerObjects.push(new HumanPlayer(this));
    this.playerObjects.push(new HumanPlayer(this));
    return [1, 1];
  default:
    console.log("Call play with number of humans");
  }
};

// Updates the player to move next.
TicTacToe.prototype.changeTurn = function() {
  // make 0 1;
  if (this.turn === 0) {
    this.turn = 1;
  } else {
    // make 1 0;
    this.turn = 0;
  }
};

TicTacToe.prototype.gameOver = function() {
  // board full or win state
  if (this.winState() || this.draw()) {
    return true;
  }
  return false;
};

TicTacToe.prototype.draw = function() {
  if (this.winState()) {
    return false;
  } else if (this.hasOpenSquares()) {
    return false;
  }
  return true;
};

TicTacToe.prototype.hasOpenSquares = function() {
  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board[i].length; j++) {
      if (this.board[i][j] === "_") {
        return true;
      }
    }
  }

  return false;
};

// Checks rows and columsn for win state.
TicTacToe.prototype.checkRowsAndCols = function() {
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
};

// Checks diagonals for win state.
TicTacToe.prototype.checkDiags = function() {
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
};

TicTacToe.prototype.winState = function() {
  if (this.checkRowsAndCols()) {
    return true;
  }

  // diagonal
  if (this.checkDiags()) {
    return true;
  }

  return false;
};

TicTacToe.prototype.play = function() {
  this.loop();
};

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
};

// Main game "loop" - accepts input and makes move.
TicTacToe.prototype.loop = function() {
  that = this;
  that.render();

  if (that.gameOver()){
    if (that.winState()) {
      console.log("You Win!");
    } else {
      console.log("Draw!");
    }
    READER.close();

  } else if (that.players[that.turn] === 1) {
    that.playerObjects[that.turn].get_input();

  } else if (that.players[that.turn] === 0) {
    move_array = that.playerObjects[that.turn].get_input();
    that.move(move_array);
  }
};

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

    this.board[move_array[0]][move_array[1]] = move;
    this.changeTurn();
    this.loop();
  }
};

var game = new TicTacToe(2);
game.play();