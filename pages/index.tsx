import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [data, setdata] = useState(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
  );
  const [isMychance, setisMychance] = useState(true);
  const [isGameStarted, setisGameStarted] = useState(false);
  const [moveCount, setmoveCount] = useState(9);

  const handleClick = (i: any, j: any) => {
    setmoveCount(moveCount - 1);
    // console.log(i, j);

    if (moveCount === -1) {
      setisGameStarted(false);
      setmoveCount(9);
      alert("game ended");
      setdata(
        Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null))
      );
      setisMychance(true);
      return;
    }
    if (!data[i][j] && isGameStarted) {
      let temp = [...data];
      temp[i][j] = isMychance ? "O" : "X";
      setdata(temp);
      setisMychance(!isMychance);
    } else {
      !isGameStarted ? alert("please start the game") : alert("already filled");
    }
    // console.log(data);
  };

  // const checkWinner=(i:any,j:any)=>{
  //   if ((data[i][j] === data[i+1][j] && data[i][j]===data[i+2]))

  // }

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
    </div>
  );
};

export default Home;
