import { NextPage } from "next";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { socketAtom } from "../atom/socketAtom";
import SocketService from "../services/socketService";
import styles from "../styles/Home.module.css";
import PopupForm from "./popupForm";

const HomePage: NextPage = () => {
  const [popupVisiblity, setPopupVisiblity] = useState(false);
  const [socketState, setSocketState] = useRecoilState(socketAtom);
  const handleClick = (value: boolean) => {
    setPopupVisiblity(value);
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    SocketService()
      .then((socket) => setSocketState(socket))
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <h2>Play Tic-Tac-Toe Game with around the world</h2>
      <button onClick={(e: MouseEvent) => handleClick(true)}>Let's Play</button>
      {popupVisiblity && (
        <div
          className={styles.overlay}
          onClick={(e: MouseEvent) => handleClick(false)}
        ></div>
      )}
      {popupVisiblity && <PopupForm />}
    </div>
  );
};

export default HomePage;
