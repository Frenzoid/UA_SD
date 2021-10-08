const dirFWQRegistry = process.env.REGISTRYADDRESS || "http://localhost:9090";
const dirKafkaServer = process.env.KAFKAADDRESS || "oldbox.cloud:9092";

export { dirFWQRegistry, dirKafkaServer };