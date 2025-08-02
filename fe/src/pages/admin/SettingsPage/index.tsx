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
import React, { useEffect, useState } from "react";
import LocationModal from "./LocationModal";
import SlideModal from "./SlideModal";
import "./styles.module.scss";

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
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
  }>({ open: false, editingIndex: null, values: {} });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
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
  };

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
    });
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
      setSlideModal({ open: false, editingIndex: null, values: {} });
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
    setSlideModal((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  };

  // Khi chuyển tab, nếu là tab 'locations' thì fetchLocations, nếu là 'slides' thì fetchSlides
  const handleTabChange = (key: string) => {
    if (key === "locations") {
      fetchLocations();
    } else if (key === "slides") {
      fetchSlides();
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Breadcrumb title="Cài đặt hệ thống" showAddButton={false} />
      <div style={{ padding: "16px 24px 0 24px" }}>
      </div>

      <div style={{ flex: 1, padding: "0", overflow: "hidden" }}>
        <Card
          style={{ height: "100%", margin: 0, borderRadius: 0 }}
          styles={{ body: { height: "calc(100% - 57px)", overflow: "hidden", padding: 0 } }}
        >
          <Tabs
            defaultActiveKey="basic"
            type="card"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
            onChange={handleTabChange}
            items={[
              {
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
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số điện thoại",
                            },
                          ]}
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
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                          ]}
                        >
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
                        <Input.TextArea
                          placeholder="Nhập mô tả công ty"
                          rows={3}
                        />
                      </Form.Item>

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
                    </Form>
                  </div>
                ),
              },
              {
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
                    </Form>
                  </div>
                ),
              },
              {
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
                                  <Button danger>
                                  Xóa
                                </Button>
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
              },
              {
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
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                  <img 
                                    src={slide.src} 
                                    alt={slide.alt}
                                    style={{ 
                                      width: "100px", 
                                      height: "60px", 
                                      objectFit: "cover",
                                      borderRadius: "4px"
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
                                  <Button danger>
                                  Xóa
                                </Button>
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
                      open={slideModal.open}
                      editingIndex={slideModal.editingIndex}
                      values={slideModal.values}
                      onOk={handleSlideModalOk}
                      onCancel={handleSlideModalCancel}
                      onFieldChange={handleSlideFieldChange}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
