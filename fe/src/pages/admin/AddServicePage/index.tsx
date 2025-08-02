import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import ServiceForm from "@/components/admin/ServiceForm";

const AddServicePage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Breadcrumb title="Thêm dịch vụ mới" />
      </div>

      <Card loading={false}>
        <ServiceForm mode="add" />
      </Card>
    </div>
  );
};

export default AddServicePage;
