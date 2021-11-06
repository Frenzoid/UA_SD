const REGISTRYADDRESS = process.env.REACT_APP_REGISTRYADDRESS;
const KAFKACONTROLLER = process.env.REACT_APP_KAFKACONTROLLER;
const KAFKAADDRESS = process.env.REACT_APP_KAFKAADDRESS;
const SECRET = process.env.REACT_APP_SECRET;
const VISITORINTERVAL = process.env.REACT_APP_VISITORINTERVAL * 1000 || 750;
const SENSORCHECKINTERVAL = process.env.REACT_APP_SENSORCHECKINTERVAL || 5;


console.log({ config: { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER, SECRET, VISITORINTERVAL, SENSORCHECKINTERVAL } });

export { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER, SECRET, VISITORINTERVAL, SENSORCHECKINTERVAL };