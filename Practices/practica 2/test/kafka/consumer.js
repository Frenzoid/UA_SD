const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    // Si se tiene más de una instancia del consumidor, no importa que tengan la misma ID.
    clientId: 'consumer',
    brokers: ["oldbox.cloud:9092"],
})

// Si se quiere tener mas de un consumidor para las mismas particiones, cada consumidor
//   deberá tener un groupID unico, en caso contrario, se repartiran los mensajes a
//   consumir.
const consumer = kafka.consumer({ groupId: 'g1', allowAutoTopicCreation: true, fromBeginning: false });

const runConsumer = async () => {

    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'test-2' })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            // JSON.parse se usa para convertir texto en formato JSON a objetos.
            console.log(JSON.parse(message.value))
        },
    })
}

runConsumer().catch(console.error)
