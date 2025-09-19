import PageBanner from "@/components/PageBanner";
import { PaginationWrapper, usePagination } from "@/components/pagination";

import { Input, Spin } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllPricing, Pricing } from "@/api/services/user/pricing";
import PricingCard from "@/components/PricingCard";
import styles from "./styles.module.scss";

const PriceListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState<Pricing[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState("");

  const { pagination, handlePageChange, updateTotal } = usePagination({
    initialPageSize: 6,
  });

  // Get document icon

  // No handlers needed; links open directly in PricingCard

  // Fetch pricing data from API
  const { current, pageSize } = pagination;

  const fetchPricingData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllPricing({
        page: current,
        limit: pageSize,
        search: searchText || undefined,
      });

      // API returns data in response.data.docs
      if (response.data && Array.isArray(response.data.docs)) {
        setPricingData(response.data.docs);
        setTotalItems(response.data.totalDocs);
        updateTotal(response.data.totalDocs);
      } else {
        setPricingData([]);
      }
    } catch {
      // silently fail; UI shows empty list
      setPricingData([]);
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, searchText, updateTotal]);

  // Initialize data
  useEffect(() => {
    fetchPricingData();
  }, [fetchPricingData]);

  // Handle page change
  const handlePageChangeWithScroll = (page: number, pageSize?: number) => {
    handlePageChange(page, pageSize);
  };

  // Debounced change handler
  const debounceDelay = 400;
  const debouncedSetSearch = useMemo(() => {
    let timeout: number | undefined;
    return (value: string) => {
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        setSearchText(value.trim());
        handlePageChange(1, pagination.pageSize);
      }, debounceDelay);
    };
  }, [pagination.pageSize, handlePageChange]);

  const handleSearch = (value: string) => {
    debouncedSetSearch(value);
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
          <div className={styles["search-bar"]}>
            <Input.Search
              placeholder="Tìm kiếm bảng giá"
              allowClear
              enterButton
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              defaultValue={searchText}
              className={styles["pricing-search-input"]}
            />
          </div>
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
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PriceListPage;
