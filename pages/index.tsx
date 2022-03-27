import { NextPage } from "next";
import { MouseEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import PopupForm from "./popupForm";

const HomePage: NextPage = () => {
  const [popupVisiblity, setPopupVisiblity] = useState(false);

  const handleClick = (value: boolean) => {
    setPopupVisiblity(value);
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
