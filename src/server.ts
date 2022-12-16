import type { Server } from "http";
import { createServer } from "http";
import type { Express, Request } from "express";
import express from "express";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import type { ClientToServerEvents, Message, ServerToClientEvents } from "./communication";

export class SuperColliderWebRtcServer {
  app: Express;
  http: Server;
  io: SocketServer<ClientToServerEvents, ServerToClientEvents>;
  authToken = process.env.BACKEND_AUTH_TOKEN || null;

  constructor() {
    this.app = express();
    this.app.use(cors<Request>());

    this.http = createServer(this.app);

    this.io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(this.http, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
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

    this.app.get("/", (req, res) => {
      res.sendFile(`${__dirname}/static/index.html`);
    });
  }

  setupSocket() {
    this.io.on("connection", (socket) => {
      const token = socket.handshake.auth.token;
      let auth = true;

      console.log(`New client connected: ${socket.request.connection.remoteAddress}`);

      if (this.authToken) {
        if (this.authToken !== token) {
          auth = false;
          if (this.authToken != null && token != null)
            console.log(`!WARNING! Got wrong authentication for Client ${socket.request.connection.remoteAddress} with "${token}"`);
        }
        else {
          console.log(`Client ${socket.request.connection.remoteAddress} connected with proper credentials`);
        }
      }

      socket.on("disconnect", (reason) => {
        console.log(`Client ${socket.request.connection.remoteAddress} disconnected: ${reason}`);
      });

      socket.on("error", (error) => {
        console.log(`Client ${socket.request.connection.remoteAddress} got error: ${error.message}`);
      });

      socket.on("sendMessage", (message) => {
        if (!auth) {
          console.log(`WARNING: Unauthorized code distribution from ${socket.request.connection.remoteAddress}: ${message.code}`);
          return;
        }
        console.log(`Distribute message from ${socket.request.connection.remoteAddress}: ${message.code}`);
        socket.broadcast.emit("broadcastMessage", message);
      });

      socket.on("sendVisual", (message) => {
        if (!auth) {
          console.log(`WARNING: Unauthorized visual distribution from ${socket.request.connection.remoteAddress}: ${message.code}`);
          return;
        }
        console.log(`Distribute visual message from ${socket.request.connection.remoteAddress}: ${message.code}`);
        socket.broadcast.emit("broadcastVisual", message);
      });
    });
  }
}

const server = new SuperColliderWebRtcServer();

server.http.listen(4000, "0.0.0.0", () => {
  console.log("listening on 0.0.0.0:4000");
});
