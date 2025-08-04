import React, { useState } from "react";
import {
  Button,
  Modal,
  Table,
  Switch,
  Typography,
  ConfigProvider,
  Popconfirm,
} from "antd";
import { Employee as EmployeeType } from "@/api/services/admin/permission";
import styles from "../styles.module.scss";
import {
  getPermissionLabel,
  getPermissionGroup,
} from "@/utils/permissionConfig";

const { Text } = Typography;

// Interface for table data structure
interface PermissionTableData {
  key: string;
  name: string;
  description?: string;
  isGroup: boolean;
  groupKey?: string;
  permissionKey?: string;
  children?: PermissionTableData[];
  level: number;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

// Permission labels are now imported from permissionConfig

interface PermissionModalProps {
  visible: boolean;
  employee: EmployeeType | null;
  selectedPermissions: string[];
  groupedPermissions: Record<string, string[]>;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  onPermissionChange: (checkedValues: string[]) => void;
  loading?: boolean;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  visible,
  employee,
  selectedPermissions,
  groupedPermissions,
  onCancel,
  onSubmit,
  onPermissionChange,
  loading = false,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  // Reset expanded rows when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setExpandedRowKeys([]);
    }
  }, [visible]);

  // Transform grouped permissions to table data structure
  const transformToTableData = (): PermissionTableData[] => {
    const tableData: PermissionTableData[] = [];

    Object.entries(groupedPermissions).forEach(([group, permissions]) => {
      // Get Vietnamese group name from the first permission in the group
      const firstPermission = permissions[0];
      const groupLabel =
        getPermissionGroup(firstPermission) ||
        group.charAt(0).toUpperCase() + group.slice(1);
      const groupKey = `group-${group}`;

      // Create group row
      const groupRow: PermissionTableData = {
        key: groupKey,
        name: groupLabel,
        description: `Nhóm quyền ${groupLabel}`,
        isGroup: true,
        groupKey: group,
        level: 0,
        children: permissions.map((permission) => ({
          key: permission,
          name: getPermissionLabel(permission),
          description: getPermissionLabel(permission),
          isGroup: false,
          permissionKey: permission,
          level: 1,
          lastModifiedBy: selectedPermissions.includes(permission)
            ? "Admin"
            : "Chưa cấp quyền",
          lastModifiedAt: selectedPermissions.includes(permission)
            ? new Date().toLocaleDateString("vi-VN")
            : "-",
        })),
      };

      tableData.push(groupRow);
    });

    return tableData;
  };

  const tableData = transformToTableData();

  // Helper functions
  const getGroupPermissions = (groupKey: string): string[] => {
    return groupedPermissions[groupKey] || [];
  };

  const getSelectedCountForGroup = (
    groupKey: string
  ): { selected: number; total: number } => {
    const permissions = getGroupPermissions(groupKey);
    const selected = permissions.filter((p) =>
      selectedPermissions.includes(p)
    ).length;
    return { selected, total: permissions.length };
  };

  const isGroupFullySelected = (groupKey: string): boolean => {
    const { selected, total } = getSelectedCountForGroup(groupKey);
    return selected === total && total > 0;
  };

  // Handle group toggle
  const handleGroupToggle = (groupKey: string, checked: boolean) => {
    const permissions = getGroupPermissions(groupKey);
    let newSelectedPermissions: string[];

    if (checked) {
      // Add all group permissions
      const combinedPermissions = selectedPermissions.concat(permissions);
      newSelectedPermissions = Array.from(new Set(combinedPermissions));
    } else {
      // Remove all group permissions
      newSelectedPermissions = selectedPermissions.filter(
        (p) => !permissions.includes(p)
      );
    }

    onPermissionChange(newSelectedPermissions);
  };

  // Handle individual permission toggle
  const handlePermissionToggle = (permissionKey: string, checked: boolean) => {
    let newSelectedPermissions: string[];

    if (checked) {
      newSelectedPermissions = [...selectedPermissions, permissionKey];
    } else {
      newSelectedPermissions = selectedPermissions.filter(
        (p) => p !== permissionKey
      );
    }

    onPermissionChange(newSelectedPermissions);
  };

  // Handle select/deselect all permissions
  const handleSelectAll = () => {
    const allPermissions = Object.values(groupedPermissions).flat();
    onPermissionChange(allPermissions);
  };

  const handleDeselectAll = () => {
    onPermissionChange([]);
  };

  // Get total permissions count
  const getTotalPermissions = () => {
    return Object.values(groupedPermissions).flat().length;
  };

  // Check if all permissions are selected
  const isAllPermissionsSelected = () => {
    const totalPermissions = getTotalPermissions();
    return (
      selectedPermissions.length === totalPermissions && totalPermissions > 0
    );
  };

  // Handle row click for expand/collapse
  const handleRowClick = (record: PermissionTableData) => {
    if (record.isGroup) {
      const isExpanded = expandedRowKeys.includes(record.key);
      if (isExpanded) {
        setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.key));
      } else {
        setExpandedRowKeys([...expandedRowKeys, record.key]);
      }
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Tên Quyền",
      dataIndex: "name",
      key: "name",
      width: "35%",
      render: (text: string, record: PermissionTableData) => {
        const indent = record.level * 24;
        return (
          <div
            style={{ paddingLeft: indent }}
            className={styles.permissionName}
          >
            {record.isGroup && (
              <>
                <span className={styles.groupName}>{text}</span>
                <span className={styles.permissionCount}>
                  {getSelectedCountForGroup(record.groupKey!).selected}/
                  {getSelectedCountForGroup(record.groupKey!).total}
                </span>
              </>
            )}
            {!record.isGroup && (
              <span className={styles.childPermission}>{text}</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      key: "status",
      width: "12%",
      align: "center" as const,
      render: (_: unknown, record: PermissionTableData) => {
        if (record.isGroup) {
          const isFullySelected = isGroupFullySelected(record.groupKey!);

          return (
            <div className={styles.statusColumn}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#1890ff",
                  },
                }}
              >
                <Switch
                  checked={isFullySelected}
                  onChange={(checked) => {
                    handleGroupToggle(record.groupKey!, checked);
                  }}
                  size="small"
                />
              </ConfigProvider>
            </div>
          );
        } else {
          const isSelected = selectedPermissions.includes(
            record.permissionKey!
          );
          return (
            <div
              className={styles.statusColumn}
              onClick={(e) => e.stopPropagation()}
            >
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#1890ff",
                  },
                }}
              >
                <Switch
                  checked={isSelected}
                  onChange={(checked) => {
                    handlePermissionToggle(record.permissionKey!, checked);
                  }}
                  size="small"
                />
              </ConfigProvider>
            </div>
          );
        }
      },
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: "28%",
      render: (text: string, record: PermissionTableData) => (
        <Text type="secondary" className="text-xs">
          {record.isGroup
            ? `${getSelectedCountForGroup(record.groupKey!).total} quyền`
            : text}
        </Text>
      ),
    },
    {
      title: "Thông tin cập nhật",
      key: "lastModified",
      width: "25%",
      render: (_: unknown, record: PermissionTableData) => {
        if (record.isGroup) {
          const { selected, total } = getSelectedCountForGroup(
            record.groupKey!
          );
          return (
            <div className={styles.statusIndicator}>
              <div className={`${styles.statusDot} ${styles.group}`}></div>
              <div className={`${styles.statusText} ${styles.primary}`}>
                {selected > 0
                  ? `${selected}/${total} đã cấp | Cập nhật gần đây`
                  : "Chưa cấp quyền"}
              </div>
            </div>
          );
        } else {
          const isActive = selectedPermissions.includes(record.permissionKey!);
          return (
            <div className={styles.statusIndicator}>
              <div
                className={`${styles.statusDot} ${isActive ? styles.active : styles.inactive}`}
              ></div>
              <div className={`${styles.statusText} ${styles.primary}`}>
                {record.lastModifiedBy === "Chưa cấp quyền"
                  ? record.lastModifiedBy
                  : `${record.lastModifiedBy} | ${record.lastModifiedAt}`}
              </div>
            </div>
          );
        }
      },
    },
  ];

  return (
    <Modal
      title={`Phân quyền cho: ${employee?.FullName}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="90vw"
      style={{ maxWidth: "1200px" }}
      className={styles.permissionModal}
    >
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
          expandIcon: () => null, // Xóa expand icon mặc định
          rowExpandable: (record) => record.isGroup,
          indentSize: 0,
          expandRowByClick: true, // Cho phép click row để expand
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: record.isGroup ? "groupRow" : "",
          style: {
            cursor: record.isGroup ? "pointer" : "default",
            backgroundColor: record.isGroup ? "#f5f5f5" : "transparent",
          },
        })}
        size="small"
        className={styles.permissionTable}
        scroll={{ y: 500 }}
        components={{
          body: {
            row: (props: {
              style?: React.CSSProperties;
              [key: string]: unknown;
            }) => (
              <tr
                {...props}
                style={{
                  ...props.style,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            ),
          },
        }}
        style={
          {
            "--ant-primary-color": "#1890ff",
            "--ant-success-color": "#52c41a",
          } as React.CSSProperties
        }
      />

      <div className={styles.modalFooter}>
        <div className={styles.counterSection}>
          <span className={styles.counterIcon}>📊</span>
          <span className={styles.counterText}>
            Tổng: {selectedPermissions.length} quyền được chọn
          </span>
        </div>

        <div className={styles.buttonGroup}>
          <div
            className={styles.actionButtons}
            style={{ display: "flex", gap: "8px" }}
          >
            {!isAllPermissionsSelected() && (
              <Popconfirm
                title="Chọn tất cả quyền"
                description={`Bạn có chắc chắn muốn cấp tất cả ${getTotalPermissions()} quyền cho nhân viên này?`}
                onConfirm={handleSelectAll}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button type="default" size="middle" disabled={loading}>
                  Chọn tất cả
                </Button>
              </Popconfirm>
            )}

            {selectedPermissions.length > 0 && (
              <Popconfirm
                title="Bỏ chọn tất cả quyền"
                description={`Bạn có chắc chắn muốn bỏ tất cả ${selectedPermissions.length} quyền đã chọn?`}
                onConfirm={handleDeselectAll}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button danger size="middle" disabled={loading}>
                  Bỏ chọn tất cả
                </Button>
              </Popconfirm>
            )}
          </div>

          <div
            className={styles.mainButtons}
            style={{ display: "flex", gap: "8px" }}
          >
            <Button onClick={onCancel} disabled={loading} size="middle">
              Hủy bỏ
            </Button>

            <Button
              type="primary"
              onClick={onSubmit}
              disabled={loading}
              loading={loading}
              size="middle"
              icon={<span>💾</span>}
            >
              Lưu quyền
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionModal;
