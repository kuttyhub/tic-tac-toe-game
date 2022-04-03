import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { gameAtom } from "../../atom/gameAtom";
import { socketAtom } from "../../atom/socketAtom";
import { userAtom } from "../../atom/userAtom";
import { leaveRoom } from "../../services/gameService";
import styles from "../../styles/WaitingScreen.module.css";

const WaitingScreen = () => {
  const userData = useRecoilValue(userAtom);
  const gameState = useRecoilValue(gameAtom);
  const socket = useRecoilValue(socketAtom);

  const [isLeaving, setIsLeaving] = useState(false);

  const router = useRouter();

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveRoom(socket!, gameState.roomid);
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
    setIsLeaving(false);
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
      <button onClick={handleLeave} disabled={isLeaving}>
        {isLeaving ? "Deleting.." : "Delete Room"}
      </button>
    </div>
  );
};

export default WaitingScreen;
