import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdatePricingData } from "@/api/services/admin/pricing";
import { pricingService } from "@/api/services/admin/pricing";
import { toast } from "react-toastify";
import PricingForm from "@/components/admin/PricingForm";

const AdminEditPricingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<UpdatePricingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch pricing data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const pricingData = await pricingService.getPricingById(id);
        setInitialData({
          title: pricingData.title,
          category: pricingData.category,
          description: pricingData.description,
          features: pricingData.features,
          documents: pricingData.documents,
          color: pricingData.color,
          status: pricingData.status,
          order: pricingData.order,
        });
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          "Lỗi khi tải dữ liệu bảng giá: " +
            (error.response?.data?.message || error.message)
        );
        setError(error.response?.data?.message || error.message || "Đã xảy ra lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: UpdatePricingData) => {
    setLoading(true);
    try {
      if (!id) {
        toast.error("Pricing ID is missing for update.");
        setLoading(false);
        return;
      }
      await pricingService.updatePricing(id, data);
      toast.success("Đã cập nhật bảng giá thành công!");
      navigate("/admin/pricing");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        "Lỗi khi cập nhật bảng giá: " +
          (error.response?.data?.message || error.message)
      );
      setError(error.response?.data?.message || error.message || "Đã xảy ra lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu bảng giá...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Lỗi: {error}</div>;
  }

  if (!initialData) {
    return <div className="text-center text-red-500 py-8">Không tìm thấy dữ liệu bảng giá</div>;
  }

  return (
    <PricingForm
      mode="edit"
      pricingId={id}
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default AdminEditPricingPage; 