import React, { Component } from 'react';

class Square extends Component {

  constructor(props) {
    super(props);
    this.state = { selected: "squareDisabled"};
  }

  componentWillReceiveProps() {
    if (this.props.enableButtons) {
      this.setState({selected:"square"});
    }else {
      if (this.props.currentRandomNo === this.props.id) {
          this.setState({selected:"squareDisabled selected"});
      } else if (this.props.previousRandomNo === this.props.id) {
          this.setState({selected:"squareDisabled"});
      }
    }
  }

  render() {
    return (
      <button id={this.props.id} className={this.state.selected} onClick={this.props.userAnsweredSquareClicked}>
        {this.props.id}
      </button>
    );
  }
}

export default Square;
