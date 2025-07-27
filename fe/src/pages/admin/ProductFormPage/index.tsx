import { categoryService } from "@/api/services/admin/categories";
import { productService } from "@/api/services/user/product";
import { uploadFile } from "@/api/services/admin/upload";
import Breadcrumb from "@/components/admin/Breadcrumb";
import EditorCustom from "@/components/admin/EditorCustom";
import {
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
  ToolOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  notification,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
  Upload,
} from "antd";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";

// Custom VND icon component
const VNDIcon = () => (
  <span style={{ fontSize: "14px", color: "#666" }}>₫</span>
);

const { Title, Text } = Typography;
const { Option } = Select;

interface ProductFormData {
  Product_Name: string;
  Description?: string;
  Price: number;
  ParentCategoryID?: string;
  CategoryID: string;
  Main_Image?: string;
  List_Image?: string;
  Specifications?: Array<{ key: string; value: string }>;
  Status?: string;
}

interface UploadedFile {
  uid: string;
  name: string;
  status: "done" | "uploading" | "error";
  url?: string;
  public_id?: string;
}

const ProductFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [parentCategories, setParentCategories] = useState<
    { _id: string; Name: string }[]
  >([]);
  const [childCategories, setChildCategories] = useState<
    { _id: string; Name: string; ParentID: { _id: string; Name: string } }[]
  >([]);
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [mainImageFile, setMainImageFile] = useState<UploadedFile | null>(null);
  const [listImageFiles, setListImageFiles] = useState<UploadedFile[]>([]);
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [listImagesUploading, setListImagesUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    Product_Name: "",
    Description: "",
    Price: 0,
    CategoryID: "",
    Main_Image: "",
  });

  const fetchProductData = async (productId: string) => {
    setLoading(true);
    try {
      const productData = await productService.getProductById(productId);
      // Convert specifications object to array for Form.List
      const specificationsArray = productData.Specifications
        ? Object.entries(productData.Specifications).map(([key, value]) => ({
            key: key,
            value: value,
          }))
        : [];
      // Set main image if exists
      if (productData.Main_Image) {
        setMainImageFile({
          uid: `main-${Date.now()}`,
          name: "Main Image",
          status: "done",
          url: productData.Main_Image,
          public_id: `main-${Date.now()}`,
        });
      }
      // Set list images if exist
      if (productData.List_Image && Array.isArray(productData.List_Image)) {
        const listImageFiles = productData.List_Image.map(
          (url: string, index: number) => ({
            uid: `list-${index}-${Date.now()}`,
            name: `List Image ${index + 1}`,
            status: "done" as const,
            url: url,
            public_id: `list-${index}-${Date.now()}`,
          })
        );
        setListImageFiles(listImageFiles);
      }
      // Chuyển đổi dữ liệu để phù hợp với form
      const formData = {
        Product_Name: productData.Product_Name,
        Description: productData.Description || "",
        Price: productData.Price,
        Stock: productData.Stock,
        CategoryID: productData.CategoryID,
        Main_Image: productData.Main_Image || "",
        List_Image: productData.List_Image?.join(",") || "",
        Specifications: specificationsArray,
        Status: productData.Status || "available",
      };

      // Điền dữ liệu vào form
      form.setFieldsValue(formData);
      setFormData(formData as ProductFormData);
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu sản phẩm.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      const allCategories = response.categories || [];

      // Phân loại categories thành cha và con
      const parents = allCategories.filter(
        (cat: { ParentID?: { _id: string; Name: string } | null }) =>
          !cat.ParentID
      );
      const children = allCategories.filter(
        (cat: { ParentID?: { _id: string; Name: string } | null }) =>
          cat.ParentID
      );

      setParentCategories(parents);
      setChildCategories(children);
    } catch {
      setParentCategories([]);
      setChildCategories([]);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách danh mục.",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditing && id) {
      fetchProductData(id);
    }
  }, [id, isEditing]);

  // Upload main image to cloudinary
  const uploadMainImageToCloudinary = async (
    file: File
  ): Promise<UploadedFile> => {
    const result = await uploadFile(file);

    return {
      uid: result.public_id,
      name: result.original_filename,
      status: "done",
      url: result.url,
      public_id: result.public_id,
    };
  };

  // Upload list image to cloudinary
  const uploadListImageToCloudinary = async (
    file: File
  ): Promise<UploadedFile> => {
    const result = await uploadFile(file);

    return {
      uid: result.public_id,
      name: result.original_filename,
      status: "done",
      url: result.url,
      public_id: result.public_id,
    };
  };

  // Handle main image upload
  const handleMainImageUpload = async (file: File) => {
    setMainImageUploading(true);
    try {
      const uploadedFile = await uploadMainImageToCloudinary(file);
      setMainImageFile(uploadedFile);
      form.setFieldsValue({ Main_Image: uploadedFile.url });
      notification.success({
        message: "Thành công",
        description: "Upload ảnh chính thành công!",
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        "Upload ảnh chính thất bại!";
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    } finally {
      setMainImageUploading(false);
    }
  };

  // Handle list images upload
  const handleListImagesUpload = async (files: File[]) => {
    setListImagesUploading(true);
    try {
      const uploadPromises = files.map((file) =>
        uploadListImageToCloudinary(file)
      );
      const uploadedFiles = await Promise.all(uploadPromises);

      const newListFiles = [...listImageFiles, ...uploadedFiles];
      setListImageFiles(newListFiles);

      // Update form with URLs
      const urls = newListFiles.map((file) => file.url).join(",");
      form.setFieldsValue({ List_Image: urls });

      notification.success({
        message: "Thành công",
        description: `Upload ${files.length} ảnh phụ thành công!`,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        "Upload ảnh phụ thất bại!";
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    } finally {
      setListImagesUploading(false);
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImageFile(null);
    form.setFieldsValue({ Main_Image: "" });
  };

  // Remove list image
  const removeListImage = (uid: string) => {
    const newListFiles = listImageFiles.filter((file) => file.uid !== uid);
    setListImageFiles(newListFiles);

    const urls = newListFiles.map((file) => file.url).join(",");
    form.setFieldsValue({ List_Image: urls });
  };

  // Preview image
  const handlePreview = (file: UploadedFile) => {
    setPreviewImage(file.url || "");
    setPreviewVisible(true);
  };

  const onFinish = async (values: ProductFormData) => {
    setSaving(true);

    // Convert specifications from array of objects to object
    const specifications = values.Specifications
      ? values.Specifications.reduce(
          (
            acc: Record<string, string>,
            spec: { key: string; value: string }
          ) => {
            if (spec.key && spec.value) {
              acc[spec.key] = spec.value;
            }
            return acc;
          },
          {}
        )
      : {};

    // Only send required fields according to Product model
    const dataToSend = {
      Product_Name: values.Product_Name,
      Description: values.Description || "",
      Price: values.Price,
      CategoryID: values.CategoryID,
      Main_Image: values.Main_Image || "",
      List_Image: values.List_Image
        ? values.List_Image.split(",").map((url) => url.trim())
        : [],
      Specifications: specifications,
      Status:
        (values.Status as "active" | "inactive" | "out_of_stock" | undefined) ||
        "active",

      Stock: form.getFieldValue("Stock") ?? 0,
    };

    try {
      if (isEditing && id) {
        await productService.updateProduct(id, dataToSend);
        notification.success({
          message: "Thành công",
          description: "Cập nhật sản phẩm thành công.",
        });
      } else {
        await productService.createProduct(dataToSend);
        notification.success({
          message: "Thành công",
          description: "Thêm sản phẩm mới thành công.",
        });
      }
      navigate("/admin/products");
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
          ? "Đã xảy ra lỗi khi cập nhật sản phẩm."
          : "Đã xảy ra lỗi khi thêm sản phẩm.");
      notification.error({
        message: "Lỗi",
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (
    changedFields: ProductFormData,
    allFields: ProductFormData
  ) => {
    setFormData(allFields);
  };

  const renderFormContent = () => {
    return (
      <div className={styles.formContent}>
        <Title level={4}>
          <InfoCircleOutlined style={{ marginRight: 8 }} />
          Thông tin cơ bản
        </Title>

        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Form.Item
              name="Product_Name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item
              name="ParentCategoryID"
              label="Danh mục cha"
              rules={[
                { required: true, message: "Vui lòng chọn danh mục cha!" },
              ]}
            >
              <Select
                placeholder={
                  categoriesLoading
                    ? "Đang tải danh mục..."
                    : "Chọn danh mục cha"
                }
                size="large"
                showSearch
                loading={categoriesLoading}
                disabled={categoriesLoading}
                value={selectedParentCategory}
                onChange={(value) => {
                  setSelectedParentCategory(value);
                  form.setFieldsValue({ CategoryID: undefined }); // Reset child category
                }}
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {!categoriesLoading &&
                parentCategories &&
                parentCategories.length > 0
                  ? parentCategories.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {category.Name}
                      </Option>
                    ))
                  : null}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="CategoryID"
              label="Danh mục con"
              rules={[
                { required: true, message: "Vui lòng chọn danh mục con!" },
              ]}
            >
              <Select
                placeholder={
                  !selectedParentCategory
                    ? "Chọn danh mục cha trước"
                    : categoriesLoading
                      ? "Đang tải danh mục..."
                      : "Chọn danh mục con"
                }
                size="large"
                showSearch
                loading={categoriesLoading}
                disabled={categoriesLoading || !selectedParentCategory}
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {!categoriesLoading &&
                selectedParentCategory &&
                childCategories &&
                childCategories.length > 0
                  ? childCategories
                      .filter(
                        (category) =>
                          category.ParentID &&
                          category.ParentID._id === selectedParentCategory
                      )
                      .map((category) => (
                        <Option key={category._id} value={category._id}>
                          {category.Name}
                        </Option>
                      ))
                  : null}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col span={12}>
            <Form.Item
              name="Price"
              label="Giá sản phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                {
                  type: "number",
                  min: 0,
                  message: "Giá sản phẩm phải lớn hơn 0!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="VD: 2500000000"
                prefix={<VNDIcon />}
                size="large"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="Status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" size="large">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="out_of_stock">Hết hàng</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="Description" label="Mô tả sản phẩm">
          <EditorCustom
            initialValue={formData.Description || ""}
            placeholder="Mô tả chi tiết về sản phẩm, tính năng nổi bật, lợi ích..."
            onEditorChange={(content: string) => {
              form.setFieldsValue({ Description: content });
            }}
          />
        </Form.Item>

        <Title level={4}>
          <CameraOutlined style={{ marginRight: 8 }} />
          Hình ảnh & Media
        </Title>

        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              name="Main_Image"
              label={
                <span>
                  Hình ảnh chính <span style={{ color: "#ff4d4f" }}>*</span>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, marginLeft: 8 }}
                  >
                    (Ảnh đại diện cho sản phẩm)
                  </Text>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng upload hình ảnh chính!",
                },
              ]}
              style={{ width: "100%" }}
            >
              <div className={styles.mainImageUploadNew}>
                {mainImageFile ? (
                  <div className={styles.imagePreview}>
                    <Image
                      src={mainImageFile.url}
                      alt="Main image"
                      className={styles.mainImagePreview}
                      preview={false}
                    />
                    <div className={styles.imageActions}>
                      <Tooltip title="Xem ảnh">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(mainImageFile)}
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
                          onClick={removeMainImage}
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
                      handleMainImageUpload(file);
                      return false;
                    }}
                    disabled={mainImageUploading}
                    key="main-image-upload"
                  >
                    <div className={styles.uploadDropAreaNew}>
                      {mainImageUploading ? (
                        <div className={styles.loadingSpinner}>
                          <div className={styles.spinner}></div>
                          <div className={styles.loadingText}>
                            Đang upload ảnh chính...
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
                            (Tối đa 1 ảnh, JPG/PNG, &lt; 5MB)
                          </div>
                        </>
                      )}
                    </div>
                  </Upload>
                )}
              </div>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="List_Image" label="Hình ảnh phụ">
              <div className={styles.listImagesUpload}>
                <div className={styles.listImagesContainer}>
                  {listImageFiles.map((file) => (
                    <div
                      key={file.uid}
                      className={styles.listImagePreviewContainer}
                    >
                      <Image
                        src={file.url}
                        alt={file.name}
                        className={styles.listImagePreview}
                      />
                      <div className={styles.listImageActions}>
                        <Tooltip title="Xem ảnh">
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview(file)}
                            size="small"
                            style={{ marginRight: 4 }}
                          />
                        </Tooltip>
                        <Tooltip title="Xóa ảnh">
                          <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => removeListImage(file.uid)}
                            size="small"
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                  {listImageFiles.length < 5 && (
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleListImagesUpload([file]);
                        return false;
                      }}
                      disabled={listImagesUploading}
                      key="list-images-upload"
                    >
                      <div className={styles.uploadDropAreaSmall}>
                        {listImagesUploading ? (
                          <div className={styles.loadingSpinner}>
                            <div className={styles.spinner}></div>
                            <div className={styles.loadingText}>
                              Uploading...
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={styles.uploadIcon}>
                              <PlusOutlined />
                            </div>
                            <div className={styles.uploadText}>
                              {listImagesUploading
                                ? "Đang upload..."
                                : "Thêm ảnh"}
                            </div>
                          </>
                        )}
                      </div>
                    </Upload>
                  )}
                </div>
                <div className={styles.uploadInfo}>
                  <Progress
                    percent={(listImageFiles.length / 5) * 100}
                    size="small"
                    status={listImageFiles.length >= 5 ? "success" : "active"}
                  />
                  <Text type="secondary">
                    Đã upload {listImageFiles.length}/5 ảnh phụ
                  </Text>
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Title level={4}>
          <ToolOutlined style={{ marginRight: 8 }} />
          Thông số kỹ thuật
        </Title>

        <Form.Item name="Specifications" label="Thông số chi tiết">
          <Form.List name="Specifications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={8} style={{ marginBottom: 12 }}>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên thông số!",
                          },
                        ]}
                      >
                        <Input placeholder="VD: Dòng thiết bị, Màu sắc, Kích thước..." />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá trị!",
                          },
                        ]}
                      >
                        <Input placeholder="Vui lòng nhập giá trị" />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{ marginTop: 4 }}
                        title="Xóa thông số"
                        size="small"
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
                    Thêm thông số
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </div>
    );
  };

  return (
    <div className={styles.productFormPage}>
      <div className={styles.header}>
        <Breadcrumb
          title={isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
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
              Price: 0,
              Status: "available",
              IsFeatured: false,
              IsNew: false,
              autoSave: true,
            },
          })}
        >
          {renderFormContent()}

          <div className={styles.formActions}>
            <Space size="large">
              <Popconfirm
                title="Xác nhận lưu sản phẩm?"
                description="Bạn có chắc chắn muốn lưu sản phẩm này?"
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
                  {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                </Button>
              </Popconfirm>

              <Button
                onClick={() => navigate("/admin/products")}
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

export default ProductFormPage;
