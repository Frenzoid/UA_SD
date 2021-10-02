import { useState } from 'react';
import { Switch, Route } from "react-router-dom";
import Register from './components/register'

function App() {
  const [user, setUser] = useState({ name: "", password: "", id: "" });

  return (
    <Switch>

      <Route path="/usuarioregistrado">
        <h1>Se ha registrado el usuario:</h1>
        <pre>
          {JSON.stringify(user)}
        </pre>
      </Route>

      <Route path="/">

        {/* Así es como se pasan variables a los componentes hijos,
        los hijos los reciben por parametro en la variable "props" */}
        <Register
          user={user}
          setUser={setUser}
        ></Register>
      </Route>

    </Switch>
  );
}

export default App;
