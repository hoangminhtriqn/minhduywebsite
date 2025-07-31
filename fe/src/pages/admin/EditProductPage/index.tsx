import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateProductData } from "@/api/types";
import { productService } from "@/api/services/user/product";
import { toast } from "react-toastify";
import ProductForm from "@/components/admin/ProductForm";

const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<UpdateProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const productData = await productService.getProductById(id);
        setInitialData({
          Product_Name: productData.Product_Name,
          CategoryID: productData.CategoryID,
          Main_Image: productData.Main_Image,
          List_Image: productData.List_Image,
          Specifications: productData.Specifications || {},
          Status: productData.Status,
          Stock: productData.Stock,
          Price: productData.Price,
          Description: productData.Description || "",
        });
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        toast.error(
          "Lỗi khi tải dữ liệu sản phẩm: " +
            (error.response?.data?.message || error.message)
        );
        setError(error.response?.data?.message || error.message || "Đã xảy ra lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (!id) {
        toast.error("Product ID is missing for update.");
        setLoading(false);
        return;
      }
      await productService.updateProduct(id, data as unknown as UpdateProductData);
      toast.success("Đã cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        "Lỗi khi cập nhật sản phẩm: " +
          (error.response?.data?.message || error.message)
      );
      setError(error.response?.data?.message || error.message || "Đã xảy ra lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải dữ liệu sản phẩm...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Lỗi: {error}</div>;
  }

  if (!initialData) {
    return <div className="text-center text-red-500 py-8">Không tìm thấy dữ liệu sản phẩm</div>;
  }

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default AdminEditProductPage;
