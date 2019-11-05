import React, { Component } from 'react';

class ResultItem extends Component {

  render() {
    return (
      <li className={this.props.answerStatus}>
        <strong>{this.props.message}</strong>
      </li>
    );
  }
}

export default ResultItem;
