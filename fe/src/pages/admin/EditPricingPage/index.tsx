import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import PricingForm from "@/components/admin/PricingForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PricingPermissions } from "@/types/enum";

const AdminEditPricingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div>
        <div style={{ textAlign: "center", color: "#ff4d4f", padding: "32px" }}>
          Không tìm thấy ID bảng giá
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute
      requiredPermissions={[PricingPermissions.EDIT]}
      requireEmployee={true}
    >
      <div>
        <div style={{ marginBottom: "24px" }}>
          <Breadcrumb title="Chỉnh sửa bảng giá" />
        </div>

        <Card>
          <PricingForm mode="edit" pricingId={id} />
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminEditPricingPage;
