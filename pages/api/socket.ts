import { Server } from "socket.io";
import { socketTerms } from "../../constants/constants";
import { joinGameState } from "../../services/gameService";

export default function (req: any, res: any) {
  if (res.socket.server.io) {
    console.log("socket is already initilaize");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on(socketTerms.connect, (socket) => {
      socket.on(socketTerms.createRoom, async (message: { roomid: string }) => {
        console.log("New User joining room: ", message);
        var connectedSockets = io.sockets.adapter.rooms.get(message.roomid);
        const socketRooms = Array.from(socket.rooms.values()).filter(
          (r) => r !== socket.id
        );

        if (
          socketRooms.length > 0 ||
          (connectedSockets != undefined && connectedSockets.size === 2)
        ) {
          socket.emit(socketTerms.joinRoomError, {
            error: "Room is full please choose another room to play!",
          });
        } else {
          await socket.join(message.roomid);
          console.log("joined");

          connectedSockets = io.sockets.adapter.rooms.get(message.roomid);
          console.log(connectedSockets, socketRooms);

          if (connectedSockets && connectedSockets.size === 1) {
            var msg: joinGameState = {
              gameStarted: false,
              isFirstPlayer: true,
            };
            socket.emit(socketTerms.joinedRoom, msg);
          } else if (connectedSockets && connectedSockets.size === 2) {
            //on connecting second player
            var msg: joinGameState = {
              gameStarted: true,
              isFirstPlayer: false,
            };
            socket.emit(socketTerms.joinedRoom, msg);
            socket.to(message.roomid).emit(socketTerms.startGame);
          }
        }
      });
      socket.on(socketTerms.leaveRoom, (message: { roomid: string }) => {
        console.log("requesting to leave");
        socket.leave(message.roomid);
        console.log("leaved successfully..!");
      });
    });
    // console.log(io);
  }
  res.end();
}
