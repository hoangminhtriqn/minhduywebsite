import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateProductData, Category } from "../../api/types";
import { productService } from "../../api/services/product";
import { toast } from "react-toastify";

const AdminAddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateProductData>({
    Product_Name: "",
    CategoryID: "",
    Main_Image: "", // This will hold File or string URL
    List_Image: [], // This will hold array of File or string URLs
    Specifications: {}, // Start with an empty object for specifications
    Status: "available", // Default status
    Stock: 0,
    Price: 0,
    Description: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories for the dropdown
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
        // Assuming multiple files can be selected
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

  const handleAddSpecification = () => {
    // You might want a more sophisticated way to add/manage specs
    // For simplicity, let's just log for now
    // A common pattern is to add input fields dynamically
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Need to construct FormData for file uploads if using files
      const productToCreate: CreateProductData = {
        ...formData,
        // File objects need special handling, for now assuming basic object
        // In a real app, you'd append files to FormData
        // Main_Image: formData.Main_Image, // This might be a File
        // List_Image: formData.List_Image, // This might be Array of Files
      };

      // Example of how to create FormData for file uploads
      const data = new FormData();
      data.append("Product_Name", formData.Product_Name);
      data.append("CategoryID", formData.CategoryID);
      data.append("Price", formData.Price.toString());
      data.append("Stock", formData.Stock.toString());
      data.append("Status", formData.Status);
      data.append("Description", formData.Description);
      // Append specifications as a JSON string or individual fields depending on backend API
      data.append("Specifications", JSON.stringify(formData.Specifications));

      // Append files
      if (formData.Main_Image instanceof File) {
        data.append("Main_Image", formData.Main_Image);
      } else if (typeof formData.Main_Image === "string") {
        // If Main_Image is a string, it might be an existing URL (though for add, it's likely a File)
        // Depending on API, you might not send it if it's an existing URL on add
      }

      if (formData.List_Image && Array.isArray(formData.List_Image)) {
        formData.List_Image.forEach((fileOrUrl) => {
          if (fileOrUrl instanceof File) {
            data.append("List_Image", fileOrUrl);
          } else if (typeof fileOrUrl === "string") {
            // If List_Image contains strings, these might be existing URLs (unlikely for add)
            // Handle based on API requirements
          }
        });
      }

      // Call the create product API
      const newProduct = await productService.createProduct(data as any); // Cast to any for FormData for now

      toast.success("Đã thêm sản phẩm thành công!");
      navigate("/admin/products"); // Navigate back to product list
    } catch (err: any) {
      toast.error(
        "Lỗi khi thêm sản phẩm: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product-page">
      <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>

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
            value={formData.Product_Name}
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
            value={formData.CategoryID}
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
            value={formData.Price}
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
            value={formData.Stock}
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
            value={formData.Status}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="available">Còn hàng</option>
            <option value="unavailable">Hết hàng</option>
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
            value={formData.Description}
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
          <input
            type="file"
            id="Main_Image"
            name="Main_Image"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*"
            required
          />
          {formData.Main_Image && typeof formData.Main_Image === "string" && (
            <p className="text-gray-600 text-sm mt-1">
              Current: {formData.Main_Image}
            </p>
          )}
        </div>

        {/* List Images */}
        <div className="mb-4">
          <label
            htmlFor="List_Image"
            className="block text-gray-700 font-bold mb-2"
          >
            Ảnh phụ (Chọn nhiều file)
          </label>
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
          {/* You might want to display previews of selected/existing images here */}
        </div>

        {/* Specifications (Simplified) */}
        {/* This is a basic representation. A real implementation would need dynamic fields. */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Thông số kỹ thuật</h3>
          {/* Example static fields - replace with dynamic input fields later */}
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
                value={formData.Specifications.Engine || ""}
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
                value={formData.Specifications.Horsepower || ""}
                onChange={(e) =>
                  handleSpecificationChange("Horsepower", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {/* Add more spec fields as needed */}
          </div>
          {/* Add button to add more specifications dynamically */}
          {/* <button type="button" onClick={handleAddSpecification} className="mt-2 bg-gray-300 px-3 py-1 rounded text-gray-800">Add Spec</button> */}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
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

export default AdminAddProductPage;
