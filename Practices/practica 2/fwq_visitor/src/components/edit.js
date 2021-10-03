import { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

function Edit(props) {
    const history = useHistory();
    const socket = props.socket;

    const [user, setUser] = [props.user, props.setUser];
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bindSokets();
    }, []);

    let bindSokets = () => {
        socket.on("usuario_editado", (registeredUser) => {
            setUser(registeredUser);
            history.push("/map");
        })

        socket.on("error_registry", (err) => { setErrorMsg(err) });
        socket.on("connect", () => { setLoading(false); setErrorMsg(""); });
        socket.on("connect_error", () => { setLoading(false); setErrorMsg("No hay conexión con FWQ_Registry, intentando reconexión.") });
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

            <div hidden={!loading} width="100%" className="d-flex flex-row justify-content-center">
                <img hidden={!loading} alt="loading img" src={"https://codemyui.com/wp-content/uploads/2017/11/gradient-colour-slide-puzzle-style-loading-animation.gif"} />
            </div>
            <div hidden={loading}>
                <h1 className="text-center mt-3">
                    ¡ Hola {user.name} !
                </h1>

                <form>
                    <div className="form-group p-0 mb-3">
                        <label>Name</label>
                        <input disabled={errorMsg.includes("conexión") ? true : false} value={user.name} onChange={(e) => { setUser({ name: e.target.value, password: user.password }) }} className="form-control" placeholder="Introduce tu name de user"></input>
                    </div>
                    <div className="form-check p-0 mb-3">
                        <label>Password</label>
                        <input disabled={errorMsg.includes("conexión") ? true : false} value={user.password} onChange={(e) => { setUser({ name: user.name, password: e.target.value }) }} className="form-control" placeholder="Introduce tu contraseña" type="password"></input>
                    </div>
                    <button onClick={registrarse} disabled={errorMsg.includes("conexión") ? true : false} className="btn btn-primary">
                        Registrarse!
                    </button>
                </form>

                {!errorMsg ? "" :
                    <div style={{ width: "100%" }} className="card card-header bg-danger text-white text-center mt-3">
                        {errorMsg}
                        <div hidden={!errorMsg.includes("conexión") ? true : false} class="text-center mt-2">
                            <div class="spinner-border">
                                <span span class="sr-only"></span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div >
    )

}

export default Edit;