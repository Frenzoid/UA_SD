import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from "react-router-dom";
import { socketRegistry } from "./configs/socket";
import { kafkaWebSocket } from "./configs/socket";

import Register from './components/register';
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

      <Route path="/">

        {/* Así es como se pasan variables a los componentes hijos,
        los hijos los reciben por parametro en la variable "props" */}
        <Register
          socketRegistryConnected={socketRegistryConnected}
          socketRegistry={socketRegistry}
          user={user}
          setUser={setUser}
        ></Register>
      </Route>

    </Switch>
  );
}

export default App;
