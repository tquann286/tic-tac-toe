import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function Square(props) {
	return (
		<button className={`square ${props.winner && props.winner.includes(props.index) ? 'winner' : ''}`} onClick={props.onClick}>
			{props.value}
		</button>
	)
}

function SortMoves(props) {
	return (
		<button onClick={props.onClick} style={{margin: '5px'}}>
			{props.isAscending ? 'Asc' : 'Desc'}
		</button>
	)
}

class Board extends React.Component {
	renderSquare(i, winner) {
		return (
			<Square
			winner={winner}
				key={i}
				index={i}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		)
	}

	render() {
		const boardSize = 3
		let squares = []
		const winner = this.props.winner

		for (let i = 0; i < boardSize; i++) {
			let row = []
			for (let j = 0; j < boardSize; j++) {
				row.push(this.renderSquare(i * boardSize + j, winner))
			}
			squares.push(
				<div key={i} className='board-row'>
					{row}
				</div>
			)
		}

		return <div>{squares}</div>
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
			isAscending: true,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1)
		const current = history[history.length - 1]
		const squares = current.squares.slice()
		if (calculateWinner(squares) || squares[i]) {
			return
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O'
		this.setState({
			history: history.concat([
				{
					squares: squares,
					lastestMoveSquare: i,
				},
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})
	}

	handleSort() {
		this.setState({
			isAscending: !this.state.isAscending
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		})
	}

	render() {
		const history = this.state.history
		const current = history[this.state.stepNumber]
		const winner = calculateWinner(current.squares)
		const isAscending = this.state.isAscending

		const moves = history.map((step, move) => {
			const lastestMoveSquare = step.lastestMoveSquare
			const col = 1 + (lastestMoveSquare % 3)
			const row = 1 + Math.floor(lastestMoveSquare / 3)
			const desc = move
				? `Go to move #${move} (col:${col}, row:${row})`
				: 'Go to game start'

			return (
				<li key={move}>
					<button
						className={
							move === this.state.stepNumber ? 'current-selected-move' : ''
						}
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</button>
				</li>
			)
		})
		if (!isAscending) {
			moves.sort((a,b) => b.key - a.key)
		}
		console.log(moves.length)
		let status
		if (winner) {
			status = 'Winner: ' + current.squares[winner[0]]
		} else if (moves.length === 10 && !winner) {
			status = 'Draw'
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
		}

		return (
			<div className='game'>
				<div className='game-board'>
					<Board
						winner={winner}
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className='game-info'>
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
				<div>
					<SortMoves isAscending={this.state.isAscending} onClick={() => this.handleSort()} />
				</div>
			</div>
		)
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return lines[i]
		}
	}
	return null
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
		<Game />
  </React.StrictMode>
);