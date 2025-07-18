import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/api/config";
import CustomPagination from "@/components/CustomPagination";
import Breadcrumb from "@/components/admin/Breadcrumb";
import styles from "./ProductListPage.module.scss";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

interface Product {
  _id: string;
  Product_Name: string;
  Price: number;
  Stock: number;
  CategoryID: { _id: string; Category_Name: string };
  Description?: string;
  Main_Image?: string;
  List_Image?: string[];
  Specifications?: any;
  Status?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  Category_Name: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/xe`, {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchText,
          sortBy:
            sortColumn === "Product_Name"
              ? "Product_Name"
              : sortColumn === "Price"
                ? "Price"
                : sortColumn === "Stock"
                  ? "Stock"
                  : sortColumn,
          order:
            sortOrder === "ascend"
              ? "asc"
              : sortOrder === "descend"
                ? "desc"
                : undefined,
          category: selectedCategory,
        },
      });
      setProducts(response.data.products);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách xe cho thuê.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/danh-muc`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách danh mục.",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    sortOrder,
    sortColumn,
    selectedCategory,
  ]);

  const handleDeleteProduct = async (productId: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa xe cho thuê này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await axios.delete(`${API_BASE_URL}/xe/${productId}`);
          notification.success({
            message: "Thành công",
            description: "Xe cho thuê đã được xóa.",
          });
          fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa xe cho thuê.",
          });
        }
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPagination({ ...pagination, current: 1 });
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "Main_Image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Xe cho thuê"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên xe cho thuê",
      dataIndex: "Product_Name",
      key: "name",
      sorter: (a: Product, b: Product) =>
        a.Product_Name.localeCompare(b.Product_Name),
    },
    {
      title: "Giá thuê",
      dataIndex: "Price",
      key: "price",
      render: (price: number) => price.toLocaleString("vi-VN") + " đ",
      sorter: (a: Product, b: Product) => a.Price - b.Price,
    },
    {
      title: "Danh mục",
      dataIndex: ["CategoryID", "Category_Name"],
      key: "category",
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Còn cho thuê" : "Hết cho thuê"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
      sorter: (a: Product, b: Product) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/products/edit/${record._id}`)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa xe cho thuê này?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.columnKey) {
      setSortColumn(
        sorter.columnKey === "Product_Name"
          ? "Product_Name"
          : sorter.columnKey === "Price"
            ? "Price"
            : sorter.columnKey === "createdAt"
              ? "createdAt"
              : sorter.columnKey
      );
      setSortOrder(sorter.order);
    } else {
      setSortColumn(undefined);
      setSortOrder(undefined);
    }
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination({
      ...pagination,
      current: page,
      pageSize: newPageSize,
    });
  };

  return (
    <div className={styles.productListPage}>
      <Breadcrumb
        title="Quản lý xe cho thuê"
        showAddButton={true}
        addButtonText="Thêm xe cho thuê"
        onAddClick={() => navigate("/admin/products/add")}
      />

      <Card className={styles.filterCard}>
        <Space size="large">
          <Input
            placeholder="Tìm kiếm xe cho thuê"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo danh mục"
            style={{ width: 200 }}
            onChange={handleCategoryChange}
            allowClear
          >
            <Option value="">Tất cả danh mục</Option>
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.Category_Name}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      <Spin spinning={loading}>
        <Table
          className={styles.table}
          columns={columns}
          dataSource={products}
          rowKey="_id"
          pagination={false}
          onChange={handleTableChange}
        />
        <div className={styles.paginationContainer}>
          <CustomPagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      </Spin>
    </div>
  );
};

export default ProductListPage;
