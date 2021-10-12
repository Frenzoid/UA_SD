const REGISTRYADDRESS = process.env.FWQRPORT || "http://localhost:9090";
const KAFKAADDRESS = process.env.KAFKAADDRESS || "oldbox.cloud:9092";

export { REGISTRYADDRESS, KAFKAADDRESS };