"use client";

import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu, ConfigProvider, Badge } from "antd";
import {
  MdOutlineMenuBook,
  MdOutlineShoppingBag,
  MdReceiptLong,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import useRedux from "@/hooks/useRedux";

/// handle the user navigation using path name later

type MenuItem = Required<MenuProps>["items"][number];

const Navigation: React.FC = () => {
  const [current, setCurrent] = useState("/");
  const router = useRouter();
  const { state } = useRedux();
  const cartLenght = state.cart.cartItems.length;
  const userSessionId = localStorage.getItem("user_Session_ID") || "";

  const items: MenuItem[] = [
    {
      label: "Menu",
      key: "/",
      icon: <MdOutlineMenuBook size={20} />,
    },
    {
      label: "Cart",
      key: "cart",
      icon:
        cartLenght > 0 ? (
          <Badge
            count={cartLenght}
            size="small"
            className="animate-pulse transition-all duration-700"
          >
            <MdOutlineShoppingBag size={20} />
          </Badge>
        ) : (
          <MdOutlineShoppingBag size={20} />
        ),
    },
    {
      label: "Orders",
      key: `orders/${userSessionId}`,
      icon: <MdReceiptLong size={20} />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    router.push(`/${e.key}`);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: "transparent",
            itemSelectedColor: "#d4af37",
            itemColor: "#a3a3a3",
            itemHoverColor: "#d4af37",
          },
        },
      }}
    >
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        items={items}
        className="
        fixed! bottom-0! left-0! right-0! w-full! z-40! h-16! bg-linear-to-r! bg-[#001529]!
        flex justify-center! items-center!
        
      "
      />
    </ConfigProvider>
  );
};

export default Navigation;
