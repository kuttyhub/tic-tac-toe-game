import { Server } from "socket.io";

export default function (req, res) {
  if (res.socket.server.io) {
    console.log("socket is already initilaize");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
}
