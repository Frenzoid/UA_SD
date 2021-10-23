import io from "socket.io-client";
import encrypt from "socket.io-encrypt";

import { REGISTRYADDRESS, KAFKACONTROLLER } from "./parametros";

const socketRegistry = io(REGISTRYADDRESS, { timeout: 1000 });
const kafkaWebSocket = io(KAFKACONTROLLER, { timeout: 1000 });

encrypt('ABRACADABRA')(socketRegistry);
encrypt('ABRACADABRA')(kafkaWebSocket);

export { socketRegistry, kafkaWebSocket };