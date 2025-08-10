import React from "react";
import useScrollToTop from "@/hooks/useScrollToTop";
import {
  message,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Typography,
} from "antd";
import {
  getEmailRules,
  getPhoneRules,
  getFullNameRules,
  getAddressRules,
  getNotesRules,
} from "@/utils/validation";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { createBooking } from "@/api/services/user/booking";
import {
  getActiveServiceTypes,
  ServiceType,
} from "@/api/services/user/serviceTypes";

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
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState(false);

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

  // Fetch service types on component mount
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setLoadingServiceTypes(true);
        const response = await getActiveServiceTypes();
        setServiceTypes(response.data);
      } catch (error) {
        console.error("Error fetching service types:", error);
        message.error("Lỗi khi tải danh sách dịch vụ");
      } finally {
        setLoadingServiceTypes(false);
      }
    };

    fetchServiceTypes();
  }, []);

  // Form validation rules (shared helpers)
  const formRules = {
    FullName: getFullNameRules(),
    Email: getEmailRules(),
    Phone: getPhoneRules(),
    Address: getAddressRules(),
    ServiceTypes: [{ required: true, message: "Vui lòng chọn dịch vụ" }],
    BookingDate: [{ required: true, message: "Vui lòng chọn ngày đặt lịch" }],
    BookingTime: [{ required: true, message: "Vui lòng chọn thời gian" }],
    Notes: getNotesRules(),
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
    ServiceTypes: string; // ServiceType _id
    BookingDate: dayjs.Dayjs;
    BookingTime: string;
    Notes?: string;
  }) => {
    setSubmitting(true);
    try {
      // Validate date is not in the past
      if (values.BookingDate && values.BookingDate.isBefore(dayjs(), "day")) {
        message.error("Ngày đặt lịch không được trong quá khứ.");
        setSubmitting(false);
        return;
      }

      // Sanitize before submit (avoid trimming while typing)
      const sanitizedFullName = values.FullName?.trim();
      const sanitizedAddress = values.Address?.trim();
      const sanitizedNotes = values.Notes?.trim();

      // Call API to create booking
      await createBooking({
        FullName: sanitizedFullName,
        Email: values.Email?.trim(),
        Phone: values.Phone?.trim(),
        Address: sanitizedAddress,
        ServiceTypes: values.ServiceTypes,
        BookingDate: values.BookingDate.toISOString(),
        BookingTime: values.BookingTime,
        Notes: sanitizedNotes,
      });

      message.success("Đăng ký đặt lịch thành công!");

      // Reset form after successful submission
      form.resetFields();

      // Close modal if it's open
      if (isModalVisible) {
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      message.error("Đã có lỗi xảy ra khi đăng ký đặt lịch. Vui lòng thử lại.");
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
        <Input placeholder="Nhập họ và tên" maxLength={64} />
      </Form.Item>

      <Form.Item label="Email" name="Email" rules={formRules.Email}>
        <Input placeholder="Nhập địa chỉ email" maxLength={100} />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="Phone" rules={formRules.Phone}>
        <Input placeholder="Nhập số điện thoại" maxLength={15} />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="Address" rules={formRules.Address}>
        <Input
          placeholder="Nhập địa chỉ cụ thể (tỉnh/thành phố, quận/huyện, ...)"
          maxLength={255}
        />
      </Form.Item>

      <Form.Item
        label={
          <div>
            <span>Dịch vụ quan tâm</span>
            <Typography.Text
              type="secondary"
              style={{
                fontSize: 10,
                display: "block",
              }}
            >
              Không thấy dịch vụ phù hợp? Ghi chú thêm ở mục &quot;Ghi chú&quot;
              bên dưới.
            </Typography.Text>
          </div>
        }
        name="ServiceTypes"
        rules={formRules.ServiceTypes}
      >
        <Select
          placeholder="Chọn dịch vụ"
          loading={loadingServiceTypes}
          showSearch
          optionFilterProp="children"
          allowClear
        >
          {serviceTypes.map((serviceType) => (
            <Select.Option
              key={serviceType._id}
              value={serviceType._id}
              title={serviceType.description || serviceType.name}
            >
              {serviceType.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Ngày đặt lịch"
        name="BookingDate"
        rules={formRules.BookingDate}
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
        name="BookingTime"
        rules={formRules.BookingTime}
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

      <Form.Item label="Ghi chú" name="Notes" rules={formRules.Notes}>
        <Input.TextArea
          rows={3}
          placeholder="Nhập ghi chú (nếu có)"
          maxLength={500}
        />
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
