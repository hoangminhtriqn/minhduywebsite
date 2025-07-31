import {
  getDashboardStats,
  BookingStats,
  UserStats,
} from "@/api/services/admin/dashboard";
import { UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Alert, Card, Col, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Breadcrumb from "@/components/admin/Breadcrumb";

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    adminCount: 0,
    userCount: 0,
  });
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getDashboardStats();
        const data = res.data.data;
        setUserStats(data.userStats);
        setBookingStats(data.bookingStats);
      } catch {
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p>Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardPage}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={<a onClick={() => window.location.reload()}>Thử lại</a>}
        />
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <Breadcrumb title="Thống kê" showAddButton={false} />

      {/* Thống kê người dùng */}
      <div style={{ marginBottom: 32 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          Thống kê người dùng
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Card className={styles.statCard} style={{ background: "#fff" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 80,
                }}
              >
                <UserOutlined
                  style={{ color: "#1890ff", fontSize: 44, marginRight: 12 }}
                />
                <span
                  style={{
                    color: "#1890ff",
                    fontWeight: 800,
                    fontSize: 44,
                    lineHeight: 1,
                  }}
                >
                  {userStats.totalUsers || 0}
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  color: "#222",
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                Tổng người dùng
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.statCard} style={{ background: "#fff" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 80,
                }}
              >
                <UserSwitchOutlined
                  style={{ color: "#fa541c", fontSize: 44, marginRight: 12 }}
                />
                <span
                  style={{
                    color: "#fa541c",
                    fontWeight: 800,
                    fontSize: 44,
                    lineHeight: 1,
                  }}
                >
                  {userStats.adminCount || 0}
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  color: "#222",
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                Quản trị viên
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.statCard} style={{ background: "#fff" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 80,
                }}
              >
                <UserOutlined
                  style={{ color: "#52c41a", fontSize: 44, marginRight: 12 }}
                />
                <span
                  style={{
                    color: "#52c41a",
                    fontWeight: 800,
                    fontSize: 44,
                    lineHeight: 1,
                  }}
                >
                  {userStats.userCount || 0}
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  color: "#222",
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                Người dùng thường
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      {/* Thống kê đơn đặt lịch */}
      <div>
        <Title level={4} style={{ marginBottom: 16 }}>
          Thống kê đơn đặt lịch
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card className={styles.statCard}>
              <table
                style={{ width: "100%", textAlign: "center", fontSize: 16 }}
              >
                <thead>
                  <tr>
                    <th>Tổng đơn</th>
                    <th>Chờ xử lý</th>
                    <th>Đã xác nhận</th>
                    <th>Đã hoàn thành</th>
                    <th>Đã hủy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{bookingStats.totalBookings || 0}</td>
                    <td>{bookingStats.pendingBookings || 0}</td>
                    <td>{bookingStats.confirmedBookings || 0}</td>
                    <td>{bookingStats.completedBookings || 0}</td>
                    <td>{bookingStats.cancelledBookings || 0}</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage;
