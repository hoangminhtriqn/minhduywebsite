import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateProductData } from "@/api/types";
import { productService } from "@/api/services/user/product";
import { toast } from "react-toastify";
import ProductForm from "@/components/admin/ProductForm";

const AdminAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await productService.createProduct(data as unknown as CreateProductData);
      toast.success("Đã thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        "Lỗi khi thêm sản phẩm: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      mode="add"
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default AdminAddProductPage;
