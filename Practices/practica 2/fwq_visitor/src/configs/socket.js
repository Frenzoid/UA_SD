import io from "socket.io-client";

import { REGISTRYADDRESS, KAFKACONTROLLER } from "./parametros";

const socketRegistry = io(REGISTRYADDRESS, { timeout: 1000 });
const kafkaWebSocket = io(KAFKACONTROLLER, { timeout: 1000 });

export { socketRegistry, kafkaWebSocket };