const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import all models
const User = require("./models/User");
const { USER_ROLES, LOGIN_PROVIDERS } = require("./models/User");
const Role = require("./models/Role");
const RoleUser = require("./models/RoleUser");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Service = require("./models/Service");
const NewsEvent = require("./models/NewsEvent");
const { NEWS_STATUS } = require("./utils/enums");

const Pricing = require("./models/Pricing");
const Location = require("./models/Location");
const Setting = require("./models/Setting");
const Booking = require("./models/Booking");
const ServiceType = require("./models/ServiceType");
const Slide = require("./models/Slide");

const sampleLocations = [
  {
    name: "MINH DUY - Đà Nẵng",
    address: "Số 132 Lê Duẩn, Đống Đa, Hà Nội",
    coordinates: "15.566762797033958,108.47919866217119",
    mapUrl: "https://maps.app.goo.gl/tjX4cmFR9nJFaur58",
    isMainAddress: true,
  },
  {
    name: "MINH DUY - Hồ Chí Minh",
    address: "Số 456 Nguyễn Huệ, Quận 1, TP.HCM",
    coordinates: "10.123456,106.123456",
    mapUrl: "https://maps.app.goo.gl/example2",
    isMainAddress: false,
  },
  {
    name: "MINH DUY - Hà Nội",
    address: "Số 789 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
    coordinates: "21.123456,105.123456",
    mapUrl: "https://maps.app.goo.gl/example3",
    isMainAddress: false,
  },
];

const sampleSlides = [
  {
    src: "/images/bmw-3840x2160.jpg",
    alt: "Minh Duy Technology - Công ty công nghệ thiết bị vi tính hàng đầu",
    order: 1,
    isActive: true,
  },
  {
    src: "/images/bmw-x5m.jpg",
    alt: "Laptop Gaming - Thiết bị công nghệ cao cấp tại Minh Duy",
    order: 2,
    isActive: true,
  },
  {
    src: "/images/bmw-service-center.jpg",
    alt: "Trung tâm dịch vụ công nghệ Minh Duy - Sửa chữa bảo hành thiết bị",
    order: 3,
    isActive: true,
  },
  {
    src: "/images/bmw-service-hanoi.jpg",
    alt: "Dịch vụ công nghệ tại Minh Duy - Đại lý thiết bị vi tính uy tín",
    order: 4,
    isActive: true,
  },
];

// Sample data
const sampleRoles = [
  {
    Role_Name: USER_ROLES.ADMIN,
    Role_Description: "Quản trị viên hệ thống - Toàn quyền",
    Permissions: [
      // Dashboard
      "dashboard.view",

      // Users
      "users.view",
      "users.edit",
      "users.status.update",
      "users.role.view",
      "users.role.update",

      // Products
      "products.view",
      "products.create",
      "products.edit",
      "products.delete",
      "products.favorites.view",

      // Categories
      "categories.view",
      "categories.create",
      "categories.edit",
      "categories.delete",
      "categories.reorder",
      "categories.visibility.toggle",
      "categories.hierarchy.manage",

      // Services
      "services.view",
      "services.create",
      "services.edit",
      "services.delete",
      "services.media.upload",

      // Bookings
      "bookings.view",
      "bookings.details.view",
      "bookings.status.update",
      "bookings.delete",
      "bookings.service_types.manage",

      // News
      "news.view",
      "news.create",
      "news.edit",
      "news.delete",
      "news.preview",
      "news.media.upload",

      // Pricing
      "pricing.view",
      "pricing.create",
      "pricing.edit",
      "pricing.delete",
      "pricing.details.view",
      "pricing.features.manage",
      "pricing.documents.manage",

      // Settings
      "settings.view",
      "settings.update",
      "settings.locations.manage",
      "settings.slides.manage",
      "settings.contact.update",
      "settings.seo.update",

      // Permissions
      "permissions.view",
      "permissions.create",
      "permissions.edit",
      "permissions.delete",
      "permissions.assign",
      "permissions.revoke",
    ],
  },
  {
    Role_Name: USER_ROLES.USER,
    Role_Description: "Người dùng thông thường - Chỉ truy cập frontend",
    Permissions: [],
  },
  {
    Role_Name: USER_ROLES.EMPLOYEE,
    Role_Description: "Nhân viên - Quyền hạn được cấp bởi Admin",
    Permissions: [],
  },
];

// Group Categories (Cấp cha)
const sampleGroupCategories = [
  {
    Name: "Laptop & Máy Tính Xách Tay",
    Description: "Các loại laptop và máy tính xách tay",
    Icon: "💻",
    Image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
    Order: 1,
  },
  {
    Name: "Máy Tính Để Bàn",
    Description: "PC gaming, văn phòng, đồ họa",
    Icon: "🖥️",
    Image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
    Order: 2,
  },
  {
    Name: "Phụ Kiện Máy Tính",
    Description: "Bàn phím, chuột, tai nghe, loa",
    Icon: "⌨️",
    Image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
    Order: 3,
  },
  {
    Name: "Thiết Bị Ngoại Vi",
    Description: "Máy in, máy scan, màn hình, máy chiếu",
    Icon: "🖨️",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Order: 4,
  },
  {
    Name: "Thiết Bị Mạng",
    Description: "Router, switch, modem, access point",
    Icon: "🌐",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Order: 5,
  },
  {
    Name: "Lưu Trữ & Backup",
    Description: "Ổ cứng, USB, thẻ nhớ, NAS",
    Icon: "💾",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Order: 6,
  },
  {
    Name: "Phần Mềm & Bản Quyền",
    Description: "Windows, Office, antivirus, design software",
    Icon: "🛡️",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Order: 7,
  },
  {
    Name: "Dịch Vụ Công Nghệ",
    Description: "Sửa chữa, bảo hành, nâng cấp, tư vấn",
    Icon: "🔧",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Order: 8,
  },
];

// Sample users data
const sampleUsers = [
  // Sample regular users
  {
    UserName: "user1",
    Password: "user123",
    Email: "user1@example.com",
    Phone: "0123456781",
    FullName: "Nguyễn Văn An",
    Address: "Hà Nội, Việt Nam",
    Role: USER_ROLES.USER,
    LoginProvider: LOGIN_PROVIDERS.LOCAL,
  },
  {
    UserName: "user2",
    Password: "user123",
    Email: "user2@example.com",
    Phone: "0123456782",
    FullName: "Trần Thị Bình",
    Address: "TP.HCM, Việt Nam",
    Role: USER_ROLES.USER,
    LoginProvider: LOGIN_PROVIDERS.LOCAL,
  },
  // Sample employees
  {
    UserName: "employee1",
    Password: "employee123",
    Email: "employee1@minhduy.com",
    Phone: "0123456790",
    FullName: "Lê Thị Nhân Viên",
    Address: "Đà Nẵng, Việt Nam",
    Role: USER_ROLES.EMPLOYEE,
    LoginProvider: LOGIN_PROVIDERS.LOCAL,
  },
  {
    UserName: "employee2",
    Password: "employee123",
    Email: "employee2@minhduy.com",
    Phone: "0123456791",
    FullName: "Phạm Văn Quản Lý",
    Address: "Hà Nội, Việt Nam",
    Role: USER_ROLES.EMPLOYEE,
    LoginProvider: LOGIN_PROVIDERS.LOCAL,
  },
  {
    UserName: "employee3",
    Password: "employee123",
    Email: "employee3@minhduy.com",
    Phone: "0123456792",
    FullName: "Nguyễn Thị Hỗ Trợ",
    Address: "TP.HCM, Việt Nam",
    Role: USER_ROLES.EMPLOYEE,
    LoginProvider: LOGIN_PROVIDERS.LOCAL,
  },
];

// Sample products data
function generateSampleProducts() {
  const products = [];

  // Định nghĩa sản phẩm theo từng nhóm thể loại
  const productsByCategory = {
    "Laptop & Máy Tính Xách Tay": [
      {
        name: "Laptop Dell Inspiron 15 3000",
        description:
          "Laptop văn phòng hiệu suất cao, màn hình 15.6 inch, Intel Core i5, RAM 8GB, SSD 256GB",
        price: 15000000,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        specs: {
          Processor: "Intel Core i5",
          RAM: "8GB DDR4",
          Storage: "256GB SSD",
          Display: "15.6 inch FHD",
        },
      },
      {
        name: "Laptop HP Pavilion 14",
        description:
          "Laptop mỏng nhẹ, thiết kế hiện đại, màn hình 14 inch, AMD Ryzen 5, RAM 8GB, SSD 512GB",
        price: 18000000,
        image:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        specs: {
          Processor: "AMD Ryzen 5",
          RAM: "8GB DDR4",
          Storage: "512GB SSD",
          Display: "14 inch FHD",
        },
      },
      {
        name: "Laptop Lenovo ThinkPad E14",
        description:
          "Laptop doanh nghiệp bền bỉ, màn hình 14 inch, Intel Core i7, RAM 16GB, SSD 512GB",
        price: 22000000,
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        specs: {
          Processor: "Intel Core i7",
          RAM: "16GB DDR4",
          Storage: "512GB SSD",
          Display: "14 inch FHD",
        },
      },
      {
        name: "MacBook Air M1",
        description:
          "Laptop Apple cao cấp, chip M1, màn hình 13.3 inch Retina, RAM 8GB, SSD 256GB",
        price: 25000000,
        image:
          "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop",
        specs: {
          Processor: "Apple M1",
          RAM: "8GB Unified",
          Storage: "256GB SSD",
          Display: "13.3 inch Retina",
        },
      },
      {
        name: "Laptop MSI Gaming GF63",
        description:
          "Laptop gaming hiệu suất cao, màn hình 15.6 inch, Intel Core i7, RAM 16GB, RTX 3060",
        price: 28000000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Processor: "Intel Core i7",
          RAM: "16GB DDR4",
          Storage: "512GB SSD",
          Display: "15.6 inch FHD",
          Graphics: "RTX 3060",
        },
      },
    ],
    "Máy Tính Để Bàn": [
      {
        name: "PC Gaming Dell Alienware",
        description:
          "Máy tính gaming cao cấp, Intel Core i9, RAM 32GB, RTX 4080, SSD 2TB",
        price: 35000000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Processor: "Intel Core i9",
          RAM: "32GB DDR5",
          Storage: "2TB SSD",
          Graphics: "RTX 4080",
        },
      },
      {
        name: "PC HP Pavilion Desktop",
        description:
          "Máy tính văn phòng, Intel Core i5, RAM 8GB, HDD 1TB, Windows 11",
        price: 12000000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Processor: "Intel Core i5",
          RAM: "8GB DDR4",
          Storage: "1TB HDD",
          OS: "Windows 11",
        },
      },
      {
        name: "PC Lenovo ThinkCentre",
        description:
          "Máy tính doanh nghiệp, Intel Core i7, RAM 16GB, SSD 512GB, bảo mật cao",
        price: 20000000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Processor: "Intel Core i7",
          RAM: "16GB DDR4",
          Storage: "512GB SSD",
          Security: "TPM 2.0",
        },
      },
      {
        name: "PC Asus ROG Strix",
        description:
          "Máy tính gaming ASUS, AMD Ryzen 9, RAM 32GB, RTX 4070, RGB lighting",
        price: 25000000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Processor: "AMD Ryzen 9",
          RAM: "32GB DDR5",
          Storage: "1TB SSD",
          Graphics: "RTX 4070",
        },
      },
      {
        name: "PC All-in-One Dell",
        description:
          "Máy tính all-in-one, màn hình 24 inch, Intel Core i5, RAM 8GB, tích hợp webcam",
        price: 15000000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Processor: "Intel Core i5",
          RAM: "8GB DDR4",
          Storage: "256GB SSD",
          Display: "24 inch FHD",
        },
      },
    ],
    "Phụ Kiện Máy Tính": [
      {
        name: "Bàn Phím Cơ Logitech G Pro",
        description:
          "Bàn phím cơ gaming, switch Cherry MX Blue, RGB backlight, có dây",
        price: 2500000,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop",
        specs: {
          Switch: "Cherry MX Blue",
          Backlight: "RGB",
          Connection: "USB-C",
          Layout: "Full-size",
        },
      },
      {
        name: "Chuột Gaming Razer DeathAdder",
        description:
          "Chuột gaming chuyên nghiệp, 16,000 DPI, 7 nút có thể lập trình",
        price: 1500000,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
        specs: {
          DPI: "16,000",
          Buttons: "7 Programmable",
          Sensor: "Optical",
          Weight: "82g",
        },
      },
      {
        name: "Tai Nghe Gaming HyperX Cloud",
        description:
          "Tai nghe gaming chất lượng cao, âm thanh surround 7.1, microphone detachable",
        price: 2000000,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
        specs: {
          Audio: "7.1 Surround",
          Microphone: "Detachable",
          Connection: "3.5mm/USB",
          Weight: "320g",
        },
      },
      {
        name: "Loa Máy Tính Creative Pebble",
        description:
          "Loa máy tính 2.0, công suất 4.4W, thiết kế hiện đại, âm thanh rõ ràng",
        price: 800000,
        image:
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop",
        specs: {
          Power: "4.4W",
          Configuration: "2.0",
          Connection: "USB/3.5mm",
          Design: "Modern",
        },
      },
      {
        name: "Webcam Logitech C920",
        description:
          "Webcam HD 1080p, autofocus, stereo microphone, tương thích đa nền tảng",
        price: 1200000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Resolution: "1080p",
          Focus: "Autofocus",
          Audio: "Stereo",
          Compatibility: "Multi-platform",
        },
      },
    ],
    "Thiết Bị Ngoại Vi": [
      {
        name: "Máy In HP LaserJet Pro",
        description:
          "Máy in laser đơn sắc, tốc độ 30 trang/phút, kết nối WiFi, bộ nhớ 128MB",
        price: 3500000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Type: "Laser",
          Speed: "30 ppm",
          Connection: "WiFi/USB",
          Memory: "128MB",
        },
      },
      {
        name: 'Màn Hình Dell 24" FHD',
        description:
          "Màn hình 24 inch Full HD, IPS panel, 60Hz, VESA mount, thiết kế mỏng",
        price: 4500000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Size: "24 inch",
          Resolution: "1920x1080",
          Panel: "IPS",
          Refresh: "60Hz",
        },
      },
      {
        name: "Máy Scan Canon CanoScan",
        description:
          "Máy quét tài liệu, độ phân giải 4800dpi, A4 size, USB connection",
        price: 2800000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Resolution: "4800dpi",
          Size: "A4",
          Connection: "USB",
          Type: "Flatbed",
        },
      },
      {
        name: "Máy Chiếu Epson Home Cinema",
        description:
          "Máy chiếu Full HD, độ sáng 3000 lumens, kết nối HDMI, âm thanh tích hợp",
        price: 8500000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Resolution: "1920x1080",
          Brightness: "3000 lumens",
          Connection: "HDMI",
          Audio: "Built-in",
        },
      },
      {
        name: "Bàn Vẽ Wacom Intuos",
        description:
          "Bàn vẽ đồ họa, độ nhạy 4096 levels, kích thước A4, USB connection",
        price: 3200000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Pressure: "4096 levels",
          Size: "A4",
          Connection: "USB",
          Compatibility: "Windows/Mac",
        },
      },
    ],
    "Thiết Bị Mạng": [
      {
        name: "Router WiFi TP-Link Archer",
        description:
          "Router WiFi 6, tốc độ 3000Mbps, 4 anten, bảo mật WPA3, dual-band",
        price: 1800000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Standard: "WiFi 6",
          Speed: "3000Mbps",
          Antennas: "4",
          Security: "WPA3",
        },
      },
      {
        name: "Switch Cisco 8-Port",
        description:
          "Switch mạng 8 cổng Gigabit, unmanaged, plug-and-play, LED indicators",
        price: 1200000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Ports: "8 Gigabit",
          Type: "Unmanaged",
          Speed: "1Gbps",
          Power: "PoE",
        },
      },
      {
        name: "Modem VNPT Fiber",
        description: "Modem cáp quang VNPT, WiFi 5, 4 cổng LAN, hỗ trợ IPv6",
        price: 800000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Type: "Fiber",
          WiFi: "WiFi 5",
          LAN: "4 ports",
          Protocol: "IPv6",
        },
      },
      {
        name: "Access Point Ubiquiti UniFi",
        description:
          "Access Point WiFi 6, 4x4 MIMO, PoE powered, cloud management",
        price: 2500000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Standard: "WiFi 6",
          MIMO: "4x4",
          Power: "PoE",
          Management: "Cloud",
        },
      },
      {
        name: "Cáp Mạng Cat6 100m",
        description:
          "Cáp mạng Cat6, 100m, shielded, tương thích Gigabit Ethernet",
        price: 350000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Category: "Cat6",
          Length: "100m",
          Shielding: "Shielded",
          Speed: "1Gbps",
        },
      },
    ],
    "Lưu Trữ & Backup": [
      {
        name: "Ổ Cứng SSD Samsung 1TB",
        description:
          "Ổ cứng SSD Samsung 1TB, tốc độ đọc 3500MB/s, SATA III, 5 năm bảo hành",
        price: 1800000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Capacity: "1TB",
          Interface: "SATA III",
          Speed: "3500MB/s",
          Warranty: "5 years",
        },
      },
      {
        name: "USB Kingston 64GB",
        description:
          "USB 3.0 Kingston 64GB, tốc độ đọc 100MB/s, thiết kế nhỏ gọn",
        price: 250000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Capacity: "64GB",
          Interface: "USB 3.0",
          Speed: "100MB/s",
          Size: "Compact",
        },
      },
      {
        name: "Thẻ Nhớ SanDisk 128GB",
        description:
          "Thẻ nhớ microSD SanDisk 128GB, Class 10, UHS-I, tương thích đa thiết bị",
        price: 180000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Capacity: "128GB",
          Class: "Class 10",
          Standard: "UHS-I",
          Compatibility: "Multi-device",
        },
      },
      {
        name: "NAS Synology 2-Bay",
        description:
          "NAS Synology 2-bay, RAID support, 2GB RAM, dual Gigabit LAN",
        price: 4500000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Bays: "2",
          RAID: "Supported",
          RAM: "2GB",
          LAN: "Dual Gigabit",
        },
      },
      {
        name: "Ổ Cứng Ngoài WD 2TB",
        description:
          "Ổ cứng ngoài Western Digital 2TB, USB 3.0, thiết kế portable",
        price: 1200000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Capacity: "2TB",
          Interface: "USB 3.0",
          Type: "Portable",
          Brand: "Western Digital",
        },
      },
    ],
    "Phần Mềm & Bản Quyền": [
      {
        name: "Windows 11 Pro",
        description:
          "Windows 11 Pro bản quyền, hỗ trợ 64-bit, không giới hạn thiết bị",
        price: 2500000,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        specs: {
          Version: "Windows 11 Pro",
          Architecture: "64-bit",
          License: "Perpetual",
          Support: "Unlimited",
        },
      },
      {
        name: "Microsoft Office 365",
        description:
          "Microsoft Office 365 Personal, 1TB OneDrive, 5 thiết bị, 1 năm",
        price: 1200000,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        specs: {
          Plan: "Personal",
          Storage: "1TB OneDrive",
          Devices: "5",
          Duration: "1 year",
        },
      },
      {
        name: "Adobe Creative Cloud",
        description:
          "Adobe Creative Cloud All Apps, Photoshop, Illustrator, Premiere Pro",
        price: 1800000,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        specs: {
          Apps: "All Apps",
          Storage: "100GB",
          Duration: "1 year",
          Updates: "Included",
        },
      },
      {
        name: "Kaspersky Internet Security",
        description:
          "Kaspersky Internet Security 3 thiết bị, bảo vệ real-time, 1 năm",
        price: 800000,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        specs: {
          Devices: "3",
          Protection: "Real-time",
          Duration: "1 year",
          Features: "Full suite",
        },
      },
      {
        name: "AutoCAD 2024",
        description: "AutoCAD 2024 bản quyền, thiết kế 2D/3D, hỗ trợ kỹ thuật",
        price: 3500000,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        specs: {
          Version: "2024",
          Type: "2D/3D CAD",
          License: "Perpetual",
          Support: "Technical",
        },
      },
    ],
    "Dịch Vụ Công Nghệ": [
      {
        name: "Dịch Vụ Sửa Chữa Máy Tính",
        description:
          "Dịch vụ sửa chữa máy tính, laptop, PC chuyên nghiệp tại nhà",
        price: 500000,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        specs: {
          Service: "Repair",
          Location: "On-site",
          Warranty: "3 months",
          Response: "24h",
        },
      },
      {
        name: "Dịch Vụ Nâng Cấp RAM",
        description:
          "Dịch vụ nâng cấp RAM cho laptop và máy tính để bàn, bảo hành chính hãng",
        price: 300000,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
        specs: {
          Service: "RAM Upgrade",
          Warranty: "Genuine",
          Compatibility: "Checked",
          Installation: "Included",
        },
      },
      {
        name: "Dịch Vụ Thay Ổ Cứng SSD",
        description:
          "Dịch vụ thay ổ cứng HDD sang SSD tăng tốc độ, clone dữ liệu",
        price: 800000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Service: "SSD Upgrade",
          Data: "Cloned",
          Warranty: "1 year",
          Speed: "Improved",
        },
      },
      {
        name: "Dịch Vụ Cài Đặt Phần Mềm",
        description:
          "Dịch vụ cài đặt Windows, Office và các phần mềm khác, tư vấn miễn phí",
        price: 200000,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        specs: {
          Service: "Software Installation",
          Consultation: "Free",
          Support: "Remote",
          Duration: "1 day",
        },
      },
      {
        name: "Dịch Vụ Khôi Phục Dữ Liệu",
        description:
          "Dịch vụ khôi phục dữ liệu từ ổ cứng bị hỏng, tỷ lệ thành công cao",
        price: 1000000,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        specs: {
          Service: "Data Recovery",
          Success: "High rate",
          Equipment: "Professional",
          Report: "Detailed",
        },
      },
    ],
  };

  // Tạo sản phẩm cho từng nhóm thể loại
  Object.keys(productsByCategory).forEach((categoryName, categoryIndex) => {
    const categoryProducts = productsByCategory[categoryName];

    categoryProducts.forEach((product, productIndex) => {
      const now = new Date();
      const startDate = new Date(
        now.getTime() +
          (categoryIndex * 7 + productIndex * 2) * 24 * 60 * 60 * 1000
      );
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Tạo danh sách ảnh phụ cho mỗi sản phẩm
      const additionalImages = [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      ];

      // Chọn ngẫu nhiên 2-4 ảnh phụ cho mỗi sản phẩm
      const numAdditionalImages = Math.floor(Math.random() * 3) + 2; // 2-4 ảnh
      const shuffledImages = [...additionalImages].sort(
        () => 0.5 - Math.random()
      );
      const selectedAdditionalImages = shuffledImages.slice(
        0,
        numAdditionalImages
      );

      products.push({
        Product_Name: product.name,
        Description: product.description,
        Price: product.price,
        Main_Image: product.image,
        List_Image: selectedAdditionalImages, // Thêm danh sách ảnh phụ
        Images: [product.image],

        Stock: Math.floor(Math.random() * 10) + 1,
        Specifications: product.specs,
        CategoryName: categoryName, // Thêm tên category để mapping sau này
      });
    });
  });

  return products;
}

const sampleProducts = generateSampleProducts();

// Sample services data
const sampleServices = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995515.png",
    title: "Bảo Dưỡng Định Kỳ",
    description:
      "Thực hiện kiểm tra và bảo dưỡng theo định kỳ để đảm bảo xe luôn vận hành ổn định và an toàn.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995516.png",
    title: "Sửa Chữa & Đồng Sơn",
    description:
      "Khắc phục các hư hỏng, làm mới ngoại hình xe với quy trình sửa chữa và sơn tiêu chuẩn Minh Duy.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995517.png",
    title: "Nâng Cấp Hiệu Suất",
    description:
      "Cải thiện sức mạnh và khả năng vận hành của xe với các gói nâng cấp chính hãng.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995518.png",
    title: "Thay Dầu & Lọc",
    description:
      "Thay dầu động cơ và bộ lọc theo tiêu chuẩn Minh Duy để đảm bảo hiệu suất tối ưu.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995519.png",
    title: "Kiểm Tra Điện Tử",
    description:
      "Chẩn đoán và sửa chữa các vấn đề điện tử, hệ thống điều khiển với thiết bị chuyên dụng.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995520.png",
    title: "Bảo Dưỡng Phanh",
    description:
      "Kiểm tra, bảo dưỡng và thay thế hệ thống phanh để đảm bảo an toàn tối đa.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995521.png",
    title: "Lắp Đặt Phụ Kiện",
    description:
      "Lắp đặt các phụ kiện chính hãng Minh Duy với bảo hành và dịch vụ hậu mãi.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995522.png",
    title: "Tư Vấn Kỹ Thuật",
    description:
      "Tư vấn chuyên sâu về kỹ thuật, bảo dưỡng và nâng cấp xe với đội ngũ chuyên gia.",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1995/1995523.png",
    title: "Dịch Vụ Khẩn Cấp",
    description:
      "Dịch vụ cứu hộ và sửa chữa khẩn cấp 24/7 cho các trường hợp cần thiết.",
  },
];

// Sample pricing data
const samplePricing = [
  {
    title: "Lắp đặt Camera Giám Sát",
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
      { name: "Báo giá Camera Giám Sát", type: "pdf", size: "1.8MB", url: "#" },
      { name: "Catalog Camera 2024", type: "word", size: "1.2MB", url: "#" },
      { name: "Bảng giá chi tiết", type: "excel", size: "2.1MB", url: "#" },
    ],
    color: "indigo",
  },
  {
    title: "Lắp đặt Server & Network",
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
    color: "emerald",
  },
  {
    title: "Phần Mềm Quản Lý",
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
    color: "violet",
  },
  {
    title: "Bảo Trì Hệ Thống",
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
    color: "amber",
  },
  {
    title: "Thiết Kế Website",
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
    color: "sky",
  },
  {
    title: "Cloud & Backup",
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
    color: "rose",
  },
  {
    title: "Tư Vấn IT",
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
    color: "lime",
  },
  {
    title: "Bảo Mật Hệ Thống",
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
    color: "cyan",
  },
];

// Sample news events data
const sampleNewsEvents = [
  {
    Title: "Minh Duy tổ chức workshop bảo trì máy tính",
    Content:
      "Workshop bảo trì máy tính miễn phí dành cho khách hàng với các chuyên gia kỹ thuật.",
    PublishDate: new Date("2024-09-01"),
    ImageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
    Status: NEWS_STATUS.PUBLISHED,
  },
  {
    Title: "Minh Duy giới thiệu ứng dụng quản lý thiết bị",
    Content:
      "Ứng dụng Minh Duy Device Manager mới với nhiều tính năng quản lý thiết bị thuê.",
    PublishDate: new Date("2024-09-15"),
    ImageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Status: NEWS_STATUS.PUBLISHED,
  },
  {
    Title: "Minh Duy tổ chức sự kiện công nghệ gia đình",
    Content:
      "Ngày hội công nghệ gia đình với nhiều hoạt động trải nghiệm thiết bị dành cho khách hàng và người thân.",
    PublishDate: new Date("2024-08-10"),
    ImageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
    Status: NEWS_STATUS.PUBLISHED,
  },
  {
    Title: "Minh Duy khai trương trung tâm dịch vụ mới tại Hà Nội",
    Content:
      "Trung tâm dịch vụ Minh Duy tại Hà Nội cung cấp đầy đủ các dịch vụ sửa chữa, bảo hành và hỗ trợ kỹ thuật.",
    PublishDate: new Date("2024-08-20"),
    ImageUrl:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
    Status: NEWS_STATUS.PUBLISHED,
  },
  {
    Title: "Minh Duy ra mắt dịch vụ thuê MacBook cao cấp",
    Content:
      "Dịch vụ thuê MacBook cao cấp với đầy đủ phiên bản M1, M2 vừa được giới thiệu tại Việt Nam.",
    PublishDate: new Date("2024-09-01"),
    ImageUrl:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop",
    Status: NEWS_STATUS.DRAFT,
  },
  {
    Title: "Minh Duy tổ chức workshop bảo mật dữ liệu miễn phí",
    Content:
      "Khách hàng Minh Duy được tham gia workshop bảo mật dữ liệu miễn phí với các chuyên gia bảo mật hàng đầu.",
    PublishDate: new Date("2024-09-10"),
    ImageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
    Status: NEWS_STATUS.LOCKED,
  },
];

// Sample service types data
const sampleServiceTypes = [
  {
    name: "Sửa chữa",
    description: "Dịch vụ sửa chữa máy tính, laptop, thiết bị điện tử",
  },
  {
    name: "Lắp đặt",
    description: "Dịch vụ lắp đặt hệ thống mạng, camera, thiết bị",
  },
  {
    name: "Thi công",
    description: "Dịch vụ thi công hệ thống công nghệ thông tin",
  },
  {
    name: "Bảo trì",
    description: "Dịch vụ bảo trì định kỳ hệ thống",
  },
  {
    name: "Nâng cấp",
    description: "Dịch vụ nâng cấp phần cứng và phần mềm",
  },
];

// Sample booking data (renamed fields) - reference by serviceTypeName, later mapped to ObjectId
const sampleBookings = [
  {
    FullName: "Nguyễn Văn An",
    Email: "nguyenvanan@email.com",
    Phone: "0901234567",
    Address: "123 Đường ABC, Quận 1, TP.HCM",
    serviceTypeName: "Sửa chữa",
    BookingDate: new Date("2024-12-20"),
    BookingTime: "09:00",
    Notes: "Cần sửa chữa máy tính bàn",
    Status: "pending",
  },
  {
    FullName: "Trần Thị Bình",
    Email: "tranthibinh@email.com",
    Phone: "0912345678",
    Address: "456 Đường XYZ, Quận 3, TP.HCM",
    serviceTypeName: "Lắp đặt",
    BookingDate: new Date("2024-12-21"),
    BookingTime: "14:00",
    Notes: "Lắp đặt hệ thống mạng cho văn phòng",
    Status: "confirmed",
  },
  {
    FullName: "Lê Văn Cường",
    Email: "levancuong@email.com",
    Phone: "0923456789",
    Address: "789 Đường DEF, Quận 5, TP.HCM",
    serviceTypeName: "Thi công",
    BookingDate: new Date("2024-12-22"),
    BookingTime: "10:00",
    Notes: "Thi công hệ thống camera giám sát",
    Status: "completed",
  },
  {
    FullName: "Phạm Thị Dung",
    Email: "phamthidung@email.com",
    Phone: "0934567890",
    Address: "321 Đường GHI, Quận 7, TP.HCM",
    serviceTypeName: "Sửa chữa",
    BookingDate: new Date("2024-12-23"),
    BookingTime: "16:00",
    Notes: "Sửa chữa laptop bị hỏng màn hình",
    Status: "pending",
  },
  {
    FullName: "Hoàng Văn Em",
    Email: "hoangvanem@email.com",
    Phone: "0945678901",
    Address: "654 Đường JKL, Quận 10, TP.HCM",
    serviceTypeName: "Lắp đặt",
    BookingDate: new Date("2024-12-24"),
    BookingTime: "11:00",
    Notes: "Lắp đặt máy in và máy scan cho công ty",
    Status: "confirmed",
  },
];

// Migration function
async function migrate() {
  try {
    // Kiểm tra environment variables
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI chưa được cấu hình");
      return;
    }

    // Retry logic cho kết nối MongoDB
    let connected = false;
    const maxRetries = 5;
    const retryDelay = 5000;

    for (let i = 0; i < maxRetries; i++) {
      try {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        });
        connected = true;
        break;
      } catch (error) {
        console.error(
          `❌ Lỗi kết nối MongoDB lần ${i + 1}/${maxRetries}:`,
          error.message
        );
        if (i === maxRetries - 1) {
          console.error("❌ Không thể kết nối MongoDB sau nhiều lần thử");
          console.error("🔍 Chi tiết lỗi:", error);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    if (!connected) {
      console.error("❌ Không thể kết nối MongoDB");
      return;
    }

    const forceReset = process.argv.includes("--force");
    const seededCounts = {
      roles: 0,
      users: 0,
      groupCategories: 0,
      subCategories: 0,
      products: 0,
      services: 0,
      newsEvents: 0,
      pricing: 0,
      locations: 0,
      slides: 0,
      serviceTypes: 0,
      bookings: 0,
    };

    if (forceReset) {
      console.log("[MIGRATE] --force detected → clearing collections...");
      // Clear existing data
      await User.deleteMany({});
      await Role.deleteMany({});
      await RoleUser.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Service.deleteMany({});
      await NewsEvent.deleteMany({});
      await Setting.deleteMany({});
      await Location.deleteMany({});
      await Booking.deleteMany({});
      console.log("[MIGRATE] Collections cleared.");
    }

    // Kiểm tra xem dữ liệu đã tồn tại chưa
    const existingRoles = await Role.countDocuments();
    const existingUsers = await User.countDocuments();
    const existingProducts = await Product.countDocuments();

    if (
      existingRoles > 0 &&
      existingUsers > 0 &&
      existingProducts > 0 &&
      !forceReset
    ) {
      return;
    }

    // Create roles only if they don't exist
    let createdRoles = [];
    if (existingRoles === 0) {
      createdRoles = await Role.insertMany(sampleRoles);
      seededCounts.roles = createdRoles.length;
      console.log(`[MIGRATE] Seeded roles: ${seededCounts.roles}`);
    } else {
      createdRoles = await Role.find({});
    }

    const adminRole = createdRoles.find(
      (role) => role.Role_Name === USER_ROLES.ADMIN
    );
    const userRole = createdRoles.find(
      (role) => role.Role_Name === USER_ROLES.USER
    );
    const employeeRole = createdRoles.find(
      (role) => role.Role_Name === USER_ROLES.EMPLOYEE
    );

    // Create admin user only if it doesn't exist
    let adminUser = await User.findOne({ UserName: "admin" });
    if (!adminUser) {
      adminUser = new User({
        UserName: "admin",
        Password: "admin123",
        Email: "admin@minhduy.com",
        Phone: "0123456789",
        FullName: "Administrator",
        Address: "Hà Nội, Việt Nam",
        Role: USER_ROLES.ADMIN,
        LoginProvider: LOGIN_PROVIDERS.LOCAL,
      });
      await adminUser.save();
    } else {
    }

    // Create role-user relationship for admin only if it doesn't exist
    const existingAdminRoleUser = await RoleUser.findOne({
      UserID: adminUser._id,
      RoleID: adminRole._id,
    });
    if (!existingAdminRoleUser) {
      await RoleUser.create({
        UserID: adminUser._id,
        RoleID: adminRole._id,
      });
    } else {
    }

    // Create group categories only if they don't exist
    let createdGroupCategories = [];
    const existingGroupCategories = await Category.countDocuments({
      ParentID: null,
    });
    if (existingGroupCategories === 0) {
      createdGroupCategories = await Category.insertMany(sampleGroupCategories);
      seededCounts.groupCategories = createdGroupCategories.length;
      console.log(
        `[MIGRATE] Seeded group categories: ${seededCounts.groupCategories}`
      );
    } else {
      createdGroupCategories = await Category.find({ ParentID: null });
    }

    // Create sub categories with proper ParentID mapping
    let createdSubCategories = [];
    const existingSubCategories = await Category.countDocuments({
      ParentID: { $ne: null },
    });
    // Force tạo lại sub-categories nếu có --force flag
    if (existingSubCategories === 0 || forceReset) {
      // Định nghĩa sub-categories cho từng nhóm thể loại
      const subCategoriesByGroup = {
        "Laptop & Máy Tính Xách Tay": [
          "Laptop Văn Phòng",
          "Laptop Gaming",
          "Laptop Đồ Họa",
          "MacBook",
          "Laptop 2-in-1",
          "Laptop Mỏng Nhẹ",
          "Laptop Doanh Nghiệp",
          "Laptop Sinh Viên",
          "Laptop Cao Cấp",
          "Laptop Giá Rẻ",
        ],
        "Máy Tính Để Bàn": [
          "PC Gaming",
          "PC Văn Phòng",
          "PC Đồ Họa",
          "PC All-in-One",
          "PC Mini",
          "PC Workstation",
          "PC Server",
          "PC Home Theater",
          "PC Budget",
          "PC High-End",
        ],
        "Phụ Kiện Máy Tính": [
          "Bàn Phím",
          "Chuột",
          "Tai Nghe",
          "Loa",
          "Webcam",
          "Microphone",
          "Mousepad",
          "Headset Stand",
          "Cable Management",
          "Gaming Gear",
        ],
        "Thiết Bị Ngoại Vi": [
          "Máy In",
          "Màn Hình",
          "Máy Scan",
          "Máy Chiếu",
          "Bàn Vẽ",
          "Máy Fax",
          "Máy Photocopy",
          "Máy Đọc Thẻ",
          "Máy Đếm Tiền",
          "Thiết Bị Văn Phòng",
        ],
        "Thiết Bị Mạng": [
          "Router WiFi",
          "Switch",
          "Modem",
          "Access Point",
          "Cáp Mạng",
          "Card Mạng",
          "Repeater",
          "Powerline",
          "Mesh WiFi",
          "Network Storage",
        ],
        "Lưu Trữ & Backup": [
          "Ổ Cứng SSD",
          "Ổ Cứng HDD",
          "USB Flash",
          "Thẻ Nhớ",
          "NAS",
          "Ổ Cứng Ngoài",
          "Cloud Storage",
          "Tape Backup",
          "RAID Controller",
          "Storage Enclosure",
        ],
        "Phần Mềm & Bản Quyền": [
          "Hệ Điều Hành",
          "Office Suite",
          "Phần Mềm Đồ Họa",
          "Antivirus",
          "CAD Software",
          "Video Editing",
          "Audio Software",
          "Development Tools",
          "Business Software",
          "Educational Software",
        ],
        "Dịch Vụ Công Nghệ": [
          "Sửa Chữa",
          "Nâng Cấp",
          "Cài Đặt",
          "Bảo Trì",
          "Tư Vấn",
          "Khôi Phục Dữ Liệu",
          "Bảo Mật",
          "Remote Support",
          "On-site Service",
          "Training",
        ],
      };

      const subCategoriesWithParent = [];

      createdGroupCategories.forEach((group) => {
        const subCategories = subCategoriesByGroup[group.Name] || [];

        subCategories.forEach((subName, index) => {
          subCategoriesWithParent.push({
            Name: subName,
            Description: `Sub-category ${subName} thuộc ${group.Name}`,
            ParentID: group._id,
            Order: index + 1,
          });
        });
      });

      // Xóa sub-categories cũ nếu force reset
      if (forceReset && existingSubCategories > 0) {
        await Category.deleteMany({ ParentID: { $ne: null } });
      }

      createdSubCategories = await Category.insertMany(subCategoriesWithParent);
      seededCounts.subCategories = createdSubCategories.length;
      console.log(
        `[MIGRATE] Seeded sub-categories: ${seededCounts.subCategories}`
      );
    } else {
      createdSubCategories = await Category.find({ ParentID: { $ne: null } });
    }

    // Create products only if they don't exist
    let dbProducts = [];
    if (existingProducts === 0) {
      // Mapping sản phẩm với sub-categories phù hợp
      const productsWithCategories = [];

      // Lấy danh sách sub-categories theo nhóm
      const subCategoriesByGroupName = {};
      createdSubCategories.forEach((subCat) => {
        const parentGroup = createdGroupCategories.find(
          (group) => group._id.toString() === subCat.ParentID.toString()
        );
        if (parentGroup) {
          if (!subCategoriesByGroupName[parentGroup.Name]) {
            subCategoriesByGroupName[parentGroup.Name] = [];
          }
          subCategoriesByGroupName[parentGroup.Name].push(subCat);
        }
      });

      sampleProducts.forEach((product) => {
        const groupName = product.CategoryName;
        const availableSubCategories =
          subCategoriesByGroupName[groupName] || [];

        if (availableSubCategories.length > 0) {
          // Chọn sub-category phù hợp dựa trên tên sản phẩm
          let selectedSubCategory = availableSubCategories[0]; // Default

          // Logic mapping dựa trên tên sản phẩm
          const productName = product.Product_Name.toLowerCase();

          if (
            productName.includes("gaming") ||
            productName.includes("msi") ||
            productName.includes("razer")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("Gaming")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("macbook") ||
            productName.includes("apple")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("MacBook")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("office") ||
            productName.includes("business")
          ) {
            selectedSubCategory =
              availableSubCategories.find(
                (sub) =>
                  sub.Name.includes("Văn Phòng") ||
                  sub.Name.includes("Doanh Nghiệp")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("keyboard") ||
            productName.includes("bàn phím")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("Bàn Phím")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("mouse") ||
            productName.includes("chuột")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("Chuột")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("headset") ||
            productName.includes("tai nghe")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("Tai Nghe")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("speaker") ||
            productName.includes("loa")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) => sub.Name.includes("Loa")) ||
              availableSubCategories[0];
          } else if (
            productName.includes("printer") ||
            productName.includes("máy in")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("Máy In")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("monitor") ||
            productName.includes("màn hình")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("Màn Hình")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("router") ||
            productName.includes("wifi")
          ) {
            selectedSubCategory =
              availableSubCategories.find((sub) =>
                sub.Name.includes("Router")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("ssd") ||
            productName.includes("ổ cứng")
          ) {
            selectedSubCategory =
              availableSubCategories.find(
                (sub) => sub.Name.includes("SSD") || sub.Name.includes("Ổ Cứng")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("windows") ||
            productName.includes("office")
          ) {
            selectedSubCategory =
              availableSubCategories.find(
                (sub) =>
                  sub.Name.includes("Hệ Điều Hành") ||
                  sub.Name.includes("Office")
              ) || availableSubCategories[0];
          } else if (
            productName.includes("service") ||
            productName.includes("dịch vụ")
          ) {
            selectedSubCategory =
              availableSubCategories.find(
                (sub) =>
                  sub.Name.includes("Sửa Chữa") || sub.Name.includes("Dịch Vụ")
              ) || availableSubCategories[0];
          }

          productsWithCategories.push({
            ...product,
            CategoryID: selectedSubCategory._id,
            List_Image: product.List_Image || [], // Đảm bảo List_Image được giữ lại
          });
        } else {
          // Fallback nếu không tìm thấy sub-category phù hợp
          const randomSubCategory =
            createdSubCategories[
              Math.floor(Math.random() * createdSubCategories.length)
            ];
          productsWithCategories.push({
            ...product,
            CategoryID: randomSubCategory._id,
            List_Image: product.List_Image || [], // Đảm bảo List_Image được giữ lại
          });
        }
      });

      await Product.insertMany(productsWithCategories);
      seededCounts.products = productsWithCategories.length;
      console.log(`[MIGRATE] Seeded products: ${seededCounts.products}`);
    } else {
    }

    // Lấy lại danh sách sản phẩm từ DB
    dbProducts = await Product.find({});

    // Create services only if they don't exist
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      const svc = await Service.insertMany(sampleServices);
      seededCounts.services = svc.length;
      console.log(`[MIGRATE] Seeded services: ${seededCounts.services}`);
    } else {
    }

    // Create news events only if they don't exist
    const existingNewsEvents = await NewsEvent.countDocuments();
    if (existingNewsEvents === 0) {
      const ne = await NewsEvent.insertMany(sampleNewsEvents);
      seededCounts.newsEvents = ne.length;
      console.log(`[MIGRATE] Seeded news events: ${seededCounts.newsEvents}`);
    } else {
    }

    // Create users only if they don't exist
    let createdUsers = [];
    if (existingUsers === 0) {
      // Tạo từng user một để trigger pre-save middleware (hash password)
      for (const userData of sampleUsers) {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
      }
      seededCounts.users = createdUsers.length;
      console.log(`[MIGRATE] Seeded users: ${seededCounts.users}`);

      // Create role-user relationships for sample users
      for (const user of createdUsers) {
        let roleToAssign;
        if (user.Role === USER_ROLES.USER) {
          roleToAssign = userRole;
        } else if (user.Role === USER_ROLES.EMPLOYEE) {
          roleToAssign = employeeRole;
        }

        if (roleToAssign) {
          const existingRoleUser = await RoleUser.findOne({
            UserID: user._id,
            RoleID: roleToAssign._id,
          });

          if (!existingRoleUser) {
            await RoleUser.create({
              UserID: user._id,
              RoleID: roleToAssign._id,
            });
          }
        }
      }
    } else {
      createdUsers = await User.find({ UserName: { $ne: "admin" } });
    }

    // Create pricing data only if they don't exist
    const existingPricing = await Pricing.countDocuments();
    if (existingPricing === 0) {
      const pr = await Pricing.insertMany(samplePricing);
      seededCounts.pricing = pr.length;
      console.log(`[MIGRATE] Seeded pricing: ${seededCounts.pricing}`);
    } else {
    }

    // Tạo sample locations nếu chưa có
    const existingLocations = await Location.countDocuments();
    if (existingLocations === 0) {
      const loc = await Location.insertMany(sampleLocations);
      seededCounts.locations = loc.length;
      console.log(`[MIGRATE] Seeded locations: ${seededCounts.locations}`);
    } else {
    }

    // Tạo sample slides nếu chưa có
    const existingSlides = await Slide.countDocuments();
    if (existingSlides === 0) {
      const slides = await Slide.insertMany(sampleSlides);
      seededCounts.slides = slides.length;
      console.log(`[MIGRATE] Seeded slides: ${seededCounts.slides}`);
    } else {
    }

    // Create service types data only if they don't exist
    const existingServiceTypes = await ServiceType.countDocuments();
    if (existingServiceTypes === 0) {
      const st = await ServiceType.insertMany(sampleServiceTypes);
      seededCounts.serviceTypes = st.length;
      console.log(
        `[MIGRATE] Seeded service types: ${seededCounts.serviceTypes}`
      );
    } else {
    }

    // One-time migration: rename old fields if exist
    try {
      await Booking.updateMany([
        {
          $set: {
            BookingDate: { $ifNull: ["$BookingDate", "$TestDriveDate"] },
            BookingTime: { $ifNull: ["$BookingTime", "$TestDriveTime"] },
          },
        },
        { $unset: ["TestDriveDate", "TestDriveTime"] },
      ]);
    } catch (e) {
      // ignore if MongoDB version doesn't support pipeline updates
    }

    // Map CarModel text to ServiceTypes ObjectId when possible
    try {
      const allServiceTypes = await ServiceType.find({});
      const nameToId = new Map(allServiceTypes.map((s) => [s.name, s._id]));
      const docs = await Booking.find({
        ServiceTypes: { $exists: false },
        CarModel: { $exists: true },
      });
      for (const doc of docs) {
        const id = nameToId.get(doc.CarModel);
        if (id) {
          doc.ServiceTypes = id;
          doc.CarModel = undefined;
          await doc.save();
        }
      }
      // Cleanup leftover CarModel field if any
      await Booking.updateMany(
        { CarModel: { $exists: true } },
        { $unset: { CarModel: "" } }
      );
    } catch (e) {
      // best-effort migration
    }

    // Create booking data only if they don't exist
    const existingBookings = await Booking.countDocuments();
    if (existingBookings === 0) {
      const serviceTypesForSeed = await ServiceType.find({});
      const nameToIdForSeed = new Map(
        serviceTypesForSeed.map((s) => [s.name, s._id])
      );
      const fallbackId = serviceTypesForSeed[0]?._id || null;
      const sampleBookingsMapped = sampleBookings
        .map(({ serviceTypeName, ...rest }) => ({
          ...rest,
          ServiceTypes: nameToIdForSeed.get(serviceTypeName) || fallbackId,
        }))
        .filter((b) => !!b.ServiceTypes);

      if (sampleBookingsMapped.length > 0) {
        await Booking.insertMany(sampleBookingsMapped);
        seededCounts.bookings = sampleBookingsMapped.length;
        console.log(`[MIGRATE] Seeded bookings: ${seededCounts.bookings}`);
      }
    } else {
    }

    // Tạo/cập nhật settings mẫu
    const settingsData = {
      companyName: "Minh Duy",
      phone: "0123456333",
      email: "info@minhduy.com",
      workingHours: "08:00 - 18:00 (Thứ 2 - Thứ 7)",
      logo: "/images/logo.png",
      facebook: "https://www.facebook.com/minhduyqnam",
      youtube: "https://youtube.com",
      tiktok: "https://tiktok.com/@minhduy",
      zaloUrl: "https://zalo.me/0123456333",
      facebookMessengerUrl: "https://m.me/minhduyqnam",
      description:
        "Công ty thiết bị công nghệ hàng đầu tại Việt Nam, chuyên cung cấp thiết bị công nghệ chất lượng cao với dịch vụ bảo hành, bảo trì chuyên nghiệp. Trải nghiệm công nghệ tiên tiến với đội ngũ tư vấn chuyên nghiệp và giá cả cạnh tranh.",
      keywords: "laptop, máy tính, thiết bị công nghệ",
    };
    const existingSetting = await Setting.findOne();
    if (!existingSetting) {
      await Setting.create(settingsData);
    } else {
      Object.assign(existingSetting, settingsData);
      await existingSetting.save();
    }

    // Summary
    const [
      rolesCount,
      usersCount,
      serviceTypesCount,
      bookingsCount,
      productsCount,
      categoriesCount,
    ] = await Promise.all([
      Role.countDocuments(),
      User.countDocuments(),
      ServiceType.countDocuments(),
      Booking.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
    ]);
    console.log(
      `[MIGRATE] Seeded counts → roles=${seededCounts.roles}, users=${
        seededCounts.users
      }, serviceTypes=${seededCounts.serviceTypes}, bookings=${
        seededCounts.bookings
      }, products=${seededCounts.products}, categories(group+sub)=${
        seededCounts.groupCategories + seededCounts.subCategories
      }, services=${seededCounts.services}, newsEvents=${
        seededCounts.newsEvents
      }, pricing=${seededCounts.pricing}, locations=${
        seededCounts.locations
      }, slides=${seededCounts.slides}`
    );
    console.log(
      `[MIGRATE] Summary (DB totals) → roles=${rolesCount}, users=${usersCount}, serviceTypes=${serviceTypesCount}, bookings=${bookingsCount}, products=${productsCount}, categories=${categoriesCount}`
    );
    const bookingBreakdown = await Booking.aggregate([
      { $group: { _id: "$Status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    console.log(
      `[MIGRATE] Bookings by status: ${JSON.stringify(bookingBreakdown)}`
    );
    // end
  } catch (error) {
    console.error("❌ Lỗi trong quá trình migration:", error.message);
    console.error("🔍 Chi tiết lỗi:", error);

    if (error.message.includes("MONGO_URI")) {
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Run migration
migrate();
