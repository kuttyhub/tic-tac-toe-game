import type { NextPage } from "next";
import { useState } from "react";
import { setTimeout } from "timers";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [arraySize, setArraySize] = useState(3);
  const [data, setdata] = useState<(null | string)[][]>(
    Array.from({ length: arraySize }, () =>
      Array.from({ length: arraySize }, () => null)
    )
  );

  const [isMychance, setisMychance] = useState(true);
  const [isGameStarted, setisGameStarted] = useState(false);
  const [moveCount, setmoveCount] = useState(arraySize * arraySize);
  const [alertVisible, setalertVisible] = useState(false);
  const [alterText, setalterText] = useState("");

  const handleClick = (i: any, j: any) => {
    if (isGameStarted) {
      if (!data[i][j]) {
        setmoveCount(moveCount - 1);
        var player = isMychance ? "O" : "X";
        let temp = [...data];
        temp[i][j] = player;
        setdata(temp);
        var res = checkWinner(i, j, player);
        console.log(res);
        if (res == 1) {
          showAlertPopup(player + " Player Wins!");
          setTimeout(() => resetGame(), 3000);
        } else if (res == 0) {
          showAlertPopup("Game Tied");
          setTimeout(() => resetGame(), 3000);
        }
        setisMychance(!isMychance);
      } else {
        showAlertPopup("already filled");
      }
    } else {
      showAlertPopup("please start the game");
    } // console.log(data);
  };
  const showAlertPopup = (text: string) => {
    setalertVisible(true);
    setalterText(text);
    setTimeout(() => setalertVisible(false), 3000);
  };
  const resetGame = () => {
    setisGameStarted(false);
    setmoveCount(arraySize * arraySize);
    setdata(
      Array.from({ length: arraySize }, () =>
        Array.from({ length: arraySize }, () => null)
      )
    );
    setisMychance(true);
  };

  const checkWinner = (iIdx: any, jIdx: any, player: string) => {
    //horizontal
    var flag = true;
    for (var i = 0; i < arraySize; i++) {
      if (data[i][jIdx] !== player) {
        flag = false;
        break;
      }
    }
    if (flag) {
      return 1;
    }

    flag = true;
    for (var i = 0; i < arraySize; i++) {
      if (data[iIdx][i] !== player) {
        flag = false;
        break;
      }
    }
    if (flag) {
      return 1;
    }
    //diagonal
    if (iIdx === jIdx || iIdx === arraySize - jIdx - 1) {
      flag = true;
      for (var i = 0; i < arraySize; i++) {
        if (data[i][i] !== player) {
          flag = false;
          break;
        }
      }
      if (flag) {
        return 1;
      }
      flag = true;
      for (var i = 0; i < arraySize; i++) {
        if (data[i][arraySize - i - 1] !== player) {
          flag = false;
          break;
        }
      }
      if (flag) {
        return 1;
      }
    }

    return moveCount === 1 ? 0 : -1;
  };

  const startGame = () => {
    setisGameStarted(true);
  };
  return (
    <div className="min-h-screen flex bg-slate-900 text-center text-white ">
      <div className="min-h-full w-1/4 bg-gray-900 flex flex-col items-center justify-center py-8 ">
        <h1 className="my-5 text-5xl ">tic-tac-toe</h1>
        <h1 className="my-5">Current Trun : {isMychance ? "O" : "X"}</h1>
        <button
          className="py-3 px-10 rounded-lg mt-3 text-white bg-green-400 disabled:cursor-not-allowed disabled:bg-red-400 disabled:opacity-75"
          disabled={isGameStarted ? true : false}
          onClick={startGame}
        >
          Start
        </button>
        <select
          className="w-28 m-10 text-black"
          onChange={(e: any) => {
            if (!isGameStarted) {
              var size = parseInt(e.target.value);
              setArraySize(size);
              setdata(
                Array.from({ length: size }, () =>
                  Array.from({ length: size }, () => null)
                )
              );
              setmoveCount(size * size);
            } else {
              showAlertPopup("Please finish the game to change Board");
            }
          }}
        >
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>
      <div className="m-auto bg-slate-100 rounded-md p-10">
        {data.map((ele: any, i: any) => (
          <div className="flex" key={i}>
            {ele.map((elej: any, j: any) => (
              <div
                key={i + j}
                className="h-24 w-24 border border-zinc-500 flex items-center justify-center cursor-pointer"
                onClick={() => handleClick(i, j)}
              >
                <h2 className="text-3xl text-black">{elej}</h2>
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
