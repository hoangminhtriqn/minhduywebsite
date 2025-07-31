import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UpdateProductData, Category } from "@/api/types";
import { productService } from "@/api/services/user/product";
import { toast } from "react-toastify";
import { ProductStatus } from "@/types";

const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UpdateProductData>({
    Product_Name: "",
    CategoryID: "",
    Main_Image: "", // This will hold File or string URL
    List_Image: [], // This will hold array of File or string URLs or a mix
    Specifications: {}, // Start with an empty object for specifications
    Status: ProductStatus.ACTIVE, // Default status
    Stock: 0,
    Price: 0,
    Description: "",
  });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // To manage existing list images
  const [error, setError] = useState<string | null>(null);

  // Fetch product data and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Should not happen due to route definition, but good practice

      try {
        // Fetch product data
        const productData = await productService.getProductById(id);
        setFormData({
          Product_Name: productData.Product_Name,
          CategoryID: productData.CategoryID,
          Main_Image: productData.Main_Image, // Set existing main image URL
          List_Image: productData.List_Image, // Set existing list image URLs
          Specifications: productData.Specifications || {}, // Handle potential undefined
          Status: productData.Status,
          Stock: productData.Stock,
          Price: productData.Price,
          Description: productData.Description || "", // Handle potential undefined
        });
        setExistingImages(productData.List_Image || []); // Store existing list images separately

        // Fetch categories
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData);
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
  }, [id]); // Rerun effect if ID changes

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
        // When new files are selected, replace the entire list of files/urls with new Files
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
    // Logic to remove an existing image - requires backend support
    // You would typically send a request to the backend to remove the image
    // And update the existingImages state upon success
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    // You might also need to track removed images to tell the backend
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Construct FormData for file uploads and updated data
      const data = new FormData();
      // Append only fields that have potentially changed or are required
      if (formData.Product_Name)
        data.append("Product_Name", formData.Product_Name);
      if (formData.CategoryID) data.append("CategoryID", formData.CategoryID);
      if (formData.Price !== undefined)
        data.append("Price", formData.Price.toString());
      if (formData.Stock !== undefined)
        data.append("Stock", formData.Stock.toString());
      if (formData.Status) data.append("Status", formData.Status);
      if (formData.Description !== undefined)
        data.append("Description", formData.Description);
      // Append specifications as a JSON string
      if (formData.Specifications)
        data.append("Specifications", JSON.stringify(formData.Specifications));

      // Append files (newly selected files)
      if (formData.Main_Image instanceof File) {
        data.append("Main_Image", formData.Main_Image);
      } else if (typeof formData.Main_Image === "string") {
        // If it's an existing URL, we might not need to re-send it unless backend requires it
        // Or if backend distinguishes between new file and existing URL
      }

      if (formData.List_Image && Array.isArray(formData.List_Image)) {
        formData.List_Image.forEach((fileOrUrl) => {
          if (fileOrUrl instanceof File) {
            data.append("List_Image", fileOrUrl); // Append new files
          } else if (typeof fileOrUrl === "string") {
            // If it's an existing URL, depending on API, you might need to append it again
            // data.append('List_Image', fileOrUrl); // Append existing URLs
          }
        });
        // You also need a way to tell the backend which *existing* images were removed
        // This often involves sending a list of image URLs to keep or a list of URLs to remove
      }

      // Call the update product API
      if (!id) {
        toast.error("Product ID is missing for update.");
        setLoading(false);
        return;
      }
      await productService.updateProduct(
        id,
        data as unknown as UpdateProductData
      ); // Cast to any for FormData

      toast.success("Đã cập nhật sản phẩm thành công!");
      navigate("/admin/products"); // Navigate back to product list
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

  return (
    <div className="admin-edit-product-page">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa Sản phẩm</h1>

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
            value={formData.Product_Name || ""} // Use || '' to handle potential null/undefined
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
            value={formData.CategoryID || ""} // Use || ''
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
            value={formData.Price !== undefined ? formData.Price : ""} // Handle 0 or undefined
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
            value={formData.Stock !== undefined ? formData.Stock : ""} // Handle 0 or undefined
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
            value={formData.Status || ProductStatus.ACTIVE} // Use default if null/undefined
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
            value={formData.Description || ""} // Use || ''
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
          {/* Display existing image if available */}
          {typeof formData.Main_Image === "string" && formData.Main_Image && (
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
            // required={!formData.Main_Image} // Require if no existing image
          />
        </div>

        {/* List Images */}
        <div className="mb-4">
          <label
            htmlFor="List_Image"
            className="block text-gray-700 font-bold mb-2"
          >
            Ảnh phụ
          </label>
          {/* Display existing images with remove option */}
          {existingImages.length > 0 && (
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
          {/* Input for uploading new additional images */}
          <input
            type="file"
            id="List_Image"
            name="List_Image"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*"
            multiple
          />
          {/* Display previews of newly selected files if needed */}
          {/* You might need state to track newly selected list images */}
        </div>

        {/* Specifications (Simplified) */}
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
            {loading ? "Đang xử lý..." : "Cập nhật sản phẩm"}
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

export default AdminEditProductPage;
