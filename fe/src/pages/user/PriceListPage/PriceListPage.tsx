import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/api/config";
import { Product, Category } from "@/api/types";
import { PaginationWrapper, usePagination } from "@/components/pagination";
import {
  Spin,
  notification,
  Table,
  Tooltip,
  Select,
  Button,
  Tag,
  Popover,
  Checkbox,
  Row,
  Col,
  Card,
  Typography,
  Empty,
} from "antd";
import { formatCurrency } from "@/utils/format";
import {
  DownOutlined,
  UpOutlined,
  CloseOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { productService } from "@/api/services/product";
import PageBanner from "@/components/PageBanner";
import styles from "./PriceListPage.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ROUTERS } from "@/utils/constant";

const { Option } = Select;

interface PriceListItem {
  _id: string;
  Product_Name: string;
  Price: number;
  CategoryID: string;
  Main_Image: string;
  Variant?: string;
  Discount?: string;
}

const PriceListPage: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceData, setPriceData] = useState<PriceListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<PriceListItem[]>([]);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const { pagination, handlePageChange, updateTotal } = usePagination({
    initialPageSize: 10,
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Custom handlePageChange with scroll to top
  const handlePageChangeWithScroll = (page: number, pageSize?: number) => {
    // Simple, single scroll to top
    window.scrollTo(0, 0);

    // Call original handlePageChange
    handlePageChange(page, pageSize);

    // Update current page state
    setCurrentPage(page);
  };

  // Update URL with current filters
  const updateURLWithFilters = (filters: string[]) => {
    const searchParams = new URLSearchParams(location.search);

    if (filters.length > 0) {
      // Add filters to URL
      searchParams.set("filters", filters.join(","));
    } else {
      // Remove filters from URL
      searchParams.delete("filters");
    }

    const newUrl = searchParams.toString()
      ? `${location.pathname}?${searchParams.toString()}`
      : location.pathname;

    navigate(newUrl, { replace: true });
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/danh-muc`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch price data from API
  const fetchPriceData = async () => {
    setLoading(true);
    try {
      // Lấy toàn bộ dữ liệu từ API
      const response = await axios.get(`${API_BASE_URL}/xe`, {
        params: {
          status: "active", // Chỉ lấy xe đang hoạt động
          limit: 1000, // Lấy tất cả dữ liệu
        },
      });

      const products = response.data.products || [];
      const priceListData: PriceListItem[] = products.map(
        (product: Product) => ({
          _id: product._id,
          Product_Name: product.Product_Name,
          Price: product.Price,
          CategoryID: product.CategoryID,
          Main_Image: product.Main_Image,
          Variant: extractVariantFromName(product.Product_Name),
          Discount: generateDiscountForProduct(product),
        })
      );

      setPriceData(priceListData);
      setFilteredData(priceListData);
      updateTotal(priceListData.length);
    } catch (error) {
      console.error("Error fetching price data:", error);
      notification.error({
        message: "Lỗi tải dữ liệu",
        description: "Không thể tải bảng giá xe. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Extract variant from product name
  const extractVariantFromName = (productName: string): string => {
    const variants = [
      "Sport Line",
      "Luxury",
      "M Sport",
      "Executive",
      "Premium",
      "Comfort",
      "Dynamic",
      "Exclusive",
    ];
    const foundVariant = variants.find((variant) =>
      productName.includes(variant)
    );
    return foundVariant || "Standard";
  };

  // Generate discount based on product price and series
  const generateDiscountForProduct = (product: Product): string => {
    const productName = product.Product_Name.toLowerCase();
    const price = product.Price;

    // Logic discount dựa trên series và giá
    if (
      productName.includes("m series") ||
      productName.includes("m3") ||
      productName.includes("m4") ||
      productName.includes("m5")
    ) {
      return "Ưu đãi 2%";
    } else if (
      productName.includes("i series") ||
      productName.includes("i3") ||
      productName.includes("i4") ||
      productName.includes("ix")
    ) {
      return "Ưu đãi 7%";
    } else if (price > 5000000000) {
      return "Ưu đãi 3%";
    } else if (price > 3000000000) {
      return "Ưu đãi 5%";
    } else {
      return "Ưu đãi 5%";
    }
  };

  // Filter data based on selected filters
  const filterData = (data: PriceListItem[], filters: string[]) => {
    if (filters.length === 0) return data;

    return data.filter((item) => {
      // Kiểm tra từng filter
      return filters.some((filter) => {
        // Tìm category theo filter
        const selectedCategory = categories.find(
          (cat) =>
            cat.Category_Name &&
            cat.Category_Name.toLowerCase().includes(filter.toLowerCase())
        );

        if (selectedCategory && selectedCategory.Category_Name) {
          // So sánh CategoryID nếu có, hoặc tìm trong tên sản phẩm
          if (item.CategoryID === selectedCategory._id) {
            return true;
          }

          // Fallback: tìm trong tên sản phẩm
          const productName = item.Product_Name.toLowerCase();
          const categoryName = selectedCategory.Category_Name.toLowerCase();
          return productName.includes(categoryName);
        }

        // Fallback cho các filter đặc biệt
        const specialFilters: { [key: string]: string[] } = {
          sedan: ["series 1", "series 3", "series 5", "series 7"],
          suv: ["x series", "x1", "x2", "x3", "x4", "x5", "x6", "x7"],
          coupe: ["series 2", "series 4", "series 6", "series 8"],
          m: ["m series", "m2", "m3", "m4", "m5", "m8"],
          i: ["i series", "i3", "i4", "ix", "i7"],
        };

        const allowedKeywords = specialFilters[filter] || [];
        const productName = item.Product_Name.toLowerCase();
        return allowedKeywords.some((keyword) =>
          productName.includes(keyword.toLowerCase())
        );
      });
    });
  };

  // New function to fetch data with filters
  const fetchPriceDataWithFilters = async (filters: string[]) => {
    try {
      setLoading(true);

      // Build query parameters based on filters
      const params: any = {
        status: "active",
        limit: 1000,
      };

      // Add category filters if any
      if (filters.length > 0) {
        // Map filter keys to actual category names or IDs
        const categoryFilters = filters.map((filterKey) => {
          // Find matching category
          const category = categories.find(
            (cat) =>
              cat.Category_Name &&
              cat.Category_Name.toLowerCase().includes(filterKey.toLowerCase())
          );

          if (category) {
            return category._id; // Use category ID for API call
          }

          // Handle special filters
          const specialFilters: { [key: string]: string } = {
            m: "M Series",
            i: "i Series",
          };

          return specialFilters[filterKey] || filterKey;
        });

        // Add category filter to params
        if (categoryFilters.length > 0) {
          params.category = categoryFilters.join(",");
        }
      }

      const response = await axios.get(`${API_BASE_URL}/xe`, { params });

      const products = response.data.products || [];
      const priceListData: PriceListItem[] = products.map(
        (product: Product) => ({
          _id: product._id,
          Product_Name: product.Product_Name,
          Price: product.Price,
          CategoryID: product.CategoryID,
          Main_Image: product.Main_Image,
          Variant: extractVariantFromName(product.Product_Name),
          Discount: generateDiscountForProduct(product),
        })
      );

      setPriceData(priceListData);
      setFilteredData(priceListData);
      updateTotal(priceListData.length);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      notification.error({
        message: "Lỗi tải dữ liệu",
        description:
          "Không thể tải dữ liệu với bộ lọc đã chọn. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (values: string[]) => {
    setSelectedFilters(values);
    setCurrentPage(1);
    // Reset pagination to page 1
    handlePageChangeWithScroll(1, pagination.pageSize);
    // Update URL with filters
    updateURLWithFilters(values);
    // Call API with new filters
    fetchPriceDataWithFilters(values);
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setCurrentPage(1);
    // Reset pagination to page 1
    handlePageChangeWithScroll(1, pagination.pageSize);
    // Update URL
    updateURLWithFilters([]);
    // Call API without filters
    fetchPriceDataWithFilters([]);
  };

  const removeFilter = (filterToRemove: string) => {
    const newFilters = selectedFilters.filter((f) => f !== filterToRemove);
    setSelectedFilters(newFilters);
    setCurrentPage(1);
    // Reset pagination to page 1
    handlePageChangeWithScroll(1, pagination.pageSize);
    // Update URL
    updateURLWithFilters(newFilters);
    // Call API with updated filters
    fetchPriceDataWithFilters(newFilters);
  };

  const addFilter = (filterKey: string) => {
    if (!selectedFilters.includes(filterKey)) {
      const newFilters = [...selectedFilters, filterKey];
      setSelectedFilters(newFilters);
      setCurrentPage(1);
      // Reset pagination to page 1
      handlePageChangeWithScroll(1, pagination.pageSize);
      // Update URL
      updateURLWithFilters(newFilters);
      // Call API with new filters
      fetchPriceDataWithFilters(newFilters);
    }
  };

  // Apply filter from URL (replaces existing filters)
  const applyFilterFromURL = (filterKey: string) => {
    const newFilters = [filterKey]; // Always replace with single filter from URL
    setSelectedFilters(newFilters);
    setCurrentPage(1);
    handlePageChangeWithScroll(1, pagination.pageSize);
    // Call API with new filters
    fetchPriceDataWithFilters(newFilters);
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchCategories();
    fetchPriceData();
  }, []); // Chỉ fetch một lần khi component mount

  // Handle URL params for initial filters - separate effect
  useEffect(() => {
    // Only run if categories are loaded and we have URL params
    if (categories.length === 0) return;

    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");
    const filtersParam = searchParams.get("filters");

    // Handle single filter from Footer links
    if (filterParam) {
      // Decode and apply the filter
      const decodedFilter = decodeURIComponent(filterParam);

      // Check if filter exists in available filters
      const allFilters = [
        ...categories
          .filter((category) => category.Category_Name)
          .map((category) => ({
            key: category.Category_Name.toLowerCase(),
            label: category.Category_Name,
          })),
        { key: "m", label: "BMW M" },
        { key: "i", label: "BMW i" },
      ];

      const matchingFilter = allFilters.find(
        (f) =>
          f.key === decodedFilter.toLowerCase() ||
          f.label.toLowerCase() === decodedFilter.toLowerCase() ||
          f.key.includes(decodedFilter.toLowerCase()) ||
          decodedFilter.toLowerCase().includes(f.key)
      );

      if (matchingFilter) {
        // Clear existing filters and apply new filter
        setSelectedFilters([matchingFilter.key]);
        setCurrentPage(1);
        handlePageChangeWithScroll(1, pagination.pageSize);

        // Call API with new filter
        fetchPriceDataWithFilters([matchingFilter.key]);

        // Clean up URL (convert single filter to filters param)
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.delete("filter");
        newSearchParams.set("filters", matchingFilter.key);
        const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
        navigate(newUrl, { replace: true });
      } else {
        // No matching filter found
      }
    }

    // Handle multiple filters from URL state
    else if (filtersParam && selectedFilters.length === 0) {
      const filterKeys = filtersParam.split(",").filter(Boolean);

      if (filterKeys.length > 0) {
        setSelectedFilters(filterKeys);
        fetchPriceDataWithFilters(filterKeys);
      }
    }
  }, [categories, location.search]); // Add location.search to dependencies

  // Watch for URL changes (for navigation between pages)
  useEffect(() => {
    if (categories.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const filterParam = searchParams.get("filter");

      if (filterParam) {
        // Handle URL change
      }
    }
  }, [location.search, categories]);

  // Clean up URL when no filters are selected
  useEffect(() => {
    if (selectedFilters.length === 0) {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has("filters")) {
        searchParams.delete("filters");
        const newUrl = searchParams.toString()
          ? `${location.pathname}?${searchParams.toString()}`
          : location.pathname;
        navigate(newUrl, { replace: true });
      }
    }
  }, [selectedFilters, location.pathname, navigate]);

  // Get current page data from filtered data
  const getCurrentPageData = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredData.slice(startIndex, endIndex);
  };

  const currentPageData = getCurrentPageData();

  const renderFilterButtons = () => {
    const allFilters = [
      ...categories
        .filter((category) => category.Category_Name)
        .map((category) => ({
          key: category.Category_Name.toLowerCase(),
          label: category.Category_Name,
        })),
      { key: "m", label: "BMW M" },
      { key: "i", label: "BMW i" },
    ];

    // Nếu chưa chọn filter nào, hiển thị "Tất cả"
    if (selectedFilters.length === 0) {
      const popoverContent = (
        <div className="price-filter__popover">
          <div className="price-filter__popover-title">Chọn dòng xe</div>
          <div
            className="price-filter__popover-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            {allFilters.map((filter, index) => (
              <button
                key={filter.key}
                className={`price-filter__popover-btn price-filter__popover-btn--variant-${index + 1}`}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
                onClick={() => {
                  addFilter(filter.key);
                  setPopoverVisible(false);
                }}
              >
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      );

      return (
        <div className="price-filter__buttons">
          {/* Default "Tất cả" button */}
          <button className="price-filter__btn price-filter__btn--active price-filter__btn--all">
            Tất cả
          </button>

          {/* Add filter button */}
          <Popover
            content={popoverContent}
            title={null}
            trigger="click"
            open={popoverVisible}
            onOpenChange={setPopoverVisible}
            placement="bottomLeft"
            overlayClassName="price-filter__popover-overlay"
          >
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              className="price-filter__btn-add"
            >
              Thêm dòng xe
            </Button>
          </Popover>
        </div>
      );
    }

    // Hiển thị các filter đã chọn dưới dạng buttons
    const maxVisibleButtons = 4; // Số button tối đa hiển thị trên 1 dòng
    const visibleSelectedFilters = selectedFilters.slice(0, maxVisibleButtons);
    const hiddenSelectedCount = selectedFilters.length - maxVisibleButtons;

    const selectedFilterButtons = visibleSelectedFilters.map((filterKey) => {
      const filter = allFilters.find((f) => f.key === filterKey);
      return filter ? (
        <button
          key={filter.key}
          className="price-filter__btn price-filter__btn--active"
          onClick={() => removeFilter(filter.key)}
        >
          {filter.label}
          <CloseOutlined className="price-filter__btn-close" />
        </button>
      ) : null;
    });

    // Các filter chưa chọn để hiển thị trong popup
    const availableFilters = allFilters.filter(
      (filter) => !selectedFilters.includes(filter.key)
    );

    const popoverContent = (
      <div className="price-filter__popover">
        <div className="price-filter__popover-title">Chọn thêm dòng xe</div>
        <div
          className="price-filter__popover-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          {availableFilters.map((filter, index) => (
            <button
              key={filter.key}
              className={`price-filter__popover-btn price-filter__popover-btn--variant-${index + 1}`}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              onClick={() => {
                addFilter(filter.key);
                setPopoverVisible(false);
              }}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
        {availableFilters.length === 0 && (
          <div className="price-filter__popover-empty">
            Đã chọn tất cả dòng xe
          </div>
        )}
      </div>
    );

    return (
      <div className="price-filter__buttons">
        {/* Selected filter buttons */}
        {selectedFilterButtons}

        {/* Hidden filters count */}
        {hiddenSelectedCount > 0 && (
          <span className="price-filter__more-count">
            +{hiddenSelectedCount} khác
          </span>
        )}

        {/* Add filter button */}
        {availableFilters.length > 0 && (
          <Popover
            content={popoverContent}
            title={null}
            trigger="click"
            open={popoverVisible}
            onOpenChange={setPopoverVisible}
            placement="bottomLeft"
            overlayClassName="price-filter__popover-overlay"
          >
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              className="price-filter__btn-add"
            >
              Thêm dòng xe
            </Button>
          </Popover>
        )}

        {/* Clear all button */}
        {selectedFilters.length > 0 && (
          <Button
            type="text"
            size="small"
            onClick={clearAllFilters}
            className="price-filter__clear-all"
          >
            Xóa tất cả
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="price-list-page">
      {/* Page Banner */}
      <PageBanner
        title="Bảng Giá Xe BMW"
        subtitle="Cập nhật giá xe BMW mới nhất tại Việt Nam"
      />

      {/* Price List Section */}
      <section className="price-list-section">
        <div className="price-list-section__container">
          {/* Contact CTA - Moved to top inside container */}
          <div className="contact-cta">
            <div className="contact-cta__row">
              <div className="contact-cta__col">
                <h3>Bạn cần tư vấn thêm về giá xe BMW?</h3>
                <p>
                  Liên hệ với chúng tôi để nhận được tư vấn chi tiết và ưu đãi
                  đặc biệt
                </p>
              </div>
              <div className="contact-cta__col">
                <a href="#" className="contact-cta__button">
                  Liên hệ ngay
                </a>
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div className="price-filter">
            <div className="price-filter__row">
              <div className="price-filter__col">{renderFilterButtons()}</div>
            </div>
          </div>

          {/* Price Table */}
          <div className="price-table-container">
            <Spin spinning={loading}>
              {/* Desktop Table View */}
              <div className="price-table-desktop">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>Mẫu xe</th>
                      <th>Phiên bản</th>
                      <th>Giá niêm yết (VNĐ)</th>
                      <th>Khuyến mãi</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.map((item) => (
                      <tr key={item._id} className="price-table__row">
                        <td>
                          <div className="price-table__model-info">
                            <img
                              src={item.Main_Image}
                              alt={item.Product_Name}
                              className="price-table__model-image"
                            />
                            <span className="price-table__model-name">
                              {item.Product_Name}
                            </span>
                          </div>
                        </td>
                        <td>{item.Variant || "Standard"}</td>
                        <td>{formatCurrency(item.Price)}</td>
                        <td>
                          <span className="price-table__discount">
                            {item.Discount}
                          </span>
                        </td>
                        <td>
                          <a
                            href={`/xe/${item._id}`}
                            className="price-table__btn-detail"
                          >
                            Chi tiết
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="price-table-mobile">
                {currentPageData.map((item) => (
                  <div key={item._id} className="price-card">
                    <div className="price-card__header">
                      <div className="price-card__model-info">
                        <img
                          src={item.Main_Image}
                          alt={item.Product_Name}
                          className="price-card__model-image"
                        />
                        <div className="price-card__model-details">
                          <h4 className="price-card__model-name">
                            {item.Product_Name}
                          </h4>
                          <span className="price-card__variant">
                            {item.Variant || "Standard"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="price-card__body">
                      <div className="price-card__info-row">
                        <span className="price-card__label">Giá niêm yết:</span>
                        <span className="price-card__price">
                          {formatCurrency(item.Price)}
                        </span>
                      </div>

                      <div className="price-card__info-row">
                        <span className="price-card__label">Khuyến mãi:</span>
                        <span className="price-card__discount">
                          {item.Discount}
                        </span>
                      </div>
                    </div>

                    <div className="price-card__footer">
                      <a
                        href={`/xe/${item._id}`}
                        className="price-card__btn-detail"
                      >
                        Xem chi tiết
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Spin>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <PaginationWrapper
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={filteredData.length}
              onChange={handlePageChangeWithScroll}
              showSizeChanger
              showQuickJumper
              showTotal
              pageSizeOptions={["5", "10", "20", "50"]}
              totalText="{start}-{end} của {total} mẫu xe"
            />
          )}

          {/* Price Notes */}
          <div className="price-notes">
            <p>
              <InfoCircleOutlined /> Giá xe đã bao gồm thuế VAT 10%
            </p>
            <p>
              <InfoCircleOutlined /> Giá xe chưa bao gồm phí trước bạ, đăng ký
              biển số và các chi phí khác
            </p>
            <p>
              <InfoCircleOutlined /> Giá có thể thay đổi tùy theo thời điểm và
              chính sách của BMW Việt Nam
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PriceListPage;
