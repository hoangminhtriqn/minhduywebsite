import { Location } from "@/api/services/admin/settings";
import { Form, Input, Modal, Switch } from "antd";
import React from "react";
import styles from "./styles.module.scss";

interface LocationModalProps {
  open: boolean;
  editingIndex: number | null;
  values: Partial<Location>;
  onOk: () => void;
  onCancel: () => void;
  onFieldChange: (field: keyof Location, value: string | boolean) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  open,
  editingIndex,
  values,
  onOk,
  onCancel,
  onFieldChange,
}) => {
  return (
    <Modal
      title={
        editingIndex !== null
          ? "Sửa địa chỉ"
          : "Thêm địa chỉ"
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Thêm"
      cancelText="Hủy"
    >
      <Form layout="vertical" className={styles.modalForm}>
        <Form.Item label="Tên chi nhánh">
          <Input
            value={values.name}
            onChange={(e) =>
              onFieldChange("name", e.target.value)
            }
          />
        </Form.Item>
        <Form.Item label="Địa chỉ">
          <Input
            value={values.address}
            onChange={(e) =>
              onFieldChange(
                "address",
                e.target.value
              )
            }
          />
        </Form.Item>
        <Form.Item label="Tọa độ">
          <Input
            value={values.coordinates}
            onChange={(e) =>
              onFieldChange(
                "coordinates",
                e.target.value
              )
            }
          />
        </Form.Item>
        <Form.Item label="Link bản đồ">
          <Input
            value={values.mapUrl}
            onChange={(e) =>
              onFieldChange(
                "mapUrl",
                e.target.value
              )
            }
          />
        </Form.Item>
        <Form.Item label="Mô tả">
          <Input.TextArea
            value={values.description}
            onChange={(e) =>
              onFieldChange(
                "description",
                e.target.value
              )
            }
            rows={2}
            placeholder="Nhập mô tả chi nhánh (nếu có)"
          />
        </Form.Item>
        <Form.Item label="Địa chỉ chính">
          <Switch
            checked={values.isMainAddress}
            onChange={(v) =>
              onFieldChange("isMainAddress", v)
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LocationModal;