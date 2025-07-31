import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePricingData, UpdatePricingData } from "@/api/services/admin/pricing";
import { pricingService } from "@/api/services/admin/pricing";
import { toast } from "react-toastify";
import PricingForm from "@/components/admin/PricingForm";

const AdminAddPricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreatePricingData | UpdatePricingData) => {
    setLoading(true);
    try {
      await pricingService.createPricing(data as CreatePricingData);
      toast.success("Đã thêm bảng giá thành công!");
      navigate("/admin/pricing");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        "Lỗi khi thêm bảng giá: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PricingForm
      mode="add"
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default AdminAddPricingPage; 