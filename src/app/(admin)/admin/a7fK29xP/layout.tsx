"use client";
import React from "react";
import AdminNavigation from "../../../../components/admin-Tabs-Navigation/Admin-Navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#001529] text-white flex flex-col">
      <AdminNavigation />

      <main className="flex-1 mt-16!">{children}</main>
    </div>
  );
};

export default AdminLayout;
