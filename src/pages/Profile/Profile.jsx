import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.safeUser;

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>ユーザー情報が見つかりません。Homeに戻ってください。</p>
        <button onClick={() => navigate("/")}>🏠 Homeへ戻る</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>👤 プロフィール</h1>
        <img
          src={user.photoURL}
          alt="Profile"
          className={styles.avatar}
        />
        <p><strong>名前：</strong>{user.displayName}</p>
        <p><strong>メール：</strong>{user.email}</p>
        <button
          className={styles.homeButton}
          onClick={() => navigate("/")}
        >
          🔙 Homeへ戻る
        </button>
      <button
        className={styles.votePageButton}
        onClick={() => navigate("/vote", { state: { safeUser: user } })}
      >
          📊 投票ページへ
      </button>
      </div>
    </div>
  );
};

export default Profile;
