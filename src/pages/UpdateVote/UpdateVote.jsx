import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./UpdateVote.module.css"; // Addpages の CSS を流用
import BackButton from '../../components/Buttons/BackButton/BackButton';

const EditSurvey = () => {
  const { id } = useParams(); // 編集対象アンケートID
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
  const fetchSurvey = async () => {
    const docRef = doc(db, "surveys", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setTitle(data.title);
      setOptions(data.options.map(opt => opt.label));
    }
  };
  fetchSurvey();
}, [id]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleUpdateSurvey = async () => {
    if (!title.trim()) return alert("タイトルを入力してください");
    const filteredOptions = options.filter(opt => opt.trim() !== "");
    if (filteredOptions.length < 2) return alert("選択肢は最低2つ必要です");

    const docRef = doc(db, "surveys", id);
    await updateDoc(docRef, {
      title,
      options: filteredOptions.map((opt, idx) => ({ id: `opt${idx}`, label: opt }))
    });

    alert("アンケートを更新しました！");
    navigate(`/vote/${id}`);
  };

  return (
    <div className={styles.container}>
    <div className={styles.card}>
      <h1 className={styles.title}>アンケート編集</h1>

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
          <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <input
              className={styles.input}
              type="text"
              placeholder={`選択肢 ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
            <button
              style={{ marginLeft: "5px" }}
              onClick={() => handleDeleteOption(idx)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button className={styles.button} onClick={handleAddOption}>＋ 選択肢を追加</button>

      <div className={styles.buttons} style={{ marginTop: "10px" }}>
        <button className={styles.button} onClick={handleUpdateSurvey}>更新</button>
        <BackButton/>
      </div>

    </div>
    </div>
  );
};

export default EditSurvey;
