let kafka = require('kafka-node');
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    }
});

const topicsToCreate = [{
    topic: 'usuarios',
    partitions: 1,
    replicationFactor: 1
}, {
    topic: 'atracciones',
    partitions: 1,
    replicationFactor: 1
}];


let payloads = [{ topic: 'usuarios', messages: "", partition: 0 }];
let client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKAADDRESS || 'oldbox.cloud:9092', autoConnect: true });

client.createTopics(topicsToCreate, (err, data) => {
    if (err)
        console.error("Error!", err)
    else
        console.log("Topicos creados!", data);
});

// let consumerAttr = new kafka.Consumer(client, [{ topic: 'atracciones', partition: 0 }], { autoCommit: true, });

io.on("connection", (socket) => {
    console.log("Conexión entrante desde", socket.handshake.address);

    let producer = new kafka.Producer(client);
    let consumerUser = new kafka.Consumer(client, [{ topic: 'usuarios', partition: 0 }], { autoCommit: true, });

    if (producer.ready) {
        console.log("Productor listo para", socket.handshake.address);

        socket.on("dato_enviado", (dato) => {
            payloads[0].messages = JSON.stringify(dato);
            producer.send(payloads, (err, data) => {
                if (err)
                    console.error("Error!", err)
            });
        });
    }

    consumerUser.on('message', (message) => {
        console.log("Emitiendo dato de", message.value);
        io.emit("dato_recibido", JSON.parse(message.value));
    });


    producer.on("error", (err) => console.error(err))
    consumerUser.on("error", (err) => console.error(err))
});

// Una funcion que hace esperar ciertos ms.
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


httpServer.listen(9111);
console.log("Servidor escuchando en", process.env.KAFKACONTROLLER || "http://localhost:9111");
