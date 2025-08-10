import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { Slider } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

// Shared price display unit to avoid hardcoding magic numbers
const PRICE_DISPLAY_UNIT = 1_000_000; // 1M VND
const PRICE_DISPLAY_SUFFIX = "M VNĐ";
const formatPriceDisplay = (value?: number | null) =>
  typeof value === "number" && !Number.isNaN(value)
    ? `${Math.round(value / PRICE_DISPLAY_UNIT)}${PRICE_DISPLAY_SUFFIX}`
    : "";

interface Category {
  _id: string;
  Name: string;
  Description?: string;
  Icon?: string;
  ParentID: null;
  Status: string;
  Order: number;
  id: string;
}

interface FilterState {
  search: string;
  category: string[];
  priceRange: [number, number];
  status: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface FilterSidebarProps {
  filters: FilterState;
  categories: Category[];
  priceRange: [number, number];
  maxPrice: number;
  onSearch: (value: string) => void;
  onCategoryChange: (value: string[]) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  priceRange,
  maxPrice,
  onSearch,
  onCategoryChange,
  onPriceRangeChange,
  onSortChange,
  onClearFilters,
}) => {
  // Debounce state for price range
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);

  // Debounce effect for price range
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 300);

    return () => clearTimeout(timer);
  }, [priceRange]);

  return (
    <div className={styles.filterSidebar}>
      <div className={styles.filterSection}>
        {/* Search */}
        <div className={styles.filterItem}>
          <div className={styles.filterLabel}>Tìm kiếm</div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
              value={filters.search}
              onChange={(e) => onSearch(e.target.value)}
            />
            <button className={styles.searchButton}>
              <SearchOutlined />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className={styles.filterItem}>
          <div className={styles.filterLabel}>Danh mục</div>
          <select
            className={styles.selectInput}
            multiple
            value={filters.category}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              onCategoryChange(selectedOptions);
            }}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className={styles.filterItem}>
          <div className={styles.filterLabel}>Khoảng giá</div>
          <div className={styles.priceSlider}>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={debouncedPriceRange}
              onChange={(value: number | number[]) => {
                if (
                  Array.isArray(value) &&
                  value.length === 2 &&
                  value[0] !== undefined &&
                  value[1] !== undefined &&
                  value[0] !== null &&
                  value[1] !== null
                ) {
                  onPriceRangeChange([value[0], value[1]]);
                }
              }}
              tooltip={{
                formatter: (value) => formatPriceDisplay(value as number),
              }}
              trackStyle={[{ backgroundColor: "var(--primary-color)" }]}
              handleStyle={[
                {
                  borderColor: "var(--primary-color)",
                  backgroundColor: "var(--theme-bg-primary)",
                  boxShadow: "0 2px 8px var(--theme-shadow)",
                },
                {
                  borderColor: "var(--primary-color)",
                  backgroundColor: "var(--theme-bg-primary)",
                  boxShadow: "0 2px 8px var(--theme-shadow)",
                },
              ]}
              railStyle={{ backgroundColor: "var(--theme-border-light)" }}
            />
            <div className={styles.priceRange}>
              <div className={styles.priceText}>
                {`${formatPriceDisplay(debouncedPriceRange[0])} - ${formatPriceDisplay(debouncedPriceRange[1])}`}
              </div>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className={styles.filterItem}>
          <div className={styles.filterLabel}>Sắp xếp</div>
          <select
            className={styles.selectInput}
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="Price-asc">Giá: Thấp đến cao</option>
            <option value="Price-desc">Giá: Cao đến thấp</option>
            <option value="Name-asc">Tên: A-Z</option>
            <option value="Name-desc">Tên: Z-A</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button className={styles.clearButton} onClick={onClearFilters}>
          <span>
            <ReloadOutlined style={{ marginRight: 8 }} />
            Xóa bộ lọc
          </span>
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
