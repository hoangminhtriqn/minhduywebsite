import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  notification,

  Upload,
  Image,
  Tooltip,
  Space,
  Popconfirm,
  Modal,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { servicesApi } from "@/api/services/admin/service";
import { uploadFile } from "@/api/services/admin/upload";
import styles from "./styles.module.scss";

interface ServiceFormData {
  title: string;
  description: string;
  icon?: string;
  isFeatured?: boolean;
}

interface UploadedFile {
  uid: string;
  name: string;
  status: "done" | "uploading" | "error";
  url?: string;
  public_id?: string;
  file?: File;
}

interface ServiceFormProps {
  mode: "add" | "edit";
  serviceId?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ mode, serviceId }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEditing = mode === "edit";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<UploadedFile | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");


  const fetchServiceData = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const serviceData = await servicesApi.getServiceById(id);

      // Set image if exists
      if (serviceData.icon) {
        setImageFile({
          uid: `icon-${Date.now()}`,
          name: "Service Icon",
          status: "done",
          url: serviceData.icon,
          public_id: `icon-${Date.now()}`,
        });
      }

      // Chuyển đổi dữ liệu để phù hợp với form
      const formData = {
        title: serviceData.title,
        description: serviceData.description || "",
        icon: serviceData.icon || "",
      };

      // Điền dữ liệu vào form
      form.setFieldsValue(formData);
    } catch (error) {
      console.error("Error fetching service data:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu dịch vụ.",
      });
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    if (isEditing && serviceId) {
      fetchServiceData(serviceId);
    }
  }, [serviceId, isEditing, fetchServiceData]);

  // Upload file to cloudinary
  const uploadFileToCloudinary = async (file: File): Promise<UploadedFile> => {
    try {
      const result = await uploadFile(file);
      return {
        uid: result.public_id,
        name: result.original_filename,
        status: "done",
        url: result.url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Upload failed");
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      console.log("Starting upload for file:", file.name, file.size);
      const uploadedFile = await uploadFileToCloudinary(file);
      console.log("Upload successful:", uploadedFile);
      uploadedFile.file = file; // Store the original file
      setImageFile(uploadedFile);
      form.setFieldsValue({ icon: uploadedFile.url });
      notification.success({
        message: "Thành công",
        description: "Upload icon thành công!",
      });
    } catch (error) {
      console.error("Image upload error:", error);
      notification.error({
        message: "Lỗi",
        description: `Upload icon thất bại! ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    form.setFieldsValue({ icon: "" });
  };

  // Preview image
  const handlePreview = (file: UploadedFile) => {
    setPreviewImage(file.url || "");
    setPreviewVisible(true);
  };

  const onFinish = async (values: ServiceFormData) => {
    setSaving(true);

    try {
      // Prepare service data
      const serviceData = {
        title: values.title,
        description: values.description,
        icon: imageFile?.url || "",
      };

      console.log("Form values:", values);
      console.log("Image file:", imageFile);
      console.log("Service data to send:", serviceData);

      if (isEditing && serviceId) {
        console.log("Updating service with ID:", serviceId);
        await servicesApi.updateService(serviceId, serviceData);
        notification.success({
          message: "Thành công",
          description: "Cập nhật dịch vụ thành công.",
        });
      } else {
        console.log("Creating new service");
        await servicesApi.createService(serviceData);
        notification.success({
          message: "Thành công",
          description: "Thêm dịch vụ mới thành công.",
        });
      }
      navigate("/admin/services");
    } catch (error: unknown) {
      console.error("Error submitting service form:", error);
      const apiError = error as ApiError;
      notification.error({
        message: "Lỗi",
        description:
          apiError?.response?.data?.message ||
          apiError?.message ||
          (isEditing
            ? "Đã xảy ra lỗi khi cập nhật dịch vụ."
            : "Đã xảy ra lỗi khi thêm dịch vụ."),
      });
    } finally {
      setSaving(false);
    }
  };



  const renderFormContent = () => {
    return (
      <div className={styles.formContent}>
        <Row gutter={[24, 24]} align="top">
          {/* Cột bên trái - Icon dịch vụ */}
          <Col xs={24} md={7}>
            <Form.Item
              name="icon"
              label="Icon dịch vụ"
              rules={[{ required: true, message: "Vui lòng tải lên icon dịch vụ!" }]}
            >
              <div className={styles.imageUpload}>
                {imageFile ? (
                  <div className={styles.imagePreview}>
                    <Image
                      src={imageFile.url}
                      alt="Service icon"
                      className={styles.imagePreview}
                      preview={false}
                    />
                    <div className={styles.imageActions}>
                      <Tooltip title="Xem ảnh">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(imageFile)}
                          size="middle"
                          style={{ marginRight: 8 }}
                        />
                      </Tooltip>
                      <Tooltip title="Xóa ảnh">
                        <Button
                          type="primary"
                          danger
                          shape="circle"
                          icon={<DeleteOutlined />}
                          onClick={removeImage}
                          size="middle"
                        />
                      </Tooltip>
                    </div>
                  </div>
                ) : (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleImageUpload(file);
                      return false;
                    }}
                    disabled={imageUploading}
                    key="image-upload"
                    style={{ width: "100%", display: "block" }}
                  >
                    <div className={styles.uploadDropArea}>
                      {imageUploading ? (
                        <div className={styles.loadingSpinner}>
                          <div className={styles.spinner}></div>
                          <div className={styles.loadingText}>
                            Đang upload icon...
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={styles.uploadIcon}>
                            <UploadOutlined />
                          </div>
                          <div className={styles.uploadText}>
                            Chọn hoặc kéo thả icon dịch vụ
                          </div>
                          <div className={styles.uploadHint}>
                            (JPG/PNG, &lt; 5MB)
                          </div>
                        </>
                      )}
                    </div>
                  </Upload>
                )}
              </div>
            </Form.Item>
          </Col>

          {/* Cột bên phải - Thông tin dịch vụ */}
          <Col xs={24} md={17}>
            <Form.Item
              name="title"
              label="Tên dịch vụ"
              rules={[
                { required: true, message: "Vui lòng nhập tên dịch vụ!" },
              ]}
            >
              <Input
                placeholder="Vui lòng nhập tên dịch vụ"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả dịch vụ"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả dịch vụ!" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả chi tiết về dịch vụ..."
              />
            </Form.Item>
          </Col>
        </Row>


      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}

        {...(!isEditing && {
          initialValues: {
            isFeatured: false,
          },
        })}
      >
        {renderFormContent()}

        <div className={styles.formActions}>
          <Space size="large">
            <Popconfirm
              title="Xác nhận lưu dịch vụ?"
              description="Bạn có chắc chắn muốn lưu dịch vụ này?"
              onConfirm={() => form.submit()}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
              >
                {isEditing ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
              </Button>
            </Popconfirm>

            <Button
              onClick={() => navigate("/admin/services")}
              icon={<RollbackOutlined />}
              size="large"
            >
              Hủy
            </Button>
          </Space>
        </div>
      </Form>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="Xem trước icon"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ServiceForm;