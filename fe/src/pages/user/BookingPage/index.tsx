import React from "react";
import useScrollToTop from "@/hooks/useScrollToTop";
import { message, DatePicker, Form, Input, Select, Button, Modal } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  FormOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import PageBanner from "@/components/PageBanner";
import styles from "./styles.module.scss";

const BookingPage = () => {
  // Use scroll to top hook
  useScrollToTop();

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Inject compact form styles when modal opens
  useEffect(() => {
    if (isModalVisible) {
      const style = document.createElement("style");
      style.id = "booking-modal-styles";
      style.textContent = `
        .ant-modal-content .ant-form-item {
          margin-bottom: 2px !important;
          margin: 2px 0 !important;
          padding: 0 !important;
        }
        .ant-modal-content .ant-form-item-label {
          padding-bottom: 1px !important;
          padding: 0 0 1px 0 !important;
        }
        .ant-modal-content .css-dev-only-do-not-override-r6geos.ant-form-item {
          margin-bottom: 2px !important;
          margin: 2px 0 !important;
          padding: 0 !important;
        }
        .ant-modal-content .css-dev-only-do-not-override-r6geos.ant-form-item-label {
          padding-bottom: 1px !important;
          padding: 0 0 1px 0 !important;
        }
        
        @media (min-width: 600px) and (max-width: 1024px) {
          .ant-modal-content .ant-form-item {
            margin-bottom: 16px !important;
            margin: 16px 0 !important;
            padding: 0 !important;
          }
          .ant-modal-content .ant-form-item-label {
            padding-bottom: 8px !important;
            padding: 0 0 8px 0 !important;
          }
          .ant-modal-content .css-dev-only-do-not-override-r6geos.ant-form-item {
            margin-bottom: 16px !important;
            margin: 16px 0 !important;
            padding: 0 !important;
          }
          .ant-modal-content .css-dev-only-do-not-override-r6geos.ant-form-item-label {
            padding-bottom: 8px !important;
            padding: 0 0 8px 0 !important;
          }
        }
      `;
      document.head.appendChild(style);

      return () => {
        const existingStyle = document.getElementById("booking-modal-styles");
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [isModalVisible]);

  // Form validation rules
  const formRules = {
    FullName: [{ required: true, message: "Vui lòng nhập họ và tên" }],
    Email: [
      { required: true, message: "Vui lòng nhập email" },
      { type: "email" as const, message: "Email không hợp lệ" },
    ],
    Phone: [
      { required: true, message: "Vui lòng nhập số điện thoại" },
      {
        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
        message: "Số điện thoại không hợp lệ",
      },
    ],
    Address: [{ required: true, message: "Vui lòng nhập địa chỉ" }],
    CarModel: [{ required: true, message: "Vui lòng chọn dịch vụ" }],
    TestDriveDate: [{ required: true, message: "Vui lòng chọn ngày đặt lịch" }],
    TestDriveTime: [{ required: true, message: "Vui lòng chọn thời gian" }],
  };

  // Timeline steps data
  const timelineSteps = [
    {
      number: 1,
      icon: FormOutlined,
      title: "Điền thông tin tại form đặt lịch",
      description:
        "Vui lòng điền thông tin tại form để chúng tôi có thể liên hệ và tư vấn cho bạn.",
    },
    {
      number: 2,
      icon: CheckCircleOutlined,
      title: "Xác nhận lịch trực tuyến",
      description:
        "Chúng tôi sẽ xác nhận lịch trực tuyến và liên hệ với bạn để tư vấn và hỗ trợ bạn cũng như lên lịch hẹn.",
    },
    {
      number: 3,
      icon: ToolOutlined,
      title: "Xử lý lịch trực tuyến",
      description:
        "Chúng tôi sẽ xử lý lịch trực tuyến và đến địa điểm để thực hiện dịch vụ. Hoặc cung cấp lịch cụ thể về thời gian để bạn có thể ghé công ty mà không cần chờ đợi.",
    },
    {
      number: 4,
      icon: SafetyCertificateOutlined,
      title: "Bảo hành và chính sách trực tuyến",
      description:
        "Đặt lịch trực tuyến cắt giảm thời gian chờ đợi và đảm bảo quyền lợi cho khách hàng ngay cả khi không cần đến trực tiếp.",
    },
  ];

  const handleSubmit = async (values: {
    FullName: string;
    Email: string;
    Phone: string;
    Address: string;
    CarModel: string;
    TestDriveDate: dayjs.Dayjs;
    TestDriveTime: string;
    Notes?: string;
  }) => {
    setSubmitting(true);
    try {
      // Validate date is not in the past
      if (
        values.TestDriveDate &&
        values.TestDriveDate.isBefore(dayjs(), "day")
      ) {
        message.error("Ngày đặt lịch không được trong quá khứ.");
        setSubmitting(false);
        return;
      }

      message.success("Đăng ký đặt lịch thành công!");

      // Reset form after successful submission
      form.resetFields();

      // Close modal if it's open
      if (isModalVisible) {
        setIsModalVisible(false);
      }
    } catch {
      message.error("Đã có lỗi xảy ra khi đăng ký lái thử. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const BookingForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.testDriveForm__form}
    >
      <Form.Item label="Họ và tên" name="FullName" rules={formRules.FullName}>
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item label="Email" name="Email" rules={formRules.Email}>
        <Input placeholder="Nhập địa chỉ email" />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="Phone" rules={formRules.Phone}>
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="Address" rules={formRules.Address}>
        <Input placeholder="Nhập địa chỉ cụ thể (tỉnh/thành phố, quận/huyện, ...)" />
      </Form.Item>

      <Form.Item
        label="Dịch vụ quan tâm"
        name="CarModel"
        rules={formRules.CarModel}
      >
        <Select placeholder="Chọn dịch vụ">
          <Select.Option value="Sửa chữa">Sửa chữa</Select.Option>
          <Select.Option value="Lắp đặt">Lắp đặt</Select.Option>
          <Select.Option value="Thi công">Thi công</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Ngày đặt lịch"
        name="TestDriveDate"
        rules={formRules.TestDriveDate}
      >
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Chọn ngày đặt lịch"
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
        />
      </Form.Item>

      <Form.Item
        label="Thời gian đặt lịch"
        name="TestDriveTime"
        rules={formRules.TestDriveTime}
      >
        <Select placeholder="Chọn thời gian">
          <Select.Option value="08:00">Sáng (8:00)</Select.Option>
          <Select.Option value="09:00">Sáng (9:00)</Select.Option>
          <Select.Option value="10:00">Sáng (10:00)</Select.Option>
          <Select.Option value="11:00">Sáng (11:00)</Select.Option>
          <Select.Option value="13:00">Chiều (13:00)</Select.Option>
          <Select.Option value="14:00">Chiều (14:00)</Select.Option>
          <Select.Option value="15:00">Chiều (15:00)</Select.Option>
          <Select.Option value="16:00">Chiều (16:00)</Select.Option>
          <Select.Option value="17:00">Chiều (17:00)</Select.Option>
          <Select.Option value="18:00">Tối (18:00)</Select.Option>
          <Select.Option value="19:00">Tối (19:00)</Select.Option>
          <Select.Option value="20:00">Tối (20:00)</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Ghi chú" name="Notes">
        <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          size="large"
          style={{
            width: "100%",
            height: "48px",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {submitting ? "Đang gửi..." : "Đăng ký lịch"}
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className={styles.testDrivePage}>
      {/* Page Banner */}
      <PageBanner
        title="ĐẶT HẸN TƯ VẤN KỸ THUẬT"
        subtitle="Đăng ký hẹn lịch sữa chữa, lắp đặt và thi công để nhận được dịch vụ nhanh chóng và chất lượng."
      />

      {/* Mobile/Tablet Booking Button */}
      <div className={styles.mobileBookingButton}>
        <Button
          type="primary"
          size="large"
          icon={<CalendarOutlined />}
          onClick={showModal}
          className={styles.mobileBookingButton__btn}
        >
          Đặt lịch ngay
        </Button>
      </div>

      {/* Test Drive Form Section */}
      <section className={styles.testDriveSection}>
        <div className={styles.testDriveSection__container}>
          <div className={styles.testDriveSection__row}>
            <div className={styles.testDriveSection__col}>
              <div className={styles.testDriveInfo}>
                <div className={styles.testDriveInfo__benefitsHeader}>
                  <h3 className={styles.testDriveInfo__benefitsTitle}>
                    Quy trình đặt lịch trực tuyến
                  </h3>
                  <p className={styles.testDriveInfo__benefitsSubtitle}>
                    Giúp nhận được tư vấn dịch vụ nhanh chóng và đảm bảo đúng
                    nhu cầu tránh phải chờ đợi và không phải trực tiếp đến công
                    ty.
                  </p>
                </div>

                <div className={styles.testDriveInfo__benefits}>
                  {timelineSteps.map((step) => {
                    const IconComponent = step.icon;
                    return (
                      <div
                        key={step.number}
                        className={styles.testDriveInfo__benefitItem}
                      >
                        <div className={styles.testDriveInfo__benefitNumber}>
                          {step.number}
                        </div>
                        <div className={styles.testDriveInfo__benefitIcon}>
                          <IconComponent />
                        </div>
                        <div className={styles.testDriveInfo__benefitContent}>
                          <h3 className={styles.testDriveInfo__benefitTitle}>
                            {step.title}
                          </h3>
                          <p
                            className={styles.testDriveInfo__benefitDescription}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.testDriveSection__col}>
              <div className={styles.testDriveForm}>
                <h3 className={styles.testDriveForm__title}>
                  ĐĂNG KÝ ĐẶT LỊCH
                </h3>
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Mobile/Tablet */}
      <Modal
        title="ĐĂNG KÝ ĐẶT LỊCH"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        style={{ top: 60 }}
        className={styles.bookingModal}
        wrapClassName={styles.bookingModalWrap}
        getContainer={() => document.body}
      >
        <BookingForm />
      </Modal>
    </div>
  );
};

export default BookingPage;
