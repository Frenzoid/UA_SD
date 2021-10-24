const REGISTRYADDRESS = process.env.REGISTRYADDRESS || "http://localhost:9090";
const KAFKACONTROLLER = process.env.KAFKACONTROLLER || "http://localhost:9111";
const KAFKAADDRESS = process.env.KAFKAADDRESS || "oldbox.cloud:9092";
const SECRET = process.env.SECRET || "ABRACADABRA";

export { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER, SECRET };