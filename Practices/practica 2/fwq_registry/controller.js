const User = require("./models/user");

// Nuestro mapeo de socket => usuarios conectados.
let usuarios = [];
let aforoActual = 0;

function bindSocketFunctions(io, socket, aforo) {

    socket.on("autenticar_usuario", async (received) => {
        if (aforoActual + 1 >= aforo) {
            socket.emit("error_registry", "Se ha alcanzado el aforo máximo!");
            return;
        } else aforoActual++;

        if (!received.name || !received.password) {
            socket.emit("error_registry", "Faltan datos!");
            aforoActual--;
            return;
        }
        try {

            let usr = await User.findOne({ where: { name: received.name } })

            if (!usr) {
                socket.emit("error_registry", "El usuario no existe!");
                aforoActual--;
                return;
            }

            if (!User.checkPassword(received.password, usr.password)) {
                socket.emit("error_registry", "Credenciales Incorrectas.");
                aforoActual--;
                return;
            }

            usr.logged = true;
            await usr.save();
            usuarios[socket.id] = usr.id;

            socket.emit("usuario_autenticado", usr);

            console.log("Usuario", usr.name, "autenticado | Aforo:", aforoActual, "/", aforo);

            if (aforoActual == aforo)
                console.log("Aforo máximo alcanzado.");

        } catch (err) {
            console.error(err);
            aforoActual--;
            socket.emit("error_registry", "Se ha producido un error interno en FWQ_Registry.");
        }
    })

    // Registrar usuario.
    socket.on("registrar_usuario", async (received) => {

        if (!received.name || !received.password) {
            socket.emit("error_registry", "Faltan datos!");
            return;
        }

        try {
            let usrPrev = await User.findAndCountAll({ where: { name: received.name } });

            if (usrPrev.count) {
                socket.emit("error_registry", "Ya existe un usuario con ese nombre.");
                return;
            }

            const user = await User.create(
                {
                    name: received.name,
                    password: received.password,
                    x_actual: 14,
                    y_actual: 14,
                    x_destino: 14,
                    y_destino: 14,
                    logged: false,
                });

            // Mandamos al cliente el usuario registrado.
            socket.emit("usuario_registrado", user)
            console.log("Usuario", user.id, ":", user.name, "registrado.");

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
            let usrPrev = await User.findOne({ where: { name: received.name } });

            if (usrPrev && usrPrev.id != usuarios[socket.id]) {
                socket.emit("error_registry", "Ya existe un usuario con ese nombre.");
                return;
            }

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
    socket.on("desautenticar_usuario", async (received) => {
        if (usuarios[socket.id] != undefined) {

            let usr = await User.findByPk(usuarios[socket.id]);
            usr.logged = false;
            usr.save();

            // Emitimos a usuario actual la desconexion.
            socket.emit("usuarioactual_desautenticado", usr.id)

            // Emitimos a todos menos a si mismo que el usuario se ha desconectado, para borrarlo del mapa.
            socket.broadcast.emit("usuario_desconectado", usr.id);
            aforoActual--;

            console.log("Desautenticado:", usr.name, " | Aforo:", aforoActual, "/", aforo);
        }
        else
            console.error("error_registry", "Usuario a desautenticar no tiene una sesion definida.");
    });

    // Usuario pierdla conexion.
    socket.on("disconnect", async () => {
        if (usuarios[socket.id] != undefined) {

            let usr = await User.findByPk(usuarios[socket.id]);
            usr.logged = false;
            usr.save();

            // Emitimos a TODOS que X usuario se ha desconectado, para borrarlo del mapa.
            io.emit("usuario_desconectado", usr.name);
            aforoActual--;
        }

        console.log("Desconectado:", socket.id)
    });
}

module.exports = bindSocketFunctions;