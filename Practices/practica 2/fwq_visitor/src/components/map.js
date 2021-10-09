import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

function Map(props) {
    const history = useHistory();
    const socket = props.socket;

    const [user, setUser] = [props.user, props.setUser];
    const [matrix, setMatrix] = useState([]);

    let atracciones;
    let inter;

    useEffect(() => {
        // Si el usuario no esta registrado, no le permitimos acceder a esta página.
        if (!user.id) {
            history.push("/");
        }

        bindSokets();

        const n = 20;
        for (let i = 0; i < n; i++) {
            // Columnas (array vacio).
            matrix[i] = [];
            for (let j = 0; j < n; j++) {
                // Filas ( populadas )
                matrix[i][j] = { color: "blue", value: " ", border: "none" }
            }
        }

        atracciones = [{ coords: [3, 3], time: 10 }, { coords: [3, 18], time: 40 }, { coords: [18, 3], time: 30 }, { coords: [18, 18], time: 70 }]

        setMatrix([...matrix]);

        inter = setInterval(() => {

            if (user.x_actual == user.x_destino && user.y_actual == user.y_destino) {
                redibujaCasilla(user.x_actual, user.y_actual, user.x_actual, user.y_actual);
                seleccionaAtraccion();
            } else {
                let posSiguiente = siguientePosicion();

                redibujaCasilla(user.x_actual, user.y_actual, posSiguiente[0], posSiguiente[1]);

                user.x_actual = posSiguiente[0];
                user.y_actual = posSiguiente[1];

                setUser({ ...user });
            }

            atracciones.forEach((attr) => {
                redibujaAtracciones(attr)
            });

            // Socket emit datos usuario.

        }, 500);

        return () => { clearInterval(inter) }

    }, []);

    let siguientePosicion = () => {
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

        return [x_siguiente, y_siguiente];
    }

    let randomIntFromInterval = (min, max) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    let seleccionaAtraccion = () => {
        const numAtracciones = atracciones.length;
        const attrNum = randomIntFromInterval(0, numAtracciones - 1);

        user.x_destino = atracciones[attrNum].coords[0];
        user.y_destino = atracciones[attrNum].coords[1];

        setUser({ ...user });
    }

    let redibujaAtracciones = (attr) => {
        matrix[attr.coords[0] - 1][attr.coords[1] - 1].color = "purple";
        matrix[attr.coords[0] - 1][attr.coords[1] - 1].value = attr.time;
        if (attr.coords[0] == user.x_actual && attr.coords[1] == user.y_actual) {
            matrix[attr.coords[0] - 1][attr.coords[1] - 1].border = "3px solid red";
        } else {
            matrix[attr.coords[0] - 1][attr.coords[1] - 1].border = "none";
        }

        setMatrix([...matrix]);
    }

    let redibujaCasilla = (x1, y1, x2, y2) => {
        matrix[x1 - 1][y1 - 1].color = "blue";
        matrix[x1 - 1][y1 - 1].value = " ";

        if (user.x_actual == x1 && user.y_actual == y1)
            matrix[x2 - 1][y2 - 1].color = "red";
        else
            matrix[x2 - 1][y2 - 1].color = "grey";

        matrix[x2 - 1][y2 - 1].value = user.id;

        setMatrix([...matrix]);
    }

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

            {matrix.map((i, ipos) => {

                return (
                    <div key={ipos} className="d-flex flex-row no-wrap justify-content-center">

                        {i.map((j, jpos) => {

                            return (
                                <div
                                    style={{
                                        minWidth: "4%",
                                        minHeight: "30px",
                                        textAlign: "center",
                                        color: "white",
                                        backgroundColor: matrix[ipos][jpos].color,
                                        border: matrix[ipos][jpos].border
                                    }}
                                    className="card m-1"
                                    key={ipos + ", " + jpos}
                                >
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