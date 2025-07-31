import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card, Switch } from 'antd';
import { servicesApi } from '@/api/services/admin/service';
import Breadcrumb from '@/components/admin/Breadcrumb';
import { Service } from '@/types';

const AddServicePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      await servicesApi.createService(values);
      message.success('Thêm dịch vụ thành công!');
      navigate('/admin/services');
    } catch {
      message.error('Thêm dịch vụ thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb title="Thêm dịch vụ mới" />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isFeatured: false }}
        >
          <Form.Item
            name="title"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon URL"
            rules={[{ required: true, message: 'Vui lòng nhập URL của icon!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isFeatured"
            label="Nổi bật"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm dịch vụ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddServicePage;
