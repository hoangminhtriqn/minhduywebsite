const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import all models
const User = require("./models/User");
const Role = require("./models/Role");
const RoleUser = require("./models/RoleUser");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Service = require("./models/Service");
const NewsEvent = require("./models/NewsEvent");

const Pricing = require("./models/Pricing");
const Location = require("./models/Location");
const Setting = require("./models/Setting");
const Booking = require("./models/Booking");
const ServiceType = require("./models/ServiceType");

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

// Sample data
const sampleRoles = [
  {
    Role_Name: "admin",
    Role_Description: "Quản trị viên hệ thống",
    Permissions: [
      "read:products",
      "write:products",
      "read:categories",
      "write:categories",
      "read:users",
      "write:users",
      "read:orders",
      "write:orders",
      "read:roles",
      "write:roles",
    ],
    Status: "active",
  },
  {
    Role_Name: "user",
    Role_Description: "Người dùng thông thường",
    Permissions: ["read:products", "read:categories"],
    Status: "active",
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
    Status: "active",
    Order: 1,
  },
  {
    Name: "Máy Tính Để Bàn",
    Description: "PC gaming, văn phòng, đồ họa",
    Icon: "🖥️",
    Image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
    Status: "active",
    Order: 2,
  },
  {
    Name: "Phụ Kiện Máy Tính",
    Description: "Bàn phím, chuột, tai nghe, loa",
    Icon: "⌨️",
    Image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
    Status: "active",
    Order: 3,
  },
  {
    Name: "Thiết Bị Ngoại Vi",
    Description: "Máy in, máy scan, màn hình, máy chiếu",
    Icon: "🖨️",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Status: "active",
    Order: 4,
  },
  {
    Name: "Thiết Bị Mạng",
    Description: "Router, switch, modem, access point",
    Icon: "🌐",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Status: "active",
    Order: 5,
  },
  {
    Name: "Lưu Trữ & Backup",
    Description: "Ổ cứng, USB, thẻ nhớ, NAS",
    Icon: "💾",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Status: "active",
    Order: 6,
  },
  {
    Name: "Phần Mềm & Bản Quyền",
    Description: "Windows, Office, antivirus, design software",
    Icon: "🛡️",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Status: "active",
    Order: 7,
  },
  {
    Name: "Dịch Vụ Công Nghệ",
    Description: "Sửa chữa, bảo hành, nâng cấp, tư vấn",
    Icon: "🔧",
    Image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Status: "active",
    Order: 8,
  },
];

// Sample users data
const sampleUsers = [
  {
    UserName: "user1",
    Password: "password123",
    Email: "user1@example.com",
    Phone: "0123456781",
    FullName: "Nguyễn Văn An",
    Address: "Hà Nội, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user2",
    Password: "password123",
    Email: "user2@example.com",
    Phone: "0123456782",
    FullName: "Trần Thị Bình",
    Address: "TP.HCM, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user3",
    Password: "password123",
    Email: "user3@example.com",
    Phone: "0123456783",
    FullName: "Lê Văn Cường",
    Address: "Đà Nẵng, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user4",
    Password: "password123",
    Email: "user4@example.com",
    Phone: "0123456784",
    FullName: "Phạm Thị Dung",
    Address: "Hải Phòng, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user5",
    Password: "password123",
    Email: "user5@example.com",
    Phone: "0123456785",
    FullName: "Hoàng Văn Em",
    Address: "Cần Thơ, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user6",
    Password: "password123",
    Email: "user6@example.com",
    Phone: "0123456786",
    FullName: "Vũ Thị Phương",
    Address: "Nha Trang, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user7",
    Password: "password123",
    Email: "user7@example.com",
    Phone: "0123456787",
    FullName: "Đỗ Văn Giang",
    Address: "Huế, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user8",
    Password: "password123",
    Email: "user8@example.com",
    Phone: "0123456788",
    FullName: "Ngô Thị Hoa",
    Address: "Vũng Tàu, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user9",
    Password: "password123",
    Email: "user9@example.com",
    Phone: "0123456789",
    FullName: "Lý Văn Inh",
    Address: "Bình Dương, Việt Nam",
    Role: "user",
    Status: "active",
  },
  {
    UserName: "user10",
    Password: "password123",
    Email: "user10@example.com",
    Phone: "0123456790",
    FullName: "Trịnh Thị Kim",
    Address: "Đồng Nai, Việt Nam",
    Role: "user",
    Status: "active",
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
        Status: Math.random() < 0.85 ? "active" : "inactive", // 85% còn kinh doanh, 15% ngừng kinh doanh
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
      isFeatured: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995516.png",
      title: "Sửa Chữa & Đồng Sơn",
      description:
        "Khắc phục các hư hỏng, làm mới ngoại hình xe với quy trình sửa chữa và sơn tiêu chuẩn Minh Duy.",
      isFeatured: true,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995517.png",
      title: "Nâng Cấp Hiệu Suất",
      description:
        "Cải thiện sức mạnh và khả năng vận hành của xe với các gói nâng cấp chính hãng.",
      isFeatured: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995518.png",
      title: "Thay Dầu & Lọc",
      description:
        "Thay dầu động cơ và bộ lọc theo tiêu chuẩn Minh Duy để đảm bảo hiệu suất tối ưu.",
      isFeatured: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995519.png",
      title: "Kiểm Tra Điện Tử",
      description:
        "Chẩn đoán và sửa chữa các vấn đề điện tử, hệ thống điều khiển với thiết bị chuyên dụng.",
      isFeatured: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995520.png",
      title: "Bảo Dưỡng Phanh",
      description:
        "Kiểm tra, bảo dưỡng và thay thế hệ thống phanh để đảm bảo an toàn tối đa.",
      isFeatured: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995521.png",
      title: "Lắp Đặt Phụ Kiện",
      description:
        "Lắp đặt các phụ kiện chính hãng Minh Duy với bảo hành và dịch vụ hậu mãi.",
      isFeatured: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995522.png",
      title: "Tư Vấn Kỹ Thuật",
      description:
        "Tư vấn chuyên sâu về kỹ thuật, bảo dưỡng và nâng cấp xe với đội ngũ chuyên gia.",
      isFeatured: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1995/1995523.png",
      title: "Dịch Vụ Khẩn Cấp",
      description:
        "Dịch vụ cứu hộ và sửa chữa khẩn cấp 24/7 cho các trường hợp cần thiết.",
      isFeatured: false,
    },
  ];

// Sample pricing data
const samplePricing = [
  {
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
      { name: "Báo giá Camera Giám Sát", type: "pdf", size: "1.8MB", url: "#" },
      { name: "Catalog Camera 2024", type: "word", size: "1.2MB", url: "#" },
      { name: "Bảng giá chi tiết", type: "excel", size: "2.1MB", url: "#" },
    ],
    color: "indigo",
    order: 1,
  },
  {
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
    color: "emerald",
    order: 2,
  },
  {
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
    color: "violet",
    order: 3,
  },
  {
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
    color: "amber",
    order: 4,
  },
  {
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
    color: "sky",
    order: 5,
  },
  {
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
    color: "rose",
    order: 6,
  },
  {
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
    color: "lime",
    order: 7,
  },
  {
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
    color: "cyan",
    order: 8,
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
    Status: "published",
  },
  {
    Title: "Minh Duy giới thiệu ứng dụng quản lý thiết bị",
    Content:
      "Ứng dụng Minh Duy Device Manager mới với nhiều tính năng quản lý thiết bị thuê.",
    PublishDate: new Date("2024-09-15"),
    ImageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    Status: "published",
  },
  {
    Title: "Minh Duy tổ chức sự kiện công nghệ gia đình",
    Content:
      "Ngày hội công nghệ gia đình với nhiều hoạt động trải nghiệm thiết bị dành cho khách hàng và người thân.",
    PublishDate: new Date("2024-08-10"),
    ImageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
    Status: "published",
  },
  {
    Title: "Minh Duy khai trương trung tâm dịch vụ mới tại Hà Nội",
    Content:
      "Trung tâm dịch vụ Minh Duy tại Hà Nội cung cấp đầy đủ các dịch vụ sửa chữa, bảo hành và hỗ trợ kỹ thuật.",
    PublishDate: new Date("2024-08-20"),
    ImageUrl:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop",
    Status: "published",
  },
  {
    Title: "Minh Duy ra mắt dịch vụ thuê MacBook cao cấp",
    Content:
      "Dịch vụ thuê MacBook cao cấp với đầy đủ phiên bản M1, M2 vừa được giới thiệu tại Việt Nam.",
    PublishDate: new Date("2024-09-01"),
    ImageUrl:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop",
    Status: "published",
  },
  {
    Title: "Minh Duy tổ chức workshop bảo mật dữ liệu miễn phí",
    Content:
      "Khách hàng Minh Duy được tham gia workshop bảo mật dữ liệu miễn phí với các chuyên gia bảo mật hàng đầu.",
    PublishDate: new Date("2024-09-10"),
    ImageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
    Status: "published",
  },
];

// Sample service types data
const sampleServiceTypes = [
  {
    name: "Sửa chữa",
    description: "Dịch vụ sửa chữa máy tính, laptop, thiết bị điện tử",
    status: "active",
  },
  {
    name: "Lắp đặt",
    description: "Dịch vụ lắp đặt hệ thống mạng, camera, thiết bị",
    status: "active",
  },
  {
    name: "Thi công",
    description: "Dịch vụ thi công hệ thống công nghệ thông tin",
    status: "active",
  },
  {
    name: "Bảo trì",
    description: "Dịch vụ bảo trì định kỳ hệ thống",
    status: "active",
  },
  {
    name: "Nâng cấp",
    description: "Dịch vụ nâng cấp phần cứng và phần mềm",
    status: "active",
  },
];

// Sample booking data
const sampleBookings = [
  {
    FullName: "Nguyễn Văn An",
    Email: "nguyenvanan@email.com",
    Phone: "0901234567",
    Address: "123 Đường ABC, Quận 1, TP.HCM",
    CarModel: "Sửa chữa",
    TestDriveDate: new Date("2024-12-20"),
    TestDriveTime: "09:00",
    Notes: "Cần sửa chữa máy tính bàn",
    Status: "pending",
  },
  {
    FullName: "Trần Thị Bình",
    Email: "tranthibinh@email.com",
    Phone: "0912345678",
    Address: "456 Đường XYZ, Quận 3, TP.HCM",
    CarModel: "Lắp đặt",
    TestDriveDate: new Date("2024-12-21"),
    TestDriveTime: "14:00",
    Notes: "Lắp đặt hệ thống mạng cho văn phòng",
    Status: "confirmed",
  },
  {
    FullName: "Lê Văn Cường",
    Email: "levancuong@email.com",
    Phone: "0923456789",
    Address: "789 Đường DEF, Quận 5, TP.HCM",
    CarModel: "Thi công",
    TestDriveDate: new Date("2024-12-22"),
    TestDriveTime: "10:00",
    Notes: "Thi công hệ thống camera giám sát",
    Status: "completed",
  },
  {
    FullName: "Phạm Thị Dung",
    Email: "phamthidung@email.com",
    Phone: "0934567890",
    Address: "321 Đường GHI, Quận 7, TP.HCM",
    CarModel: "Sửa chữa",
    TestDriveDate: new Date("2024-12-23"),
    TestDriveTime: "16:00",
    Notes: "Sửa chữa laptop bị hỏng màn hình",
    Status: "pending",
  },
  {
    FullName: "Hoàng Văn Em",
    Email: "hoangvanem@email.com",
    Phone: "0945678901",
    Address: "654 Đường JKL, Quận 10, TP.HCM",
    CarModel: "Lắp đặt",
    TestDriveDate: new Date("2024-12-24"),
    TestDriveTime: "11:00",
    Notes: "Lắp đặt máy in và máy scan cho công ty",
    Status: "confirmed",
  },
];

// Migration function
async function migrate() {
  try {
    console.log("🚀 Bắt đầu migration...");

    // Kiểm tra environment variables
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI chưa được cấu hình");
      console.log("💡 Hãy thêm MONGO_URI vào environment variables");
      return;
    }

    console.log("📡 Kết nối MongoDB...");

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
        console.log("✅ Kết nối MongoDB thành công");
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
        console.log(`⏳ Chờ ${retryDelay / 1000}s trước khi thử lại...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    if (!connected) {
      console.error("❌ Không thể kết nối MongoDB");
      return;
    }

    const forceReset = process.argv.includes("--force");

    if (forceReset) {
      console.log("🗑️  Xóa dữ liệu cũ...");
      // Clear existing data
      await User.deleteMany({});
      await Role.deleteMany({});
      await RoleUser.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Service.deleteMany({});
      await NewsEvent.deleteMany({});

      await Location.deleteMany({});
      console.log("✅ Đã xóa dữ liệu cũ");
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
      console.log("✅ Dữ liệu đã tồn tại, bỏ qua migration");
      console.log(
        `📊 Dữ liệu hiện có: ${existingRoles} roles, ${existingUsers} users, ${existingProducts} products`
      );
      return;
    }

    console.log("👥 Tạo roles...");
    // Create roles only if they don't exist
    let createdRoles = [];
    if (existingRoles === 0) {
      createdRoles = await Role.insertMany(sampleRoles);
      console.log("✅ Đã tạo roles");
    } else {
      createdRoles = await Role.find({});
      console.log("✅ Roles đã tồn tại");
    }

    const adminRole = createdRoles.find((role) => role.Role_Name === "admin");
    const userRole = createdRoles.find((role) => role.Role_Name === "user");

    console.log("👤 Tạo admin user...");
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
        Role: "admin",
        Status: "active",
      });
      await adminUser.save();
      console.log("✅ Đã tạo admin user");
    } else {
      console.log("✅ Admin user đã tồn tại");
    }

    console.log("🔗 Tạo role-user relationship...");
    // Create role-user relationship for admin only if it doesn't exist
    const existingRoleUser = await RoleUser.findOne({
      UserID: adminUser._id,
      RoleID: adminRole._id,
    });
    if (!existingRoleUser) {
      await RoleUser.create({
        UserID: adminUser._id,
        RoleID: adminRole._id,
        Status: "active",
      });
      console.log("✅ Đã tạo role-user relationship");
    } else {
      console.log("✅ Role-user relationship đã tồn tại");
    }

    console.log("📂 Tạo group categories...");
    // Create group categories only if they don't exist
    let createdGroupCategories = [];
    const existingGroupCategories = await Category.countDocuments({
      ParentID: null,
    });
    if (existingGroupCategories === 0) {
      createdGroupCategories = await Category.insertMany(sampleGroupCategories);
      console.log("✅ Đã tạo group categories");
    } else {
      createdGroupCategories = await Category.find({ ParentID: null });
      console.log("✅ Group categories đã tồn tại");
    }

    console.log("📁 Tạo sub categories...");
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
            Status: "active",
            Order: index + 1,
          });
        });
      });

      // Xóa sub-categories cũ nếu force reset
      if (forceReset && existingSubCategories > 0) {
        await Category.deleteMany({ ParentID: { $ne: null } });
        console.log("🗑️ Đã xóa sub-categories cũ");
      }

      createdSubCategories = await Category.insertMany(subCategoriesWithParent);
      console.log("✅ Đã tạo sub categories");
    } else {
      createdSubCategories = await Category.find({ ParentID: { $ne: null } });
      console.log("✅ Sub categories đã tồn tại");
    }

    console.log("💻 Tạo products...");
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
      console.log("✅ Đã tạo products");
    } else {
      console.log("✅ Products đã tồn tại");
    }

    // Lấy lại danh sách sản phẩm từ DB
    dbProducts = await Product.find({});

    console.log("🔧 Tạo services...");
    // Create services only if they don't exist
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      await Service.insertMany(sampleServices);
      console.log("✅ Đã tạo services");
    } else {
      console.log("✅ Services đã tồn tại");
    }

    console.log("📰 Tạo news events...");
    // Create news events only if they don't exist
    const existingNewsEvents = await NewsEvent.countDocuments();
    if (existingNewsEvents === 0) {
      await NewsEvent.insertMany(sampleNewsEvents);
      console.log("✅ Đã tạo news events");
    } else {
      console.log("✅ News events đã tồn tại");
    }

    console.log("👥 Tạo users...");
    // Create users only if they don't exist
    let createdUsers = [];
    if (existingUsers === 0) {
      createdUsers = await User.insertMany(sampleUsers);
      console.log("✅ Đã tạo users");
    } else {
      createdUsers = await User.find({ UserName: { $ne: "admin" } });
      console.log("✅ Users đã tồn tại");
    }

    console.log("💰 Tạo pricing data...");
    // Create pricing data only if they don't exist
    const existingPricing = await Pricing.countDocuments();
    if (existingPricing === 0) {
      await Pricing.insertMany(samplePricing);
      console.log("✅ Đã tạo pricing data");
    } else {
      console.log("✅ Pricing data đã tồn tại");
    }

    // Tạo sample locations nếu chưa có
    const existingLocations = await Location.countDocuments();
    if (existingLocations === 0) {
      await Location.insertMany(sampleLocations);
      console.log("✅ Đã tạo sample locations");
    } else {
      console.log("✅ Locations đã tồn tại");
    }

    console.log("🔧 Tạo service types data...");
    // Create service types data only if they don't exist
    const existingServiceTypes = await ServiceType.countDocuments();
    if (existingServiceTypes === 0) {
      await ServiceType.insertMany(sampleServiceTypes);
      console.log("✅ Đã tạo service types data");
    } else {
      console.log("✅ Service types data đã tồn tại");
    }

    console.log("📅 Tạo booking data...");
    // Create booking data only if they don't exist
    const existingBookings = await Booking.countDocuments();
    if (existingBookings === 0) {
      await Booking.insertMany(sampleBookings);
      console.log("✅ Đã tạo booking data");
    } else {
      console.log("✅ Booking data đã tồn tại");
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
      description:
        "Công ty thiết bị công nghệ hàng đầu tại Việt Nam, chuyên cung cấp thiết bị công nghệ chất lượng cao với dịch vụ bảo hành, bảo trì chuyên nghiệp. Trải nghiệm công nghệ tiên tiến với đội ngũ tư vấn chuyên nghiệp và giá cả cạnh tranh.",
      keywords: "laptop, máy tính, thiết bị công nghệ",
    };
    const existingSetting = await Setting.findOne();
    if (!existingSetting) {
      await Setting.create(settingsData);
      console.log("✅ Đã tạo settings mẫu");
    } else {
      Object.assign(existingSetting, settingsData);
      await existingSetting.save();
      console.log("✅ Đã cập nhật settings mẫu");
    }

    console.log("🎉 Migration hoàn thành thành công!");
    console.log("📊 Dữ liệu đã được tạo:");
    console.log(`   - ${createdRoles.length} roles`);
    console.log(`   - ${createdGroupCategories.length} group categories`);
    console.log(`   - ${createdSubCategories.length} sub categories`);
    console.log(`   - ${dbProducts.length} products`);
    console.log(`   - ${sampleServices.length} services`);
    console.log(`   - ${sampleNewsEvents.length} news events`);
    console.log(`   - ${createdUsers.length} users`);

    console.log(
      `   - ${
        existingPricing === 0 ? samplePricing.length : existingPricing
      } pricing items`
    );
    console.log(
      `   - ${
        existingServiceTypes === 0
          ? sampleServiceTypes.length
          : existingServiceTypes
      } service types`
    );
    console.log(
      `   - ${
        existingBookings === 0 ? sampleBookings.length : existingBookings
      } booking items`
    );
  } catch (error) {
    console.error("❌ Lỗi trong quá trình migration:", error.message);
    console.error("🔍 Chi tiết lỗi:", error);

    if (error.message.includes("MONGO_URI")) {
      console.log("\n💡 Hướng dẫn sửa lỗi:");
      console.log("1. Kiểm tra file .env có tồn tại không");
      console.log("2. Đảm bảo MONGO_URI được cấu hình đúng");
      console.log(
        "3. Ví dụ: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database"
      );
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("🔌 Đã ngắt kết nối MongoDB");
    }
  }
}

// Run migration
migrate();
