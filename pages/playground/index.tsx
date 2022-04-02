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
import { useEffect } from "react";
import { nullString, socketTerms, xPlayerSymbol } from "../../utils/constants";
import ResultPopup from "./resultPopup";

const PlayGround: NextPage = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [gameState, setGameState] = useRecoilState(gameAtom);
  const socket = useRecoilValue(socketAtom);
  const router = useRouter();

  const handleLeave = () => {
    socket!.emit(socketTerms.leaveRoom, { roomId: gameState.roomid });
    router.replace("/");
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
          <p>
            Win Ratio:{" "}
            <b>
              {userData.noOfwin} / {userData.noOfGamePlayed}
            </b>
          </p>
        </div>
        <h2>{gameState.isYourChance ? "Your" : "Opponent"} Turn</h2>
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
      {gameState.gameResult != "null" && <ResultPopup />}
    </div>
  );
};

export default PlayGround;
