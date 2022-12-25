import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { userAtom } from "../atom/userAtom";
import { gameAtom } from "../atom/gameAtom";
import { socketAtom } from "../atom/socketAtom";

import {
  loseString,
  nullString,
  socketTerms,
  tieString,
  winString,
  xPlayerSymbol,
  yPlayerSymbol,
} from "../utils/constants";
import { OIcon, XIcon } from "../utils/icons";
import { checkWinner } from "../utils/checkGameWin";

import Cell from "./Cell";
import { OnGameEnd, OnGameUpdate } from "../services/gameService";

const Board = () => {
  const [gameState, setGameState] = useRecoilState(gameAtom);
  const setUserData = useSetRecoilState(userAtom);
  const socket = useRecoilValue(socketAtom);

  useEffect(() => {
    subscribeEvents();
  }, []);

  const subscribeEvents = () => {
    if (gameState.roomid !== nullString) {
      return;
    }
    OnGameUpdate(socket!, (boardArray: any) => {
      setGameState((old) => {
        return {
          ...old,
          boardArray: boardArray,
          isYourChance: !old.isYourChance,
        };
      });
    });

    OnGameEnd(socket!, (result) => {
      setGameState((old) => {
        return { ...old, gameResult: result };
      });
      setUserData((old) => {
        let gameResult: number;

        if (result == winString) {
          gameResult = 1;
        } else if (result == loseString) {
          gameResult = -1;
        } else {
          gameResult = 0;
        }

        return { ...old, gameResults: [...old.gameResults, gameResult] };
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
          return {
            ...old,
            gameResults: [...old.gameResults, result],
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
    <div className="board">
      {!gameState.isYourChance && <div className="board--overlay" />}
      {gameState.boardArray.map((row: Array<string | null>, i: number) => {
        return (
          <div className="row" key={i}>
            {row.map((ele: string | null, j: number) => {
              return (
                <Cell
                  key={j}
                  className={`${
                    ele === null ? "non-active-cell" : "active-cell"
                  } ${ele === yPlayerSymbol ? "o-icon" : ""}`}
                  onClick={() => handleClick(i, j)}
                >
                  {ele == xPlayerSymbol ? (
                    <XIcon />
                  ) : ele == yPlayerSymbol ? (
                    <OIcon />
                  ) : null}
                </Cell>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
