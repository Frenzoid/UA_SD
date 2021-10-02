import io from "socket.io-client";
import { dirRegistros } from "./parametros";

export const socket = io(dirRegistros);;