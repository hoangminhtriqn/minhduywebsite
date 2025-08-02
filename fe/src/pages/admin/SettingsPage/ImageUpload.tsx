import { uploadFile } from "@/api/services/admin/upload";
import {
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  Modal,
  notification,
  Tooltip,
  Upload,
} from "antd";
import React, { useState } from "react";
import styles from "./styles.module.scss";

interface UploadedFile {
  uid: string;
  name: string;
  status: "done" | "uploading" | "error";
  url?: string;
  public_id?: string;
  file?: File;
}

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  placeholder = "Chọn hoặc kéo thả ảnh",
  className,
}) => {
  const [imageFile, setImageFile] = useState<UploadedFile | null>(
    value
      ? {
          uid: `image-${Date.now()}`,
          name: "Image",
          status: "done",
          url: value,
          public_id: `image-${Date.now()}`,
        }
      : null
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

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
      onChange?.(uploadedFile.url || "");
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
    onChange?.("");
  };

  // Preview image
  const handlePreview = (file: UploadedFile) => {
    setPreviewImage(file.url || "");
    setPreviewVisible(true);
  };

  return (
    <>
      <div className={`${styles.imageUploadModal} ${className || ""}`}>
        {imageFile ? (
          <div className={styles.imagePreviewModal}>
            <Image
              src={imageFile.url}
              alt="Uploaded image"
              className={styles.imagePreviewModal}
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
            <div className={styles.uploadDropAreaModal}>
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
                    {placeholder}
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

export default ImageUpload;