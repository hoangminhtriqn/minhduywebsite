import { pricingService } from "@/api/services/admin/pricing";
import { Pricing } from "@/api/services/user/pricing";
import Breadcrumb from "@/components/admin/Breadcrumb";
import CustomPagination from "@/components/CustomPagination";
import PricingCard from "@/components/PricingCard";
import { ROUTERS, colorOptions } from "@/utils/constant";
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
  Tooltip,
  notification,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import usePermissions from "@/hooks/usePermissions";

const { confirm } = Modal;
const { Option } = Select;

interface PricingWithActions extends Pricing {
  key: string;
}

const PricingListPage: React.FC = () => {
  const [pricing, setPricing] = useState<PricingWithActions[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
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
  const { canCreatePricing, canEditPricing, canDeletePricing } =
    usePermissions();

  const fetchPricing = useCallback(async () => {
    setLoading(true);
    try {
      const result = await pricingService.getAllPricing({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
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
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    selectedStatus,
    sortBy,
    sortOrder,
  ]);

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
        <Tooltip title={text} placement="topLeft">
          <span
            className="font-medium block overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.5em",
              maxHeight: "1.5em",
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },

    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (text: string) => (
        <Tooltip
          title={text.length > 50 ? text : undefined}
          placement="topLeft"
        >
          <span
            className="text-gray-600 block overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.5em",
              maxHeight: "1.5em",
            }}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Tính năng",
      dataIndex: "features",
      key: "features",
      width: 120,
      align: "center" as const,
      render: (features: string[]) => {
        if (!features || features.length === 0) {
          return <span className="text-gray-400">Không có tính năng</span>;
        }

        const featuresContent = (
          <div style={{ maxWidth: "300px" }}>
            <div
              style={{ fontWeight: "bold", marginBottom: 12, fontSize: "14px" }}
            >
              Danh sách tính năng ({features.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {features.map((feature, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: "4px" }}>
                  {feature}
                </Tag>
              ))}
            </div>
          </div>
        );

        return (
          <Popover
            content={featuresContent}
            title={null}
            trigger="click"
            placement="topLeft"
          >
            <Button
              type="link"
              size="small"
              style={{
                padding: "2px 6px",
                height: "auto",
                fontSize: "12px",
              }}
            >
              Xem chi tiết
            </Button>
          </Popover>
        );
      },
    },
    {
      title: "Tài liệu",
      dataIndex: "documents",
      key: "documents",
      width: 120,
      render: (
        documents: { name: string; type: string; size: string; url: string }[]
      ) => {
        if (!documents || documents.length === 0) {
          return <span className="text-gray-400">Không có tài liệu</span>;
        }

        const documentsContent = (
          <div style={{ maxWidth: "350px" }}>
            <div
              style={{ fontWeight: "bold", marginBottom: 12, fontSize: "14px" }}
            >
              Danh sách tài liệu ({documents.length})
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {documents.map((doc, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <Tag color="green" style={{ margin: 0 }}>
                      {doc.type.toUpperCase()}
                    </Tag>
                    <span style={{ fontWeight: "500", fontSize: "13px" }}>
                      {doc.name}
                    </span>
                  </div>
                  {doc.size && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginBottom: "4px",
                      }}
                    >
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
                      style={{ padding: 0, height: "auto", fontSize: "12px" }}
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
                style={{ padding: "2px 6px", height: "auto", fontSize: "12px" }}
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

        const colorOption = colorOptions.find(
          (option) => option.value === color
        );
        const colorName = colorOption ? colorOption.label : color;

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Tag
              color={color}
              style={{ margin: 0, fontSize: "12px", fontWeight: "bold" }}
            >
              {colorName}
            </Tag>
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
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center" as const,
      render: (_: unknown, record: PricingWithActions) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            >
              Xem
            </Button>
          </Tooltip>
          {canEditPricing() && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() =>
                  navigate(
                    ROUTERS.ADMIN.PRICE_LIST_EDIT.replace(":id", record._id)
                  )
                }
              >
                Sửa
              </Button>
            </Tooltip>
          )}
          {canDeletePricing() && (
            <Tooltip title="Xóa">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                onConfirm={() => handleDeletePricing(record._id)}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<DeleteOutlined />} size="small">
                  Xóa
                </Button>
              </Popconfirm>
            </Tooltip>
          )}
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
          canCreatePricing() && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTERS.ADMIN.PRICE_LIST_ADD)}
            >
              Thêm bảng giá
            </Button>
          )
        }
      >
        <div className="mb-4">
          <div className="flex flex-wrap items-center">
            <Input.Search
              placeholder="Tìm kiếm theo tiêu đề..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 300, marginRight: 16, marginBottom: 8 }}
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              style={{ width: 150, marginRight: 16, marginBottom: 8 }}
              onChange={handleStatusChange}
            >
              <Option value="">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
            <Select
              placeholder="Sắp xếp"
              defaultValue="createdAt-desc"
              style={{ width: 150, marginBottom: 8 }}
              onChange={handleSortChange}
            >
              <Option value="createdAt-desc">Mới nhất</Option>
              <Option value="createdAt-asc">Cũ nhất</Option>
              <Option value="title-asc">Tên A-Z</Option>
              <Option value="title-desc">Tên Z-A</Option>
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
          open={isPreviewModalVisible}
          onCancel={() => {
            setIsPreviewModalVisible(false);
            setSelectedPricing(null);
          }}
          closeIcon={false}
          footer={[
            <Button
              key="close"
              onClick={() => {
                setIsPreviewModalVisible(false);
                setSelectedPricing(null);
              }}
            >
              Đóng
            </Button>,
          ]}
          width={450}
        >
          <PricingCard pricing={selectedPricing} variant="admin" />
        </Modal>
      )}
    </div>
  );
};

export default PricingListPage;
