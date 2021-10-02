import './App.css';
import { Component } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Square from "./square";

class App extends Component {
  constructor() {
    super();

    this.n = 20;
    this.matriz = [];

    for (let i = 0; i < this.n; i++) {
      this.matriz[i] = [];
      for (let j = 0; j < this.n; j++) {
        this.matriz[i][j] = { color: "red", coords: [i, j] }
      }
    }

    this.state = {
      matriz: this.matriz,
      usuario: "lol"
    }

  }



  updateCell = (i, j) => {
    let matriz = this.state.matriz;
    matriz[i][j].color = "blue";
    this.setState({ matriz });
  }

  render() {
    return (
      <BrowserRouter >
        <Switch>
          <Route path="/aaaa">
            <Link to="/"> aaaaaaaaaaaaa </Link>
            <div>
              AAAAAAAAAA
            </div>
          </Route>

          <Route path="/">
            <Link to="/aaaa"> aaaaaaaaaaaaa </Link>

            <div className="container">
              <h1>{this.state.usuario}</h1>
              <input onChange={(event) => { this.usuario = event.target.value; this.setState({ usuario: this.usuario }) }}>
              </input>
              {this.matriz.map((i, ix) => {
                return (
                  <div key={ix} className="d-flex flex-row wrap">

                    {i.map((j, jx) => {
                      return (

                        <Square
                          key={ix + ", " + jx}
                          i={ix}
                          j={jx}
                          updateCell={this.updateCell}
                          color={this.state.matriz[ix][jx].color}
                        ></Square>

                      )
                    })}

                  </div>
                )
              })}
            </div>
          </Route>

        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
