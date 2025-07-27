import { Product } from "@/api/types";
import { formatCurrency } from "@/utils/format";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProductStatus } from "@/types";

import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ROUTERS } from "@/utils/constant";
import { EyeOutlined, HeartOutlined } from "@ant-design/icons";
import { Button, notification, Space, Tooltip, Typography } from "antd";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewDetail = () => {
    navigate(`${ROUTERS.USER.PRODUCTS}/${product._id}`);
  };

  const handleContactConsultation = () => {
    navigate("/lien-he");
  };

  const isFavorite = favorites.some((fav) => fav.ProductID._id === product._id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const unavailable = product.Status === ProductStatus.OUT_OF_STOCK;

  // Responsive CSS-in-JS Styles
  const cardStyle: React.CSSProperties = {
    background: theme.colors.background.paper,
    borderRadius: isMobile ? "12px" : "16px",
    boxShadow: isHovered
      ? "0 20px 40px rgba(0, 0, 0, 0.15)"
      : "0 8px 25px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
    border: `1px solid ${theme.colors.surface.border}`,
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const imageContainerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    aspectRatio: "16/10",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
  };

  const tagStyle: React.CSSProperties = {
    position: "absolute",
    top: isMobile ? "8px" : "12px",
    right: isMobile ? "8px" : "12px",
    background: "#ff4757",
    color: "#ffffff",
    padding: isMobile ? "4px 8px" : "6px 12px",
    borderRadius: "20px",
    fontSize: isMobile ? "11px" : "12px",
    fontWeight: "600",
    zIndex: 2,
  };

  const infoStyle: React.CSSProperties = {
    padding: isMobile ? "12px" : isTablet ? "16px" : "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? "14px" : isTablet ? "16px" : "18px",
    fontWeight: "600",
    color: theme.colors.text.primary,
    textDecoration: "none",
    marginBottom: isMobile ? "8px" : "12px",
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    transition: "color 0.3s ease",
  };

  const specsStyle: React.CSSProperties = {
    marginBottom: isMobile ? "10px" : "15px",
    cursor: "pointer",
  };

  const priceStyle: React.CSSProperties = {
    fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
    fontWeight: "700",
    color: theme.colors.palette.primary,
    marginBottom: isMobile ? "12px" : "16px",
  };

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "8px" : "10px",
    marginTop: "auto",
  };

  const detailButtonStyle: React.CSSProperties = {
    flex: 1,
    background: "transparent",
    border: `2px solid ${theme.colors.palette.primary}`,
    color: theme.colors.palette.primary,
    padding: isMobile ? "8px 12px" : "10px 16px",
    borderRadius: "8px",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const consultationButtonStyle: React.CSSProperties = {
    flex: 1,
    background: unavailable
      ? theme.colors.text.muted
      : theme.colors.palette.primary,
    border: "none",
    color: theme.colors.text.white,
    padding: isMobile ? "8px 12px" : "10px 16px",
    borderRadius: "8px",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: "600",
    cursor: unavailable ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    opacity: unavailable ? 0.6 : 1,
  };

  const productActionsStyle: React.CSSProperties = {
    position: "absolute",
    top: isMobile ? "8px" : "12px",
    right: isMobile ? "8px" : "12px",
    zIndex: 3,
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDetailHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.background = theme.colors.palette.primary;
    e.currentTarget.style.color = theme.colors.text.white;
  };

  const handleDetailLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = theme.colors.palette.primary;
  };

  const handleConsultationHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!unavailable) {
      e.currentTarget.style.background = theme.colors.palette.primaryDark;
      e.currentTarget.style.transform = "translateY(-1px)";
    }
  };

  const handleConsultationLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = unavailable
      ? theme.colors.text.muted
      : theme.colors.palette.primary;
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={imageContainerStyle}>
        <Link to={`/san-pham/${product._id}`}>
          <img
            src={product.Main_Image}
            alt={product.Product_Name}
            style={imageStyle}
          />
          {unavailable && <div style={tagStyle}>Hết hàng</div>}
        </Link>
        <div style={productActionsStyle}>
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => navigate(`/san-pham/${product._id}`)}
                style={{
                  backgroundColor: theme.colors.palette.info,
                  borderColor: theme.colors.palette.info,
                  boxShadow: `0 2px 4px ${theme.colors.palette.info}40`,
                }}
              />
            </Tooltip>
            <Tooltip
              title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<HeartOutlined />}
                size="small"
                loading={isFavoriteLoading}
                onClick={handleToggleFavorite}
                style={{
                  backgroundColor: isFavorite
                    ? theme.colors.palette.error
                    : theme.colors.palette.success,
                  borderColor: isFavorite
                    ? theme.colors.palette.error
                    : theme.colors.palette.success,
                  boxShadow: isFavorite
                    ? `0 2px 4px ${theme.colors.palette.error}40`
                    : `0 2px 4px ${theme.colors.palette.success}40`,
                }}
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      <div style={infoStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? "8px" : "12px",
          }}
        >
          <Link
            to={`/san-pham/${product._id}`}
            style={{
              ...titleStyle,
              marginBottom: 0,
              flex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.palette.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.colors.text.primary;
            }}
          >
            {product.Product_Name}
          </Link>
          <HeartOutlined
            style={{
              color: isFavorite
                ? theme.colors.palette.error
                : theme.colors.text.muted,
              fontSize: isMobile ? "16px" : "18px",
              marginLeft: "8px",
              transition: "color 0.3s ease",
            }}
          />
        </div>

        <Tooltip
          title={
            <div>
              {(() => {
                const specs = product.Specifications || {};
                const specEntries = Object.entries(specs);

                if (specEntries.length > 0) {
                  return specEntries.map(([key, value], index) => (
                    <div key={index} style={{ marginBottom: "4px" }}>
                      <Typography.Text strong style={{ color: "#ffffff" }}>
                        {key}:
                      </Typography.Text>{" "}
                      <Typography.Text style={{ color: "#ffffff" }}>
                        {value}
                      </Typography.Text>
                    </div>
                  ));
                } else {
                  return (
                    <Typography.Text style={{ color: "#ffffff" }}>
                      Không có thông số
                    </Typography.Text>
                  );
                }
              })()}
            </div>
          }
          placement="top"
          color={theme.colors.palette.primary}
        >
          <div style={specsStyle}>
            {(() => {
              const specs = product.Specifications || {};
              const specEntries = Object.entries(specs);

              if (specEntries.length > 0) {
                // Hiển thị 2 specs đầu tiên
                const displaySpecs = specEntries.slice(0, 2);
                const hasMore = specEntries.length > 2;

                return (
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: isMobile ? "12px" : "13px" }}
                  >
                    {displaySpecs
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" • ")}
                    {hasMore && "..."}
                  </Typography.Text>
                );
              } else {
                return (
                  <Typography.Text type="secondary">
                    Không có thông số
                  </Typography.Text>
                );
              }
            })()}
          </div>
        </Tooltip>

        <div style={priceStyle}>{formatCurrency(product.Price)}</div>

        <div style={actionsStyle}>
          <Link
            to={`/san-pham/${product._id}`}
            style={detailButtonStyle}
            onClick={handleViewDetail}
            onMouseEnter={handleDetailHover}
            onMouseLeave={handleDetailLeave}
          >
            Xem chi tiết
          </Link>
          <button
            style={consultationButtonStyle}
            onClick={handleContactConsultation}
            disabled={unavailable}
            onMouseEnter={handleConsultationHover}
            onMouseLeave={handleConsultationLeave}
          >
            Tư vấn
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
