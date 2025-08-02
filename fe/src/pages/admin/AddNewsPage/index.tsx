import React from "react";
import { Card } from "antd";
import Breadcrumb from "@/components/admin/Breadcrumb";
import NewsForm from "@/components/admin/NewsForm";

const AdminAddNewsPage: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Breadcrumb title="Thêm tin tức mới" />
      </div>

      <Card loading={false}>
        <NewsForm mode="add" />
      </Card>
    </div>
  );
};

export default AdminAddNewsPage;