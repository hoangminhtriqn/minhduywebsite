import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaCar,
  FaTools,
  FaShieldAlt,
  FaCalculator,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "@/api/config";
import styles from "./Footer.module.scss";
import { ROUTERS } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

interface Category {
  _id: string;
  Category_Name: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);
  const { theme } = useTheme();

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/danh-muc`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories for footer:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create URL with category filter for PriceListPage
  const createCategoryLink = (categoryName: string) => {
    // For special filters
    if (categoryName === "m" || categoryName === "i") {
      return `/bang-gia?filter=${categoryName}`;
    }

    // For regular categories, use the exact category name
    const filterKey = categoryName.toLowerCase();
    return `/bang-gia?filter=${encodeURIComponent(filterKey)}`;
  };

  // Get 5 random categories
  const getRandomCategories = () => {
    if (categories.length === 0) return [];

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
    <div className={styles.bmwFooterContainer} style={footerStyle}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Company Information */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerMainTitle}>MINH DUY</h3>
            <p className={styles.footerDescription}>
              Công ty thiết bị công nghệ hàng đầu tại Việt Nam, chuyên cung cấp
              thiết bị công nghệ chất lượng cao với dịch vụ bảo hành, bảo trì
              chuyên nghiệp. Trải nghiệm công nghệ tiên tiến với đội ngũ tư vấn
              chuyên nghiệp và giá cả cạnh tranh.
            </p>

            <div className={styles.footerSocial}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialLink}
                style={socialLinkStyle}
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialLink}
                style={socialLinkStyle}
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialLink}
                style={socialLinkStyle}
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Technology Equipment */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>TÌM HIỂU VỀ MINH DUY</h4>
            <div className={styles.footerList}>
              <Link
                to="/bang-gia"
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaTools className={styles.linkIcon} style={iconStyle} />
                Tất cả thiết bị
              </Link>
              <Link
                to={createCategoryLink("m")}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaTools className={styles.linkIcon} style={iconStyle} />
                Thiết bị văn phòng
              </Link>
              <Link
                to={createCategoryLink("i")}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaTools className={styles.linkIcon} style={iconStyle} />
                Hệ thống công nghệ
              </Link>
              <Link
                to="/dich-vu"
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaTools className={styles.linkIcon} style={iconStyle} />
                Dịch vụ Minh Duy
              </Link>
              <Link
                to="/tin-tuc"
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaTools className={styles.linkIcon} style={iconStyle} />
                Tin tức & Sự kiện
              </Link>
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
                  to={createCategoryLink(category.Category_Name)}
                  className={styles.footerLink}
                  style={linkStyle}
                >
                  {category.Category_Name}
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
              <Link
                to={ROUTERS.USER.SERVICE}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaTools className={styles.linkIcon} style={iconStyle} />
                Bảo hành & Bảo trì
              </Link>
              <Link
                to={ROUTERS.USER.SERVICE}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaShieldAlt className={styles.linkIcon} style={iconStyle} />
                Sửa chữa & Phụ tùng
              </Link>
              <Link
                to={ROUTERS.USER.PRICE_LIST}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaCalculator className={styles.linkIcon} style={iconStyle} />
                Bảng giá chi tiết
              </Link>
              <Link
                to={ROUTERS.USER.TEST_DRIVE}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaCalendarAlt className={styles.linkIcon} style={iconStyle} />
                Đặt lịch hẹn
              </Link>
              <Link
                to={ROUTERS.USER.TEST_DRIVE}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaTools className={styles.linkIcon} style={iconStyle} />
                Tư vấn kỹ thuật
              </Link>
              <Link
                to={ROUTERS.USER.TEST_DRIVE}
                className={styles.footerLink}
                style={linkStyle}
              >
                <FaCalculator className={styles.linkIcon} style={iconStyle} />
                Tính toán chi phí
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section - Moved to bottom */}
        <div className={styles.footerContactSection}>
          <h4 className={styles.footerTitle}>LIÊN HỆ VỚI CHÚNG TÔI</h4>
          <div className={styles.contactGrid}>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <FaPhone className={styles.footerIcon} style={iconStyle} />
              <div>
                <span className={styles.contactLabel}>Hotline:</span>
                <span className={styles.contactValue}>1800 8123</span>
              </div>
            </div>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <FaEnvelope className={styles.footerIcon} style={iconStyle} />
              <div>
                <span className={styles.contactLabel}>Email:</span>
                <span className={styles.contactValue}>minhduy@gmail.com</span>
              </div>
            </div>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <FaMapMarkerAlt className={styles.footerIcon} style={iconStyle} />
              <div>
                <span className={styles.contactLabel}>Địa chỉ:</span>
                <span className={styles.contactValue}>
                  123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng
                </span>
              </div>
            </div>
            <div className={styles.footerContactItem} style={contactItemStyle}>
              <FaClock className={styles.footerIcon} style={iconStyle} />
              <div>
                <span className={styles.contactLabel}>Giờ làm việc:</span>
                <span className={styles.contactValue}>
                  8:00 - 18:00 (Thứ 2 - Thứ 7)
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
            <div className={styles.footerLegal}>
              <Link
                to="/privacy"
                className={styles.legalLink}
                style={linkStyle}
              >
                Chính Sách Bảo Mật
              </Link>
              <span className={styles.separator}>|</span>
              <Link to="/terms" className={styles.legalLink} style={linkStyle}>
                Điều Khoản Sử Dụng
              </Link>
              <span className={styles.separator}>|</span>
              <Link
                to="/sitemap"
                className={styles.legalLink}
                style={linkStyle}
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
