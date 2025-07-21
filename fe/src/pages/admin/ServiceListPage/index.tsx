import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Tag,
  Select,
  DatePicker,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "@/api/config";
import moment from "moment";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

interface ServiceRequest {
  _id: string;
  FullName: string;
  Phone: string;
  Email: string;
  CarModel: string;
  AppointmentDate: string;
  AppointmentTime: string;
  ServiceType: string;
  Status: "pending" | "confirmed" | "completed" | "cancelled";
  Notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ServiceListPage: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<ServiceRequest | null>(
    null
  );
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/service-requests`);
      setRequests(response.data.data); // Assuming data is in response.data.data
    } catch (error) {
      message.error("Lỗi khi tải danh sách yêu cầu đặt lịch");
      console.error("Error fetching service requests:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleView = (request: ServiceRequest) => {
    setViewingRequest(request);
    setIsModalVisible(true);
  };

  const handleEditStatus = (request: ServiceRequest) => {
    setEditingRequest(request);
    form.setFieldsValue({ Status: request.Status });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa yêu cầu đặt lịch này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await axios.delete(`${API_BASE_URL}/service-requests/${id}`);
          message.success("Xóa yêu cầu đặt lịch thành công");
          fetchRequests();
        } catch (error) {
          message.error("Lỗi khi xóa yêu cầu đặt lịch");
          console.error("Error deleting service request:", error);
        }
      },
    });
  };

  const handleModalOk = async () => {
    if (viewingRequest) {
      // Close view modal
      setIsModalVisible(false);
      setViewingRequest(null);
    } else if (editingRequest) {
      // Handle status update
      try {
        const values = await form.validateFields();
        await axios.put(
          `${API_BASE_URL}/service-requests/${editingRequest._id}/status`,
          { status: values.Status }
        );
        message.success("Cập nhật trạng thái thành công");
        setIsModalVisible(false);
        setEditingRequest(null);
        fetchRequests();
      } catch (error) {
        message.error("Lỗi khi cập nhật trạng thái");
        console.error("Error updating request status:", error);
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setViewingRequest(null);
    setEditingRequest(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "FullName",
      key: "FullName",
    },
    {
      title: "Điện thoại",
      dataIndex: "Phone",
      key: "Phone",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Mẫu xe",
      dataIndex: "CarModel",
      key: "CarModel",
    },
    {
      title: "Ngày đặt",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ đặt",
      dataIndex: "AppointmentTime",
      key: "AppointmentTime",
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "ServiceType",
      key: "ServiceType",
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (status: ServiceRequest["Status"]) => {
        let color;
        switch (status) {
          case "pending":
            color = "blue";
            break;
          case "confirmed":
            color = "green";
            break;
          case "completed":
            color = "success"; // Ant Design success color is green-ish
            break;
          case "cancelled":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: ServiceRequest) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditStatus(record)}
            size="small"
          >
            Sửa trạng thái
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            size="small"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumb
        title="Quản lý yêu cầu đặt lịch dịch vụ"
        showAddButton={false}
      />

      <Table
        columns={columns}
        dataSource={requests}
        rowKey="_id"
        loading={loading}
        pagination={false} // Assuming no pagination for now
      />

      {/* Modal for Viewing/Editing */}
      <Modal
        title={
          viewingRequest ? "Chi tiết yêu cầu đặt lịch" : "Cập nhật trạng thái"
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={
          viewingRequest
            ? [
                <Button key="back" onClick={handleModalCancel}>
                  Đóng
                </Button>,
              ]
            : undefined
        } // Only show close button for view modal
      >
        {viewingRequest ? (
          <div>
            <p>
              <strong>Họ và tên:</strong> {viewingRequest.FullName}
            </p>
            <p>
              <strong>Điện thoại:</strong> {viewingRequest.Phone}
            </p>
            <p>
              <strong>Email:</strong> {viewingRequest.Email}
            </p>
            <p>
              <strong>Mẫu xe:</strong> {viewingRequest.CarModel}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {moment(viewingRequest.AppointmentDate).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Giờ đặt:</strong> {viewingRequest.AppointmentTime}
            </p>
            <p>
              <strong>Loại dịch vụ:</strong> {viewingRequest.ServiceType}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Tag
                color={
                  viewingRequest.Status === "pending"
                    ? "blue"
                    : viewingRequest.Status === "confirmed"
                      ? "green"
                      : viewingRequest.Status === "completed"
                        ? "success"
                        : "red"
                }
              >
                {viewingRequest.Status.toUpperCase()}
              </Tag>
            </p>
            {viewingRequest.Notes && (
              <p>
                <strong>Ghi chú:</strong> {viewingRequest.Notes}
              </p>
            )}
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {moment(viewingRequest.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Cập nhật cuối:</strong>{" "}
              {moment(viewingRequest.updatedAt).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        ) : editingRequest ? (
          <Form form={form} layout="vertical">
            <Form.Item
              name="Status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="pending">Chờ xử lý</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>
          </Form>
        ) : null}
      </Modal>
    </div>
  );
};

export default ServiceListPage;
