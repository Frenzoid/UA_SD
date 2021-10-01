const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'producer',
  brokers: ['oldbox.cloud:9092']
})

let hola = { mensaje: 'hola', contador: 0 };

const producer = kafka.producer({ allowAutoTopicCreation: true });
const runProducer = async () => {

  // Producing
  await producer.connect()

  // Cada segundo, manda produce un mensaje.
  setInterval(async () => {

    // Suma contador.
    hola.contador++;

    // Produce mensaje.
    await producer.send({
      topic: 'test-2',
      messages: [

        // JSON.stringify se usa para convertir objetos a texto con formato JSON.
        { value: JSON.stringify(hola) },
      ],
    })
  }, 1000);
}

runProducer().catch(console.error)