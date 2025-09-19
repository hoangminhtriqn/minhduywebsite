import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_BASE_URL } from "@/api/config";
import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ROUTERS } from "@/utils/constant";
import {
  CalculatorOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  TikTokOutlined,
  ToolOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import styles from "./style.module.scss";

interface Category {
  id: string;
  name: string;
  icon?: string;
  subCategories?: string[];
}

interface FooterLink {
  icon?: React.ReactNode;
  path: string;
  text: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);
  const { theme } = useTheme();
  const { settings, locations } = useSettings();
  const mainLocation = locations.find((loc) => loc.isMainAddress);

  // Footer links arrays
  const aboutLinks: FooterLink[] = [
    {
      path: ROUTERS.USER.PRODUCTS,
      text: "Tất cả sản phẩm",
    },
    {
      path: ROUTERS.USER.PRICE_LIST,
      text: "Báo giá",
    },
    {
      path: ROUTERS.USER.NEWS,
      text: "Tin tức & Sự kiện",
    },
    {
      path: ROUTERS.USER.FAVORITES,
      text: "Yêu thích",
    },
    {
      path: ROUTERS.USER.SERVICE,
      text: "Dịch vụ",
    },
    {
      path: ROUTERS.USER.BOOKING,
      text: "Đặt lịch hẹn",
    },
  ];

  const serviceLinks: FooterLink[] = [
    {
      icon: <ToolOutlined />,
      path: "",
      text: "Bảo hành & Bảo trì",
    },
    {
      icon: <SafetyCertificateOutlined />,
      path: "",
      text: "Sửa chữa & Thi công",
    },
    {
      icon: <CalculatorOutlined />,
      path: "",
      text: "Bảng giá chi tiết",
    },
    {
      icon: <CalendarOutlined />,
      path: "",
      text: "Đặt lịch hẹn",
    },
    {
      icon: <ToolOutlined />,
      path: "",
      text: "Tư vấn kỹ thuật",
    },
    {
      icon: <CalculatorOutlined />,
      path: "",
      text: "Tính toán chi phí",
    },
  ];

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      // The API returns data in response.data.data structure
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories for footer:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Get 5 random parent categories
  const getRandomCategories = () => {
    if (!categories || !Array.isArray(categories) || categories.length === 0)
      return [];

    // The API returns parent categories directly (no ParentID field)
    // Shuffle array and take first 5
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const randomCategories = getRandomCategories();

  // Theme-based styles
  const footerStyle = {
    background: `linear-gradient(135deg, ${theme.colors.palette.primaryDark} 0%, ${theme.colors.palette.primary} 50%, ${theme.colors.palette.primaryLight} 100%)`,
    color: theme.colors.text.white,
  };

  const linkStyle = {
    color: theme.colors.text.white,
  };

  const iconStyle = {
    color: theme.colors.text.white,
  };

  const contactItemStyle = {
    backgroundColor: `rgba(0, 0, 0, 0.2)`,
    borderColor: `rgba(255, 255, 255, 0.2)`,
    color: theme.colors.text.white,
  };

  const socialLinkStyle = {
    backgroundColor: `rgba(255, 255, 255, 0.15)`,
    borderColor: `rgba(255, 255, 255, 0.2)`,
    color: theme.colors.text.white,
  };

  return (
    <div className={styles.minhduyFooterContainer} style={footerStyle}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Company Information */}
          <div className={styles.footerColumn}>
            <div className={styles.footerLogoContainer}>
              <h3 className={styles.footerMainTitle}>
                {settings?.companyName || ""}
              </h3>
            </div>
            <p
              className={styles.footerDescription}
              style={{ color: "#e3f2fd" }}
            >
              {settings?.description || ""}
            </p>
            <div className={styles.footerSocial}>
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                  style={socialLinkStyle}
                  aria-label="Facebook"
                >
                  <FacebookOutlined />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                  style={socialLinkStyle}
                  aria-label="YouTube"
                >
                  <YoutubeOutlined />
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                  style={socialLinkStyle}
                  aria-label="Instagram"
                >
                  <TikTokOutlined />
                </a>
              )}
              {/* Có thể thêm các social khác nếu muốn */}
            </div>
          </div>

          {/* Technology Equipment */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>TÌM HIỂU VỀ MINH DUY</h4>
            <div className={styles.footerList}>
              {aboutLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={styles.footerLink}
                  style={linkStyle}
                >
                  <span className={styles.linkIcon} style={iconStyle}>
                    {link.icon}
                  </span>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Products Column - Dynamic from API */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>THIẾT BỊ</h4>
            <div className={styles.footerList}>
              {/* Random categories from API */}
              {randomCategories &&
                randomCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`${ROUTERS.USER.PRODUCTS}?category=${category.id}`}
                    className={styles.footerLink}
                    style={linkStyle}
                  >
                    {category.name}
                  </Link>
                ))}
              {categories && categories.length > 5 && (
                <Link
                  to={ROUTERS.USER.PRODUCTS}
                  className={styles.footerLink}
                  style={linkStyle}
                >
                  Xem tất cả →
                </Link>
              )}
            </div>
          </div>

          {/* Services */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>DỊCH VỤ</h4>
            <div className={styles.footerList}>
              {serviceLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={styles.footerLink}
                  style={linkStyle}
                >
                  <span className={styles.linkIcon} style={iconStyle}>
                    {link.icon}
                  </span>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section - Moved to bottom */}
        <div className={styles.footerContactSection}>
          <h4 className={styles.footerTitle}>LIÊN HỆ VỚI CHÚNG TÔI</h4>
          <div className={styles.contactGrid}>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <PhoneOutlined className={styles.footerIcon} style={iconStyle} />
              <div>
                <span className={styles.contactLabel}>Hotline:</span>
                {(() => {
                  // Hiển thị tất cả số, số chính đứng đầu; cùng một style
                  const phones = (settings?.phones && settings.phones.length > 0)
                    ? settings.phones
                    : (settings?.phone ? [settings.phone] : []);
                  if (phones.length === 0) return null;
                  let idx = typeof settings?.primaryPhoneIndex === 'number' ? (settings.primaryPhoneIndex as number) : -1;
                  if (idx < 0 || idx >= phones.length) {
                    if (settings?.phone) {
                      const found = phones.indexOf(settings.phone);
                      if (found >= 0) idx = found;
                    }
                  }
                  const safeIdx = Math.max(0, Math.min(idx >= 0 ? idx : 0, phones.length - 1));
                  const ordered = [phones[safeIdx], ...phones.filter((_, i) => i !== safeIdx)];
                  return ordered.map((p, i) => (
                    <div key={`${p}-${i}`} className={styles.contactValue} style={{ display: "block", width: "100%" }}>
                      {p}
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <MailOutlined className={styles.footerIcon} style={iconStyle} />
              <div>
                <span className={styles.contactLabel}>Email:</span>
                <span className={styles.contactValue}>
                  {settings?.email || "minhduy@gmail.com"}
                </span>
              </div>
            </div>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <EnvironmentOutlined
                className={styles.footerIcon}
                style={iconStyle}
              />
              <div>
                <span className={styles.contactLabel}>Địa chỉ:</span>
                <span className={styles.contactValue}>
                  {mainLocation?.address}
                </span>
              </div>
            </div>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <ClockCircleOutlined
                className={styles.footerIcon}
                style={iconStyle}
              />
              <div>
                <span className={styles.contactLabel}>Giờ làm việc:</span>
            {(() => {
              const raw = settings?.workingHours || "";
              const normalized = raw.replaceAll("\\n", "\n");
              return (
                <span className={styles.contactValue} style={{ whiteSpace: "pre-line" }}>
                  {normalized}
                </span>
              );
            })()}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <p className={styles.copyright}>
              © {currentYear} MINH DUY - Công ty thiết bị công nghệ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
