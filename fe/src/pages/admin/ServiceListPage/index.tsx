import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { servicesApi } from '@/api/services/admin/service';
import Breadcrumb from '@/components/admin/Breadcrumb';
import CustomPagination from '@/components/CustomPagination';
import { Service } from '@/types';

const ServiceListPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const fetchedServices = await servicesApi.getAllServices();
      setServices(fetchedServices);
      setPagination(prev => ({
        ...prev,
        total: fetchedServices.length,
      }));
    } catch {
      message.error('Không thể tải danh sách dịch vụ.');
    } finally {
      setLoading(false);
    }
  };

  // Get paginated data for display
  const getPaginatedData = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return services.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination({
      ...pagination,
      current: page,
      pageSize: newPageSize,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await servicesApi.deleteService(id);
      message.success('Xóa dịch vụ thành công!');
      fetchServices(); // Refresh the list
        } catch {
      message.error('Xóa dịch vụ thất bại.');
    }
  };

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => <img src={icon} alt="icon" style={{ width: '50px', height: '50px' }} />,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Nổi bật',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (isFeatured: boolean) => (
        <Tag color={isFeatured ? 'green' : 'red'}>
          {isFeatured ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: Service) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/admin/services/edit/${record._id}`)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa dịch vụ này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger>
            Xóa
          </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        title="Danh sách dịch vụ"
        showAddButton={true}
        onAddClick={() => navigate('/admin/services/add')}
      />
      <Table
        columns={columns}
        dataSource={getPaginatedData()}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
      
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          pageSizeOptions={["10", "20", "50", "100"]}
        />
      </div>
    </div>
  );
};

export default ServiceListPage;
