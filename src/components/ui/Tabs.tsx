"use client";

// this tabs should be reusable for user navigation + admin navigation (admin dashboard / notifications / add product)

import type { MenuProps } from "antd";
import { Menu, ConfigProvider } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

type TabsProps = {
  handleClick: MenuProps["onClick"];
  current: string;
  items: MenuItem[];
  className?: string;
};

const CustomTabs: React.FC<TabsProps> = ({
  handleClick,
  current,
  items,
  className,
}) => {
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
        onClick={handleClick}
        selectedKeys={[current]}
        mode="inline"
        items={items}
        className={`
         w-full! z-40! h-16! bg-linear-to-r! bg-[#001529]!
        flex justify-center! items-center! ${className}
        
      `}
      />
    </ConfigProvider>
  );
};

export default CustomTabs;
