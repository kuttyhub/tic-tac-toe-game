import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuid_v4 } from "uuid";

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

import styles from "../styles/Home.module.css";
import { socketAtom } from "../atom/socketAtom";
import {
  joinGameRoom,
  joinGameRoomWithId,
  joinGameState,
} from "../services/gameService";

const PopupForm = () => {
  const [isCreateRoomform, setisCreateRoomform] = useState(true);
  const [isPublicType, setisPublicType] = useState(true);
  const router = useRouter();
  const setUserData = useSetRecoilState(userAtom);
  const setGameState = useSetRecoilState(gameAtom);

  const socket = useRecoilValue(socketAtom);

  const createRoom = async (e: any) => {
    e.preventDefault();

    var data: UserInterface = {
      name: e.target[0].value,
      boradPreference: Number(e.target[1].value),
      noOfGamePlayed: 0,
      noOfwin: 0,
    };

    var roomid = data.boradPreference.toString() + "_" + uuid_v4().slice(0, 5);
    var type = isPublicType ? publicState : privateState;
    try {
      var joinState: joinGameState | void = await joinGameRoom(
        socket!,
        roomid,
        type
      );
      setStates(data, joinState);
    } catch (err) {
      alert(err);
    }
  };

  const setStates = (data: UserInterface, joinState: joinGameState) => {
    setUserData(data);
    var array = Array.from({ length: data.boradPreference }, () =>
      Array.from({ length: data.boradPreference }, () => null)
    );
    var state: PlaygroundInterface = {
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

    router.replace("/playground");
  };

  const joinRoomWithId = async (e: any) => {
    e.preventDefault();
    var name = e.target[0].value;
    var roomid: string = e.target[1].value;
    var boardPreference = Number(roomid.split("_")[0]);
    var data: UserInterface = {
      name: name,
      boradPreference: boardPreference,
      noOfGamePlayed: 0,
      noOfwin: 0,
    };

    try {
      var joinState: joinGameState = await joinGameRoomWithId(socket!, roomid);
      setStates(data, joinState);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.swapButtons}>
        <h3
          className={isCreateRoomform ? styles.active : ""}
          onClick={() => setisCreateRoomform(true)}
        >
          Create Room
        </h3>
        <h3
          className={!isCreateRoomform ? styles.active : ""}
          onClick={() => setisCreateRoomform(false)}
        >
          Join Room
        </h3>
      </div>
      {isCreateRoomform ? (
        <div className="createroom">
          <form action="" onSubmit={createRoom}>
            <label htmlFor="username">What would you like to Call :</label>
            <input type="text" name="username" placeholder="name" required />
            <label htmlFor="board-size">Select Board Size :</label>
            <select name="board-size">
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <label>Room Type :</label>
            <div className={styles.roomtype}>
              <p
                className={isPublicType ? styles.typeActive : ""}
                onClick={() => setisPublicType(true)}
              >
                Public
              </p>
              <p
                className={!isPublicType ? styles.typeActive : ""}
                onClick={() => setisPublicType(false)}
              >
                Private
              </p>
            </div>
            {isPublicType ? (
              <p className={styles.warning}>
                *If a public room is already available it will add you otherwise
                a spepare room will be created on your board size
              </p>
            ) : (
              <p className={styles.warning}>
                *It create a private room.members can join via only the room id
              </p>
            )}
            <button type="submit">Create/Join Room</button>
          </form>
        </div>
      ) : (
        <div>
          <form action="" onSubmit={joinRoomWithId} className={styles.joinroom}>
            <label htmlFor="">Enter your Name:</label>
            <input required type="text" placeholder="Name" />
            <label htmlFor="">Enter your Room id</label>
            <input required type="text" placeholder="room id" />
            <button type="submit">Join</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PopupForm;
