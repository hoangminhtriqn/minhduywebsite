import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/utils/constant";
import styles from "./styles.module.scss";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTERS.USER.HOME);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.errorCode}>404</div>
        <div className={styles.errorTitle}>Trang không tồn tại</div>
        <div className={styles.errorMessage}>
          Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
        </div>
        <div className={styles.actionButtons}>
          <Button
            type="primary"
            onClick={handleGoHome}
            className={styles.primaryButton}
          >
            Về trang chủ
          </Button>
          <Button onClick={handleGoBack} className={styles.secondaryButton}>
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
