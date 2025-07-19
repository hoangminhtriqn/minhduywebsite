import PageBanner from "@/components/PageBanner";
import { PaginationWrapper, usePagination } from "@/components/pagination";

import {
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { notification, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getAllPricing, Pricing } from "@/api/services/user/pricing";
import styles from "./styles.module.scss";

const PriceListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState<Pricing[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const { pagination, handlePageChange, updateTotal } = usePagination({
    initialPageSize: 6,
  });

  // Get document icon
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdfOutlined />;
      case "word":
        return <FileWordOutlined />;
      case "excel":
        return <FileExcelOutlined />;
      default:
        return <DownloadOutlined />;
    }
  };

  // Handle document download
  const handleDownload = (document: {
    name: string;
    type: string;
    size: string;
    url: string;
  }) => {
    notification.success({
      message: "Tải tài liệu",
      description: `Đang tải ${document.name}...`,
    });
    // Here you would implement actual download logic
  };

  // Fetch pricing data from API
  const fetchPricingData = async () => {
    try {
      setLoading(true);
      const response = await getAllPricing({
        page: pagination.current,
        limit: pagination.pageSize,
      });

      // API returns data in response.message.docs
      if (response.message && Array.isArray(response.message.docs)) {
        setPricingData(response.message.docs);
        setTotalItems(response.message.totalDocs);
        updateTotal(response.message.totalDocs);
      } else {
        setPricingData([]);
      }
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu báo giá. Vui lòng thử lại sau.",
      });
      setPricingData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchPricingData();
  }, [pagination.current, pagination.pageSize]);

  // Handle page change with scroll to top
  const handlePageChangeWithScroll = (page: number, pageSize?: number) => {
    window.scrollTo(0, 0);
    handlePageChange(page, pageSize);
  };

  return (
    <div className={styles["pricing-page"]}>
      {/* Page Banner */}
      <PageBanner
        title="Báo giá dịch vụ"
        subtitle="Các hạng mục thi công, lắp đặt và dịch vụ công nghệ thông tin chuyên nghiệp"
      />

      {/* Pricing Section */}
      <section className={styles["pricing-section"]}>
        <div className={styles["pricing-section__container"]}>
          {/* Pricing Cards */}
          <div className={styles["pricing-cards"]}>
            <Spin spinning={loading}>
              <div className={styles["pricing-cards__grid"]}>
                {Array.isArray(pricingData) &&
                  pricingData.map((card) => (
                    <div
                      key={card._id}
                      className={`${styles["pricing-card"]} ${styles[`pricing-card--${card.color}`]}`}
                    >
                      {/* Card Header */}
                      <div className={styles["pricing-card__header"]}>
                        <h3 className={styles["pricing-card__title"]}>
                          {card.title}
                        </h3>
                      </div>

                      {/* Card Description */}
                      <div className={styles["pricing-card__description"]}>
                        {card.description}
                      </div>

                      {/* Card Features */}
                      <div className={styles["pricing-card__features"]}>
                        <ul>
                          {card.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Card Documents */}
                      <div className={styles["pricing-card__documents"]}>
                        <div className={styles["pricing-card__documents-list"]}>
                          {card.documents.map((doc, index) => (
                            <button
                              key={index}
                              className={styles["pricing-card__document"]}
                              onClick={() => handleDownload(doc)}
                              title={doc.name}
                            >
                              <div
                                className={
                                  styles["pricing-card__document-info"]
                                }
                              >
                                <span
                                  className={
                                    styles["pricing-card__document-name"]
                                  }
                                >
                                  {doc.name}
                                </span>
                                <span
                                  className={
                                    styles["pricing-card__document-size"]
                                  }
                                >
                                  {doc.size}
                                </span>
                              </div>
                              <span
                                className={
                                  styles["pricing-card__document-icon"]
                                }
                              >
                                {getDocumentIcon(doc.type)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Spin>

            {/* Pagination */}
            {totalItems > 0 && (
              <PaginationWrapper
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={totalItems}
                onChange={handlePageChangeWithScroll}
                showSizeChanger
                showQuickJumper
                showTotal
                pageSizeOptions={["6", "12", "18", "24"]}
                totalText="{start}-{end} của {total} dịch vụ"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PriceListPage;
