import React, { Component } from 'react'
import Row from '../Row'

export default class Board extends Component {
    constructor(props){
        super(props);

        this.state = {
            rows: this.createBoard(props)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.openCells > nextProps.openCells ||
            this.props.columns !== nextProps.columns){
            this.setState({
                rows: this.createBoard(nextProps)
            })
        }
    }

    createBoard = props => {
        let board = [];
        
        for (let i = 0; i < props.rows; i++) {
            board.push([]);
            
            for (let j = 0; j < props.columns; j++) {
                board[i].push({
                    x: j,
                    y: i,
                    count: 10, // nearby mines, the radius number
                    isOpen: false,
                    hasMine: false,
                    hasFlag: false
                })
            }
        }
        // console.log(board);
        // after we create the board we add our mines
        for (let i = 0; i < props.mines; i++) {
            let randomRow = Math.floor(Math.random() * props.rows);
            let randomCol = Math.floor(Math.random() * props.columns);

            let cell = board[randomRow][randomCol];

            // console.log(cell);

            if (cell.hasMine) {
                i--;
            } else {
                cell.hasMine = true;
            }
        }
        return board;
    }

    open = cell => {
        if (this.props.status === "ended") {
      return;
    }

        let asyncCountMines = new Promise(resolve => {
            let mines = this.findMines(cell);
            resolve(mines);
        })

        asyncCountMines.then(numberOfMines => {
            console.log(numberOfMines);

            let rows = this.state.rows;

            let current = rows[cell.y][cell.x];

            if (current.hasMine && this.props.openCells === 0) {
                console.log("cell already has mine")
                let newRows = this.createBoard(this.props);
                this.setState({
                    rows: newRows
                }, () => {
                    this.open(cell);
                })
            } else if (!cell.hasFlag && !current.isOpen) {
                    this.props.openCellClick();

                    current.isOpen = true;
                    current.count = numberOfMines;

                    console.log(current);

                    this.setState({ rows });

                    if (!current.hasMine && numberOfMines === 0) {
                        this.findAroundCell(cell);
                    }

                    if (current.hasMine && this.props.openCells !== 0) {
                        this.props.endGame();
                        alert("you lose")
                    }
                }
            })        
    }

    flag = cell => {
        if (this.props.status === "ended") {
            return;
        }

        if (!cell.isOpen) {
            let rows = this.state.rows;

            cell.hasFlag = !cell.hasFlag;
            this.setState({ rows });
            this.props.changeFlagAmount(cell.hasFlag ? -1 : 1);
        }
    }

    findMines = cell => {
        let minesInProximity = 0;
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if (cell.y + row >= 0 && 
                    cell.x + col >= 0) {
                    if (cell.y + row < this.state.rows.length && 
                        cell.x + col < this.state.rows[0].length) {
                        if (this.state.rows[cell.y + row][cell.x + col].hasMine && 
                            !(row === 0 && col === 0)) {
                            minesInProximity++;
                        }
                    }
                }
            }
        }

        return minesInProximity;
    }

    findAroundCell = cell => {
        let rows = this.state.rows;

        // we're gonna go through each cell and open cells one by one until we find one with a mine, then we stop
        for (let row = -1; row <= 1; row++) {
            for (let col = -1; col <= 1; col++) {
                if (cell.y + row >= 0 && 
                    cell.x + col >= 0) {
                    if (cell.y + row < this.state.rows.length && 
                        cell.x + col < this.state.rows[0].length) {
                        if (!this.state.rows[cell.y + row][cell.x + col].hasMine &&
                            !this.state.rows[cell.y + row][cell.x + col].isOpen) {
                                this.open(rows[cell.y + row][cell.x + col]);
                            }
                    }
                }
            }
        }
    }



    render() {
        let rows = this.state.rows.map((row, index) => {
            return (
                <Row 
                    cells={row}
                    key={index}
                    open={this.open}
                    flag={this.flag}
                />
            )
        })
        return (
            <div className="board">
                {rows}
            </div>
        )
    }
}
