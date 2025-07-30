import {
  Image as AntdImage,
  Button,
  Card,
  Col,
  Row,
  Spin,
  Table,
  Tooltip,
  Typography,
  App,
} from "antd";
import React, { useEffect, useState } from "react";

import { Product } from "@/api/types"; // Import Product type
import { productService } from "@/api/services/user/product";
import PageBanner from "@/components/PageBanner";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import useScrollToTop from "@/hooks/useScrollToTop";
import { ROUTERS } from "@/utils/constant";
import { formatCurrency } from "@/utils/format";
import { HeartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";

const { Title, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  // Use scroll to top hook
  useScrollToTop();

  const { notification } = App.useApp();
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
        const productData = await productService.getProductById(id!);
        setProduct(productData);
      } catch (error: unknown) {
        console.error("Error fetching product detail:", error);

        // Handle specific error cases
        if (
          error instanceof Error &&
          error.message === "Request failed with status code 404"
        ) {
          notification.error({
            message: "Không tìm thấy sản phẩm",
            description:
              "Sản phẩm bạn đang tìm kiếm không tồn tại trong hệ thống.",
          });
        } else if (
          error instanceof Error &&
          error.message === "Request failed with status code 500"
        ) {
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
        setError(
          error instanceof Error
            ? error.message
            : "Không thể tải chi tiết sản phẩm."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, notification]); // Refetch when ID changes

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      setRelatedLoading(true);
      try {
        // Use the new related products API
        const related = await productService.getRelatedProducts(product._id, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải sản phẩm liên quan",
        });
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product, id, notification]);

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
    } catch {
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
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Không tìm thấy sản phẩm</Title>
        <Paragraph>
          {error ||
            "Sản phẩm bạn đang tìm kiếm có thể không tồn tại hoặc đã bị gỡ bỏ."}
        </Paragraph>
        <Button
          type="primary"
          onClick={() => navigate(ROUTERS.USER.PRODUCTS)}
          style={{ marginTop: 16 }}
        >
          Quay lại danh sách sản phẩm
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
    <div className={styles["product-detail__container"]}>
      <PageBanner
        title="Chi tiết sản phẩm"
        subtitle="Khám phá thông tin chi tiết về sản phẩm bạn quan tâm"
      />

      <Card className={styles["product-detail__card"]}>
        <div className={styles["product-detail__grid"]}>
          {/* Image Gallery */}
          <div className={styles["product-detail__gallery"]}>
            <div className={styles["product-detail__gallery-main"]}>
              <AntdImage
                src={allImages[currentImageIndex]}
                alt={product.Product_Name}
                className={styles["product-detail__gallery-image"]}
                preview={true}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className={`${styles["product-detail__gallery-nav"]} ${styles["product-detail__gallery-nav--prev"]}`}
                  >
                    <LeftOutlined />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className={`${styles["product-detail__gallery-nav"]} ${styles["product-detail__gallery-nav--next"]}`}
                  >
                    <RightOutlined />
                  </button>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className={styles["product-detail__gallery-thumbnails"]}>
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`${styles["product-detail__gallery-thumbnails-item"]} ${currentImageIndex === index ? styles["product-detail__gallery-thumbnails-item--active"] : ""}`}
                  >
                    <img
                      src={image}
                      alt={`${product.Product_Name} - ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles["product-detail__info"]}>
            <div className={styles["product-detail__info-header"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Title
                    level={2}
                    className={styles["product-detail__info-title"]}
                    style={{ margin: 0, wordBreak: "break-word" }}
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
              <div className={styles["product-detail__info-price-container"]}>
                <Typography.Text
                  strong
                  className={styles["product-detail__info-price"]}
                >
                  {formatCurrency(product.Price)}
                </Typography.Text>
              </div>
            </div>

            <div className={styles["product-detail__info-section"]}>
              {product.Specifications &&
              Object.keys(product.Specifications).length > 0 ? (
                <div className={styles["product-detail__specifications"]}>
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
                          <div className={styles["product-detail__spec-label"]}>
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
                          <div className={styles["product-detail__spec-value"]}>
                            {text}
                          </div>
                        ),
                      },
                    ]}
                    pagination={false}
                    size="small"
                    className={styles["product-detail__spec-table"]}
                  />
                </div>
              ) : (
                <div className={styles["product-detail__info-section-content"]}>
                  <Paragraph>Đang cập nhật...</Paragraph>
                </div>
              )}
            </div>

            <div className={styles["product-detail__info-actions"]}>
              <div className={styles["product-detail__info-buttons"]}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleRegisterConsultation}
                  block
                  className={styles["product-detail__consultation-btn"]}
                >
                  Đăng ký tư vấn
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Row */}
        <div className={styles["product-detail__description-row"]}>
          <div className={styles["product-detail__description-section"]}>
            <div className={styles["product-detail__description-content"]}>
              {product.Description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.Description }}
                  className={styles["product-detail__description-html"]}
                />
              ) : (
                <Paragraph>Đang cập nhật...</Paragraph>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className={styles["product-detail__related"]}>
          <div className={styles["product-detail__related-header"]}>
            <Title
              level={3}
              className={styles["product-detail__related-title"]}
            >
              Sản phẩm liên quan
            </Title>
            <Paragraph className={styles["product-detail__related-subtitle"]}>
              Khám phá thêm các sản phẩm tương tự
            </Paragraph>
          </div>

          <Spin spinning={relatedLoading}>
            <Row gutter={[24, 24]}>
              {relatedProducts.map((relatedProduct) => (
                <Col xs={24} sm={12} md={8} lg={6} key={relatedProduct._id}>
                  <Card
                    hoverable
                    className={styles["product-detail__related-card"]}
                    cover={
                      <div
                        className={
                          styles["product-detail__related-image-container"]
                        }
                      >
                        <img
                          alt={relatedProduct.Product_Name}
                          src={relatedProduct.Main_Image}
                          className={styles["product-detail__related-image"]}
                          onClick={() =>
                            navigate(
                              `${ROUTERS.USER.PRODUCTS}/${relatedProduct._id}`
                            )
                          }
                        />
                        <div
                          className={styles["product-detail__related-favorite"]}
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

                                if (!user) {
                                  notification.warning({
                                    message: "Vui lòng đăng nhập",
                                    description:
                                      "Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích",
                                  });
                                  return;
                                }

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
                              className={`${styles["product-detail__related-favorite-btn"]} ${
                                favorites.some(
                                  (fav) =>
                                    fav.ProductID._id === relatedProduct._id
                                )
                                  ? styles[
                                      "product-detail__related-favorite-btn--active"
                                    ]
                                  : ""
                              }`}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    }
                    onClick={() =>
                      navigate(`${ROUTERS.USER.PRODUCTS}/${relatedProduct._id}`)
                    }
                  >
                    <Card.Meta
                      title={
                        <Tooltip
                          title={
                            relatedProduct.Product_Name.length > 25
                              ? relatedProduct.Product_Name
                              : null
                          }
                          placement="top"
                          mouseEnterDelay={0.5}
                        >
                          <div
                            className={
                              styles["product-detail__related-product-title"]
                            }
                          >
                            {relatedProduct.Product_Name}
                          </div>
                        </Tooltip>
                      }
                      description={
                        <div
                          className={
                            styles["product-detail__related-product-price"]
                          }
                        >
                          {formatCurrency(relatedProduct.Price)}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
