import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, MouseEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom, UserInterface } from "../atom/userAtom";
import styles from "../styles/Home.module.css";

const HomePage: NextPage = () => {
  const [popupVisiblity, setPopupVisiblity] = useState(false);
  const router = useRouter();
  const handleClick = (value: boolean) => {
    setPopupVisiblity(value);
  };
  const setUserData = useSetRecoilState(userAtom);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    var data: UserInterface = {
      name: e.target[0].value,
      boradPreference: e.target[1].value,
    };
    setUserData(data);

    router.push("/playground");
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
      {popupVisiblity && (
        <div className={styles.popup}>
          <h3>Let's Start</h3>
          <form action="" onSubmit={handleFormSubmit}>
            <label htmlFor="username">What would you like to Call :</label>
            <input type="text" name="username" placeholder="name" required />
            <label htmlFor="board-size">Select Board Size :</label>
            <select name="board-size">
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <button type="submit">Play</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
