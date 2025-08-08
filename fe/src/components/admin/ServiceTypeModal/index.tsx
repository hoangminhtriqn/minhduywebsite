import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  createServiceType,
  deleteServiceType,
  getServiceTypes,
  ServiceType,
  updateServiceType
} from '../../../api/services/admin/serviceTypes';
import styles from './styles.module.scss';

interface ServiceTypeModalProps {
  visible: boolean;
  onClose: () => void;
}

const ServiceTypeModal: React.FC<ServiceTypeModalProps> = ({ visible, onClose }) => {
  const { message } = App.useApp();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchServiceTypes();
    }
  }, [visible]);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const response = await getServiceTypes({ page: 1, limit: 100 });
      setServiceTypes(response.data.data.serviceTypes);
    } catch (error) {
      message.error(`Lỗi khi tải danh sách loại dịch vụ: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ServiceType) => {
    try {
      if (editingId) {
        await updateServiceType(editingId, values);
        message.success('Cập nhật loại dịch vụ thành công');
      } else {
        await createServiceType(values);
        message.success('Thêm loại dịch vụ thành công');
      }
      form.resetFields();
      setEditingId(null);
      setIsModalVisible(false);
      fetchServiceTypes();
    } catch (error) {
      message.error(`Có lỗi xảy ra: ${error}`);
    }
  };

  const handleEdit = (record: ServiceType) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceType(id);
      message.success('Xóa loại dịch vụ thành công');
      fetchServiceTypes();
    } catch (error) {
      message.error(`Lỗi khi xóa loại dịch vụ: ${error}`);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên loại dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, record: ServiceType) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý loại dịch vụ"
        open={visible}
        onCancel={onClose}
        width={900}
        footer={null}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm loại dịch vụ
            </Button>
          </div>
          
          <Table
            columns={columns}
            dataSource={serviceTypes}
            rowKey="_id"
            loading={loading}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Modal>

      <Modal
        title={editingId ? 'Sửa loại dịch vụ' : 'Thêm loại dịch vụ'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingId(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingId ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên loại dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại dịch vụ' }]}
          >
            <Input placeholder="Nhập tên loại dịch vụ" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceTypeModal; 