const aforo = process.env.AFORO || process.argv[2];
const wtsAddress = process.env.WTSADDRESS || process.argv[3];

if (!aforo)
    throw ("No se ha especificado el Aforo.");
else if (!wtsAddress)
    throw ("Direccion de Waiting Time no especificado.");

const sequelize = require('./config/bd-connector');
const runDBPreparations = require('./config/db-functions');

const kafka = require('kafka-node');
const io = require("socket.io-client");
const encrypt = require("socket.io-encrypt");

const User = require("./models/user");
const Atraccion = require("./models/atraccion");

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

let client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKAADDRESS || 'oldbox.cloud:9092', autoConnect: true });

client.createTopics(topicsToCreate, (err, data) => {
    if (err) console.error("Error!", err)
    else console.log("Topicos creados!", data);
});

let payloadsVisitante = [{ topic: 'visitante-env', messages: "", partition: 0 }];
let payloadsAtraccion = [{ topic: 'atraccion', messages: "", partition: 0 }];

let visitanteEnvProd = new kafka.Producer(client);
let atraccionesEnvProd = new kafka.Producer(client);
let visitanteRepCons = new kafka.Consumer(client, [{ topic: 'visitante-rep', partition: 0 }], { autoCommit: true, });

async function start() {
    try {
        // Nos logeamos en el servidor de bases de datos.
        await sequelize.authenticate();
        console.log("Sequelize: Successuflly authenticated.");

        // Realizamos las preparaciones previas en la base de datos (crear tablas etc..)
        await runDBPreparations();

        const socketClient = io(process.env.WTSADDRESS || process.argv[3], { timeout: 1000, reconnect: true });
        encrypt('ABRACADABRA')(socketClient);

        socketClient.on("connect", () => {
            console.log("Engine conectado con WTS");

            let inter1 = setInterval(() => {
                if (visitanteEnvProd.ready) {
                    clearInterval(inter1);
                    console.log(visitanteEnvProd.ready);

                    visitanteRepCons.on('message', async (message) => {
                        // {"id":1,"name":"a","password":"","x_actual":3,"y_actual":11,"x_destino":3,"y_destino":3,"logged":true}
                        console.log("Dato recibido de Usuario", message.value);

                        let userObject = JSON.parse(message.value);

                        let user = await User.findByPk(userObject.id);
                        user.x_actual = userObject.x_actual;
                        user.y_actual = userObject.y_actual;

                        await user.save();

                        payloadsVisitante[0].messages = JSON.stringify(user);
                        visitanteEnvProd.send(payloadsVisitante, (err, data) => {
                            if (err)
                                console.error("Error!", err)
                            else
                                console.log(data);
                        });
                    });


                    visitanteEnvProd.on("error", (err) => console.error(err));
                    visitanteRepCons.on("error", (err) => console.error(err));

                }
            });

            let inter2 = setInterval(() => {
                if (atraccionesEnvProd.ready) {
                    clearInterval(inter2);
                    console.log(atraccionesEnvProd.ready);

                    setInterval(() => {
                        socketClient.emit("solicitar_atracciones");
                        console.log("solcitando atracciones");
                    }, 2000)

                    socketClient.on("atracciones_enviadas", (atracciones) => {
                        console.log("atracciones recibidas", atracciones)
                        atracciones.forEach(async (atraccion) => {
                            if (atraccion && atraccion.id) {
                                let attr;
                                attr = await Atraccion.findByPk(atraccion.id);
                                if (attr) {
                                    attr.time = atraccion.tiempo;
                                    attr.coord_x = atraccion.coordX;
                                    attr.coord_y = atraccion.coordY;
                                    attr.picture = atraccion.imagen;
                                    attr.save();
                                } else {
                                    attr = await Atraccion.create({
                                        time: atraccion.tiempo,
                                        id: atraccion.id,
                                        picture: atraccion.imagen,
                                        coord_x: atraccion.coordX,
                                        coord_y: atraccion.coordY,
                                    });
                                }
                                console.log(JSON.stringify(attr));
                            }
                        });

                        payloadsAtraccion[0].messages = JSON.stringify(atracciones);
                        atraccionesEnvProd.send(payloadsAtraccion, (err, data) => {
                            if (err)
                                console.error("Error!", err)
                            else
                                console.log(data);
                        });
                    })
                }

            }, 2000)

        });

        socketClient.on("error", (err) => console.log(wtsAddress, err));

    } catch (err) { console.error(err) }
}


start();