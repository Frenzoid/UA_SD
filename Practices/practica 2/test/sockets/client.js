const { io } = require("socket.io-client");
const socket = io("http://localhost:9111");

// Datos random.
let datos = "hola";

// Madamos un mensaje al servidor.
socket.emit("event_name", datos);

// Emito un mensaje que le dice al servidor que me cierro.
socket.emit('me_cierro');

// Cuando el servidor me confirma mi cierre, me cierro.
socket.on('cerrando', () => {
    socket.close();
});