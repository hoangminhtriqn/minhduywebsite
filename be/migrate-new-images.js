const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import all models
const User = require('./models/User');
const Role = require('./models/Role');
const RoleUser = require('./models/RoleUser');
const ProductCategory = require('./models/ProductCategory');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Service = require('./models/Service');
const NewsEvent = require('./models/NewsEvent');
const DeviceRental = require('./models/OrderTestDrive');

// Sample data
const sampleRoles = [
  {
    Role_Name: 'admin',
    Role_Description: 'Quản trị viên hệ thống',
    Permissions: [
      'read:products', 'write:products',
      'read:categories', 'write:categories',
      'read:users', 'write:users',
      'read:orders', 'write:orders',
      'read:roles', 'write:roles'
    ],
    Status: 'active'
  },
  {
    Role_Name: 'user',
    Role_Description: 'Người dùng thông thường',
    Permissions: ['read:products', 'read:categories'],
    Status: 'active'
  }
];

// Group Categories (Cấp cha)
const sampleGroupCategories = [
  {
    Name: 'Laptop & Máy Tính Xách Tay',
    Description: 'Các loại laptop và máy tính xách tay',
    Icon: '💻',
    Image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 1
  },
  {
    Name: 'Máy Tính Để Bàn',
    Description: 'PC gaming, văn phòng, đồ họa',
    Icon: '🖥️',
    Image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 2
  },
  {
    Name: 'Phụ Kiện Máy Tính',
    Description: 'Bàn phím, chuột, tai nghe, loa',
    Icon: '⌨️',
    Image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 3
  },
  {
    Name: 'Thiết Bị Ngoại Vi',
    Description: 'Máy in, máy scan, màn hình, máy chiếu',
    Icon: '🖨️',
    Image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 4
  },
  {
    Name: 'Thiết Bị Mạng',
    Description: 'Router, switch, modem, access point',
    Icon: '🌐',
    Image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 5
  },
  {
    Name: 'Lưu Trữ & Backup',
    Description: 'Ổ cứng, USB, thẻ nhớ, NAS',
    Icon: '💾',
    Image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 6
  },
  {
    Name: 'Phần Mềm & Bản Quyền',
    Description: 'Windows, Office, antivirus, design software',
    Icon: '🛡️',
    Image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 7
  },
  {
    Name: 'Dịch Vụ Công Nghệ',
    Description: 'Sửa chữa, bảo hành, nâng cấp, tư vấn',
    Icon: '🔧',
    Image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 8
  }
];

// Sample users data
const sampleUsers = [
  {
    UserName: 'user1',
    Password: 'password123',
    Email: 'user1@example.com',
    Phone: '0123456781',
    FullName: 'Nguyễn Văn An',
    Address: 'Hà Nội, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user2',
    Password: 'password123',
    Email: 'user2@example.com',
    Phone: '0123456782',
    FullName: 'Trần Thị Bình',
    Address: 'TP.HCM, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user3',
    Password: 'password123',
    Email: 'user3@example.com',
    Phone: '0123456783',
    FullName: 'Lê Văn Cường',
    Address: 'Đà Nẵng, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user4',
    Password: 'password123',
    Email: 'user4@example.com',
    Phone: '0123456784',
    FullName: 'Phạm Thị Dung',
    Address: 'Hải Phòng, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user5',
    Password: 'password123',
    Email: 'user5@example.com',
    Phone: '0123456785',
    FullName: 'Hoàng Văn Em',
    Address: 'Cần Thơ, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user6',
    Password: 'password123',
    Email: 'user6@example.com',
    Phone: '0123456786',
    FullName: 'Vũ Thị Phương',
    Address: 'Nha Trang, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user7',
    Password: 'password123',
    Email: 'user7@example.com',
    Phone: '0123456787',
    FullName: 'Đỗ Văn Giang',
    Address: 'Huế, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user8',
    Password: 'password123',
    Email: 'user8@example.com',
    Phone: '0123456788',
    FullName: 'Ngô Thị Hoa',
    Address: 'Vũng Tàu, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user9',
    Password: 'password123',
    Email: 'user9@example.com',
    Phone: '0123456789',
    FullName: 'Lý Văn Inh',
    Address: 'Bình Dương, Việt Nam',
    Role: 'user',
    Status: 'active'
  },
  {
    UserName: 'user10',
    Password: 'password123',
    Email: 'user10@example.com',
    Phone: '0123456790',
    FullName: 'Trịnh Thị Kim',
    Address: 'Đồng Nai, Việt Nam',
    Role: 'user',
    Status: 'active'
  }
];

// Sample products data with diverse images
function generateSampleProducts() {
  const products = [];
  const deviceNames = [
    'Laptop Dell Inspiron 15 3000',
    'Laptop HP Pavilion 14',
    'Laptop Lenovo ThinkPad E14',
    'Laptop Asus VivoBook 15',
    'Laptop Acer Aspire 5',
    'MacBook Air M1',
    'MacBook Pro M2',
    'Laptop MSI Gaming GF63',
    'Laptop Razer Blade 15',
    'PC Gaming Dell Alienware',
    'PC HP Pavilion Desktop',
    'PC Lenovo ThinkCentre',
    'PC Asus ROG Strix',
    'PC Acer Aspire TC',
    'PC Mini Intel NUC',
    'PC All-in-One Dell',
    'Bàn Phím Cơ Logitech G Pro',
    'Chuột Gaming Razer DeathAdder',
    'Tai Nghe Gaming HyperX Cloud',
    'Loa Máy Tính Creative Pebble'
  ];

  const descriptions = [
    'Laptop Dell Inspiron 15 3000 - Laptop văn phòng hiệu suất cao, màn hình 15.6 inch, Intel Core i5, RAM 8GB, SSD 256GB',
    'Laptop HP Pavilion 14 - Laptop mỏng nhẹ, thiết kế hiện đại, màn hình 14 inch, AMD Ryzen 5, RAM 8GB, SSD 512GB',
    'Laptop Lenovo ThinkPad E14 - Laptop doanh nghiệp bền bỉ, màn hình 14 inch, Intel Core i7, RAM 16GB, SSD 512GB',
    'Laptop Asus VivoBook 15 - Laptop đa nhiệm, màn hình 15.6 inch, Intel Core i5, RAM 8GB, HDD 1TB',
    'Laptop Acer Aspire 5 - Laptop giá rẻ hiệu suất tốt, màn hình 15.6 inch, AMD Ryzen 3, RAM 4GB, HDD 500GB',
    'MacBook Air M1 - Laptop Apple cao cấp, chip M1, màn hình 13.3 inch Retina, RAM 8GB, SSD 256GB',
    'MacBook Pro M2 - Laptop Apple chuyên nghiệp, chip M2, màn hình 13.3 inch Retina, RAM 16GB, SSD 512GB',
    'Laptop MSI Gaming GF63 - Laptop gaming hiệu suất cao, màn hình 15.6 inch, Intel Core i7, RAM 16GB, RTX 3060',
    'Laptop Razer Blade 15 - Laptop gaming cao cấp, màn hình 15.6 inch 144Hz, Intel Core i9, RAM 32GB, RTX 3080',
    'PC Gaming Dell Alienware - Máy tính gaming cao cấp, Intel Core i9, RAM 32GB, RTX 4080, SSD 2TB',
    'PC HP Pavilion Desktop - Máy tính văn phòng, Intel Core i5, RAM 8GB, HDD 1TB, Windows 11',
    'PC Lenovo ThinkCentre - Máy tính doanh nghiệp, Intel Core i7, RAM 16GB, SSD 512GB, bảo mật cao',
    'PC Asus ROG Strix - Máy tính gaming ASUS, AMD Ryzen 9, RAM 32GB, RTX 4070, RGB lighting',
    'PC Acer Aspire TC - Máy tính gia đình, Intel Core i3, RAM 4GB, HDD 500GB, giá rẻ',
    'PC Mini Intel NUC - Máy tính mini công suất cao, Intel Core i7, RAM 16GB, SSD 512GB, tiết kiệm không gian',
    'PC All-in-One Dell - Máy tính all-in-one, màn hình 24 inch, Intel Core i5, RAM 8GB, tích hợp webcam',
    'Bàn Phím Cơ Logitech G Pro - Bàn phím cơ gaming, switch Cherry MX Blue, RGB backlight, có dây',
    'Chuột Gaming Razer DeathAdder - Chuột gaming chuyên nghiệp, 16,000 DPI, 7 nút có thể lập trình',
    'Tai Nghe Gaming HyperX Cloud - Tai nghe gaming chất lượng cao, âm thanh surround 7.1, microphone detachable',
    'Loa Máy Tính Creative Pebble - Loa máy tính 2.0, công suất 4.4W, thiết kế hiện đại, âm thanh rõ ràng'
  ];

  const prices = [
    15000000, 18000000, 22000000, 16000000, 12000000,
    25000000, 35000000, 28000000, 45000000, 35000000,
    12000000, 20000000, 25000000, 18000000, 8000000,
    15000000, 2500000, 1500000, 2000000, 800000
  ];

  // Diverse computer equipment images
  const images = [
    // Laptop images - Dell, HP, Lenovo, Asus, Acer
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', // Dell Inspiron
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', // HP Pavilion
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', // Lenovo ThinkPad
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', // Asus VivoBook
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', // Acer Aspire
    // MacBook images
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop', // MacBook Air
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop', // MacBook Pro
    // Gaming Laptop images
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // MSI Gaming
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // Razer Blade
    // Desktop PC images - Gaming & Office
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // Dell Alienware
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // HP Pavilion Desktop
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // Lenovo ThinkCentre
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // Asus ROG
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // Acer Aspire TC
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // Intel NUC
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop', // Dell All-in-One
    // Accessories images - Keyboard, Mouse, Headset, Speakers
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop', // Logitech Keyboard
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop', // Razer Mouse
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop', // HyperX Headset
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop'  // Creative Speakers
  ];

  for (let i = 0; i < deviceNames.length; i++) {
    const now = new Date();
    const startDate = new Date(now.getTime() + (i * 7) * 24 * 60 * 60 * 1000); // Mỗi thiết bị cách nhau 7 ngày
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Kéo dài 30 ngày
    
    products.push({
      Product_Name: deviceNames[i],
      Description: descriptions[i],
      Price: prices[i],
      Main_Image: images[i],
      Images: [images[i]],
      RentalStartDate: startDate,
      RentalEndDate: endDate,
      Stock: Math.floor(Math.random() * 10) + 1,
      Specifications: {
        Processor: 'Intel Core i5',
        RAM: '8GB DDR4',
        Storage: '256GB SSD',
        Display: '15.6 inch FHD',
        Graphics: 'Integrated',
        OS: 'Windows 11'
      },
      Status: 'active'
    });
  }

  return products;
}

const sampleProducts = generateSampleProducts();

// Sample services data with computer-related images
const sampleServices = [
  {
    Name: 'Sửa chữa máy tính',
    Description: 'Dịch vụ sửa chữa máy tính, laptop, PC chuyên nghiệp',
    Price: 500000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop'
  },
  {
    Name: 'Nâng cấp RAM',
    Description: 'Dịch vụ nâng cấp RAM cho laptop và máy tính để bàn',
    Price: 300000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop'
  },
  {
    Name: 'Thay ổ cứng SSD',
    Description: 'Dịch vụ thay ổ cứng HDD sang SSD tăng tốc độ',
    Price: 800000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
  },
  {
    Name: 'Cài đặt phần mềm',
    Description: 'Dịch vụ cài đặt Windows, Office và các phần mềm khác',
    Price: 200000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop'
  },
  {
    Name: 'Khôi phục dữ liệu',
    Description: 'Dịch vụ khôi phục dữ liệu từ ổ cứng bị hỏng',
    Price: 1000000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
  }
];

// Sample news events data with computer-related images
const sampleNewsEvents = [
  {
    Title: 'Minh Duy Technology ra mắt dịch vụ thuê thiết bị công nghệ',
    Content: 'Minh Duy Technology vừa giới thiệu dịch vụ thuê thiết bị công nghệ với đầy đủ laptop, PC, phụ kiện và dịch vụ hỗ trợ.',
    PublishDate: new Date('2024-06-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy tổ chức sự kiện trải nghiệm thiết bị công nghệ',
    Content: 'Sự kiện trải nghiệm thiết bị công nghệ dành cho khách hàng với nhiều mẫu laptop, PC mới nhất.',
    PublishDate: new Date('2024-06-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy khai trương showroom công nghệ mới tại Đà Nẵng',
    Content: 'Showroom công nghệ Minh Duy mới tại Đà Nẵng với diện tích 500m2, trưng bày đầy đủ các thiết bị công nghệ.',
    PublishDate: new Date('2024-07-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy giới thiệu dịch vụ IT Support 24/7',
    Content: 'Minh Duy vừa giới thiệu dịch vụ IT Support 24/7 với khả năng hỗ trợ kỹ thuật mọi lúc.',
    PublishDate: new Date('2024-07-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy tổ chức chương trình ưu đãi thuê thiết bị',
    Content: 'Chương trình ưu đãi đặc biệt dành cho khách hàng thuê thiết bị công nghệ trong tháng 8.',
    PublishDate: new Date('2024-08-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy ra mắt dịch vụ Cloud Storage',
    Content: 'Minh Duy vừa ra mắt dịch vụ Cloud Storage với dung lượng lưu trữ không giới hạn.',
    PublishDate: new Date('2024-08-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy tổ chức workshop bảo trì máy tính',
    Content: 'Workshop bảo trì máy tính miễn phí dành cho khách hàng với các chuyên gia kỹ thuật.',
    PublishDate: new Date('2024-09-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy giới thiệu ứng dụng quản lý thiết bị',
    Content: 'Ứng dụng Minh Duy Device Manager mới với nhiều tính năng quản lý thiết bị thuê.',
    PublishDate: new Date('2024-09-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy tổ chức sự kiện công nghệ gia đình',
    Content: 'Ngày hội công nghệ gia đình với nhiều hoạt động trải nghiệm thiết bị dành cho khách hàng và người thân.',
    PublishDate: new Date('2024-08-10'),
    ImageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy khai trương trung tâm dịch vụ mới tại Hà Nội',
    Content: 'Trung tâm dịch vụ Minh Duy tại Hà Nội cung cấp đầy đủ các dịch vụ sửa chữa, bảo hành và hỗ trợ kỹ thuật.',
    PublishDate: new Date('2024-08-20'),
    ImageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy ra mắt dịch vụ thuê MacBook cao cấp',
    Content: 'Dịch vụ thuê MacBook cao cấp với đầy đủ phiên bản M1, M2 vừa được giới thiệu tại Việt Nam.',
    PublishDate: new Date('2024-09-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'Minh Duy tổ chức workshop bảo mật dữ liệu miễn phí',
    Content: 'Khách hàng Minh Duy được tham gia workshop bảo mật dữ liệu miễn phí với các chuyên gia bảo mật hàng đầu.',
    PublishDate: new Date('2024-09-10'),
    ImageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
    Status: 'published'
  }
];

// Function to generate sample device rental orders
function generateSampleDeviceRentals(users, products) {
  const orders = [];
  const statuses = ['pending', 'confirmed', 'delivered', 'returned', 'cancelled'];
  const addresses = [
    '123 Nguyễn Huệ, Quận 1, TP.HCM',
    '456 Lê Lợi, Quận 3, TP.HCM',
    '789 Trần Hưng Đạo, Quận 5, TP.HCM',
    '321 Võ Văn Tần, Quận 3, TP.HCM',
    '654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    '987 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    '147 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    '258 Lý Tự Trọng, Quận 1, TP.HCM',
    '369 Hai Bà Trưng, Quận 1, TP.HCM',
    '741 Đồng Khởi, Quận 1, TP.HCM'
  ];
  const now = new Date();

  // Tổng số đơn tối đa cho toàn bộ sản phẩm
  let totalOrders = 0;
  const maxTotalOrders = 200;

  // Sinh số lượng đơn cho từng thiết bị: phân phối ngẫu nhiên, có thiết bị nhiều, có thiết bị ít
  const productOrderCounts = products.map((_, idx) => {
    // Tăng xác suất thiết bị đầu danh sách nhiều đơn, thiết bị cuối ít đơn
    let base = Math.floor(Math.random() * 10) + 2; // 2-11
    if (idx % 7 === 0) base += Math.floor(Math.random() * 8); // Một số thiết bị nổi bật
    if (idx % 13 === 0) base += Math.floor(Math.random() * 5); // Một số thiết bị rất nổi bật
    return Math.min(base, 20);
  });

  products.forEach((product, idx) => {
    let numOrders = productOrderCounts[idx];
    if (totalOrders + numOrders > maxTotalOrders) numOrders = maxTotalOrders - totalOrders;
    if (numOrders < 2) numOrders = 2;
    for (let i = 0; i < numOrders; i++) {
      if (totalOrders >= maxTotalOrders) break;
      const user = users[(idx * 7 + i) % users.length];
      const status = statuses[(idx + i) % statuses.length];
      const address = addresses[(idx + i) % addresses.length];
      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      // Random rental dates (future dates)
      const rentalStartDays = Math.floor(Math.random() * 7) + 1;
      const rentalEndDays = rentalStartDays + Math.floor(Math.random() * 30) + 7; // 7-37 days
      const rentalStartDate = new Date(now.getTime() + rentalStartDays * 24 * 60 * 60 * 1000);
      const rentalEndDate = new Date(now.getTime() + rentalEndDays * 24 * 60 * 60 * 1000);
      // Random amount based on product price
      const baseAmount = product.Price || 20000000;
      const amountVariation = Math.random() * 0.3 - 0.15;
      const finalAmount = Math.round(baseAmount * (1 + amountVariation));
      // Random ngày tạo đơn (trong 30 ngày gần nhất)
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      orders.push({
        UserID: user._id,
        ProductID: product._id,
        Order_Date: orderDate,
        Rental_Start_Date: rentalStartDate,
        Rental_End_Date: rentalEndDate,
        Address: address,
        Status: status,
        Total_Amount: finalAmount,
        Quantity: Math.floor(Math.random() * 3) + 1, // 1-3 items
        Notes: `Đơn thuê ${product.Product_Name} cho ${user.FullName}`,
        ImageUrl: product.Main_Image || null,
        createdAt
      });
      totalOrders++;
    }
  });
  return orders;
}

// Migration function
async function migrate() {
  try {
    console.log('🚀 Bắt đầu migration với hình ảnh mới...');
    
    // Kiểm tra environment variables
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI chưa được cấu hình');
      console.log('💡 Hãy thêm MONGO_URI vào environment variables');
      return;
    }

    console.log('📡 Kết nối MongoDB...');
    
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
        console.log('✅ Kết nối MongoDB thành công');
        connected = true;
        break;
      } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB lần ${i + 1}/${maxRetries}:`, error.message);
        if (i === maxRetries - 1) {
          console.error('❌ Không thể kết nối MongoDB sau nhiều lần thử');
          console.error('🔍 Chi tiết lỗi:', error);
          return;
        }
        console.log(`⏳ Chờ ${retryDelay/1000}s trước khi thử lại...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    if (!connected) {
      console.error('❌ Không thể kết nối MongoDB');
      return;
    }

    const forceReset = process.argv.includes('--force');
    
    if (forceReset) {
      console.log('🗑️  Xóa dữ liệu cũ...');
      // Clear existing data
      await User.deleteMany({});
      await Role.deleteMany({});
      await RoleUser.deleteMany({});
      await ProductCategory.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Service.deleteMany({});
      await NewsEvent.deleteMany({});
      await DeviceRental.deleteMany({});
      console.log('✅ Đã xóa dữ liệu cũ');
    }

    // Kiểm tra xem dữ liệu đã tồn tại chưa
    const existingRoles = await Role.countDocuments();
    const existingUsers = await User.countDocuments();
    const existingProducts = await Product.countDocuments();
    
    if (existingRoles > 0 && existingUsers > 0 && existingProducts > 0 && !forceReset) {
      console.log('✅ Dữ liệu đã tồn tại, bỏ qua migration');
      console.log(`📊 Dữ liệu hiện có: ${existingRoles} roles, ${existingUsers} users, ${existingProducts} products`);
      return;
    }

    console.log('👥 Tạo roles...');
    // Create roles only if they don't exist
    let createdRoles = [];
    if (existingRoles === 0) {
      createdRoles = await Role.insertMany(sampleRoles);
      console.log('✅ Đã tạo roles');
    } else {
      createdRoles = await Role.find({});
      console.log('✅ Roles đã tồn tại');
    }
    
    const adminRole = createdRoles.find(role => role.Role_Name === 'admin');
    const userRole = createdRoles.find(role => role.Role_Name === 'user');

    console.log('👤 Tạo admin user...');
    // Create admin user only if it doesn't exist
    let adminUser = await User.findOne({ UserName: 'admin' });
    if (!adminUser) {
      adminUser = new User({
        UserName: 'admin',
        Password: 'admin123',
        Email: 'admin@minhduy.com',
        Phone: '0123456789',
        FullName: 'Administrator',
        Address: 'Hà Nội, Việt Nam',
        Role: 'admin',
        Status: 'active'
      });
      await adminUser.save();
      console.log('✅ Đã tạo admin user');
    } else {
      console.log('✅ Admin user đã tồn tại');
    }

    console.log('🔗 Tạo role-user relationship...');
    // Create role-user relationship for admin only if it doesn't exist
    const existingRoleUser = await RoleUser.findOne({ UserID: adminUser._id, RoleID: adminRole._id });
    if (!existingRoleUser) {
      await RoleUser.create({
        UserID: adminUser._id,
        RoleID: adminRole._id,
        Status: 'active'
      });
      console.log('✅ Đã tạo role-user relationship');
    } else {
      console.log('✅ Role-user relationship đã tồn tại');
    }

    console.log('📂 Tạo group categories...');
    // Create group categories only if they don't exist
    let createdGroupCategories = [];
    const existingGroupCategories = await Category.countDocuments({ ParentID: null });
    if (existingGroupCategories === 0) {
      createdGroupCategories = await Category.insertMany(sampleGroupCategories);
      console.log('✅ Đã tạo group categories');
    } else {
      createdGroupCategories = await Category.find({ ParentID: null });
      console.log('✅ Group categories đã tồn tại');
    }

    console.log('📁 Tạo sub categories...');
    // Create sub categories with proper ParentID mapping
    let createdSubCategories = [];
    const existingSubCategories = await Category.countDocuments({ ParentID: { $ne: null } });
    // Force tạo lại sub-categories nếu có --force flag
    if (existingSubCategories === 0 || forceReset) {
      // Tạo sub-categories cho mỗi group - đảm bảo mỗi group có 10-15 sub-categories
      const subCategoriesWithParent = [];
      
      createdGroupCategories.forEach((group, groupIndex) => {
        // Mỗi group sẽ có ngẫu nhiên từ 10-15 sub-categories
        const numSub = Math.floor(Math.random() * 6) + 10; // 10-15
        
        for (let i = 0; i < numSub; i++) {
          subCategoriesWithParent.push({
            Name: `${group.Name} - Sub ${i + 1}`,
            Description: `Sub-category ${i + 1} của ${group.Name}`,
            ParentID: group._id,
            Status: 'active',
            Order: i + 1
          });
        }
      });

      // Xóa sub-categories cũ nếu force reset
      if (forceReset && existingSubCategories > 0) {
        await Category.deleteMany({ ParentID: { $ne: null } });
        console.log('🗑️ Đã xóa sub-categories cũ');
      }
      
      createdSubCategories = await Category.insertMany(subCategoriesWithParent);
      console.log('✅ Đã tạo sub categories');
    } else {
      createdSubCategories = await Category.find({ ParentID: { $ne: null } });
      console.log('✅ Sub categories đã tồn tại');
    }

    console.log('💻 Tạo products với hình ảnh mới...');
    // Create products only if they don't exist
    let dbProducts = [];
    if (existingProducts === 0) {
      const productsWithCategories = sampleProducts.map((product, index) => {
        const categoryIndex = index % createdSubCategories.length;
        return {
          ...product,
          CategoryID: createdSubCategories[categoryIndex]._id
        };
      });
      await Product.insertMany(productsWithCategories);
      console.log('✅ Đã tạo products với hình ảnh mới');
    } else {
      console.log('✅ Products đã tồn tại');
    }
    
    // Lấy lại danh sách sản phẩm từ DB
    dbProducts = await Product.find({});

    console.log('🔧 Tạo services...');
    // Create services only if they don't exist
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      await Service.insertMany(sampleServices);
      console.log('✅ Đã tạo services');
    } else {
      console.log('✅ Services đã tồn tại');
    }

    console.log('📰 Tạo news events...');
    // Create news events only if they don't exist
    const existingNewsEvents = await NewsEvent.countDocuments();
    if (existingNewsEvents === 0) {
      await NewsEvent.insertMany(sampleNewsEvents);
      console.log('✅ Đã tạo news events');
    } else {
      console.log('✅ News events đã tồn tại');
    }

    console.log('👥 Tạo users...');
    // Create users only if they don't exist
    let createdUsers = [];
    if (existingUsers === 0) {
      createdUsers = await User.insertMany(sampleUsers);
      console.log('✅ Đã tạo users');
    } else {
      createdUsers = await User.find({ UserName: { $ne: 'admin' } });
      console.log('✅ Users đã tồn tại');
    }

    console.log('📋 Tạo device rental orders...');
    // Create device rental orders only if they don't exist
    const existingOrders = await DeviceRental.countDocuments();
    if (existingOrders === 0) {
      const deviceRentalOrders = generateSampleDeviceRentals(createdUsers, dbProducts);
      await DeviceRental.insertMany(deviceRentalOrders);
      console.log('✅ Đã tạo device rental orders');
    } else {
      console.log('✅ Device rental orders đã tồn tại');
    }

    console.log('🎉 Migration hoàn thành thành công với hình ảnh mới!');
    console.log('📊 Dữ liệu đã được tạo:');
    console.log(`   - ${createdRoles.length} roles`);
    console.log(`   - ${createdGroupCategories.length} group categories`);
    console.log(`   - ${createdSubCategories.length} sub categories`);
    console.log(`   - ${dbProducts.length} products với hình ảnh máy tính`);
    console.log(`   - ${sampleServices.length} services`);
    console.log(`   - ${sampleNewsEvents.length} news events`);
    console.log(`   - ${createdUsers.length} users`);
    console.log(`   - ${existingOrders === 0 ? 'device rental orders' : 'orders already exist'}`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình migration:', error.message);
    console.error('🔍 Chi tiết lỗi:', error);
    
    if (error.message.includes('MONGO_URI')) {
      console.log('\n💡 Hướng dẫn sửa lỗi:');
      console.log('1. Kiểm tra file .env có tồn tại không');
      console.log('2. Đảm bảo MONGO_URI được cấu hình đúng');
      console.log('3. Ví dụ: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Đã ngắt kết nối MongoDB');
    }
  }
}

// Run migration
migrate(); 