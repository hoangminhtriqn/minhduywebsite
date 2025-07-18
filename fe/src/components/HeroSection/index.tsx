import React, { useState, useEffect } from "react";
import { Collapse } from "antd";
import { MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import styles from "./styles.module.scss";

const HeroSection: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHoveringMegaMenu, setIsHoveringMegaMenu] = useState(false);

  // Temporary data for categories and sub-categories
  const categories = [
    {
      id: "laptop",
      name: "Laptop",
      icon: "💻",
      subCategories: [
        "Laptop Acer",
        "Laptop Apple",
        "Laptop Asus",
        "Laptop Dell",
        "Laptop Fujitsu",
        "Laptop HP",
        "Laptop Lenovo",
        "Laptop LG",
        "Laptop MSI",
        "Laptop Samsung",
        "Laptop Toshiba",
      ],
    },
    {
      id: "gaming",
      name: "Laptop Gaming",
      icon: "🎮",
      subCategories: [
        "Asus ROG",
        "MSI Gaming",
        "Alienware",
        "Razer Blade",
        "Acer Predator",
        "Lenovo Legion",
        "HP Omen",
        "Dell G Series",
      ],
    },
    {
      id: "components",
      name: "Linh kiện máy tính",
      icon: "🔧",
      subCategories: [
        "CPU Intel",
        "CPU AMD",
        "RAM DDR4",
        "RAM DDR5",
        "SSD NVMe",
        "SSD SATA",
        "HDD Internal",
        "Card đồ họa",
        "Nguồn máy tính",
        "Bo mạch chủ",
        "Quạt tản nhiệt",
        "Case máy tính",
      ],
    },
    {
      id: "monitor",
      name: "Màn hình máy tính",
      icon: "🖥️",
      subCategories: [
        "Màn hình Samsung",
        "Màn hình LG",
        "Màn hình Dell",
        "Màn hình ASUS",
        "Màn hình Acer",
        "Màn hình BenQ",
        "Màn hình ViewSonic",
        "Màn hình Philips",
        "Màn hình HP",
        "Màn hình Lenovo",
      ],
    },
    {
      id: "office",
      name: "Thiết bị văn phòng",
      icon: "🖨️",
      subCategories: [
        "Máy in HP",
        "Máy in Canon",
        "Máy in Epson",
        "Máy in Brother",
        "Máy quét",
        "Máy chiếu",
      ],
    },
    {
      id: "desktop",
      name: "Máy tính bộ - Máy cây",
      icon: "🖥️",
      subCategories: [
        "Máy tính Dell",
        "Máy tính HP",
        "Máy tính Lenovo",
        "Máy tính ASUS",
        "Máy tính Acer",
        "Máy tính tự lắp",
        "iMac Apple",
        "PC Gaming",
        "Máy trạm",
      ],
    },
    {
      id: "accessories",
      name: "Phụ kiện máy tính",
      icon: "🎧",
      subCategories: [
        "Chuột Logitech",
        "Chuột Razer",
        "Chuột SteelSeries",
        "Bàn phím Gaming",
        "Bàn phím cơ",
        "Tai nghe không dây",
        "Tai nghe Gaming",
        "Webcam",
        "Bàn di chuột",
        "Ghế Gaming",
        "Giá màn hình",
        "Hub USB",
        "Dây cáp",
      ],
    },
    {
      id: "software",
      name: "Camera - Phần mềm",
      icon: "📹",
      subCategories: [
        "Microsoft Office",
        "Adobe Creative Suite",
        "Phần mềm Autodesk",
        "Phần mềm bảo mật",
        "Phần mềm chỉnh sửa video",
        "Phần mềm chỉnh sửa ảnh",
        "Phần mềm CAD",
        "Công cụ phát triển",
        "Phần mềm diệt virus",
      ],
    },
  ];

  const carouselImages = [
    { src: "/images/bmw-3840x2160.jpg", alt: "BMW Showroom" },
    { src: "/images/bmw-x5m.jpg", alt: "BMW X5M" },
    { src: "/images/bmw-service-center.jpg", alt: "BMW Service Center" },
    { src: "/images/bmw-service-hanoi.jpg", alt: "BMW Service Hanoi" },
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
