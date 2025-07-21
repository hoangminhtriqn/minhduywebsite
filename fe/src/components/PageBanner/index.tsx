import React from "react";
import { Typography } from "antd";
import { useTheme } from "@/contexts/ThemeContext";
import styles from "./styles.module.scss";

const { Title, Text } = Typography;

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={styles.pageBanner}
      style={{
        background: backgroundImage
          ? `linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url(${backgroundImage})`
          : `linear-gradient(135deg, ${theme.colors.palette.primary} 0%, ${theme.colors.palette.primaryDark} 100%)`,
      }}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <Title level={1} className={styles.title} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        </div>
      </div>
      <div className={styles.overlay} />
    </div>
  );
};

export default PageBanner;
