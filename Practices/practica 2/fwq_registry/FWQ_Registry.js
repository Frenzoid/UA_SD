const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    }
});

const puerto = Number(process.argv[2]);
const sequelize = require('./config/bd-connector');
const { createTablesFromModels } = require('./config/db-functions');
const Aforo = require("./models/aforo");
const User = require("./models/user");

let usuarios = [];

async function start() {
    try {
        await sequelize.authenticate();
        console.log(`Sequelize: Successuflly authenticated.`);

        await createTablesFromModels();
        let aforo = await Aforo.findOne();
        while (!aforo) {
            console.log("Esperando 5s a que FWQ_ENGINE genere AFORO.");
            await sleep(5000);
            aforo = await Aforo.findOne();
        }
        aforo = aforo.aforo;

        io.on("connection", (socket) => {

            console.log("Se ha recibido una conexion con id:", socket.id);

            socket.on("registrar_usuario", async (datos) => {
                if (!datos.name || !datos.password) {
                    socket.emit("campos_faltates", "Faltan datos!");
                    return;
                }

                try {
                    const aforoActual = await User.count();
                    console.log(aforoActual);

                    if (aforoActual >= aforo) {
                        socket.emit("aforo_maximo", "Se ha alcanzado el aforo máximo!");
                        return;
                    }

                    const usuario = await User.create(
                        {
                            name: datos.name,
                            password: datos.password,
                            x_actual: 10,
                            y_actual: 10
                        });

                    usuarios[socket.id] = usuario.id;

                    // Mandamos al cliente el usuario registrado.
                    socket.emit("usuario_registrado", usuario)

                    console.log("Usuario con datos:", datos, "registrado.");
                } catch (err) { console.error(err) }
            });

            socket.on("actualizar_usuario", async (datos) => {
                if (!datos.name || !datos.password) {
                    socket.emit("campos_faltates", "Faltan datos!");
                    return;
                }

                try {
                    let usuario = await User.findByPk(usuarios[socket.id]);
                    usuario.name = datos.name;
                    usuario.password = datos.password;
                    await usuario.save();

                    socket.emit("usuario_actualizado", { usuario });
                } catch (err) { console.log(err) }
            });

            socket.on("disconnect", async () => {
                console.log("Desconectando", socket.id)
                if (usuarios[socket.id] != undefined) {
                    await User.destroy({ where: { id: usuarios[socket.id] } })
                    delete usuarios[socket.id];
                }
            });

        });

        httpServer.listen(puerto);
        console.log("Servidor escuchando en el puerto:", puerto)

    } catch (err) { console.error(err) }
}


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

start();