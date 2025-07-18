import {
  Image as AntdImage,
  Button,
  Card,
  Col,
  notification,
  Row,
  Spin,
  Table,
  Tooltip,
  Typography,
  Space,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "@/api/config";
import { Product } from "@/api/types"; // Import Product type
import PageBanner from "@/components/PageBanner";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import useScrollToTop from "@/hooks/useScrollToTop";
import { ROUTERS } from "@/utils/constant";
import { formatCurrency } from "@/utils/format";
import styles from "./ProductDetailPage.scss";
import { HeartOutlined, HeartFilled, EyeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  // Use scroll to top hook
  useScrollToTop();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ROUTERS.USER.CARS}/${id}`
        );
        // Backend returns data directly, not nested in data.data
        setProduct(response.data.data || response.data);
      } catch (error: any) {
        console.error("Error fetching product detail:", error);

        // Handle specific error cases
        if (error.response?.status === 404) {
          notification.error({
            message: "Không tìm thấy xe",
            description: "Xe bạn đang tìm kiếm không tồn tại trong hệ thống.",
          });
        } else if (error.response?.status === 500) {
          notification.error({
            message: "Lỗi server",
            description: "Có lỗi xảy ra từ phía server. Vui lòng thử lại sau.",
          });
        } else {
          notification.error({
            message: "Lỗi kết nối",
            description:
              "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
          });
        }

        setProduct(null);
        setError(error.response?.data?.message || "Không thể tải chi tiết xe.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]); // Refetch when ID changes

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      setRelatedLoading(true);
      try {
        const categoryId =
          typeof product.CategoryID === "string"
            ? product.CategoryID
            : (product.CategoryID as any)?._id;

        const response = await axios.get(`${API_BASE_URL}/xe`, {
          params: {
            limit: 4,
            exclude: id,
            category: categoryId,
          },
        });
        setRelatedProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product, id]);

  const isFavorite = product
    ? favorites.some((fav) => fav.ProductID._id === product._id)
    : false;

  const handleToggleFavorite = async () => {
    if (!product) return;

    if (!user) {
      notification.warning({
        message: "Vui lòng đăng nhập",
        description:
          "Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích",
      });
      return;
    }

    setIsFavoriteLoading(true);
    try {
      if (isFavorite) {
        const favoriteItem = favorites.find(
          (fav) => fav.ProductID._id === product._id
        );
        if (favoriteItem) {
          await removeFromFavorites(favoriteItem._id);
          notification.success({
            message: "Đã xóa khỏi yêu thích",
            description: "Sản phẩm đã được xóa khỏi danh sách yêu thích",
          });
        }
      } else {
        await addToFavorites(product._id);
        notification.success({
          message: "Đã thêm vào yêu thích",
          description: "Sản phẩm đã được thêm vào danh sách yêu thích",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: isFavorite
          ? "Không thể xóa sản phẩm khỏi danh sách yêu thích"
          : "Không thể thêm sản phẩm vào danh sách yêu thích",
      });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleRegisterConsultation = () => {
    navigate(ROUTERS.USER.SERVICE); // Navigate to the services page
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải xe..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Không tìm thấy xe</Title>
        <Paragraph>
          {error ||
            "Xe bạn đang tìm kiếm có thể không tồn tại hoặc đã bị gỡ bỏ."}
        </Paragraph>
        <Button
          type="primary"
          onClick={() => navigate(ROUTERS.USER.CARS)}
          style={{ marginTop: 16 }}
        >
          Quay lại danh sách xe
        </Button>
      </div>
    );
  }

  // Combine main image and list images without formatting or filtering
  const allImages = product.List_Image
    ? [product.Main_Image, ...product.List_Image]
    : [product.Main_Image];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="product-detail__container">
      <PageBanner
        title="Chi tiết xe"
        subtitle="Khám phá thông tin chi tiết về xe bạn quan tâm"
      />

      <Card className="product-detail__card">
        <div className="product-detail__grid">
          {/* Image Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__gallery-main">
              <AntdImage
                src={allImages[currentImageIndex]} // Use the raw URL from the combined list
                alt={product.Product_Name}
                className="product-detail__gallery-image"
                preview={true}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="product-detail__gallery-nav product-detail__gallery-nav--prev"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="product-detail__gallery-nav product-detail__gallery-nav--next"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="product-detail__gallery-thumbnails">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`product-detail__gallery-thumbnails-item ${currentImageIndex === index ? "product-detail__gallery-thumbnails-item--active" : ""}`}
                  >
                    <img
                      src={image} // Use the raw URL from the list
                      alt={`${product.Product_Name} - ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-detail__info">
            <div className="product-detail__info-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  gap: "16px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <Title
                    level={2}
                    className="product-detail__info-title"
                    style={{ margin: 0 }}
                  >
                    {product.Product_Name}
                  </Title>
                </div>
                <Tooltip
                  title={
                    isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
                  }
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={
                      <HeartOutlined
                        style={{ color: isFavorite ? "#ff4d4f" : "#d9d9d9" }}
                      />
                    }
                    size="large"
                    loading={isFavoriteLoading}
                    onClick={handleToggleFavorite}
                    style={{
                      backgroundColor: isFavorite ? "#fff0f0" : "#f6ffed",
                      borderColor: isFavorite ? "#ff4d4f" : "#52c41a",
                      boxShadow: isFavorite
                        ? "0 2px 4px rgba(255, 77, 79, 0.3)"
                        : "0 2px 4px rgba(82, 196, 26, 0.3)",
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              </div>
              <div className="product-detail__info-price-container">
                <Typography.Text strong className="product-detail__info-price">
                  {formatCurrency(product.Price)}
                </Typography.Text>
              </div>
            </div>

            <div className="product-detail__info-section">
              {product.Specifications &&
              Object.keys(product.Specifications).length > 0 ? (
                <div className="product-detail__specifications">
                  <Table
                    dataSource={Object.entries(product.Specifications).map(
                      ([key, value], index) => ({
                        key: index,
                        spec: key,
                        value: String(value),
                      })
                    )}
                    columns={[
                      {
                        title: "Thông số",
                        dataIndex: "spec",
                        key: "spec",
                        width: "40%",
                        render: (text) => (
                          <div className="product-detail__spec-label">
                            {text}
                          </div>
                        ),
                      },
                      {
                        title: "Giá trị",
                        dataIndex: "value",
                        key: "value",
                        width: "60%",
                        render: (text) => (
                          <div className="product-detail__spec-value">
                            {text}
                          </div>
                        ),
                      },
                    ]}
                    pagination={false}
                    size="small"
                    className="product-detail__spec-table"
                  />
                </div>
              ) : (
                <div className="product-detail__info-section-content">
                  <Paragraph>Đang cập nhật...</Paragraph>
                </div>
              )}
            </div>

            <div className="product-detail__info-actions">
              <div className="product-detail__info-buttons">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleRegisterConsultation}
                  block
                  className="product-detail__consultation-btn"
                >
                  Đăng ký tư vấn
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Row */}
        <div className="product-detail__description-row">
          <div className="product-detail__description-section">
            <div className="product-detail__description-content">
              {product.Description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.Description }}
                  className="product-detail__description-html"
                />
              ) : (
                <Paragraph>Đang cập nhật...</Paragraph>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Related Products Section */}
      <div className="product-detail__related">
        <Spin spinning={relatedLoading}>
          {relatedProducts.length > 0 ? (
            <Row gutter={[20, 20]}>
              {relatedProducts.map((relatedProduct) => (
                <Col xs={24} sm={12} md={6} key={relatedProduct._id}>
                  <Card
                    hoverable
                    className="product-detail__related-card"
                    cover={
                      <div
                        className="product-detail__related-image"
                        style={{ position: "relative" }}
                      >
                        <img
                          alt={relatedProduct.Product_Name}
                          src={relatedProduct.Main_Image}
                          onClick={() =>
                            navigate(
                              `${ROUTERS.USER.CARS}/${relatedProduct._id}`
                            )
                          }
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            zIndex: 3,
                          }}
                        >
                          <Tooltip
                            title={
                              favorites.some(
                                (fav) =>
                                  fav.ProductID._id === relatedProduct._id
                              )
                                ? "Xóa khỏi yêu thích"
                                : "Thêm vào yêu thích"
                            }
                          >
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<HeartOutlined />}
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle favorite toggle for related product
                                const isRelatedFavorite = favorites.some(
                                  (fav) =>
                                    fav.ProductID._id === relatedProduct._id
                                );
                                if (isRelatedFavorite) {
                                  const favoriteItem = favorites.find(
                                    (fav) =>
                                      fav.ProductID._id === relatedProduct._id
                                  );
                                  if (favoriteItem) {
                                    removeFromFavorites(favoriteItem._id);
                                  }
                                } else {
                                  addToFavorites(relatedProduct._id);
                                }
                              }}
                              style={{
                                backgroundColor: favorites.some(
                                  (fav) =>
                                    fav.ProductID._id === relatedProduct._id
                                )
                                  ? "#ff4d4f"
                                  : "#52c41a",
                                borderColor: favorites.some(
                                  (fav) =>
                                    fav.ProductID._id === relatedProduct._id
                                )
                                  ? "#ff4d4f"
                                  : "#52c41a",
                                boxShadow: favorites.some(
                                  (fav) =>
                                    fav.ProductID._id === relatedProduct._id
                                )
                                  ? "0 2px 4px rgba(255, 77, 79, 0.3)"
                                  : "0 2px 4px rgba(82, 196, 26, 0.3)",
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    }
                    onClick={() =>
                      navigate(`${ROUTERS.USER.CARS}/${relatedProduct._id}`)
                    }
                  >
                    <Card.Meta
                      title={
                        <Tooltip
                          title={
                            relatedProduct.Product_Name.length > 20
                              ? relatedProduct.Product_Name
                              : null
                          }
                          placement="top"
                          mouseEnterDelay={0.5}
                        >
                          <div className="product-detail__related-title">
                            {relatedProduct.Product_Name}
                          </div>
                        </Tooltip>
                      }
                      description={
                        <div className="product-detail__related-price">
                          {formatCurrency(relatedProduct.Price)}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="product-detail__related-empty">
              <Paragraph>Không có xe liên quan</Paragraph>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default ProductDetailPage;
