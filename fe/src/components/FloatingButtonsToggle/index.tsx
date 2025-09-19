import React, { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useTheme } from "@/contexts/ThemeContext";

interface FloatingButtonsToggleProps {
  children: React.ReactNode;
}

const FloatingButtonsToggle: React.FC<FloatingButtonsToggleProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  // Thêm style animation cho từng child
  const animatedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement, {
        style: {
          ...(child.props.style || {}),
          transform: isVisible ? "translateX(0) scale(1)" : "translateX(100px) scale(0.8)",
          opacity: isVisible ? 1 : 0,
          transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
        },
      });
    }
    return child;
  });

  const toggleButtonStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "10px", // Góc dưới
    right: isVisible ? "0" : "-1px", // Thụt vào khi ẩn
    zIndex: 1001,
    width: "15px", // Siêu mỏng
    height: "40px", // Nhỏ hơn
    borderRadius: "6px 0 0 6px", // Bo góc trái nhỏ hơn
    backgroundColor: theme.colors.palette.primary + '99', // 60% opacity
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "-2px 0 6px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    fontSize: "8px", // Font size siêu nhỏ
  };

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    right: 0,
    zIndex: 1000,
    transform: isVisible ? "translateX(0)" : "translateX(80px)",
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? "visible" : "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: isVisible ? "auto" : "none",
  };

  return (
    <>
      {/* Toggle button */}
      <Tooltip 
        title={isVisible ? "Ẩn menu nhanh" : "Hiện menu nhanh"}
        placement="left"
        overlayStyle={{ 
          fontSize: '12px',
          maxWidth: '150px'
        }}
        mouseEnterDelay={0.2}
        color={theme.colors.palette.primary}
      >
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={toggleButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = "20px";
            e.currentTarget.style.backgroundColor = theme.colors.palette.primary;
            e.currentTarget.style.boxShadow = "-4px 0 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = "15px";
            e.currentTarget.style.backgroundColor = theme.colors.palette.primary + '99';
            e.currentTarget.style.boxShadow = "-2px 0 6px rgba(0, 0, 0, 0.08)";
          }}
        >
          {isVisible ? <RightOutlined /> : <LeftOutlined />}
        </button>
      </Tooltip>

      {/* Floating buttons container */}
      <div style={containerStyle}>
        {animatedChildren}
      </div>
    </>
  );
};

export default FloatingButtonsToggle;
