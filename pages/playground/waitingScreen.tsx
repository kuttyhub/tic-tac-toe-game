import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { gameAtom } from "../../atom/gameAtom";
import { socketAtom } from "../../atom/socketAtom";
import { userAtom } from "../../atom/userAtom";
import styles from "../../styles/WaitingScreen.module.css";
import { socketTerms } from "../../utils/constants";
const WaitingScreen = () => {
  const userData = useRecoilValue(userAtom);
  const gameState = useRecoilValue(gameAtom);
  const socket = useRecoilValue(socketAtom);

  const router = useRouter();
  const handleLeave = () => {
    socket!.emit(socketTerms.deleteRoom, { roomid: gameState.roomid });
    router.replace("/");
  };
  return (
    <div className={styles.container}>
      <h3>{userData.name}</h3>
      <br />
      <h5>
        {gameState.roomid} - {gameState.roomtype}
      </h5>
      <h5>Symbol - {gameState.currentPlayerSymbol}</h5>
      <br />
      <p>Waiting for the opponent to join....</p>
      <br />
      <button onClick={handleLeave}>Delete Room</button>
    </div>
  );
};

export default WaitingScreen;
