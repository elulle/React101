//Task 1 - buttons that increment values. 

class Button extends React.Component {
	// constructor(props){
	// super(props);
	// this.state = { counter: 0 };
	// }
  
  handleClick = () => {
  	this.props.onClickFunction(this.props.incrementValue);
  };
  
	render() {
    return (
			<button 
      	onClick={this.handleClick}>
      	+{this.props.incrementValue}
      </button>
    );
  }
}

const Result = (props) => {
	return (
  	<div>{props.counter}</div>
  );
};

class App extends React.Component {
 state = {counter: 0};
 
 incrementCounter = (incrementValue) => {
 	  //use prevState if the updated state relys on the current state
  	this.setState((prevState) => ({
      counter: prevState.counter + incrementValue
    }));
 };
 
	render() {
  	return(
      <div>
        <Button incrementValue = {1} onClickFunction = {this.incrementCounter}/>
        <Button incrementValue = {5} onClickFunction = {this.incrementCounter}/>
        <Button incrementValue = {10} onClickFunction = {this.incrementCounter}/>
        <Button incrementValue = {20} onClickFunction = {this.incrementCounter}/>
        <Result counter = {this.state.counter}/>
  	  </div>
    );
  };
};

ReactDOM.render(<App />, mountNode);