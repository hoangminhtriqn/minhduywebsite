import React from "react";
import { Pagination as AntPagination } from "antd";
import styles from "./styles.module.scss";

interface CustomPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize?: number) => void;
  pageSizeOptions?: string[];
  className?: string;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions = ["12", "24", "48", "96"],
  className,
}) => {
  // Detect mobile screen size
  const isSmallMobile = window.innerWidth <= 480;

  // Mobile-specific pagination settings
  const mobileSettings = {
    size: (isSmallMobile ? "small" : "default") as "small" | "default",
    showSizeChanger: false, // Disable on mobile for better UX
    showQuickJumper: false, // Disable on mobile for better UX
    showLessItems: isSmallMobile, // Show fewer items on very small screens
  };

  return (
    <div className={`${styles.customPagination} ${className || ""}`}>
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        showQuickJumper={false}
        pageSizeOptions={pageSizeOptions}
        className={styles.pagination}
        size={mobileSettings.size}
        showLessItems={mobileSettings.showLessItems}
      />
    </div>
  );
};

export default CustomPagination;
