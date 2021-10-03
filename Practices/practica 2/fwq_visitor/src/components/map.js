import { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

function Map(props) {
    const history = useHistory();
    const socket = props.socket;

    const [user, setUser] = [props.user, props.setUser];
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si el usuario no esta registrado, no le permitimos acceder a esta página.
        if (!user.id)
            history.push("/");

        bindSokets();
        setLoading(false);
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

            <div hidden={!loading} width="100%" className="d-flex flex-row justify-content-center">
                <img hidden={!loading} alt="loading img" src={"https://codemyui.com/wp-content/uploads/2017/11/gradient-colour-slide-puzzle-style-loading-animation.gif"} />
            </div>
            <div hidden={loading} className="text-center mt-5">
                <button onClick={desregistrar} className="btn btn-danger"> Salir del parque.</button>
            </div>
        </div >
    )

}

export default Map;