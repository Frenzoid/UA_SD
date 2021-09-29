const { Server } = require("socket.io");
const io = new Server();

io.on("connection", (socket) => {
    console.log("Hola");
    
    socket.on("event_name", (message) => {
        console.log(message);
    });

    // Haz algo cuando se desconecte.
    socket.on("me_cierro", (connection) => {
        console.log("Cliente:", socket.id, "se cierra");
        socket.emit("cerrando")
        socket.disconnect();
    });
});

io.listen(9111);