import {
  Category,
  getCategoriesHierarchy,
} from "@/api/services/user/categories";
import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const HeroSection: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategoriesHierarchy();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const carouselImages = [
    {
      src: "/images/bmw-3840x2160.jpg",
      alt: "Minh Duy Technology - Công ty công nghệ thiết bị vi tính hàng đầu",
    },
    {
      src: "/images/bmw-x5m.jpg",
      alt: "Laptop Gaming - Thiết bị công nghệ cao cấp tại Minh Duy",
    },
    {
      src: "/images/bmw-service-center.jpg",
      alt: "Trung tâm dịch vụ công nghệ Minh Duy - Sửa chữa bảo hành thiết bị",
    },
    {
      src: "/images/bmw-service-hanoi.jpg",
      alt: "Dịch vụ công nghệ tại Minh Duy - Đại lý thiết bị vi tính uy tín",
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

  if (loading) {
    return (
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.sidebarContainer}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <p>DANH MỤC SẢN PHẨM</p>
              </div>
              <div className={styles.loadingSpinner}>
                <p>Đang tải danh mục...</p>
              </div>
            </div>
          </div>
          <div className={styles.carouselSection}>
            <div className={styles.carousel}>
              <div className={styles.loadingSpinner}>
                <p>Đang tải...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
