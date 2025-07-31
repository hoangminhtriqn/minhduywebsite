import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CreateProductData, UpdateProductData, Category } from "@/api/types";
import { productService } from "@/api/services/user/product";
import { toast } from "react-toastify";
import { ProductStatus } from "@/types";

interface ProductFormProps {
  mode: "add" | "edit";
  productId?: string;
  initialData?: UpdateProductData;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  mode,
  productId,
  initialData,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateProductData | UpdateProductData>({
    Product_Name: "",
    CategoryID: "",
    Main_Image: "",
    List_Image: [],
    Specifications: {},
    Status: ProductStatus.ACTIVE,
    Stock: 0,
    Price: 0,
    Description: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (err: any) {
        toast.error(
          "Lỗi khi tải danh mục: " +
            (err.response?.data?.message || err.message)
        );
      }
    };
    fetchCategories();
  }, []);

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
      setExistingImages(initialData.List_Image || []);
    }
  }, [mode, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === "Main_Image") {
        setFormData((prev) => ({ ...prev, Main_Image: files[0] }));
      } else if (name === "List_Image") {
        setFormData((prev) => ({ ...prev, List_Image: Array.from(files) }));
      }
    }
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      Specifications: {
        ...prev.Specifications,
        [key]: value,
      },
    }));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("Product_Name", formData.Product_Name);
    data.append("CategoryID", formData.CategoryID);
    data.append("Price", formData.Price.toString());
    data.append("Stock", formData.Stock.toString());
    data.append("Status", formData.Status);
    data.append("Description", formData.Description);
    data.append("Specifications", JSON.stringify(formData.Specifications));

    // Handle files
    if (formData.Main_Image instanceof File) {
      data.append("Main_Image", formData.Main_Image);
    }

    if (formData.List_Image && Array.isArray(formData.List_Image)) {
      formData.List_Image.forEach((fileOrUrl) => {
        if (fileOrUrl instanceof File) {
          data.append("List_Image", fileOrUrl);
        }
      });
    }

    await onSubmit(data);
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Chỉnh sửa Sản phẩm" : "Thêm sản phẩm mới";
  const submitText = loading ? "Đang xử lý..." : (isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm");

  return (
    <div className={`admin-${mode}-product-page`}>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {/* Product Name */}
        <div className="mb-4">
          <label
            htmlFor="Product_Name"
            className="block text-gray-700 font-bold mb-2"
          >
            Tên sản phẩm
          </label>
          <input
            type="text"
            id="Product_Name"
            name="Product_Name"
            value={formData.Product_Name || ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label
            htmlFor="CategoryID"
            className="block text-gray-700 font-bold mb-2"
          >
            Danh mục
          </label>
          <select
            id="CategoryID"
            name="CategoryID"
            value={formData.CategoryID || ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.Category_Name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="Price" className="block text-gray-700 font-bold mb-2">
            Giá
          </label>
          <input
            type="number"
            id="Price"
            name="Price"
            value={formData.Price !== undefined ? formData.Price : ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            min="0"
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label htmlFor="Stock" className="block text-gray-700 font-bold mb-2">
            Tồn kho
          </label>
          <input
            type="number"
            id="Stock"
            name="Stock"
            value={formData.Stock !== undefined ? formData.Stock : ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            min="0"
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label
            htmlFor="Status"
            className="block text-gray-700 font-bold mb-2"
          >
            Trạng thái
          </label>
          <select
            id="Status"
            name="Status"
            value={formData.Status || ProductStatus.ACTIVE}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value={ProductStatus.ACTIVE}>Hoạt động</option>
            <option value={ProductStatus.INACTIVE}>Không hoạt động</option>
            <option value={ProductStatus.OUT_OF_STOCK}>Hết hàng</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="Description"
            className="block text-gray-700 font-bold mb-2"
          >
            Mô tả
          </label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description || ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            required
          />
        </div>

        {/* Main Image */}
        <div className="mb-4">
          <label
            htmlFor="Main_Image"
            className="block text-gray-700 font-bold mb-2"
          >
            Ảnh chính
          </label>
          {/* Display existing image in edit mode */}
          {isEditMode && typeof formData.Main_Image === "string" && formData.Main_Image && (
            <div className="mb-2">
              <img
                src={formData.Main_Image}
                alt="Existing Main"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            id="Main_Image"
            name="Main_Image"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*"
            required={!isEditMode || !formData.Main_Image}
          />
        </div>

        {/* List Images */}
        <div className="mb-4">
          <label
            htmlFor="List_Image"
            className="block text-gray-700 font-bold mb-2"
          >
            Ảnh phụ {!isEditMode && "(Chọn nhiều file)"}
          </label>
          {/* Display existing images with remove option in edit mode */}
          {isEditMode && existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Existing ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs leading-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            id="List_Image"
            name="List_Image"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*"
            multiple
          />
          {formData.List_Image &&
            Array.isArray(formData.List_Image) &&
            formData.List_Image.length > 0 && (
              <p className="text-gray-600 text-sm mt-1">
                Selected: {formData.List_Image.length} file(s)
              </p>
            )}
        </div>

        {/* Specifications */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Thông số kỹ thuật</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="spec-engine"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Engine
              </label>
              <input
                type="text"
                id="spec-engine"
                value={formData.Specifications?.Engine || ""}
                onChange={(e) =>
                  handleSpecificationChange("Engine", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                htmlFor="spec-hp"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Horsepower
              </label>
              <input
                type="text"
                id="spec-hp"
                value={formData.Specifications?.Horsepower || ""}
                onChange={(e) =>
                  handleSpecificationChange("Horsepower", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {submitText}
          </button>
          <Link
            to="/admin/products"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 