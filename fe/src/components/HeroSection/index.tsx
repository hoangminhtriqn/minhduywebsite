import React, { useState, useEffect } from "react";
import { Collapse } from "antd";
import { MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import styles from "./styles.module.scss";

const HeroSection: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false);

  // BMW categories and services
  const categories = [
    {
      id: "bmw-series",
      name: "Dòng Xe BMW",
      icon: "🚗",
      subCategories: [
        "BMW 1 Series",
        "BMW 2 Series",
        "BMW 3 Series",
        "BMW 4 Series",
        "BMW 5 Series",
        "BMW 6 Series",
        "BMW 7 Series",
        "BMW 8 Series",
        "BMW X Series",
        "BMW Z Series",
        "BMW M Series",
        "BMW i Series",
      ],
    },
    {
      id: "bmw-suv",
      name: "BMW SUV",
      icon: "🚙",
      subCategories: [
        "BMW X1",
        "BMW X2",
        "BMW X3",
        "BMW X4",
        "BMW X5",
        "BMW X6",
        "BMW X7",
        "BMW XM",
        "BMW iX",
      ],
    },
    {
      id: "bmw-sedan",
      name: "BMW Sedan",
      icon: "🏎️",
      subCategories: [
        "BMW 1 Series Sedan",
        "BMW 2 Series Gran Coupe",
        "BMW 3 Series",
        "BMW 4 Series Gran Coupe",
        "BMW 5 Series",
        "BMW 6 Series Gran Turismo",
        "BMW 7 Series",
        "BMW 8 Series Gran Coupe",
      ],
    },
    {
      id: "bmw-service",
      name: "Dịch Vụ BMW",
      icon: "🔧",
      subCategories: [
        "Bảo hành BMW",
        "Bảo dưỡng BMW",
        "Sửa chữa BMW",
        "Phụ tùng BMW chính hãng",
        "Dịch vụ cứu hộ BMW",
        "Kiểm tra định kỳ",
        "Thay dầu nhớt",
        "Thay lốp BMW",
      ],
    },
    {
      id: "bmw-parts",
      name: "Phụ Tùng BMW",
      icon: "⚙️",
      subCategories: [
        "Phụ tùng động cơ",
        "Phụ tùng phanh",
        "Phụ tùng gầm",
        "Phụ tùng điện",
        "Phụ tùng nội thất",
        "Phụ tùng ngoại thất",
        "Dầu nhớt BMW",
        "Phụ tùng thay thế",
      ],
    },
    {
      id: "bmw-finance",
      name: "Tài Chính BMW",
      icon: "💰",
      subCategories: [
        "Vay mua xe BMW",
        "Thuê xe BMW",
        "Bảo hiểm xe BMW",
        "Tính toán trả góp",
        "Ưu đãi tài chính",
        "Hỗ trợ vay ngân hàng",
        "Bảo hiểm toàn diện",
      ],
    },
    {
      id: "bmw-test-drive",
      name: "Test Drive BMW",
      icon: "🎯",
      subCategories: [
        "Đặt lịch test drive",
        "BMW 3 Series test drive",
        "BMW 5 Series test drive",
        "BMW X3 test drive",
        "BMW X5 test drive",
        "BMW i Series test drive",
        "Test drive tại Đà Nẵng",
      ],
    },
    {
      id: "bmw-support",
      name: "Hỗ Trợ Khách Hàng",
      icon: "📞",
      subCategories: [
        "Tư vấn mua xe",
        "Hỗ trợ kỹ thuật",
        "Đặt lịch hẹn",
        "Liên hệ khẩn cấp",
        "FAQ - Câu hỏi thường gặp",
        "Hướng dẫn sử dụng",
        "Bảo hành online",
      ],
    },
  ];

  const carouselImages = [
    { 
      src: "/images/bmw-3840x2160.jpg", 
      alt: "Minh Duy BMW Đà Nẵng - Showroom BMW chính hãng tại Đà Nẵng" 
    },
    { 
      src: "/images/bmw-x5m.jpg", 
      alt: "BMW X5M - Xe BMW cao cấp tại Minh Duy Đà Nẵng" 
    },
    { 
      src: "/images/bmw-service-center.jpg", 
      alt: "Trung tâm dịch vụ BMW Minh Duy Đà Nẵng - Bảo hành sửa chữa BMW" 
    },
    { 
      src: "/images/bmw-service-hanoi.jpg", 
      alt: "Dịch vụ BMW tại Minh Duy Đà Nẵng - Đại lý BMW uy tín" 
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleCategoryHover = (categoryId: string) => {
    setHoveredCategory(categoryId);
  };

  const handleMegaMenuEnter = () => {
    // Keep mega menu open when hovering over it
  };

  const handleMegaMenuLeave = () => {
    // Close mega menu when leaving the mega menu area
    setHoveredCategory(null);
  };

  const handleSidebarLeave = () => {
    // Close mega menu when leaving the entire sidebar area
    setHoveredCategory(null);
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  // Get current category
  const currentCategory = hoveredCategory
    ? categories.find((cat) => cat.id === hoveredCategory)
    : null;

  // Prepare collapse items for mobile
  const collapseItems = categories.map((category) => ({
    key: category.id,
    label: (
      <div className={styles.collapseHeader}>
        <span className={styles.collapseIcon}>{category.icon}</span>
        <span className={styles.collapseTitle}>{category.name}</span>
      </div>
    ),
    children: (
      <ul className={styles.collapseList}>
        {category.subCategories.map((subCategory, index) => (
          <li key={index} className={styles.collapseItem}>
            {subCategory}
          </li>
        ))}
      </ul>
    ),
  }));

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        {/* Left Sidebar */}
        <div
          className={styles.sidebarContainer}
          onMouseLeave={handleSidebarLeave}
        >
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <p>DANH MỤC SẢN PHẨM</p>
            </div>

            {/* Desktop Category List */}
            <ul className={styles.categoryList}>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={styles.categoryItem}
                  onMouseEnter={() => handleCategoryHover(category.id)}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.arrow}>›</span>
                </li>
              ))}
            </ul>

            {/* Mobile Collapse */}
            <div className={styles.mobileCollapse}>
              <Collapse
                items={collapseItems}
                defaultActiveKey={[]}
                ghost
                size="small"
                accordion
              />
            </div>
          </div>

          {/* Desktop Mega Menu Popup */}
          {hoveredCategory && currentCategory && (
            <div
              className={styles.megaMenu}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <div className={styles.megaMenuContent}>
                {/* Sub Categories List */}
                <ul className={styles.megaMenuList}>
                  {currentCategory.subCategories.map((subCategory, index) => (
                    <li key={index} className={styles.megaMenuItem}>
                      <span>{subCategory}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Image Carousel */}
        <div className={styles.carouselSection}>
          <div className={styles.carousel}>
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.carouselSlide} ${index === currentImageIndex ? styles.active : ""}`}
              >
                <img src={image.src} alt={image.alt} />
              </div>
            ))}

            {/* Carousel Navigation */}
            <button
              className={styles.carouselNav}
              onClick={handlePrevClick}
              style={{ left: "10px" }}
            >
              ‹
            </button>
            <button
              className={styles.carouselNav}
              onClick={handleNextClick}
              style={{ right: "10px" }}
            >
              ›
            </button>

            {/* Carousel Dots */}
            <div className={styles.carouselDots}>
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.carouselDot} ${index === currentImageIndex ? styles.active : ""}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
