import { atom } from "recoil";

export interface UserInterface {
  name: string;
  boradPreference: number;
}

export const userAtom = atom<UserInterface>({
  key: "userState",
  default: {
    name: "",
    boradPreference: 0,
  },
});

// export type userAtom;
