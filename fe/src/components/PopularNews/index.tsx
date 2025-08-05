import React, { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  getPopularNewsEvents,
  NewsEvent,
} from "@/api/services/user/newsEvents";
import { ROUTERS } from "@/utils/constant";
import styles from "./style.module.scss";

const PopularNews: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPopularNews = async () => {
    setLoading(true);

    try {
      const response = await getPopularNewsEvents(1, 6);
      setNews(response.data);
    } catch (err) {
      console.error("Error fetching popular news:", err);
      const errorMsg = "Không thể tải danh sách tin tức.";
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularNews();
  }, []);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin indicator={antIcon} />
        <p>Đang tải tin tức...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchPopularNews}>Thử lại</button>
      </div>
    );
  }

  return (
    <section className={styles.popularNews}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tin Tức Được Xem Nhiều</h2>
          <p className={styles.subtitle}>
            Kiến thức và kinh nghiệm được chia sẻ từ Minh Duy - Đà Nẵng
          </p>
        </div>

        <div className={styles.newsGrid}>
          {news.map((newsItem) => (
            <div
              key={newsItem._id}
              className={styles.newsCard}
              onClick={() =>
                navigate(ROUTERS.USER.NEWS_DETAIL.replace(":id", newsItem._id))
              }
              style={{ cursor: "pointer" }}
            >
              <div className={styles.newsImage}>
                <img
                  src={newsItem.ImageUrl}
                  alt={newsItem.Title}
                />
              </div>
              <div className={styles.newsContent}>
                <h3 className={styles.newsTitle}>{newsItem.Title}</h3>
                <p className={styles.newsExcerpt}>
                  {newsItem.Content?.substring(0, 150)}...
                </p>
                <div className={styles.newsMeta}>
                  <span className={styles.newsDate}>
                    {newsItem.PublishDate
                      ? new Date(newsItem.PublishDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : new Date(newsItem.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                  </span>
                  <span className={styles.newsViews}>
                    {newsItem.viewCount || 0} lượt xem
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <p>Chưa có tin tức nào</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularNews;
