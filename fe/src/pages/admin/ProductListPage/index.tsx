import { productService as adminProductService } from "@/api/services/admin/product";
import CustomPagination from "@/components/CustomPagination";
import Breadcrumb from "@/components/admin/Breadcrumb";

import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
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

  notification,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const { confirm } = Modal;
const { Option } = Select;
const { OptGroup } = Select;

interface Product {
  _id: string;
  Product_Name: string;
  Price: number;
  Stock?: number;
  CategoryID:
    | string
    | {
        _id: string;
        Name: string;
        ParentID?: { _id: string; Name: string } | null;
      };
  Description?: string;
  Main_Image?: string;
  List_Image?: string[];
  Specifications?: Record<string, string>;

  createdAt: string;
  updatedAt: string;
  favoriteCount: number;
  favoritedUsers: { user: FavoriteUser }[];
}

interface Category {
  _id: string;
  Name: string;
  ParentID?: { _id: string; Name: string } | null;
}

interface FavoriteUser {
  _id: string;
  UserName: string;
  FullName: string;
  Email: string;
  Phone: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [favoriteModalVisible, setFavoriteModalVisible] = useState(false);
  const [favoriteUsers, setFavoriteUsers] = useState<FavoriteUser[]>([]);
  const [favoriteProductName, setFavoriteProductName] = useState<string>("");

  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const products = await adminProductService.getAllProducts({
        page: currentPage,
        limit: pageSize,
        search: searchText,
        category: selectedCategory,

        sortBy,
        sortOrder,
      });
      setProducts(products.products);
      setTotal(products.pagination.total);
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách sản phẩm.",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, selectedCategory, sortBy, sortOrder]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await adminProductService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách danh mục.",
      });
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleDeleteProduct = async (productId: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await adminProductService.deleteProduct(productId);
          notification.success({
            message: "Thành công",
            description: "Sản phẩm đã được xóa.",
          });
          fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa sản phẩm.",
          });
        }
      },
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };



  const handleSortChange = (value: string) => {
    const [sortField, order] = value.split("-");
    setSortBy(sortField);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: <span style={{ fontWeight: 600 }}>Hình ảnh</span>,
      dataIndex: "Main_Image",
      key: "image",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (image: string) => (
        <img
          src={image}
          alt="Sản phẩm"
          style={{ width: 50, height: 50, objectFit: "contain" }}
        />
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Tên sản phẩm</span>,
      dataIndex: "Product_Name",
      key: "name",
      ellipsis: true,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      sorter: (a: Product, b: Product) =>
        a.Product_Name.localeCompare(b.Product_Name),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Giá thuê</span>,
      dataIndex: "Price",
      key: "price",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (price: number) => price.toLocaleString("vi-VN") + " đ",
      sorter: (a: Product, b: Product) => a.Price - b.Price,
    },
    {
      title: <span style={{ fontWeight: 600 }}>Danh mục</span>,
      key: "category",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_: unknown, record: Product) => {
        const cat = record.CategoryID as {
          Name?: string;
          ParentID?: { Name?: string };
        };
        const parentName = cat?.ParentID?.Name || "";
        const childName = cat?.Name || "";
        if (parentName && childName) {
          return (
            <span>
              <span style={{ fontWeight: 500 }}>{parentName}</span>
              <span style={{ color: "#888" }}> &gt; </span>
              <span style={{ fontWeight: 500 }}>{childName}</span>
            </span>
          );
        } else if (childName) {
          return <span style={{ fontWeight: 500 }}>{childName}</span>;
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      title: <span style={{ fontWeight: 600 }}>Yêu thích</span>,
      key: "favoriteCount",
      align: "center" as const,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (
        _: unknown,
        record: {
          favoriteCount: number;
          favoritedUsers: { user: FavoriteUser }[];
          Product_Name: string;
        }
      ) => (
        <span
          style={{
            color: "#faad14",
            cursor: record.favoriteCount > 0 ? "pointer" : "default",
          }}
          onClick={() => {
            if (record.favoriteCount > 0) {
              setFavoriteUsers(record.favoritedUsers.map((u) => u.user));
              setFavoriteProductName(record.Product_Name);
              setFavoriteModalVisible(true);
            }
          }}
        >
          <span style={{ fontWeight: 600 }}>{record.favoriteCount}</span>
        </span>
      ),
    },

    {
      title: <span style={{ fontWeight: 600 }}>Ngày tạo</span>,
      dataIndex: "createdAt",
      key: "createdAt",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
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
      title: <span style={{ fontWeight: 600 }}>Thao tác</span>,
      key: "action",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_: unknown, record: Product) => (
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
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
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

  const handleTableChange = () => {};

  const handlePaginationChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  return (
    <div className={styles.productListPage}>
      <Breadcrumb
        title="Quản lý sản phẩm"
        showAddButton={true}
        addButtonText="Thêm sản phẩm"
        onAddClick={() => navigate("/admin/products/add")}
      />

      <Card className={styles.filterCard}>
        <Space size="large">
          <Input
            placeholder="Tìm kiếm sản phẩm"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo danh mục"
            style={{ width: 200 }}
            onChange={handleCategoryChange}
            allowClear
            showSearch
            optionFilterProp="label"
          >
            <Option value="">Tất cả danh mục</Option>
            {(categories || [])
              .filter((cat) => cat.ParentID === null)
              .map((parent) => (
                <OptGroup key={parent._id} label={parent.Name}>
                  {(categories || [])
                    .filter(
                      (child) =>
                        child.ParentID && child.ParentID._id === parent._id
                    )
                    .map((child) => (
                      <Option
                        key={child._id}
                        value={child._id}
                        label={child.Name}
                      >
                        {child.Name}
                      </Option>
                    ))}
                </OptGroup>
              ))}
          </Select>

          <Select
            placeholder="Sắp xếp"
            style={{ width: 140 }}
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
          >
            <Option value="createdAt-desc">Mới nhất</Option>
            <Option value="Price-asc">Giá: Thấp đến cao</Option>
            <Option value="Price-desc">Giá: Cao đến thấp</Option>
            <Option value="Product_Name-asc">Tên: A-Z</Option>
            <Option value="Product_Name-desc">Tên: Z-A</Option>
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
          scroll={{ x: "max-content" }}
        />
        <div className={styles.paginationContainer}>
          <CustomPagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      </Spin>
      <Modal
        open={favoriteModalVisible}
        title={`Danh sách người yêu thích: ${favoriteProductName}`}
        onCancel={() => setFavoriteModalVisible(false)}
        footer={null}
        width={600}
      >
        {favoriteUsers.length === 0 ? (
          <div>Chưa có ai yêu thích sản phẩm này.</div>
        ) : (
          <Table
            dataSource={favoriteUsers}
            rowKey="_id"
            pagination={false}
            columns={[
              {
                title: "Tên đăng nhập",
                dataIndex: "UserName",
                key: "UserName",
              },
              { title: "Họ tên", dataIndex: "FullName", key: "FullName" },
              { title: "Email", dataIndex: "Email", key: "Email" },
              { title: "Số điện thoại", dataIndex: "Phone", key: "Phone" },
            ]}
            size="small"
            scroll={{ x: "max-content" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductListPage;
