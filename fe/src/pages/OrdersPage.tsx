import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setOrders, setLoading, setError } from '../store/slices/orderSlice';
import { orderService } from '../api/services/order';
import { formatDateTime } from '../utils/format';

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, loading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        dispatch(setLoading(true));
        try {
          const userOrders = await orderService.getUserOrders(user._id);
          dispatch(setOrders(Array.isArray(userOrders) ? userOrders : []));
        } catch (error) {
          dispatch(setError('Có lỗi xảy ra khi tải danh sách đơn hàng'));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchOrders();
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Vui lòng đăng nhập để xem đơn hàng</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>Có lỗi xảy ra khi tải danh sách đơn hàng</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Đơn hàng #{order._id.slice(-6)}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Ngày đặt: {formatDateTime(order.Order_Date)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.Status
                  )}`}
                >
                  {getStatusText(order.Status)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Ngày lái thử</p>
                  <p className="text-gray-900">
                    {formatDateTime(order.Test_Drive_Date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ</p>
                  <p className="text-gray-900">{order.Address}</p>
                </div>
              </div>

              {order.Notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Ghi chú</p>
                  <p className="text-gray-900">{order.Notes}</p>
                </div>
              )}

              {order.ImageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Hình ảnh</p>
                  <img
                    src={order.ImageUrl}
                    alt="Order"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage; 