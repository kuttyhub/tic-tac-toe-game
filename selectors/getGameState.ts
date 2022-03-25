import { selector } from "recoil";
import { PlaygroundInterface } from "../atom/gameAtom";
import { userAtom } from "../atom/userAtom";
import { xPlayerSymbol, yPlayerSymbol } from "../constants/constants";

export const getGameStateSelector = selector<PlaygroundInterface>({
  key: "getGameStateSelector",
  get: ({ get }) => {
    const { boradPreference } = get(userAtom);
    var array = Array.from({ length: boradPreference }, () =>
      Array.from({ length: boradPreference }, () => null)
    );
    var currentuser = Math.random() % 2 == 0 ? xPlayerSymbol : yPlayerSymbol;
    return {
      currentPlayer: currentuser,
      boardArray: array,
    };
  },
});
