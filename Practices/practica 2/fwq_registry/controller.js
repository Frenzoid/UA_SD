const User = require("./models/user");

// Nuestro mapeo de socket => usuarios conectados.
let usuarios = [];
let aforoActual = 0;

function bindSocketFunctions(io, socket, aforo) {

    // Registrar usuario.
    socket.on("registrar_usuario", async (received) => {

        if (aforoActual + 1 >= aforo) {
            socket.emit("error_registry", "Se ha alcanzado el aforo máximo!");
            return;
        } else aforoActual++;

        if (!received.name || !received.password) {
            socket.emit("error_registry", "Faltan datos!");
            return;
        }

        try {

            const user = await User.create(
                {
                    name: received.name,
                    password: received.password,
                    x_actual: 14,
                    y_actual: 14,
                    x_destino: 14,
                    y_destino: 14,
                });

            usuarios[socket.id] = user.id;

            // Mandamos al cliente el usuario registrado.
            socket.emit("usuario_registrado", user)
            console.log("Usuario", user.id, ":", user.name, "registrado. | Aforo:", aforoActual, "/", aforo);

            if (aforoActual == aforo)
                console.log("Aforo máximo alcanzado.");

        } catch (err) {
            console.error(err);
            socket.emit("error_registry", "Se ha producido un error interno en FWQ_Registry.");
        }
    });


    // Actualizamos usuario.
    socket.on("editar_usuario", async (received) => {
        if (!received.name || !received.password) {
            socket.emit("error_registry", "Faltan datos!");
            return;
        }

        try {
            let user = await User.findByPk(usuarios[socket.id]);
            user.name = received.name;
            user.password = received.password;
            await user.save();

            // Mandamos al cliente el usuario actualizado.
            socket.emit("usuario_editado", user);
            console.log("Usuario", user.id, ":", received.name, "actualizado.");
        } catch (err) {
            console.log(err);
            socket.emit("error_registry", "Se ha producido un error interno en FWQ_Registry.");
        }
    });


    // Usuario sale manualmente.
    socket.on("desregistrar_usuario", async () => {
        if (usuarios[socket.id] != undefined) {
            await User.destroy({ where: { id: usuarios[socket.id] } });

            // Emitimos a TODOS que X usuario se ha desconectado, para borrarlo del mapa.
            io.emit("usuario_desconectado", usuarios[socket.id]);
            delete usuarios[socket.id];
            aforoActual--;
        }

        console.log("Desregistrado", socket.id)

        // Emitimos un evento de vuelta, para que la aplicacion frontend proceda a mandarlo al home.
        socket.emit("usuario_desregistrado", "Usuario desregistrado!");
    });


    // Usuario pierde la conexion.
    socket.on("disconnect", async () => {
        if (usuarios[socket.id] != undefined) {
            await User.destroy({ where: { id: usuarios[socket.id] } });

            // Emitimos a TODOS que X usuario se ha desconectado, para borrarlo del mapa.
            io.emit("usuario_desconectado", usuarios[socket.id]);
            delete usuarios[socket.id];
            aforoActual--;
        }

        console.log("Desconectando", socket.id)
    });
}

module.exports = bindSocketFunctions;