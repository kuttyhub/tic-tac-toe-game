import { useRouter } from "next/router";
import { useState } from "react";
import { uuid } from "uuidv4";

import { useRecoilState, useSetRecoilState } from "recoil";
import { gameAtom } from "../atom/gameAtom";
import { userAtom, UserInterface } from "../atom/userAtom";
import { xPlayerSymbol, yPlayerSymbol } from "../constants/constants";

import styles from "../styles/Home.module.css";

const PopupForm = () => {
  const [isCreateRoomform, setisCreateRoomform] = useState(true);
  const [isPublicType, setisPublicType] = useState(true);
  const router = useRouter();
  const setUserData = useSetRecoilState(userAtom);
  const setGameState = useSetRecoilState(gameAtom);

  const createRoom = (e: any) => {
    e.preventDefault();
    var data: UserInterface = {
      name: e.target[0].value,
      boradPreference: Number(e.target[1].value),
    };
    setUserData(data);
    var state = getGameState(Number(e.target[1].value));
    console.log(state);
    setGameState(state);

    router.replace("/playground");
  };

  const getGameState = (boradPreference: number) => {
    var array = Array.from({ length: boradPreference }, () =>
      Array.from({ length: boradPreference }, () => null)
    );
    var currentuser = Math.random() % 2 == 0 ? xPlayerSymbol : yPlayerSymbol;
    var roomid = boradPreference.toString() + "_" + uuid().slice(0, 5);
    return {
      roomid: roomid,
      roomtype: isPublicType ? "Public" : "Private",
      currentPlayerSymbol: currentuser,
      boardArray: array,
    };
  };

  const joinRoomWithId = (e: any) => {
    e.preventDefault();
    var roomid = e.target[0].value;
  };

  const canConnectToRoom = (id: string) => {
    // TODO: check sockets room can connect
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
          <form action="" onSubmit={() => {}} className={styles.joinroom}>
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
