const mongoose = require('mongoose');
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

async function checkMigrationStatus() {
  try {
    console.log('🔍 Kiểm tra trạng thái migration...');
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI chưa được cấu hình');
      return;
    }

    console.log('📡 Kết nối MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công');

    // Kiểm tra số lượng dữ liệu trong từng collection
    const rolesCount = await Role.countDocuments();
    const usersCount = await User.countDocuments();
    const productCategoriesCount = await ProductCategory.countDocuments();
    const productsCount = await Product.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const servicesCount = await Service.countDocuments();
    const newsEventsCount = await NewsEvent.countDocuments();
    const ordersCount = await OrderTestDrive.countDocuments();

    console.log('\n📊 Trạng thái dữ liệu:');
    console.log(`   - Roles: ${rolesCount}`);
    console.log(`   - Users: ${usersCount}`);
    console.log(`   - Product Categories: ${productCategoriesCount}`);
    console.log(`   - Products: ${productsCount}`);
    console.log(`   - Categories: ${categoriesCount}`);
    console.log(`   - Services: ${servicesCount}`);
    console.log(`   - News Events: ${newsEventsCount}`);
    console.log(`   - Test Drive Orders: ${ordersCount}`);

    // Kiểm tra admin user
    const adminUser = await User.findOne({ UserName: 'admin' });
    if (adminUser) {
      console.log('\n✅ Admin user tồn tại');
    } else {
      console.log('\n❌ Admin user chưa được tạo');
    }

    // Kiểm tra roles
    const adminRole = await Role.findOne({ Role_Name: 'admin' });
    const userRole = await Role.findOne({ Role_Name: 'user' });
    
    if (adminRole && userRole) {
      console.log('✅ Admin và User roles tồn tại');
    } else {
      console.log('❌ Một số roles chưa được tạo');
    }

    if (rolesCount > 0 && usersCount > 0 && productsCount > 0) {
      console.log('\n🎉 Migration đã hoàn thành thành công!');
    } else {
      console.log('\n⚠️  Migration chưa hoàn thành hoặc có lỗi');
    }

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra migration:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Đã ngắt kết nối MongoDB');
    }
  }
}

// Run check
checkMigrationStatus(); 