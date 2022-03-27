import { atom } from "recoil";

export interface PlaygroundInterface {
  roomid: string;
  roomtype: string;
  currentPlayerSymbol: string;
  boardArray: Array<Array<string | null>>;
}

export const gameAtom = atom<PlaygroundInterface>({
  key: "playgroundState",
  default: {
    roomid: "null",
    roomtype: "Public",
    currentPlayerSymbol: "",
    boardArray: [],
  },
});
