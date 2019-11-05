import React, { Component } from 'react';

class Instructions extends Component {

  render() {

    var button;
    if(this.props.bandaIjazatHay === '1'){
      button = <span> <button className="start-game btn btn-success" onClick={this.props.startGame}><i className="fa fa fa-check"></i>Start Game</button></span>

    } else {

      button = <a id="loginButton" className="btn btn-danger" href="/user/login"><i className="fa fa fa-check"></i> Login Required</a>
    }


    return (
      <div className="Instructions">
        <ul>
        <li>First, {button} </li>
        <li>Watch AI select squares.</li>
        <li>Then its your turn.</li>
        </ul>
      </div>
    );
  }
}

export default Instructions;
