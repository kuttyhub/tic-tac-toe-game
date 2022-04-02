import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameAtom, PlaygroundInterface } from "../../atom/gameAtom";
import { socketAtom } from "../../atom/socketAtom";
import { socketTerms } from "../../utils/constants";
import style from "../../styles/Board.module.css";
import { checkWinner } from "../../utils/checkGameWin";
const Board = () => {
  useEffect(() => {
    subscribeEvents();
  }, []);

  const [gameState, setGameState] = useRecoilState(gameAtom);
  const socket = useRecoilValue(socketAtom);
  const [moveCount, setMoveCount] = useState(
    gameState.boardArray.length * gameState.boardArray.length
  );

  const subscribeEvents = () => {
    console.log("subscribing event");
    socket!.on(socketTerms.pullGameUpdate, (boardArray: any) => {
      console.log("pulling update state", boardArray);
      setMoveCount(moveCount - 1);
      setGameState((old) => {
        return {
          ...old,
          boardArray: boardArray,
          isYourChance: !old.isYourChance,
        };
      });
    });
    socket!.on(socketTerms.pullGameResult, (result) => {
      console.log("pulling Game finish", result);
      alert(result);
    });
  };

  const handleClick = (i: number, j: number) => {
    var boardArray = gameState.boardArray.map(function (arr) {
      return arr.slice();
    });

    boardArray[i][j] = gameState.currentPlayerSymbol;

    //update State
    setMoveCount(moveCount - 1);
    setGameState((old) => {
      return {
        ...old,
        boardArray: boardArray,
        isYourChance: !old.isYourChance,
      };
    });
    var data = {
      roomId: gameState.roomid,
      boardArray: boardArray,
    };
    socket!.emit(socketTerms.pushGameUpdate, data);

    checkIsWon(i, j, boardArray);
  };

  const checkIsWon = (i: number, j: number, boardArray: any) => {
    var result = checkWinner(
      i,
      j,
      gameState.currentPlayerSymbol,
      boardArray,
      moveCount - 1
    );

    var finishState = {
      roomId: gameState.roomid,
      result: result,
    };

    if (result == 1) {
      socket?.emit(socketTerms.pushGameResult, finishState);
      alert("winnner");
    } else if (result == 0) {
      socket?.emit(socketTerms.pushGameResult, finishState);
      alert("tie");
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
