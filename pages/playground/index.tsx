import { NextPage } from "next";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../atom/userAtom";
import Board from "./board";
import styles from "../../styles/playground.module.css";
import { useRouter } from "next/router";

import WaitingScreen from "./waitingScreen";
import { gameAtom } from "../../atom/gameAtom";
import { leaveRoom, OnGameStart } from "../../services/gameService";
import { socketAtom } from "../../atom/socketAtom";
import { useEffect, useState } from "react";
import { nullString, socketTerms, xPlayerSymbol } from "../../utils/constants";
import ResultPopup from "./resultPopup";

const PlayGround: NextPage = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [gameState, setGameState] = useRecoilState(gameAtom);
  const socket = useRecoilValue(socketAtom);
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveRoom(socket!, gameState.roomid);
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
    setIsLeaving(false);
  };

  const listenGameStart = () => {
    OnGameStart(socket!, () => {
      setGameState((old) => {
        return {
          ...old,
          isGameStarted: true,
          gameResult: nullString,
        };
      });
    });

    socket?.on(socketTerms.resetUserDataOnLeave, () => {
      setGameState((old) => {
        var arrayLength = old.boardArray.length;
        var array = Array.from({ length: arrayLength }, () =>
          Array.from({ length: arrayLength }, () => null)
        );
        return {
          ...old,
          boardArray: array,
          isGameStarted: false,
          isfirstPlayer: true,
          isYourChance: true,
          currentPlayerSymbol: xPlayerSymbol,
          remainMoves: arrayLength * arrayLength,
        };
      });

      setUserData((old) => {
        return { ...old, noOfGamePlayed: 0, noOfwin: 0 };
      });
    });
  };

  useEffect(() => {
    listenGameStart();
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.title}>
        <div className={styles.info}>
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
          <p>
            Win Ratio:{" "}
            <b>
              {userData.noOfwin} / {userData.noOfGamePlayed}
            </b>
          </p>
        </div>
        <div className={styles.turn}>
          <h2
            className={
              gameState.isYourChance ? styles.yourturn : styles.opponentturn
            }
          >
            {gameState.isYourChance ? "Your" : "Opponent"} Turn
          </h2>
        </div>
        <div className={styles.button}>
          {isLeaving ? (
            <button disabled>Leaving..</button>
          ) : (
            <button onClick={handleLeave}>Leave</button>
          )}
        </div>
      </div>
      <div className={styles.board}>
        <Board />
      </div>
      {!gameState.isGameStarted && (
        <div className={styles.overlay}>
          <WaitingScreen />
        </div>
      )}
      {gameState.gameResult != "null" && <ResultPopup />}
    </div>
  );
};

export default PlayGround;
