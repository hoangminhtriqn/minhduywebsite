import React, { useState } from "react";
import { toast } from "react-toastify";
import { Modal, Input, Button, Form } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { LoginProvider } from "@/types/enum";
import apiClient from "@/api/axios";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from "./styles.module.scss";
import {
  getPasswordRules,
  getUsernameRules,
  makeConfirmPasswordRule,
} from "@/utils/validation";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
  username?: string;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const isGoogleUser = user?.LoginProvider === LoginProvider.GOOGLE;
  const hasNoUsername = !user?.UserName;

  const handleFinish = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload: Record<string, string> = {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      // Chỉ gửi currentPassword nếu không phải Google user
      if (!isGoogleUser && values.currentPassword) {
        payload.currentPassword = values.currentPassword;
      }

      // Nếu user chưa có username, thêm vào payload
      if (hasNoUsername && values.username) {
        payload.username = values.username.trim();
      }

      const response = await apiClient.put("/users/change-password", payload);

      if (response.data.success) {
        toast.success("Thay đổi mật khẩu thành công!");

        // Nếu có set username mới, update user context
        if (hasNoUsername && values.username) {
          updateUser({ UserName: values.username.trim() });
        }

        handleClose();
      }
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: string }).message
          : "Có lỗi xảy ra khi thay đổi mật khẩu";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          {isGoogleUser ? "Thiết lập mật khẩu" : "Thay đổi mật khẩu"}
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      className={styles.passwordModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          username: user?.UserName || "",
        }}
        className={styles.passwordForm}
      >
        {/* Username field for Google users who don't have username */}
        {hasNoUsername && (
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={getUsernameRules()}
            extra="Sau khi thiết lập, bạn có thể đăng nhập bằng tên đăng nhập này"
          >
            <Input
              placeholder="Nhập tên đăng nhập"
              disabled={loading}
              className={styles.modalInput}
              maxLength={32}
            />
          </Form.Item>
        )}

        {/* Current password - only for non-Google users */}
        {!isGoogleUser && (
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={getPasswordRules()}
          >
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại"
              disabled={loading}
              iconRender={(visible) =>
                visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
              className={styles.modalInput}
            />
          </Form.Item>
        )}

        {/* New password */}
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={getPasswordRules()}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            disabled={loading}
            iconRender={(visible) =>
              visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
            }
            className={styles.modalInput}
          />
        </Form.Item>

        {/* Confirm password */}
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              ...makeConfirmPasswordRule(getFieldValue),
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu mới"
            disabled={loading}
            iconRender={(visible) =>
              visible ? <EyeInvisibleOutlined /> : <EyeOutlined />
            }
            className={styles.modalInput}
          />
        </Form.Item>

        <div className={styles.modalActions}>
          <Button
            onClick={handleClose}
            disabled={loading}
            className={styles.cancelButton}
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitButton}
          >
            {isGoogleUser ? "Thiết lập" : "Thay đổi"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PasswordChangeModal;
