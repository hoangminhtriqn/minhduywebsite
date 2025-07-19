import PageBanner from "@/components/PageBanner";
import { PaginationWrapper, usePagination } from "@/components/pagination";

import {
  DownloadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { notification, Spin } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface PricingCard {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  documents: {
    name: string;
    type: "pdf" | "word" | "excel";
    size: string;
    url: string;
  }[];
  color: "blue" | "green" | "purple" | "orange" | "red" | "teal";
}

const PriceListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const { pagination, handlePageChange, updateTotal } = usePagination({
    initialPageSize: 6,
  });

  // Mock data for IT service pricing cards
  const mockPricingData: PricingCard[] = [
    {
      id: "1",
      title: "Lắp đặt Camera Giám Sát",
      category: "An Ninh",
      description:
        "Hệ thống camera giám sát chuyên nghiệp với công nghệ HD/4K, hỗ trợ xem từ xa qua điện thoại.",
      features: [
        "Camera HD/4K chất lượng cao",
        "Hệ thống lưu trữ NAS/Cloud",
        "Xem từ xa qua mobile app",
        "Phát hiện chuyển động thông minh",
        "Bảo hành 2 năm",
        "Hỗ trợ kỹ thuật 24/7",
      ],
      documents: [
        {
          name: "Báo giá Camera Giám Sát",
          type: "pdf",
          size: "1.8MB",
          url: "#",
        },
        { name: "Catalog Camera 2024", type: "word", size: "1.2MB", url: "#" },
        { name: "Bảng giá chi tiết", type: "excel", size: "2.1MB", url: "#" },
      ],
      color: "blue",
    },
    {
      id: "2",
      title: "Lắp đặt Server & Network",
      category: "Hạ Tầng",
      description:
        "Thiết kế và lắp đặt hệ thống server, mạng LAN/WAN cho doanh nghiệp vừa và nhỏ.",
      features: [
        "Server Dell/HP chính hãng",
        "Switch Cisco/Huawei",
        "Hệ thống backup tự động",
        "Bảo mật firewall",
        "Bảo hành 3 năm",
        "Tư vấn kỹ thuật miễn phí",
      ],
      documents: [
        {
          name: "Báo giá Server & Network",
          type: "pdf",
          size: "2.5MB",
          url: "#",
        },
        { name: "Thông số kỹ thuật", type: "word", size: "1.8MB", url: "#" },
      ],
      color: "green",
    },
    {
      id: "3",
      title: "Phần Mềm Quản Lý",
      category: "Software",
      description:
        "Phát triển phần mềm quản lý theo yêu cầu, tích hợp với hệ thống hiện có.",
      features: [
        "Phát triển theo yêu cầu",
        "Giao diện responsive",
        "Tích hợp API",
        "Bảo mật dữ liệu",
        "Hỗ trợ đào tạo",
        "Bảo trì dài hạn",
      ],
      documents: [
        { name: "Báo giá Phần Mềm", type: "pdf", size: "2.2MB", url: "#" },
        { name: "Demo sản phẩm", type: "word", size: "1.5MB", url: "#" },
        { name: "Timeline dự án", type: "excel", size: "1.8MB", url: "#" },
      ],
      color: "purple",
    },
    {
      id: "4",
      title: "Bảo Trì Hệ Thống",
      category: "Dịch Vụ",
      description:
        "Dịch vụ bảo trì, bảo dưỡng hệ thống IT định kỳ, đảm bảo hoạt động ổn định.",
      features: [
        "Kiểm tra định kỳ hàng tháng",
        "Cập nhật bảo mật",
        "Sao lưu dữ liệu",
        "Thay thế linh kiện",
        "Báo cáo chi tiết",
        "Hỗ trợ khẩn cấp",
      ],
      documents: [
        { name: "Báo giá Bảo Trì", type: "pdf", size: "1.6MB", url: "#" },
        { name: "Quy trình bảo trì", type: "word", size: "1.1MB", url: "#" },
        { name: "Lịch bảo trì", type: "excel", size: "1.3MB", url: "#" },
      ],
      color: "orange",
    },
    {
      id: "5",
      title: "Thiết Kế Website",
      category: "Web",
      description:
        "Thiết kế website chuyên nghiệp, responsive, tối ưu SEO và tốc độ tải trang.",
      features: [
        "Thiết kế responsive",
        "Tối ưu SEO",
        "Tích hợp CMS",
        "Bảo mật SSL",
        "Tốc độ tải nhanh",
        "Hỗ trợ đa ngôn ngữ",
      ],
      documents: [
        { name: "Báo giá Website", type: "pdf", size: "1.9MB", url: "#" },
        { name: "Portfolio mẫu", type: "word", size: "2.3MB", url: "#" },
      ],
      color: "teal",
    },
    {
      id: "6",
      title: "Cloud & Backup",
      category: "Cloud",
      description:
        "Giải pháp lưu trữ đám mây và sao lưu dữ liệu an toàn, tiết kiệm chi phí.",
      features: [
        "Lưu trữ đám mây AWS/Azure",
        "Sao lưu tự động",
        "Khôi phục dữ liệu",
        "Bảo mật mã hóa",
        "Quản lý truy cập",
        "Monitoring 24/7",
      ],
      documents: [
        { name: "Báo giá Cloud", type: "pdf", size: "2.0MB", url: "#" },
        { name: "So sánh dịch vụ", type: "word", size: "1.7MB", url: "#" },
        { name: "Chi phí vận hành", type: "excel", size: "2.4MB", url: "#" },
      ],
      color: "red",
    },
    {
      id: "7",
      title: "Tư Vấn IT",
      category: "Tư Vấn",
      description:
        "Dịch vụ tư vấn công nghệ thông tin, đánh giá và đề xuất giải pháp tối ưu.",
      features: [
        "Đánh giá hiện trạng",
        "Đề xuất giải pháp",
        "Lập kế hoạch triển khai",
        "Tính toán ROI",
        "Hỗ trợ lựa chọn công nghệ",
        "Theo dõi dự án",
      ],
      documents: [
        { name: "Báo giá Tư Vấn", type: "pdf", size: "1.5MB", url: "#" },
        { name: "Quy trình tư vấn", type: "word", size: "1.0MB", url: "#" },
        { name: "Case study", type: "excel", size: "1.9MB", url: "#" },
      ],
      color: "purple",
    },
    {
      id: "8",
      title: "Bảo Mật Hệ Thống",
      category: "Bảo Mật",
      description:
        "Giải pháp bảo mật toàn diện cho hệ thống IT, bảo vệ dữ liệu khỏi các mối đe dọa.",
      features: [
        "Firewall chuyên nghiệp",
        "Antivirus doanh nghiệp",
        "Phát hiện xâm nhập",
        "Mã hóa dữ liệu",
        "Kiểm tra bảo mật",
        "Đào tạo nhân viên",
      ],
      documents: [
        { name: "Báo giá Bảo Mật", type: "pdf", size: "2.1MB", url: "#" },
        { name: "Quy trình bảo mật", type: "word", size: "1.4MB", url: "#" },
      ],
      color: "green",
    },
  ];

  // Get document icon
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdfOutlined />;
      case "word":
        return <FileWordOutlined />;
      case "excel":
        return <FileExcelOutlined />;
      default:
        return <DownloadOutlined />;
    }
  };

  // Handle document download
  const handleDownload = (document: {
    name: string;
    type: string;
    size: string;
    url: string;
  }) => {
    notification.success({
      message: "Tải tài liệu",
      description: `Đang tải ${document.name}...`,
    });
    // Here you would implement actual download logic
  };

  // Use all cards without filtering
  const filteredCards = mockPricingData;

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredCards.slice(startIndex, endIndex);
  };

  const currentPageData = getCurrentPageData();

  // Handle page change with scroll to top
  const handlePageChangeWithScroll = (page: number, pageSize?: number) => {
    window.scrollTo(0, 0);
    handlePageChange(page, pageSize);
  };

  // Initialize data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      updateTotal(mockPricingData.length);
      setLoading(false);
    }, 1000);
  }, []);

  // Update total when data changes
  useEffect(() => {
    updateTotal(filteredCards.length);
    handlePageChange(1, pagination.pageSize);
  }, []);

  return (
    <div className={styles["pricing-page"]}>
      {/* Page Banner */}
      <PageBanner
        title="Báo giá dịch vụ"
        subtitle="Các hạng mục thi công, lắp đặt và dịch vụ công nghệ thông tin chuyên nghiệp"
      />

      {/* Pricing Section */}
      <section className={styles["pricing-section"]}>
        <div className={styles["pricing-section__container"]}>
          {/* Pricing Cards */}
          <div className={styles["pricing-cards"]}>
            <Spin spinning={loading}>
              <div className={styles["pricing-cards__grid"]}>
                {currentPageData.map((card) => (
                  <div
                    key={card.id}
                    className={`${styles["pricing-card"]} ${styles[`pricing-card--${card.color}`]}`}
                  >
                    {/* Card Header */}
                    <div className={styles["pricing-card__header"]}>
                      <h3 className={styles["pricing-card__title"]}>
                        {card.title}
                      </h3>
                    </div>

                    {/* Card Description */}
                    <div className={styles["pricing-card__description"]}>
                      {card.description}
                    </div>

                    {/* Card Features */}
                    <div className={styles["pricing-card__features"]}>
                      <ul>
                        {card.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Documents */}
                    <div className={styles["pricing-card__documents"]}>
                      <div className={styles["pricing-card__documents-list"]}>
                        {card.documents.map((doc, index) => (
                          <button
                            key={index}
                            className={styles["pricing-card__document"]}
                            onClick={() => handleDownload(doc)}
                            title={doc.name}
                          >
                            <div
                              className={styles["pricing-card__document-info"]}
                            >
                              <span
                                className={
                                  styles["pricing-card__document-name"]
                                }
                              >
                                {doc.name}
                              </span>
                              <span
                                className={
                                  styles["pricing-card__document-size"]
                                }
                              >
                                {doc.size}
                              </span>
                            </div>
                            <span
                              className={styles["pricing-card__document-icon"]}
                            >
                              {getDocumentIcon(doc.type)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Spin>
          </div>

          {/* Pagination */}
          {filteredCards.length > 0 && (
            <PaginationWrapper
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={filteredCards.length}
              onChange={handlePageChangeWithScroll}
              showSizeChanger
              showQuickJumper
              showTotal
              pageSizeOptions={["6", "12", "18", "24"]}
              totalText="{start}-{end} của {total} dịch vụ"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default PriceListPage;
