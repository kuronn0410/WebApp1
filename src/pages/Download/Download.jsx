import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";//pdf用
import html2canvas from "html2canvas";//日本語対応してないから画像化
import styles from "./Download.module.css";
import BackButton from "../../components/Buttons/BackButton/BackButton";

const Download = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results || {};

  // PDF出力処理
  const handleDownloadPDF = async () => {
    const element = document.getElementById("pdfContent");
    if (!element) return;
    //日本語対応してないから画像化
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("vote.pdf");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>📥 ファイルダウンロード</h1>
        <p>投票結果を PDF にまとめて何回でもダウンロードできます。</p>

        {/* PDFに変換する対象エリア */}
        <div id="pdfContent" className={styles.pdfContent}>
          <h2>投票結果</h2>
          <ul>
            {Object.entries(results).map(([option, count]) => (
              <li key={option}>
                {option}：{count}票
              </li>
            ))}
          </ul>
        </div>
        <BackButton/>
        <button
          className={styles.downloadButton}
          onClick={handleDownloadPDF}
        >
          📄 投票結果 PDF をダウンロード
        </button>
        
      </div>
    </div>
  );
};

export default Download;
