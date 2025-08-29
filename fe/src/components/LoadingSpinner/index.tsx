import React from "react";
import { Spin } from "antd";
import styles from "./styles.module.scss";

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;
