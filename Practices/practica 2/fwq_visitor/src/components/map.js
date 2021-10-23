/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useHistory } from "react-router-dom";

function Map(props) {
    const history = useHistory();
    const socketRegistry = props.socketRegistry;
    const kafkaWebSocket = props.kafkaWebSocket;

    const [user, setUser] = [props.user, props.setUser];
    const [matrix, setMatrix] = useState([]);

    let atracciones = [];
    let posAnt;
    let inter;

    useEffect(() => {

        posAnt = user;

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

        inter = setInterval(() => {

            if (usuarioEstaEnDestino()) {
                seleccionaAtraccion();
            } else {
                moverseSiguientePosicion();
            }

            kafkaWebSocket.emit("dato_enviado_usr", user);

            if (atracciones) {
                console.log(atracciones);
                atracciones.forEach((attr) => {
                    colorearCasilla(attr.coordX, attr.coordY, "purple");
                    escribirCasilla(attr.coordX, attr.coordY, attr.tiempo);
                    definirImagenCasilla(attr.coordX, attr.coordY, attr.imagen);
                    bordearCasilla(attr.coordX, attr.coordY, "")

                    if (attr.tiempo >= 60)
                        bordearCasilla(attr.coordX, attr.coordY, "4px solid red")
                });
            }

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
            if (attr.tiempo < 60) { return attr }
        });

        console.log(atraccionesFiltradas)

        const numAtracciones = atraccionesFiltradas.length;

        if (numAtracciones == 0) {
            // Si no hay atracciones disponibles, quitate quitecito.
            console.log("ARRAY VACIO", numAtracciones);
            user.x_destino = user.x_actual;
            user.y_destino = user.x_actual;
            return;
        }

        const attrNum = randomIntFromInterval(0, numAtracciones - 1);

        // Provisional
        user.x_destino = atraccionesFiltradas[attrNum].coordX;
        user.y_destino = atraccionesFiltradas[attrNum].coordY;
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
        kafkaWebSocket.on("dato_recibido_usr", (usr) => {
            console.log(usr);

            if (usr.id == user.id) {
                colorearCasilla(posAnt.x_actual, posAnt.y_actual, "blue");
                bordearCasilla(posAnt.x_actual, posAnt.y_actual, "");
                escribirCasilla(posAnt.x_actual, posAnt.y_actual, " ");

                posAnt = usr;

                colorearCasilla(user.x_actual, user.y_actual, "red");
                escribirCasilla(user.x_actual, user.y_actual, " ");
            }

            if (usuarioEstaEnDestino())
                bordearCasilla(usr.x_actual, usr.y_actual, "3px solid red");

        });


        socketRegistry.on("usuarioactual_desautenticado", () => {
            setUser({});
            history.push("/");
        });

        kafkaWebSocket.on("dato_recibido_attr", (attrarr) => {
            atracciones = attrarr;
            atracciones.forEach(attr => {
                if (attr.coordX == user.x_destino && attr.coordY == user.y_destino && attr.tiempo >= 60) {
                    seleccionaAtraccion();
                }
            });
        })
    }

    let unbindSockets = () => {
        socketRegistry.off("usuarioactual_desautenticado");
        kafkaWebSocket.off("dato_recibido_usr");
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