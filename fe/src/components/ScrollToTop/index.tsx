import { UpOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState, useEffect } from "react";

interface ScrollToTopProps {
  className?: string;
  showAfter?: number; // Số pixel scroll để hiển thị button
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
  className,
  showAfter = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Theo dõi scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Tooltip title="Cuộn lên đầu trang">
      <Button
        type="primary"
        shape="circle"
        icon={<UpOutlined />}
        onClick={scrollToTop}
        className={className}
        style={{
          position: "fixed",
          bottom: "300px", // cao nhất trong cột
          right: "20px",
          zIndex: 1000, // cùng z-index với các nút khác
          width: "50px",
          height: "50px",
          fontSize: "18px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#52c41a", // Màu xanh lá đẹp
          borderColor: "#52c41a",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#73d13d";
          e.currentTarget.style.borderColor = "#73d13d";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#52c41a";
          e.currentTarget.style.borderColor = "#52c41a";
          e.currentTarget.style.transform = "scale(1)";
        }}
      />
    </Tooltip>
  );
};

export default ScrollToTop;
