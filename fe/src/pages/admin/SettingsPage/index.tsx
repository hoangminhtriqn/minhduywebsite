import {
  getSettings,
  Settings,
  updateSettings,
  Location,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
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
  Switch,
  Space,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";

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

  // Khi chuyển tab, nếu là tab 'locations' thì fetchLocations
  const handleTabChange = (key: string) => {
    if (key === "locations") {
      fetchLocations();
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 24px 0 24px" }}>
        <Breadcrumb title="Cài đặt hệ thống" showAddButton={false} />
      </div>

      <div
        style={{ flex: 1, padding: "16px 24px 24px 24px", overflow: "auto" }}
      >
        <Card
          style={{ height: "100%", margin: 0 }}
          styles={{ body: { height: "calc(100% - 57px)", overflow: "auto" } }}
        >
          <Tabs
            defaultActiveKey="basic"
            type="card"
            style={{ height: "100%" }}
            onChange={handleTabChange}
            items={[
              {
                key: "basic",
                label: "Thông tin cơ bản",
                children: (
                  <div style={{ padding: "16px 0" }}>
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      initialValues={settings || undefined}
                      style={{ maxWidth: "800px" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "24px",
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
                          gap: "24px",
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
                        label="Logo URL"
                        name="logo"
                        rules={[
                          { required: true, message: "Vui lòng nhập URL logo" },
                        ]}
                      >
                        <Input placeholder="Nhập URL logo" />
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
                  <div style={{ padding: "16px 0" }}>
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      initialValues={settings || undefined}
                      style={{ maxWidth: "800px" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "24px",
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
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "24px",
                        }}
                      >
                        <Form.Item
                          label="Instagram"
                          name="instagram"
                          rules={[{ type: "url", message: "URL không hợp lệ" }]}
                        >
                          <Input placeholder="https://instagram.com/your-account" />
                        </Form.Item>

                        <Form.Item
                          label="Twitter"
                          name="twitter"
                          rules={[{ type: "url", message: "URL không hợp lệ" }]}
                        >
                          <Input placeholder="https://twitter.com/your-account" />
                        </Form.Item>
                      </div>

                      <Form.Item
                        label="LinkedIn"
                        name="linkedin"
                        rules={[{ type: "url", message: "URL không hợp lệ" }]}
                      >
                        <Input placeholder="https://linkedin.com/company/your-company" />
                      </Form.Item>

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
                  <div style={{ padding: "16px 0" }}>
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
                                <Button
                                  danger
                                  onClick={() => handleDeleteLocation(idx)}
                                >
                                  Xóa
                                </Button>
                              </Space>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div>Chưa có địa chỉ nào.</div>
                      )}
                    </div>
                    <Modal
                      title={
                        locationModal.editingIndex !== null
                          ? "Sửa địa chỉ"
                          : "Thêm địa chỉ"
                      }
                      open={locationModal.open}
                      onOk={handleLocationModalOk}
                      onCancel={handleLocationModalCancel}
                      okText="Thêm"
                      cancelText="Hủy"
                    >
                      <Form layout="vertical">
                        <Form.Item label="Tên chi nhánh">
                          <Input
                            value={locationModal.values.name}
                            onChange={(e) =>
                              handleLocationFieldChange("name", e.target.value)
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Địa chỉ">
                          <Input
                            value={locationModal.values.address}
                            onChange={(e) =>
                              handleLocationFieldChange(
                                "address",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Tọa độ">
                          <Input
                            value={locationModal.values.coordinates}
                            onChange={(e) =>
                              handleLocationFieldChange(
                                "coordinates",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Link bản đồ">
                          <Input
                            value={locationModal.values.mapUrl}
                            onChange={(e) =>
                              handleLocationFieldChange(
                                "mapUrl",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Địa chỉ chính">
                          <Switch
                            checked={locationModal.values.isMainAddress}
                            onChange={(v) =>
                              handleLocationFieldChange("isMainAddress", v)
                            }
                          />
                        </Form.Item>
                      </Form>
                    </Modal>
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
