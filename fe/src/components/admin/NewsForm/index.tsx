import {
  createNewsEvent,
  getNewsEventById,
  updateNewsEvent,
} from "@/api/services/user/newsEvents";
import { uploadFile } from "@/api/services/admin/upload";
import EditorCustom from "@/components/admin/EditorCustom";
import { NewsStatus } from "@/types/enum";
import {
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  RollbackOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
  Upload,
} from "antd";

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const { Title } = Typography;
const { Option } = Select;

interface NewsFormData {
  Title: string;
  Content: string;
  Image?: string;
  Status?: string;
}

interface UploadedFile {
  uid: string;
  name: string;
  status: "done" | "uploading" | "error";
  url?: string;
  public_id?: string;
  file?: File;
}

interface NewsFormProps {
  mode: "add" | "edit";
  newsId?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const NewsForm: React.FC<NewsFormProps> = ({ mode, newsId }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEditing = mode === "edit";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<UploadedFile | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState<NewsFormData>({} as NewsFormData);

  const fetchNewsData = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const newsData = await getNewsEventById(id);

        // Set image if exists
        if (newsData.ImageUrl) {
          setImageFile({
            uid: `image-${Date.now()}`,
            name: "News Image",
            status: "done",
            url: newsData.ImageUrl,
            public_id: `image-${Date.now()}`,
          });
        }

        // Chuyển đổi dữ liệu để phù hợp với form
        const formData = {
          Title: newsData.Title,
          Content: newsData.Content || "",
          Status: newsData.Status || "active",
        };

        // Điền dữ liệu vào form
        form.setFieldsValue(formData);
        setFormData(formData);
      } catch (error) {
        console.error("Error fetching news data:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu tin tức.",
        });
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  useEffect(() => {
    if (isEditing && newsId) {
      fetchNewsData(newsId);
    }
  }, [newsId, isEditing, fetchNewsData]);

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
      const uploadedFile = await uploadFileToCloudinary(file);
      uploadedFile.file = file; // Store the original file
      setImageFile(uploadedFile);
      notification.success({
        message: "Thành công",
        description: "Upload ảnh thành công!",
      });
    } catch (error) {
      console.error("Image upload error:", error);
      notification.error({
        message: "Lỗi",
        description: "Upload ảnh thất bại!",
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
  };

  // Preview image
  const handlePreview = (file: UploadedFile) => {
    setPreviewImage(file.url || "");
    setPreviewVisible(true);
  };

  const onFinish = async (values: NewsFormData) => {
    setSaving(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("Title", values.Title);
      formData.append("Content", values.Content);
      formData.append("Status", values.Status || "active");

      // Add image URL if exists - use imageFile state only
      if (imageFile && imageFile.url) {
        // Always use the URL from imageFile state
        formData.append("ImageUrl", imageFile.url);
      }

      if (isEditing && newsId) {
        await updateNewsEvent(newsId, formData);
        notification.success({
          message: "Thành công",
          description: "Cập nhật tin tức thành công.",
        });
      } else {
        await createNewsEvent(formData);
        notification.success({
          message: "Thành công",
          description: "Thêm tin tức mới thành công.",
        });
      }
      navigate("/admin/news");
    } catch (error: unknown) {
      console.error("Error submitting news form:", error);
      const apiError = error as ApiError;
      notification.error({
        message: "Lỗi",
        description:
          apiError?.response?.data?.message ||
          apiError?.message ||
          (isEditing
            ? "Đã xảy ra lỗi khi cập nhật tin tức."
            : "Đã xảy ra lỗi khi thêm tin tức."),
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

  const handleFormChange = (
    _changedFields: unknown,
    allFields: NewsFormData
  ) => {
    setFormData(allFields);
  };

  const renderFormContent = () => {
    return (
      <div className={styles.formContent}>
        <Row gutter={[24, 24]} align="top">
          {/* Cột bên trái - Hình ảnh */}
          <Col xs={24} md={7}>
            <Title level={4}>
              <CameraOutlined style={{ marginRight: 8 }} />
              Hình ảnh tin tức
            </Title>

            <Form.Item
              label="Hình ảnh đại diện"
              rules={[
                {
                  required: false,
                  message: "Vui lòng upload hình ảnh đại diện!",
                },
              ]}
            >
              <div className={styles.imageUploadHalfWidth}>
                {imageFile ? (
                  <div className={styles.imagePreviewHalfWidth}>
                    <Image
                      src={imageFile.url}
                      alt="News image"
                      className={styles.imagePreviewHalfWidth}
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
                    <div className={styles.uploadDropAreaHalfWidth}>
                      {imageUploading ? (
                        <div className={styles.loadingSpinner}>
                          <div className={styles.spinner}></div>
                          <div className={styles.loadingText}>
                            Đang upload ảnh...
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={styles.uploadIcon}>
                            <UploadOutlined />
                          </div>
                          <div className={styles.uploadText}>
                            Chọn hoặc kéo thả ảnh đại diện
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

          {/* Cột bên phải - Thông tin tin tức */}
          <Col xs={24} md={17}>
            <Title level={4}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              Thông tin tin tức
            </Title>

            <Form.Item
              name="Title"
              label="Tiêu đề tin tức"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề tin tức!" },
              ]}
            >
              <Input placeholder="Vui lòng nhập tiêu đề tin tức" size="large" />
            </Form.Item>

            <Form.Item name="Status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" size="large">
                <Option value={NewsStatus.DRAFT}>Bản nháp</Option>
                <Option value={NewsStatus.PUBLISHED}>Đã xuất bản</Option>
                <Option value={NewsStatus.LOCKED}>Đã khóa</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="Content"
          label="Nội dung tin tức"
          style={{ marginTop: 24 }}
        >
          <EditorCustom
            initialValue={formData.Content || ""}
            placeholder="Nhập nội dung tin tức chi tiết..."
            onEditorChange={(content: string) => {
              form.setFieldsValue({ Content: content });
            }}
          />
        </Form.Item>
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
        onFinishFailed={onFinishFailed}
        scrollToFirstError={{ behavior: "smooth", block: "center" }}
        onValuesChange={handleFormChange}
        {...(!isEditing && {
          initialValues: {
            Status: NewsStatus.DRAFT,
          },
        })}
      >
        {renderFormContent()}

        <div className={styles.formActions}>
          <Space size="large">
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              icon={<SaveOutlined />}
              size="large"
            >
              {isEditing ? "Cập nhật tin tức" : "Thêm tin tức"}
            </Button>

            <Button
              onClick={() => navigate("/admin/news")}
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
        title="Xem trước ảnh"
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

export default NewsForm;
