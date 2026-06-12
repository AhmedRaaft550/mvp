"use client";
import MenuTabs from "./MenuTabs";
import { Input } from "antd";
import MenuData from "./MenuData";
import { useState, useEffect } from "react";

const Menu = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // generate random id for the each user and store it to the local storage to check if the user has orders or not
  // random id is not related to DB
  useEffect(() => {
    let userSessionID = localStorage.getItem("user_Session_ID");
    if (!userSessionID) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        userSessionID = crypto.randomUUID();
      } else {
        userSessionID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          },
        );
      }

      localStorage.setItem("user_Session_ID", userSessionID);
    }
  }, []);

  return (
    <div className="bg-[#0f1115] min-h-screen ">
      <MenuTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <div className=" w-3/4 mx-auto">
        <Input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e)}
          placeholder="Start your search ..."
          className="py-3! px-4! mt-4! border! border-neutral-800/40! shadow-lg shadow-black/20 bg-gray-400!  "
        />
      </div>
      <MenuData searchValue={search} activeCategory={activeCategory} />
    </div>
  );
};

export default Menu;
