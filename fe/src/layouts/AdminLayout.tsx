import React from "react";
import { Outlet, Link } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout flex min-h-screen">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/admin/products"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                Quản lý Sản phẩm
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content flex-grow p-6 bg-gray-100">
        <Outlet /> {/* This is where child routes will render */}
      </main>
    </div>
  );
};

export default AdminLayout;
