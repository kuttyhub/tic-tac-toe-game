import { useRecoilValue } from "recoil";
import { gameAtom } from "../../atom/gameAtom";
import { userAtom } from "../../atom/userAtom";
import styles from "../../styles/WaitingScreen.module.css";
const WaitingScreen = () => {
  const userData = useRecoilValue(userAtom);
  const gameState = useRecoilValue(gameAtom);
  return (
    <div className={styles.container}>
      <h3>{userData.name}</h3>
      <br />
      <h6>
        {gameState.roomid} - {gameState.roomtype}
      </h6>
      <h6>Symbol - {gameState.currentPlayerSymbol}</h6>
      <br />
      <p>Waiting for the opponent to join....</p>
    </div>
  );
};

export default WaitingScreen;
