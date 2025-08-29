import { pricingService } from "@/api/services/admin/pricing";
import { colorOptions, ROUTERS } from "@/utils/constant";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  FileTextOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PricingFormData {
  title: string;
  description: string;
  features: string[];
  documents: Array<{
    name: string;
    type: "pdf" | "word" | "excel";
    size: string;
    url: string;
  }>;
  color: string;
  status: "active" | "inactive";
}

interface PricingFormProps {
  mode: "add" | "edit";
  pricingId?: string;
  onSubmit?: (data: PricingFormData) => Promise<void>;
}

const PricingForm: React.FC<PricingFormProps> = ({
  mode,
  pricingId,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEditing = mode === "edit";
  const [saving, setSaving] = useState(false);

  const fetchPricingData = useCallback(
    async (pricingId: string) => {
      try {
        const pricingData = await pricingService.getPricingById(pricingId);

        const formData = {
          title: pricingData.title,
          description: pricingData.description,
          features: pricingData.features || [],
          documents: pricingData.documents || [],
          color: pricingData.color,
          status: pricingData.status,
        };

        form.setFieldsValue(formData);
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu bảng giá.",
        });
      }
    },
    [form]
  );

  useEffect(() => {
    if (isEditing && pricingId) {
      fetchPricingData(pricingId);
    }
  }, [pricingId, isEditing, fetchPricingData]);

  const onFinish = async (values: PricingFormData) => {
    if (onSubmit) {
      await onSubmit(values);
      return;
    }

    setSaving(true);

    try {
      if (isEditing && pricingId) {
        await pricingService.updatePricing(
          pricingId,
          values as Parameters<typeof pricingService.updatePricing>[1]
        );
        notification.success({
          message: "Thành công",
          description: "Cập nhật bảng giá thành công.",
        });
      } else {
        await pricingService.createPricing(
          values as Parameters<typeof pricingService.createPricing>[0]
        );
        notification.success({
          message: "Thành công",
          description: "Thêm bảng giá mới thành công.",
        });
      }
      navigate(ROUTERS.ADMIN.PRICE_LIST);
    } catch (error) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as { message?: string })?.message ||
        (isEditing
          ? "Đã xảy ra lỗi khi cập nhật bảng giá."
          : "Đã xảy ra lỗi khi thêm bảng giá.");
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const onFinishFailed = (errorInfo: {
    values: unknown;
    errorFields: Array<{ name: (string | number)[]; errors: string[] }>;
    outOfDate: boolean;
  }) => {
    if (errorInfo?.errorFields?.length > 0) {
      const firstErrorName = errorInfo.errorFields[0].name;
      if (firstErrorName && firstErrorName.length > 0) {
        form.scrollToField(firstErrorName, {
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        scrollToFirstError={{ behavior: "smooth", block: "center" }}
        initialValues={{
          color: "blue",
          status: "active",
          features: [],
          documents: [],
        }}
      >
        <div>
          <Title level={4}>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            Thông tin cơ bản
          </Title>

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề bảng giá" size="large" />
          </Form.Item>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                name="color"
                label="Màu sắc"
                rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}
              >
                <Select placeholder="Chọn màu sắc" size="large">
                  {colorOptions.map((color) => (
                    <Option key={color.value} value={color.value}>
                      <Tag color={color.value}>{color.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái" size="large">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết về bảng giá..." />
          </Form.Item>

          <Title level={4}>
            <StarOutlined style={{ marginRight: 8 }} />
            Tính năng
          </Title>

          <Form.Item name="features" label="Danh sách tính năng">
            <Form.List name="features">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={8} style={{ marginBottom: 12 }}>
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tính năng!",
                            },
                          ]}
                        >
                          <Input placeholder="VD: Hỗ trợ 24/7, Backup tự động..." />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          style={{ marginTop: 4 }}
                          title="Xóa tính năng"
                        />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      size="large"
                    >
                      Thêm tính năng
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Title level={4}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Tài liệu
          </Title>

          <Form.Item name="documents" label="Danh sách tài liệu">
            <Form.List name="documents">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: 16 }}>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            label="Tên tài liệu"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tên tài liệu!",
                              },
                            ]}
                          >
                            <Input placeholder="VD: Hướng dẫn sử dụng" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "type"]}
                            label="Loại tài liệu"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn loại tài liệu!",
                              },
                            ]}
                          >
                            <Select placeholder="Chọn loại">
                              <Option value="pdf">PDF</Option>
                              <Option value="word">Word</Option>
                              <Option value="excel">Excel</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "size"]}
                            label="Kích thước"
                          >
                            <Input placeholder="VD: 2.5MB" />
                          </Form.Item>
                        </Col>
                        <Col span={22}>
                          <Form.Item
                            {...restField}
                            name={[name, "url"]}
                            label="URL tài liệu"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập URL tài liệu!",
                              },
                              {
                                type: "url",
                                message: "URL không hợp lệ!",
                              },
                            ]}
                          >
                            <Input placeholder="https://example.com/document.pdf" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            title="Xóa tài liệu"
                            style={{ marginTop: 28 }}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      size="large"
                    >
                      Thêm tài liệu
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </div>

        <div style={{ marginTop: 24, textAlign: "right" }}>
          <Space size="large">
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.PRICE_LIST)}
              size="large"
            >
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              icon={<SaveOutlined />}
              size="large"
            >
              {isEditing ? "Cập nhật bảng giá" : "Thêm bảng giá"}
            </Button>
          </Space>
        </div>
      </Form>
    </>
  );
};

export default PricingForm;
