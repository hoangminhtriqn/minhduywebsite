import {
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Breadcrumb from "../../components/admin/Breadcrumb";
import {
  getNewsEventById,
  createNewsEvent,
  updateNewsEvent,
  NewsEvent,
} from "../../api/services/newsEvents";
import styles from "./NewsFormPage.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

const NewsFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<UploadedFile | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [editorLoading, setEditorLoading] = useState(true);

  const fetchNewsData = async (newsId: string) => {
    setLoading(true);
    try {
      const newsData = await getNewsEventById(newsId);

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
        Image: newsData.ImageUrl || "",
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
  };

  useEffect(() => {
    if (isEditing && id) {
      fetchNewsData(id);
    }
  }, [id, isEditing]);

  // Upload file to cloudinary
  const uploadFileToCloudinary = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = response.data.data;
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
    console.log("handleImageUpload called with:", file.name);
    setImageUploading(true);
    try {
      const uploadedFile = await uploadFileToCloudinary(file);
      uploadedFile.file = file; // Store the original file
      setImageFile(uploadedFile);
      form.setFieldsValue({ Image: uploadedFile.url });
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
      console.log("Image upload finished");
    }
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    form.setFieldsValue({ Image: "" });
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

      // Add image file if exists
      if (imageFile && imageFile.file) {
        // If we have the actual file, append it
        formData.append("ImageUrl", imageFile.file);
      } else if (imageFile && imageFile.url) {
        // If we only have URL (existing image), append the URL
        formData.append("ImageUrl", imageFile.url);
      }

      if (isEditing && id) {
        await updateNewsEvent(id, formData);
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
    } catch (error: any) {
      console.error("Error submitting news form:", error);
      notification.error({
        message: "Lỗi",
        description:
          error.response?.data?.message ||
          error.message ||
          (isEditing
            ? "Đã xảy ra lỗi khi cập nhật tin tức."
            : "Đã xảy ra lỗi khi thêm tin tức."),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (changedFields: any, allFields: any) => {
    setFormData(allFields);
  };

  const renderFormContent = () => {
    return (
      <div className={styles.formContent}>
        <Title level={4}>
          <InfoCircleOutlined style={{ marginRight: 8 }} />
          Thông tin tin tức
        </Title>

        <Row gutter={[24, 16]}>
          <Col span={16}>
            <Form.Item
              name="Title"
              label="Tiêu đề tin tức"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề tin tức!" },
              ]}
            >
              <Input placeholder="VD: BMW ra mắt mẫu xe mới" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="Status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" size="large">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="draft">Bản nháp</Option>
                <Option value="published">Đã xuất bản</Option>
                <Option value="archived">Đã lưu trữ</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="Content" label="Nội dung tin tức">
          <Spin spinning={editorLoading} tip="Đang tải trình soạn thảo...">
            <div style={{ minHeight: 320 }}>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                initialValue={formData.Content || ""}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "autoresize",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  placeholder: "Nhập nội dung tin tức chi tiết...",
                  branding: false,
                  elementpath: false,
                  resize: true,
                  statusbar: false,
                  readonly: false,
                  autoresize_bottom_margin: 50,
                  autoresize_overflow_padding: 50,
                  min_height: 200,
                  max_height: 600,
                }}
                onInit={() => setEditorLoading(false)}
                onEditorChange={(content: string) => {
                  form.setFieldsValue({ Content: content });
                }}
              />
            </div>
          </Spin>
        </Form.Item>

        <Title level={4}>
          <CameraOutlined style={{ marginRight: 8 }} />
          Hình ảnh tin tức
        </Title>

        <Form.Item
          name="Image"
          label="Hình ảnh đại diện"
          rules={[
            {
              required: false,
              message: "Vui lòng upload hình ảnh đại diện!",
            },
          ]}
        >
          <div className={styles.imageUploadNew}>
            {imageFile ? (
              <div className={styles.imagePreview}>
                <Image
                  src={imageFile.url}
                  alt="News image"
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
              >
                <div className={styles.uploadDropAreaNew}>
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
      </div>
    );
  };

  return (
    <div className={styles.newsFormPage}>
      <div className={styles.header}>
        <Breadcrumb
          title={isEditing ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
        />
      </div>

      <Card className={styles.formCard} loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={handleFormChange}
          {...(!isEditing && {
            initialValues: {
              Status: "active",
            },
          })}
        >
          {renderFormContent()}

          <div className={styles.formActions}>
            <Space size="large">
              <Popconfirm
                title="Xác nhận lưu tin tức?"
                description="Bạn có chắc chắn muốn lưu tin tức này?"
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
                  {isEditing ? "Cập nhật tin tức" : "Thêm tin tức"}
                </Button>
              </Popconfirm>

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
      </Card>

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
    </div>
  );
};

export default NewsFormPage;
