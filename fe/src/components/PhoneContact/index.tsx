import { Tooltip } from "antd";
import React from "react";
import { useSettings } from "@/contexts/SettingsContext";

interface PhoneContactProps {
  className?: string;
}

const PhoneContact: React.FC<PhoneContactProps> = ({ 
  className
}) => {
  const { settings } = useSettings();

  const handlePhoneClick = () => {
    const phoneNumber = settings?.phone;
    if (phoneNumber) {
      // Tạo link tel: để gọi điện thoại
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Icon điện thoại (đồng nhất kích thước và phong cách với FacebookMessage)
  const PhoneIcon = () => (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="25" fill="#25D366" />
      <path
        d="M34.75 30.75l-3.2 3.2c-.8.8-2.1 1.1-3.2.6c-3-1.1-6.3-4.4-8.1-6.3c-1.8-1.9-4.2-5.3-5.3-8.3c-.4-1.1-.2-2.4.6-3.2l3.2-3.2c.9-.9 2.3-.9 3.2 0l2.1 2.1c.8.8 1.1 2 .6 3.1l-1 2.5c.9 1.6 2.6 3.5 4.2 4.4l2.5-1c1.1-.4 2.3-.2 3.1.6l2.1 2.1c.9.9.9 2.3 0 3.2z"
        fill="#ffffff"
      />
    </svg>
  );

  // Không hiển thị nếu không có số điện thoại
  if (!settings?.phone) {
    return null;
  }

  return (
    <Tooltip title={`Gọi điện: ${settings.phone}`}>
      <div
        onClick={handlePhoneClick}
        className={className}
        style={{
          position: "fixed",
          bottom: "90px", // đặt ngay trên nút Cài đặt
          right: "20px",
          zIndex: 2000, // trên các nút khác
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
        <PhoneIcon />
      </div>
    </Tooltip>
  );
};

export default PhoneContact;
