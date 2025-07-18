import React, { useState, useEffect } from "react";
import { getAllNewsEvents, NewsEvent } from "@/api/services/user/newsEvents";
import PageBanner from "@/components/PageBanner";
import { usePagination } from "@/hooks/usePagination";
import PaginationWrapper from "@/components/PaginationWrapper";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/utils/constant";
import { Card, Row, Col, Typography, Spin, Empty } from "antd";

const NewsPage: React.FC = () => {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { pagination, handlePageChange, setPageSize } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
    initialTotal: 0,
  });

  const navigate = useNavigate();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    const fetchNewsEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, pagination: pageInfo } = await getAllNewsEvents(
          pagination.current,
          pagination.pageSize
        );
        setNewsEvents(data);
        setTotal(pageInfo.total);
      } catch (err: any) {
        setError("Không thể tải tin tức. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsEvents();
  }, [pagination.current, pagination.pageSize]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    // Remove HTML tags for truncation
    const plainText = content.replace(/<[^>]*>/g, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="news-page">
        <PageBanner
          title="TIN TỨC - SỰ KIỆN"
          subtitle="Cập nhật thông tin mới nhất từ BMW với những tin tức, sự kiện và cập nhật mới nhất về sản phẩm và dịch vụ."
        />
        <div className="loading-container">
          <div className="loading-spinner">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <PageBanner
          title="TIN TỨC - SỰ KIỆN"
          subtitle="Cập nhật thông tin mới nhất từ BMW với những tin tức, sự kiện và cập nhật mới nhất về sản phẩm và dịch vụ."
        />
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <PageBanner
        title="TIN TỨC - SỰ KIỆN"
        subtitle="Cập nhật thông tin mới nhất từ BMW với những tin tức, sự kiện và cập nhật mới nhất về sản phẩm và dịch vụ."
      />

      {/* News List Section */}
      <section className="news-list-section">
        <div className="news-list-section__container">
          {newsEvents.length === 0 ? (
            <div className="no-news">
              <p>Chưa có tin tức nào được đăng tải.</p>
            </div>
          ) : (
            newsEvents.map((newsEvent) => (
              <div key={newsEvent._id} className="news-item">
                <div className="news-item__image">
                  <img
                    src={newsEvent.ImageUrl || "/images/default-news-image.jpg"}
                    alt={newsEvent.Title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/default-news-image.jpg";
                    }}
                  />
                </div>
                <div className="news-item__content">
                  <h3 className="news-item__title">{newsEvent.Title}</h3>
                  <p className="news-item__meta">
                    Ngày đăng:{" "}
                    {formatDate(newsEvent.PublishDate || newsEvent.createdAt)} |
                    Trạng thái:{" "}
                    {newsEvent.Status === "published"
                      ? "Đã xuất bản"
                      : newsEvent.Status === "draft"
                        ? "Bản nháp"
                        : newsEvent.Status === "active"
                          ? "Hoạt động"
                          : newsEvent.Status === "inactive"
                            ? "Không hoạt động"
                            : newsEvent.Status === "archived"
                              ? "Đã lưu trữ"
                              : "Bản nháp"}
                  </p>
                  <p className="news-item__summary">
                    {truncateContent(newsEvent.Content)}
                  </p>
                  <button
                    className="news-item__btn-more"
                    onClick={() =>
                      navigate(
                        ROUTERS.USER.NEWS_DETAIL.replace(":id", newsEvent._id)
                      )
                    }
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Pagination */}
          {total > 0 && (
            <div className="news-pagination">
              <PaginationWrapper
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={true}
                pageSizeOptions={["10", "20", "50"]}
              />
            </div>
          )}
        </div>
      </section>

      {/* Featured News Section (Optional) */}
      {newsEvents.length > 0 && (
        <section className="featured-news-section">
          <div className="featured-news-section__container">
            {/* Featured news content */}
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsPage;
