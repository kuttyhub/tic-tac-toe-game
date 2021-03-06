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
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const setUserData = useSetRecoilState(userAtom);
  const setGameState = useSetRecoilState(gameAtom);

  const socket = useRecoilValue(socketAtom);

  const createRoom = async (e: any) => {
    e.preventDefault();
    setIsJoining(true);

    var data: UserInterface = {
      name: e.target[0].value.trim(),
      boradPreference: Number(e.target[1].value.trim()),
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
    setIsJoining(false);

    router.replace("/playground");
  };

  const joinRoomWithId = async (e: any) => {
    e.preventDefault();
    setIsJoining(true);

    var name = e.target[0].value.trim();
    var roomid: string = e.target[1].value.trim();
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
      alert(err);
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
        <div className={styles.createroom}>
          <form action="" onSubmit={createRoom}>
            <label htmlFor="username">What would you like to Call :</label>
            <input type="text" name="username" placeholder="name" required />
            <label htmlFor="board-size">Select Board Size :</label>
            <select name="board-size">
              <option value="3">3</option>
              <option value="5">5</option>
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
                * You will be added to a public room of your chosen size,if it
                is available <br />
                otherwise a new Public Room will be created for you !
              </p>
            ) : (
              <p className={styles.warning}>
                *Create a private Room and share the roomId with your friends to
                play with them !
              </p>
            )}
            {isJoining ? (
              <button disabled>Joining</button>
            ) : (
              <button type="submit">Create/Join Room</button>
            )}
          </form>
        </div>
      ) : (
        <div className={styles.joinroom}>
          <form action="" onSubmit={joinRoomWithId}>
            <label htmlFor="">Enter your Name:</label>
            <input required type="text" placeholder="Name" />
            <label htmlFor="">Enter your Room id</label>
            <input required type="text" placeholder="room id" />
            {isJoining ? (
              <button disabled>Joining</button>
            ) : (
              <button type="submit">Join</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default PopupForm;
