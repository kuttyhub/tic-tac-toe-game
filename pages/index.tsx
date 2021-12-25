import type { NextPage } from "next";
import { useState } from "react";
import { setTimeout } from "timers";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [data, setdata] = useState<(null | string)[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
  );
  const [isMychance, setisMychance] = useState(true);
  const [isGameStarted, setisGameStarted] = useState(false);
  const [moveCount, setmoveCount] = useState(9);
  const [alertVisible, setalertVisible] = useState(false);
  const [alterText, setalterText] = useState("");

  const handleClick = (i: any, j: any) => {
    setmoveCount(moveCount - 1);

    if (isGameStarted) {
      if (!data[i][j]) {
        var player = isMychance ? "O" : "X";
        let temp = [...data];
        temp[i][j] = player;
        setdata(temp);
        var res = checkWinner(i, j, player);
        console.log(res);
        if (res == 1) {
          // alert(player + " Player Wins!");
          showAlterVisible(player + " Player Wins!");
          setTimeout(() => resetGame(), 3000);
        } else if (res == 0) {
          // alert("Game Tied");
          showAlterVisible("Game Tied");
          resetGame();
        }
        setisMychance(!isMychance);
      }
    } else {
      !isGameStarted ? alert("please start the game") : alert("already filled");
    }
    if (moveCount === 0) {
      // alert("game ended");
      showAlterVisible("Game Ended");
      setTimeout(() => resetGame(), 3000);
    }
    // console.log(data);
  };
  const showAlterVisible = (text: string) => {
    setalertVisible(true);
    setalterText(text);
    setTimeout(() => setalertVisible(false), 3000);
  };
  const resetGame = () => {
    setisGameStarted(false);
    setmoveCount(9);
    setdata(
      Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
    );
    setisMychance(true);
  };

  const checkWinner = (iIdx: any, jIdx: any, player: string) => {
    //horizontal
    if (
      data[0][jIdx] === player &&
      data[1][jIdx] === player &&
      data[2][jIdx] === player
    ) {
      return 1;
    }
    //vertical
    if (
      data[iIdx][0] == player &&
      data[iIdx][1] == player &&
      data[iIdx][2] == player
    ) {
      return 1;
    }
    //idagonal
    if (iIdx == jIdx) {
      if (
        data[0][0] == player &&
        data[1][1] == player &&
        data[2][2] == player
      ) {
        return 1;
      }
    }

    return moveCount === 0 ? 0 : -1;
  };

  const startGame = () => {
    setisGameStarted(true);
  };
  return (
    <div className=" text-center p-24">
      <h1 className="text-5xl">tic-tac-toe</h1>
      <div className="mx-auto my-5 flex-col">
        <h1>Current playing : {isMychance ? "you" : "apponent"}</h1>
        <button
          className="py-3 px-10 rounded-lg mt-3 text-white bg-green-400 disabled:cursor-not-allowed disabled:bg-red-400 disabled:opacity-75"
          disabled={isGameStarted ? true : false}
          onClick={startGame}
        >
          Start
        </button>
      </div>
      <div className="mx-auto my-10 max-w-min bg-slate-100 rounded-md p-10">
        {data.map((ele: any, i: any) => (
          <div className="flex " key={i}>
            {ele.map((elej: any, j: any) => (
              <div
                key={i + j}
                className="h-24 w-24 border-2 border-zinc-500 flex items-center justify-center cursor-pointer"
                onClick={() => handleClick(i, j)}
              >
                <h2 className="text-3xl">{elej}</h2>
              </div>
            ))}
          </div>
        ))}
      </div>
      {alertVisible ? <div className="alert">{alterText}</div> : null}
    </div>
  );
};

export default Home;
