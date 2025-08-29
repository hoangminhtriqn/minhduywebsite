import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import PricingForm from "@/components/admin/PricingForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PricingPermissions } from "@/types/enum";

const AdminAddPricingPage: React.FC = () => {
  return (
    <ProtectedRoute
      requiredPermissions={[PricingPermissions.CREATE]}
      requireEmployee={true}
    >
      <div>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb title="Thêm bảng giá mới" />
        </div>

        <Card loading={false}>
          <PricingForm mode="add" />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminAddPricingPage;
