import { atom } from "recoil";

export interface UserInterface {
  name: string;
  boradPreference: number;
  noOfGamePlayed: number;
  noOfwin: number;
}

export const userAtom = atom<UserInterface>({
  key: "userState",
  default: {
    name: "",
    boradPreference: 0,
    noOfGamePlayed: 0,
    noOfwin: 0,
  },
});

// export type userAtom;
