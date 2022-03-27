import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../atom/userAtom";
import { io, Socket } from "socket.io-client";
import Board from "./board";
import styles from "../../styles/playground.module.css";
import { useRouter } from "next/router";

import WaitingScreen from "./waitingScreen";
import { gameAtom } from "../../atom/gameAtom";

const PlayGround: NextPage = () => {
  useEffect(() => {
    socketInitializer();
  }, []);
  const socketInitializer = async () => {
    await fetch("/api/socket");
    var temp = io();

    temp.on("connect", () => {
      console.log("connected");
    });
    temp.on("disconnect", () => {
      console.log("disconnected");
    });

    temp.on("update-input", (msg: string) => {
      setInputValue(msg);
    });
    setSocket(temp);
  };
  const onChangeHandler = (e: any) => {
    setInputValue(e.target.value);
    socket!.emit("input-change", e.target.value);
  };
  var [socket, setSocket] = useState<null | Socket>();
  const [inputValue, setInputValue] = useState("");
  const userData = useRecoilValue(userAtom);
  const gameState = useRecoilValue(gameAtom);

  const handleLeave = () => {
    // disconnect socket
    socket!.disconnect();
    router.replace("/");
  };
  const router = useRouter();

  return (
    <div className={styles.body}>
      <div className={styles.title}>
        <div>
          <p>
            Name: <b>{userData.name}</b>
          </p>
          <p>
            Room id:{" "}
            <b>
              {gameState.roomid} - {gameState.roomtype}
            </b>
          </p>
          <p>
            Your Symbol: <b>{gameState.currentPlayerSymbol}</b>
          </p>
        </div>
        <h2>Your Turn</h2>
        <button onClick={handleLeave}>Leave</button>
      </div>
      <div className={styles.board}>
        <Board />
      </div>
      {/* <div className={styles.overlay}>
        <WaitingScreen />
      </div> */}
    </div>
  );
};

export default PlayGround;
