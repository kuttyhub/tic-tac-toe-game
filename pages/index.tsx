import { NextPage } from "next";
import styles from "../styles/Home.module.css";

const HomePage: NextPage = () => {
  return (
    <div className={styles.container}>
      <h2>Play Tic-Tac-Toe Game with around the world</h2>
      <button>Let's Play</button>
    </div>
  );
};

export default HomePage;
