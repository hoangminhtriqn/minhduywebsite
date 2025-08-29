import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import NewsForm from "@/components/admin/NewsForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { NewsPermissions } from "@/types/enum";

const AdminAddNewsPage: React.FC = () => {
  return (
    <ProtectedRoute
      requiredPermissions={[NewsPermissions.CREATE]}
      requireEmployee={true}
    >
      <div>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb title="Thêm tin tức mới" />
        </div>

        <Card loading={false}>
          <NewsForm mode="add" />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminAddNewsPage;
