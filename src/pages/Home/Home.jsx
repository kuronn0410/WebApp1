import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../../firebase/auth/login";
import { signUpWithGoogle } from "../../firebase/auth/signup";
import styles from "./Home.module.css";

function Home() {
    const navigate = useNavigate();
    const nameRef = useRef(null);

    const startGame = () => {
        const playerName = nameRef.current.value;
        if (!playerName) {
            alert("名前を入力してください！");
            return;
        }
        alert(`${playerName} さん、ゲームを開始します！`);
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await loginWithGoogle();
            alert(`Googleログイン成功: ${user.displayName}`);
            console.log("ユーザー情報:", user);

            const safeUser = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
            };
            navigate("/profile", { state: { safeUser } });
        } catch (error) {
            alert(`Googleログイン失敗: ${error.message}`);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const user = await signUpWithGoogle();
            alert(`Googleサインアップ成功: ${user.displayName}`);
            console.log("ユーザー情報:", user);

            const safeUser = {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
            };
            navigate("/profile", { state: { safeUser } });
        } catch (error) {
            alert(`Googleサインアップ失敗: ${error.message}`);
        }
    };

    return (
        <div className={styles.homeContainer}>
            <div className={styles.card}>
                <h1 className={styles.title}></h1>
                <p className={styles.subtitle}></p>

                <div className={styles.inputGroup}>
                    <label htmlFor="playerName">名前</label>
                    <input
                        id="playerName"
                        type="text"
                        placeholder="名前を入力"
                        ref={nameRef}
                    />
                </div>

                <button className={`${styles.button} ${styles.start}`} onClick={startGame}>
                    スタート
                </button>

                <button className={`${styles.button} ${styles.googleLogin}`} onClick={handleGoogleLogin}>
                    🔑 Googleでログイン
                </button>

                <button className={`${styles.button} ${styles.googleSignup}`} onClick={handleGoogleSignUp}>
                    ✨ Googleでサインアップ
                </button>
            </div>
        </div>
    );
}

export default Home;
