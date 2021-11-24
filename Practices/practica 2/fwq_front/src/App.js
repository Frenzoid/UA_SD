import { Switch, Route } from "react-router-dom";

import Map from './components/map';
import Logs from './components/logs'

function App() {

  return (
    <div>
      <div className="d-flex flex-row justify-content-center mt-3">
        <a className="btn btn-primary m-1" href="/">Ver Mapa</a>
        <a className="btn btn-primary m-1" href="/logs">Ver Logs</a>
      </div>

      <Switch>
        <Route path="/logs">
          <Logs></Logs>
        </Route>


        <Route path="/">
          <Map></Map>
        </Route>

      </Switch>
    </div>
  );
}

export default App;
