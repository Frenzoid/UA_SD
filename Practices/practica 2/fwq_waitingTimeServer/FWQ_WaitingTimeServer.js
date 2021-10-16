let kafka = require('kafka-node');

let puertoKafka = 'oldbox.cloud:9092'; 
let puerto = process.env.PUERTOWTS || process.argv[2];

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    }
});

let client = new kafka.KafkaClient({ kafkaHost: puertoKafka, autoConnect: true });

let consumer = new kafka.Consumer(
    client,
    [
        { topic: 'numeroPersonas', partition: 0 },
    ],
    {
        autoCommit: true,
    }
);


// Si el waitingTimeServer recibe la información
consumer.on('message', (message) => {
    let atraccion = JSON.parse(message.value);
    atraccion.tiempo = 5 * atraccion.personas;
    console.log(atraccion);
    //io.emit("atraccion", atraccion);
});

io.on('disconnect', () => {
    console.log("Se ha desconectado el Engine");
});

io.on('connection',() => {
    console.log("Se ha establecido la conexión");
})

httpServer.listen(puerto);

consumer.on('error', (err) => { console.log(err) })