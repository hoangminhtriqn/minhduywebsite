import { categoryService } from "@/api/services/admin/categories";
import Breadcrumb from "@/components/admin/Breadcrumb";
import {
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Tree,
  Typography,
} from "antd";
import styles from "./styles.module.scss";

import usePermissions from "@/hooks/usePermissions";
import React, { useEffect, useRef, useState } from "react";

const { Text } = Typography;
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

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(
    undefined
  );
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  // Permissions
  const {
    hasPermission,
    canCreateCategories,
    canEditCategories,
    canDeleteCategories,
  } = usePermissions();
  const canReorderCategories = hasPermission("categories.reorder");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();

      const allCategories = response.categories || [];
      const hierarchicalCategories = response.hierarchicalCategories || [];

      setCategories(allCategories);

      // Use hierarchical categories for better tree display
      if (hierarchicalCategories.length > 0) {
        // Extract parent categories from hierarchical structure
        const parents = hierarchicalCategories.map((parent: Category) => ({
          _id: parent._id,
          Name: parent.Name,
          Description: parent.Description,
          Icon: parent.Icon,
          Status: parent.Status,
          Order: parent.Order,
          createdAt: parent.createdAt,
          updatedAt: parent.updatedAt,
        }));
        setParentCategories(parents);
      } else {
        // Fallback to filtering flat categories
        const parents = allCategories.filter((cat: Category) => !cat.ParentID);
        setParentCategories(parents);
      }
    } catch {
      // Error toast is handled globally by axios interceptor
    } finally {
      setLoading(false);
    }
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
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
          await categoryService.deleteCategory(id);
          message.success("Xóa danh mục thành công");
          await fetchCategories();
        } catch {
          // Error toast is handled globally by axios interceptor
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
      }

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, values);
        message.success("Cập nhật danh mục thành công");
      } else {
        await categoryService.createCategory(values);
        message.success("Thêm danh mục thành công");
      }

      // Reset form và refresh dữ liệu
      setEditingCategory(null);
      setSelectedEmoji(undefined);
      setShowEmojiPicker(false);

      // Reset form ngay lập tức
      form.resetFields();
      form.setFieldsValue({ ParentID: null, Status: "active" });

      // Refresh dữ liệu
      await fetchCategories();
    } catch {
      // Error toast is handled globally by axios interceptor
    }
  };

  const handleParentChange = (value: string | undefined) => {
    // Nếu chuyển thành danh mục con, xóa Order
    if (value) {
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
              {canEditCategories() && (
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
              )}
              {canDeleteCategories() && (
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
              )}
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
                {canEditCategories() && (
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
                )}
                {canDeleteCategories() && (
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
                )}
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

  const handleDrop = async (info: {
    node: { key: string; pos: string };
    dragNode: { key: string };
    dropPosition: number;
  }) => {
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
      await categoryService.updateCategory(dragKey, { Order: newOrder });
      message.success("Cập nhật thứ tự thành công");

      // Refresh data
      await fetchCategories();
    } catch {
      // Error toast is handled globally by axios interceptor
    }
  };

  return (
    <div>
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
                draggable={
                  canReorderCategories
                    ? {
                        icon: false,
                        nodeDraggable: (node) =>
                          (node as CategoryTreeNode).isParent,
                      }
                    : false
                }
                onDrop={canReorderCategories ? handleDrop : undefined}
                switcherIcon={(props: { expanded?: boolean }) => {
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
          {((editingCategory && canEditCategories()) ||
            (!editingCategory && canCreateCategories())) && (
            <Card
              title={
                <Space>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {editingCategory
                      ? "Chỉnh sửa danh mục"
                      : "Thêm danh mục mới"}
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
              <Form form={form} layout="vertical" scrollToFirstError>
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
                  <div className={styles.emojiField} ref={emojiPickerRef}>
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
                      className={styles.emojiInput}
                      disabled={false}
                      suffix={
                        <Button
                          type="text"
                          size="small"
                          disabled={false}
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={styles.emojiSuffixBtn}
                        >
                          {showEmojiPicker ? "✕" : "😊"}
                        </Button>
                      }
                    />
                    {showEmojiPicker && (
                      <div className={styles.emojiPicker}>
                        <div className={styles.emojiGrid}>
                          {EMOJI_LIST.map((emoji, index) => (
                            <Button
                              key={index}
                              type="text"
                              size="small"
                              className={styles.emojiBtn}
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
                  <Popover
                    trigger="click"
                    placement="right"
                    content={
                      <div className={styles.moreLinksContent}>
                        <ul className={styles.moreLinksList}>
                          <li className={styles.moreLinkItem}>
                            <a
                              href="https://getemoji.com/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              getemoji.com
                            </a>
                          </li>
                          <li className={styles.moreLinkItem}>
                            <a
                              href="https://emojicopy.com/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              emojicopy.com
                            </a>
                          </li>
                        </ul>
                      </div>
                    }
                  >
                    <span className={styles.moreLinksTrigger}>
                      Xem thêm <InfoCircleOutlined />
                    </span>
                  </Popover>
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
                    <Select size="large" optionLabelProp="label">
                      <Select.Option value="active" label="Hoạt động">
                        <Space>
                          <EyeOutlined style={{ color: "#52c41a" }} />
                          <span>Hoạt động</span>
                        </Space>
                      </Select.Option>
                      <Select.Option value="inactive" label="Không hoạt động">
                        <Space>
                          <EyeInvisibleOutlined style={{ color: "#ff4d4f" }} />
                          <span>Không hoạt động</span>
                        </Space>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                ) : (
                  <>
                    <Form.Item name="Status" initialValue="active" hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item label="Trạng thái">
                      <Tag
                        color="#f6ffed"
                        style={{ color: "#52c41a", borderColor: "#b7eb8f" }}
                      >
                        <Space>
                          <EyeOutlined style={{ color: "#52c41a" }} />
                          <span>Hoạt động</span>
                        </Space>
                      </Tag>
                    </Form.Item>
                  </>
                )}

                <div style={{ marginTop: "24px" }}>
                  <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                    {((editingCategory && canEditCategories()) ||
                      (!editingCategory && canCreateCategories())) && (
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleModalOk}
                        style={{ flex: 1 }}
                      >
                        {editingCategory ? "Cập nhật" : "Thêm mới"}
                      </Button>
                    )}
                    <Button
                      size="large"
                      onClick={() => {
                        setEditingCategory(null);
                        setSelectedEmoji(undefined);
                        setShowEmojiPicker(false);
                        form.resetFields();
                        form.setFieldsValue({
                          ParentID: null,
                          Status: "active",
                        });
                      }}
                      style={{ flex: 1 }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CategoryListPage;
