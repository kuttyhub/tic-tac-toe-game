import { Server, Socket } from "socket.io";
import { socketTerms, publicState } from "../../utils/constants";
import { joinGameState } from "../../services/gameService";
import { PlaygroundInterface } from "../../atom/gameAtom";

interface Room {
  id: string;
  boardPreference: Number;
  type: string;
  players: Array<string>;
}

let rooms: Map<string, Room> = new Map();

export default function (req: any, res: any) {
  if (res.socket.server.io) {
    console.log("socket is already initilaize");
  } else {
    console.log("socket");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on(socketTerms.connect, (socket) => {
      socket.on(
        socketTerms.createRoom,
        (message: { roomId: string; type: string }) => {
          console.log("Create room: ", message);
          var { roomId, type } = message;

          if (type === publicState) {
            var board_preference = Number.parseInt(roomId.split("_")[0]);
            // finding a free room to join
            for (let room of Array.from(rooms.values())) {
              if (
                room.boardPreference === board_preference &&
                room.type === publicState &&
                room.players.length < 2
              ) {
                // console.log(room);
                joinRoomWithId(socket, room.id);
                return;
              }
            }
          }
          //rooms not available or is a private type create new room
          joinRoom(socket, roomId, type);
        }
      );

      socket.on(socketTerms.joinRoomWithId, (message: { roomId: string }) => {
        joinRoomWithId(socket, message.roomId);
      });

      socket.on(socketTerms.leaveRoom, (message: { roomId: string }) => {
        console.log("requesting to leave");
        socket.leave(message.roomId);
        console.log("leaved successfully..!");
      });

      socket.on(socketTerms.getRooms, () => {
        console.log("geting rooms...");
        const socketRooms = Array.from(rooms.keys());
        console.log("Rooms:", socketRooms);
        socket.emit(socketTerms.emitRooms, socketRooms);
      });
      socket.on(
        socketTerms.pushGameUpdate,
        (message: { roomId: string; boardArray: any }) => {
          // console.log("new state", message);
          socket
            .to(message.roomId)
            .emit(socketTerms.pullGameUpdate, message.boardArray);
        }
      );
      socket.on(
        socketTerms.pushGameResult,
        (message: { roomId: string; result: number }) => {
          let msg = "tie";
          if (message.result == 1) {
            msg = "lose";
          }
          socket.to(message.roomId).emit(socketTerms.pullGameResult, msg);
        }
      );
    });

    // console.log(io);
  }
  res.end();
}
const joinRoomWithId = async (socket: Socket, roomId: string) => {
  console.log("joining room with id", roomId);
  if (!rooms.has(roomId)) {
    socket.emit(socketTerms.joinRoomError, { error: "Invalid RoomId" });
  } else if (rooms.get(roomId)!.players.length == 2) {
    socket.emit(socketTerms.joinRoomError, {
      error: "Room is full please choose another room to play!",
    });
  } else {
    await socket.join(roomId);
    console.log("joined");

    let room = rooms.get(roomId);
    room!.players.push(socket.id);
    rooms.set(roomId, room!);

    var msg: joinGameState = {
      gameStarted: true,
      roomId: roomId,
      isFirstPlayer: false,
    };
    socket.emit(socketTerms.joinedRoom, msg);
    socket.to(roomId).emit(socketTerms.startGame);
  }
};

const joinRoom = async (socket: Socket, roomId: string, type: string) => {
  console.log("joining new room", roomId, type);
  var board_preference = Number.parseInt(roomId.split("_")[0]);
  let isRoomFull = rooms.has(roomId) && rooms.get(roomId)!.players.length == 2;

  if (isRoomFull) {
    socket.emit(socketTerms.joinRoomError, {
      error: "Room is full please choose another room to play!",
    });
  } else {
    await socket.join(roomId);
    console.log("joined");

    if (rooms.has(roomId)) {
      // has return true or false by cheking key
      var room = rooms.get(roomId)!;
      room.players.push(socket.id);
    } else {
      var room: Room = {
        id: roomId,
        boardPreference: board_preference,
        type: type,
        players: [socket.id],
      };
    }
    console.log(room);

    rooms.set(roomId, room);

    if (room.players.length === 1) {
      var msg: joinGameState = {
        gameStarted: false,
        roomId: roomId,
        isFirstPlayer: true,
      };
      socket.emit(socketTerms.joinedRoom, msg);
    } else if (room.players.length === 2) {
      //on connecting second player
      var msg: joinGameState = {
        gameStarted: true,
        roomId: roomId,
        isFirstPlayer: false,
      };
      socket.emit(socketTerms.joinedRoom, msg);
      socket.to(roomId).emit(socketTerms.startGame);
    }
  }
};
