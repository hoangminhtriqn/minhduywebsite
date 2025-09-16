import { Slide } from "@/api/services/admin/settings";
import { Form, Input, InputNumber, Modal, Switch } from "antd";
import React from "react";
import ImageUpload from "./ImageUpload";
import styles from "./styles.module.scss";

export interface SlideModalProps {
  open: boolean;
  editingIndex: number | null;
  values: Partial<Slide>;
  errors?: { src?: string; alt?: string };
  onOk: () => void;
  onCancel: () => void;
  onFieldChange: (field: keyof Slide, value: string | number | boolean) => void;
}

function SlideModal({
  open,
  editingIndex,
  values,
  errors,
  onOk,
  onCancel,
  onFieldChange,
}: SlideModalProps) {
  return (
    <Modal
      title={
        editingIndex !== null
          ? "Sửa slide"
          : "Thêm slide"
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={editingIndex !== null ? "Cập nhật" : "Thêm"}
      cancelText="Hủy"
    >
      <Form layout="vertical" className={styles.modalForm}>
        <Form.Item
          label="Hình ảnh slide"
          required
          validateStatus={errors?.src ? "error" : undefined}
          help={errors?.src}
        >
          <ImageUpload
            value={values.src}
            onChange={(url) => onFieldChange("src", url)}
            placeholder="Chọn hoặc kéo thả ảnh slide"
          />
        </Form.Item>
        <div style={{ display: "flex", gap: "16px", alignItems: "end" }}>
          <Form.Item
            label="Mô tả ảnh (Alt text)"
            required
            style={{ flex: 1 }}
            validateStatus={errors?.alt ? "error" : undefined}
            help={errors?.alt}
          >
            <Input
              value={values.alt}
              onChange={(e) =>
                onFieldChange("alt", e.target.value)
              }
              placeholder="Nhập mô tả ảnh"
            />
          </Form.Item>
          <Form.Item label="Thứ tự" style={{ width: "80px" }}>
            <InputNumber
              value={values.order}
              onChange={(value) =>
                onFieldChange("order", value || 1)
              }
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label="Hiển thị" style={{ minWidth: "80px" }}>
            <Switch
              checked={values.isActive}
              onChange={(v) =>
                onFieldChange("isActive", v)
              }
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

export default SlideModal;