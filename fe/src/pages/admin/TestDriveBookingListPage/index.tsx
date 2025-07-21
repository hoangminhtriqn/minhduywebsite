import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Typography,
  DatePicker,
  Card,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { api } from "@/api";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import CustomPagination from "@/components/CustomPagination";
import Breadcrumb from "@/components/admin/Breadcrumb";

interface UserInfo {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
}

interface Product {
  _id: string;
  Product_Name: string;
  Price: number;
  Main_Image: string;
  Description?: string;
}

interface OrderTestDrive {
  _id: string;
  UserID: UserInfo;
  ProductID: string;
  product?: Product;
  Order_Date: string;
  Test_Drive_Date: string;
  Address: string;
  Status: "pending" | "confirmed" | "completed" | "cancelled";
  Notes?: string;
  Total_Amount: number;
  ImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const TestDriveBookingListPage: React.FC = () => {
  const [bookings, setBookings] = useState<OrderTestDrive[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [products, setProducts] = useState<Record<string, Product>>({});

  const fetchProductDetails = async (productIds: string[]) => {
    try {
      const uniqueIds = Array.from(new Set(productIds));
      const response = await api.get("/products", {
        params: {
          ids: uniqueIds.join(","),
        },
      });

      if (response.data.success) {
        const productsMap = response.data.data.reduce(
          (acc: Record<string, Product>, product: Product) => {
            acc[product._id] = product;
            return acc;
          },
          {}
        );
        setProducts(productsMap);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/test-drive-orders", {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchTerm,
          status: selectedStatus,
          startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        },
      });

      if (response.data.success) {
        const bookingsData = response.data.data;
        setBookings(bookingsData);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
        }));

        // Fetch product details for all bookings
        const productIds = bookingsData.map(
          (booking: OrderTestDrive) => booking.ProductID
        );
        await fetchProductDetails(productIds);
      } else {
        message.error("Không thể tải danh sách đơn đặt lịch lái thử");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn đặt lịch lái thử");
      console.error("Error fetching test drive bookings:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [
    pagination.current,
    pagination.pageSize,
    searchTerm,
    selectedStatus,
    dateRange,
  ]);

  const handleTableChange = (pagination: any) => {
    // This function is no longer needed since we're using CustomPagination
    // The pagination is handled by handlePaginationChange
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination({
      ...pagination,
      current: page,
      pageSize: newPageSize,
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === "" ? undefined : value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    setDateRange(dates);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await api.put(`/test-drive-orders/${bookingId}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        message.success("Cập nhật trạng thái đơn đặt lịch thành công");
        fetchBookings();
      } else {
        message.error("Không thể cập nhật trạng thái đơn đặt lịch");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái đơn đặt lịch");
      console.error("Error updating booking status:", error);
    }
  };

  const handleDelete = async (bookingId: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa đơn đặt lịch này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          const response = await api.delete(`/test-drive-orders/${bookingId}`);
          if (response.data.success) {
            message.success("Xóa đơn đặt lịch thành công");
            fetchBookings();
          } else {
            message.error("Không thể xóa đơn đặt lịch");
          }
        } catch (error) {
          message.error("Lỗi khi xóa đơn đặt lịch");
          console.error("Error deleting booking:", error);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "#F59E0B",
      confirmed: "#3B82F6",
      completed: "#10B981",
      cancelled: "#EF4444",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status: string) => {
    const statusTexts: { [key: string]: string } = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      completed: "Đã hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusTexts[status] || status;
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      width: 100,
      fixed: "left" as const,
      render: (id: string) => (
        <span className={styles.orderId}>{id.slice(-8).toUpperCase()}</span>
      ),
    },
    {
      title: "Khách hàng",
      key: "UserID",
      width: 150,
      render: (_: any, record: OrderTestDrive) => (
        <div className={styles.customerInfo}>
          <div className={styles.name}>{record.UserID?.UserName}</div>
          <div className={styles.phone}>{record.UserID?.Phone}</div>
        </div>
      ),
    },
    {
      title: "Thông tin xe",
      key: "ProductID",
      width: 300,
      render: (_: any, record: OrderTestDrive) => {
        const product = products[record.ProductID];
        const productName =
          record.Notes?.match(/lái thử (.*?) cho/)?.[1] || "Đang cập nhật";

        return (
          <div className={styles.productInfo}>
            <div className={styles.productImageWrapper}>
              <img
                src={record.ImageUrl || "/images/car-placeholder.png"}
                alt={productName}
                className={styles.productImage}
              />
            </div>
            <div className={styles.productDetails}>
              <div className={styles.productName}>{productName}</div>
              <div className={styles.productPrice}>
                {record.Total_Amount?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
              {record.Notes && (
                <div className={styles.productDescription}>{record.Notes}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "Address",
      key: "Address",
      width: 250,
      ellipsis: true,
      render: (address: string) => (
        <Tooltip title={address} placement="topLeft">
          <div className={styles.address}>{address}</div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "Order_Date",
      key: "Order_Date",
      width: 120,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format("DD/MM/YYYY HH:mm")}>
          <span className={styles.date}>
            {dayjs(date).format("DD/MM/YYYY")}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Ngày lái thử",
      dataIndex: "Test_Drive_Date",
      key: "Test_Drive_Date",
      width: 120,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format("DD/MM/YYYY HH:mm")}>
          <span className={styles.date}>
            {dayjs(date).format("DD/MM/YYYY")}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      width: 150,
      render: (status: string, record: OrderTestDrive) => (
        <div className={styles.statusCell}>
          <Select
            value={status}
            onChange={(value) => handleUpdateStatus(record._id, value)}
            className={styles.statusSelect}
          >
            <Option value="pending">Chờ xử lý</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="completed">Đã hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      width: 150,
      render: (_: any, record: OrderTestDrive) => (
        <div className={styles.actionButtons}>
          {record.Status === "pending" && (
            <Button
              type="primary"
              onClick={() => handleUpdateStatus(record._id, "confirmed")}
              className={styles.confirmButton}
              size="small"
            >
              Xác nhận
            </Button>
          )}
          {record.Status === "confirmed" && (
            <Button
              type="primary"
              onClick={() => handleUpdateStatus(record._id, "completed")}
              className={styles.completeButton}
              size="small"
            >
              Hoàn thành
            </Button>
          )}
          <Button danger onClick={() => handleDelete(record._id)} size="small">
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.contentCard}>
        <Breadcrumb
          title="Quản lý đơn đặt lịch lái thử"
          showAddButton={false}
        />

        <div className={styles.filterSection}>
          <Input.Search
            placeholder="Tìm kiếm theo tên, số điện thoại..."
            onSearch={handleSearch}
            className={styles.searchInput}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            onChange={handleStatusChange}
            className={styles.statusFilter}
          >
            <Option value="">Tất cả</Option>
            <Option value="pending">Chờ xử lý</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="completed">Đã hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
          <RangePicker
            placeholder={["Từ ngày", "Đến ngày"]}
            onChange={handleDateRangeChange}
            className={styles.datePicker}
          />
        </div>

        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          loading={loading}
          pagination={false}
          onChange={handleTableChange}
          scroll={{ x: 1240 }}
          size="middle"
          className={styles.table}
        />
        <div className={styles.paginationContainer}>
          <CustomPagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      </Card>
    </div>
  );
};

export default TestDriveBookingListPage;
