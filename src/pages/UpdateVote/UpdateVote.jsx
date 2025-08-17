import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./UpdateVote.module.css"; // Addpages の CSS を流用
import BackButton from '../../components/Buttons/BackButton/BackButton';

const EditSurvey = () => {
  const { id } = useParams(); // URLパラメータから編集対象アンケートIDを取得
  const navigate = useNavigate(); // ページ遷移用フック

  // タイトルと選択肢を管理する state
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);

  // 初期データを Firestore から取得
  useEffect(() => {
    const fetchSurvey = async () => {
      const docRef = doc(db, "surveys", id); // 該当アンケートのドキュメント参照
      const docSnap = await getDoc(docRef); // ドキュメント取得
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title); // 取得したタイトルを state にセット
        setOptions(data.options.map(opt => opt.label)); // 選択肢ラベルだけ抽出して state にセット
      }
    };
    fetchSurvey();
  }, [id]);

  // 選択肢の内容が変更されたときに state を更新
  const handleOptionChange = (index, value) => {
    const newOptions = [...options]; // 配列をコピー
    newOptions[index] = value; // 指定インデックスを更新
    setOptions(newOptions); // state 更新
  };

  // 選択肢を追加
  const handleAddOption = () => {
    setOptions([...options, ""]); // 空文字の選択肢を末尾に追加
  };

  // 選択肢を削除
  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1); // 指定インデックスを削除
    setOptions(newOptions);
  };

  // アンケートを Firestore に更新
  const handleUpdateSurvey = async () => {
    if (!title.trim()) return alert("タイトルを入力してください"); // タイトル未入力チェック
    const filteredOptions = options.filter(opt => opt.trim() !== ""); // 空の選択肢を除外
    if (filteredOptions.length < 2) return alert("選択肢は最低2つ必要です"); // 選択肢チェック

    const docRef = doc(db, "surveys", id); // 更新対象ドキュメント
    await updateDoc(docRef, {
      title, // 新しいタイトル
      options: filteredOptions.map((opt, idx) => ({ id: `opt${idx}`, label: opt })) // 選択肢を id と label 形式で保存
    });

    alert("アンケートを更新しました！");
    navigate(`/vote/${id}`); // 更新後、編集対象の投票ページに遷移
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>アンケート編集</h1>

        {/* アンケートタイトル入力 */}
        <input
          className={styles.input}
          type="text"
          placeholder="アンケートタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // 入力時に state を更新
        />

        <h3>選択肢</h3>
        <div className={styles.addop}>
          {/* 選択肢リストのレンダリング */}
          {options.map((opt, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <input
                className={styles.input}
                type="text"
                placeholder={`選択肢 ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)} // 選択肢変更時に state 更新
              />
              {/* 選択肢削除ボタン */}
              <button
                style={{ marginLeft: "5px" }}
                onClick={() => handleDeleteOption(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* 選択肢追加ボタン */}
        <button className={styles.button} onClick={handleAddOption}>＋ 選択肢を追加</button>

        <div className={styles.buttons} style={{ marginTop: "10px" }}>
          {/* 更新ボタン */}
          <button className={styles.button} onClick={handleUpdateSurvey}>更新</button>
          {/* 戻るボタン */}
          <BackButton/>
        </div>
      </div>
    </div>
  );
};

export default EditSurvey;
