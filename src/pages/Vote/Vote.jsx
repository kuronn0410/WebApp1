import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig"; // Firestoreインスタンス
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot
} from "firebase/firestore";
import styles from "./Vote.module.css";

const options = [
  { id: "coffee", label: "コーヒー" },
  { id: "tea", label: "紅茶" },
  { id: "water", label: "水" }
];

const Vote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.safeUser;

  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState({});

  // 初期読み込み & リアルタイム集計購読
  useEffect(() => {
    if (!user) return;

    // 自分が投票済みか確認（localStorageで1人1票制御）
    const savedVote = localStorage.getItem(`vote_${user.email}`);
    if (savedVote) {
      setSelectedOption(savedVote);
      setHasVoted(true);
    }

    // Firestoreのvotesコレクションをリアルタイム購読
    const unsubscribe = onSnapshot(collection(db, "votes"), (snapshot) => {
      const data = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data().count || 0;
      });
      setResults(data);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>ユーザー情報が見つかりません。Homeに戻ってください。</p>
        <button onClick={() => navigate("/")}>🏠 Homeへ戻る</button>
      </div>
    );
  }

  const handleVote = async () => {
    if (!selectedOption) return alert("選択してください！");

    try {
      const voteRef = doc(db, "votes", selectedOption);

      // ドキュメントが存在しなければ作成
      const docSnap = await getDoc(voteRef);
      if (!docSnap.exists()) {
        await setDoc(voteRef, { count: 1 });
      } else {
        // 存在すればcountを+1
        await updateDoc(voteRef, {
          count: increment(1)
        });
      }

      // ローカルに投票記録
      localStorage.setItem(`vote_${user.email}`, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error("投票エラー:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>📊 投票アンケート</h1>
        <p>あなたの好きな飲み物は？</p>

        {hasVoted ? (
          <div className={styles.result}>
            <p>✅ あなたは「{options.find(o => o.id === selectedOption)?.label}」に投票しました。</p>
          </div>
        ) : (
          <>
            {options.map((opt) => (
              <label key={opt.id}>
                <input
                  type="radio"
                  value={opt.id}
                  checked={selectedOption === opt.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                {opt.label}
              </label>
            ))}
            <br />
            <button onClick={handleVote}>送信</button>
          </>
        )}

        {/* 集計結果 */}
        <div className={styles.tally}>
          <h3>📈 現在の集計結果</h3>
          <ul>
            {options.map((opt) => (
              <li key={opt.id}>
                {opt.label}: {results[opt.id] || 0}票
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => navigate(-1)}>🔙 戻る</button>
        <button
          className={styles.downloadPageButton}
          onClick={() => navigate("/download")}
        >
          📥 ダウンロードページへ
        </button>
      </div>
    </div>
  );
};

export default Vote;
