const Card = (props) => {

	return(
  	<div style={{inlineBlock: "2em", marginBottom: "10px"}}>
    	<img width="75px" src={props.avatar_url} />
      <div className="info">
        <div style={{fontWeight: "bold"}}>{props.name}</div>
        <div>{props.company}</div>
      </div>
    </div>
  );
}

const CardList = (props) => {
  return(
    <div>
     {props.cards.map(card => <Card key={card.id} {...card} />)}
    </div>
  );
}

class Form extends React.Component {
	state = { userName: '' };
  handleSubmit = (event) => {
		event.preventDefault();
    axios.get(`https://api.github.com/users/${this.state.userName}`)
    	.then(resp => {
        this.props.onSubmit(resp.data);
      	this.setState({userName: ''});
      });
  }
  
	render(){
    return(
      <form style={{marginBottom: "10px"}} onSubmit={this.handleSubmit}>
        <input type="text"
          placeholder="Github username" 
          value={this.state.userName}
          onChange={(event) => this.setState({ userName: event.target.value})}
          required />
        <button type="submit">Add card</button>
      </form>
    );
  }
}

class App extends React.Component {
  state = {
    cards: []
  };
  
  addNewCard = (cardInfo) => {
  	this.setState(prevState => ({
    	cards: prevState.cards.concat(cardInfo)  
    }));
  }

  render(){
		return(
      <div>
        <Form onSubmit={this.addNewCard}/>
        <CardList cards={this.state.cards}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);