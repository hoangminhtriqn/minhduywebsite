import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import PricingForm from "@/components/admin/PricingForm";

const AdminAddPricingPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Breadcrumb title="Thêm bảng giá mới" />
      </div>

      <Card loading={false}>
        <PricingForm mode="add" />
      </Card>
    </div>
  );
};

export default AdminAddPricingPage; 