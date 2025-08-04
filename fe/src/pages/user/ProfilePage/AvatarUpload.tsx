import { uploadFile } from "@/api/services/admin/upload";
import { CameraOutlined } from "@ant-design/icons";
import { Button, notification, Upload } from "antd";
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

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  fullName?: string;
  className?: string;
}

const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  fullName,
  className,
}) => {
  const [imageFile, setImageFile] = useState<UploadedFile | null>(
    value
      ? {
          uid: `avatar-${Date.now()}`,
          name: "Avatar",
          status: "done",
          url: value,
          public_id: `avatar-${Date.now()}`,
        }
      : null
  );
  const [imageUploading, setImageUploading] = useState(false);

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
        description: "Upload avatar thành công!",
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      notification.error({
        message: "Lỗi",
        description: "Upload avatar thất bại!",
      });
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <>
      <div className={`${styles.avatarUpload} ${className || ""}`}>
        <div className={styles.avatarContainer}>
          {imageFile ? (
            <div className={styles.avatarImageWrapper}>
              <img
                src={imageFile.url}
                alt="Avatar"
                className={styles.avatarImage}
              />
            </div>
          ) : (
            <div className={styles.avatarPlaceholder}>
              {imageUploading ? (
                <div className={styles.avatarLoading}>
                  <div className={styles.spinner}></div>
                </div>
              ) : (
                <span className={styles.avatarInitials}>
                  {getInitials(fullName)}
                </span>
              )}
            </div>
          )}

          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false;
            }}
            disabled={imageUploading}
            className={styles.avatarUploadButton}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<CameraOutlined />}
              className={styles.cameraButton}
              disabled={imageUploading}
              size="large"
            />
          </Upload>
        </div>
      </div>
    </>
  );
};

export default AvatarUpload;
