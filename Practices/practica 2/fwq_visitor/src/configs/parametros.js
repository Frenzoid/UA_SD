const REGISTRYADDRESS = process.env.REACT_APP_REGISTRYADDRESS;
const KAFKACONTROLLER = process.env.REACT_APP_KAFKACONTROLLER;
const KAFKAADDRESS = process.env.REACT_APP_KAFKAADDRESS;
const SECRET = process.env.REACT_APP_SECRET;

console.log({ config: { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER, SECRET }});

export { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER, SECRET };