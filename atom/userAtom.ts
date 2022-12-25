import { atom } from "recoil";

export interface MessagesInterface {
  sender: string;
  message: string;
  sendedTime: Date;
}
export interface UserInterface {
  userId: string;
  name: string;
  opponentName: string;
  boradPreference: number;
  gameResults: Array<number>;
  messages: Array<MessagesInterface>;
}

export const userAtom = atom<UserInterface>({
  key: "userState",
  default: {
    userId: "",
    name: "",
    opponentName: "",
    boradPreference: 3,
    gameResults: [],
    messages: [],
  },
});

// export type userAtom;
