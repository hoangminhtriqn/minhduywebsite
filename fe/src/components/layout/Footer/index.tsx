import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_BASE_URL } from "@/api/config";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { ROUTERS } from "@/utils/constant";
import {
  CalculatorOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import styles from "./style.module.scss";

interface Category {
  _id: string;
  Name: string;
  Description?: string;
  ParentID?: {
    _id: string;
    Name: string;
    id: string;
  } | null;
  Status?: string;
  Order?: number;
  id: string;
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
  const { settings, loading: settingsLoading } = useSettings();

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
      path: ROUTERS.USER.SERVICE,
      text: "Bảo hành & Bảo trì",
    },
    {
      icon: <SafetyCertificateOutlined />,
      path: ROUTERS.USER.SERVICE,
      text: "Sửa chữa & Phụ tùng",
    },
    {
      icon: <CalculatorOutlined />,
      path: ROUTERS.USER.PRICE_LIST,
      text: "Bảng giá chi tiết",
    },
    {
      icon: <CalendarOutlined />,
      path: ROUTERS.USER.BOOKING,
      text: "Đặt lịch hẹn",
    },
    {
      icon: <ToolOutlined />,
      path: ROUTERS.USER.BOOKING,
      text: "Tư vấn kỹ thuật",
    },
    {
      icon: <CalculatorOutlined />,
      path: ROUTERS.USER.BOOKING,
      text: "Tính toán chi phí",
    },
  ];

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data.categories || []);
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
    if (categories.length === 0) return [];

    // Chỉ lấy parent categories (ParentID = null)
    const parentCategories = categories.filter((cat) => !cat.ParentID);

    if (parentCategories.length === 0) return [];

    // Shuffle array and take first 5
    const shuffled = [...parentCategories].sort(() => 0.5 - Math.random());
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

  if (settingsLoading) return null; // hoặc render skeleton nếu muốn

  return (
    <div className={styles.minhduyFooterContainer} style={footerStyle}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Company Information */}
          <div className={styles.footerColumn}>
            <div className={styles.footerLogoContainer}>
              <h3 className={styles.footerMainTitle}>
                {settings?.companyName || "MINH DUY - ĐÀ NẴNG"}
              </h3>
            </div>
            <p
              className={styles.footerDescription}
              style={{ color: "#e3f2fd" }}
            >
              {settings?.description ||
                "Công ty thiết bị công nghệ hàng đầu tại Việt Nam, chuyên cung cấp thiết bị công nghệ chất lượng cao với dịch vụ bảo hành, bảo trì chuyên nghiệp. Trải nghiệm công nghệ tiên tiến với đội ngũ tư vấn chuyên nghiệp và giá cả cạnh tranh."}
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
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerSocialLink}
                  style={socialLinkStyle}
                  aria-label="Instagram"
                >
                  <InstagramOutlined />
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
              {randomCategories.map((category) => (
                <Link
                  key={category._id}
                  to={ROUTERS.USER.PRICE_LIST}
                  className={styles.footerLink}
                  style={linkStyle}
                >
                  {category.Name}
                </Link>
              ))}
              {categories.length > 5 && (
                <Link
                  to="/bang-gia"
                  className={styles.footerLink}
                  style={linkStyle}
                >
                  Xem tất cả →
                </Link>
              )}
            </div>
          </div>

          {/* Services & Utilities */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>DỊCH VỤ & TIỆN ÍCH</h4>
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
                <span className={styles.contactValue}>
                  {settings?.phone || "1800 8123"}
                </span>
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
                  {settings?.address ||
                    "123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng"}
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
                <span className={styles.contactValue}>
                  {settings?.workingHours || "8:00 - 18:00 (Thứ 2 - Thứ 7)"}
                </span>
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
