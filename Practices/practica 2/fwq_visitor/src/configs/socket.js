import io from "socket.io-client";
import { dirFWQRegistry } from "./parametros";

export const socket = io(dirFWQRegistry, { timeout: 1000 });