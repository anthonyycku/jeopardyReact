import './App.css';
import React from "react";
const axios = require("axios");


const ButtonReady = props => {
  return <div>
    <button className="btn btn-warning" onClick={props.decrease}>Decrease</button>
    <button className="btn btn-success" onClick={props.increase}>Increase</button>
    <button className="btn btn-danger" onClick={props.reset}>Reset</button>
  </div>
}

const ButtonUnready = props => {
  return <div>
    <button disabled className="btn btn-warning" onClick={props.decrease}>Decrease</button>
    <button disabled className="btn btn-success" onClick={props.increase}>Increase</button>
    <button className="btn btn-danger" onClick={props.reset}>Reset</button>
  </div>
}

class Reveal extends React.Component {
  state = {
    reveal: false,
  }
  reveal = () => {
    this.setState({
      reveal: !this.state.reveal
    })
  }
  hide = () => {
    this.setState({
      reveal: false
    })
  }
  render() {
    return <div>
      {
        this.state.reveal ?
          <h3 style={{ color: "green" }} onClick={this.reveal}>{this.props.answer}</h3>
          :
          <div>
            <h3 onClick={this.reveal}>Reveal the answer!</h3>
          </div>
      }
    </div>
  }
}

const initialState = {
  score: 0,
  ready: false
}

class App extends React.Component {
  state = initialState;

  play = () => {
    axios.get("http://jservice.io/api/random").then(response => {
      this.setState({
        ready: true,
        question: response.data[0].question,
        answer: response.data[0].answer,
        value: response.data[0].value,
        category: response.data[0].category.title,
        reveal: false,
      })
    })
    this.changeReveal.current.hide();
  }
  decrease = () => {
    this.setState({
      score: this.state.score -= this.state.value,
      ready: false
    })
  }
  increase = () => {
    this.setState({
      score: this.state.score += this.state.value,
      ready: false
    })
  }
  reset = () => {
    this.setState(initialState);
  }
  changeReveal = React.createRef();

  render() {
    const { question, answer, value, category } = this.state;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1> Welcome to Jeffpardy</h1 >
        <h2><span style={{ color: "gold" }}>Score: </span> {this.state.score}</h2>

        <div>
          {this.state.ready ?
            <ButtonReady decrease={this.decrease} increase={this.increase} reset={this.reset} />
            :
            <ButtonUnready decrease={this.decrease} increase={this.increase} reset={this.reset} />
          }
        </div>

        <button className="btn btn-primary" onClick={this.play}>New Question</button>
        <h3><span style={{ color: "gold" }}>Category: </span>{category}</h3>
        <h3><span style={{ color: "gold" }}>Value:</span> {value}</h3>
        <h3><span style={{ color: "lightgreen" }}>Question: </span>{question}</h3>

        <div className="answer">
          <Reveal answer={answer} ref={this.changeReveal} />
        </div>
      </div >
    )
  }
}

export default App;