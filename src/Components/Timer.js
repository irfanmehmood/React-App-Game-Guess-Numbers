import React from 'react';
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState((prevState) => ({
      seconds: prevState.seconds + 1
    }));
    this.props.tickGlobal();
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    let message;
    if (this.state.seconds <= 59) {
      message = <h4 id="timerH4">Game Time: {this.state.seconds} seconds</h4>
    } else {
      message = <h4 id="timerH4">Game Time: {Math.floor(this.state.seconds / 60)} Mins {this.state.seconds % 60} Sec</h4>
    }

    return (
      <div>
        {message}
      </div>
    );
  }
}
export default Timer;
