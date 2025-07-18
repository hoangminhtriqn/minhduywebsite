import {
  BgColorsOutlined,
  CheckOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  ColorPicker,
  Divider,
  Drawer,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const { Text, Paragraph } = Typography;

interface ThemeControllerProps {
  className?: string;
}

const ThemeController: React.FC<ThemeControllerProps> = ({ className }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [customColor, setCustomColor] = useState("#059669");
  const { theme, updatePrimaryColor, resetTheme } = useTheme();

  // Sync customColor with current theme when component mounts
  useEffect(() => {
    setCustomColor(theme.colors.palette.primary);
  }, [theme.colors.palette.primary]);

  const handleCustomColorChange = (color: any) => {
    const hexColor = typeof color === "string" ? color : color.toHexString();
    setCustomColor(hexColor);
    updatePrimaryColor(hexColor);
  };

  const handleResetTheme = () => {
    resetTheme();
    setCustomColor("#059669");
  };

  const presetColors = [
    "#059669", // SiVi Green (Default)
    "#0066b1", // BMW Blue
    "#dc2626", // Sport Red
    "#8b5a2b", // Luxury Brown
    "#6366f1", // Elegant Purple
    "#2c5aa0", // Classic Blue
    "#ea580c", // Orange
    "#7c3aed", // Violet
    "#0891b2", // Cyan
    "#be185d", // Pink
  ];

  return (
    <>
      <Tooltip title="Cài Đặt Giao Diện">
        <Button
          type="primary"
          shape="circle"
          icon={<SettingOutlined />}
          onClick={() => setDrawerVisible(true)}
          className={className}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            width: "50px",
            height: "50px",
            fontSize: "18px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            backgroundColor: theme.colors.palette.primary,
            borderColor: theme.colors.palette.primary,
          }}
        />
      </Tooltip>

      <Drawer
        title={
          <Space>
            <BgColorsOutlined style={{ color: theme.colors.palette.primary }} />
            <span>Tùy Chỉnh Giao Diện</span>
          </Space>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        closable={false}
        styles={{
          header: {
            backgroundColor: theme.colors.background.primary,
            borderBottom: `1px solid ${theme.colors.surface.borderLight}`,
          },
          body: {
            backgroundColor: theme.colors.background.primary,
          },
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Current Theme Info */}

          <Divider style={{ color: theme.colors.text.secondary }}>
            Màu Tùy Chỉnh
          </Divider>

          {/* Custom Color Picker */}
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Paragraph
                type="secondary"
                style={{
                  fontSize: "12px",
                  margin: "4px 0",
                  color: theme.colors.text.secondary,
                }}
              >
                Chọn bất kỳ màu nào để tạo giao diện cá nhân hóa
              </Paragraph>
            </div>

            <ColorPicker
              value={customColor}
              onChange={handleCustomColorChange}
              showText
              size="large"
              presets={[
                {
                  label: "Màu Có Sẵn",
                  colors: presetColors,
                },
              ]}
              style={{ width: "100%" }}
            />

            {/* Preset Color Grid */}
            <div>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  color: theme.colors.text.secondary,
                }}
              >
                Màu Nhanh:
              </Text>
              <div
                style={{
                  marginTop: "8px",
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "8px",
                }}
              >
                {presetColors.map((color, index) => (
                  <Tooltip key={index} title={`Đặt màu chính thành ${color}`}>
                    <div
                      onClick={() => handleCustomColorChange(color)}
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: color,
                        borderRadius: "6px",
                        cursor: "pointer",
                        border:
                          customColor === color
                            ? `3px solid ${theme.colors.palette.primary}`
                            : `2px solid ${theme.colors.surface.borderLight}`,
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {customColor === color && (
                        <CheckOutlined
                          style={{ color: "#fff", fontSize: "14px" }}
                        />
                      )}
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </Space>

          <Divider style={{ color: theme.colors.text.secondary }}>
            Xem Trước Giao Diện
          </Divider>

          {/* Theme Preview */}
          <Card
            size="small"
            styles={{
              body: {
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.surface.borderLight}`,
              },
            }}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div
                style={{
                  padding: "12px",
                  background: theme.colors.palette.primary,
                  color: theme.colors.text.white,
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                Màu Chính
              </div>
              <Row gutter={8}>
                <Col span={12}>
                  <div
                    style={{
                      padding: "8px",
                      background: theme.colors.palette.secondary,
                      color: theme.colors.text.white,
                      borderRadius: "4px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    Màu Phụ
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      padding: "8px",
                      background: theme.colors.palette.accent,
                      color: theme.colors.text.white,
                      borderRadius: "4px",
                      textAlign: "center",
                      fontSize: "12px",
                    }}
                  >
                    Màu Nhấn
                  </div>
                </Col>
              </Row>
            </Space>
          </Card>

          <Divider style={{ color: theme.colors.text.secondary }} />

          {/* Reset Button */}
          <Button
            icon={<ReloadOutlined />}
            onClick={handleResetTheme}
            block
            size="large"
            style={{
              marginTop: "16px",
              backgroundColor: theme.colors.palette.primary,
              borderColor: theme.colors.palette.primary,
              color: theme.colors.text.white,
            }}
          >
            Khôi Phục Giao Diện Mặc Định
          </Button>

          {/* Theme Info */}
          <Card
            size="small"
            styles={{
              body: {
                backgroundColor: theme.colors.background.light,
                border: `1px solid ${theme.colors.surface.borderLight}`,
              },
            }}
          >
            <Text
              style={{
                fontSize: "11px",
                color: theme.colors.text.secondary,
              }}
            >
              💡 <strong>Mẹo:</strong> Cài đặt giao diện của bạn sẽ được lưu và
              tự động áp dụng khi bạn quay lại trang web.
            </Text>
          </Card>
        </Space>
      </Drawer>
    </>
  );
};

export default ThemeController;
