const REGISTRYADDRESS = process.env.FWQRPORT || "http://localhost:9090";
const KAFKACONTROLLER = process.env.KAFKACONTROLLER || "http://localhost:9111";
const KAFKAADDRESS = process.env.KAFKAADDRESS || "oldbox.cloud:9092";

export { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER };