import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { ClientToServerEvents, CodeMessage, ServerToClientEvents } from "./communication";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const osc = require("osc");

const SC_PORT: number = Number(process.env.SC_PORT) || 22245;
const SC_HOST: string = process.env.SC_HOST || "localhost";
const CLIENT_PORT: number = Number(process.env.CLIENT_PORT) || 22244;
const BACKEND_ADDRESS: string = process.env.BACKEND_ADDRESS || "http://localhost:4000";
const BACKEND_AUTH_TOKEN: string | null = process.env.BACKEND_AUTH_TOKEN || null;

console.log("Start client");
console.log(`Backend address: ${BACKEND_ADDRESS}`);
console.log(`SuperCollider address: ${SC_HOST}:${SC_PORT}`);
console.log(`Client port: ${CLIENT_PORT}`);

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(BACKEND_ADDRESS);

if (BACKEND_AUTH_TOKEN) {
  socket.auth = { token: BACKEND_AUTH_TOKEN };
  console.log(`Auth token: "${BACKEND_AUTH_TOKEN}"`);
}
else {
  console.log("No auth token used");
}

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: CLIENT_PORT,
  remoteAddress: SC_HOST,
  remotePort: SC_PORT
});
udpPort.open();

udpPort.on("message", (oscMessage: any) => {
  switch(oscMessage.address) {
    case "/code":
      let codeMessage = <CodeMessage>{code: oscMessage.args[0]}
      console.log(`Send to server: ${codeMessage.code}`);
      socket.emit("sendMessage", codeMessage);
      break
    case "/visual":
      let visualMessage = <CodeMessage>{code: oscMessage.args[0]}
      console.log(`Send to visual: ${visualMessage.code}`);
      socket.emit("sendVisual", visualMessage);
      break
    default:
      console.log(`Received OSC Message on wrong channel ${oscMessage.address}`);
  }
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("broadcastMessage", (message) => {
  console.log(`Received from server: ${message.code}`);

  udpPort.send({
    address: "/code",
    args: message.code,
  });
});

console.log("Started client");
