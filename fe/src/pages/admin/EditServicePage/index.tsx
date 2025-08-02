import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ServiceForm from "@/components/admin/ServiceForm";

const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div>
        <div style={{ textAlign: "center", color: "#ff4d4f", padding: "32px" }}>
          Không tìm thấy ID dịch vụ
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Breadcrumb title="Chỉnh sửa dịch vụ" />
      </div>

      <Card>
        <ServiceForm mode="edit" serviceId={id} />
      </Card>
    </div>
  );
};

export default EditServicePage;
