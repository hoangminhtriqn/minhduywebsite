import React, { useState, useEffect } from "react";
import { Card, Tabs, Form, Input, Button, message, Upload, Space } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { getSettings, updateSettings, Settings } from "@/api/services/admin/settings";

const { TabPane } = Tabs;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
      form.setFieldsValue(data);
    } catch (error) {
      message.error("Lỗi khi tải cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await updateSettings(values);
      message.success("Cập nhật cài đặt thành công");
      await fetchSettings();
    } catch (error) {
      message.error("Lỗi khi cập nhật cài đặt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 24px 0 24px" }}>
        <Breadcrumb
          items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Cài đặt hệ thống", href: "/admin/settings" },
          ]}
        />
      </div>
      
      <div style={{ flex: 1, padding: "16px 24px 24px 24px", overflow: "auto" }}>
        <Card 
          style={{ height: "100%", margin: 0 }}
          bodyStyle={{ height: "calc(100% - 57px)", overflow: "auto" }}
        >
          <Tabs defaultActiveKey="basic" type="card" style={{ height: "100%" }}>
            <TabPane tab="Thông tin cơ bản" key="basic">
              <div style={{ padding: "16px 0" }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={settings}
                  style={{ maxWidth: "800px" }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <Form.Item
                      label="Tên công ty"
                      name="companyName"
                      rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
                    >
                      <Input placeholder="Nhập tên công ty" />
                    </Form.Item>

                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" }
                      ]}
                    >
                      <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                      label="Giờ làm việc"
                      name="workingHours"
                      rules={[{ required: true, message: "Vui lòng nhập giờ làm việc" }]}
                    >
                      <Input placeholder="Ví dụ: 8:00 - 18:00 (Thứ 2 - Thứ 7)" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                  >
                    <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
                  </Form.Item>

                  <Form.Item
                    label="Logo URL"
                    name="logo"
                    rules={[{ required: true, message: "Vui lòng nhập URL logo" }]}
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
            </TabPane>

            <TabPane tab="Mạng xã hội" key="social">
              <div style={{ padding: "16px 0" }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={settings}
                  style={{ maxWidth: "800px" }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
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
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
