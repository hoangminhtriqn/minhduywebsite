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
import { API_BASE_URL } from "../../api/config";
import styles from "./Footer.module.scss";
import { ROUTERS } from "../../utils/constant";

interface Category {
  _id: string;
  Category_Name: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <div className={styles.bmwFooterContainer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Company Information */}
          <div className={styles.footerColumn}>
            <h3 className={styles.footerMainTitle}>SiVi CAR</h3>
            <p className={styles.footerDescription}>
              Đại lý BMW chính hãng hàng đầu tại Việt Nam, chuyên cung cấp xe
              BMW mới 100% với dịch vụ bảo hành, bảo dưỡng chính hãng. Trải
              nghiệm đẳng cấp Đức với đội ngũ tư vấn chuyên nghiệp và giá cả
              cạnh tranh.
            </p>

            <div className={styles.footerSocial}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialLink}
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialLink}
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerSocialLink}
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* BMW Models */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>TÌM HIỂU VỀ BMW</h4>
            <div className={styles.footerList}>
              <Link to="/bang-gia" className={styles.footerLink}>
                <FaCar className={styles.linkIcon} />
                Tất cả dòng xe
              </Link>
              <Link to={createCategoryLink("m")} className={styles.footerLink}>
                <FaCar className={styles.linkIcon} />
                BMW M Series
              </Link>
              <Link to={createCategoryLink("i")} className={styles.footerLink}>
                <FaCar className={styles.linkIcon} />
                BMW i Series
              </Link>
              <Link to="/dich-vu" className={styles.footerLink}>
                <FaTools className={styles.linkIcon} />
                Dịch vụ BMW
              </Link>
              <Link to="/tin-tuc" className={styles.footerLink}>
                <FaCar className={styles.linkIcon} />
                Tin tức & Sự kiện
              </Link>
            </div>
          </div>

          {/* Products Column - Dynamic from API */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>DÒNG XE</h4>
            <div className={styles.footerList}>
              {/* Random categories from API */}
              {randomCategories.map((category) => (
                <Link
                  key={category._id}
                  to={createCategoryLink(category.Category_Name)}
                  className={styles.footerLink}
                >
                  {category.Category_Name}
                </Link>
              ))}
              {categories.length > 5 && (
                <Link to="/bang-gia" className={styles.footerLink}>
                  Xem tất cả →
                </Link>
              )}
            </div>
          </div>

          {/* Services & Utilities */}
          <div className={styles.footerColumn}>
            <h4 className={styles.footerTitle}>DỊCH VỤ & TIỆN ÍCH</h4>
            <div className={styles.footerList}>
              <Link to={ROUTERS.USER.SERVICE} className={styles.footerLink}>
                <FaTools className={styles.linkIcon} />
                Bảo hành & Bảo dưỡng
              </Link>
              <Link to={ROUTERS.USER.SERVICE} className={styles.footerLink}>
                <FaShieldAlt className={styles.linkIcon} />
                Sửa chữa & Phụ tùng
              </Link>
              <Link to={ROUTERS.USER.PRICE_LIST} className={styles.footerLink}>
                <FaCalculator className={styles.linkIcon} />
                Bảng giá chi tiết
              </Link>
              <Link to={ROUTERS.USER.TEST_DRIVE} className={styles.footerLink}>
                <FaCalendarAlt className={styles.linkIcon} />
                Đặt lịch hẹn
              </Link>
              <Link to={ROUTERS.USER.TEST_DRIVE} className={styles.footerLink}>
                <FaCar className={styles.linkIcon} />
                Đặt lịch lái thử
              </Link>
              <Link to={ROUTERS.USER.TEST_DRIVE} className={styles.footerLink}>
                <FaCalculator className={styles.linkIcon} />
                Tính toán trả góp
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section - Moved to bottom */}
        <div className={styles.footerContactSection}>
          <h4 className={styles.footerTitle}>LIÊN HỆ VỚI CHÚNG TÔI</h4>
          <div className={styles.contactGrid}>
            <div className={styles.footerContactItem}>
              <FaPhone className={styles.footerIcon} />
              <div>
                <span className={styles.contactLabel}>Hotline:</span>
                <span className={styles.contactValue}>1800 8123</span>
              </div>
            </div>
            <div className={styles.footerContactItem}>
              <FaEnvelope className={styles.footerIcon} />
              <div>
                <span className={styles.contactLabel}>Email:</span>
                <span className={styles.contactValue}>sivicode@gmail.com</span>
              </div>
            </div>
            <div className={styles.footerContactItem}>
              <FaMapMarkerAlt className={styles.footerIcon} />
              <div>
                <span className={styles.contactLabel}>Địa chỉ:</span>
                <span className={styles.contactValue}>
                  123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng
                </span>
              </div>
            </div>
            <div className={styles.footerContactItem}>
              <FaClock className={styles.footerIcon} />
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
              © {currentYear}SiVi CAR - Sản phẩm thuộc về SiVi CODE
            </p>
            <div className={styles.footerLegal}>
              <Link to="/privacy" className={styles.legalLink}>
                Chính Sách Bảo Mật
              </Link>
              <span className={styles.separator}>|</span>
              <Link to="/terms" className={styles.legalLink}>
                Điều Khoản Sử Dụng
              </Link>
              <span className={styles.separator}>|</span>
              <Link to="/sitemap" className={styles.legalLink}>
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
