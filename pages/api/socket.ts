import { Server, Socket } from "socket.io";
import {
  socketTerms,
  publicState,
  tieString,
  loseString,
} from "../../utils/constants";
import { joinGameState } from "../../services/gameService";

interface Room {
  id: string;
  boardPreference: number;
  type: string;
  players: Array<string>;
  lastUpdated: Date;
}

let rooms: Map<string, Room> = new Map();

const leaveRoomWithId = async (socket: Socket, roomId: string) => {
  console.log("requesting to leave", roomId);
  socket.leave(roomId);
  try {
    let room = rooms.get(roomId);
    console.log(room);
    room!.players = room!.players.filter((p) => p != socket.id);

    // check if room is empty or update the count
    if (room?.players.length === 1) {
      room.lastUpdated = new Date();
      rooms.set(roomId, room);
    } else {
      rooms.delete(roomId);
    }
    console.log("Room leaved successfully..!");
    socket.emit(socketTerms.leavedRoom);
    socket.to(roomId).emit(socketTerms.resetUserDataOnLeave);
  } catch (error) {
    console.log("Error while leaving room", error);
    socket.emit(socketTerms.leaveRoomError, { error: error });
  }
};

const joinRoomWithId = async (socket: Socket, roomId: string) => {
  console.log("joining room with id", roomId);
  if (rooms.has(roomId) === false) {
    socket.emit(socketTerms.joinRoomError, { error: "Invalid RoomId" });
    return;
  }

  let isRoomFull = rooms.has(roomId) && rooms.get(roomId)!.players.length == 2;
  if (isRoomFull) {
    socket.emit(socketTerms.joinRoomError, {
      error: "Room is full please choose another room to play!",
    });
    console.log("Room is full");
    return;
  }

  await socket.join(roomId);

  let room = rooms.get(roomId);
  room!.players.push(socket.id);
  room!.lastUpdated = new Date();
  rooms.set(roomId, room!);
  console.log("joined room successfully..!", room);

  let msg: joinGameState = {
    gameStarted: false,
    roomId: roomId,
    isFirstPlayer: true,
  };

  if (room!.players.length === 1) {
    socket.emit(socketTerms.joinedRoom, msg);
    return;
  }

  //on connecting second player
  msg = {
    gameStarted: true,
    roomId: roomId,
    isFirstPlayer: false,
  };

  socket.emit(socketTerms.joinedRoom, msg);
  socket.to(roomId).emit(socketTerms.startGame);
};

const joinRoom = async (socket: Socket, roomId: string, type: string) => {
  console.log("Joining/Creating room ", roomId, type);
  let board_preference = Number.parseInt(roomId.split("_")[0]);
  if (rooms.has(roomId) === false) {
    let room: Room = {
      id: roomId,
      boardPreference: board_preference,
      type: type,
      players: [],
      lastUpdated: new Date(),
    };
    rooms.set(roomId, room);
    console.log("Room created successfully..!", room);
  }

  joinRoomWithId(socket, roomId);
};

const socketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("socket is already initilaize");
    res.end();
    return;
  }

  console.log("socket initalizing...");
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on(socketTerms.connect, (socket) => {
    socket.on(
      socketTerms.createRoom,
      (message: { roomId: string; type: string }) => {
        console.log("Create room: ", message);
        let { roomId, type } = message;

        if (type === publicState) {
          let board_preference = Number.parseInt(roomId.split("_")[0]);
          // finding a free room to join
          for (let room of Array.from(rooms.values())) {
            if (
              room.boardPreference === board_preference &&
              room.type === publicState &&
              room.players.length < 2
            ) {
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
      leaveRoomWithId(socket, message.roomId);
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
        let room: Room = rooms.get(message.roomId)!;
        room.lastUpdated = new Date();
        rooms.set(message.roomId, room);

        socket
          .to(message.roomId)
          .emit(socketTerms.pullGameUpdate, message.boardArray);
      }
    );
    socket.on(
      socketTerms.pushGameResult,
      (message: { roomId: string; result: number }) => {
        let msg = tieString;
        if (message.result == 1) {
          msg = loseString;
        }

        let room: Room = rooms.get(message.roomId)!;
        room.lastUpdated = new Date();
        rooms.set(message.roomId, room);

        socket.to(message.roomId).emit(socketTerms.pullGameResult, msg);
      }
    );
  });

  res.end();
};

export default socketHandler;
