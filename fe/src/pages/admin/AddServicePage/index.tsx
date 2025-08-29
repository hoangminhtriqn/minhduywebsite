import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ServiceForm from "@/components/admin/ServiceForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ServicePermissions } from "@/types/enum";

const AddServicePage: React.FC = () => {
  return (
    <ProtectedRoute
      requiredPermissions={[ServicePermissions.CREATE]}
      requireEmployee={true}
    >
      <div>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb title="Thêm dịch vụ mới" />
        </div>

        <Card loading={false}>
          <ServiceForm mode="add" />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AddServicePage;
