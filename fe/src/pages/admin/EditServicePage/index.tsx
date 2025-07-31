import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, message, Card, Spin, Switch } from 'antd';
import { servicesApi } from '@/api/services/admin/service';
import Breadcrumb from '@/components/admin/Breadcrumb';
import { Service } from '@/types';

const EditServicePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (id) {
        setLoading(true);
        try {
          const fetchedService = await servicesApi.getServiceById(id);
          setService(fetchedService);
          form.setFieldsValue(fetchedService);
        } catch (error) {
          message.error('Không thể tải thông tin dịch vụ.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchService();
  }, [id, form]);

  const onFinish = async (values: Partial<Service>) => {
    if (id) {
      setLoading(true);
      try {
        await servicesApi.updateService(id, values);
        message.success('Cập nhật dịch vụ thành công!');
        navigate('/admin/services');
      } catch (error) {
        message.error('Cập nhật dịch vụ thất bại.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !service) {
    return <Spin tip="Đang tải..." />;
  }

  return (
    <div>
      <Breadcrumb title="Chỉnh sửa dịch vụ" />
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={service || {}}
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
              Cập nhật dịch vụ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditServicePage;
