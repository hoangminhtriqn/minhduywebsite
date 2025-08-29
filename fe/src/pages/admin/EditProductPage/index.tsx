import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ProductUpsetForm from "@/components/admin/ProductForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ProductPermissions } from "@/types/enum";

const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div>
        <div style={{ textAlign: "center", color: "#ff4d4f", padding: "32px" }}>
          Không tìm thấy ID sản phẩm
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute
      requiredPermissions={[ProductPermissions.EDIT]}
      requireEmployee={true}
    >
      <div>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb title="Chỉnh sửa sản phẩm" />
        </div>

        <Card>
          <ProductUpsetForm mode="edit" productId={id} />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminEditProductPage;
