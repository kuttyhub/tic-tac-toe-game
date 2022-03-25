import { NextPage } from "next";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { gameAtom } from "../../atom/gameAtom";
import { userAtom } from "../../atom/userAtom";
import { io } from "socket.io-client";

const PlayGround: NextPage = () => {
  useEffect(() => {
    socketInitializer();
  }, []);
  const socketInitializer = async () => {
    await fetch("/api/socket");
    var socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
  };

  const userData = useRecoilValue(userAtom);
  const gameState = useRecoilValue(gameAtom);
  return (
    <div>
      <p>
        {userData.name}
        {userData.boradPreference}
      </p>
      <p>{gameState.currentPlayer}</p>
      <p>{gameState.boardArray}</p>
    </div>
  );
};

export default PlayGround;
