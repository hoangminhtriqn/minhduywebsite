import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Divider, Modal, Space, Typography } from "antd";
import styles from "../styles.module.scss";

const { Title, Text } = Typography;

interface EmployeeRef {
  _id: string;
  FullName?: string;
  UserName?: string;
}

interface PermissionModalProps {
  visible: boolean;
  employee: EmployeeRef | null;
  selectedPermissions: string[];
  groupedPermissions: Record<string, string[]>;
  onCancel: () => void;
  onSubmit: () => Promise<void> | void;
  onPermissionChange: (checked: string[]) => void;
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
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setChecked(selectedPermissions || []);
    }
  }, [visible, selectedPermissions]);

  const groups = useMemo(
    () => Object.entries(groupedPermissions || {}),
    [groupedPermissions]
  );

  const handleToggle = (permission: string, checkedNow: boolean) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (checkedNow) next.add(permission);
      else next.delete(permission);
      const arr = Array.from(next);
      onPermissionChange(arr);
      return arr;
    });
  };

  return (
    <Modal
      title="Phân quyền cho nhân viên"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={720}
      className={styles.permissionModal}
    >
      <div style={{ marginBottom: 12 }}>
        <Text>
          Nhân viên: {employee?.FullName || employee?.UserName || "(Không rõ)"}
        </Text>
      </div>

      <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
        {groups.length === 0 ? (
          <Text type="secondary">Không có quyền khả dụng</Text>
        ) : (
          groups.map(([group, permissions], idx) => (
            <div key={group} style={{ marginBottom: 12 }}>
              <Title level={5} style={{ marginBottom: 8 }}>
                {group}
              </Title>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {permissions.map((p) => (
                  <Checkbox
                    key={p}
                    checked={checked.includes(p)}
                    onChange={(e) => handleToggle(p, e.target.checked)}
                  >
                    {p}
                  </Checkbox>
                ))}
              </Space>
              {idx < groups.length - 1 && (
                <Divider style={{ margin: "12px 0" }} />
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.modalFooter} style={{ marginTop: 16 }}>
        <Space>
          <Button onClick={onCancel} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button type="primary" onClick={() => onSubmit()} loading={loading}>
            Lưu
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PermissionModal;
