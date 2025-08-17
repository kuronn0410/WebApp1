import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import BackButton from '../../components/Buttons/BackButton/BackButton';
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

const Vote = () => {
  const { id } = useParams(); // アンケートIDの受け取り
  //受け取り
  const location = useLocation();
  const user = location.state?.safeUser;

  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  //ユーザーが投票フォームで選んだ 選択肢（ラジオボタンの値） を保持。
  const [selectedOption, setSelectedOption] = useState("");
  //すでに投票したかどうか を保持。(true) にする。
  const [hasVoted, setHasVoted] = useState(false);
  //投票の 集計結果（選択肢ごとの票数） を保持。
  const [results, setResults] = useState({});

  // アンケート取得 & リアルタイム集計購読
  //ずっと行われている
  useEffect(() => {
    if (!user) return;

    const fetchSurvey = async () => {
      //受け取ったIDのsurveysを参照する
      const docRef = doc(db, "surveys", id);
      //参照したものの中身を受け取れる
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //「タイトル」「選択肢」
        setSurvey(docSnap.data());
        //votesから参照して受け取る
        const votesSnap = await getDoc(doc(db, "votes", id));

        setResults(
          //if文みたいなもん ?true：false
          votesSnap.exists() 
          ? votesSnap.data().count || {} 
          : {});
      }
    };
    fetchSurvey();

    // 自分が投票済みか確認
    //ブラウザのローカルストレージに保存してある値を取得。
    const savedVote = localStorage.getItem(`vote_${user.email}_${id}`);
    //もし値があるなら
    if (savedVote) {
      //投票済み」と認識できる。
      setHasVoted(true);
      //投票した内容
      setSelectedOption(savedVote);
    }

    // リアルタイム購読
    //onSnapshot(doc(db, "votes", id), 自動で呼ばれる)
    const unsubscribe = onSnapshot(doc(db, "votes", id), (docSnap) => {
      if (docSnap.exists()) {
        setResults(docSnap.data().count || {});
      }
    });

    return () => unsubscribe();
  }, [id, user]);

  const handleVote = async () => {
    if (!selectedOption) return alert("選択してください！");

    try {
      const voteRef = doc(db, "votes", id);

      // 前回の投票を取得
      const prevVote = localStorage.getItem(`vote_${user.email}_${id}`);

      if (!prevVote) {
        // 初回投票
        const docSnap = await getDoc(voteRef);
        if (!docSnap.exists()) {
          await setDoc(voteRef, { count: { [selectedOption]: 1 } });
        } else {
          await updateDoc(voteRef, {
            [`count.${selectedOption}`]: increment(1),
          });
        }
      } else if (prevVote !== selectedOption) {
        // 前回の票を取り消し & 新しい票を加算
        await updateDoc(voteRef, {
          [`count.${prevVote}`]: increment(-1),
          [`count.${selectedOption}`]: increment(1),
        });
      }

      // 保存して状態更新
      localStorage.setItem(`vote_${user.email}_${id}`, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error("投票エラー:", error);
    }
  };

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>ユーザー情報が見つかりません。Homeに戻ってください。</p>
        <button onClick={() => navigate("/")}>🏠 Homeへ戻る</button>
      </div>
    );
  }

  if (!survey) return <p>アンケートを読み込み中...</p>;

  return (
    
    <div className={styles.container}>
      {/* ここはコメントです */}
      <div className={styles.card}>
        <h1>📊 {survey.title}</h1>
      {/*if文みたいなもん　?():() */}
        {hasVoted ? (
          <div className={styles.result}>
            
            <p>
              ✅ あなたは「
              {localStorage.getItem(`vote_${user.email}_${id}`)}
              」に投票しました。
            </p>

            <div className={styles.revote}>
              <h4>🔄 投票を変更する</h4>
              {/* コンポーネントにする */}
              {survey.options.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    value={opt.label}
                    checked={selectedOption === opt.label}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  {opt.label}
                </label>
              ))}
              <br />
              <button onClick={handleVote}>変更を確定する</button>
            </div>
          </div>
        ) : (
          <>
          
            {survey.options.map((opt) => (
              <label key={opt.id}>
                <input
                  type="radio"
                  value={opt.label}
                  checked={selectedOption === opt.label}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                {opt.label}
              </label>
            ))}
            <br />
            <button onClick={handleVote}>投票する</button>
          </>
        )}

        <div className={styles.tally}>
          <h3>📈 現在の集計結果</h3>
          <ul>
            {survey.options.map((opt) => (
              <li key={opt.id}>
                {opt.label}: {results[opt.label] || 0}票
              </li>
            ))}
          </ul>
          {survey && (
          <button
              className={styles.UpdateVoteButton}
              onClick={() => navigate(`/UpdateVote/${id}`)}
            >
              ✏️ アンケート修正
          </button>
          )}
        </div>
        <BackButton/>
        <button
          className={styles.downloadButton}
          onClick={() =>
            navigate("/download", {
              state: { results, surveyTitle: survey.title },
            })
          }
        >
          📄 投票結果 PDF をダウンロード
        </button>
        
      </div>
      
    </div>
  );
};

export default Vote;
