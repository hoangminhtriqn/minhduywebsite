// Page keys enum to avoid hardcoding strings
export enum PageKeys {
  HOME = 'home',
  PRODUCTS = 'products',
  PRODUCT_DETAIL = 'productDetail',
  NEWS = 'news',
  NEWS_DETAIL = 'newsDetail',
  SERVICE = 'service',
  BOOKING = 'booking',
  PRICE_LIST = 'priceList',
  LOGIN = 'login',
  REGISTER = 'register',
  PROFILE = 'profile',
  FAVORITES = 'favorites'
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: {
    type: 'organization' | 'carDealer' | 'breadcrumb' | 'product';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>;
  }[];
}

export const seoConfigs: Record<PageKeys, SEOConfig> = {
  // Homepage SEO
  [PageKeys.HOME]: {
    title: "Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng | Thi Công, Lắp Đặt, Xử Lý Sự Cố Kỹ Thuật",
    description: "Công ty TNHH MTV Công Nghệ Ứng Dụng Minh Duy - Chuyên thi công, lắp đặt, xử lý các sự cố kỹ thuật: máy vi tính, máy in, camera, máy chiếu, máy photocopy, máy dùng cho văn phòng, máy chấm công, PCCC, báo động, nhà thông minh, điện thông minh, năng lượng mặt trời, mạng internet, cáp quang, chống sét, tổng đài điện thoại, server trạm tổng, trung tâm điều khiển server, công nghệ ứng dụng tổng hợp. Địa chỉ: 231 Hùng Vương, TP Tam Kỳ, Quảng Nam - 150 Nguyễn Đình Chiểu, TP Tam Kỳ, Quảng Nam - 62 Phạm Như Xương, TP Đà Nẵng.",
    keywords: "Minh Duy, Công ty TNHH MTV Công Nghệ Ứng Dụng, thi công lắp đặt, xử lý sự cố kỹ thuật, máy vi tính, máy in, camera, máy chiếu, máy photocopy, PCCC, báo động, nhà thông minh, điện thông minh, năng lượng mặt trời, mạng internet, cáp quang, chống sét, tổng đài điện thoại, server, Tam Kỳ, Đà Nẵng, Quảng Nam",
    canonical: "https://minduywebsite.com/",
    ogImage: "/images/logo.png",
    structuredData: [
      {
        type: 'organization',
        data: {
          name: "Công Ty TNHH MTV Công Nghệ Ứng Dụng Minh Duy",
          address: [
            "231 Hùng Vương, TP Tam Kỳ, tỉnh Quảng Nam",
            "150 Nguyễn Đình Chiểu, TP Tam Kỳ, tỉnh Quảng Nam", 
            "62 Phạm Như Xương, TP Đà Nẵng"
          ],
          phone: ["0917.776.046", "0865.111.455", "0905.444.010"],
          description: "Chuyên thi công, lắp đặt, xử lý các sự cố kỹ thuật: máy vi tính, máy in, camera, máy chiếu, máy photocopy, máy dùng cho văn phòng, máy chấm công, PCCC, báo động, nhà thông minh, điện thông minh, năng lượng mặt trời, mạng internet, cáp quang, chống sét, tổng đài điện thoại, server trạm tổng, trung tâm điều khiển server, công nghệ ứng dụng tổng hợp"
        }
      }
    ]
  },

  // Product List Page SEO
  [PageKeys.PRODUCTS]: {
    title: "Laptop Chính Hãng 2025 | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Báo giá laptop chính hãng đời 2025 tại Minh Duy. Dell Inspiron, Dell Vostro với cấu hình cao, bảo hành chính hãng. Tặng kèm túi xách, chuột không dây, bộ vệ sinh laptop.",
    keywords: "laptop chính hãng 2025, Dell Inspiron, Dell Vostro, laptop Dell, giá laptop, báo giá laptop, laptop Tam Kỳ, laptop Đà Nẵng, Minh Duy laptop",
    canonical: "https://minduywebsite.com/cars",
    ogImage: "/images/logo.png",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "Laptop Chính Hãng",
          currentPath: "/cars"
        }
      }
    ]
  },

  // Product Detail Page SEO
  [PageKeys.PRODUCT_DETAIL]: {
    title: "{productName} | Minh Duy - Giá Tốt Nhất 2025",
    description: "{productName} tại Minh Duy. Giá laptop {productName} tốt nhất 2025, bảo hành chính hãng 1 năm. Tặng kèm túi xách, chuột không dây, bộ vệ sinh laptop.",
    keywords: "{productName}, giá laptop, laptop chính hãng, Dell Inspiron, Dell Vostro, Minh Duy, Tam Kỳ, Đà Nẵng",
    canonical: "https://minduywebsite.com/cars/{productId}",
    ogImage: "/images/bmw-x5m.jpg",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "{productName}",
          currentPath: "/cars/{productId}"
        }
      },
      {
        type: 'product',
        data: {
          name: "{productName}",
          description: "{productDescription}",
          price: "{productPrice}"
        }
      }
    ]
  },

  // News Page SEO
  [PageKeys.NEWS]: {
    title: "Tin Tức Công Nghệ | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Tin tức mới nhất về công nghệ, khuyến mãi laptop, sự kiện công nghệ tại Minh Duy. Cập nhật thông tin sản phẩm mới và dịch vụ kỹ thuật.",
    keywords: "tin tức công nghệ, khuyến mãi laptop, sự kiện công nghệ, Minh Duy, tin tức máy tính, Tam Kỳ, Đà Nẵng",
    canonical: "https://minduywebsite.com/news",
    ogImage: "/images/bmw-news.jpg",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "Tin Tức",
          currentPath: "/news"
        }
      }
    ]
  },

  // News Detail Page SEO
  [PageKeys.NEWS_DETAIL]: {
    title: "{newsTitle} | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "{newsDescription} - Tin tức mới nhất từ Minh Duy. Cập nhật thông tin công nghệ, khuyến mãi và dịch vụ kỹ thuật.",
    keywords: "{newsKeywords}, tin tức công nghệ, Minh Duy, Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    canonical: "https://minduywebsite.com/news/{newsId}",
    ogImage: "{newsImage}",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "{newsTitle}",
          currentPath: "/news/{newsId}"
        }
      }
    ]
  },

  // Service Page SEO
  [PageKeys.SERVICE]: {
    title: "Dịch Vụ Kỹ Thuật | Minh Duy - Thi Công, Lắp Đặt, Xử Lý Sự Cố",
    description: "Dịch vụ kỹ thuật chuyên nghiệp tại Minh Duy: thi công, lắp đặt, xử lý các sự cố kỹ thuật máy vi tính, máy in, camera, máy chiếu, máy photocopy, PCCC, báo động, nhà thông minh, điện thông minh, năng lượng mặt trời, mạng internet, cáp quang, chống sét, tổng đài điện thoại, server.",
    keywords: "dịch vụ kỹ thuật, thi công lắp đặt, xử lý sự cố, máy vi tính, máy in, camera, máy chiếu, PCCC, báo động, nhà thông minh, điện thông minh, năng lượng mặt trời, mạng internet, cáp quang, chống sét, tổng đài điện thoại, server, Minh Duy, Tam Kỳ, Đà Nẵng",
    canonical: "https://minduywebsite.com/service",
    ogImage: "/images/bmw-service-center.jpg",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "Dịch Vụ",
          currentPath: "/service"
        }
      }
    ]
  },

  // Test Drive Page SEO
  [PageKeys.BOOKING]: {
    title: "Tư Vấn Kỹ Thuật | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Tư vấn kỹ thuật chuyên nghiệp tại Minh Duy. Hỗ trợ lựa chọn sản phẩm phù hợp, tư vấn giải pháp công nghệ cho doanh nghiệp và cá nhân.",
    keywords: "tư vấn kỹ thuật, tư vấn công nghệ, giải pháp công nghệ, Minh Duy, Tam Kỳ, Đà Nẵng, Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    canonical: "https://minduywebsite.com/test-drive",
    ogImage: "/images/test-drive.jpg",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "Tư Vấn Kỹ Thuật",
          currentPath: "/test-drive"
        }
      }
    ]
  },

  // Price List Page SEO
  [PageKeys.PRICE_LIST]: {
    title: "Bảng Giá Laptop 2025 | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Bảng giá laptop chính hãng 2025 tại Minh Duy. Dell Inspiron, Dell Vostro với cấu hình cao, bảo hành chính hãng. Tặng kèm túi xách, chuột không dây, bộ vệ sinh laptop.",
    keywords: "bảng giá laptop 2025, giá Dell Inspiron, giá Dell Vostro, laptop chính hãng, báo giá laptop, Minh Duy, Tam Kỳ, Đà Nẵng",
    canonical: "https://minduywebsite.com/price-list",
    ogImage: "/images/bmw-price-list.jpg",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "Bảng Giá",
          currentPath: "/price-list"
        }
      }
    ]
  },

  // Login Page SEO
  [PageKeys.LOGIN]: {
    title: "Đăng Nhập | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Đăng nhập vào tài khoản Minh Duy để quản lý thông tin cá nhân, đơn hàng và dịch vụ kỹ thuật.",
    keywords: "đăng nhập, tài khoản Minh Duy, quản lý đơn hàng, Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    canonical: "https://minduywebsite.com/login",
    ogImage: "/images/logo.png",
    structuredData: []
  },

  // Register Page SEO
  [PageKeys.REGISTER]: {
    title: "Đăng Ký | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Đăng ký tài khoản tại Minh Duy để nhận thông tin khuyến mãi, tư vấn kỹ thuật và quản lý dịch vụ công nghệ.",
    keywords: "đăng ký, tài khoản Minh Duy, thông tin khuyến mãi, Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    canonical: "https://minduywebsite.com/register",
    ogImage: "/images/logo.png",
    structuredData: []
  },

  // Profile Page SEO
  [PageKeys.PROFILE]: {
    title: "Tài Khoản Cá Nhân | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Quản lý thông tin cá nhân, đơn hàng, lịch sử dịch vụ kỹ thuật tại Minh Duy.",
    keywords: "tài khoản cá nhân, quản lý đơn hàng, lịch sử dịch vụ, Minh Duy, Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    canonical: "https://minduywebsite.com/profile",
    ogImage: "/images/logo.png",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "Tài Khoản",
          currentPath: "/profile"
        }
      }
    ]
  },

  // Favorites Page SEO
  [PageKeys.FAVORITES]: {
    title: "Yêu Thích | Minh Duy - Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    description: "Danh sách sản phẩm yêu thích của bạn tại Minh Duy. Lưu trữ và so sánh các sản phẩm công nghệ.",
    keywords: "sản phẩm yêu thích, danh sách yêu thích, so sánh sản phẩm, Minh Duy, Công Ty TNHH MTV Công Nghệ Ứng Dụng",
    canonical: "https://minduywebsite.com/favorites",
    ogImage: "/images/logo.png",
    structuredData: [
      {
        type: 'breadcrumb',
        data: {
          currentPage: "Yêu Thích",
          currentPath: "/favorites"
        }
      }
    ]
  }
};

// Helper function to get SEO config for a specific page
export const getSEOConfig = (pageKey: PageKeys, dynamicData?: Record<string, string>): SEOConfig => {
  const config = seoConfigs[pageKey];
  if (!config) {
    return seoConfigs[PageKeys.HOME]; // Fallback to home config
  }

  if (!dynamicData) {
    return config;
  }

  // Replace dynamic placeholders with actual data
  const replacePlaceholders = (text: string): string => {
    let result = text;
    Object.entries(dynamicData).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  };

  return {
    ...config,
    title: replacePlaceholders(config.title),
    description: replacePlaceholders(config.description),
    keywords: replacePlaceholders(config.keywords),
    canonical: replacePlaceholders(config.canonical || ''),
    structuredData: config.structuredData?.map(data => ({
      ...data,
      data: {
        ...data.data,
        ...Object.fromEntries(
          Object.entries(data.data).map(([key, value]) => [
            key,
            typeof value === 'string' ? replacePlaceholders(value) : value
          ])
        )
      }
    }))
  };
}; 