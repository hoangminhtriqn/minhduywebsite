import { CreatePricingData, UpdatePricingData } from "@/api/services/admin/pricing";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PricingFormProps {
  mode: "add" | "edit";
  pricingId?: string;
  initialData?: UpdatePricingData;
  onSubmit: (data: CreatePricingData | UpdatePricingData) => Promise<void>;
  loading: boolean;
}

const PricingForm: React.FC<PricingFormProps> = ({
  mode,
  initialData,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<CreatePricingData | UpdatePricingData>({
    title: "",
    category: "",
    description: "",
    features: [],
    documents: [],
    color: "blue",
    status: "active",
    order: 0,
  });
  const [newFeature, setNewFeature] = useState("");
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "pdf" as 'pdf' | 'word' | 'excel',
    size: "",
    url: "",
  });

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAddDocument = () => {
    if (newDocument.name && newDocument.url) {
      setFormData((prev) => ({
        ...prev,
        documents: [...(prev.documents || []), { ...newDocument }],
      }));
      setNewDocument({
        name: "",
        type: "pdf",
        size: "",
        url: "",
      });
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Chỉnh sửa Bảng giá" : "Thêm bảng giá mới";
  const submitText = loading ? "Đang xử lý..." : (isEditMode ? "Cập nhật bảng giá" : "Thêm bảng giá");

  const colorOptions = [
    'blue', 'green', 'purple', 'orange', 'red', 'teal',
    'indigo', 'pink', 'yellow', 'cyan', 'lime', 'amber',
    'emerald', 'violet', 'rose', 'sky', 'slate', 'zinc',
    'neutral', 'stone', 'gray', 'cool-gray', 'warm-gray'
  ];

  return (
    <div className={`admin-${mode}-pricing-page`}>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
            Danh mục
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            required
          />
        </div>

        {/* Color */}
        <div className="mb-4">
          <label htmlFor="color" className="block text-gray-700 font-bold mb-2">
            Màu sắc
          </label>
          <select
            id="color"
            name="color"
            value={formData.color || "blue"}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            {colorOptions.map((color) => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || "active"}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        {/* Order */}
        <div className="mb-4">
          <label htmlFor="order" className="block text-gray-700 font-bold mb-2">
            Thứ tự
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order || 0}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            min="0"
          />
        </div>

        {/* Features */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Tính năng
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Thêm tính năng mới"
              className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Thêm
            </button>
          </div>
          <div className="space-y-2">
            {formData.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1 bg-gray-100 p-2 rounded">{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Tài liệu
          </label>
          <div className="space-y-2 mb-2">
            <input
              type="text"
              value={newDocument.name}
              onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tên tài liệu"
              className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <div className="flex gap-2">
              <select
                value={newDocument.type}
                onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value as 'pdf' | 'word' | 'excel' }))}
                className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="pdf">PDF</option>
                <option value="word">Word</option>
                <option value="excel">Excel</option>
              </select>
              <input
                type="text"
                value={newDocument.size}
                onChange={(e) => setNewDocument(prev => ({ ...prev, size: e.target.value }))}
                placeholder="Kích thước"
                className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <input
              type="url"
              value={newDocument.url}
              onChange={(e) => setNewDocument(prev => ({ ...prev, url: e.target.value }))}
              placeholder="URL tài liệu"
              className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={handleAddDocument}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Thêm tài liệu
            </button>
          </div>
          <div className="space-y-2">
            {formData.documents?.map((doc, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                <div className="flex-1">
                  <div className="font-semibold">{doc.name}</div>
                  <div className="text-sm text-gray-600">
                    {doc.type.toUpperCase()} - {doc.size}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                >
                  Xóa
                </button>
              </div>
            ))}
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
            to="/admin/pricing"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PricingForm; 