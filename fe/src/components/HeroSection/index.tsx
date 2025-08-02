import {
  Category,
  getCategoriesHierarchy,
} from "@/api/services/user/categories";
import { getPublicSettings } from "@/api/services/admin/settings";
import { Collapse, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import HeroSectionSkeleton from "@/components/HeroSection/HeroSectionSkeleton";
import { ROUTERS } from "@/utils/constant";

interface Slide {
  src: string;
  alt: string;
}

const HeroSection: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  // Fetch categories and slides from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, settingsData] = await Promise.all([
          getCategoriesHierarchy(),
          getPublicSettings()
        ]);
        setCategories(categoriesData);
        
        // Extract slides from settings
        if (settingsData.slides) {
          setSlides(settingsData.slides);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  // Reset navigating state after navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 1000); // Reset after 1 second

    return () => clearTimeout(timer);
  }, [navigating]);

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
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % slides.length);
  };

  // Handle sub category click
  const handleSubCategoryClick = (categoryId: string) => {
    if (navigating) return; // Prevent multiple clicks

    setNavigating(true);
    // Navigate to products page with category filter
    navigate(`${ROUTERS.USER.PRODUCTS}?category=${categoryId}`);
    notification.success({
      message: "Đang chuyển hướng",
      description: "Đang tải sản phẩm theo danh mục đã chọn...",
      duration: 1.5,
    });
  };

  // Handle mobile sub category click
  const handleMobileSubCategoryClick = (categoryId: string) => {
    if (navigating) return; // Prevent multiple clicks

    setNavigating(true);
    // Navigate to products page with category filter
    navigate(`${ROUTERS.USER.PRODUCTS}?category=${categoryId}`);
    notification.success({
      message: "Đang chuyển hướng",
      description: "Đang tải sản phẩm theo danh mục đã chọn...",
      duration: 1.5,
    });
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
          <li
            key={index}
            className={styles.collapseItem}
            onClick={() => handleMobileSubCategoryClick(category.id)}
            role="button"
            tabIndex={0}
            aria-label={`Xem sản phẩm ${subCategory}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleMobileSubCategoryClick(category.id);
              }
            }}
          >
            {subCategory}
          </li>
        ))}
      </ul>
    ),
  }));

  if (loading) {
    return <HeroSectionSkeleton />;
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
                    <li
                      key={index}
                      className={styles.megaMenuItem}
                      onClick={() => handleSubCategoryClick(currentCategory.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Xem sản phẩm ${subCategory}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSubCategoryClick(currentCategory.id);
                        }
                      }}
                    >
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
            {slides.map((image, index) => (
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
              {slides.map((_, index) => (
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
