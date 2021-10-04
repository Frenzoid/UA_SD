import { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from "react-router-dom";
import { socket } from "./configs/socket";

import Register from './components/register';
import Map from './components/map';
import Edit from './components/edit'

function App() {
  const [user, setUser] = useState({ name: "", password: "" });
  const [socketConnected, setSocketConnected] = useState(false);

  const history = useHistory();

  useEffect(() => {
    bindSokets();
  }, []);

  let bindSokets = () => {
    socket.on("connect", () => { setSocketConnected(true) });
    socket.on("connect_error", () => { setSocketConnected(false); if (history.location.pathname != "/") history.push("/") });
  };

  return (
    <Switch>

      <Route path="/map">
        <Map
          socketConnected={socketConnected}
          socket={socket}
          user={user}
          setUser={setUser}
        ></Map>
      </Route>

      <Route path="/edit">
        <Edit
          socketConnected={socketConnected}
          socket={socket}
          user={user}
          setUser={setUser}
        ></Edit>
      </Route>

      <Route path="/">

        {/* Así es como se pasan variables a los componentes hijos,
        los hijos los reciben por parametro en la variable "props" */}
        <Register
          socketConnected={socketConnected}
          socket={socket}
          user={user}
          setUser={setUser}
        ></Register>
      </Route>

    </Switch>
  );
}

export default App;