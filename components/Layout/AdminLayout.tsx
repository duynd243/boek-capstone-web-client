import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Sidebar/AdminSidebar";

type Props = {
  children: React.ReactElement;
};

const AdminLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const commonProps = {
    isSidebarOpen,
    setIsSidebarOpen,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar {...commonProps} />
      {/* Content */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
        <AdminHeader {...commonProps} />
        <main>
          <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
