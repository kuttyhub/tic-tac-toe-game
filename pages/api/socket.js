import { Server } from "socket.io";

export default function (req, res) {
  if (res.socket.server.io) {
    console.log("socket is already initilaize");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on('connection', socket => {
      socket.on('input-change', msg => {
        socket.broadcast.emit('update-input', msg)
      })
    })

  }
  res.end();
}
