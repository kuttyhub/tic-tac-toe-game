import { NextPage } from "next";
import Head from "next/head";
import { MouseEvent, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { socketAtom } from "../atom/socketAtom";
import SocketService from "../services/socketService";
import PopupForm from "../components/PopupForm";

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
    <>
      <Head>
        <title>Multiplayer | Tic-Tac-Toe</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="home-page">
        <h1>Play Tic-Tac-Toe Game with around the world</h1>
        <br />
        <button onClick={(e: MouseEvent) => handleClick(true)}>
          {"Let's Play"}
        </button>
        {popupVisiblity && (
          <div
            className="overlay"
            onClick={(e: MouseEvent) => handleClick(false)}
          ></div>
        )}
        {popupVisiblity && <PopupForm />}
        <div className="developer-info">
          <p>
            {"desinged & developed"}
            <br />
            by{" "}
            <a href="https://www.nishanths.me" target="_blank" rel="noreferrer">
              Nishanth S
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
