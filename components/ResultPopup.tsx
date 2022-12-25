import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { gameAtom } from "../atom/gameAtom";
import { socketAtom } from "../atom/socketAtom";
import { userAtom } from "../atom/userAtom";

import { leaveRoom } from "../services/gameService";

import { loseString, nullString, winString } from "../utils/constants";

const ResultPopup = () => {
  const [gameState, setGameState] = useRecoilState(gameAtom);
  const userData = useRecoilValue(userAtom);
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

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveRoom(socket!, gameState.roomid, userData.userId);
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
    <div className="result-popup">
      <div className="result">
        <h3>{getResultString()}</h3>
        <p>Want an Another Match?</p>
        <div className="row">
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
