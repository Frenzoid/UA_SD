import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from "react-router-dom";
import { socketRegistry } from "./configs/socket";
import { kafkaWebSocket } from "./configs/socket";

import Register from './components/register';
import Login from './components/login'
import Map from './components/map';
import Edit from './components/edit'

function App() {
  const [user, setUser] = useState({ name: "", password: "" });
  const [socketRegistryConnected, setSocketConnected] = useState(false);

  const history = useHistory();

  useEffect(() => {
    bindSokets();
  }, []);

  let bindSokets = () => {
    socketRegistry.on("connect", () => { setSocketConnected(true) });
    socketRegistry.on("connect_error", () => { setSocketConnected(false); if (history.location.pathname != "/") history.push("/") });
  };

  return (
    <Switch>

      <Route path="/map">
        <Map
          socketRegistryConnected={socketRegistryConnected}
          socketRegistry={socketRegistry}
          kafkaWebSocket={kafkaWebSocket}
          user={user}
          setUser={setUser}
        ></Map>
      </Route>

      <Route path="/edit">
        <Edit
          socketRegistryConnected={socketRegistryConnected}
          socketRegistry={socketRegistry}
          user={user}
          setUser={setUser}
        ></Edit>
      </Route>

      <Route path="/register">
        <Register
          socketRegistryConnected={socketRegistryConnected}
          socketRegistry={socketRegistry}
          user={user}
          setUser={setUser}
        ></Register>
      </Route>

      <Route path="/">
        <Login
          socketRegistryConnected={socketRegistryConnected}
          socketRegistry={socketRegistry}
          user={user}
          setUser={setUser}
        ></Login>
      </Route>
    </Switch>
  );
}

export default App;
