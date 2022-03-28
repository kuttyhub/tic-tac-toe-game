import { atom } from "recoil";
import { Socket } from "socket.io-client";

export const socketAtom = atom<null | Socket>({
  key: "SocketState",
  default: null,
  dangerouslyAllowMutability: true, // to modify the default state
});
