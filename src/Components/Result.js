import React, { Component } from 'react';
import ResultItem from './ResultItem';
class Result extends Component {

  renderResultItem() {
    var resultItems = [];
    if(this.props.resultsList){
      for (var i=0; i < this.props.resultsList.length; i++) {
          resultItems.push(<ResultItem key={i} answerStatus={this.props.resultsList[i].correct} message={this.props.resultsList[i]['msg']} />);
      }
    }
    return resultItems;
  }

  render() {
    return (
      <ul className="Project">
        {this.renderResultItem()}
      </ul>
    );
  }
}

export default Result;
