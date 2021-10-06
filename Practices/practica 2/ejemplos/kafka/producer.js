let kafka = require('kafka-node');

let client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

let producer = new kafka.Producer(client);

let payloads = [
  { topic: 'test', messages: JSON.stringify({ hola: "mundo"}), partition: 0 },
];


producer.on('ready', () => {

  setInterval(() => {
    producer.send(payloads, (err, data) => {
      console.log(data);
    });
  }, 2000);

});

producer.on('error', (err) => { console.log(err) })