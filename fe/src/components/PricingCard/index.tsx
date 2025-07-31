import React from 'react';
import { Pricing } from '@/api/services/user/pricing';
import { FilePdfOutlined, FileWordOutlined, FileExcelOutlined, FileOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';

interface PricingCardProps {
  pricing: Pricing;
  variant?: 'user' | 'admin';
  onDownload?: (document: { name: string; type: string; size: string; url: string }) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  pricing,
  onDownload
}) => {
  const handleDownload = (document: { name: string; type: string; size: string; url: string }) => {
    if (onDownload) {
      onDownload(document);
    } else {
      // Default download behavior
      window.open(document.url, '_blank');
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: styles['pricing-card--blue'],
      green: styles['pricing-card--green'],
      purple: styles['pricing-card--purple'],
      orange: styles['pricing-card--orange'],
      teal: styles['pricing-card--teal'],
      red: styles['pricing-card--red'],
      pink: styles['pricing-card--pink'],
      indigo: styles['pricing-card--indigo'],
      yellow: styles['pricing-card--yellow'],
      cyan: styles['pricing-card--cyan'],
      lime: styles['pricing-card--lime'],
      amber: styles['pricing-card--amber'],
      emerald: styles['pricing-card--emerald'],
      violet: styles['pricing-card--violet'],
      rose: styles['pricing-card--rose'],
      sky: styles['pricing-card--sky']
    };
    return colorMap[color] || styles['pricing-card--blue'];
  };

  return (
    <div className={`${styles['pricing-card']} ${getColorClass(pricing.color)}`}>
      <div className={styles['pricing-card__header']}>
        <h3 className={styles['pricing-card__title']}>{pricing.title}</h3>
      </div>

      <p className={styles['pricing-card__description']}>
        {pricing.description}
      </p>

      <div className={styles['pricing-card__features']}>
        <ul>
          {pricing.features?.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {pricing.documents && pricing.documents.length > 0 && (
        <div className={styles['pricing-card__documents']}>
          <div className={styles['pricing-card__documents-list']}>
            {pricing.documents.map((doc, index) => (
              <button
                key={index}
                className={styles['pricing-card__document']}
                onClick={() => handleDownload(doc)}
                title={doc.name}
              >
                <div className={styles['pricing-card__document-info']}>
                  <span className={styles['pricing-card__document-name']}>
                    {doc.name}
                  </span>
                  <span className={styles['pricing-card__document-size']}>
                    {doc.size}
                  </span>
                </div>
                                 <span className={styles['pricing-card__document-icon']}>
                   {doc.type === 'pdf' && <FilePdfOutlined />}
                   {doc.type === 'word' && <FileWordOutlined />}
                   {doc.type === 'excel' && <FileExcelOutlined />}
                   {doc.type !== 'pdf' && doc.type !== 'word' && doc.type !== 'excel' && <FileOutlined />}
                 </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCard; 