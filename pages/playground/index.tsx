import { NextPage } from "next";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../atom/userAtom";
import Board from "./board";
import styles from "../../styles/playground.module.css";
import { useRouter } from "next/router";

import WaitingScreen from "./waitingScreen";
import { gameAtom } from "../../atom/gameAtom";
import { OnGameStart } from "../../services/gameService";
import { socketAtom } from "../../atom/socketAtom";
import { useEffect, useState } from "react";
import { socketTerms } from "../../constants/constants";

const PlayGround: NextPage = () => {
  const userData = useRecoilValue(userAtom);
  const [gameState, setGameState] = useRecoilState(gameAtom);
  const socket = useRecoilValue(socketAtom);

  const [isYourChance, setisYourChance] = useState(gameState.isfirstPlayer);

  const handleLeave = () => {
    socket!.emit(socketTerms.leaveRoom, { roomid: gameState.roomid });
    router.replace("/");
  };
  const router = useRouter();

  const listenGameStart = () => {
    OnGameStart(socket!, () => {
      console.log("helloo... trigred");
      setGameState((old) => {
        return {
          ...old,
          isGameStarted: true,
        };
      });
    });
  };

  useEffect(() => {
    listenGameStart();
  }, []);

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
        <h2>{isYourChance ? "Your" : "Opponent"} Turn</h2>
        <button onClick={handleLeave}>Leave</button>
      </div>
      <div className={styles.board}>
        <Board />
      </div>
      {!gameState.isGameStarted && (
        <div className={styles.overlay}>
          <WaitingScreen />
        </div>
      )}
    </div>
  );
};

export default PlayGround;
