import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSurveyStore } from "../../store/surveyStore";
import { db } from "../../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import styles from "./VoteList.module.css";
import BackButton from '../../components/Buttons/BackButton/BackButton';

const VoteList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.safeUser;

  const { surveys, subscribeSurveys } = useSurveyStore();

  // Firestore購読開始
  useEffect(() => {
    const unsub = subscribeSurveys();
    return () => unsub();
  }, [subscribeSurveys]);

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>ユーザー情報が見つかりません。Homeに戻ってください。</p>
        <button onClick={() => navigate("/")}>🏠 Homeへ戻る</button>
      </div>
    );
  }

  // アンケート削除処理
  const handleDelete = async (surveyId) => {
    const confirmDelete = window.confirm("本当にこのアンケートを削除しますか？");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "surveys", surveyId));
      alert("アンケートを削除しました");
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>📊 投票アンケート一覧</h1>
        <div className={styles.voteLists}>
          {surveys.map((survey) => (
            <div key={survey.id} className={styles.voteItem}>
              <button
                className={styles.addvoteButton}
                onClick={() =>
                  navigate(`/vote/${survey.id}`, { state: { safeUser: user } })
                }
              >
                📊 {survey.title}
              </button> 
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(survey.id)}
              >
                ✖ 削除
              </button>
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <BackButton/>
          <button
            className={styles.addbutton}
            onClick={() => navigate("/Addpages")}
          >
            アンケート追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteList;
