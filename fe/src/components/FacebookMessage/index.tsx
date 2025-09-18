import { Tooltip } from "antd";
import React from "react";
import { useSettings } from "@/contexts/SettingsContext";

interface FacebookMessageProps {
  className?: string;
}

const FacebookMessage: React.FC<FacebookMessageProps> = ({ 
  className
}) => {
  const { settings } = useSettings();

  const handleFacebookClick = () => {
    const facebookMessengerUrl = settings?.facebookMessengerUrl;
    window.open(facebookMessengerUrl, "_blank", "noopener,noreferrer");
  };

  // Icon Facebook Messenger chính thức
  const FacebookIcon = () => (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="25" fill="#0084FF"/>
      <path
        d="M25 10C16.7 10 10 16.2 10 24C10 28.4 12.1 32.3 15.5 34.8V40L20.4 37.3C22.2 37.8 24.1 38 25 38C33.3 38 40 31.8 40 24C40 16.2 33.3 10 25 10ZM27.5 28.5L22.4 23L12.5 28.5L23.6 16.5L28.7 22L38.6 16.5L27.5 28.5Z"
        fill="white"
      />
    </svg>
  );

  return (
    <Tooltip title="Nhắn tin qua Facebook">
      <div
        onClick={handleFacebookClick}
        className={className}
        style={{
          position: "fixed",
          bottom: "230px", // trên ZaloContact
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
        <FacebookIcon />
      </div>
    </Tooltip>
  );
};

export default FacebookMessage;