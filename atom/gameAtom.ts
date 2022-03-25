import { atom } from "recoil";

export interface PlaygroundInterface {
  currentPlayer: string;
  boardArray: Array<Array<string | null>>;
}

export const gameAtom = atom<PlaygroundInterface>({
  key: "playgroundState",
  default: {
    currentPlayer: "",
    boardArray: [],
  },
});
