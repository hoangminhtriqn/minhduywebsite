import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, message, Typography, Card, Row, Col, Input, Image, Tag, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getAllNewsEvents,
  deleteNewsEvent,
  NewsEvent,
} from "@/api/services/user/newsEvents";
import Breadcrumb from "@/components/admin/Breadcrumb";
import styles from "./NewsListPage.module.scss";

const { Title } = Typography;
const { confirm } = Modal;

const NewsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsEvent | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await getAllNewsEvents();
      setNews(response.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      message.error("Không thể tải danh sách tin tức.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteNewsEvent(id);
      message.success("Xóa tin tức thành công.");
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      message.error("Không thể xóa tin tức.");
    }
  };

  const showDeleteConfirm = (news: NewsEvent) => {
    confirm({
      title: "Xác nhận xóa tin tức?",
      content: `Bạn có chắc chắn muốn xóa tin tức "${news.Title}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDelete(news._id);
      },
    });
  };

  const handlePreview = (news: NewsEvent) => {
    setSelectedNews(news);
    setPreviewVisible(true);
  };

  const filteredNews = news.filter((item) =>
    item.Title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "ImageUrl",
      key: "image",
      width: 100,
      render: (image: string) => (
        <Image
          src={image || "/images/default-news-image.jpg"}
          alt="News"
          width={60}
          height={40}
          style={{ objectFit: "cover", borderRadius: "4px" }}
          fallback="/images/default-news-image.jpg"
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "Title",
      key: "title",
      render: (title: string) => (
        <div style={{ maxWidth: 300 }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const statusConfig = {
          active: { color: "green", text: "Hoạt động" },
          inactive: { color: "red", text: "Không hoạt động" },
          draft: { color: "orange", text: "Bản nháp" },
          published: { color: "blue", text: "Đã xuất bản" },
          archived: { color: "gray", text: "Đã lưu trữ" },
        };
        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.inactive;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_: any, record: NewsEvent) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/admin/news/edit/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.newsListPage}>
      <div className={styles.header}>
        <Breadcrumb title="Quản lý tin tức" />
      </div>

      <Card className={styles.contentCard}>
        <div className={styles.toolbar}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Input
                placeholder="Tìm kiếm tin tức..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="large"
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => navigate("/admin/news/add")}
              >
                Thêm tin tức mới
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredNews}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tin tức`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title={selectedNews?.Title}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
      >
        {selectedNews && (
          <div>
            <Image
              src={selectedNews.ImageUrl || "/images/default-news-image.jpg"}
              alt={selectedNews.Title}
              style={{ width: "100%", marginBottom: 16 }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: selectedNews.Content }}
              style={{ maxHeight: 400, overflow: "auto" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NewsListPage;
