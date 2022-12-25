import Lottie from "lottie-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { gameAtom } from "../atom/gameAtom";
import { socketAtom } from "../atom/socketAtom";
import { userAtom } from "../atom/userAtom";
import { leaveRoom } from "../services/gameService";

import searchingOwl from "../public/lottie/searching-floating-hand.json";

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
    <div className="waiting-popup">
      <h2>Waiting for the opponent</h2>
      <br />
      <Lottie
        animationData={searchingOwl}
        style={{ height: 250, width: 250 }}
        autoPlay
        loop
      />
      <h3>{userData.name}</h3>
      <h5>
        {gameState.roomid} - {gameState.roomtype}
      </h5>
      <button onClick={handleLeave} disabled={isLeaving}>
        {isLeaving ? "Deleting.." : "Delete Room"}
      </button>
    </div>
  );
};

export default WaitingScreen;
