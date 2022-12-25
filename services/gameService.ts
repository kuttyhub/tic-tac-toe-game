import { Socket } from "socket.io-client";
import {
  CreateRoomMessage,
  LeaveRoomMessage,
  StartGameReturnMessage,
} from "../pages/api/socket";
import { socketTerms } from "../utils/constants";

export interface CreateRoomReturnState {
  userId: string;
  roomId: string;
  opponentName: string;
  gameStarted: boolean;
  isFirstPlayer: boolean;
}

interface CreateRoomData {
  socket: Socket;
}

export const createGameRoom = async (
  socket: Socket,
  username: string,
  boardPreference: number,
  type: string
): Promise<CreateRoomReturnState> => {
  let msg: CreateRoomMessage = {
    username,
    boardPreference,
    type,
  };

  return new Promise((rs, rj) => {
    socket.emit(socketTerms.createRoom, msg);
    socket.on(socketTerms.joinedRoom, (data: CreateRoomReturnState) =>
      rs(data)
    );
    socket.on(socketTerms.joinRoomError, ({ error }) => rj(error));
  });
};
export const joinGameRoomWithId = async (
  socket: Socket,
  roomId: string
): Promise<CreateRoomReturnState> => {
  return new Promise((rs, rj) => {
    socket.emit(socketTerms.joinRoomWithId, { roomId });
    socket.on(socketTerms.joinedRoom, (data: CreateRoomReturnState) =>
      rs(data)
    );
    socket.on(socketTerms.joinRoomError, ({ error }) => rj(error));
  });
};

export const leaveRoom = async (
  socket: Socket,
  roomId: string,
  userId: string
): Promise<boolean> => {
  let msg: LeaveRoomMessage = {
    roomId: roomId,
    userId: userId,
  };
  return new Promise((rs, rj) => {
    socket.emit(socketTerms.leaveRoom, msg);
    socket.on(socketTerms.leavedRoom, (val) => {
      console.log("room leaved Successfully", val);
      rs(true);
    });
    socket.on(socketTerms.leaveRoomError, (error) => rj(error));
  });
};
export const OnRoomLeave = (socket: Socket, listener: (val: any) => void) => {
  socket.on(socketTerms.leaveRoom, listener);
};

export const OnGameStart = (
  socket: Socket,
  listener: (message: StartGameReturnMessage) => void
) => {
  socket.on(socketTerms.startGame, listener);
};

export const OnGameUpdate = (
  socket: Socket,
  listener: (boardArray: any) => void
) => {
  socket.on(socketTerms.pullGameUpdate, listener);
};

export const OnGameEnd = (
  socket: Socket,
  listener: (result: string) => void
) => {
  socket.on(socketTerms.pullGameResult, listener);
};

export const OnResetUserData = (socket: Socket, listener: () => void) => {
  socket.on(socketTerms.resetUserDataOnLeave, listener);
};
