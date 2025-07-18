import { updateCategory } from "@/api/services/user/categories";
import Breadcrumb from "@/components/admin/Breadcrumb";
import {
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Tree,
  Typography,
} from "antd";

import React, { useEffect, useState, useRef } from "react";

const { Title, Text } = Typography;
const { confirm } = Modal;

// Danh sách emoji cho icon danh mục
const EMOJI_LIST = [
  "🚗",
  "🏎️",
  "🚙",
  "🚌",
  "🚐",
  "🚒",
  "🚓",
  "🚑",
  "🚚",
  "🚛",
  "🚜",
  "🏍️",
  "🛵",
  "🚲",
  "🛴",
  "🛹",
  "🚁",
  "🛩️",
  "✈️",
  "🛫",
  "🛬",
  "🚀",
  "🚢",
  "⛵",
  "🚤",
  "🛥️",
  "⛴️",
  "🚣",
  "🚣‍♂️",
  "🚣‍♀️",
  "🏠",
  "🏡",
  "🏘️",
  "🏚️",
  "🏗️",
  "🏭",
  "🏢",
  "🏬",
  "🏣",
  "🏤",
  "🏥",
  "🏦",
  "🏨",
  "🏪",
  "🏫",
  "🏩",
  "💎",
  "💍",
  "📱",
  "📲",
  "💻",
  "⌨️",
  "🖥️",
  "🖨️",
  "🖱️",
  "🖲️",
];

interface Category {
  _id: string;
  Name: string;
  Description?: string;
  ParentID?: {
    _id: string;
    Name: string;
  } | null;
  Icon?: string;
  Status?: string;
  Order?: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryTreeNode {
  key: string;
  title: React.ReactNode;
  children?: CategoryTreeNode[];
  category: Category;
  isParent: boolean;
}

const CategoryListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [isParentCategory, setIsParentCategory] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(
    undefined
  );
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      const allCategories = data.categories || [];
      console.log("Fetched categories:", allCategories.length);
      setCategories(allCategories);

      // Separate parent and child categories
      const parents = allCategories.filter((cat: Category) => !cat.ParentID);
      console.log("Parent categories:", parents.length);
      setParentCategories(parents);

      // Chỉ mở category đầu tiên, các category khác đóng
      const firstParentKey = parents.length > 0 ? parents[0]._id : "";
      setExpandedKeys(firstParentKey ? [firstParentKey] : []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách danh mục");
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleAdd = () => {
    setEditingCategory(null);
    setIsParentCategory(true); // Mặc định là danh mục gốc khi thêm mới
    setSelectedEmoji(undefined);
    setShowEmojiPicker(false);
    form.resetFields();
    // Đảm bảo ParentID được set về null khi thêm mới
    form.setFieldsValue({ ParentID: null });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    const isParent = !category.ParentID;
    setIsParentCategory(isParent);
    setShowEmojiPicker(false);
    form.setFieldsValue({
      Name: category.Name,
      Description: category.Description,
      ParentID: category.ParentID?._id,
      Icon: category.Icon,
      Status: category.Status || "active",
      Order: category.Order,
    });
    if (category.Icon) setSelectedEmoji(category.Icon);
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa danh mục này?",
      content:
        "Hành động này không thể hoàn tác. Tất cả danh mục con cũng sẽ bị xóa.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Lỗi khi xóa danh mục");
          }

          message.success("Xóa danh mục thành công");
          await fetchCategories();
        } catch (error) {
          console.error("Error deleting category:", error);
          message.error(
            error instanceof Error ? error.message : "Lỗi khi xóa danh mục"
          );
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Nếu không phải danh mục cha, xóa Order
      if (values.ParentID) {
        delete values.Order;
      }

      // Đảm bảo ParentID là string hoặc null
      if (values.ParentID === "") {
        values.ParentID = null;
      }

      // Thêm icon nếu có
      if (selectedEmoji) {
        values.Icon = selectedEmoji;
        console.log("Setting icon:", selectedEmoji);
      }
      console.log("Final values to save:", values);

      if (editingCategory) {
        await updateCategory(editingCategory._id, values);
        message.success("Cập nhật danh mục thành công");
      } else {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        const responseData = await response.json();
        console.log("API Response:", responseData);
        console.log("Saved category data:", responseData.data);

        if (!response.ok) {
          throw new Error(responseData.message || "Lỗi khi thêm danh mục");
        }

        if (responseData.success) {
          message.success(responseData.message || "Thêm danh mục thành công");
        } else {
          throw new Error(responseData.message || "Lỗi khi thêm danh mục");
        }
      }

      // Reset form và refresh dữ liệu
      console.log("Resetting form and refreshing data...");
      setEditingCategory(null);
      setIsParentCategory(true);
      setSelectedEmoji(undefined);
      setShowEmojiPicker(false);

      // Reset form ngay lập tức
      form.resetFields();
      form.setFieldsValue({ ParentID: null, Status: "active" });
      console.log("Form reset completed");
      console.log("Selected emoji after reset:", selectedEmoji);

      // Refresh dữ liệu
      console.log("Fetching updated categories...");
      await fetchCategories();
      console.log("Data refresh completed");
    } catch (error) {
      console.error("Error saving category:", error);
      message.error(
        error instanceof Error ? error.message : "Lỗi khi lưu danh mục"
      );
    }
  };

  const handleParentChange = (value: string | undefined) => {
    const isParent = !value;
    setIsParentCategory(isParent);

    // Nếu chuyển thành danh mục con, xóa Order
    if (!isParent) {
      form.setFieldsValue({ Order: undefined });
    }
  };

  // Build tree data for hierarchical display
  const buildTreeData = (): CategoryTreeNode[] => {
    const treeData: CategoryTreeNode[] = [];

    // Sort parent categories by Order
    const sortedParents = [...parentCategories].sort((a, b) => {
      const orderA = a.Order || 999;
      const orderB = b.Order || 999;
      return orderA - orderB;
    });

    sortedParents.forEach((parent) => {
      const children = categories.filter(
        (cat) => cat.ParentID && cat.ParentID._id === parent._id
      );

      console.log(`Parent category "${parent.Name}" icon:`, parent.Icon);

      const parentNode: CategoryTreeNode = {
        key: parent._id,
        title: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "2px 0",
            }}
          >
            <Space size="middle">
              <DragOutlined
                style={{ color: "#1890ff", cursor: "grab", fontSize: "14px" }}
              />
              <span style={{ fontSize: "18px" }}>{parent.Icon || "📁"}</span>
              <Text strong style={{ fontSize: "16px" }}>
                {parent.Name}
              </Text>
              {parent.Status === "inactive" && (
                <Tag color="red" icon={<EyeInvisibleOutlined />}>
                  Không hoạt động
                </Tag>
              )}
            </Space>
            <Space size="small">
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(parent);
                  }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="large"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleDelete(parent._id);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        ),
        category: parent,
        isParent: true,
        children: children.map((child) => ({
          key: child._id,
          title: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "2px 0",
              }}
            >
              <Space size="middle">
                <span style={{ fontSize: "16px" }}>{child.Icon || "📄"}</span>
                <Text style={{ fontSize: "15px" }}>{child.Name}</Text>
                {child.Status === "inactive" && (
                  <Tag color="red" icon={<EyeInvisibleOutlined />}>
                    Không hoạt động
                  </Tag>
                )}
              </Space>
              <Space size="small">
                <Tooltip title="Chỉnh sửa">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="large"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(child);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleDelete(child._id);
                    }}
                  />
                </Tooltip>
              </Space>
            </div>
          ),
          category: child,
          isParent: false,
        })),
      };

      treeData.push(parentNode);
    });

    return treeData;
  };

  const handleDrop = async (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    if (dragKey === dropKey) {
      return;
    }

    // Chỉ cho phép kéo thả danh mục cha
    const draggedCategory = categories.find((cat) => cat._id === dragKey);
    if (!draggedCategory || draggedCategory.ParentID) {
      message.warning("Chỉ có thể kéo thả danh mục cha");
      return;
    }

    try {
      // Lấy tất cả danh mục cha đã sắp xếp theo thứ tự hiện tại
      const allParents = categories.filter((cat) => !cat.ParentID);

      // Tìm vị trí hiện tại của item được kéo và item đích
      const draggedIndex = allParents.findIndex((cat) => cat._id === dragKey);
      const dropIndex = allParents.findIndex((cat) => cat._id === dropKey);

      if (draggedIndex === -1 || dropIndex === -1) {
        message.error("Không thể xác định vị trí kéo thả");
        return;
      }

      // Tính toán Order mới dựa trên vị trí
      let newOrder: number;

      if (dropPosition === 0) {
        // Thả vào trong node - giữ nguyên thứ tự
        newOrder = allParents[dropIndex].Order || dropIndex;
      } else if (dropPosition > 0) {
        // Thả sau node
        const currentOrder = allParents[dropIndex].Order || dropIndex;
        const nextParent = allParents[dropIndex + 1];
        const nextOrder = nextParent
          ? nextParent.Order || currentOrder + 10
          : currentOrder + 10;
        newOrder = Math.floor((currentOrder + nextOrder) / 2);
      } else {
        // Thả trước node
        const currentOrder = allParents[dropIndex].Order || dropIndex;
        const prevParent = allParents[dropIndex - 1];
        const prevOrder = prevParent
          ? prevParent.Order || currentOrder - 10
          : currentOrder - 10;
        newOrder = Math.floor((prevOrder + currentOrder) / 2);
      }

      // Cập nhật Order trong database
      await updateCategory(dragKey, { Order: newOrder });
      message.success("Cập nhật thứ tự thành công");

      // Refresh data
      await fetchCategories();
    } catch (error) {
      console.error("Error updating order:", error);
      message.error(
        error instanceof Error ? error.message : "Lỗi khi cập nhật thứ tự"
      );
    }
  };

  return (
    <div style={{ padding: "12px", background: "#ffffff", minHeight: "100vh" }}>
      <Breadcrumb title="Quản lý danh mục" showAddButton={false} />

      <Row gutter={24} style={{ marginTop: "12px" }}>
        {/* Tree Categories - Left Side */}
        <Col span={16}>
          <Card
            title={
              <Space>
                <SettingOutlined style={{ fontSize: "18px" }} />
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  Cấu trúc phân cấp danh mục
                </span>
              </Space>
            }
            loading={loading}
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "calc(100vh - 200px)",
            }}
            styles={{
              body: {
                padding: "12px",
                height: "calc(100% - 57px)",
                overflow: "hidden",
              },
            }}
          >
            <div style={{ height: "100%", overflow: "auto" }}>
              <Tree
                showLine={{ showLeafIcon: false }}
                expandedKeys={expandedKeys}
                onExpand={(keys) => {
                  // Chỉ cho phép mở 1 category tại một thời điểm
                  const newKeys = keys as string[];
                  if (newKeys.length > 1) {
                    // Nếu có nhiều hơn 1 key, chỉ giữ lại key cuối cùng được click
                    const lastKey = newKeys[newKeys.length - 1];
                    setExpandedKeys([lastKey]);
                  } else {
                    setExpandedKeys(newKeys);
                  }
                }}
                treeData={buildTreeData()}
                titleRender={(node) => node.title}
                style={{ fontSize: "16px" }}
                draggable={{
                  icon: false,
                  nodeDraggable: (node: any) =>
                    (node as CategoryTreeNode).isParent,
                }}
                onDrop={handleDrop}
                switcherIcon={(props) => {
                  const { expanded } = props;
                  return expanded ? (
                    <span style={{ fontSize: "16px", color: "#1890ff" }}>
                      −
                    </span>
                  ) : (
                    <span style={{ fontSize: "16px", color: "#666" }}>+</span>
                  );
                }}
              />
            </div>
          </Card>
        </Col>

        {/* Form Panel - Right Side */}
        <Col span={8}>
          <Card
            title={
              <Space>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </span>
              </Space>
            }
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "calc(100vh - 200px)",
            }}
            styles={{
              body: {
                padding: "16px",
                height: "calc(100% - 57px)",
                overflow: "auto",
              },
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="Name"
                label="Tên danh mục"
                rules={[
                  { required: true, message: "Vui lòng nhập tên danh mục" },
                ]}
              >
                <Input placeholder="Nhập tên danh mục" size="large" />
              </Form.Item>

              <Form.Item label="Icon">
                <div style={{ position: "relative" }} ref={emojiPickerRef}>
                  <Input
                    value={selectedEmoji}
                    placeholder="Chọn emoji hoặc paste emoji từ bên ngoài"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData("text");
                      if (pastedText && pastedText.length <= 2) {
                        setSelectedEmoji(pastedText);
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 2) {
                        setSelectedEmoji(value);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "white",
                    }}
                    disabled={false}
                    suffix={
                      <Button
                        type="text"
                        size="small"
                        disabled={false}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        {showEmojiPicker ? "✕" : "😊"}
                      </Button>
                    }
                  />
                  {showEmojiPicker && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 1000,
                        top: "100%",
                        left: 0,
                        backgroundColor: "white",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        padding: "8px",
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(6, 1fr)",
                          gap: "4px",
                        }}
                      >
                        {EMOJI_LIST.map((emoji, index) => (
                          <Button
                            key={index}
                            type="text"
                            size="small"
                            style={{
                              fontSize: "20px",
                              padding: "4px",
                              minWidth: "32px",
                              height: "32px",
                            }}
                            onClick={() => {
                              setSelectedEmoji(emoji);
                              setShowEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Form.Item>

              <Form.Item name="Description" label="Mô tả">
                <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
              </Form.Item>

              <Form.Item name="ParentID" label="Danh mục cha">
                <Select
                  placeholder="Chọn danh mục cha (để trống nếu là danh mục gốc)"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  onChange={handleParentChange}
                  size="large"
                >
                  {parentCategories.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      <Space>
                        <span>{category.Icon || "📁"}</span>
                        <span>{category.Name}</span>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {editingCategory ? (
                <Form.Item
                  name="Status"
                  label="Trạng thái"
                  initialValue="active"
                >
                  <Select size="large">
                    <Select.Option value="active">
                      <Space>
                        <EyeOutlined style={{ color: "#52c41a" }} />
                        <span>Hoạt động</span>
                      </Space>
                    </Select.Option>
                    <Select.Option value="inactive">
                      <Space>
                        <EyeInvisibleOutlined style={{ color: "#ff4d4f" }} />
                        <span>Không hoạt động</span>
                      </Space>
                    </Select.Option>
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  name="Status"
                  label="Trạng thái"
                  initialValue="active"
                >
                  <Input
                    value="Hoạt động"
                    readOnly
                    size="large"
                    style={{
                      backgroundColor: "#f6ffed",
                      borderColor: "#b7eb8f",
                      color: "#52c41a",
                    }}
                    suffix={<EyeOutlined style={{ color: "#52c41a" }} />}
                  />
                </Form.Item>
              )}

              <div style={{ marginTop: "24px" }}>
                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleModalOk}
                    style={{ flex: 1 }}
                  >
                    {editingCategory ? "Cập nhật" : "Thêm mới"}
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      setEditingCategory(null);
                      setIsParentCategory(true);
                      setSelectedEmoji(undefined);
                      setShowEmojiPicker(false);
                      form.resetFields();
                      form.setFieldsValue({ ParentID: null, Status: "active" });
                    }}
                    style={{ flex: 1 }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CategoryListPage;
