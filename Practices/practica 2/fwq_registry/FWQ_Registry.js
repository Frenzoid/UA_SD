const { server, io } = require("./socket");
const sequelize = require('./config/bd-connector');

const Aforo = require("./models/aforo");

const runDBPreparations = require('./config/db-functions');
const bindSocketFunctions = require("./controller");

const puerto = Number(process.env.FWQRPORT || process.argv[2]);

async function start() {
    if (!puerto)
        throw ("No se ha especificado el puerto.")

    try {
        // Nos logeamos en el servidor de bases de datos.
        await sequelize.authenticate();
        console.log("Sequelize: Successuflly authenticated.");

        // Realizamos las preparaciones previas en la base de datos (crear tablas etc..)
        await runDBPreparations();

        // Pillamos el aforo, si no hay nada significa que el FWQ_Engine aún no ha arrancado.
        let aforo = await Aforo.findOne();
        while (!aforo) {
            console.log("Esperando 5s a que FWQ_ENGINE genere AFORO.");
            await sleep(5000);
            aforo = await Aforo.findOne();
        }
        aforo = aforo.aforo;

        // Por cada conexion...
        io.on("connection", (socket) => {
            console.log("Conexion entrante desde direccion:", socket.handshake.address, "con id de sesion:", socket.id);

            // Asignamos funcionalidades al socket.
            bindSocketFunctions(io, socket, aforo);
        });

        // Arrancamos el servidor.
        server.listen(puerto);
        console.log("Servidor escuchando en el puerto:", puerto)

    } catch (err) { console.error(err) }
}

// Una funcion que hace esperar ciertos ms.
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Arrancamos
start().catch((err) => console.error(err));