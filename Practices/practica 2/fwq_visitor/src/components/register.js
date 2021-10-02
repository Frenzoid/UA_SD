import { socket } from "../configs/socket";
import { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

function Register(props) {
    const history = useHistory();
    const user = props.user;
    const setUser = props.setUser;

    const [errorMsg, setErrorMsg] = useState();

    useEffect(() => {
        bindSokets();

        history.listen((locationdata) => {
            console.log(locationdata.pathname);
        });
    }, [])

    let bindSokets = () => {
        socket.on("usuario_registrado", (registeredUser) => {
            setUser(registeredUser);
            history.push("/usuarioregistrado");
        })

        socket.on("aforo_maximo", (err) => { setErrorMsg(err) });
        socket.on("campos_faltates", (err) => { setErrorMsg(err) });
        socket.on("connect_error", (err) => { setErrorMsg(err) });
    };


    let registrarse = (e) => {
        e.preventDefault();
        console.log(user)
        if (!user.name || !user.password)
            setErrorMsg("Faltan datos!");

        socket.emit("registrar_usuario", user);
    }

    return (
        <div className="container">

            <h1 className="text-center mt-3">
                {!user.name ? "" : `Hola ${user.name}!`}
            </h1>

            <form>
                <div className="form-group p-0 mb-3">
                    <label>Name</label>
                    <input onChange={(e) => { setUser({ name: e.target.value, password: user.password }) }} className="form-control" placeholder="Introduce tu name de user"></input>
                </div>
                <div className="form-check p-0 mb-3">
                    <label>Password</label>
                    <input onChange={(e) => { setUser({ name: user.name, password: e.target.value }) }} className="form-control" placeholder="Introduce tu contraseña" type="password"></input>
                </div>
                <button onClick={registrarse} className="btn btn-primary">Registrarse!</button>
            </form>

            {!errorMsg ? "" :
                <div style={{ width: "100%" }} className="card card-header bg-danger text-white text-center mt-3">
                    {errorMsg}
                </div>
            }
        </div>
    )

}

export default Register;