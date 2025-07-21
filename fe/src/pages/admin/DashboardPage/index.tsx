import {
  BarChartOutlined,
  CarOutlined,
  LineChartOutlined,
  ProfileOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  List,
  Row,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<any>({
    totalUsers: 0,
    bookedUsers: 0,
  });
  const [productStats, setProductStats] = useState<any>({
    totalProducts: 0,
    availableProducts: 0,
    outOfStockProducts: 0,
  });
  const [orderStats, setOrderStats] = useState<any>({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalAmount: 0,
  });
  const [topCars, setTopCars] = useState<any[]>([]);
  const [registrationsByDate, setRegistrationsByDate] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/thong-ke/dashboard");
        const data = res.data.data;
        setUserStats(data.userStats);
        setProductStats(data.productStats);
        setOrderStats(data.orderStats);
        setTopCars(data.topCars);
        setRegistrationsByDate(data.registrationsByDate);
      } catch (error) {
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Prepare data for pie chart (order status)
  const orderStatusData = [
    { type: "Chờ xác nhận", value: Number(orderStats.pendingOrders) || 0 },
    { type: "Đã duyệt", value: Number(orderStats.confirmedOrders) || 0 },
    { type: "Hoàn tất", value: Number(orderStats.completedOrders) || 0 },
    { type: "Đã hủy", value: Number(orderStats.cancelledOrders) || 0 },
  ].filter(
    (item) =>
      typeof item.value === "number" &&
      item.value > 0 &&
      typeof item.type === "string" &&
      !!item.type &&
      item.type !== "undefined" &&
      item.type !== "defined"
  );

  // Top 4 xe: Column chart
  const palette = [
    "#1890ff",
    "#52c41a",
    "#faad14",
    "#ff4d4f",
    "#13c2c2",
    "#722ed1",
  ];
  const topCarsData = (topCars || []).map((item: any, idx: number) => ({
    carName: typeof item.carName === "string" ? item.carName : "",
    count:
      typeof item.count === "number" && !isNaN(item.count) ? item.count : 0,
    colorKey: `car${idx}`,
  }));
  const columnConfig = {
    data: topCarsData,
    xField: "carName",
    yField: "count",
    colorField: "colorKey",
    color: palette,
    columnWidthRatio: 0.5,
    label: {
      position: "top",
      content: (data: any) =>
        typeof data.count === "number" && !isNaN(data.count)
          ? `${data.count}`
          : "",
      style: { fontWeight: 600, fontSize: 16, fill: "#fff" },
    },
    xAxis: {
      label: { autoHide: false, autoRotate: true, style: { fontSize: 14 } },
    },
    yAxis: { label: { style: { fontSize: 14 } } },
    tooltip: {
      showMarkers: false,
      show: false,
    },
  };

  // Lượt đăng ký: Area chart
  const areaConfig = {
    data: (registrationsByDate || []).map((item) => {
      let label = "";
      if (typeof item._id === "string" && item._id.length >= 10) {
        // _id dạng YYYY-MM-DD
        const [y, m, d] = item._id.split("-");
        label = `${d}/${m}/${y}`;
      }
      return {
        _id: label,
        shortLabel: label ? label.slice(0, 5) : "", // DD/MM
        count:
          typeof item.count === "number" && !isNaN(item.count) ? item.count : 0,
      };
    }),
    xField: "shortLabel",
    yField: "count",
    color: "#52c41a",
    areaStyle: { fillOpacity: 0.2 },
    line: { color: "#52c41a" },
    point: { size: 4, shape: "circle", style: { fill: "#52c41a" } },
    xAxis: {
      label: {
        style: { fontSize: 13 },
      },
      title: { text: "Ngày", style: { fontWeight: 600, fontSize: 14 } },
    },
    yAxis: {
      title: {
        text: "Số lượt đăng ký",
        style: { fontWeight: 600, fontSize: 14 },
      },
      label: { style: { fontSize: 13 } },
    },
    smooth: true,
    tooltip: { showMarkers: false },
  };

  // Trạng thái đơn: Bar chart (cột ngang)
  const barColors: Record<string, string> = {
    "Chờ xác nhận": "#1890ff",
    "Đã duyệt": "#52c41a",
    "Hoàn tất": "#faad14",
    "Đã hủy": "#ff4d4f",
  };
  const barConfig = {
    data: orderStatusData || [],
    xField: "value",
    yField: "type",
    color: ({ type }: any) => barColors[type] || "#1890ff",
    legend: false,
    label: false,
    xAxis: {
      title: { text: "Số lượng", style: { fontWeight: 600, fontSize: 14 } },
    },
    yAxis: {
      title: { text: "Trạng thái", style: { fontWeight: 600, fontSize: 14 } },
    },
    barStyle: { radius: [4, 4, 4, 4] },
    height: 260,
    tooltip: { showMarkers: false },
    isStack: false,
    isGroup: false,
  };

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
      <Title level={2} className={styles.dashboardTitle}>
        Dashboard
      </Title>

      <Row gutter={[24, 24]}>
        {/* Thống kê nhanh */}
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng người dùng"
              value={userStats.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Người dùng đã lái thử"
              value={userStats.bookedUsers || 0}
              prefix={<UserSwitchOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng sản phẩm"
              value={productStats.totalProducts || 0}
              prefix={<CarOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng đơn lái thử"
              value={orderStats.totalOrders || 0}
              prefix={<ProfileOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>

        {/* Chi tiết đơn hàng */}
        <Col xs={24} lg={12}>
          <Card
            title="Trạng thái đơn lái thử"
            extra={<BarChartOutlined />}
            className={styles.chartCard}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className={styles.statItem}>
                  <div className={styles.statContent}>
                    <div className={styles.statValue}>
                      {orderStats.pendingOrders || 0}
                    </div>
                    <div className={styles.statLabel}>Chờ xác nhận</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.statItem}>
                  <div className={styles.statContent}>
                    <div className={styles.statValue}>
                      {orderStats.confirmedOrders || 0}
                    </div>
                    <div className={styles.statLabel}>Đã duyệt</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.statItem}>
                  <div className={styles.statContent}>
                    <div className={styles.statValue}>
                      {orderStats.completedOrders || 0}
                    </div>
                    <div className={styles.statLabel}>Hoàn tất</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.statItem}>
                  <div className={styles.statContent}>
                    <div className={styles.statValue}>
                      {orderStats.cancelledOrders || 0}
                    </div>
                    <div className={styles.statLabel}>Đã hủy</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Top xe được lái thử */}
        <Col xs={24} lg={12}>
          <Card
            title="Top xe được lái thử nhiều nhất"
            extra={<LineChartOutlined />}
            className={styles.chartCard}
          >
            {topCars && topCars.length > 0 ? (
              <List
                size="small"
                dataSource={topCars.slice(0, 5)}
                renderItem={(item: any, index: number) => (
                  <List.Item>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${palette[index % palette.length]} 0%, ${palette[(index + 1) % palette.length]} 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </div>
                        <Text strong>{item.carName || `Xe ${index + 1}`}</Text>
                      </div>
                      <Tag color="blue" style={{ fontWeight: "600" }}>
                        {item.count || 0} lượt
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#aaa",
                  padding: "40px 20px",
                  background: "rgba(0,0,0,0.02)",
                  borderRadius: "8px",
                }}
              >
                <BarChartOutlined
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    opacity: 0.3,
                  }}
                />
                <div>Chưa có dữ liệu</div>
              </div>
            )}
          </Card>
        </Col>

        {/* Đăng ký theo ngày */}
        <Col xs={24}>
          <Card title="Đăng ký lái thử theo ngày" className={styles.chartCard}>
            {registrationsByDate && registrationsByDate.length > 0 ? (
              <List
                size="small"
                dataSource={registrationsByDate.slice(0, 10)}
                renderItem={(item: any, index: number) => (
                  <List.Item>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </div>
                        <Text strong>{item._id || "Ngày không xác định"}</Text>
                      </div>
                      <Tag color="green" style={{ fontWeight: "600" }}>
                        {item.count || 0} lượt đăng ký
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#aaa",
                  padding: "40px 20px",
                  background: "rgba(0,0,0,0.02)",
                  borderRadius: "8px",
                }}
              >
                <LineChartOutlined
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    opacity: 0.3,
                  }}
                />
                <div>Chưa có dữ liệu đăng ký</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
