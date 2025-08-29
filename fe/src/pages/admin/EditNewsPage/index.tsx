import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import NewsForm from "@/components/admin/NewsForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { NewsPermissions } from "@/types/enum";

const AdminEditNewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div>
        <div style={{ textAlign: "center", color: "#ff4d4f", padding: "32px" }}>
          Không tìm thấy ID tin tức
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute
      requiredPermissions={[NewsPermissions.EDIT]}
      requireEmployee={true}
    >
      <div>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb title="Chỉnh sửa tin tức" />
        </div>

        <Card>
          <NewsForm mode="edit" newsId={id} />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminEditNewsPage;
