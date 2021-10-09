import { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

function Map(props) {
    const history = useHistory();
    const socket = props.socket;

    const [user, setUser] = [props.user, props.setUser];
    const [matrix, setMatrix] = useState([]);
    let atracciones;

    useEffect(() => {
        // Si el usuario no esta registrado, no le permitimos acceder a esta página.
        if (!user.id)
            history.push("/");

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

        atracciones = [{ coords: [2, 2] }, { coords: [2, 17] }, { coords: [17, 2] }, { coords: [17, 17] }]
        atracciones.forEach((attr) => {
            matrix[attr.coords[0]][attr.coords[1]].color = "purple";
        });

        setMatrix([...matrix]);


        setInterval(() => {
            console.log(user);

            if (user.x_actual == user.x_destino && user.y_actual == user.y_destino) {
                seleccionaAtraccion();
            }

        }, 1000)


    }, []);

    let siguientePosicion = () => {

        redibujaCasilla(user.x_actual, user.y_actual);
    }

    let randomIntFromInterval = (min, max) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    let seleccionaAtraccion = () => {
        const numAtracciones = atracciones.length;
        const attrNum = randomIntFromInterval(0, numAtracciones - 1);
        user.x_destino = atracciones[attrNum].coords[0] + 1;
        user.y_destino = atracciones[attrNum].coords[1] + 1;
    }

    let redibujaCasilla = (i1, j1, i2, j2) => {
        matrix[i1 - 1][j1 - 1].color = "blue";
        matrix[i2 - 1][j2 - 1].color = "red";

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