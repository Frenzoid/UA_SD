const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
  clientId: 'cons-2',
  brokers: ["localhost:9092"],
})
 
const consumer = kafka.consumer({ groupId: 'test-group' });
 
const runConsumer = async () => {

    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'test', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(JSON.parse(message.value))
        },
    })
}

runConsumer().catch(console.error)
