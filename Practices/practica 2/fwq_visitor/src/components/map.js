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
                matrix[i][j] = { color: "blue" }
            }
        }

        atracciones = [{ coords: [3, 3] }, { coords: [3, 18] }, { coords: [18, 3] }, { coords: [18, 18] }]

        setMatrix([...matrix]);

        inter = setInterval(() => {

            if (user.x_actual == user.x_destino && user.y_actual == user.y_destino) {
                redibujaCasilla(user.x_actual, user.y_actual, user.x_actual, user.y_actual);
                seleccionaAtraccion();
            } else siguientePosicion();

            atracciones.forEach((attr) => {
                redibujaAtracciones(attr.coords[0], attr.coords[1])
            });

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

        redibujaCasilla(user.x_actual, user.y_actual, x_siguiente, y_siguiente);

        user.x_actual = x_siguiente;
        user.y_actual = y_siguiente;

        setUser({ ...user });
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

    let redibujaAtracciones = (x, y) => {
        matrix[x - 1][y - 1].color = "purple";
        setMatrix([...matrix]);
    }

    let redibujaCasilla = (x1, y1, x2, y2) => {
        matrix[x1 - 1][y1 - 1].color = "blue";
        matrix[x2 - 1][y2 - 1].color = "red";

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
                                    style={{ minWidth: "4%", minHeight: "30px", textAlign: "center", color: "white", backgroundColor: matrix[ipos][jpos].color }}
                                    className="card m-1"
                                    key={ipos + ", " + jpos}
                                >
                                    {ipos + ", " + jpos}
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