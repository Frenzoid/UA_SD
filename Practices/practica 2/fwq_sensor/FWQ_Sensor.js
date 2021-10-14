let kafka = require('kafka-node');

let client = new kafka.KafkaClient({ kafkaHost: 'oldbox.cloud:9092' });

let producer = new kafka.Producer(client);

let payloads = [{ topic: 'numeroPersonas', messages: JSON.stringify({ /*Habría que poner */}), partition: 0 }];

const kafkaWebSocket = props.kafkaWebSocket;
const [atraccion, setAtraccion] = [props.atraccion, props.setAtraccion];

let randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

producer.on('ready', () => {

  setInterval(() => {
    kafkaWebSocket.emit("atracción", atraccion);
    payloads[0].messages = JSON.stringify({ randomIntFromInterval( a = 0,  b = 100); });
    producer.send(payloads, (err, data) => {
      console.log(data);
    });
  }, 2000);

});

producer.on('error', (err) => { console.log(err) })