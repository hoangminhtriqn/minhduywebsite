import React, { useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import {
  Employee as EmployeeType,
  CreateEmployeeData,
  UpdateEmployeeData,
} from "@/api/services/admin/permission";
import styles from "../styles.module.scss";
import {
  getUsernameRules,
  getEmailRules,
  getPhoneRules,
  getPasswordRules,
} from "@/utils/validation";

interface UpsertEmployeeModalProps {
  visible: boolean;
  employee?: EmployeeType | null; // undefined = add mode, EmployeeType = edit mode
  onCancel: () => void;
  onSubmit: (values: CreateEmployeeData | UpdateEmployeeData) => Promise<void>;
  loading?: boolean;
}

const UpsertEmployeeModal: React.FC<UpsertEmployeeModalProps> = ({
  visible,
  employee,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEditMode = !!employee;

  useEffect(() => {
    if (visible) {
      if (isEditMode && employee) {
        form.setFieldsValue(employee);
      } else {
        form.resetFields();
      }
    }
  }, [visible, employee, form, isEditMode]);

  const handleSubmit = async (
    values: CreateEmployeeData | UpdateEmployeeData
  ) => {
    await onSubmit(values);
    if (!isEditMode) {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        isEditMode ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className={styles.permissionModal}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {!isEditMode && (
          <>
            <Form.Item
              name="UserName"
              label="Tên đăng nhập"
              rules={getUsernameRules()}
            >
              <Input placeholder="Nhập tên đăng nhập" maxLength={32} />
            </Form.Item>

            <Form.Item
              name="Password"
              label="Mật khẩu"
              rules={getPasswordRules()}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="FullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item name="Email" label="Email" rules={getEmailRules()}>
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="Phone" label="Số điện thoại" rules={getPhoneRules()}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="Address" label="Địa chỉ">
          <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
        </Form.Item>

        <div
          className={styles.modalFooter}
          style={{ justifyContent: "flex-end" }}
        >
          <div className={styles.buttonGroup}>
            <div
              className={styles.mainButtons}
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <Button onClick={handleCancel} disabled={loading} size="middle">
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="middle"
              >
                {isEditMode ? "Cập nhật" : "Thêm nhân viên"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UpsertEmployeeModal;
