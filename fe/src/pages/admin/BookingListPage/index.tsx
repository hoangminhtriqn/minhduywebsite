import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select, Space, Table, Tag, Popconfirm, App } from "antd";
import { DeleteOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";

import CustomPagination from "@/components/CustomPagination";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ServiceTypeModal from "@/components/admin/ServiceTypeModal";
import { getBookings, updateBookingStatus, deleteBooking, Booking as ApiBooking } from "@/api/services/admin/bookings";
import { BookingStatus } from "@/types";
import styles from "./styles.module.scss";

const { Option } = Select;

// Booking Status Configuration
const BOOKING_STATUS_CONFIG = {
  [BookingStatus.PENDING]: {
    text: 'Chờ xác nhận',
    color: '#fa8c16', // Orange text
    bgColor: '#fff7e6',
    borderColor: '#ffd591'
  },
  [BookingStatus.CONFIRMED]: {
    text: 'Đã xác nhận',
    color: '#1890ff', // Blue text
    bgColor: '#e6f7ff',
    borderColor: '#91d5ff'
  },
  [BookingStatus.COMPLETED]: {
    text: 'Hoàn thành',
    color: '#52c41a', // Green text
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f'
  },
  [BookingStatus.CANCELLED]: {
    text: 'Đã hủy',
    color: '#ff4d4f', // Red text
    bgColor: '#fff2f0',
    borderColor: '#ffccc7'
  }
} as const;

const BOOKING_STATUS_OPTIONS = [
  { value: BookingStatus.PENDING, label: 'Chờ xác nhận' },
  { value: BookingStatus.CONFIRMED, label: 'Đã xác nhận' },
  { value: BookingStatus.COMPLETED, label: 'Hoàn thành' },
  { value: BookingStatus.CANCELLED, label: 'Đã hủy' }
];

const BookingListPage: React.FC = () => {
  const { message } = App.useApp();
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serviceTypeModalVisible, setServiceTypeModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  const fetchBookings = async (
    page: number = pagination.current,
    limit: number = pagination.pageSize,
    search: string = searchTerm,
    status: string | undefined = selectedStatus
  ) => {
    setLoading(true);
    try {
      const response = await getBookings({
        page,
        limit,
        search,
        status,
      });
      setBookings(response.data.data.bookings);
      setPagination({
        ...pagination,
        current: response.data.data.pagination.page,
        pageSize: response.data.data.pagination.limit,
        total: response.data.data.pagination.total,
      });
    } catch {
      message.error("Lỗi khi tải danh sách booking");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.current, pagination.pageSize, searchTerm, selectedStatus]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchBookings(pagination.current!, pagination.pageSize!);
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination({
      ...pagination,
      current: page,
      pageSize: newPageSize,
    });
  };

  const handleViewDetails = (booking: ApiBooking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      message.success("Cập nhật trạng thái booking thành công");
      fetchBookings();
    } catch {
      message.error("Lỗi khi cập nhật trạng thái booking");
    }
  };

  const handleDelete = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId);
      message.success("Xóa booking thành công");
      fetchBookings();
    } catch {
      message.error("Lỗi khi xóa booking");
    }
  };

  const getStatusConfig = (status: string) => {
    return BOOKING_STATUS_CONFIG[status as BookingStatus] || BOOKING_STATUS_CONFIG[BookingStatus.PENDING];
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "FullName",
      key: "FullName",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "Phone",
      key: "Phone",
    },
    {
      title: "Dịch vụ",
      dataIndex: "CarModel",
      key: "CarModel",
    },
    {
      title: "Ngày đặt lịch",
      dataIndex: "TestDriveDate",
      key: "TestDriveDate",
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: "Thời gian",
      dataIndex: "TestDriveTime",
      key: "TestDriveTime",
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (status: string, record: ApiBooking) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          size="small"
        >
                     {BOOKING_STATUS_OPTIONS.map(option => {
             const statusConfig = BOOKING_STATUS_CONFIG[option.value as BookingStatus];
             return (
               <Option key={option.value} value={option.value}>
                 <span style={{ 
                   color: statusConfig.color,
                   fontWeight: '500'
                 }}>
                   {option.label}
                 </span>
               </Option>
             );
           })}
        </Select>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: ApiBooking) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            Xem
          </Button>
          <Popconfirm
            title="Xóa booking này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Không"
            okType="danger"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumb title="Quản lý đặt lịch" showAddButton={false} />

      <div className="mb-4">
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo tên, email, hoặc số điện thoại"
            onSearch={(value) => setSearchTerm(value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 150 }}
            onChange={(value) =>
              setSelectedStatus(value === "" ? undefined : value)
            }
          >
            <Option value="">Tất cả trạng thái</Option>
            {BOOKING_STATUS_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => setServiceTypeModalVisible(true)}
          >
            Quản lý loại dịch vụ
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="_id"
        loading={loading}
        pagination={false}
        onChange={handleTableChange}
      />
      
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          pageSizeOptions={["10", "20", "50", "100"]}
        />
      </div>

      <Modal
        title="Chi tiết đặt lịch"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedBooking(null);
        }}
        footer={null}
        width={600}
      >
        {selectedBooking && (
          <div className={styles.bookingDetails}>
            <div className={styles.detailRow}>
              <strong>Họ và tên:</strong>
              <span>{selectedBooking.FullName}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Email:</strong>
              <span>{selectedBooking.Email}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Số điện thoại:</strong>
              <span>{selectedBooking.Phone}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Địa chỉ:</strong>
              <span>{selectedBooking.Address}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Dịch vụ:</strong>
              <span>{selectedBooking.CarModel}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Ngày đặt lịch:</strong>
              <span>{dayjs(selectedBooking.TestDriveDate).format('DD/MM/YYYY')}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Thời gian:</strong>
              <span>{selectedBooking.TestDriveTime}</span>
            </div>
                         <div className={styles.detailRow}>
               <strong>Trạng thái:</strong>
               <span>
                 {(() => {
                   const statusConfig = getStatusConfig(selectedBooking.Status);
                   return (
                     <Tag 
                       style={{
                         color: statusConfig.color,
                         backgroundColor: statusConfig.bgColor,
                         borderColor: statusConfig.borderColor,
                         border: '1px solid'
                       }}
                     >
                       {statusConfig.text}
                     </Tag>
                   );
                 })()}
               </span>
             </div>
            {selectedBooking.Notes && (
              <div className={styles.detailRow}>
                <strong>Ghi chú:</strong>
                <span>{selectedBooking.Notes}</span>
              </div>
            )}
            <div className={styles.detailRow}>
              <strong>Ngày tạo:</strong>
              <span>{dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm')}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Cập nhật cuối:</strong>
              <span>{dayjs(selectedBooking.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
            </div>
          </div>
        )}
      </Modal>

      <ServiceTypeModal
        visible={serviceTypeModalVisible}
        onClose={() => setServiceTypeModalVisible(false)}
      />
    </div>
  );
};

export default BookingListPage;
