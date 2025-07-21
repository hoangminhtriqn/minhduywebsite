import React from "react";

interface SEOStructuredDataProps {
  type: "organization" | "carDealer" | "breadcrumb" | "product";
  data: any;
}

const SEOStructuredData: React.FC<SEOStructuredDataProps> = ({
  type,
  data,
}) => {
  const getStructuredData = () => {
    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Minh Duy Đà Nẵng",
          url: "https://minduywebsite.com",
          logo: "https://minduywebsite.com/images/logo.png",
          description:
            "Chuyên thi công, lắp đặt, xử lý các sự cố kỹ thuật: máy vi tính, máy in, camera, máy chiếu, máy photocopy, máy dùng cho văn phòng, máy chấm công, pccc, báo động, nhà thông minh, điện thông minh, năng lượng mặt trời. mạng internet, cáp quang, chống sét, tổng đài điện thoại, server trạm tổng, trung tâm điều khiển server, công nghệ ứng dụng tổng hợp ",
          address: {
            "@type": "PostalAddress",
            streetAddress: "231 Hùng Vương, phường Tam Kỳ, thành phố Đà Nẵng",
            addressLocality: "Đà Nẵng",
            addressRegion: "Đà Nẵng",
            postalCode: "50000",
            addressCountry: "VN",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "0917.776.046",
            contactType: "customer service",
            areaServed: "VN",
            availableLanguage: "Vietnamese",
          },
          // sameAs: [
          //   "https://www.facebook.com/minduy",
          //   "https://www.youtube.com/minduy",
          // ],
        };

      case "carDealer":
        return {
          "@context": "https://schema.org",
          "@type": "CarDealer",
          name: "Minh Duy BMW Đà Nẵng",
          description:
            "Chuyên thi công, lắp đặt, xử lý các sự cố kỹ thuật: máy vi tính, máy in, camera, máy chiếu, máy photocopy, máy dùng cho văn phòng, máy chấm công, pccc, báo động, nhà thông minh, điện thông minh, năng lượng mặt trời. mạng internet, cáp quang, chống sét, tổng đài điện thoại, server trạm tổng, trung tâm điều khiển server, công nghệ ứng dụng tổng hợp ",
          url: "https://minduywebsite.com",
          logo: "https://minduywebsite.com/images/logo.png",
          image: "https://minduywebsite.com/images/minhduy-showroom.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: "231 Hùng Vương, phường Tam Kỳ, thành phố Đà Nẵng",
            addressLocality: "Đà Nẵng",
            addressRegion: "Đà Nẵng",
            postalCode: "50000",
            addressCountry: "VN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 16.0544,
            longitude: 108.2022,
          },
          telephone: "0917.776.046",
          email: "hoangminhtrivni@gmail.com",
          openingHours: "Mo-Fr 08:00-18:00, Sa 08:00-17:00",
          brand: "Minh Duy Đà Nẵng",
        };

      case "breadcrumb":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Trang chủ",
              item: "https://minduywebsite.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: data.currentPage,
              item: `https://minduywebsite.com${data.currentPath}`,
            },
          ],
        };

      case "product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: data.name,
          description: data.description,
          brand: {
            "@type": "Brand",
            name: "Minh Duy Đà Nẵng",
          },
          category: "Automotive",
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: "VND",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "Minh Duy Đà Nẵng",
            },
          },
        };

      default:
        return {};
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
};

export default SEOStructuredData;
