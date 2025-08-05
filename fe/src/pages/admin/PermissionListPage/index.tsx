import Breadcrumb from "@/components/admin/Breadcrumb";
import CustomPagination from "@/components/CustomPagination";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  notification,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ROUTERS } from "@/utils/constant";
import {
  permissionService,
  Employee as EmployeeType,
  CreateEmployeeData,
  UpdateEmployeeData,
} from "@/api/services/admin/permission";
import { UpsertEmployeeModal, PermissionModal } from "./components";
import styles from "./styles.module.scss";

interface EmployeeWithActions extends EmployeeType {
  key: string;
}

const PermissionListPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeWithActions[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  // TODO: Implement search functionality
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Available permissions from API
  const [groupedPermissions, setGroupedPermissions] = useState<
    Record<string, string[]>
  >({});

  // Loading states
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchAvailablePermissions = useCallback(async () => {
    try {
      const result = await permissionService.getAvailablePermissions();
      if (result.success) {
        setGroupedPermissions(result.data.groupedPermissions);
      }
    } catch (error) {
      console.error("Error fetching available permissions:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách quyền hạn",
      });
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const result = await permissionService.getAllEmployees({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
      });

      if (result.success) {
        setEmployees(
          result.data.employees.map((item: EmployeeType) => ({
            ...item,
            key: item._id,
          }))
        );
        setPagination((prev) => ({
          ...prev,
          total: result.data.total,
        }));
      } else {
        throw new Error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách nhân viên",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText]);

  useEffect(() => {
    fetchAvailablePermissions();
    fetchEmployees();
  }, [fetchAvailablePermissions, fetchEmployees]);

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const result = await permissionService.deleteEmployee(employeeId);
      if (result.success) {
        notification.success({
          message: "Thành công",
          description: result.message || "Đã xóa nhân viên thành công",
        });
        fetchEmployees();
      } else {
        throw new Error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa nhân viên",
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  // Modal handlers
  const handleAddEmployee = () => {
    setIsAddModalVisible(true);
  };

  const handleEditEmployee = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setIsEditModalVisible(true);
  };

  const handleManagePermissions = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setSelectedPermissions(employee.permissions || []);
    setIsPermissionModalVisible(true);
  };

  const handleAddSubmit = async (values: CreateEmployeeData) => {
    setSubmitLoading(true);
    try {
      const result = await permissionService.createEmployee(values);
      if (result.success) {
        notification.success({
          message: "Thành công",
          description: result.message || "Đã thêm nhân viên thành công",
        });
        setIsAddModalVisible(false);
        fetchEmployees();
      } else {
        throw new Error("Failed to create employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm nhân viên",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (values: UpdateEmployeeData) => {
    setSubmitLoading(true);
    try {
      if (!selectedEmployee?._id) return;

      const result = await permissionService.updateEmployee(
        selectedEmployee._id,
        values
      );
      if (result.success) {
        notification.success({
          message: "Thành công",
          description: result.message || "Đã cập nhật nhân viên thành công",
        });
        setIsEditModalVisible(false);
        fetchEmployees();
      } else {
        throw new Error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật nhân viên",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePermissionSubmit = async () => {
    setSubmitLoading(true);
    try {
      if (!selectedEmployee?._id) return;

      const result = await permissionService.updateEmployeePermissions(
        selectedEmployee._id,
        selectedPermissions
      );
      if (result.success) {
        notification.success({
          message: "Thành công",
          description: result.message || "Đã cập nhật quyền hạn thành công",
        });
        setIsPermissionModalVisible(false);
        fetchEmployees();
      } else {
        throw new Error("Failed to update permissions");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật quyền hạn",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePermissionChange = (checkedValues: string[]) => {
    setSelectedPermissions(checkedValues);
  };

  const columns = [
    {
      title: "Tên đăng nhập",
      dataIndex: "UserName",
      key: "UserName",
      width: 150,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span className="font-medium">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "FullName",
      key: "FullName",
      width: 200,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span className="font-medium">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      width: 200,
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <span className="text-gray-600">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "Phone",
      key: "Phone",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Quyền hạn",
      dataIndex: "permissions",
      key: "permissions",
      width: 150,
      align: "center" as const,
      render: (permissions: string[]) => (
        <Tag color="blue">{permissions?.length || 0} quyền</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
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
      width: 200,
      align: "center" as const,
      render: (_: unknown, record: EmployeeWithActions) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa thông tin">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditEmployee(record)}
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Cấp quyền">
            <Button
              type="default"
              icon={<SettingOutlined />}
              size="small"
              onClick={() => handleManagePermissions(record)}
            >
              Phân quyền
            </Button>
          </Tooltip>
          <Tooltip title="Xóa nhân viên">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa nhân viên này?"
              onConfirm={() => handleDeleteEmployee(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} size="small">
                Xóa
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.permissionListPage}>
      <Breadcrumb title="Quyền truy cập hệ thống quản trị" />

      <Card
        title="Quản lý nhân viên và phân quyền"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddEmployee}
          >
            Thêm nhân viên
          </Button>
        }
      >
        <div className="mb-4">
          <div className="flex flex-wrap items-center">
            <Input.Search
              placeholder="Tìm kiếm theo tên nhân viên..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 300, marginRight: 16, marginBottom: 8 }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={employees}
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

      <UpsertEmployeeModal
        visible={isAddModalVisible || isEditModalVisible}
        employee={isEditModalVisible ? selectedEmployee : undefined}
        onCancel={() => {
          setIsAddModalVisible(false);
          setIsEditModalVisible(false);
        }}
        onSubmit={async (values) => {
          if (isEditModalVisible) {
            await handleEditSubmit(values as UpdateEmployeeData);
          } else {
            await handleAddSubmit(values as CreateEmployeeData);
          }
        }}
        loading={submitLoading}
      />

      <PermissionModal
        visible={isPermissionModalVisible}
        employee={selectedEmployee}
        selectedPermissions={selectedPermissions}
        groupedPermissions={groupedPermissions}
        onCancel={() => setIsPermissionModalVisible(false)}
        onSubmit={handlePermissionSubmit}
        onPermissionChange={handlePermissionChange}
        loading={submitLoading}
      />
    </div>
  );
};

export default PermissionListPage;
