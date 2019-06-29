import React from 'react';
import Board from './components/Board'
import BoardHead from './components/BoardHead'

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "waiting", // waiting, running, ended
      rows: 10,
      columns: 10,
      flags: 10,
      mines: 10,
      openCells: 0,
      time: 0
    }

    this.baseState = this.state;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.status === "running"){
      this.checkForWinner();
    }
  }

  endGame = () => {
    this.setState({
      status: "ended"
    })
  }

  checkForWinner = () => {
    if (this.state.mines + this.state.openCells >= this.state.rows * this.state.columns) {
      this.setState({
        status: "winner"
      }, alert('ggwp'))
    }
  }

  reset = () => {
    this.intervals.map(clearInterval);
    this.setState({...this.baseState}, () => {
      this.intervals = [];
    })
  }

  componentWillMount() {
    this.intervals = [];
  }

  tick = () => {
    if (this.state.openCells > 0 && this.state.status === "running") {
      let time = this.state.time + 1;
      this.setState({ time })
    }
  }

  setInterval = (fn, t) => {
    this.intervals.push(setInterval(fn, t));
  }

  handleCellClicked = () => {
    if (this.state.openCells === 0 && this.state.status !== "running") {
      this.setState({
        status: "running"
      }, () => {
        this.setInterval(this.tick, 1000)
      })
    }

    this.setState(prevState => {
      return { openCells: prevState.openCells + 1 };
    })
  }

  changeFlagAmount = (amount) => {
    this.setState({ flags: this.state.flags + amount })
  }

  render() {
    return (
      <div className="minesweeper">
      <h1>Minesweeper</h1>
        <BoardHead reset={this.reset} time={this.state.time} flagCount={this.state.flags}/>
        <Board status={this.state.status} changeFlagAmount={this.changeFlagAmount} endGame={this.endGame} rows={this.state.rows} columns={this.state.columns} mines={this.state.mines} openCells={this.state.openCells} openCellClick={this.handleCellClicked} />
      </div>
    );
  }
}

export default Minesweeper;
