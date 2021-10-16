let kafka = require('kafka-node');

let client = new kafka.KafkaClient({ kafkaHost: 'oldbox.cloud:9092' });

let producer = new kafka.Producer(client);

let payloads = [{ topic: 'numeroPersonas', messages: "", partition: 0 }];

let idAttr = process.env.IDATTR || process.argv[2];
let coorX = process.env.X || process.argv[3];
let coorY = process.env.Y || process.argv[4];
let imagen = process.env.IMAGEN || process.argv[5];

if (!idAttr) throw ("Falta la ID de la atraccion");

console.log(coorX, coorY);
if (!coorX) {
  throw("La coordenada X está vacia");
} else {
  if (coorX > 20) {
    throw("La coordenada X está fuera del mapa");
  }
}

if (!coorY) {
  throw("La coordenada Y está vacia");
} else {
  if (coorY > 20) {
    throw("La coordenada Y está fuera del mapa");
  }
}

let randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

producer.on('ready', () => {

  setInterval(() => {
    // Cada persona tiene un tiempo de 5 segs
    payloads[0].messages = JSON.stringify({ personas: randomIntFromInterval(0, 17), idAttr , coorX , coorY , imagen });

    producer.send(payloads, (err, data) => {
      console.log(data);
    });

  }, 2000);

});

producer.on('error', (err) => { console.log(err) })