import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// className={(i) => (current.squares[i] = winnerRow[0,1,2] + 1 ? 'win' : null)}
// className={(i) => (this.state.history.squares.contains(this.state.winningSquares) ? 'square win' : 'square')}

function Square(props) {
  // let buttonClass;
  // if (this.state.history) {
  //   for (let j = 0; j < this.state.history.squares.length; j++)
  //   {
  //     if (this.state.winningSquares)
  //     {
  //       for (let k = 0; k < this.state.winningSquares.length; k++)
  //       {
  //         if (this.history.squares[j] === this.state.winningSquares[k])
  //         {
  //           buttonClass = 'square win';
  //           console.log();
  //         }
  //         else
  //         {
  //           buttonClass = 'square';
  //         }
  //       }
  //     }
  //   }
  // }

	return (
		<button className={`square ${props.className}`} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
    let winning = false;
    for (var j = 0; j < this.props.winningSquares.length; j++) {
      if (this.props.winningSquares[j] === i) {
        winning = true;
      }
    }
    let content = this.props.squares[i];
    let winClassName = "";
    if (winning) {
      winClassName = "win-square";
      // content = "|" + this.props.squares[i] + "|";
    } else {
      winClassName = "";
      // content = this.props.squares[i];
    }

    content = this.props.squares[i];

    return (
			<Square
				value={content}
        className={winClassName}
				onClick={() => this.props.onClick(i)}
			/>
		);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
      stepNumber: 0,
			xIsNext: true
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (this.calculateWinner(squares) || squares[i]) {
      const winnerRow = calculateWinner2(squares);
      this.setState({
        winningSquares: winnerRow
      });
			return;
		}
		squares[i] = this.state.xIsNext ? '×' : '⚬';
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
      stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  calculateWinner(squares) {
    for (let i = 0; i < this.lines.length; i++) {
      const [a, b, c] = this.lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], i]; // return winning shape, array of winning squares
      }
    }
    return null;
  }

  render() {
		const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    // const winnerRow = calculateWinner2(current.squares);
    // const winnerRow = this.state.winningSquares;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let winningSquares;
    if (winner) {
      status = 'Winner: ' + winner[0];
      // console.log(winnerRow);
      winningSquares = this.lines[winner[1]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? '×' : '⚬');
      winningSquares = [];
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningSquares={winningSquares}
						onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


// original version
// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return [squares[a], i]; // return winning shape, array of winning squares
//     }
//   }
//   return null;
// }

// fix this, shouldn't need the same function twice
function calculateWinner2(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]; // return array of winning squares
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
