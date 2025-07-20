import PageBanner from "@/components/PageBanner";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import useScrollToTop from "@/hooks/useScrollToTop";
import { ROUTERS } from "@/utils/constant";
import {
  DeleteOutlined,
  EyeOutlined,
  HeartOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  notification,
  Row,
  Space,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const { Title, Text } = Typography;

const FavoritesPage: React.FC = () => {
  // Use scroll to top hook
  useScrollToTop();

  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, removeFromFavorites, loading } = useFavorites();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveFavorite = async (itemId: string) => {
    if (!user) {
      notification.warning({
        message: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để quản lý danh sách yêu thích",
      });
      return;
    }

    setRemovingId(itemId);
    try {
      await removeFromFavorites(itemId);
      notification.success({
        message: "Thành công",
        description: "Đã xóa sản phẩm khỏi danh sách yêu thích",
      });
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa sản phẩm khỏi danh sách yêu thích",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(ROUTERS.USER.PRODUCTS + "/" + productId);
  };

  // Helper function để kiểm tra sản phẩm có trong favorites không
  const isProductFavorite = (productId: string) => {
    return favorites.some((fav) => fav.ProductID._id === productId);
  };

  if (!user) {
    return (
      <div className={styles.favoritesPage}>
        <PageBanner
          title="Danh sách yêu thích"
          subtitle="Quản lý các sản phẩm bạn đã yêu thích"
        />
        <div className={styles.container}>
          <Empty
            description={
              <div>
                <Text style={{ fontSize: 16, color: "#666" }}>
                  Vui lòng đăng nhập để xem danh sách yêu thích
                </Text>
                <br />
                <Button
                  type="primary"
                  onClick={() => navigate(ROUTERS.USER.LOGIN)}
                  style={{ marginTop: 16 }}
                >
                  Đăng nhập
                </Button>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
      <PageBanner
        title="Danh sách yêu thích"
        subtitle="Quản lý các sản phẩm bạn đã yêu thích"
      />

      <div className={styles.container}>
        <Spin
          spinning={loading}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          tip="Đang tải danh sách yêu thích..."
        >
          {favorites.length > 0 ? (
            <>
              <div className={styles.header}>
                <Title level={4}>
                  Bạn có {favorites.length} sản phẩm trong danh sách yêu thích
                </Title>
              </div>

              <Row gutter={[20, 20]}>
                {favorites.map((item) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                    <Card
                      hoverable
                      className={styles.favoriteCard}
                      cover={
                        <div
                          className={styles.productImage}
                          onClick={() => handleViewProduct(item.ProductID._id)}
                        >
                          <img
                            alt={item.ProductID.Product_Name}
                            src={item.ProductID.Main_Image}
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
                                  onClick={() =>
                                    handleViewProduct(item.ProductID._id)
                                  }
                                  style={{
                                    backgroundColor: "#1890ff",
                                    borderColor: "#1890ff",
                                    boxShadow:
                                      "0 2px 4px rgba(24, 144, 255, 0.3)",
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="Xóa khỏi yêu thích">
                                <Button
                                  type="primary"
                                  shape="circle"
                                  icon={<DeleteOutlined />}
                                  size="small"
                                  loading={removingId === item._id}
                                  onClick={() => handleRemoveFavorite(item._id)}
                                  danger
                                  style={{
                                    backgroundColor: "#ff4d4f",
                                    borderColor: "#ff4d4f",
                                    boxShadow:
                                      "0 2px 4px rgba(255, 77, 79, 0.3)",
                                    marginLeft: 8,
                                  }}
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        </div>
                      }
                    >
                      <Card.Meta
                        title={
                          <div className={styles.productTitle}>
                            <Text strong style={{ margin: 0 }}>
                              {item.ProductID.Product_Name}
                            </Text>
                            <HeartOutlined
                              style={{
                                color: isProductFavorite(item.ProductID._id)
                                  ? "#ff4d4f"
                                  : "#d9d9d9",
                                marginLeft: 8,
                              }}
                            />
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
                                {item.ProductID.Price.toLocaleString("vi-VN")}{" "}
                                VNĐ
                              </Text>
                            </div>
                            <div className={styles.productActions}>
                              <Button
                                type="primary"
                                shape="circle"
                                size="small"
                                danger
                                loading={removingId === item._id}
                                onClick={() => handleRemoveFavorite(item._id)}
                                icon={<DeleteOutlined />}
                                style={{
                                  backgroundColor: "#ff4d4f",
                                  borderColor: "#ff4d4f",
                                  boxShadow: "0 2px 4px rgba(255, 77, 79, 0.3)",
                                }}
                              />
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Empty
              description={
                <div>
                  <Text style={{ fontSize: 16, color: "#666" }}>
                    Bạn chưa có sản phẩm nào trong danh sách yêu thích
                  </Text>
                  <br />
                  <Button
                    type="primary"
                    onClick={() => navigate(ROUTERS.USER.PRODUCTS)}
                    style={{ marginTop: 16 }}
                  >
                    Khám phá sản phẩm
                  </Button>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default FavoritesPage;
