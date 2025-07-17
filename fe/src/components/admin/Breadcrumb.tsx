import React from "react";
import { Typography, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./Breadcrumb.module.scss";

const { Title } = Typography;

interface BreadcrumbProps {
  title: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  title,
  showAddButton = false,
  addButtonText = "Thêm mới",
  onAddClick,
}) => {
  return (
    <div className={styles.breadcrumb}>
      <Title level={2} className={styles.title}>
        {title}
      </Title>
      {showAddButton && onAddClick && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddClick}
          className={styles.addButton}
        >
          {addButtonText}
        </Button>
      )}
    </div>
  );
};

export default Breadcrumb;
