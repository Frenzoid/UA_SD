const { Server } = require("socket.io");
const io = new Server();
const puerto = Number(process.argv[2]);
const sequelize = require('./bd-connector');
const { createTablesFromModels } = require('./db-functions');

let usuarios = [];

async function start() {
    try {
        await sequelize.authenticate();
        console.log(`Sequelize: Successuflly authenticated.`);

        await createTablesFromModels();

        io.on("connection", (socket) => {

            console.log("Se ha recibido una conexion con id:", socket.id);

            socket.on("registrar_usuario", (datos) => {
                // TODO insertar usuario en la base de datos.
                // usuarios[socket.id] = // id usuario base de datos;
            })

            socket.on("disconnect", () => {
                // if (usuarios[socket.id] != undefined)
                // TODO borrar usuario de la base de datos
                // delete usuarios[socket.id];
            })

        });

        io.listen(puerto);
        console.log("Servidor escuchando en el puerto:", puerto)

    } catch (err) {
        console.error(err);
    }
}

start();