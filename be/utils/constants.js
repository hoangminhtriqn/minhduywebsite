const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const BOOKING_STATUS_CONFIG = {
  [BookingStatus.PENDING]: {
    text: "Chờ xác nhận",
    color: "#fa8c16",
    bgColor: "#fff7e6",
    borderColor: "#ffd591",
  },
  [BookingStatus.CONFIRMED]: {
    text: "Đã xác nhận",
    color: "#1890ff",
    bgColor: "#e6f7ff",
    borderColor: "#91d5ff",
  },
  [BookingStatus.COMPLETED]: {
    text: "Hoàn thành",
    color: "#52c41a",
    bgColor: "#f6ffed",
    borderColor: "#b7eb8f",
  },
  [BookingStatus.CANCELLED]: {
    text: "Đã hủy",
    color: "#ff4d4f",
    bgColor: "#fff2f0",
    borderColor: "#ffccc7",
  },
};

const BOOKING_STATUS_OPTIONS = [
  { value: BookingStatus.PENDING, label: "Chờ xác nhận" },
  { value: BookingStatus.CONFIRMED, label: "Đã xác nhận" },
  { value: BookingStatus.COMPLETED, label: "Hoàn thành" },
  { value: BookingStatus.CANCELLED, label: "Đã hủy" },
];

module.exports = {
  BookingStatus,
  BOOKING_STATUS_CONFIG,
  BOOKING_STATUS_OPTIONS,
};
