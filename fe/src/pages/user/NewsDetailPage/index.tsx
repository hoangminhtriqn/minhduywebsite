import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsEventById, incrementNewsEventViewCount, NewsEvent } from "@/api/services/user/newsEvents";
import PageBanner from "@/components/PageBanner";
import styles from "./styles.module.scss";

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          // Fetch news data
          const data = await getNewsEventById(id);
          setNews(data);
          
          // Increment view count
          try {
            await incrementNewsEventViewCount(id);
          } catch (viewError) {
            // Don't show error for view count increment failure
            console.warn("Failed to increment view count:", viewError);
          }
        } else {
          setError("Không tìm thấy tin tức.");
        }
      } catch {
        setError("Không thể tải chi tiết tin tức. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

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

  if (loading) {
    return (
      <div className="news-detail-page">
        <PageBanner title="Đang tải..." />
      </div>
    );
  }
  if (error || !news) {
    return (
      <div className="news-detail-page">
        <PageBanner title="Lỗi" subtitle={error || "Không tìm thấy tin tức."} />
      </div>
    );
  }

  return (
    <>
      <PageBanner title={news.Title} />
      <div className={styles.newsDetailPage}>
        <div className={styles.newsDetailContent}>
          {/* News Image */}
          {news.ImageUrl && (
            <div className={styles.newsImageContainer}>
              <img 
                src={news.ImageUrl} 
                alt={news.Title}
                className={styles.newsImage}
              />
            </div>
          )}
          
          {/* News Meta */}
          <div className={styles.newsMeta}>
            <span>Ngày đăng: {formatDate(news.PublishDate || news.createdAt)}</span>
            <span>Lượt xem: {news.viewCount || 0}</span>
          </div>
          
          {/* News Content */}
          <div
            className={styles.newsContent}
            dangerouslySetInnerHTML={{ __html: news.Content }}
          />
        </div>
      </div>
    </>
  );
};

export default NewsDetailPage;
