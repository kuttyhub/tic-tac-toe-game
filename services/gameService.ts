import { Socket } from "socket.io-client";
import { socketTerms } from "../utils/constants";

export interface joinGameState {
  gameStarted: boolean;
  roomId: string;
  isFirstPlayer: boolean;
}

export const joinGameRoom = async (
  socket: Socket,
  roomId: string,
  type: string
): Promise<joinGameState> => {
  return new Promise((rs, rj) => {
    socket.emit(socketTerms.createRoom, { roomId, type });
    socket.on(socketTerms.joinedRoom, (data: joinGameState) => rs(data));
    socket.on(socketTerms.joinRoomError, ({ error }) => rj(error));
  });
};
export const joinGameRoomWithId = async (
  socket: Socket,
  roomId: string
): Promise<joinGameState> => {
  return new Promise((rs, rj) => {
    socket.emit(socketTerms.joinRoomWithId, { roomId });
    socket.on(socketTerms.joinedRoom, (data: joinGameState) => rs(data));
    socket.on(socketTerms.joinRoomError, ({ error }) => rj(error));
  });
};

export const OnGameStart = async (socket: Socket, listener: () => void) => {
  //listen to the game starting
  console.log("listening to game start...!");
  socket.on(socketTerms.startGame, listener);
};
