import React from "react";
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
  return (
    <div
      className={`${styles["service-card"]} ${isFeatured ? styles.featured : ""}`}
    >
      <div className={styles["service-card__header"]}>
        <div className={styles["service-card__icon"]}>
          <img src={icon} alt={title} />
        </div>
        <h3 className={styles["service-card__title"]}>{title}</h3>
      </div>
      <p className={styles["service-card__description"]}>{description}</p>
    </div>
  );
};

export default ServiceCard;
