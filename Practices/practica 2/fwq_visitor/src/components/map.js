import { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

function Map(props) {
    const history = useHistory();
    const socket = props.socket;

    const [user, setUser] = [props.user, props.setUser];

    useEffect(() => {
        // Si el usuario no esta registrado, no le permitimos acceder a esta página.
        if (!user.id)
            history.push("/");

        bindSokets();
    }, []);

    let bindSokets = () => {
        socket.on("usuario_desregistrado", () => { setUser({}); history.push("/"); })
    };

    let desregistrar = (e) => {
        e.preventDefault();
        socket.emit("desregistrar_usuario");
    }


    return (
        <div className="container">
            <div className="text-center my-3">
                <button onClick={desregistrar} className="btn btn-danger m-2"> Salir del parque.</button>
                <button onClick={(e) => { e.preventDefault(); history.push("/edit") }} className="btn btn-primary m-2"> Editar usuario.</button>
            </div>

            <code>
                {JSON.stringify(user)}
            </code>
        </div>
    )

}

export default Map;