import {
  getSettings,
  Settings,
  updateSettings,
  Location,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  Slide,
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} from "@/api/services/admin/settings";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Tabs,
  Space,
  Popconfirm,
} from "antd";
import { getEmailRules, getPhoneRules } from "@/utils/validation";
import React, { useEffect, useState, useCallback } from "react";
import LocationModal from "./LocationModal";
import SlideModal from "./SlideModal";
import usePermissions from "@/hooks/usePermissions";
import "./styles.module.scss";

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const {
    canViewSettings,
    canUpdateSettings,
    canManageLocations,
    canManageSlides,
  } = usePermissions();
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationModal, setLocationModal] = useState<{
    open: boolean;
    editingIndex: number | null;
    values: Partial<Location>;
  }>({ open: false, editingIndex: null, values: {} });
  const [slides, setSlides] = useState<Slide[]>([]);
  const [slideModal, setSlideModal] = useState<{
    open: boolean;
    editingIndex: number | null;
    values: Partial<Slide>;
    errors?: { src?: string; alt?: string };
  }>({ open: false, editingIndex: null, values: {}, errors: {} });
  const [slideModalKey, setSlideModalKey] = useState<number>(0);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
      form.setFieldsValue(data);
    } catch {
      message.error("Lỗi khi tải cài đặt");
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data);
    } catch {
      message.error("Lỗi khi tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Partial<Settings>) => {
    try {
      setLoading(true);
      await updateSettings(values);
      message.success("Cập nhật cài đặt thành công");
      await fetchSettings();
    } catch {
      message.error("Lỗi khi cập nhật cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = (index: number) => {
    setLocationModal({
      open: true,
      editingIndex: index,
      values: locations[index],
    });
  };

  const handleAddLocation = () => {
    setLocationModal({
      open: true,
      editingIndex: null,
      values: {
        name: "",
        address: "",
        coordinates: "",
        mapUrl: "",
        isMainAddress: false,
      },
    });
  };

  const handleDeleteLocation = async (index: number) => {
    if (!locations[index]._id) return;
    setLoading(true);
    try {
      await deleteLocation(locations[index]._id);
      message.success("Xóa địa chỉ thành công");
      await fetchLocations();
    } catch {
      message.error("Lỗi khi xóa địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationModalOk = async () => {
    const { editingIndex, values } = locationModal;
    setLoading(true);
    try {
      if (editingIndex !== null && locations[editingIndex]._id) {
        await updateLocation(locations[editingIndex]._id, values as Location);
        message.success("Cập nhật địa chỉ thành công");
      } else {
        await createLocation(values as Location);
        message.success("Thêm địa chỉ thành công");
      }
      await fetchLocations();
      setLocationModal({ open: false, editingIndex: null, values: {} });
    } catch {
      message.error("Lỗi khi lưu địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationModalCancel = () => {
    setLocationModal({ open: false, editingIndex: null, values: {} });
  };

  const handleLocationFieldChange = (
    field: keyof Location,
    value: string | boolean
  ) => {
    setLocationModal((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  };

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await getSlides();
      setSlides(data);
    } catch {
      message.error("Lỗi khi tải danh sách slides");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlide = (index: number) => {
    setSlideModal({
      open: true,
      editingIndex: index,
      values: slides[index],
    });
  };

  const handleAddSlide = () => {
    setSlideModal({
      open: true,
      editingIndex: null,
      values: {
        src: "",
        alt: "",
        order: slides.length + 1,
        isActive: true,
      },
      errors: {},
    });
    setSlideModalKey(Date.now());
  };

  const handleDeleteSlide = async (index: number) => {
    if (!slides[index]._id) return;
    setLoading(true);
    try {
      await deleteSlide(slides[index]._id);
      message.success("Xóa slide thành công");
      await fetchSlides();
    } catch {
      message.error("Lỗi khi xóa slide");
    } finally {
      setLoading(false);
    }
  };

  const handleSlideModalOk = async () => {
    const { editingIndex, values } = slideModal;
    const nextErrors: { src?: string; alt?: string } = {};
    if (!values.src || (typeof values.src === "string" && values.src.trim() === "")) {
      nextErrors.src = "Vui lòng chọn hình ảnh slide";
    }
    if (!values.alt || (typeof values.alt === "string" && values.alt.trim() === "")) {
      nextErrors.alt = "Vui lòng nhập mô tả ảnh (Alt text)";
    }
    if (nextErrors.src || nextErrors.alt) {
      setSlideModal((prev) => ({ ...prev, errors: nextErrors }));
      return;
    }
    setLoading(true);
    try {
      if (editingIndex !== null && slides[editingIndex]._id) {
        await updateSlide(slides[editingIndex]._id, values as Slide);
        message.success("Cập nhật slide thành công");
      } else {
        await createSlide(values as Slide);
        message.success("Thêm slide thành công");
      }
      await fetchSlides();
      setSlideModal({ open: false, editingIndex: null, values: {}, errors: {} });
      setSlideModalKey(Date.now());
    } catch {
      message.error("Lỗi khi lưu slide");
    } finally {
      setLoading(false);
    }
  };

  const handleSlideModalCancel = () => {
    setSlideModal({ open: false, editingIndex: null, values: {} });
  };

  const handleSlideFieldChange = (
    field: keyof Slide,
    value: string | number | boolean
  ) => {
    setSlideModal((prev) => {
      const nextErrors = { ...(prev.errors || {}) } as { src?: string; alt?: string };
      if (field === "src") delete nextErrors.src;
      if (field === "alt") delete nextErrors.alt;
      return {
        ...prev,
        values: { ...prev.values, [field]: value },
        errors: nextErrors,
      };
    });
  };

  // Khi chuyển tab, nếu là tab 'locations' thì fetchLocations, nếu là 'slides' thì fetchSlides
  const handleTabChange = (key: string) => {
    if (key === "locations") {
      fetchLocations();
    } else if (key === "slides") {
      fetchSlides();
    }
  };

  // Tạo danh sách tabs dựa trên permissions
  const getTabItems = () => {
    const items = [];

    // Tab thông tin cơ bản - luôn hiển thị nếu có quyền view settings
    if (canViewSettings()) {
      items.push({
        key: "basic",
        label: "Thông tin cơ bản",
        children: (
          <div style={{ padding: "16px", height: "100%", overflow: "auto" }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={settings || undefined}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Form.Item
                  label="Tên công ty"
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên công ty",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên công ty" />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={getPhoneRules()}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                <Form.Item label="Email" name="email" rules={getEmailRules()}>
                  <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                  label="Giờ làm việc"
                  name="workingHours"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giờ làm việc",
                    },
                  ]}
                >
                  <Input placeholder="Ví dụ: 8:00 - 18:00 (Thứ 2 - Thứ 7)" />
                </Form.Item>
              </div>

              <Form.Item
                label="Mô tả công ty"
                name="description"
                rules={[]}
                style={{ marginTop: "16px" }}
              >
                <Input.TextArea placeholder="Nhập mô tả công ty" rows={3} />
              </Form.Item>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                <Form.Item
                  label="Zalo URL"
                  name="zaloUrl"
                  rules={[{ type: "url", message: "URL không hợp lệ" }]}
                >
                  <Input placeholder="https://zalo.me/0123456789" />
                </Form.Item>

                <Form.Item
                  label="Facebook Messenger URL"
                  name="facebookMessengerUrl"
                  rules={[{ type: "url", message: "URL không hợp lệ" }]}
                >
                  <Input placeholder="https://m.me/your-facebook-page" />
                </Form.Item>
              </div>

              {canUpdateSettings() && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Lưu thông tin cơ bản
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
        ),
      });
    }

    // Tab mạng xã hội - hiển thị nếu có quyền view settings
    if (canViewSettings()) {
      items.push({
        key: "social",
        label: "Mạng xã hội",
        children: (
          <div style={{ padding: "16px", height: "100%", overflow: "auto" }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={settings || undefined}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <Form.Item
                  label="Facebook"
                  name="facebook"
                  rules={[{ type: "url", message: "URL không hợp lệ" }]}
                >
                  <Input placeholder="https://facebook.com/your-page" />
                </Form.Item>
                <Form.Item
                  label="YouTube"
                  name="youtube"
                  rules={[{ type: "url", message: "URL không hợp lệ" }]}
                >
                  <Input placeholder="https://youtube.com/your-channel" />
                </Form.Item>
                <Form.Item
                  label="TikTok"
                  name="tiktok"
                  rules={[{ type: "url", message: "URL không hợp lệ" }]}
                >
                  <Input placeholder="https://tiktok.com/@your-account" />
                </Form.Item>
              </div>

              {canUpdateSettings() && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Lưu mạng xã hội
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
        ),
      });
    }

    // Tab địa chỉ - chỉ hiển thị nếu có quyền manage locations
    if (canManageLocations()) {
      items.push({
        key: "locations",
        label: "Địa chỉ",
        children: (
          <div style={{ padding: "16px", height: "100%", overflow: "auto" }}>
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleAddLocation}>
                Thêm địa chỉ
              </Button>
            </Space>
            <div>
              {locations && locations.length > 0 ? (
                locations.map((loc: Location, idx: number) => (
                  <Card key={idx} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <b>{loc.name}</b>{" "}
                        {loc.isMainAddress && (
                          <span style={{ color: "green" }}>
                            (Địa chỉ chính)
                          </span>
                        )}
                        <br />
                        <span>{loc.address}</span>
                        <br />
                        <span>Tọa độ: {loc.coordinates}</span>
                        <br />
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem bản đồ
                        </a>
                      </div>
                      <Space>
                        <Button onClick={() => handleEditLocation(idx)}>
                          Sửa
                        </Button>
                        <Popconfirm
                          title="Bạn có chắc muốn xóa địa chỉ này?"
                          onConfirm={() => handleDeleteLocation(idx)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button danger>Xóa</Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  </Card>
                ))
              ) : (
                <div>Chưa có địa chỉ nào.</div>
              )}
            </div>
            <LocationModal
              open={locationModal.open}
              editingIndex={locationModal.editingIndex}
              values={locationModal.values}
              onOk={handleLocationModalOk}
              onCancel={handleLocationModalCancel}
              onFieldChange={handleLocationFieldChange}
            />
          </div>
        ),
      });
    }

    // Tab slides - chỉ hiển thị nếu có quyền manage slides
    if (canManageSlides()) {
      items.push({
        key: "slides",
        label: "Slides",
        children: (
          <div style={{ padding: "16px", height: "100%", overflow: "auto" }}>
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleAddSlide}>
                Thêm slide
              </Button>
            </Space>
            <div>
              {slides && slides.length > 0 ? (
                slides.map((slide: Slide, idx: number) => (
                  <Card key={idx} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <img
                            src={slide.src}
                            alt={slide.alt}
                            style={{
                              width: "100px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <div>
                            <b>Thứ tự: {slide.order}</b>{" "}
                            {slide.isActive && (
                              <span style={{ color: "green" }}>
                                (Đang hiển thị)
                              </span>
                            )}
                            <br />
                            <span>{slide.alt}</span>
                            <br />
                            <span style={{ fontSize: "12px", color: "#666" }}>
                              {slide.src}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Space>
                        <Button onClick={() => handleEditSlide(idx)}>
                          Sửa
                        </Button>
                        <Popconfirm
                          title="Bạn có chắc muốn xóa slide này?"
                          onConfirm={() => handleDeleteSlide(idx)}
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button danger>Xóa</Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  </Card>
                ))
              ) : (
                <div>Chưa có slide nào.</div>
              )}
            </div>
            <SlideModal
              key={slideModalKey}
              open={slideModal.open}
              editingIndex={slideModal.editingIndex}
              values={slideModal.values}
              errors={slideModal.errors || {}}
              onOk={handleSlideModalOk}
              onCancel={handleSlideModalCancel}
              onFieldChange={handleSlideFieldChange}
            />
          </div>
        ),
      });
    }

    return items;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Breadcrumb title="Cài đặt hệ thống" showAddButton={false} />
      <div>
        <Card
          style={{ margin: 0, borderTop: "none" }}
          styles={{ body: { padding: 0 } }}
        >
          <Tabs
            defaultActiveKey="basic"
            type="card"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            onChange={handleTabChange}
            items={getTabItems()}
          />
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
