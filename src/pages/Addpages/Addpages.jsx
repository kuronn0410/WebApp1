import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./Addpages.module.css";
import BackButton from '../../components/Buttons/BackButton/BackButton';

const Addpages = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]); // 最低2つの選択肢
  const navigate = useNavigate();

  // 選択肢の変更
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // 新しい選択肢を追加
  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleAddSurvey = async () => {
    if (!title.trim()) return;
    const filteredOptions = options.filter((opt) => opt.trim() !== "");
    if (filteredOptions.length < 2) {
      return alert("選択肢は最低2つ必要です");
    }

    await addDoc(collection(db, "surveys"), {
      title,
      options: filteredOptions.map((opt, idx) => ({ id: `opt${idx}`, label: opt })),
      createdAt: new Date()
    });

    setTitle("");
    setOptions(["", ""]);
  };

  return (
    <div className={styles.container}>
    <div className={styles.card}>
      <h1 className={styles.title}>アンケート追加</h1>

      <input
        className={styles.input}
        type="text"
        placeholder="アンケートタイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <h3>選択肢</h3>
      <div className={styles.addop}>
      {options.map((opt, idx) => (
        <input
          key={idx}
          className={styles.input}
          type="text"
          placeholder={`選択肢 ${idx + 1}`}
          value={opt}
          onChange={(e) => handleOptionChange(idx, e.target.value)}
        />
      ))}
      </div>
      <button className={styles.button} onClick={handleAddOption}>＋ 選択肢を追加</button>

      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleAddSurvey}>作成</button>
        <BackButton/>
      </div>
    </div>
  </div>
  );
};

export default Addpages;
