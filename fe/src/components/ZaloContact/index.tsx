import { Tooltip } from "antd";
import React from "react";
import { useSettings } from "@/contexts/SettingsContext";

interface ZaloContactProps {
  className?: string;
}

const ZaloContact: React.FC<ZaloContactProps> = ({ 
  className
}) => {
  const { settings } = useSettings();

  const handleZaloClick = () => {
    const zaloUrl = settings?.zaloUrl;
    window.open(zaloUrl, "_blank", "noopener,noreferrer");
  };

  // Icon Zalo chính thức từ Wikimedia Commons
  const ZaloIcon = () => (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png"
      alt="Zalo"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover"
      }}
    />
  );

  return (
    <Tooltip title="Liên hệ qua Zalo">
      <div
        onClick={handleZaloClick}
        className={className}
        style={{
          position: "fixed",
          bottom: "160px", // ngay trên PhoneContact
          right: "20px",
          zIndex: 1000,
          width: "50px",
          height: "50px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <ZaloIcon />
      </div>
    </Tooltip>
  );
};

export default ZaloContact;