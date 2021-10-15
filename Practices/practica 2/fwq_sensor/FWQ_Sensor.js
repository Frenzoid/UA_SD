let kafka = require('kafka-node');

let client = new kafka.KafkaClient({ kafkaHost: 'oldbox.cloud:9092' });

let producer = new kafka.Producer(client);

let payloads = [{ topic: 'numeroPersonas', messages: "", partition: 0 }];

let idAttr = process.env.IDATTR || process.argv[2];

if (!idAttr) throw Exception("Falta la ID de la atraccion");


let randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

producer.on('ready', () => {

  setInterval(() => {
    payloads[0].messages = JSON.stringify({ personas: randomIntFromInterval(0, 100), idAttr });

    producer.send(payloads, (err, data) => {
      console.log(data);
    });

  }, 2000);

});

producer.on('error', (err) => { console.log(err) })