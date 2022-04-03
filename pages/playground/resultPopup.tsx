import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameAtom } from "../../atom/gameAtom";
import { socketAtom } from "../../atom/socketAtom";
import { leaveRoom } from "../../services/gameService";
import styles from "../../styles/playground.module.css";
import { loseString, nullString, winString } from "../../utils/constants";

const ResultPopup = () => {
  const [gameState, setGameState] = useRecoilState(gameAtom);
  const socket = useRecoilValue(socketAtom);
  const router = useRouter();

  const [isLeaving, setIsLeaving] = useState(false);

  const getResultString = () => {
    var msg = "";
    if (gameState.gameResult === winString) {
      msg = "You won the Game";
    } else if (gameState.gameResult === loseString) {
      msg = "You lose the Game";
    } else {
      msg = "The Game is a tie";
    }
    return msg;
  };

  const getClassName = () => {
    if (gameState.gameResult === winString) {
      return styles.win;
    } else if (gameState.gameResult === loseString) {
      return styles.lose;
    }
    return "";
  };

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

  const handleNextMatchOk = () => {
    setGameState((old) => {
      var arrayLength = old.boardArray.length;
      var array = Array.from({ length: arrayLength }, () =>
        Array.from({ length: arrayLength }, () => null)
      );
      return {
        ...old,
        boardArray: array,
        gameResult: nullString,
      };
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.result}>
        <br />
        <h3 className={getClassName()}>{getResultString()}</h3>
        <br />
        <p>Want an Another Match?</p>
        <div className={styles.row}>
          <button onClick={handleNextMatchOk} disabled={isLeaving}>
            Yes
          </button>
          <button onClick={handleLeave} disabled={isLeaving}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;
