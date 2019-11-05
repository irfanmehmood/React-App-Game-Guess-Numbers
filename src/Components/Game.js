import React, { Component } from 'react';
import Timer from './Timer';
import Square from './Square';
import Result from './Result';
import Instructions from './Instructions';

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bandaIjazatHay: document.getElementById('bandaIjazatHay').innerHTML,
      globalCounter: 0,
      heightStyle: '',
      userIncrementalCounter: 0,
      currentRandomNo: 0,
      previousRandomNo: 0,
      aIFinished: true,
      firstStart : false,
      showLastScoresAfterGameFinished: false,
      gameFinished : true,
      userCorrectAnswers : 0,
      correctAnswerBtnEnabled : false,
      wrongAnswerBtnEnabled : false,
      aILastSquareDeselected: false,
      gameLength: 0,
      enableButtons : false,
      gameLevel: 1,
      resultsList : [],
      randNumList: []
    };
    this.handleStartGame = this.handleStartGame.bind(this);
    this.handleEndGame = this.handleEndGame.bind(this);
    this.userAnsweredSquareClicked = this.userAnsweredSquareClicked.bind(this);


  }

  isAiTurnFinished() {
    if (this.state.globalCounter > this.state.gameLength){
        this.setState({'enableButtons': true});
        this.setState({'showLastScoresAfterGameFinished': true});

        return true;
    }
    return false;
  }

  tickGlobal() {





    if (this.state.aIFinished === false){
      //Deselect previous square
      //We do not have any previous squares to deslect as game started
      if (this.state.globalCounter !== 0) {
        this.setState({'previousRandomNo': this.state.randNumList[this.state.globalCounter -1]});
      }

      //Select the square
      this.setState({'currentRandomNo': this.state.randNumList[this.state.globalCounter]});

      //Update global counter
      this.setState({'globalCounter': this.state.globalCounter + 1});

      var isAiTurnFinished = this.isAiTurnFinished();
      if (isAiTurnFinished) {
          this.setState({'aIFinished': this.isAiTurnFinished()});
      }

      //console.log("Global Counter:" + this.state.globalCounter + " CurrentRandomNo:" + this.state.currentRandomNo + " PreviousRandomNo:" + this.state.previousRandomNo);
    }
  }


  getRandomNumbersList(listLength){
    var randoms = []; //set up empty array
    var max = 9;
    var min = 1;
    var randNo;
    for (var i = 0; i< listLength - 1; i++) {
        randNo = Math.floor(Math.random() * (max - min + 1)) + min;
        if (i !== 0 && randNo === randoms[(i -1)]){
          randNo = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        randoms.push(randNo);
    }
    ///console.log(randoms);
    return randoms;
  }

  handleStartGame(e) {

    var gameLevel = 1;
    var gameLength = 5;
    if ( this.state.gameLevel === 1 && this.state.userCorrectAnswers === 5) {
        gameLevel  = 2;
        gameLength = 10;
      } else if ( this.state.gameLevel === 2) {
        if ( this.state.userCorrectAnswers < 8) {
          gameLevel  = 2;
          gameLength = 10;
        } else {
          gameLevel  = 3;
          gameLength = 15;
        }
      } else if ( this.state.gameLevel === 3) {
        if ( this.state.userCorrectAnswers < 10) {
          gameLevel  = 3;
          gameLength = 15;
        } else {
          gameLevel  = 4;
          gameLength = 20;
        }

      }  else if ( this.state.gameLevel === 4) {
        if ( this.state.userCorrectAnswers < 15) {
          gameLevel  = 4;
          gameLength = 20;
        } else {
          gameLevel  = 5;
          gameLength = 25;
        }
      }


    e.preventDefault();


    this.setState({
      'globalCounter' : 0,
      'currentRandomNo' : 0,
      'previousRandomNo' : 0,
      'aIFinished': false,
      'gameLength' : gameLength,
      'gameLevel' : gameLevel,
      'gameFinished' : false,
      'enableButtons' : false,
      'firstStart' : true,
      'showLastScoresAfterGameFinished': false,
      'userIncrementalCounter' : 0,
      'userCorrectAnswers' : 0,
      correctAnswerBtnEnabled : false,
      wrongAnswerBtnEnabled : false,
      'resultsList' : [],
      'aILastSquareDeselected': false,
      'randNumList': []});
      this.setState({'randNumList': this.getRandomNumbersList(gameLength + 1)});
  }

  handleEndGame() {

  }

  userAnsweredSquareClicked(e) {
    if (this.state.aIFinished === true && this.state.gameFinished !== true ) {
      var correctAnswer = parseInt(this.state.randNumList[this.state.userIncrementalCounter],10);
      var userAnswer = parseInt(e.target.id,10);
      var message;
      var messageObj;
      var userCorrectAnswers = this.state.userCorrectAnswers ;

      if (correctAnswer !== userAnswer) {
        message = "Correct square no:" + correctAnswer + " You choose no: " + userAnswer;
        messageObj = {"correct": 'no-wrong', "msg" : message};
        this.setState({wrongAnswerBtnEnabled:true});
        this.setState({correctAnswerBtnEnabled:false});
      } else {
        message = "Correct square no:" + correctAnswer + " You choose no: " + userAnswer;
        messageObj = {"correct": 'yes-correct', "msg" : message};
        this.setState({wrongAnswerBtnEnabled:false});
        this.setState({correctAnswerBtnEnabled:true});
        userCorrectAnswers = this.state.userCorrectAnswers + 1;
      }

      var results = this.state.resultsList;
      results.push(messageObj);
      this.setState({resultsList:results, userIncrementalCounter: this.state.userIncrementalCounter+1});


      var gameFinished = this.isUserCurrentGameFinished();
      if (gameFinished) {
        this.setState({gameFinished:true});
        this.setState({'enableButtons': false});
      }
      this.setState({'userCorrectAnswers':userCorrectAnswers});
    }
  }


  apiLogUserGameFinishedResults(){

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/game/logresults');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            //var userInfo = JSON.parse(xhr.responseText);
            //console.log(userInfo);
        }
    };

    xhr.send(JSON.stringify({
        gameID: "1", gameLevel: this.state.gameLevel, gameLength: this.state.gameLength, userScore: this.state.userCorrectAnswers
    }));

  }



  isUserCurrentGameFinished() {
    if (this.state.userIncrementalCounter >= this.state.gameLength - 1){

        this.apiLogUserGameFinishedResults();
        this.setState({showLastScoresAfterGameFinished:true});

        return true;

    }
    return false;
  }

  renderSquare(i) {
    return <Square id={i}
    currentRandomNo={this.state.currentRandomNo}
    enableButtons={this.state.enableButtons}
    previousRandomNo={this.state.previousRandomNo}
    userAnsweredSquareClicked={this.userAnsweredSquareClicked}/>;
  }

  renderInstructions() {
    if (this.state.gameFinished === true) {
        return <Instructions startGame={this.handleStartGame} bandaIjazatHay={this.state.bandaIjazatHay}/>;
    }
    return null;
  }

  renderGameStatus() {
    var msg;
    if (this.state.gameFinished === true && this.state.aIFinished === true) {
      if (this.state.firstStart === false) {
        msg = <span className="red-msg"> START GAME </span>;
      }else {
        msg = <span className="red-msg"> GAME END </span>;
      }
    }else {
      if (this.state.aIFinished !== true) {
        msg = <span className="green-msg"> AI GO! </span>;
      } else  {
        msg = <span className="green-msg"> YOUR GO!  </span>;
      }
    }
    return msg;
  }

  renderGameStatusBlock() {
    var msg;
    if (this.state.gameFinished === true && this.state.aIFinished === true) {
      if (this.state.firstStart === false) {
        msg = <h3 className="red-msg"> START YOUR GAME</h3>;
      }else {
        msg = <h3 className="red-msg"> GAME HAS ENDED. RESTART. </h3>;
      }
    }else {
      if (this.state.aIFinished !== true) {
        msg = <h3 className="green-msg"> AI IS PLAYING. WATCH CAREFULLY </h3>;
      } else  {
        msg = <h3 className="green-msg">  YOUR GO! CLICK TO GUESS </h3>;
      }
    }
    return msg;
  }

  renderUserResults() {
    var element;
    if (this.state.resultsList.length > 0) {
      element = <div><h2>Player Score</h2>
      <div className="scoreDetails">
        <Result resultsList={this.state.resultsList} />
      </div></div>;
    }
    return element;
  }


  /**
 * Calculate & Update state of new dimensions
 */
updateDimensions() {
  //console.log(window.innerWidth);

  var buttonColWidth = document.getElementById("get-this-column-width").offsetWidth;
  buttonColWidth = buttonColWidth.toString();
  buttonColWidth = buttonColWidth + "px";
  //console.log(buttonColWidth);

  this.setState({'heightStyle':buttonColWidth});
}



    /**
     * Add event listener
     */
    componentDidMount() {
      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    renderStarButton() {
      var button;
      if(this.state.bandaIjazatHay === '1'){
        if (this.state.gameFinished) {
          if (this.state.firstStart) {
              button = <span> <button className="start-game-btn-home btn btn-success" onClick={this.handleStartGame}><i className="fa fa fa-check"></i>Restart Game - Rember the sequence</button></span>
          } else {
            button = <span> <button className="start-game-btn-home btn btn-success" onClick={this.handleStartGame}><i className="fa fa fa-check"></i>Start Game - Rember the sequence</button></span>
          }

        } else {
          if (!this.state.aIFinished) {
            button = <h3> Watch the blinking sequence </h3>
          }
        }
      } else {
        button = <a id="loginButton" className="start-game-btn-home btn btn-danger" href="/user/login"><i className="fa fa fa-check"></i> Login Required</a>
      }

      var correctIcon;
      var wrongIcon;
      if (this.state.correctAnswerBtnEnabled) {
        correctIcon = <i className="fa-4x fa fa-thumbs-up pull-right" aria-hidden="true"></i>
      };
      if (this.state.wrongAnswerBtnEnabled) {
        wrongIcon = <i className="fa-4x fa fa-thumbs-down pull-right" aria-hidden="true"></i>
      };
      if (this.state.aIFinished) {

           if (this.state.showLastScoresAfterGameFinished) {
             button = <div> {button} <div className="row gamestatusHolder"><div className="col-md-6">
             <h3> Your Score {this.state.userCorrectAnswers} / {this.state.gameLength}</h3>
             </div><div className="col-md-6">
              {correctIcon}{wrongIcon}
             </div></div></div>
           }

      }

      return button;
    }

    showCorrectOrWrongAnswerBox() {


    }



  render() {
    const heightStyle = {
      height: this.state.heightStyle,
    };

    return (
      <div>
        <div className="row">
          <Timer tickGlobal={this.tickGlobal.bind(this)}/>
        </div>
        <div className="row" className="gameContainerRow">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12 gameStatus-col"><h2  className="gameStatus">Level {this.state.gameLevel} - {this.renderGameStatus()}</h2></div>
              <div className="col-md-12 gameStart-col" >{this.renderStarButton()}</div>
            </div>
            <div className="row">
              <div style={heightStyle} id="get-this-column-width" className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(1)}</div>
              <div style={heightStyle} className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(2)}</div>
              <div style={heightStyle}  className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(3)}</div>
            </div>
            <div className="row">
              <div style={heightStyle} className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(4)}</div>
              <div style={heightStyle} className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(5)}</div>
              <div style={heightStyle} className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(6)}</div>
            </div>
            <div className="row">
              <div style={heightStyle} className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(7)}</div>
              <div style={heightStyle} className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(8)}</div>
              <div style={heightStyle} className="col-md-4 col-sm-4 col-xs-4 btn-div-container">{this.renderSquare(9)}</div>
            </div>
          </div>
          <div className="col-md-6">
            <h2>Player Menu</h2>
            <div className="playerMenu">
              {this.renderGameStatusBlock()}
              {this.renderInstructions()}
            </div>
            {this.renderUserResults()}
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
