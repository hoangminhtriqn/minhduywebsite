import React, { useState } from "react";
import styles from "./styles.module.scss";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  isFeatured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  isFeatured = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`${styles["service-card"]} ${isFeatured ? styles.featured : ""}`}
    >
      <div className={styles["service-card__header"]}>
        <div className={styles["service-card__icon"]}>
          <img src={icon} alt={title} />
        </div>
        <div 
          className={styles["service-card__title-container"]}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <h3 className={styles["service-card__title"]}>
            {title}
          </h3>
          {showTooltip && (
            <div className={styles["service-card__tooltip"]}>
              {title}
            </div>
          )}
        </div>
      </div>
      <p className={styles["service-card__description"]}>{description}</p>
    </div>
  );
};

export default ServiceCard;
