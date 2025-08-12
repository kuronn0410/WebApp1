import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Download.module.css";

const Download = () => {
    const navigate = useNavigate();
    const [isDownloaded, setIsDownloaded] = useState(false);

    // 初回レンダリング時にlocalStorageから状態を取得
    useEffect(() => {
        const downloadedFlag = localStorage.getItem("sampleDownloaded") === "true";
        setIsDownloaded(downloadedFlag);
    }, []);

    const handleDownload = () => {
        // ダウンロードフラグを保存
        localStorage.setItem("sampleDownloaded", "true");
        setIsDownloaded(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>📥 ファイルダウンロード</h1>
                <p>以下のファイルをダウンロードできます。</p>

                {/* publicフォルダ内のsample.pdfをダウンロード */}
                <a
                    href="/sample.pdf"
                    download
                    className={`${styles.downloadButton} ${isDownloaded ? styles.downloaded : ""}`}
                    onClick={handleDownload}
                >
                    📄 sample.pdf をダウンロード
                </a>

                {/* ダウンロード済みなら表示 */}
                {isDownloaded && (
                    <p className={styles.doneMessage}>✅ ダウンロード済み</p>
                )}

                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    🔙 戻る
                </button>
            </div>
        </div>
    );
};

export default Download;
