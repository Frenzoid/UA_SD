import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

function Register(props) {
    const history = useHistory();
    const socketRegistry = props.socketRegistry;
    const socketRegistryConnected = props.socketRegistryConnected;

    const [user, setUser] = [props.user, props.setUser];
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Si el usuario ya esta registrado, no le permitimos acceder a esta página.
        if (user.id && socketRegistryConnected)
            history.push("/map");

        bindSokets();
    }, []);

    let bindSokets = () => {
        socketRegistry.on("usuario_registrado", (registeredUser) => {
            setUser(registeredUser);
            history.push("/map");
        });

        socketRegistry.on("error_registry", (err) => { setErrorMsg(err) });
    };

    let registrarse = (e) => {
        e.preventDefault();

        if (!user.name || !user.password)
            setErrorMsg("Faltan datos!");
        else
            socketRegistry.emit("registrar_usuario", user);
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
                        <input disabled={!socketRegistryConnected ? true : false} onChange={(e) => { setUser({ ...user, name: e.target.value }); }} className="form-control" placeholder="Introduce tu name de user"></input>
                    </div>
                    <div className="form-check p-0 mb-3">
                        <label>Password</label>
                        <input disabled={!socketRegistryConnected ? true : false} onChange={(e) => { setUser({ ...user, password: e.target.value }) }} className="form-control" placeholder="Introduce tu contraseña" type="password"></input>
                    </div>
                    <button onClick={registrarse} disabled={!socketRegistryConnected ? true : false} className="btn btn-primary">
                        Registrarse!
                    </button>
                </form>

                {!errorMsg && socketRegistryConnected ? "" :
                    <div style={{ width: "100%" }} className="card card-header bg-danger text-white text-center mt-3">

                        {!socketRegistryConnected ? "Se ha pedido la conexion con el servidor, reconectando..." : errorMsg}

                        <div hidden={socketRegistryConnected ? true : false} className="text-center mt-2">
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