const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'producer',
  brokers: ['oldbox.cloud:9092']
});

let hola = { mensaje: 'hola', contador: 0 };

const producer = kafka.producer({ allowAutoTopicCreation: true });
const runProducer = async () => {

  // Conectamos el productor (esto puede dardar hasta 1 minuto)
  await producer.connect()

  // Cada segundo, manda produce un mensaje.
  // setInterval(funcion a ejecutar, tiempo del intervalo en milisegundos que se va a ejecutar la primera funcion)
  setInterval(async () => {

    // Suma contador.
    hola.contador++;

    // Produce mensaje con un topico en concreto.
    await producer.send({
      // El topico.
      topic: 'test',

      // Array de mensjaes, por si quieres producir más de uno de golpe.
      messages: [

        // JSON.stringify se usa para convertir objetos a texto con formato JSON.
        { value: JSON.stringify(hola) },
      ],
    })
  }, 1000);
}

// Arrancamos el productor.
runProducer().catch((e) => { console.error(e); runProducer(); });