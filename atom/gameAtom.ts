import { atom } from "recoil";

export interface PlaygroundInterface {
  roomid: string;
  roomtype: string;
  currentPlayerSymbol: string;
  boardArray: Array<Array<string | null>>;
  isGameStarted: boolean;
  isfirstPlayer: boolean;
}

export const gameAtom = atom<PlaygroundInterface>({
  key: "playgroundState",
  default: {
    roomid: "null",
    roomtype: "Public",
    currentPlayerSymbol: "",
    boardArray: [],
    isGameStarted: false,
    isfirstPlayer: true,
  },
});
