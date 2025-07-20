import { authService } from "@/api/services/user/auth";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ProfilePage: React.FC = () => {
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    FullName: user?.FullName || "",
    Phone: user?.Phone || "",
    Address: user?.Address || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?._id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    setIsSaving(true);
    try {
      await authService.updateProfile(user._id, editForm);
      updateUser(editForm);

      setTimeout(() => {
        toast.success("Cập nhật thông tin thành công!");
      }, 500);

      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      FullName: user?.FullName || "",
      Phone: user?.Phone || "",
      Address: user?.Address || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.notLoggedIn}>
        <h2>Yêu cầu đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem thông tin cá nhân</p>
      </div>
    );
  }

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {/* Luôn dùng ký tự đầu tên làm avatar */}
            <span>{getInitials(user.FullName)}</span>
          </div>
          <h2 className={styles.fullName}>{user.FullName}</h2>
          <div className={styles.role}>
            {user.Role === "admin" ? "Quản trị viên" : "Khách hàng"}
          </div>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <span className={styles.label}>Tên đăng nhập:</span>
            <span className={styles.value}>{user.UserName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 7l9 6 9-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </span>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.Email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.35.27 2.67.76 3.88a1 1 0 0 1-.21 1.11l-2.2 2.2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <span className={styles.label}>Số điện thoại:</span>
            {isEditing ? (
              <input
                type="text"
                name="Phone"
                value={editForm.Phone}
                onChange={handleInputChange}
                className={styles.editInput}
                placeholder="Nhập số điện thoại"
              />
            ) : (
              <span className={styles.value}>{user.Phone}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.5 11 9 11s9-5.75 9-11c0-4.97-4.03-9-9-9Zm0 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
            <span className={styles.label}>Địa chỉ:</span>
            {isEditing ? (
              <input
                type="text"
                name="Address"
                value={editForm.Address}
                onChange={handleInputChange}
                className={styles.editInput}
                placeholder="Nhập địa chỉ"
              />
            ) : (
              <span className={styles.value}>{user.Address}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <span className={styles.label}>Trạng thái:</span>
            <span className={styles.value}>
              {user.Status === "active" ? "Đang hoạt động" : "Đã khóa"}
            </span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className={styles.saveButton}
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={isSaving}
              >
                Hủy bỏ
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
