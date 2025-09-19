import { Tooltip } from "antd";
import React from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/contexts/ThemeContext";

interface PhoneContactProps {
  className?: string;
}

const PhoneContact: React.FC<PhoneContactProps> = ({ 
  className
}) => {
  const { settings } = useSettings();
  const { theme } = useTheme();

  // Lấy số điện thoại chính: chỉ dùng phones + primaryPhoneIndex; fallback duy nhất: phone
  const primaryPhone = (() => {
    const phones = Array.isArray(settings?.phones)
      ? (settings?.phones as string[]).filter((p) => typeof p === 'string' && p.trim() !== '')
      : [];
    if (phones.length > 0) {
      const rawIdx = settings?.primaryPhoneIndex as number | string | undefined;
      const idxNum = Number(rawIdx);
      const idx = Number.isFinite(idxNum) ? idxNum : 0;
      const safeIdx = Math.max(0, Math.min(idx, phones.length - 1));
      return phones[safeIdx] as string;
    }
    // Fallback mềm: dùng field phone (legacy)
    return (settings?.phone as string | undefined) || undefined;
  })();

  const handlePhoneClick = (phoneNumber: string) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleMainClick = () => {
    if (primaryPhone) {
      handlePhoneClick(primaryPhone);
    }
  };

  // Icon điện thoại chuyên nghiệp với màu theme
  const PhoneIcon = ({ isSecondary = false }: { isSecondary?: boolean }) => {
    return (
      <svg
        width={isSecondary ? "40" : "50"}
        height={isSecondary ? "40" : "50"}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Styles for animation */}
        <style>
          {`
            @keyframes gentle-blink {
              0%, 100% {
                opacity: ${isSecondary ? 0.2 : 0.3};
              }
              50% {
                opacity: ${isSecondary ? 0.6 : 0.8};
              }
            }
            .gentle-blink-border {
              animation: gentle-blink 2s ease-in-out infinite;
            }
            @keyframes soft-pulse {
              0% {
                opacity: 0.5;
                transform: scale(1);
              }
              50% {
                opacity: 0.2;
                transform: scale(1.08);
              }
              100% {
                opacity: 0;
                transform: scale(1.15);
              }
            }
            .soft-pulse-ring {
              animation: soft-pulse 3s ease-out infinite;
              transform-origin: center;
              transform-box: fill-box;
            }
          `}
        </style>
        
        {/* Gradient for outer ring */}
        <defs>
          <linearGradient id={`outerGradient${isSecondary ? 'Secondary' : ''}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isSecondary ? theme.colors.palette.secondary : theme.colors.palette.primary} stopOpacity="0.3"/>
            <stop offset="50%" stopColor={isSecondary ? theme.colors.palette.secondary : theme.colors.palette.primary} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={isSecondary ? theme.colors.palette.secondary : theme.colors.palette.primary} stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        
        {/* Soft pulse effect */}
        <circle cx="25" cy="25" r="23" fill="none" 
          stroke={isSecondary ? theme.colors.palette.secondary : theme.colors.palette.primary} 
          strokeWidth="1" 
          className={!isSecondary ? "soft-pulse-ring" : ""} />
        
        {/* Gentle blinking border */}
        <circle cx="25" cy="25" r="24" fill="none" 
          stroke={isSecondary ? theme.colors.palette.secondary : theme.colors.palette.primary} 
          strokeWidth="2" 
          className="gentle-blink-border" />
        
        {/* Main background */}
        <circle cx="25" cy="25" r="22" 
          fill={isSecondary ? theme.colors.palette.secondary : theme.colors.palette.primary} />
        
        {/* Phone icon centered */}
        <path
          d="M 31 28.5 C 31 29.3 30.3 30 29.5 30 C 20.4 30 13 22.6 13 13.5 C 13 12.7 13.7 12 14.5 12 L 17.5 12 C 18.3 12 19 12.7 19 13.5 C 19 14.8 19.2 16 19.6 17.2 C 19.7 17.5 19.6 17.9 19.4 18.1 L 17.6 19.9 C 18.9 22.4 20.6 24.1 23.1 25.4 L 24.9 23.6 C 25.1 23.3 25.5 23.2 25.8 23.4 C 27 23.8 28.2 24 29.5 24 C 30.3 24 31 24.7 31 25.5 L 31 28.5 Z"
          fill="#ffffff"
          transform="translate(4, 4)"
        />
      </svg>
    );
  };

  // Không hiển thị nếu không có số điện thoại
  const hasAnyPhone = (settings?.phones && settings.phones.length > 0) || settings?.phone;
  if (!hasAnyPhone) {
    return null;
  }

  return (
    <>
      {/* Nút điện thoại chính */}
      <Tooltip title={`Gọi điện: ${primaryPhone}`}>
        <div
          onClick={handleMainClick}
          className={className}
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            zIndex: 1000,
            width: "50px",
            height: "50px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
            backgroundColor: "#fff",
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

    </>
  );
};

export default PhoneContact;