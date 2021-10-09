import io from "socket.io-client";
import { REGISTRYADDRESS } from "./parametros";

export const socket = io(REGISTRYADDRESS, { timeout: 1000 });