import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components';
import { toast } from 'react-toastify';
import { ROUTERS } from '@/utils/constant';
import { UserRole } from '@/types/enum';
import apiClient from '@/api/axios';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser, refreshPermissions } = useAuth();
  const hasProcessed = useRef(false); // Ngăn chặn multiple execution

  useEffect(() => {
    const handleAuthSuccess = async () => {
      // Ngăn chặn multiple execution
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;
      
      try {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (error) {
          let errorMessage = 'Đăng nhập Google thất bại';
          switch (error) {
            case 'auth_failed':
              errorMessage = 'Xác thực Google thất bại';
              break;
            case 'server_error':
              errorMessage = 'Lỗi server, vui lòng thử lại';
              break;
            case 'google_auth_failed':
              errorMessage = 'Đăng nhập Google bị từ chối';
              break;
            default:
              errorMessage = 'Có lỗi xảy ra trong quá trình đăng nhập';
          }
          toast.error(errorMessage);
          navigate('/login');
          return;
        }

        if (!token || !refreshToken) {
          toast.error('Thiếu thông tin xác thực');
          navigate('/login');
          return;
        }

        // Lưu tokens vào localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        // Decode user info từ token để lấy userId
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.userId;

        if (!userId) {
          toast.error('Token không hợp lệ');
          navigate('/login');
          return;
        }

        localStorage.setItem('userId', userId);

        // Fetch user info từ backend
        const response = await apiClient.get(`/users/${userId}`);
        const userData = response.data.data;
        updateUser(userData);

        // Set permissions based on role
        if (userData.Role === UserRole.EMPLOYEE) {
          await refreshPermissions();
        } else if (userData.Role === UserRole.ADMIN) {
          // Admin sẽ có tất cả permissions, xử lý trong AuthContext
        }

        toast.success('Đăng nhập Google thành công!');

        // Redirect based on user role
        if (userData.Role === UserRole.ADMIN || userData.Role === UserRole.EMPLOYEE) {
          navigate(ROUTERS.ADMIN.DASHBOARD);
        } else {
          navigate(ROUTERS.USER.HOME);
        }

      } catch (error) {
        console.error('Auth success handling error:', error);
        toast.error('Có lỗi xảy ra khi xử lý đăng nhập');
        
        // Clean up localStorage on error
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        
        navigate('/login');
      }
    };

    handleAuthSuccess();
    
    // Cleanup function
    return () => {
      hasProcessed.current = false;
    };
  }, [searchParams]); // Chỉ depend vào searchParams để tránh re-run

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <LoadingSpinner />
      <p style={{ color: '#666', fontSize: '16px' }}>
        Đang xử lý đăng nhập Google...
      </p>
    </div>
  );
};

export default AuthSuccess;