/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

function Map(props) {
    const history = useHistory();
    const socketRegistry = props.socketRegistry;
    const kafkaWebSocket = props.kafkaWebSocket;

    const [user, setUser] = [props.user, props.setUser];
    const [matrix, setMatrix] = useState([]);

    let atracciones = [];
    let usuarios = [];
    let inter;

    useEffect(() => {
        // Si el usuario no esta registrado, no le permitimos acceder a esta página.
        if (!user.logged)
            history.push("/");


        bindSokets();

        const n = 20;
        for (let i = 0; i < n; i++) {
            // Columnas (array vacio).
            matrix[i] = [];
            for (let j = 0; j < n; j++) {
                // Filas ( populadas )
                matrix[i][j] = { color: "blue", value: " " }
            }
        }

        renderizarMapa();

        // Provisional
        atracciones = [
            { picture: "https://i.imgur.com/Ff7SEP6.png", coords: [3, 3], time: 10 },
            { picture: "https://cdn-icons-png.flaticon.com/128/1761/1761560.png", coords: [1, 18], time: 40 },
            { picture: "https://cdn-icons-png.flaticon.com/128/2060/2060024.png", coords: [14, 3], time: 30 },
            { picture: "https://i.imgur.com/WPSPxoT.png", coords: [18, 18], time: 70 }
        ]


        inter = setInterval(() => {

            // TODO SOLO Renderizar mapa y emitir datos del usuario. Pintar casos especiales.

            if (usuarioEstaEnDestino()) {
                seleccionaAtraccion();
            } else {
                moverseSiguientePosicion();
            }

            kafkaWebSocket.emit("dato_enviado", user);

            atracciones.forEach((attr) => {
                colorearCasilla(attr.coords[0], attr.coords[1], "purple");
                escribirCasilla(attr.coords[0], attr.coords[1], attr.time);
                definirImagenCasilla(attr.coords[0], attr.coords[1], attr.picture);
            });

            actualizarUsuario();
            renderizarMapa();

        }, 750);

        // Parar el bucle cuando se desrenderice el componente ( cuando se cambia a otra página )
        return () => {
            unbindSockets();
            clearInterval(inter);
        }

    }, []);


    // Auxiliares.

    let randomIntFromInterval = (min, max) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    // Métodos de gestion del usuario actual.

    let actualizarUsuario = () => {
        setUser({ ...user });
    }

    let usuarioEstaEnDestino = () => {
        return user.x_actual == user.x_destino && user.y_actual == user.y_destino;
    }

    let moverseSiguientePosicion = () => {
        let x_siguiente, y_siguiente;

        if (user.x_actual > user.x_destino)
            x_siguiente = user.x_actual - 1;
        else if (user.x_actual < user.x_destino)
            x_siguiente = user.x_actual + 1;
        else x_siguiente = user.x_actual;

        if (user.y_actual > user.y_destino)
            y_siguiente = user.y_actual - 1;
        else if (user.y_actual < user.y_destino)
            y_siguiente = user.y_actual + 1;
        else y_siguiente = user.y_actual;

        user.x_actual = x_siguiente;
        user.y_actual = y_siguiente;
    }

    let seleccionaAtraccion = () => {
        let atraccionesFiltradas = atracciones.filter((attr) => {
            if (attr.time < 60) { return attr }
        });

        console.log(atraccionesFiltradas)

        const numAtracciones = atraccionesFiltradas.length;
        const attrNum = randomIntFromInterval(0, numAtracciones - 1);

        // Provisional
        user.x_destino = atraccionesFiltradas[attrNum].coords[0];
        user.y_destino = atraccionesFiltradas[attrNum].coords[1];
    }


    // Métodos del renderizado del mapa

    let renderizarMapa = () => {
        setMatrix([...matrix]);
    }

    let definirImagenCasilla = (x, y, src) => {
        matrix[x][y].picture = src;
    }

    let escribirCasilla = (x, y, value) => {
        matrix[x][y].value = value;
    }

    let bordearCasilla = (x, y, border) => {
        matrix[x][y].border = border;
    }

    let colorearCasilla = (x, y, color) => {
        matrix[x][y].color = color;
    }


    // Métodos de la conexión de sockets.

    let bindSokets = () => {
        kafkaWebSocket.on("dato_recibido", (usr) => {
            console.log(usr);
            if (usuarios[usr.id]) {
                bordearCasilla(usuarios[usr.id].x_actual, usuarios[usr.id].y_actual, "");
                colorearCasilla(usuarios[usr.id].x_actual, usuarios[usr.id].y_actual, "blue");
                escribirCasilla(usuarios[usr.id].x_actual, usuarios[usr.id].y_actual, " ");
            }

            if (user.id == usr.id)
                colorearCasilla(usr.x_actual, usr.y_actual, "red");
            else
                colorearCasilla(usr.x_actual, usr.y_actual, "grey");

            if (usuarioEstaEnDestino())
                bordearCasilla(usr.x_actual, usr.y_actual, "3px solid red");


            escribirCasilla(usr.x_actual, usr.y_actual, usr.id);

            usuarios[usr.id] = usr;
        });

        socketRegistry.on("usuario_desconectado", (usrid) => {
            bordearCasilla(usuarios[usrid].x_actual, usuarios[usrid].y_actual, "");
            colorearCasilla(usuarios[usrid].x_actual, usuarios[usrid].y_actual, "blue");
            escribirCasilla(usuarios[usrid].x_actual, usuarios[usrid].y_actual, " ");
            delete usuarios[usrid];
        });

        socketRegistry.on("usuarioactual_desautenticado", () => {
            setUser({});
            history.push("/");
        })
    }

    let unbindSockets = () => {
        kafkaWebSocket.off("dato_recibido");
        socketRegistry.off("usuario_desconectado");
        socketRegistry.off("usuario_desregistrado");
    }

    let desautenticar = (e = null) => {
        if (e)
            e.preventDefault();

        socketRegistry.emit("desautenticar_usuario", user);
    }


    return (
        <div className="container">
            <div className="text-center my-3">
                <button onClick={desautenticar} className="btn btn-danger m-2"> Salir del parque.</button>
                <button onClick={(e) => { e.preventDefault(); history.push("/edit") }} className="btn btn-primary m-2"> Editar usuario.</button>
            </div>

            <code>
                {JSON.stringify(user)}
            </code>

            {matrix.map((i, ipos) => {

                return (
                    <div key={ipos} className="d-flex flex-row no-wrap justify-content-center">

                        {i.map((j, jpos) => {

                            return (
                                <div
                                    style={{
                                        minWidth: "60px",
                                        minHeight: "60px",
                                        textAlign: "center",
                                        color: "white",
                                        backgroundColor: matrix[ipos][jpos].color,
                                        border: matrix[ipos][jpos].border,
                                    }}
                                    className="card m-1"
                                    key={ipos + ", " + jpos}
                                >
                                    {matrix[ipos][jpos].picture ?
                                        <img src={matrix[ipos][jpos].picture} alt="salida" className="mx-auto" style={{ maxHeight: "60%", maxWidth: "60%" }} /> :
                                        ""
                                    }
                                    {matrix[ipos][jpos].value}
                                </div>
                            )
                        })}

                    </div>
                )

            })}
        </div>
    )

}

export default Map;