"use client";

import React, { useMemo, useEffect, useState } from "react";
import { BsRobot } from "react-icons/bs";
import { Card, Button } from "antd";
import Image from "next/image";
// import { PlusOutlined } from "@ant-design/icons";
import { TiPlusOutline } from "react-icons/ti";
import useDebounce from "@/hooks/useDebounce";
import useRedux from "@/hooks/useRedux";
import { addToCart } from "@/redux/slice";
import { toast } from "sonner";
import { MealItem } from "../../const/menu-static-data";
import { getUserMenu } from "@/actions/get-user-menu";
import { setChatBotBoxOpen, setChatQuery } from "@/redux/slice";
import EmptySatet from "@/components/ui/EmptyState-Ui";

type Props = {
  searchValue: string;
  activeCategory: string;
};

interface MenuItem {
  id: string;
  product_name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

const MenuData: React.FC<Props> = ({ searchValue, activeCategory }) => {
  const loading = false;
  const debouncedSearch = useDebounce(searchValue, 1000); //. debounced value from the real value ==> searchValue
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const { state, dispatch } = useRedux();
  const cartItems = state.cart.cartItems;

  const handleAddToCart = (meal: MealItem) => {
    const isExisiting = cartItems.some((item) => {
      return item.id === meal.id;
    });
    if (!isExisiting) {
      dispatch(addToCart(meal));
      toast.success("Added to cart", {
        id: "add-to-cart-toast",
      });
    } else {
      toast.error("Already in the cart", {
        id: "add-to-cart-toast",
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchMenu = async () => {
      setLoadingData(true);
      try {
        const res = await getUserMenu();
        if (res.success && mounted) {
          const items = (res.data || []).map(
            (row: MenuItem) =>
              ({
                id: row.id?.toString?.() ?? String(row.id ?? ""),
                name: row.product_name ?? "",
                description: row.description ?? "",
                price: Number(row.price) || 0,
                category: row.category ?? "others",
                image: row.image ?? undefined,
                isAvailable:
                  typeof row.isAvailable === "boolean" ? row.isAvailable : true,
              }) as MealItem,
          );
          setMeals(items);
        } else if (!res.success) {
          toast.error("Failed to load menu: " + (res.error || ""));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load menu");
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    fetchMenu();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    const searchedValues = debouncedSearch.toLowerCase().trim();
    let result =
      activeCategory === "all"
        ? meals
        : meals.filter((meal) => meal.category === activeCategory);
    if (searchedValues) {
      result = result.filter((meal) => {
        return (
          meal.name.toLowerCase().includes(searchedValues.toLowerCase()) ||
          meal.description.toLowerCase().includes(searchedValues.toLowerCase())
        );
      });
    }

    return result;
  }, [debouncedSearch, activeCategory, meals]);

  const handleOpenChatBotAndSendUserQuery = (chatQuery: string) => {
    dispatch(setChatBotBoxOpen(true));
    dispatch(setChatQuery(chatQuery));
  };

  return (
    <div className="px-4 py-4  pb-24">
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredData.map((meal) => {
            return (
              <Card
                loading={loading || loadingData}
                key={meal.id}
                className={`bg-[#1a1d24]! border-neutral-800/60! rounded-2xl! overflow-hidden! 
                shadow-md shadow-black/20 flex flex-col justify-between h-full!`}
                bodyStyle={{ padding: "8px 10px 12px 10px" }}
                cover={
                  meal.image && (
                    <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        width={100}
                        height={100}
                      />
                    </div>
                  )
                }
              >
                <div className="flex flex-col grow justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-200 line-clamp-1">
                      {meal.name}
                    </h3>

                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {meal.description}
                    </p>
                  </div>

                  <div
                    className={`flex items-center justify-between mt-2 pt-1 border-t border-neutral-800/40`}
                  >
                    <span className="text-xs font-bold text-[#d4af37]">
                      ${meal.price.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        type="primary"
                        shape="circle"
                        title="add to cart"
                        size="small"
                        icon={
                          <TiPlusOutline className="text-black font-bold" />
                        }
                        className="bg-[#d4af37]! border-none! hover:scale-105! transition-transform"
                        onClick={() => handleAddToCart(meal)}
                      />
                      <Button
                        type="primary"
                        title="ask ai"
                        shape="circle"
                        size="small"
                        icon={<BsRobot className="text-black font-bold" />}
                        className="bg-[#d4af37]! border-none! hover:scale-105! transition-transform"
                        onClick={() =>
                          handleOpenChatBotAndSendUserQuery(
                            `Tell me more about ${meal.name} (ingredients, price, description)?`,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptySatet
          type="menu"
          query={debouncedSearch}
          description={
            debouncedSearch
              ? `No meals matched your search. Try another keyword or category.`
              : "No meals are available for the selected category."
          }
        />
      )}
    </div>
  );
};

export default MenuData;
