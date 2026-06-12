"use client";

import { Tabs, ConfigProvider } from "antd";
import type { TabsProps } from "antd";

const items: TabsProps["items"] = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "burgers",
    label: "Burgers",
  },
  {
    key: "pizza",
    label: "Pizza",
  },
  {
    key: "drinks",
    label: "Drinks",
  },
  {
    key: "desserts",
    label: "Desserts",
  },

  {
    key: "others",
    label: "Others",
  },
];

type Props = {
  activeCategory: string;
  setActiveCategory: (key: string) => void;
};

const MenuTabs: React.FC<Props> = ({ setActiveCategory }) => {
  const onChange = (key: string) => {
    setActiveCategory(key);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            colorPrimary: "#d4af37",
            inkBarColor: "#d4af37",
            itemColor: "#a3a3a3",
            itemSelectedColor: "#d4af37",
            itemHoverColor: "#f59e0b",
            horizontalMargin: "0 0 16px 0",
          },
        },
      }}
    >
      <div className="w-full border-b-2! border-white/50! mainBg pt-4 sticky top-0 z-30 px-4  shadow-lg shadow-black/20">
        <Tabs
          defaultActiveKey="all"
          items={items}
          onChange={onChange}
          className="
            [&_.ant-tabs-nav]:before:border-b-0!
            [&_.ant-tabs-tab-btn]:text-sm! [&_.ant-tabs-tab-btn]:font-medium!
            [&_.ant-tabs-nav-list]:gap-2!
           animate-in fade-in duration-500"
        />
      </div>
    </ConfigProvider>
  );
};

export default MenuTabs;
