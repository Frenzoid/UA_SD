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

let client = new kafka.KafkaClient({ kafkaHost: 'oldbox.cloud:9092', autoConnect: true });

client.createTopics(topicsToCreate, (err, data) => {
    if (err)
        console.error("Error!", err)
    console.log("Topicos creados!");
});

let producer = new kafka.Producer(client);
let consumerUser = new kafka.Consumer(client, [{ topic: 'usuarios', partition: 0 }], { autoCommit: true, });
// let consumerAttr = new kafka.Consumer(client, [{ topic: 'atracciones', partition: 0 }], { autoCommit: true, });

producer.on('ready', () => {
    console.log("kafka producer ready!");

    io.on("connection", (socket) => {
        console.log("Nueva conexión entrante con id", socket.id);

        socket.on("dato_enviado", (dato) => {

            payloads[0].messages = JSON.stringify(dato);
            producer.send(payloads, (err, data) => {
                if (err)
                    console.error("Error!", err)
            });
        });
    });

});

let i = 0;
consumerUser.on('message', (message) => {
    console.log(i++);
    io.emit("dato_recibido", JSON.parse(message.value));
});

httpServer.listen(9111);