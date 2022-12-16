import type { Server } from "http";
import { createServer } from "http";
import type { Express } from "express";
import express from "express";
import { Server as SocketServer } from "socket.io";
import type { ClientToServerEvents, Message, ServerToClientEvents } from "./communication";

export class SuperColliderWebRtcServer {
  app: Express;
  http: Server;
  io: SocketServer<ClientToServerEvents, ServerToClientEvents>;
  authToken = process.env.BACKEND_AUTH_TOKEN || null;

  constructor() {
    this.app = express();

    this.http = createServer(this.app);

    this.io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(this.http, {
      cors: {
        origin: [
          "http://localhost:*",
          "http://client"
        ]
      }
    });

    if (this.authToken)
      console.log(`Using auth token: "${this.authToken}"`);
    else
      console.log("Run without auth token");

    this.setupApp();
    this.setupSocket();
  }

  setupApp() {
    this.app.get("/live", (req, res) => {
      res.sendStatus(200);
    });
  }

  setupSocket() {
    this.io.on("connection", (socket) => {
      const token = socket.handshake.auth.token;
      let auth = true;

      if (this.authToken) {
        if (this.authToken !== token) {
          auth = false;
          if (this.authToken != null && token != null)
            console.log(`WARNING! Got wrong authentication for ${socket}`);
        }
        else {
          console.log("Client with proper credentials connected");
        }
      } else {
        console.log("New user connected");
      }

      socket.on("sendMessage", (message) => {
        console.log(`Distribute message: ${message.code}`);
        socket.broadcast.emit("broadcastMessage", message);
      });
    });
  }
}

const server = new SuperColliderWebRtcServer();

server.http.listen(3000, "0.0.0.0", () => {
  console.log("listening on 0.0.0.0:3000");
});
