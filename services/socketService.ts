import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { socketTerms } from "../utils/constants";

const SocketService = async (): Promise<
  Socket<DefaultEventsMap, DefaultEventsMap>
> => {
  return new Promise((resolve, reject) => {
    var socket: Socket = io();

    if (socket == null || socket == undefined) {
      reject();
    }

    socket.on(socketTerms.connect, () => {
      console.log("connected");
    });

    socket.on(socketTerms.disconnect, () => {
      console.log("disconnected");
    });

    socket.on(socketTerms.connectError, (err: any) => {
      reject(err);
    });

    // console.log("connected", socket);
    resolve(socket);
  });
};

export default SocketService;
