import PageBanner from "@/components/PageBanner";
import { PaginationWrapper, usePagination } from "@/components/pagination";


import { notification, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getAllPricing, Pricing } from "@/api/services/user/pricing";
import PricingCard from "@/components/PricingCard";
import styles from "./styles.module.scss";

const PriceListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState<Pricing[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const { pagination, handlePageChange, updateTotal } = usePagination({
    initialPageSize: 6,
  });

  // Get document icon


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
                    <PricingCard
                      key={card._id}
                      pricing={card}
                      variant="user"
                      onDownload={handleDownload}
                    />
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
