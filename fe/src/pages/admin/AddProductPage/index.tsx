import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ProductUpsetForm from "@/components/admin/ProductForm";

const AdminAddProductPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Breadcrumb title="Thêm sản phẩm mới" />
      </div>

      <Card loading={false}>
        <ProductUpsetForm mode="add" />
      </Card>
    </div>
  );
};

export default AdminAddProductPage;
