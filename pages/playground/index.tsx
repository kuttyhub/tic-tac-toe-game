import { NextPage } from "next";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { gameAtom } from "../../atom/gameAtom";
import { socketAtom } from "../../atom/socketAtom";
import { userAtom } from "../../atom/userAtom";

import {
  leaveRoom,
  OnGameStart,
  OnResetUserData,
  OnRoomLeave,
} from "../../services/gameService";
import { nullString, socketTerms, xPlayerSymbol } from "../../utils/constants";
import { CheckIcon, DrawIcon, OIcon, XIcon } from "../../utils/icons";

import Board from "../../components/Board";
import WaitingScreen from "../../components/WaitingScreen";
import ResultPopup from "../../components/ResultPopup";
import Cell from "../../components/Cell";
import { StartGameReturnMessage } from "../api/socket";
import ConfirmLeavePopup from "../../components/ConfirmLeavePopup";

const PlayGround: NextPage = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const [gameState, setGameState] = useRecoilState(gameAtom);
  const socket = useRecoilValue(socketAtom);
  const router = useRouter();

  const [showResults, setshowResults] = useState(false);
  const [showLeaveConfirm, setshowLeaveConfirm] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (gameState.roomid === nullString) {
      redirectToHome();
    } else {
      listenGameStart();
      listenToRoomLeave();
    }
    window.addEventListener("beforeunload", (event) => {
      confirm(
        "The saved changes will be destroyed. Are you sure want to leave !"
      );
      event.preventDefault();
      event.returnValue = "";
    });
    return () => {
      console.log("unmounting component...");
      window.removeEventListener("beforeunload", (event) => {
        event.returnValue = "";
      });

      console.log("leaving room on destroying..!");

      //leave room
      leaveRoom(socket!, gameState.roomid, userData.userId);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (gameState.gameResult != nullString) {
      timeout = setTimeout(() => {
        setshowResults(true);
      }, 500);
    } else {
      setshowResults(false);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [gameState.gameResult]);

  const redirectToHome = () => {
    router.replace("/");
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveRoom(socket!, gameState.roomid, userData.userId);
      redirectToHome();
    } catch (error) {
      console.error(error);
    }
    setIsLeaving(false);
  };

  const listenGameStart = () => {
    OnGameStart(socket!, (message: StartGameReturnMessage) => {
      setUserData((old) => {
        return {
          ...old,
          opponentName: message.opponentName,
        };
      });

      setGameState((old) => {
        return {
          ...old,
          isGameStarted: true,
          gameResult: nullString,
        };
      });
    });

    OnResetUserData(socket!, () => {
      setGameState((old) => {
        let arrayLength = old.boardArray.length;
        let array = Array.from({ length: arrayLength }, () =>
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
        return { ...old, opponentName: "", gameResults: [] };
      });
    });
  };

  const toggleLeaveConfirm = async (value: boolean) => {
    if (value) {
      await handleLeave();
    }
    setshowLeaveConfirm(false);
  };

  const listenToRoomLeave = () => {
    OnRoomLeave(socket!, (val) => {
      console.log("room left", val);
      redirectToHome();
    });
  };
  console.log("userdata --> ", userData);
  console.log("gameState --> ", gameState);

  const getWinRatios = (isOpponent = false): string => {
    let noOfWins = userData.gameResults.filter((result) => result == 1).length;
    let noOfLoss = userData.gameResults.filter((result) => result == -1).length;
    let length = userData.gameResults.length;

    if (isOpponent) {
      return `${noOfLoss}/${length}`;
    }
    return `${noOfWins}/${length}`;
  };

  return (
    <div className="playground-page">
      <div className="title-bar">
        <div className="player-info current-player">
          {gameState.currentPlayerSymbol == xPlayerSymbol ? (
            <Cell className="x-player">
              <XIcon />
            </Cell>
          ) : (
            <Cell className="o-player">
              <OIcon />
            </Cell>
          )}

          <div className="player-info--text">
            <b>{userData.name}</b>
            {userData.gameResults.length > 0 && (
              <>
                <p>Wins : {getWinRatios(false)}</p>
                <div className="player-info--history">
                  {userData.gameResults.map((value, idx) => {
                    if (value == 1) {
                      return (
                        <Cell key={idx} className="win cell--small">
                          <CheckIcon />
                        </Cell>
                      );
                    }

                    if (value == 0) {
                      return (
                        <Cell key={idx} className="draw cell--small">
                          <DrawIcon />
                        </Cell>
                      );
                    }

                    return (
                      <Cell key={idx} className="lose cell--small">
                        <XIcon />
                      </Cell>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          {isLeaving ? (
            <button disabled>Leaving..</button>
          ) : (
            <button onClick={() => setshowLeaveConfirm(true)}>Leave</button>
          )}
        </div>
        <div
          className="player-info"
          style={{
            flexDirection: "row-reverse",
            opacity: userData.opponentName == "" ? 0 : 1,
          }}
        >
          {gameState.currentPlayerSymbol != xPlayerSymbol ? (
            <Cell className="x-player">
              <XIcon />
            </Cell>
          ) : (
            <Cell className="o-player">
              <OIcon />
            </Cell>
          )}

          <div className="player-info--text">
            <b style={{ textAlign: "end" }}>{userData.opponentName}</b>
            {userData.gameResults.length > 0 && (
              <>
                <p style={{ textAlign: "end" }}>Wins : {getWinRatios(true)}</p>
                <div className="player-info--history">
                  {userData.gameResults.map((value, idx) => {
                    if (value == -1) {
                      return (
                        <Cell key={idx} className="win cell--small">
                          <CheckIcon />
                        </Cell>
                      );
                    }

                    if (value == 0) {
                      return (
                        <Cell key={idx} className="draw cell--small">
                          <DrawIcon />
                        </Cell>
                      );
                    }

                    return (
                      <Cell key={idx} className="lose cell--small">
                        <XIcon />
                      </Cell>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="board-wrapper">
        <Board />
        <h1 className={gameState.isYourChance ? "" : "opponent-turn"}>
          {gameState.isYourChance ? "Your" : "Opponent"} Turn
        </h1>
      </div>
      {!gameState.isGameStarted && (
        <div className="overlay">
          <WaitingScreen />
        </div>
      )}
      {showResults && <ResultPopup />}
      {showLeaveConfirm && (
        <ConfirmLeavePopup toggleLeaveConfirm={toggleLeaveConfirm} />
      )}
    </div>
  );
};

export default PlayGround;
