import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

function Register(props) {
    const history = useHistory();
    const socket = props.socket;
    const socketConnected = props.socketConnected;

    const [user, setUser] = [props.user, props.setUser];
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Si el usuario ya esta registrado, no le permitimos acceder a esta página.
        if (user.id && socketConnected)
            history.push("/map");

        bindSokets();
    }, []);

    let bindSokets = () => {
        socket.on("usuario_registrado", (registeredUser) => {
            setUser(registeredUser);
            history.push("/map");
        });

        socket.on("error_registry", (err) => { setErrorMsg(err) });
    };

    let registrarse = (e) => {
        e.preventDefault();

        if (!user.name || !user.password)
            setErrorMsg("Faltan datos!");
        else
            socket.emit("registrar_usuario", user);
    }


    return (
        <div className="container">
            <div>
                <h1 className="text-center mt-3">
                    ¡ Hola {user.name} !
                </h1>

                <form>
                    <div className="form-group p-0 mb-3">
                        <label>Name</label>
                        <input disabled={!socketConnected ? true : false} onChange={(e) => { setUser({ ...user, name: e.target.value }); }} className="form-control" placeholder="Introduce tu name de user"></input>
                    </div>
                    <div className="form-check p-0 mb-3">
                        <label>Password</label>
                        <input disabled={!socketConnected ? true : false} onChange={(e) => { setUser({ ...user, password: e.target.value }) }} className="form-control" placeholder="Introduce tu contraseña" type="password"></input>
                    </div>
                    <button onClick={registrarse} disabled={!socketConnected ? true : false} className="btn btn-primary">
                        Registrarse!
                    </button>
                </form>

                {!errorMsg && socketConnected ? "" :
                    <div style={{ width: "100%" }} className="card card-header bg-danger text-white text-center mt-3">

                        {!socketConnected ? "Se ha pedido la conexion con el servidor, reconectando..." : errorMsg}

                        <div hidden={socketConnected ? true : false} className="text-center mt-2">
                            <div className="spinner-border">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                    </div>
                }
            </div >
        </div >
    )

}

export default Register;