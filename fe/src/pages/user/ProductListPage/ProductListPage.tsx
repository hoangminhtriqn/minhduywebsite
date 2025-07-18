import {
  EyeOutlined,
  FilterOutlined,
  HeartOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  notification,
  Row,
  Skeleton,
  Slider,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/api/config";
import { Product } from "@/api/types";
import PageBanner from "@/components/PageBanner";
import { PaginationWrapper, usePagination } from "@/components/pagination";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import useScrollToTop from "@/hooks/useScrollToTop";
import { ROUTERS } from "@/utils/constant";
import styles from "./ProductListPage.module.scss";

const { Text } = Typography;

interface Category {
  _id: string;
  Category_Name: string;
}

interface FilterState {
  search: string;
  category: string[];
  priceRange: [number, number];
  status: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Loading skeleton component
const ProductSkeleton: React.FC = () => (
  <Card className={styles.productCard}>
    <Skeleton.Image active style={{ width: "100%", height: 240 }} />
    <div style={{ padding: 16 }}>
      <Skeleton active paragraph={{ rows: 2 }} />
      <Skeleton.Button
        active
        size="large"
        style={{ width: "100%", height: 44 }}
      />
    </div>
  </Card>
);

const ProductListPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToTop = useScrollToTop();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const { pagination, handlePageChange, updateTotal } = usePagination({
    initialPageSize: 6,
  });

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: [],
    priceRange: [0, 10000000000],
    status: [],
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 10000000000,
  ]);
  const [maxPrice, setMaxPrice] = useState(10000000000);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.category.length > 0)
        params.append("category", filters.category.join(","));
      if (filters.status.length > 0)
        params.append("status", filters.status.join(","));
      if (filters.priceRange[0] > 0)
        params.append("minPrice", filters.priceRange[0].toString());
      if (filters.priceRange[1] < maxPrice)
        params.append("maxPrice", filters.priceRange[1].toString());

      const response = await axios.get(`${API_BASE_URL}/xe?${params}`);

      setProducts(response.data.products);
      updateTotal(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách xe.",
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/danh-muc`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch max price for slider
  const fetchMaxPrice = async () => {
    try {
      // Tạm thời sử dụng giá trị mặc định vì API chưa có endpoint max-price
      const max = 10000000000; // 10 tỷ VNĐ
      setMaxPrice(max);
      setPriceRange([0, max]);
      setFilters((prev) => ({ ...prev, priceRange: [0, max] }));
    } catch (error) {
      console.error("Error fetching max price:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMaxPrice();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.current, pagination.pageSize, filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    handlePageChange(1);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    handleFilterChange("priceRange", value);
  };

  const handleSearch = (value: string) => {
    handleFilterChange("search", value);
  };

  const handleCategoryChange = (value: string[]) => {
    handleFilterChange("category", value);
  };

  const handleStatusChange = (value: string[]) => {
    handleFilterChange("status", value);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    handleFilterChange("sortBy", sortBy);
    handleFilterChange("sortOrder", sortOrder as "asc" | "desc");
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: [],
      priceRange: [0, maxPrice],
      status: [],
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPriceRange([0, maxPrice]);
    handlePageChange(1);
  };

  // Handle favorites
  const handleToggleFavorite = (productId: string) => {
    if (!user) {
      notification.warning({
        message: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thêm xe vào yêu thích",
      });
      return;
    }

    const isFavorite = favorites.some((fav) => fav.ProductID._id === productId);
    if (isFavorite) {
      const favoriteItem = favorites.find(
        (fav) => fav.ProductID._id === productId
      );
      if (favoriteItem) {
        removeFromFavorites(favoriteItem._id);
      }
    } else {
      addToFavorites(productId);
    }
  };

  // Desktop Filter sidebar
  const FilterSidebar = () => (
    <div className={styles.filterSidebar}>
      <div className={styles.filterSection}>
        {/* Search */}
        <div className={styles.filterItem}>
          <div className={styles.filterLabel}>Tìm kiếm</div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm xe..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
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
              handleCategoryChange(selectedOptions);
            }}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.Category_Name}
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
              value={priceRange}
              onChange={(value: number | number[]) => {
                if (
                  Array.isArray(value) &&
                  value.length === 2 &&
                  value[0] !== undefined &&
                  value[1] !== undefined &&
                  value[0] !== null &&
                  value[1] !== null
                ) {
                  handlePriceRangeChange([value[0], value[1]]);
                }
              }}
              tipFormatter={(value) =>
                value ? `${(value / 1000000).toFixed(1)}M VNĐ` : ""
              }
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
                {`${(priceRange[0] / 1000000).toFixed(1)}M - ${(priceRange[1] / 1000000).toFixed(1)}M VNĐ`}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className={styles.filterItem}>
          <div className={styles.filterLabel}>Trạng thái</div>
          <div className={styles.checkboxGroup}>
            {[
              { label: "Còn hạn chạy thử", value: "active" },
              { label: "Hết hạn chạy thử", value: "expired" },
            ].map((option) => (
              <div
                key={option.value}
                className={styles.checkboxItem}
                onClick={() => {
                  const newStatus = filters.status.includes(option.value)
                    ? filters.status.filter((s) => s !== option.value)
                    : [...filters.status, option.value];
                  handleStatusChange(newStatus);
                }}
              >
                <div
                  className={`${styles.customCheckbox} ${filters.status.includes(option.value) ? styles.checked : ""}`}
                />
                <span className={styles.checkboxLabel}>{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className={styles.filterItem}>
          <div className={styles.filterLabel}>Sắp xếp</div>
          <select
            className={styles.selectInput}
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="Price-asc">Giá: Thấp đến cao</option>
            <option value="Price-desc">Giá: Cao đến thấp</option>
            <option value="Product_Name-asc">Tên: A-Z</option>
            <option value="TestDriveEndDate-asc">Hạn chạy thử: Gần nhất</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button className={styles.clearButton} onClick={clearFilters}>
          <span>
            <ReloadOutlined style={{ marginRight: 8 }} />
            Xóa bộ lọc
          </span>
        </button>
      </div>
    </div>
  );

  // Mobile Filter sidebar with Header-like styling
  const MobileFilterSidebar = () => {
    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth > 768 && windowWidth <= 1024;

    // Header-like styles for mobile filter
    const filterItemStyle: React.CSSProperties = {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: "16px",
      padding: isMobile ? "16px 20px" : "20px 24px",
      marginBottom: "16px",
      border: "1px solid rgba(0, 0, 0, 0.08)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    };

    const filterLabelStyle: React.CSSProperties = {
      color: "var(--theme-text-primary)",
      fontWeight: 600,
      fontSize: isMobile ? "14px" : "16px",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    };

    const searchContainerStyle: React.CSSProperties = {
      position: "relative",
      display: "flex",
      alignItems: "center",
    };

    const searchInputStyle: React.CSSProperties = {
      width: "100%",
      border: "2px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "12px",
      padding: isMobile ? "12px 16px" : "14px 18px",
      fontSize: isMobile ? "14px" : "16px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      outline: "none",
      transition: "all 0.3s ease",
      height: isMobile ? "44px" : "48px",
    };

    const searchButtonStyle: React.CSSProperties = {
      position: "absolute",
      right: "4px",
      width: isMobile ? "36px" : "40px",
      height: isMobile ? "36px" : "40px",
      borderRadius: "10px",
      background: "var(--primary-gradient)",
      border: "none",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
    };

    const selectInputStyle: React.CSSProperties = {
      width: "100%",
      border: "2px solid rgba(0, 0, 0, 0.08)",
      borderRadius: "12px",
      padding: isMobile ? "12px 16px" : "14px 18px",
      fontSize: isMobile ? "14px" : "16px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      outline: "none",
      transition: "all 0.3s ease",
      minHeight: isMobile ? "44px" : "48px",
      cursor: "pointer",
    };

    const priceSliderStyle: React.CSSProperties = {
      margin: "16px 0",
    };

    const priceRangeStyle: React.CSSProperties = {
      textAlign: "center",
      marginTop: "16px",
      padding: isMobile ? "10px 16px" : "12px 20px",
      backgroundColor: "rgba(var(--primary-color-rgb), 0.1)",
      borderRadius: "12px",
      border: "2px solid rgba(var(--primary-color-rgb), 0.3)",
      boxShadow: "0 2px 8px rgba(var(--primary-color-rgb), 0.2)",
    };

    const priceTextStyle: React.CSSProperties = {
      color: "var(--theme-text-primary)",
      fontWeight: 600,
      margin: 0,
      fontSize: isMobile ? "14px" : "16px",
    };

    const checkboxGroupStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    };

    const checkboxItemStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      padding: isMobile ? "12px 16px" : "14px 18px",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      border: "2px solid transparent",
      cursor: "pointer",
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      minHeight: isMobile ? "44px" : "48px",
    };

    const customCheckboxStyle: React.CSSProperties = {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(0, 0, 0, 0.2)",
      borderRadius: "4px",
      marginRight: "12px",
      position: "relative",
      transition: "all 0.3s ease",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      flexShrink: 0,
    };

    const checkboxLabelStyle: React.CSSProperties = {
      fontWeight: 500,
      color: "var(--theme-text-primary)",
      flex: 1,
      fontSize: isMobile ? "14px" : "15px",
    };

    const clearButtonStyle: React.CSSProperties = {
      width: "100%",
      borderRadius: "12px",
      height: isMobile ? "48px" : "52px",
      fontWeight: 600,
      fontSize: isMobile ? "15px" : "16px",
      border: "2px solid var(--primary-color)",
      background: "transparent",
      color: "var(--primary-color)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      marginTop: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    };

    // Event handlers for hover effects
    const handleSearchInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = "var(--primary-color)";
      e.target.style.boxShadow =
        "0 0 0 3px rgba(var(--primary-color-rgb), 0.2)";
    };

    const handleSearchInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = "rgba(0, 0, 0, 0.08)";
      e.target.style.boxShadow = "none";
    };

    const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      e.target.style.borderColor = "var(--primary-color)";
      e.target.style.boxShadow =
        "0 0 0 3px rgba(var(--primary-color-rgb), 0.2)";
    };

    const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      e.target.style.borderColor = "rgba(0, 0, 0, 0.08)";
      e.target.style.boxShadow = "none";
    };

    const handleCheckboxHover = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor =
        "rgba(var(--primary-color-rgb), 0.1)";
      e.currentTarget.style.borderColor = "rgba(var(--primary-color-rgb), 0.3)";
      e.currentTarget.style.transform = "translateX(4px)";
    };

    const handleCheckboxLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      e.currentTarget.style.borderColor = "transparent";
      e.currentTarget.style.transform = "translateX(0)";
    };

    const handleClearButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = "var(--primary-color)";
      e.currentTarget.style.color = "#ffffff";
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow =
        "0 6px 16px rgba(var(--primary-color-rgb), 0.3)";
    };

    const handleClearButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "var(--primary-color)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    };

    return (
      <div style={{ padding: "0 4px" }}>
        {/* Search */}
        <div style={filterItemStyle}>
          <div style={filterLabelStyle}>
            <span style={{ color: "var(--primary-color)", marginRight: "8px" }}>
              🔍
            </span>
            Tìm kiếm
          </div>
          <div style={searchContainerStyle}>
            <input
              type="text"
              style={searchInputStyle}
              placeholder="Tìm kiếm xe..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
            />
            <button style={searchButtonStyle}>
              <SearchOutlined />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div style={filterItemStyle}>
          <div style={filterLabelStyle}>
            <span style={{ color: "var(--primary-color)", marginRight: "8px" }}>
              📂
            </span>
            Danh mục
          </div>
          <select
            style={selectInputStyle}
            multiple
            value={filters.category}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              handleCategoryChange(selectedOptions);
            }}
            onFocus={handleSelectFocus}
            onBlur={handleSelectBlur}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.Category_Name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div style={filterItemStyle}>
          <div style={filterLabelStyle}>
            <span style={{ color: "var(--primary-color)", marginRight: "8px" }}>
              💰
            </span>
            Khoảng giá
          </div>
          <div style={priceSliderStyle}>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={priceRange}
              onChange={(value: number | number[]) => {
                if (
                  Array.isArray(value) &&
                  value.length === 2 &&
                  value[0] !== undefined &&
                  value[1] !== undefined &&
                  value[0] !== null &&
                  value[1] !== null
                ) {
                  handlePriceRangeChange([value[0], value[1]]);
                }
              }}
              tipFormatter={(value) =>
                value ? `${(value / 1000000).toFixed(1)}M VNĐ` : ""
              }
              trackStyle={[{ backgroundColor: "var(--primary-color)" }]}
              handleStyle={[
                {
                  borderColor: "var(--primary-color)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                },
                {
                  borderColor: "var(--primary-color)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                },
              ]}
              railStyle={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            />
            <div style={priceRangeStyle}>
              <div style={priceTextStyle}>
                {`${(priceRange[0] / 1000000).toFixed(1)}M - ${(priceRange[1] / 1000000).toFixed(1)}M VNĐ`}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={filterItemStyle}>
          <div style={filterLabelStyle}>
            <span style={{ color: "var(--primary-color)", marginRight: "8px" }}>
              📊
            </span>
            Trạng thái
          </div>
          <div style={checkboxGroupStyle}>
            {[
              { label: "Còn hạn chạy thử", value: "active" },
              { label: "Hết hạn chạy thử", value: "expired" },
            ].map((option) => (
              <div
                key={option.value}
                style={checkboxItemStyle}
                onClick={() => {
                  const newStatus = filters.status.includes(option.value)
                    ? filters.status.filter((s) => s !== option.value)
                    : [...filters.status, option.value];
                  handleStatusChange(newStatus);
                }}
                onMouseEnter={handleCheckboxHover}
                onMouseLeave={handleCheckboxLeave}
              >
                <div
                  style={{
                    ...customCheckboxStyle,
                    backgroundColor: filters.status.includes(option.value)
                      ? "var(--primary-color)"
                      : "rgba(255, 255, 255, 0.8)",
                    borderColor: filters.status.includes(option.value)
                      ? "var(--primary-color)"
                      : "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {filters.status.includes(option.value) && (
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span style={checkboxLabelStyle}>{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div style={filterItemStyle}>
          <div style={filterLabelStyle}>
            <span style={{ color: "var(--primary-color)", marginRight: "8px" }}>
              🔄
            </span>
            Sắp xếp
          </div>
          <select
            style={selectInputStyle}
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
            onFocus={handleSelectFocus}
            onBlur={handleSelectBlur}
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="Price-asc">Giá: Thấp đến cao</option>
            <option value="Price-desc">Giá: Cao đến thấp</option>
            <option value="Product_Name-asc">Tên: A-Z</option>
            <option value="TestDriveEndDate-asc">Hạn chạy thử: Gần nhất</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          style={clearButtonStyle}
          onClick={clearFilters}
          onMouseEnter={handleClearButtonHover}
          onMouseLeave={handleClearButtonLeave}
        >
          <ReloadOutlined />
          Xóa bộ lọc
        </button>
      </div>
    );
  };

  // Loading overlay
  if (initialLoading) {
    return (
      <div className={styles.productListPage}>
        <PageBanner
          title="Danh sách xe đang có"
          subtitle="Khám phá các dòng xe từ hệ thống"
        />

        <div className={styles.container}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              flexDirection: "column",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
            />
            <p style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
              Đang tải trang...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productListPage}>
      {/* Header */}
      <PageBanner
        title="Danh sách xe đang có"
        subtitle="Khám phá các dòng xe từ hệ thống"
      />

      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          {/* Filters Sidebar - Desktop */}
          <Col xs={0} sm={0} md={8} lg={7} xl={6}>
            <FilterSidebar />
          </Col>

          {/* Main Content */}
          <Col xs={24} sm={24} md={16} lg={17} xl={18}>
            {/* Mobile Filter Button */}
            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
              <div className={styles.mobileFilters}>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                  onClick={() => setFiltersVisible(true)}
                  block
                  size="large"
                  style={{
                    height: 56,
                    borderRadius: 16,
                    fontSize: 16,
                    fontWeight: 600,
                    background: "var(--primary-gradient)",
                    border: "none",
                    boxShadow: "0 6px 20px var(--theme-shadow)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Bộ lọc & Sắp xếp
                </Button>
              </div>
            </Col>

            {/* Results Summary */}
            <div className={styles.resultsSummary}>
              <Space wrap>
                <Text>
                  Hiển thị <strong>{products.length}</strong> trong tổng số{" "}
                  <strong>{pagination.total}</strong> xe
                </Text>
                {filters.search && (
                  <Tag
                    style={{
                      backgroundColor: "var(--theme-info)",
                      color: "var(--theme-text-white)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "6px 16px",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px var(--theme-shadow)",
                    }}
                  >
                    Tìm kiếm: "{filters.search}"
                  </Tag>
                )}
                {filters.category.length > 0 && (
                  <Tag
                    style={{
                      backgroundColor: "var(--theme-success)",
                      color: "var(--theme-text-white)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "6px 16px",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px var(--theme-shadow)",
                    }}
                  >
                    Danh mục: {filters.category.length} đã chọn
                  </Tag>
                )}
                {filters.status.length > 0 && (
                  <Tag
                    style={{
                      backgroundColor: "var(--theme-warning)",
                      color: "var(--theme-text-white)",
                      border: "none",
                      borderRadius: "20px",
                      padding: "6px 16px",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px var(--theme-shadow)",
                    }}
                  >
                    Trạng thái: {filters.status.length} đã chọn
                  </Tag>
                )}
              </Space>
            </div>

            {/* Products Grid */}
            <Spin
              spinning={loading}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              tip="Đang tải xe..."
            >
              {products.length > 0 ? (
                <Row gutter={[20, 20]}>
                  {products.map((product) => (
                    <Col xs={24} sm={12} md={8} key={product._id}>
                      <Link
                        to={`${ROUTERS.USER.CARS}/${product._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card
                          hoverable
                          className={styles.productCard}
                          cover={
                            <div className={styles.productImage}>
                              <img
                                alt={product.Product_Name}
                                src={product.Main_Image}
                                loading="lazy"
                              />
                              <div className={styles.productActions}>
                                <Space>
                                  <Tooltip title="Xem chi tiết">
                                    <Button
                                      type="primary"
                                      shape="circle"
                                      icon={<EyeOutlined />}
                                      size="small"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        navigate(
                                          `${ROUTERS.USER.CARS}/${product._id}`
                                        );
                                      }}
                                    />
                                  </Tooltip>
                                  <Tooltip
                                    title={
                                      favorites.some(
                                        (fav) =>
                                          fav.ProductID._id === product._id
                                      )
                                        ? "Bỏ yêu thích"
                                        : "Thêm yêu thích"
                                    }
                                  >
                                    <Button
                                      type={
                                        favorites.some(
                                          (fav) =>
                                            fav.ProductID._id === product._id
                                        )
                                          ? "primary"
                                          : "default"
                                      }
                                      shape="circle"
                                      icon={<HeartOutlined />}
                                      size="small"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleToggleFavorite(product._id);
                                      }}
                                    />
                                  </Tooltip>
                                </Space>
                              </div>
                              {product.Status === "expired" && (
                                <div className={styles.outOfStock}>
                                  <Tag
                                    style={{
                                      backgroundColor: "var(--theme-error)",
                                      color: "var(--theme-text-white)",
                                      border: "none",
                                      borderRadius: "20px",
                                      padding: "8px 16px",
                                      fontWeight: 600,
                                      boxShadow:
                                        "0 4px 12px var(--theme-shadow)",
                                    }}
                                  >
                                    Hết hạn chạy thử
                                  </Tag>
                                </div>
                              )}
                              {product.Status === "active" &&
                                new Date(product.TestDriveEndDate) <
                                  new Date() && (
                                  <div className={styles.lowStock}>
                                    <Tag
                                      style={{
                                        backgroundColor: "var(--theme-warning)",
                                        color: "var(--theme-text-white)",
                                        border: "none",
                                        borderRadius: "20px",
                                        padding: "8px 16px",
                                        fontWeight: 600,
                                        boxShadow:
                                          "0 4px 12px var(--theme-shadow)",
                                      }}
                                    >
                                      Sắp hết hạn
                                    </Tag>
                                  </div>
                                )}
                            </div>
                          }
                          actions={[]}
                        >
                          <Card.Meta
                            title={
                              <div className={styles.productTitle}>
                                <Text strong>{product.Product_Name}</Text>
                                {favorites.some(
                                  (fav) => fav.ProductID._id === product._id
                                ) && (
                                  <HeartOutlined
                                    style={{ color: "#ff4d4f", marginLeft: 8 }}
                                  />
                                )}
                              </div>
                            }
                            description={
                              <div className={styles.productMeta}>
                                <div className={styles.productPrice}>
                                  <Text
                                    strong
                                    style={{
                                      fontSize: 18,
                                      color: "var(--primary-color)",
                                    }}
                                  >
                                    {product.Price.toLocaleString("vi-VN")} VNĐ
                                  </Text>
                                </div>
                                <div className={styles.productSpecs}>
                                  <Text type="secondary">
                                    Chạy thử:{" "}
                                    {new Date(
                                      product.TestDriveStartDate
                                    ).toLocaleDateString("vi-VN")}{" "}
                                    -{" "}
                                    {new Date(
                                      product.TestDriveEndDate
                                    ).toLocaleDateString("vi-VN")}
                                  </Text>
                                  {product.CategoryID && (
                                    <Tag
                                      style={{
                                        backgroundColor: "var(--theme-info)",
                                        color: "var(--theme-text-white)",
                                        border: "none",
                                        borderRadius: "12px",
                                        padding: "4px 12px",
                                        fontSize: "0.8rem",
                                        fontWeight: 500,
                                        boxShadow:
                                          "0 2px 8px var(--theme-shadow-light)",
                                      }}
                                    >
                                      {typeof product.CategoryID === "string"
                                        ? product.CategoryID
                                        : (product.CategoryID as any)
                                            ?.Category_Name || "N/A"}
                                    </Tag>
                                  )}
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty
                  description={
                    <div>
                      <Text style={{ fontSize: 16, color: "#666" }}>
                        Không tìm thấy xe nào phù hợp với bộ lọc
                      </Text>
                      <br />
                      <Button
                        type="primary"
                        onClick={clearFilters}
                        style={{ marginTop: 16 }}
                      >
                        Xóa bộ lọc
                      </Button>
                    </div>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Spin>

            {/* Pagination */}
            {pagination.total > 0 && (
              <PaginationWrapper
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showTotal
                totalText="{start}-{end} của {total} xe"
              />
            )}
          </Col>
        </Row>
      </div>

      {/* Mobile Filters Drawer */}
      <div className={styles.mobileFilterDrawer}>
        <Drawer
          placement="right"
          onClose={() => setFiltersVisible(false)}
          open={filtersVisible}
          width="85%"
          zIndex={10000}
          closable={false}
          styles={{
            body: {
              padding: "24px",
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            },
            mask: {
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
            },
            wrapper: {
              zIndex: 10000,
            },
          }}
        >
          <MobileFilterSidebar />
        </Drawer>
      </div>
    </div>
  );
};

export default ProductListPage;
