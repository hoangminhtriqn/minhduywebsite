import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { productService } from "@/api/services/user/product";
import { formatCurrency } from "@/utils/format";

import { Product } from "@/api/types";
import {
  Typography,
  Spin,
  Image as AntdImage,
  Button,
  Space,
  Descriptions,
  Card,
  notification,
} from "antd";
import { ROUTERS } from "@/utils/constant";
import {
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const { Title, Paragraph, Text } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Ensure loading is true on fetch
      try {
        if (id) {
          const productData = await productService.getProductById(id);
          setProduct(productData);
        }
      } catch (err) {
        setError("Failed to fetch product");
        setProduct(null); // Set product to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Log the product data whenever it changes
  useEffect(() => {}, [product]);

  if (loading)
    return (
      <Spin
        tip="Đang tải..."
        size="large"
        style={{ display: "block", margin: "50px auto" }}
      />
    );
  if (error) return <Paragraph type="danger">Lỗi: {error}</Paragraph>;
  if (!product) return <Paragraph>Không tìm thấy sản phẩm.</Paragraph>;

  // Combine main image and list images without formatting or filtering
  const allImages = [product.Main_Image, ...(product.List_Image || [])];

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

  const handleRegisterConsultation = () => {
    navigate(ROUTERS.USER.SERVICE);
  };

  // If no valid images are found after filtering, display a fallback or message
  if (allImages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <Paragraph>
            Không có ảnh sản phẩm để hiển thị hoặc ảnh bị lỗi định dạng.
          </Paragraph>
        </Card>
      </div>
    );
  }

  // Ensure currentImageIndex is valid after filtering images
  const displayImageIndex =
    currentImageIndex < allImages.length ? currentImageIndex : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <AntdImage
                src={allImages[displayImageIndex]}
                alt={product.Product_Name}
                className="w-full h-full object-cover"
                preview={true}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                  >
                    <LeftOutlined />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                  >
                    <RightOutlined />
                  </button>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${displayImageIndex === index ? "border-primary-600" : "border-transparent"}`}
                  >
                    <img
                      src={image}
                      alt={`${product.Product_Name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Title level={2} className="!mt-0 mb-2">
              {product.Product_Name}
            </Title>
            <Text strong className="text-2xl text-primary-600 mb-4">
              {formatCurrency(product.Price)}
            </Text>

            <div className="mt-8">
              <Title level={4} className="mb-2">
                Mô tả
              </Title>
              <Paragraph>{product.Description || "Đang cập nhật..."}</Paragraph>
            </div>

            <div className="mt-8">
              <Title level={4} className="mb-2">
                Thông số kỹ thuật
              </Title>
              {product.Specifications &&
              Object.keys(product.Specifications).length > 0 ? (
                <Descriptions
                  bordered
                  size="small"
                  column={{
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                  }}
                >
                  {Object.entries(product.Specifications).map(
                    ([key, value]) => (
                      <Descriptions.Item key={key} label={key}>
                        {String(value)}
                      </Descriptions.Item>
                    )
                  )}
                </Descriptions>
              ) : (
                <Paragraph>Đang cập nhật...</Paragraph>
              )}
            </div>

            <div className="mt-8">
              <Button
                type="primary"
                size="large"
                onClick={handleRegisterConsultation}
                block
              >
                Đăng ký tư vấn
              </Button>
              {product.Stock !== undefined && (
                <Text type="secondary" className="mt-2 block text-right">
                  Còn {product.Stock} sản phẩm
                </Text>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
