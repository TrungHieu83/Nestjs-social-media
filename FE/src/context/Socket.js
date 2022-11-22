import io from "socket.io-client";
import { createContext } from "react";
const url = process.env.REACT_APP_PUBLIC_FOLDER;
export const socket = io.connect(`${url}`);
export const SocketContext = createContext();