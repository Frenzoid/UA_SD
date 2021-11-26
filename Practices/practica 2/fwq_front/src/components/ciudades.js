import { useEffect, useState } from 'react';
import { APIENGINE, REQUESTTIME } from "../configs/parametros";
import * as Axios from "axios"

function Ciudades() {
    const [ciudades, setCiudades] = useState([]);
    const [ciudad, setCiudad] = useState([]);

    useEffect(() => {
        const inter = setInterval(async () => {
            setCiudades((await Axios.get(APIENGINE + '/ciudades')).data);
        }, REQUESTTIME);

        // Parar el bucle cuando se desrenderice el componente ( cuando se cambia a otra página )
        return () => {
            clearInterval(inter);
        }
    }, []);


    return (
       <div className="container">
        {ciudades.length == 0 ?
            <div className="text-center">
                <img src={"https://i.imgur.com/6Hq8096.gif"} className="mx-auto" />
            </div>
            :
            <table className="table table-hover" >
                <thead>
                    <tr>
                        <th scope="col">nombre</th>
                        <th scope="col">temperatura</th>
                        <th scope="col">Ultima Edicion</th>
                        <th scope="col">Fecha Creacion</th>
                    </tr>
                </thead>
                <tbody>

                    {ciudades.map((log, index) => {
                        return (
                            <tr key={index}>
                                <th scope="row">{log.id}</th>
                                <td>{log.nombre}</td>
                                <td>{log.temperatura}</td>
                                <td>{log.updatedAt}</td>
                                <td>{log.createdAt}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            }
            <form>
                <h2 className="text-center">Editar Ciudad</h2>
                <div className="row">
                    <div className="col">
                        <input type="text" className="form-control" placeholder="id"></input>
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Nombre ciudad"></input>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <button className="btn btn-primary">Actualizar</button>
                </div>
            </form>
        </div>
    )
}

export default Ciudades;