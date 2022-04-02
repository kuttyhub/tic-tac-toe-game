import { atom } from "recoil";
import { nullString, publicState } from "../utils/constants";

export interface PlaygroundInterface {
  roomid: string;
  roomtype: string;
  currentPlayerSymbol: string;
  boardArray: Array<Array<string | null>>;
  isGameStarted: boolean;
  isfirstPlayer: boolean;
  isYourChance: boolean;
  gameResult: string;
}

export const gameAtom = atom<PlaygroundInterface>({
  key: "playgroundState",
  default: {
    roomid: nullString,
    roomtype: publicState,
    currentPlayerSymbol: "",
    boardArray: [],
    isGameStarted: false,
    isfirstPlayer: true,
    isYourChance: true,
    gameResult: nullString,
  },
});
