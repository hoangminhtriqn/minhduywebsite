import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ProductUpsetForm from "@/components/admin/ProductForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ProductPermissions } from "@/types/enum";

const AdminAddProductPage: React.FC = () => {
  return (
    <ProtectedRoute
      requiredPermissions={[ProductPermissions.CREATE]}
      requireEmployee={true}
    >
      <div>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb title="Thêm sản phẩm mới" />
        </div>

        <Card loading={false}>
          <ProductUpsetForm mode="add" />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminAddProductPage;
