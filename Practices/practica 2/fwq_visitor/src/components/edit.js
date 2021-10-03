import { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

function Edit(props) {
    const history = useHistory();
    const socket = props.socket;
    const socketConnected = props.socketConnected;

    const [user, setUser] = [props.user, props.setUser];
    const [errorMsg, setErrorMsg] = useState("");

    const prevUser = { ...user };

    useEffect(() => {
        bindSokets();
    }, []);

    let bindSokets = () => {
        socket.on("usuario_editado", (registeredUser) => {
            setUser(registeredUser);
            history.push("/map");
        })

        socket.on("error_registry", (err) => { setErrorMsg(err) });
    };

    let registrarse = (e) => {
        e.preventDefault();
        console.log(user)
        if (!user.name || !user.password)
            setErrorMsg("Faltan datos!");

        socket.emit("editar_usuario", user);
    }


    return (
        <div className="container">
            <div>
                <h1 className="text-center mt-3">
                    ¡ Editando {prevUser.name} !
                </h1>

                <form>
                    <div className="form-group p-0 mb-3">
                        <label>Name</label>
                        <input value={prevUser.name} disabled={!socketConnected ? true : false} onChange={(e) => { let updatedUser = { ...user }; updatedUser.name = e.target.value; setUser(updatedUser); }} className="form-control" placeholder="Introduce tu name de user"></input>
                    </div>
                    <div className="form-check p-0 mb-3">
                        <label>Password</label>
                        <input value={prevUser.password} disabled={!socketConnected ? true : false} onChange={(e) => { let updatedUser = { ...user }; updatedUser.name = e.target.value; setUser(updatedUser); }} className="form-control" placeholder="Introduce tu contraseña" type="password"></input>
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
            </div>
        </div >
    )

}

export default Edit;