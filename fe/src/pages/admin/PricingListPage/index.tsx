import { pricingService } from "@/api/services/admin/pricing";
import { Pricing } from "@/api/services/user/pricing";
import Breadcrumb from "@/components/admin/Breadcrumb";
import CustomPagination from "@/components/CustomPagination";
import PricingCard from "@/components/PricingCard";
import { ROUTERS } from "@/utils/constant";
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    FileTextOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Input,
    Modal,
    Popconfirm,
    Popover,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    notification,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
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

  const fetchPricing = useCallback(async () => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, searchText, selectedCategory, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

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
      width: 200,
      render: (text: string) => (
        <span 
          className="font-medium block"
          style={{ 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={text}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 300,
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
      width: 180,
      render: (features: string[]) => {
        if (!features || features.length === 0) {
          return <span className="text-gray-400">Không có tính năng</span>;
        }

        const featuresContent = (
          <div style={{ maxWidth: '300px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 12, fontSize: '14px' }}>
              Tất cả tính năng ({features.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {features.map((feature, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                  {feature}
                </Tag>
              ))}
            </div>
          </div>
        );

        return (
          <div className="flex flex-wrap items-center gap-1">
            {features.slice(0, 2).map((feature, index) => (
              <Tag key={index} color="blue">
                {feature}
              </Tag>
            ))}
            {features.length > 2 && (
              <Popover
                content={featuresContent}
                title={null}
                trigger="click"
                placement="topLeft"
              >
                <Button 
                  type="link" 
                  size="small" 
                  style={{ padding: '2px 6px', height: 'auto', fontSize: '12px' }}
                >
                  +{features.length - 2}
                </Button>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      title: "Tài liệu",
      dataIndex: "documents",
      key: "documents",
      width: 120,
      render: (documents: { name: string; type: string; size: string; url: string }[]) => {
        if (!documents || documents.length === 0) {
          return <span className="text-gray-400">Không có tài liệu</span>;
        }

        const documentsContent = (
          <div style={{ maxWidth: '350px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 12, fontSize: '14px' }}>
              Danh sách tài liệu ({documents.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {documents.map((doc, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Tag color="green" style={{ margin: 0 }}>
                      {doc.type.toUpperCase()}
                    </Tag>
                    <span style={{ fontWeight: '500', fontSize: '13px' }}>
                      {doc.name}
                    </span>
                  </div>
                  {doc.size && (
                    <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                      Kích thước: {doc.size}
                    </div>
                  )}
                  {doc.url && (
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<DownloadOutlined />}
                      href={doc.url}
                      target="_blank"
                      style={{ padding: 0, height: 'auto', fontSize: '12px' }}
                    >
                      Tải xuống
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

        return (
          <div className="flex items-center gap-2">
            <Popover
              content={documentsContent}
              title={null}
              trigger="click"
              placement="topLeft"
            >
              <Button 
                type="link" 
                size="small" 
                icon={<FileTextOutlined />}
                style={{ padding: '2px 6px', height: 'auto', fontSize: '12px' }}
              >
                Chi tiết
              </Button>
            </Popover>
          </div>
        );
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: 120,
      align: "center" as const,
      render: (color: string) => {
        if (!color) {
          return <span className="text-gray-400">Chưa chọn màu</span>;
        }

        // Mapping color names to hex codes
        const colorMap: { [key: string]: string } = {
          blue: '#3b82f6',
          green: '#10b981',
          purple: '#8b5cf6',
          orange: '#f97316',
          red: '#ef4444',
          teal: '#14b8a6',
          indigo: '#6366f1',
          pink: '#ec4899',
          yellow: '#eab308',
          cyan: '#06b6d4',
          lime: '#84cc16',
          amber: '#f59e0b',
          emerald: '#059669',
          violet: '#7c3aed',
          rose: '#f43f5e',
          sky: '#0ea5e9',
          slate: '#64748b',
          zinc: '#71717a',
          neutral: '#737373',
          stone: '#78716c',
          gray: '#6b7280',
          'cool-gray': '#6b7280',
          'warm-gray': '#78716c'
        };

        // Color name translations
        const colorNames: { [key: string]: string } = {
          blue: 'Xanh dương',
          green: 'Xanh lá',
          purple: 'Tím',
          orange: 'Cam',
          red: 'Đỏ',
          teal: 'Xanh ngọc',
          indigo: 'Chàm',
          pink: 'Hồng',
          yellow: 'Vàng',
          cyan: 'Lục lam',
          lime: 'Vàng chanh',
          amber: 'Hổ phách',
          emerald: 'Ngọc lục bảo',
          violet: 'Tím violet',
          rose: 'Hồng rose',
          sky: 'Xanh sky',
          slate: 'Xám slate',
          zinc: 'Xám zinc',
          neutral: 'Trung tính',
          stone: 'Xám đá',
          gray: 'Xám',
          'cool-gray': 'Xám lạnh',
          'warm-gray': 'Xám ấm'
        };

        const hexColor = colorMap[color] || color;
        const colorName = colorNames[color] || color;

        return (
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: hexColor }}
              title={`${colorName} (${hexColor})`}
            ></div>
            <span className="text-xs text-gray-600 capitalize">
              {colorName}
            </span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
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
      width: 80,
      align: "center" as const,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center" as const,
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