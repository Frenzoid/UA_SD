import { useEffect, useState } from 'react';
import { APIENGINE, REQUESTTIME } from "../configs/parametros";
import * as Axios from "axios"

function Ciudades() {
    const [ciudades, setCiudades] = useState(null);
    const [ciudad, setCiudad] = useState({ id: 0, nombre: '' });
    const [error, setError] = useState(false);

    useEffect(() => {
        const inter = setInterval(async () => {
            setCiudades((await Axios.get(APIENGINE + '/ciudades')).data);
        }, REQUESTTIME);

        // Parar el bucle cuando se desrenderice el componente ( cuando se cambia a otra página )
        return () => {
            clearInterval(inter);
        }
    }, []);

    let cambiarCiudad = async () => {
        Axios.post(APIENGINE + '/ciudades' + ciudad.id,
            {
                nombre: ciudad.nombre,
            }
        ).then(function (response) {
            if (response.data.error)
                setError(response.data.error);
            else
                setError(false);
        }).catch(function (err) {
            setError(err);
        });
    }

    return (
        <div className="container">
            {ciudades == null ?
                <div className="text-center">
                    <img src={"https://i.imgur.com/6Hq8096.gif"} className="mx-auto" />
                </div>
                :
                <table className="table table-hover" >
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Temperatura</th>
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
                                    <td>{log.temperatura} Cº</td>
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
                        <input type="text" onChange={(e) => { setCiudad({ ...ciudad, id: e.target.value }) }} className="form-control" placeholder="id"></input>
                    </div>
                    <div className="col">
                        <input type="text" onChange={(e) => { setCiudad({ ...ciudad, nombre: e.target.value }) }} className="form-control" placeholder="Nombre ciudad"></input>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <button onClick={(e) => { e.preventDefault(); cambiarCiudad(); }} className="btn btn-primary">Actualizar</button>
                </div>
            </form>
            {error ?
                <div style={{ width: "100%" }} className="card card-header bg-danger text-white text-center mt-3">
                    {error}
                </div>
                :
                ""}
        </div>
    )
}

export default Ciudades;