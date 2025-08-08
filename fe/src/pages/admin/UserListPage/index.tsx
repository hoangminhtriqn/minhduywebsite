import CustomPagination from "@/components/CustomPagination";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ProtectedRoute from "@/components/ProtectedRoute";
import usePermissions from "@/hooks/usePermissions";
import { EditOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Popconfirm, // Thêm Popconfirm
} from "antd";
import React, { useEffect, useState } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import {
  getUsers,
  updateUser,
  updateUserStatus,
} from "@/api/services/admin/user";
import { useAuth } from "@/contexts/AuthContext";
const { Option } = Select;

// Enum cho User Roles
enum UserRole {
  USER = "user",
  EMPLOYEE = "employee",
  ADMIN = "admin",
}

// Config cho roles
const ROLE_CONFIG = {
  [UserRole.USER]: {
    label: "Người dùng",
    color: "blue",
  },
  [UserRole.EMPLOYEE]: {
    label: "Nhân viên",
    color: "orange",
  },
  [UserRole.ADMIN]: {
    label: "Quản trị viên",
    color: "red",
  },
};

interface User {
  _id: string;
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Address: string;
  Role: string;
  Status: string;
  createdAt: string;
  updatedAt: string;
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { canEditUsers, hasPermission } = usePermissions();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user: authUser } = useAuth();
  const currentUserId = authUser?._id || localStorage.getItem("userId");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | undefined>(
    undefined
  );

  const fetchUsers = async (
    page: number = pagination.current,
    limit: number = pagination.pageSize,
    search: string = searchTerm,
    role: string | undefined = selectedRole
  ) => {
    setLoading(true);
    try {
      const response = await getUsers({
        page,
        limit,
        search,
        role,
      });
      setUsers(response.data.users);
      setPagination({
        ...pagination,
        current: response.data.pagination.page,
        pageSize: response.data.pagination.limit,
        total: response.data.pagination.total,
      });
    } catch (error) {
      message.error("Lỗi khi tải danh sách người dùng");
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchTerm, selectedRole]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetchUsers(pagination.current!, pagination.pageSize!);
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination({
      ...pagination,
      current: page,
      pageSize: newPageSize,
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      UserName: user.UserName,
      Email: user.Email,
      Role: user.Role,
    });
    setIsModalVisible(true);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (userId === currentUserId) {
      message.warning("Không thể cập nhật trạng thái tài khoản của chính bạn");
      return;
    }
    try {
      await updateUserStatus(userId, newStatus);
      message.success("Cập nhật trạng thái người dùng thành công");
      fetchUsers();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái người dùng");
      console.error("Error updating user status:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateUser(editingUser._id, values);
        message.success("Cập nhật thông tin người dùng thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      message.error("Lỗi khi cập nhật thông tin người dùng");
      console.error("Error updating user:", error);
    }
  };

  const columns = [
    {
      title: "Tên đăng nhập",
      dataIndex: "UserName",
      key: "UserName",
    },
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
      title: "Vai trò",
      dataIndex: "Role",
      key: "Role",
      render: (role: string) => {
        const config =
          ROLE_CONFIG[role as UserRole] || ROLE_CONFIG[UserRole.USER];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Khóa"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: User) => (
        <Space size="middle">
          {canEditUsers() && record._id !== currentUserId && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            >
              Sửa
            </Button>
          )}
          {hasPermission("users.status.update") && record._id !== currentUserId && (
            <>
              {record.Status === "active" ? (
                <Popconfirm
                  title="Xác nhận khóa người dùng?"
                  onConfirm={() => handleStatusChange(record._id, "inactive")}
                  okText="Khóa"
                  cancelText="Hủy"
                  okType="danger"
                >
                  <Button danger icon={<LockOutlined />} size="small">
                    Khóa
                  </Button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="Xác nhận mở khóa người dùng?"
                  onConfirm={() => handleStatusChange(record._id, "active")}
                  okText="Mở khóa"
                  cancelText="Hủy"
                  okType="primary"
                >
                  <Button type="primary" icon={<UnlockOutlined />} size="small">
                    Mở khóa
                  </Button>
                </Popconfirm>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb title="Quản lý người dùng" showAddButton={false} />

      <div className="mb-4">
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo tên đăng nhập, email, hoặc SĐT"
            onSearch={(value) => setSearchTerm(value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo vai trò"
            allowClear
            style={{ width: 150 }}
            onChange={(value) =>
              setSelectedRole(value === "" ? undefined : value)
            }
          >
            <Option value="">Tất cả vai trò</Option>
            {Object.entries(ROLE_CONFIG).map(([role, config]) => (
              <Option key={role} value={role}>
                {config.label}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={false}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
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
        title="Chỉnh sửa thông tin người dùng"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="UserName"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
              <Select
              placeholder="Chọn vai trò"
              disabled={
                editingUser?._id === currentUserId &&
                editingUser?.Role === UserRole.ADMIN
              }
            >
              {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                <Option key={role} value={role}>
                  {config.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ProtectedUserListPage: React.FC = () => {
  return (
    <ProtectedRoute requiredPermissions={["users.view"]}>
      <UserListPage />
    </ProtectedRoute>
  );
};

export default ProtectedUserListPage;
