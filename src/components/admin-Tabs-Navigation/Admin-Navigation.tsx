"use client";

import CustomTabs from "../ui/Tabs";

import { useRouter, usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import { MdDashboard } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { SiTablecheck } from "react-icons/si";
import { PiFileArchiveDuotone } from "react-icons/pi";

// here should be implemented the dashboard count and notification count using useAdminCounters
type MenuItem = Required<MenuProps>["items"][number];

const AdminNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items: MenuItem[] = [
    {
      label: "Dashboard",
      key: "/admin/a7fK29xP",
      icon: <MdDashboard size={20} />,
    },
    {
      label: "Notifications",
      key: "/admin/a7fK29xP/notifications",
      icon: <IoNotifications size={20} />,
    },
    {
      label: "Add Product",
      key: `/admin/a7fK29xP/add-product`,
      icon: <FaPlus size={20} />,
    },
    {
      label: "Tables",
      key: `/admin/a7fK29xP/tables`,
      icon: <SiTablecheck size={20} />,
    },
    {
      label: "Archived Orders",
      key: `/admin/a7fK29xP/archived-orders`,
      icon: <PiFileArchiveDuotone size={20} />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(`${e.key}`);
  };

  return (
    <CustomTabs
      current={pathname}
      handleClick={onClick}
      items={items}
      className="fixed! top-0! left-0! right-0! "
    />
  );
};

export default AdminNavigation;
