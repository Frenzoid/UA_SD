const REGISTRYADDRESS = process.env.REACT_APP_REGISTRYADDRESS;
const KAFKACONTROLLER = process.env.REACT_APP_KAFKACONTROLLER;
const KAFKAADDRESS = process.env.REACT_APP_KAFKAADDRESS;
const SECRET = process.env.REACT_APP_SECRET;
const VISITORINTERVAL = Number(process.env.REACT_APP_VISITORINTERVAL) * 1000 || 500;
const SENSORCHECKINTERVAL = Number(process.env.REACT_APP_SENSORCHECKINTERVAL) || 5;


console.log({ config: { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER, SECRET, VISITORINTERVAL, SENSORCHECKINTERVAL } });

export { REGISTRYADDRESS, KAFKAADDRESS, KAFKACONTROLLER, SECRET, VISITORINTERVAL, SENSORCHECKINTERVAL };