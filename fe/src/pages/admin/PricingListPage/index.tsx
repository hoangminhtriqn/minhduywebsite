import { pricingService } from "@/api/services/admin/pricing";
import { Pricing } from "@/api/services/user/pricing";
import Breadcrumb from "@/components/admin/Breadcrumb";
import CustomPagination from "@/components/CustomPagination";
import PricingCard from "@/components/PricingCard";
import { ROUTERS } from "@/utils/constant";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const { confirm } = Modal;
const { Option } = Select;

interface PricingWithActions extends Pricing {
  key: string;
}

const PricingListPage: React.FC = () => {
  const [pricing, setPricing] = useState<PricingWithActions[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedPricing, setSelectedPricing] = useState<Pricing | null>(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  const navigate = useNavigate();

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const result = await pricingService.getAllPricing({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        category: selectedCategory,
        status: selectedStatus,
        sortBy,
        sortOrder,
      });
      setPricing(
        result.pricing.map((item) => ({
          ...item,
          key: item._id,
        }))
      );
      setPagination((prev) => ({
        ...prev,
        total: result.total,
      }));
    } catch (error) {
      console.error("Error fetching pricing:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách bảng giá",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [pagination.current, pagination.pageSize, searchText, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const handleDeletePricing = async (pricingId: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa bảng giá này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await pricingService.deletePricing(pricingId);
          notification.success({
            message: "Thành công",
            description: "Đã xóa bảng giá thành công",
          });
          fetchPricing();
        } catch (error) {
          console.error("Error deleting pricing:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa bảng giá",
          });
        }
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handleViewDetails = (pricing: Pricing) => {
    setSelectedPricing(pricing);
    setIsPreviewModalVisible(true);
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <span className="text-gray-600">
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: "Tính năng",
      dataIndex: "features",
      key: "features",
      render: (features: string[]) => (
        <div className="flex flex-wrap gap-1">
          {features?.slice(0, 2).map((feature, index) => (
            <Tag key={index} color="blue">
              {feature}
            </Tag>
          ))}
          {features && features.length > 2 && (
            <Tag color="gray">+{features.length - 2}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Tài liệu",
      dataIndex: "documents",
      key: "documents",
      render: (documents: { name: string; type: string; size: string; url: string }[]) => (
        <span className="text-gray-600">{documents?.length || 0} tài liệu</span>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color: string) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          ></div>
          <span className="capitalize">{color}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thứ tự",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: PricingWithActions) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(ROUTERS.ADMIN.PRICE_LIST_EDIT.replace(':id', record._id))}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeletePricing(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.pricingListPage}>
      <Breadcrumb title="Bảng giá" />

      <Card
        title="Quản lý Bảng giá"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(ROUTERS.ADMIN.PRICE_LIST_ADD)}
          >
            Thêm bảng giá
          </Button>
        }
      >
        <div className="mb-4 space-y-4">
          <div className="flex flex-wrap gap-4">
            <Input.Search
              placeholder="Tìm kiếm theo tiêu đề..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Lọc theo danh mục"
              allowClear
              style={{ width: 200 }}
              onChange={handleCategoryChange}
            >
              <Option value="">Tất cả danh mục</Option>
              <Option value="basic">Cơ bản</Option>
              <Option value="premium">Cao cấp</Option>
              <Option value="enterprise">Doanh nghiệp</Option>
            </Select>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: 150 }}
              onChange={handleStatusChange}
            >
              <Option value="">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
            <Select
              placeholder="Sắp xếp"
              defaultValue="createdAt-desc"
              style={{ width: 150 }}
              onChange={handleSortChange}
            >
              <Option value="createdAt-desc">Mới nhất</Option>
              <Option value="createdAt-asc">Cũ nhất</Option>
              <Option value="title-asc">Tên A-Z</Option>
              <Option value="title-desc">Tên Z-A</Option>
              <Option value="order-asc">Thứ tự tăng</Option>
              <Option value="order-desc">Thứ tự giảm</Option>
            </Select>
          </div>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={pricing}
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </Spin>

        <div className="mt-4">
          <CustomPagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
          />
        </div>
      </Card>

      {/* Preview Modal */}
      {selectedPricing && (
        <Modal
          title="Xem chi tiết bảng giá"
          open={isPreviewModalVisible}
          onCancel={() => {
            setIsPreviewModalVisible(false);
            setSelectedPricing(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setIsPreviewModalVisible(false);
              setSelectedPricing(null);
            }}>
              Đóng
            </Button>
          ]}
          width={800}
        >
          <PricingCard
            pricing={selectedPricing}
            variant="admin"
          />
        </Modal>
      )}
    </div>
  );
};

export default PricingListPage; 