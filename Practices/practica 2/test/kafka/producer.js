const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
  clientId: 'prod-1',
  brokers: ['localhost:9092']
})
 

let hola = {mensaje: 'hola', contador: 0};

const producer = kafka.producer();
const runProducer = async () => {
  // Producing
  await producer.connect()
  setInterval(async() => {
    hola.contador++;
    await producer.send({
        topic: 'test',
        messages: [
          { value: JSON.stringify(hola) },
        ],
      })
  }, 1000);
}
 
runProducer().catch(console.error)