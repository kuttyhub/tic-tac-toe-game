import { useRecoilValue } from "recoil";
import { gameAtom } from "../../atom/gameAtom";
import style from "../../styles/Board.module.css";
const Board = () => {
  const gameState = useRecoilValue(gameAtom);
  // console.log(gameState);
  return (
    <div className={style.board}>
      {gameState.boardArray.map((row: Array<string | null>, idx: number) => {
        return (
          <div className={style.row} key={idx}>
            {row.map((cell: string | null, idx: number) => {
              return (
                <div className={style.cell} key={idx}>
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
