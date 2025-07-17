import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message, Button } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";
import { Product } from "../../api/types";
import ProductCard from "../product/ProductCard";
import styles from "./FeaturedModels.module.scss";

const FeaturedModels: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 9;

  const fetchProducts = async (pageNum = 1, append = false) => {
    const loadingState = pageNum === 1 ? setLoading : setLoadingMore;
    loadingState(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/xe`, {
        params: {
          page: pageNum,
          limit: limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      });

      if (response.data && response.data.products) {
        const newProducts = response.data.products;
        const pagination = response.data.pagination;

        if (append) {
          setProducts((prev) => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }

        setTotalProducts(pagination.total);
        setHasMore(pageNum < pagination.totalPages);
        setPage(pageNum);
      } else {
        if (!append) {
          setProducts([]);
          setError("Unexpected API response format");
          message.error("Unexpected API response format");
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      const errorMsg = "Không thể tải danh sách xe.";
      if (!append) {
        setError(errorMsg);
        message.error(errorMsg);
      } else {
        message.error("Không thể tải thêm xe.");
      }
    } finally {
      loadingState(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(page + 1, true);
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin indicator={antIcon} />
        <p>Đang tải xe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <Button onClick={() => fetchProducts(1, false)}>Thử lại</Button>
      </div>
    );
  }

  return (
    <section className={styles.featuredModels}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Danh sách lái thử</h2>
          <p className={styles.subtitle}>
            Khám phá bộ sưu tập xe BMW đẳng cấp với công nghệ hiện đại
          </p>
        </div>

        <div className={styles.productsGrid}>
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} key={product._id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>

        {hasMore && (
          <div className={styles.loadMoreContainer}>
            <Button
              type="primary"
              size="large"
              icon={loadingMore ? <LoadingOutlined /> : <PlusOutlined />}
              onClick={handleLoadMore}
              loading={loadingMore}
              className={styles.loadMoreButton}
            >
              {loadingMore
                ? "Đang tải..."
                : `Tải thêm (${totalProducts - products.length} xe còn lại)`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedModels;
