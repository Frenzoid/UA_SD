import './App.css';
import { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from "react-router-dom";
import { socket } from "./configs/socket";

function App() {
  let once = false;
  const history = useHistory();

  const [nombre, setNombre] = useState();
  const [contrasenya, setContrasenya] = useState();
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    if (!once) {
      once = true;
      bindSokets();

      history.listen(() => {
        console.log(window.location.pathname);
      });
    }
  }, [])

  let bindSokets = () => {
    socket.on("aforo_maximo", (error) => { setErrorMsg(error) })
    socket.on("registrar_usuario", (error) => { setErrorMsg(error) })
    socket.on('connect_error', (err) => {
      console.log("Se ha perdido la conexion con el servidor, reintentando.");
    });
  }

  let registrarse = (e) => {
    e.preventDefault();
    console.log("asasdasdasdsaddsa")
    if (!nombre || !contrasenya)
      setErrorMsg("Faltan datos!")

    socket.emit("registrar_usuario", { nombre, contrasenya })
  }

  return (
    <Switch>

      <Route path="/a">
        <Link to="/">Volver</Link>

      </Route>

      <Route path="/">
        <div className="container">

          <h1 className="text-center mt-3">
            {!nombre ? "" : `Hola ${nombre}!`}
          </h1>

          <form>
            <div className="form-group p-0 mb-3">
              <label>Name</label>
              <input onChange={(e) => { setNombre(e.target.value) }} className="form-control" placeholder="Introduce tu nombre de usuario"></input>
            </div>
            <div className="form-check p-0 mb-3">
              <label>Password</label>
              <input onChange={(e) => { setContrasenya(e.target.value) }} className="form-control" placeholder="Introduce tu contraseña" type="password"></input>
            </div>
            <button onClick={registrarse} className="btn btn-primary">Registrarse!</button>
          </form>

          {
            !errorMsg ? "" :
              <div style={{ width: "100%" }} className="card card-header bg-danger text-white mt-3">
                {errorMsg}
              </div>
          }
        </div>
      </Route>

    </Switch>
  );
}

export default App;
