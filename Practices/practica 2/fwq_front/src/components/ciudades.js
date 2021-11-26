import { useEffect, useState } from 'react';
import { APIENGINE, REQUESTTIME } from "../configs/parametros";
import * as Axios from "axios"

function Ciudades() {
    const [ciudades, setCiudades] = useState([]);

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
        <div>Ciudades</div>
    )
}

export default Ciudades;