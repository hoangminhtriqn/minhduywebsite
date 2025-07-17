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
const OrderTestDrive = require('./models/OrderTestDrive');

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

const sampleProductCategories = [
  {
    Category_Name: 'BMW Series 1',
    Description: 'Dòng xe nhỏ gọn, tiết kiệm nhiên liệu',
    Status: 'active'
  },
  {
    Category_Name: 'BMW Series 3',
    Description: 'Dòng xe sedan cỡ trung, thể thao',
    Status: 'active'
  },
  {
    Category_Name: 'BMW Series 5',
    Description: 'Dòng xe sedan hạng sang, cao cấp',
    Status: 'active'
  },
  {
    Category_Name: 'BMW Series 7',
    Description: 'Dòng xe sedan flagship, xa xỉ',
    Status: 'active'
  },
  {
    Category_Name: 'BMW X Series',
    Description: 'Dòng xe SUV/SAV đa dụng',
    Status: 'active'
  },
  {
    Category_Name: 'BMW M Series',
    Description: 'Dòng xe hiệu suất cao, thể thao',
    Status: 'active'
  },
  {
    Category_Name: 'BMW i Series',
    Description: 'Dòng xe điện, thân thiện môi trường',
    Status: 'active'
  }
];

const sampleCategories = [
  {
    Name: 'Xe mới',
    Description: 'Các mẫu xe mới nhất từ BMW',
    Image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 1
  },
  {
    Name: 'Xe đã qua sử dụng',
    Description: 'Xe đã qua sử dụng chất lượng cao',
    Image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 2
  },
  {
    Name: 'Dịch vụ',
    Description: 'Dịch vụ bảo hành và bảo dưỡng',
    Image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 3
  },
  {
    Name: 'Tin tức',
    Description: 'Tin tức và sự kiện mới nhất',
    Image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    Status: 'active',
    Order: 4
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

// Sample products data
function generateSampleProducts() {
  const products = [];
  const carNames = [
    'BMW 1 Series 118i',
    'BMW 2 Series 220i',
    'BMW 3 Series 320i',
    'BMW 4 Series 420i',
    'BMW 5 Series 520i',
    'BMW 6 Series 640i',
    'BMW 7 Series 730i',
    'BMW X1 xDrive20i',
    'BMW X3 xDrive30i',
    'BMW X5 xDrive40i',
    'BMW X6 xDrive40i',
    'BMW X7 xDrive40i',
    'BMW M3 Competition',
    'BMW M5 Competition',
    'BMW M8 Competition',
    'BMW i4 eDrive40',
    'BMW iX xDrive50',
    'BMW i7 xDrive60',
    'BMW Z4 sDrive30i',
    'BMW 8 Series 840i'
  ];

  const descriptions = [
    'Sedan cỡ nhỏ, tiết kiệm nhiên liệu, phù hợp cho gia đình trẻ',
    'Coupe thể thao, thiết kế hiện đại, hiệu suất cao',
    'Sedan cỡ trung, cân bằng hoàn hảo giữa thể thao và tiện nghi',
    'Coupe 4 cửa, thiết kế độc đáo, hiệu suất vượt trội',
    'Sedan hạng sang, không gian rộng rãi, trang bị cao cấp',
    'Gran Coupe 4 cửa, thiết kế độc đáo, hiệu suất cao',
    'Sedan flagship, xa xỉ tối đa, công nghệ tiên tiến',
    'SUV cỡ nhỏ, đa dụng, phù hợp cho thành phố',
    'SUV cỡ trung, cân bằng hoàn hảo giữa thể thao và thực dụng',
    'SUV cỡ lớn, không gian rộng rãi, hiệu suất cao',
    'SAC (Sports Activity Coupe), thiết kế độc đáo, hiệu suất cao',
    'SUV flagship, xa xỉ tối đa, không gian 7 chỗ',
    'Sedan hiệu suất cao, động cơ mạnh mẽ, xử lý thể thao',
    'Sedan hiệu suất cực cao, động cơ V8, xử lý đỉnh cao',
    'Coupe hiệu suất cực cao, thiết kế độc đáo, hiệu suất tối đa',
    'Sedan điện, thân thiện môi trường, công nghệ tiên tiến',
    'SUV điện, không gian rộng rãi, tầm hoạt động xa',
    'Sedan điện flagship, xa xỉ tối đa, công nghệ tương lai',
    'Roadster 2 chỗ, thiết kế thể thao, trải nghiệm lái thuần túy',
    'Coupe hạng sang, thiết kế độc đáo, hiệu suất cao'
  ];

  const prices = [
    1200000000, 1500000000, 1800000000, 2200000000, 2800000000,
    3500000000, 4500000000, 1600000000, 2200000000, 3200000000,
    3800000000, 5200000000, 4200000000, 5800000000, 7200000000,
    2800000000, 3800000000, 5800000000, 3200000000, 4800000000
  ];

  const images = [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop'
  ];

  for (let i = 0; i < carNames.length; i++) {
    const now = new Date();
    const startDate = new Date(now.getTime() + (i * 7) * 24 * 60 * 60 * 1000); // Mỗi xe cách nhau 7 ngày
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Kéo dài 30 ngày
    
    products.push({
      Product_Name: carNames[i],
      Description: descriptions[i],
      Price: prices[i],
      Main_Image: images[i],
      Images: [images[i]],
      TestDriveStartDate: startDate,
      TestDriveEndDate: endDate,
      Specifications: {
        Engine: '2.0L Turbo',
        Power: '184 hp',
        Transmission: '8-speed Automatic',
        FuelType: 'Gasoline',
        Seats: '5',
        Doors: '4'
      },
      Status: 'active',
      Stock: Math.floor(Math.random() * 10) + 1
    });
  }

  return products;
}

const sampleProducts = generateSampleProducts();

// Sample services data
const sampleServices = [
  {
    Name: 'Bảo dưỡng định kỳ',
    Description: 'Dịch vụ bảo dưỡng định kỳ theo tiêu chuẩn BMW',
    Price: 2000000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
  },
  {
    Name: 'Thay dầu động cơ',
    Description: 'Thay dầu động cơ và lọc dầu chính hãng BMW',
    Price: 1500000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'
  },
  {
    Name: 'Kiểm tra hệ thống điện',
    Description: 'Kiểm tra toàn bộ hệ thống điện và điện tử',
    Price: 1000000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
  },
  {
    Name: 'Thay phanh',
    Description: 'Thay phanh trước và sau, kiểm tra hệ thống phanh',
    Price: 3000000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop'
  },
  {
    Name: 'Sửa chữa điều hòa',
    Description: 'Kiểm tra và sửa chữa hệ thống điều hòa không khí',
    Price: 2500000,
    Status: 'available',
    ImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'
  }
];

// Sample news events data
const sampleNewsEvents = [
  {
    Title: 'BMW ra mắt dòng xe điện mới',
    Content: 'BMW vừa giới thiệu dòng xe điện hoàn toàn mới với công nghệ tiên tiến và thiết kế hiện đại.',
    PublishDate: new Date('2024-06-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW tổ chức sự kiện lái thử xe',
    Content: 'Sự kiện lái thử xe BMW dành cho khách hàng với nhiều mẫu xe mới nhất từ BMW.',
    PublishDate: new Date('2024-06-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW khai trương showroom mới tại Hà Nội',
    Content: 'Showroom BMW mới tại Hà Nội với diện tích 2000m2, trưng bày đầy đủ các dòng xe BMW.',
    PublishDate: new Date('2024-07-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW giới thiệu công nghệ lái tự động',
    Content: 'BMW vừa giới thiệu công nghệ lái tự động mới nhất với khả năng xử lý phức tạp.',
    PublishDate: new Date('2024-07-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW tổ chức chương trình ưu đãi đặc biệt',
    Content: 'Chương trình ưu đãi đặc biệt dành cho khách hàng mua xe BMW trong tháng 8.',
    PublishDate: new Date('2024-08-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW ra mắt phiên bản giới hạn',
    Content: 'BMW vừa ra mắt phiên bản giới hạn với số lượng chỉ 100 chiếc tại Việt Nam.',
    PublishDate: new Date('2024-08-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW tổ chức workshop chăm sóc xe',
    Content: 'Workshop chăm sóc xe BMW miễn phí dành cho khách hàng với các chuyên gia kỹ thuật.',
    PublishDate: new Date('2024-09-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW giới thiệu ứng dụng di động mới',
    Content: 'Ứng dụng BMW Connected mới với nhiều tính năng tiện ích cho chủ xe BMW.',
    PublishDate: new Date('2024-09-15'),
    ImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW tổ chức sự kiện gia đình',
    Content: 'Ngày hội gia đình BMW với nhiều hoạt động vui chơi, giải trí và lái thử xe dành cho khách hàng và người thân.',
    PublishDate: new Date('2024-08-10'),
    ImageUrl: 'https://images.unsplash.com/photo-1466027018945-1834b6cc8c8a?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW khai trương trung tâm dịch vụ mới tại Cần Thơ',
    Content: 'Trung tâm dịch vụ BMW tại Cần Thơ cung cấp đầy đủ các dịch vụ bảo dưỡng, sửa chữa và phụ tùng chính hãng.',
    PublishDate: new Date('2024-08-20'),
    ImageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW ra mắt phiên bản giới hạn BMW X5',
    Content: 'BMW X5 phiên bản giới hạn với màu sơn độc quyền và trang bị cao cấp vừa được giới thiệu tại Việt Nam.',
    PublishDate: new Date('2024-09-01'),
    ImageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&h=600&fit=crop',
    Status: 'published'
  },
  {
    Title: 'BMW tổ chức workshop chăm sóc xe miễn phí',
    Content: 'Khách hàng BMW được tham gia workshop chăm sóc xe miễn phí với các chuyên gia kỹ thuật hàng đầu.',
    PublishDate: new Date('2024-09-10'),
    ImageUrl: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?w=800&h=600&fit=crop',
    Status: 'published'
  }
];

// Function to generate sample test drive orders
function generateSampleTestDriveOrders(users, products) {
  const orders = [];
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
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

  // Sinh số lượng đơn cho từng xe: phân phối ngẫu nhiên, có xe nhiều, có xe ít
  const productOrderCounts = products.map((_, idx) => {
    // Tăng xác suất xe đầu danh sách nhiều đơn, xe cuối ít đơn
    let base = Math.floor(Math.random() * 10) + 2; // 2-11
    if (idx % 7 === 0) base += Math.floor(Math.random() * 8); // Một số xe nổi bật
    if (idx % 13 === 0) base += Math.floor(Math.random() * 5); // Một số xe rất nổi bật
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
      // Random test drive date (future date)
      const testDriveDays = Math.floor(Math.random() * 14) + 1;
      const testDriveDate = new Date(now.getTime() + testDriveDays * 24 * 60 * 60 * 1000);
      // Random amount based on product price
      const baseAmount = product.Price || 2000000000;
      const amountVariation = Math.random() * 0.3 - 0.15;
      const finalAmount = Math.round(baseAmount * (1 + amountVariation));
      // Random ngày tạo đơn (trong 30 ngày gần nhất)
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      orders.push({
        UserID: user._id,
        ProductID: product._id,
        Order_Date: orderDate,
        Test_Drive_Date: testDriveDate,
        Address: address,
        Status: status,
        Total_Amount: finalAmount,
        Notes: `Đơn lái thử ${product.Product_Name} cho ${user.FullName}`,
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
    console.log('🚀 Bắt đầu migration...');
    
    // Kiểm tra environment variables
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI chưa được cấu hình');
      console.log('💡 Hãy thêm MONGO_URI vào environment variables');
      return;
    }

    console.log('📡 Kết nối MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công');

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
      await OrderTestDrive.deleteMany({});
      console.log('✅ Đã xóa dữ liệu cũ');
    }

    console.log('👥 Tạo roles...');
    // Create roles
    const createdRoles = await Role.insertMany(sampleRoles);
    const adminRole = createdRoles.find(role => role.Role_Name === 'admin');
    const userRole = createdRoles.find(role => role.Role_Name === 'user');
    console.log('✅ Đã tạo roles');

    console.log('👤 Tạo admin user...');
    // Create admin user
    const adminUser = new User({
      UserName: 'admin',
      Password: 'admin123',
      Email: 'admin@bmw.com',
      Phone: '0123456789',
      FullName: 'Administrator',
      Address: 'Hà Nội, Việt Nam',
      Role: 'admin',
      Status: 'active'
    });
    await adminUser.save();
    console.log('✅ Đã tạo admin user');

    console.log('🔗 Tạo role-user relationship...');
    // Create role-user relationship for admin
    await RoleUser.create({
      UserID: adminUser._id,
      RoleID: adminRole._id,
      Status: 'active'
    });
    console.log('✅ Đã tạo role-user relationship');

    console.log('📂 Tạo product categories...');
    // Create product categories
    const createdProductCategories = await ProductCategory.insertMany(sampleProductCategories);
    console.log('✅ Đã tạo product categories');

    console.log('📁 Tạo general categories...');
    // Create general categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('✅ Đã tạo general categories');

    console.log('🚗 Tạo products...');
    // Create products with category references
    const productsWithCategories = sampleProducts.map((product, index) => {
      const categoryIndex = index % createdProductCategories.length;
      return {
        ...product,
        CategoryID: createdProductCategories[categoryIndex]._id
      };
    });
    await Product.insertMany(productsWithCategories);
    console.log('✅ Đã tạo products');

    // Lấy lại danh sách sản phẩm từ DB (có _id thực tế)
    const dbProducts = await Product.find({});

    console.log('🔧 Tạo services...');
    // Create services
    await Service.insertMany(sampleServices);
    console.log('✅ Đã tạo services');

    console.log('📰 Tạo news events...');
    // Create news events
    await NewsEvent.insertMany(sampleNewsEvents);
    console.log('✅ Đã tạo news events');

    console.log('👥 Tạo users...');
    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log('✅ Đã tạo users');

    console.log('📋 Tạo test drive orders...');
    // Create test drive orders
    const testDriveOrders = generateSampleTestDriveOrders(createdUsers, dbProducts);
    await OrderTestDrive.insertMany(testDriveOrders);
    console.log('✅ Đã tạo test drive orders');

    console.log('🎉 Migration hoàn thành thành công!');
    console.log('📊 Dữ liệu đã được tạo:');
    console.log(`   - ${createdRoles.length} roles`);
    console.log(`   - ${createdProductCategories.length} product categories`);
    console.log(`   - ${createdCategories.length} general categories`);
    console.log(`   - ${dbProducts.length} products`);
    console.log(`   - ${sampleServices.length} services`);
    console.log(`   - ${sampleNewsEvents.length} news events`);
    console.log(`   - ${createdUsers.length} users`);
    console.log(`   - ${testDriveOrders.length} test drive orders`);

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