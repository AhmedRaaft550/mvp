"use client";
import CustomTabs from "../ui/Tabs";
// import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useRedux from "@/hooks/useRedux";
import type { MenuProps } from "antd";
import { Badge } from "antd";
import {
  MdOutlineMenuBook,
  MdOutlineShoppingBag,
  MdReceiptLong,
} from "react-icons/md";

type MenuItem = Required<MenuProps>["items"][number];

const NavigationWithCustomTabs = () => {
  // const [current, setCurrent] = useState("/menu");
  const pathname = usePathname();
  console.log(pathname, "pathname");

  const router = useRouter();
  const { state } = useRedux();
  const cartLenght = state.cart.cartItems.length;
  const userSessionId = localStorage.getItem("user_Session_ID") || "";
  const items: MenuItem[] = [
    {
      label: "Menu",
      key: "/menu",
      icon: <MdOutlineMenuBook size={20} />,
    },
    {
      label: "Cart",
      key: "/cart",
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
      key: `/orders/${userSessionId}`,
      icon: <MdReceiptLong size={20} />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    // setCurrent(e.key);
    router.push(`${e.key}`);
  };
  return (
    <CustomTabs
      items={items}
      current={pathname}
      handleClick={onClick}
      className="fixed! bottom-0! left-0! right-0!"
    />
  );
};

export default NavigationWithCustomTabs;
