const User = require("../models/User");
const Role = require("../models/Role");
const RoleUser = require("../models/RoleUser");
const { USER_ROLES } = require("../models/User");
const auditLogger = require("../utils/auditLogger");
const {
  AUDIT_EVENTS,
  AUDIT_TEMPLATES,
  AUDIT_ENTITY_TYPES,
  AUDIT_MODULES,
} = require("../utils/enums");

// Get all employees (users with role 'employee')
const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build query for employees only
    const query = { Role: USER_ROLES.EMPLOYEE };

    if (search) {
      query.$or = [
        { UserName: { $regex: search, $options: "i" } },
        { FullName: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
      ];
    }

    // Get employees with their role permissions
    const employees = await User.find(query)
      .select("-Password")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get permissions for each employee
    const employeesWithPermissions = await Promise.all(
      employees.map(async (employee) => {
        const roleUser = await RoleUser.findOne({
          UserID: employee._id,
        }).populate("RoleID");
        const permissions = roleUser?.RoleID?.Permissions || [];

        return {
          ...employee.toObject(),
          permissions,
        };
      })
    );

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        employees: employeesWithPermissions,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error getting employees:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách nhân viên",
      error: error.message,
    });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const { UserName, Password, Email, Phone, FullName, Address } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ UserName }, { Email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc email đã tồn tại",
      });
    }

    // Create new employee
    const employee = new User({
      UserName,
      Password,
      Email,
      Phone,
      FullName,
      Address,
      Role: USER_ROLES.EMPLOYEE,
      Status: "active",
    });

    await employee.save();

    // Create role-user relationship with employee role
    const employeeRole = await Role.findOne({ Role_Name: "employee" });
    if (employeeRole) {
      await RoleUser.create({
        UserID: employee._id,
        RoleID: employeeRole._id,
      });
    }

    // Return employee without password
    const employeeResponse = employee.toObject();
    delete employeeResponse.Password;

    res.status(201).json({
      success: true,
      data: employeeResponse,
      message: "Đã tạo nhân viên thành công",
    });

    // Audit (non-blocking)
    auditLogger.log({
      actor: {
        id: req.user && req.user._id,
        userName: req.user && req.user.UserName,
        role: req.user && req.user.Role,
      },
      module: AUDIT_MODULES.PERMISSIONS,
      event: AUDIT_EVENTS.EMPLOYEE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.EMPLOYEE,
      entityId: employee._id,
      entityName: employee.FullName || employee.UserName || employee.Email,
      messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.EMPLOYEE_CREATED],
      messageParams: {
        actor: (req.user && req.user.UserName) || "system",
        target: employee.FullName || employee.UserName || employee.Email,
      },
      metadata: { body: { UserName, Email, Phone, FullName, Address } },
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo nhân viên",
      error: error.message,
    });
  }
};

// Update employee information
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { FullName, Email, Phone, Address, Status } = req.body;

    // Check if employee exists and is actually an employee
    const employee = await User.findOne({ _id: id, Role: USER_ROLES.EMPLOYEE });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    // Check if email is being changed and already exists
    if (Email && Email !== employee.Email) {
      const existingUser = await User.findOne({ Email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại",
        });
      }
    }

    // Update employee
    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      { FullName, Email, Phone, Address, Status },
      { new: true, runValidators: true }
    ).select("-Password");

    res.status(200).json({
      success: true,
      data: updatedEmployee,
      message: "Đã cập nhật nhân viên thành công",
    });

    // Audit (non-blocking)
    const toText = (v) => (v === undefined || v === null ? "" : String(v));
    const changes = [];
    const fields = ["FullName", "Email", "Phone", "Address", "Status"];
    for (const f of fields) {
      if (
        Object.prototype.hasOwnProperty.call(
          { FullName, Email, Phone, Address, Status },
          f
        )
      ) {
        const before = toText(employee && employee[f]);
        const after = toText(updatedEmployee && updatedEmployee[f]);
        if (before !== after) changes.push(`${f}: '${before}' -> '${after}'`);
      }
    }
    auditLogger.log({
      actor: {
        id: req.user && req.user._id,
        userName: req.user && req.user.UserName,
        role: req.user && req.user.Role,
      },
      module: AUDIT_MODULES.PERMISSIONS,
      event: AUDIT_EVENTS.EMPLOYEE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.EMPLOYEE,
      entityId: updatedEmployee && updatedEmployee._id,
      entityName:
        updatedEmployee &&
        (updatedEmployee.FullName ||
          updatedEmployee.UserName ||
          updatedEmployee.Email),
      messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.EMPLOYEE_UPDATED],
      messageParams: {
        actor: req.user && req.user.UserName,
        target:
          updatedEmployee &&
          (updatedEmployee.FullName ||
            updatedEmployee.UserName ||
            updatedEmployee.Email),
        changes: changes.join(", ") || "-",
      },
      metadata: { changes },
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật nhân viên",
      error: error.message,
    });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists and is actually an employee
    const employee = await User.findOne({ _id: id, Role: USER_ROLES.EMPLOYEE });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    // Delete role-user relationship first
    await RoleUser.deleteMany({ UserID: id });

    // Delete employee
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Đã xóa nhân viên thành công",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa nhân viên",
      error: error.message,
    });
  }
};

// Update employee permissions
const updateEmployeePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    // Check if employee exists and is actually an employee
    const employee = await User.findOne({ _id: id, Role: USER_ROLES.EMPLOYEE });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    // Find or create employee role for this specific user
    let employeeRole = await Role.findOne({ Role_Name: `employee_${id}` });

    if (!employeeRole) {
      // Create a custom role for this employee
      employeeRole = new Role({
        Role_Name: `employee_${id}`,
        Role_Description: `Quyền hạn cho nhân viên ${employee.FullName}`,
        Permissions: permissions || [],
        Status: "active",
      });
      await employeeRole.save();
    } else {
      // Update existing custom role, compute delta for audit
      const prevPermissions = Array.isArray(employeeRole.Permissions)
        ? employeeRole.Permissions
        : [];
      const nextPermissions = Array.isArray(permissions) ? permissions : [];
      const prevSet = new Set(prevPermissions);
      const nextSet = new Set(nextPermissions);
      const added = nextPermissions.filter((p) => !prevSet.has(p));
      const removed = prevPermissions.filter((p) => !nextSet.has(p));
      employeeRole.Permissions = nextPermissions;
      await employeeRole.save();

      // Audit permission delta (non-blocking)
      auditLogger.log({
        actor: {
          id: req.user && req.user._id,
          userName: req.user && req.user.UserName,
          role: req.user && req.user.Role,
        },
        module: AUDIT_MODULES.PERMISSIONS,
        event: AUDIT_EVENTS.PERMISSIONS_ASSIGNED,
        entityType: AUDIT_ENTITY_TYPES.EMPLOYEE,
        entityId: employee && employee._id,
        entityName:
          employee &&
          (employee.FullName || employee.UserName || employee.Email),
        messageTemplate: AUDIT_TEMPLATES[AUDIT_EVENTS.PERMISSIONS_ASSIGNED],
        messageParams: {
          actor: req.user && req.user.UserName,
          target:
            employee &&
            (employee.FullName || employee.UserName || employee.Email),
          added: added.join(", ") || "-",
          removed: removed.join(", ") || "-",
        },
        metadata: {
          added,
          removed,
          previous: prevPermissions,
          next: nextPermissions,
        },
      });
    }

    // Update role-user relationship
    await RoleUser.findOneAndUpdate(
      { UserID: id },
      { RoleID: employeeRole._id },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      data: {
        employeeId: id,
        permissions: permissions || [],
      },
      message: "Đã cập nhật quyền hạn thành công",
    });
  } catch (error) {
    console.error("Error updating employee permissions:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật quyền hạn",
      error: error.message,
    });
  }
};

// Get available permissions
const getAvailablePermissions = async (req, res) => {
  try {
    // Define available permissions directly to avoid schema access issues
    const availablePermissions = [
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
    ];

    // Group permissions by category
    const groupedPermissions = availablePermissions.reduce(
      (acc, permission) => {
        const [category] = permission.split(".");
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      },
      {}
    );

    res.status(200).json({
      success: true,
      data: {
        permissions: availablePermissions,
        groupedPermissions,
      },
    });
  } catch (error) {
    console.error("Error getting available permissions:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách quyền",
      error: error.message,
    });
  }
};

// Get employee permissions
const getEmployeePermissions = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const employee = await User.findOne({ _id: id, Role: USER_ROLES.EMPLOYEE });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    // Get employee's role and permissions
    const roleUser = await RoleUser.findOne({ UserID: id }).populate("RoleID");
    const permissions = roleUser?.RoleID?.Permissions || [];

    res.status(200).json({
      success: true,
      data: {
        employeeId: id,
        permissions,
      },
    });
  } catch (error) {
    console.error("Error getting employee permissions:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy quyền hạn nhân viên",
      error: error.message,
    });
  }
};

// Get user permissions (for any user, not just employees)
const getUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    let permissions = [];

    // If user is admin, return all permissions
    if (user.Role === USER_ROLES.ADMIN) {
      // Return all available permissions for admin
      const availablePermissions = [
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
      ];
      permissions = availablePermissions;
    } else if (user.Role === USER_ROLES.EMPLOYEE) {
      // Get employee's role and permissions
      const roleUser = await RoleUser.findOne({ UserID: userId }).populate(
        "RoleID"
      );
      permissions = roleUser?.RoleID?.Permissions || [];
    }
    // Regular users have no admin permissions

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error("Error getting user permissions:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy quyền hạn người dùng",
      error: error.message,
    });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeePermissions,
  getAvailablePermissions,
  getEmployeePermissions,
  getUserPermissions,
};
