import React from 'react';
// Remove unused imports if any, or keep if still needed elsewhere
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './HeroSlider.module.scss'; // Import SCSS module

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "BMW X7",
    subtitle: "Khám phá sự sang trọng đẳng cấp với BMW X7 - SUV hạng sang 7 chỗ ngồi",
    price: "Từ 5.999.000.000 VNĐ",
    image: "/images/x7_1_.webp"
  },
  {
    id: 2,
    title: "BMW M4",
    subtitle: "Trải nghiệm sức mạnh và hiệu suất vượt trội với BMW M4",
    price: "Từ 4.999.000.000 VNĐ",
    image: "/images/Screenshot 2025-03-31 100737.png"
  },
  {
    id: 3,
    title: "BMW iX",
    subtitle: "Tương lai của di chuyển điện với BMW iX - SUV điện thông minh",
    price: "Từ 3.999.000.000 VNĐ",
    image: "/images/new_bmw_ix3_series.webp"
  }
];

const HeroSlider: React.FC = () => {
  // Settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true, // Enable fade effect
    cssEase: "linear"
  };

  return (
    <div className={styles.heroSection}>
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className={styles.heroSlide}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>{slide.title}</h1>
              <p className={styles.heroSubtitle}>{slide.subtitle}</p>
              <span className={styles.heroPrice}>{slide.price}</span>
            </div>
            <img
              src={slide.image}
              alt={slide.title}
              className={styles.heroImage}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider; 