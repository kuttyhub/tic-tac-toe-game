import { NextPage } from "next";
import Head from "next/head";
import { MouseEvent, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { socketAtom } from "../atom/socketAtom";
import SocketService from "../services/socketService";
import styles from "../styles/Home.module.css";
import PopupForm from "./popupForm";

const HomePage: NextPage = () => {
  const [popupVisiblity, setPopupVisiblity] = useState(false);
  const setSocketState = useSetRecoilState(socketAtom);
  const handleClick = (value: boolean) => {
    setPopupVisiblity(value);
  };
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    SocketService()
      .then((socket) => {
        setSocketState(socket);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Multiplayer | Tic-Tac-Toe`</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h2>Play Tic-Tac-Toe Game with around the world</h2>
      <br />
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
