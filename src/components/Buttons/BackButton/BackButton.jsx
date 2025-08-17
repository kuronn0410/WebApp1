import React from 'react';
import styles from './BackButton.module.css';
import { useNavigate } from "react-router-dom";

export default function BackButton({}) {
  const navigate = useNavigate();
  return (
    <button
       className={styles.backbutton}
       onClick={() => navigate(-1)}
    >
        🔙 戻る
    </button>
  );
}