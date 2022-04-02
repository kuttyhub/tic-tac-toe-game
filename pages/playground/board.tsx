import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { gameAtom } from "../../atom/gameAtom";
import { socketAtom } from "../../atom/socketAtom";
import {
  nullString,
  socketTerms,
  tieString,
  winString,
} from "../../utils/constants";
import style from "../../styles/Board.module.css";
import { checkWinner } from "../../utils/checkGameWin";
import { userAtom } from "../../atom/userAtom";

const Board = () => {
  useEffect(() => {
    subscribeEvents();
  }, []);

  const [gameState, setGameState] = useRecoilState(gameAtom);
  const setUserData = useSetRecoilState(userAtom);
  const socket = useRecoilValue(socketAtom);

  const subscribeEvents = () => {
    socket!.on(socketTerms.pullGameUpdate, (boardArray: any) => {
      setGameState((old) => {
        return {
          ...old,
          boardArray: boardArray,
          isYourChance: !old.isYourChance,
        };
      });
    });
    socket!.on(socketTerms.pullGameResult, (result) => {
      setGameState((old) => {
        return { ...old, gameResult: result };
      });
      setUserData((old) => {
        return { ...old, noOfGamePlayed: old.noOfGamePlayed + 1 };
      });
    });
  };

  const handleClick = (i: number, j: number) => {
    var boardArray = gameState.boardArray.map(function (arr) {
      return arr.slice();
    });

    if (boardArray[i][j] === null) {
      boardArray[i][j] = gameState.currentPlayerSymbol;

      //chck result
      var result = checkWinner(i, j, gameState.currentPlayerSymbol, boardArray);

      var gameResult = nullString;
      if (result == 1 || result == 0) {
        var finishState = {
          roomId: gameState.roomid,
          result: result,
        };

        gameResult = result == 1 ? winString : tieString;
        socket?.emit(socketTerms.pushGameResult, finishState);

        setUserData((old) => {
          var noOfwin = result == 1 ? old.noOfwin + 1 : old.noOfwin;
          return {
            ...old,
            noOfGamePlayed: old.noOfGamePlayed + 1,
            noOfwin: noOfwin,
          };
        });
      }

      //update State
      setGameState((old) => {
        return {
          ...old,
          boardArray: boardArray,
          isYourChance: !old.isYourChance,
          gameResult: gameResult,
        };
      });

      var data = {
        roomId: gameState.roomid,
        boardArray: boardArray,
      };
      socket!.emit(socketTerms.pushGameUpdate, data);
    }
  };
  return (
    <div className={style.board}>
      {!gameState.isYourChance && <div className={style.overlay} />}
      {gameState.boardArray.map((row: Array<string | null>, iIdx: number) => {
        return (
          <div className={style.row} key={iIdx}>
            {row.map((cell: string | null, jIdx: number) => {
              return (
                <div
                  className={style.cell}
                  key={jIdx}
                  onClick={() => handleClick(iIdx, jIdx)}
                >
                  <p>{cell}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
