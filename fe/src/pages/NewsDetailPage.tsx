import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsEventById, NewsEvent } from "../api/services/newsEvents";
import PageBanner from "../components/PageBanner";

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
          const data = await getNewsEventById(id);
          setNews(data);
        } else {
          setError("Không tìm thấy tin tức.");
        }
      } catch (err) {
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
    <div className="news-detail-page">
      <PageBanner title={news.Title} />
      <div className="news-detail-content">
        <img
          src={news.ImageUrl || "/images/default-news-image.jpg"}
          alt={news.Title}
        />
        <div style={{ color: "#666", marginBottom: 12 }}>
          Ngày đăng: {formatDate(news.PublishDate || news.createdAt)} | Trạng thái:{" "}
          {news.Status === "published" ? "Đã xuất bản" : 
           news.Status === "draft" ? "Bản nháp" :
           news.Status === "active" ? "Hoạt động" :
           news.Status === "inactive" ? "Không hoạt động" :
           news.Status === "archived" ? "Đã lưu trữ" : "Bản nháp"}
        </div>
        <div 
          style={{ fontSize: 18, lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: news.Content }}
        />
      </div>
    </div>
  );
};

export default NewsDetailPage;
