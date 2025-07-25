import { API_BASE_URL } from "@/api/config";
import { Product } from "@/api/types";
import PageBanner from "@/components/PageBanner";
import { PaginationWrapper, usePagination } from "@/components/pagination";
import { PageSEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ROUTERS } from "@/utils/constant";
import {
  EyeOutlined,
  FilterOutlined,
  HeartOutlined,
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
  Tag,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.scss";
import { PageKeys } from "@/components/SEO/seoConfig";
import FilterSidebar from "./FilterSidebar";
import { productService } from "@/api/services/user/product";

const { Text } = Typography;

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

// Product Card Skeleton Component
const ProductCardSkeleton: React.FC = () => (
  <Card
    className={styles.productCard}
    cover={
      <div className={styles.productImage}>
        <div
          style={{
            width: "100%",
            height: "220px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        ></div>
      </div>
    }
  >
    <Skeleton active paragraph={{ rows: 2 }} title={{ width: "80%" }} />
  </Card>
);

// Product Cards Skeleton Grid
const ProductCardsSkeleton: React.FC = () => (
  <Row gutter={[20, 20]}>
    {Array.from({ length: 6 }).map((_, index) => (
      <Col xs={24} sm={12} md={8} key={index}>
        <ProductCardSkeleton />
      </Col>
    ))}
  </Row>
);

const ProductListPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
    priceRange: [0, 1000000000],
    status: [],
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 1000000000,
  ]);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Debounce states
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<
    [number, number]
  >([0, 1000000000]);

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setFilters((prev) => ({
        ...prev,
        category: [categoryFromUrl],
      }));
    }
  }, [searchParams]);

  // Debounce effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(filters.priceRange);
    }, 300); // 300ms delay for price range

    return () => clearTimeout(timer);
  }, [filters.priceRange]);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API với params filter, page, limit
      const response = await productService.getAllProducts({
        page: pagination.current,
        limit: pagination.pageSize,
        search: debouncedSearch,
        category: filters.category.join(","),
        minPrice: debouncedPriceRange[0],
        maxPrice: debouncedPriceRange[1],
        status: filters.status.join(","),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setProducts(response.products);
      updateTotal(response.pagination.total || response.products.length);
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách sản phẩm.",
      });
    } finally {
      setLoading(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [
    debouncedSearch,
    debouncedPriceRange,
    filters.category,
    filters.status,
    filters.sortBy,
    filters.sortOrder,
    pagination.current,
    pagination.pageSize,
    initialLoading,
    updateTotal,
  ]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Trigger fetch when debounced values change (but not on initial load)
  useEffect(() => {
    if (!initialLoading) {
      fetchProducts();
    }
  }, [
    debouncedSearch,
    debouncedPriceRange,
    filters.category,
    filters.status,
    filters.sortBy,
    filters.sortOrder,
    pagination.current,
    pagination.pageSize,
    initialLoading,
    fetchProducts,
  ]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/filter`);
      const allCategories = response.data.data || response.data || [];
      // Chỉ lấy categories cha (ParentID là null)
      const parentCategories = allCategories.filter(
        (category: Category) => category.ParentID === null
      );
      setCategories(parentCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch max price for slider
  const fetchMaxPrice = async () => {
    try {
      // Tạm thời sử dụng giá trị mặc định vì API chưa có endpoint max-price
      const max = 1000000000; // 1 tỷ VNĐ
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

  // Handle filter changes
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[] | [number, number]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    handlePageChange(1);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setFilters((prev) => ({ ...prev, priceRange: value }));
    handlePageChange(1);
  };

  const handleSearch = (value: string) => {
    handleFilterChange("search", value);
  };

  const handleCategoryChange = (value: string[]) => {
    handleFilterChange("category", value);

    // Update URL parameters
    if (value.length > 0) {
      setSearchParams({ category: value[0] });
    } else {
      setSearchParams({});
    }
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
    setSearchParams({}); // Clear URL parameters
    handlePageChange(1);
  };

  // Handle favorites
  const handleToggleFavorite = (productId: string) => {
    if (!user) {
      notification.warning({
        message: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào yêu thích",
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

  // Desktop Filter sidebar component is now imported from FilterSidebar.tsx

  // Mobile Filter sidebar with Header-like styling
  const MobileFilterSidebar = () => {
    const isMobile = windowWidth <= 768;

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
              placeholder="Tìm kiếm sản phẩm..."
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
                {category.Name}
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
              tooltip={{
                formatter: (value) =>
                  value ? `${Math.round(value / 1000000)}M VNĐ` : "",
              }}
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
                {`${Math.round(priceRange[0] / 1000000)}M - ${Math.round(priceRange[1] / 1000000)}M VNĐ`}
              </div>
            </div>
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
          title="Danh sách sản phẩm"
          subtitle="Khám phá các sản phẩm từ hệ thống"
        />

        <div className={styles.container}>
          <Row gutter={[24, 24]}>
            {/* Filters Sidebar - Desktop */}
            <Col xs={0} sm={0} md={8} lg={7} xl={6}>
              <Skeleton
                active
                paragraph={{ rows: 8 }}
                title={{ width: "60%" }}
                style={{
                  background: "var(--theme-bg-paper)",
                  borderRadius: "24px",
                  padding: "32px",
                  boxShadow: "0 8px 32px 0 var(--theme-shadow)",
                  backdropFilter: "blur(15px)",
                  border: "1.5px solid var(--theme-border-light)",
                }}
              />
            </Col>

            {/* Main Content */}
            <Col xs={24} sm={24} md={16} lg={17} xl={18}>
              {/* Mobile Filter Button Skeleton */}
              <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                <Skeleton.Button
                  active
                  size="large"
                  style={{
                    width: "100%",
                    height: 56,
                    borderRadius: 16,
                  }}
                />
              </Col>

              {/* Results Summary Skeleton */}
              <div style={{ marginBottom: 24 }}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 200, height: 20 }}
                />
              </div>

              {/* Products Grid Skeleton */}
              <ProductCardsSkeleton />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO for Product List Page */}
      <PageSEO pageKey={PageKeys.PRODUCTS} />

      <div className={styles.productListPage}>
        {/* Header */}
        <PageBanner
          title="Danh sách sản phẩm"
          subtitle="Khám phá các sản phẩm từ hệ thống"
        />

        <div className={styles.container}>
          <Row gutter={[24, 24]}>
            {/* Filters Sidebar - Desktop */}
            <Col xs={0} sm={0} md={8} lg={7} xl={6}>
              <FilterSidebar
                filters={filters}
                categories={categories}
                priceRange={priceRange}
                maxPrice={maxPrice}
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                onSortChange={handleSortChange}
                onClearFilters={clearFilters}
              />
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
                    <strong>{pagination.total}</strong> sản phẩm
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
                      Tìm kiếm: &quot;{filters.search}&quot;
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
                </Space>
              </div>

              {/* Products Grid */}
              {loading ? (
                <ProductCardsSkeleton />
              ) : products.length > 0 ? (
                <Row gutter={[20, 20]}>
                  {products.map((product) => (
                    <Col xs={24} sm={12} md={8} key={product._id}>
                      <Link
                        to={`${ROUTERS.USER.PRODUCTS}/${product._id}`}
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
                                          `${ROUTERS.USER.PRODUCTS}/${product._id}`
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
                                    style={{
                                      color: "#ff4d4f",
                                      marginLeft: 8,
                                    }}
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
                                  {product.CategoryID && (
                                    <Tag
                                      style={{
                                        backgroundColor: "var(--primary-color)",
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
                                        : (
                                            product.CategoryID as unknown as Category
                                          )?.Name || "N/A"}
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
                        Không tìm thấy sản phẩm nào phù hợp với bộ lọc
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

              {/* Pagination */}
              {pagination.total > 0 && (
                <PaginationWrapper
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  showTotal
                  totalText="{start}-{end} của {total} sản phẩm"
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
    </>
  );
};

export default ProductListPage;
