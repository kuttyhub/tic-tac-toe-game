import { useRouter } from "next/router";
import { useState } from "react";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { gameAtom, PlaygroundInterface } from "../atom/gameAtom";
import { userAtom, UserInterface } from "../atom/userAtom";
import {
  nullString,
  privateState,
  publicState,
  xPlayerSymbol,
  yPlayerSymbol,
} from "../utils/constants";

import { socketAtom } from "../atom/socketAtom";
import {
  createGameRoom,
  joinGameRoomWithId,
  CreateRoomReturnState,
} from "../services/gameService";

const PopupForm = () => {
  const [isCreateRoomform, setisCreateRoomform] = useState(true);
  const [isPublicType, setisPublicType] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const setUserData = useSetRecoilState(userAtom);
  const setGameState = useSetRecoilState(gameAtom);

  const socket = useRecoilValue(socketAtom);

  const createRoom = async (e: any) => {
    e.preventDefault();
    setIsJoining(true);

    let data: UserInterface = {
      userId: "",
      name: e.target[0].value.trim(),
      opponentName: "",
      boradPreference: Number(e.target[1].value),
      gameResults: [],
      messages: [],
    };
    let type = isPublicType ? publicState : privateState;
    try {
      let joinState: CreateRoomReturnState | void = await createGameRoom(
        socket!,
        data.name,
        data.boradPreference,
        type
      );
      setStates(data, joinState);
    } catch (err) {
      alert(err);
    }
  };

  const setStates = (data: UserInterface, joinState: CreateRoomReturnState) => {
    data = {
      ...data,
      userId: joinState.userId,
      opponentName: joinState.opponentName,
    };

    setUserData(data);

    let array = Array.from({ length: data.boradPreference }, () =>
      Array.from({ length: data.boradPreference }, () => null)
    );
    let state: PlaygroundInterface = {
      roomid: joinState.roomId,
      roomtype: isPublicType ? publicState : privateState,
      currentPlayerSymbol: joinState.isFirstPlayer
        ? xPlayerSymbol
        : yPlayerSymbol,
      boardArray: array,
      isGameStarted: joinState.gameStarted,
      isfirstPlayer: joinState.isFirstPlayer,
      isYourChance: joinState.isFirstPlayer,
      gameResult: nullString,
    };
    setGameState(state);
    setIsJoining(false);

    router.replace("/playground");
  };

  const joinRoomWithId = async (e: any) => {
    e.preventDefault();
    setIsJoining(true);

    let name = e.target[0].value.trim();
    let roomid: string = e.target[1].value.trim();
    let boardPreference = Number(roomid.split("_")[0]);
    let data: UserInterface = {
      userId: "",
      name: name,
      opponentName: "",
      boradPreference: boardPreference,
      gameResults: [],
      messages: [],
    };
    try {
      let joinState: CreateRoomReturnState = await joinGameRoomWithId(
        socket!,
        roomid
      );
      setStates(data, joinState);
    } catch (err) {
      alert(err);
    }
  };

  const toggleRoomForm = (val: boolean) => {
    if (isJoining) return;

    setisCreateRoomform(val);
  };

  return (
    <div className="popup-form">
      <div className="swapButtons">
        <h3
          className={isCreateRoomform ? "active" : ""}
          onClick={() => toggleRoomForm(true)}
        >
          Create Room
        </h3>
        <h3
          className={!isCreateRoomform ? "active" : ""}
          onClick={() => toggleRoomForm(false)}
        >
          Join Room
        </h3>
        <div className={`line ${!isCreateRoomform ? "active-line" : ""}`} />
      </div>

      {isCreateRoomform ? (
        <form action="" onSubmit={createRoom}>
          <label htmlFor="username">What would you like to Call :</label>
          <input type="text" name="username" placeholder="name" required />
          <label htmlFor="board-size">Select Board Size :</label>
          <select name="board-size">
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
          <label>Room Type :</label>
          <div className="roomtype">
            <p
              className={isPublicType ? "active" : ""}
              onClick={() => setisPublicType(true)}
            >
              Public
            </p>
            <p
              className={!isPublicType ? "active" : ""}
              onClick={() => setisPublicType(false)}
            >
              Private
            </p>
          </div>
          <p className="warning">
            {isPublicType
              ? `* You will be added to a public room of your chosen size,if it is available
              otherwise a new Public Room will be created for you !`
              : `*Create a private Room and share the roomId with your friends to
              play with them !`}
          </p>
          <button type="submit" disabled={isJoining}>
            {isJoining ? "Joining room" : "Create / Join Room"}
          </button>
        </form>
      ) : (
        <form action="" onSubmit={joinRoomWithId}>
          <label htmlFor="">Enter your Name :</label>
          <input required type="text" placeholder="Name" />
          <label htmlFor="">Enter your Room id :</label>
          <input required type="text" placeholder="room id" />
          <button type="submit" disabled={isJoining}>
            {isJoining ? "Joining room" : "Join Room"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PopupForm;
