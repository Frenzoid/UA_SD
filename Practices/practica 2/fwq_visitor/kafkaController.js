const kafka = require('kafka-node');
const httpServer = require("http").createServer();
const encrypt = require('socket.io-encrypt')
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    }
});

const topicsToCreate = [{
    topic: 'visitante-rep',
    partitions: 1,
    replicationFactor: 1
}, {
    topic: 'visitante-env',
    partitions: 1,
    replicationFactor: 1
}, {
    topic: 'attrpersonas',
    partitions: 1,
    replicationFactor: 1
}, {
    topic: 'atraccion',
    partitions: 1,
    replicationFactor: 1
}];


let payloads = [{ topic: 'visitante-rep', messages: "", partition: 0 }];

io.use(encrypt('ABRACADABRA'));
io.on("connection", (socket) => {
    console.log("Conexión entrante desde", socket.handshake.address);
    let client1 = new kafka.KafkaClient({ kafkaHost: process.env.KAFKAADDRESS || 'oldbox.cloud:9092', autoConnect: true });
    let client2 = new kafka.KafkaClient({ kafkaHost: process.env.KAFKAADDRESS || 'oldbox.cloud:9092', autoConnect: true });

    client1.createTopics(topicsToCreate, (err, data) => {
        if (err)
            console.error("Error!", err)
        else {
            console.log("Topicos creados!", data, "Creando clientes");

            let visitanteRepProd = new kafka.Producer(client1);
            let visitanteCliEnv = new kafka.Consumer(client1, [{ topic: 'visitante-env', partition: 0 }], { autoCommit: true, });
            let atraccionCli = new kafka.Consumer(client2, [{ topic: 'atraccion', partition: 0 }], { autoCommit: true, });

            let inter = setInterval(() => {
                if (visitanteRepProd.ready) {
                    console.log("Productor listo para", socket.handshake.address);

                    socket.on("dato_enviado_usr", (dato) => {
                        payloads[0].messages = JSON.stringify(dato);
                        visitanteRepProd.send(payloads, (err, data) => {
                            if (err)
                                console.error("Error!", err)
                            else
                                console.log(data);
                        });
                    });

                    clearInterval(inter);
                }
            }, 2000);

            atraccionCli.on('message', (message) => {
                console.log("Dato recibido de Atracciones", message.value);
                socket.emit("dato_recibido_attr", JSON.parse(message.value));
            });

            visitanteCliEnv.on('message', (message) => {
                console.log("Dato recibido de Usuario", message.value);
                socket.emit("dato_recibido_usr", JSON.parse(message.value));
            });

            visitanteRepProd.on("error", (err) => console.error(err));
            visitanteCliEnv.on("error", (err) => console.error(err));
            atraccionCli.on("error", (err) => console.error(err));

            socket.on("disconnect", () => {
                client1.close();
                client2.close();
            })

        }
    });
});

httpServer.listen(9111);
console.log("Servidor escuchando en", process.env.KAFKACONTROLLER || "http://localhost:9111");
