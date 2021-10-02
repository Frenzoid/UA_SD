import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

class App extends Component {
  constructor() {
    super();

    this.state = {
      titulo: "Hola",
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.titulo}
          </p>
          <input onChange={(e) => { this.setState({ titulo: e.target.value }) }}></input>
          Learn React

        </header>
      </div>
    )
  }

}

export default App;
