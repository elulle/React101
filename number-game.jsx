var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};


const Stars = (props) => {  
//   let stars = [];
//   for(let i=0; i<numberOfStars; i++ ){
//   	stars.push(<i key={i} className="fa fa-star"></i>);
//   }
  return(
    <div className="col-5">
      {_.range(props.numberOfStars).map(i =>
        <i key={i} className="fa fa-star"></i>
      )}
    </div>
  );
}

const Button = (props) => {
	let button;
  let buttonIcon;
  switch(props.answerIsCorrect){
  	case true: 
      button =
      	<button className="btn btn-success" onClick={props.acceptAnswer}>
        	<i className='fa fa-check'></i>
        </button>
      break;
    case false:
    	button = 
      	<button className="btn btn-danger">
        	<i className='fa fa-times'></i>
        </button>
      break;
    default:
    	button = 
      	<button
          disabled={props.selectedNumbers.length === 0}
          onClick={() => props.checkAnswer(props.selectedNumbers)}
          className='btn btn-info'>
          =
      </button>
      break;
    
  }
	return(
  	<div className="col-2 text-center">
    	{button}
      <br />
      <br />
      <button className="btn btn-warning btn-sm" 
      				onClick={props.redraw}
              disabled={props.redraws===0}>
        <i className="fa fa-sync"> {props.redraws}</i>
      </button>
    </div>
  );
}

const Answer = (props) => {
	return(
  	<div className="col-5">
     {props.selectedNumbers.map((number, i) =>
     		<span key={i} onClick={() => props.unselectNumbers(number)}> {number} </span>
     )}
    </div>
  );
}

const Numbers = (props) => {
	const numbersClass = (number) => {
    if(props.usedNumbers.indexOf(number) >= 0){
      return 'used';
    };
    if(props.selectedNumbers.indexOf(number) >= 0){
      return 'selected';
    }
  }

	return(
  	<div className="card text-center">
    	<div>
      	{Numbers.list.map((number, i) => 
        	<span key={i} className={numbersClass(number)}
          			onClick={() => props.selectNumber(number)}>
          	{number}
          </span>
        )}
      </div>
    </div>
  );
}

Numbers.list = _.range(1,10);

const DoneFrame = (props) => {
	return(
  	<div className="text-center">
    	<br />
  	  <h2>{props.doneStatus}</h2>
      <button className="btn btn-secondary" onClick={props.resetGame}>Play Again </button>
  	</div>
  );
}

class Game extends React.Component{
	static randomNumber = () =>1 + Math.floor(Math.random()*9);
  static initialState = () => ({
  	selectedNumbers: [],
    usedNumbers: [],
    numberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null,
  });
	state = Game.initialState();
  
  resetGame = () => this.setState(Game.initialState());
  
  selectNumber = (clickedNumber) => {
  	if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0){ return; }
    
  	if (this.state.usedNumbers.indexOf(clickedNumber) >= 0){ return; }
    
  	this.setState(prevState => ({
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
    	answerIsCorrect: null,
  	}));
  };
  
  unselectNumbers = (clickedNumber) => {
  	this.setState(prevState => ({
    	selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber),
      answerIsCorrect: null,
    }));
  };
  
  checkAnswer = (selectedNumbers) => {
    let totalSum = 0;
  	const reducer = (accumulator, currentValue) => accumulator + currentValue;
  	totalSum = selectedNumbers.reduce(reducer);
    this.setState({
    	answerIsCorrect: this.state.numberOfStars === totalSum,
    })
  };
  
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(this.state.selectedNumbers),
      selectedNumbers: [],
    	answerIsCorrect: null,
      numberOfStars: Game.randomNumber(),
  	}), this.updateDoneStatus);
  };
  
  redraw = () => {
  if(this.state.redraws === 0){ return; };
  	this.setState(prevState => ({
    	 numberOfStars: Game.randomNumber(),
       answerIsCorrect: null,
       selectedNumbers: [],
       redraws: prevState.redraws -1,
 		}), this.updateDoneStatus);
  };
  
  possibleSolution = ({numberOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1,10).filter(number =>
    	usedNumbers.indexOf(number) ===-1
    );
    
    return possibleCombinationSum(possibleNumbers, numberOfStars);
  }
  
  updateDoneStatus = () => {
  	this.setState( prevState => {
    	if(prevState.usedNumbers.length === 9){
      	return {doneStatus: "Well Done"};
      };
      if( prevState.redraws === 0 && !this.possibleSolution(prevState)){
      	return {doneStatus: "Game Over"};
      };
    });
  };
  
  render(){
  	const {
    				selectedNumbers,
            numberOfStars,
            answerIsCorrect,
            usedNumbers,
            redraws,
            doneStatus
          } = this.state;
  
    return(
      <div className="container">
      	<h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={numberOfStars} />
          <Button selectedNumbers={selectedNumbers}
          	answerIsCorrect = {answerIsCorrect}
            checkAnswer = {this.checkAnswer}
            acceptAnswer = {this.acceptAnswer}
            redraw = {this.redraw}
            redraws = {redraws} />
          <Answer selectedNumbers={selectedNumbers}
          	unselectNumbers = {this.unselectNumbers} />
        </div>
        <br />
        {doneStatus ?
       	 <DoneFrame doneStatus={doneStatus}
         						resetGame={this.resetGame}/> :
         <Numbers selectedNumbers={selectedNumbers}
                  selectNumber={this.selectNumber}
                  usedNumbers={usedNumbers}/>
        }
      </div>
    );
  }
}

class App extends React.Component{
	render(){
    return(
      <div>
      	<Game />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);

// .fa-star {
// 	margin: 0.5em;
//   font-size: 24px;
// }

// span {
// 	display: inline-block;
//   margin: 0.5em;
//   font-size:18px;
//   background-color: lightblue;
//   border-radius: 50%;
//   width:24px;
//   cursor: pointer;
//   text-align: center;
// }

// span.selected{
// 	background-color: #aaddaa;
//   cursor: not-allowed;
// }

// span.used{
// 	background-color: #eee;
//   color: #ccc;
//   cursor: not-allowed;
// }