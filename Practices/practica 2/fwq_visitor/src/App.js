import { useState } from 'react';
import { Switch, Route } from "react-router-dom";
import { socket } from "./configs/socket";

import Register from './components/register';
import Map from './components/map';
import Edit from './components/edit'

function App() {
  const [user, setUser] = useState({});
  const [socketLoaded, setSL] = useState(false);

  return (
    <Switch>

      <Route path="/map">
        <Map
          socket={socket}
          user={user}
          setUser={setUser}
        ></Map>
      </Route>

      <Route path="/edit">
        <Edit
          socket={socket}
          user={user}
          setUser={setUser}
        ></Edit>
      </Route>

      <Route path="/">

        {/* Así es como se pasan variables a los componentes hijos,
        los hijos los reciben por parametro en la variable "props" */}
        <Register
          socketLoaded={socketLoaded}
          setSL={setSL}
          socket={socket}
          user={user}
          setUser={setUser}
        ></Register>
      </Route>

    </Switch>
  );
}

export default App;
