import { useEffect, useState } from 'react';
import { APIENGINE, REQUESTTIME } from "../configs/parametros";
import * as Axios from "axios"

function Logs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const inter = setInterval(async () => {
            setLogs((await Axios.get(APIENGINE + '/logs')).data);
        }, REQUESTTIME);

        // Parar el bucle cuando se desrenderice el componente ( cuando se cambia a otra página )
        return () => {
            clearInterval(inter);
        }
    }, []);


    return (
        logs.length == 0 ?
            <div className="text-center">
                <img src={"https://i.imgur.com/6Hq8096.gif"} className="mx-auto" />
            </div>
            :
            <table className="table table-hover container" >
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Acción</th>
                        <th scope="col">Datos</th>
                        <th scope="col">Fecha</th>
                    </tr>
                </thead>
                <tbody>

                    {logs.map((log, index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{log.id}</th>
                                <td>{log.address}</td>
                                <td>{log.action}</td>
                                <td>{log.data}</td>
                                <td>{log.createdAt}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

    )
}

export default Logs;