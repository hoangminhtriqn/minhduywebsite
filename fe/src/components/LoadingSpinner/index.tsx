import React from "react";
import styles from "./styles.module.scss";

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Đang tải...</p>
    </div>
  );
};

export default LoadingSpinner;
