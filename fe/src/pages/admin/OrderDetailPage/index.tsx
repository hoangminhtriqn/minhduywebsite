import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Typography, Table, Spin, message, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs'; // Using dayjs for date formatting consistency

interface ProductItem {
  _id: string;
  ProductID: { // Assuming ProductID is populated
    _id: string;
    Product_Name: string;
    Price: number; // Price at the time of order might be different, but using current product price for display if available
    // Add other product details if needed
  };
  quantity: number;
  priceAtOrder: number;
}

interface ShippingAddress {
  FullName: string;
  Address: string;
  Phone: string;
  Email?: string;
}

interface Order {
  _id: string;
  UserID: { // Assuming UserID is populated
    _id: string;
    UserName: string;
    Email: string;
    Phone?: string;
    // Add other user details if needed
  };
  items: ProductItem[];
  Order_Date: string;
  Total_Amount: number;
  Status: string;
  PaymentMethod: string;
  ShippingAddress: ShippingAddress;
  Notes?: string;
  createdAt: string;
  updatedAt: string;
}

const { Title } = Typography;

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/don-hang/${id}`);
        // Access the actual order data nested within response.data.data
        setOrder(response.data.data); 
      } catch (error) {
        message.error('Lỗi khi tải chi tiết đơn hàng');
        console.error('Error fetching order details:', error);
        setOrder(null);
      }
      setLoading(false);
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const itemColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: ['ProductID', 'Product_Name'],
      key: 'Product_Name',
      render: (text: string, record: ProductItem) => record.ProductID?.Product_Name || 'N/A'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá tại thời điểm đặt',
      dataIndex: 'priceAtOrder',
      key: 'priceAtOrder',
      render: (price: number) => `${price.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: ProductItem) => `${(record.quantity * record.priceAtOrder).toLocaleString('vi-VN')} VNĐ`,
    },
  ];

  if (loading) {
    return <Spin tip="Đang tải chi tiết đơn hàng...">
      <div className="p-6 min-h-screen"></div>
    </Spin>;
  }

  if (!order) {
    return <div className="p-6">Không tìm thấy đơn hàng.</div>;
  }

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">Chi tiết đơn hàng #{order?._id.slice(-8).toUpperCase()}</Title>

      <Card title="Thông tin đơn hàng" className="mb-6">
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Mã đơn hàng">{order._id}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">{dayjs(order.Order_Date).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{order.Status}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">{order.Total_Amount.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">{order.PaymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={3}>{order.Notes || 'Không có ghi chú'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Thông tin người dùng" className="mb-6">
         {order.UserID ? (
           <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
             <Descriptions.Item label="Tên người dùng">{order.UserID.UserName || 'N/A'}</Descriptions.Item>
             <Descriptions.Item label="Email">{order.UserID.Email || 'N/A'}</Descriptions.Item>
             <Descriptions.Item label="Số điện thoại">{order.UserID.Phone || 'N/A'}</Descriptions.Item>
             {/* Add other user details if available in UserID population */}
           </Descriptions>
         ) : (
           <p>Thông tin người dùng không khả dụng.</p>
         )}
      </Card>

      <Card title="Thông tin giao hàng" className="mb-6">
         {order.ShippingAddress ? (
           <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
             <Descriptions.Item label="Họ và tên">{order.ShippingAddress.FullName}</Descriptions.Item>
             <Descriptions.Item label="Địa chỉ">{order.ShippingAddress.Address}</Descriptions.Item>
             <Descriptions.Item label="Số điện thoại">{order.ShippingAddress.Phone}</Descriptions.Item>
             {order.ShippingAddress.Email && <Descriptions.Item label="Email">{order.ShippingAddress.Email}</Descriptions.Item>}
           </Descriptions>
         ) : (
           <p>Thông tin giao hàng không khả dụng.</p>
         )}
      </Card>

      <Card title="Sản phẩm trong đơn hàng">
        <Table
          columns={itemColumns}
          dataSource={order.items}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default OrderDetailPage; 