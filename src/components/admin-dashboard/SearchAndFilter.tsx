"use client";
import { useRef, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { OrderData } from "../admin-dashboard/Admin-Table";

type Props = {
  search: string;
  setSearch: (search: string) => void;
  convertToPdf: () => void;
  downloadloading: boolean;
  filterData: OrderData[];
};

const SearchAndFilter = ({
  search,
  setSearch,
  convertToPdf,
  downloadloading,
  filterData,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex justify-center w-full items-center gap-4 ">
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-6 py-4 w-1/2 mx-auto border border-white rounded-md text-gray-400! focus:outline-none focus:border-[#d4af37] placeholder:text-gray-400"
        placeholder="search by order ID, customer name ..."
      />
      <button
        disabled={downloadloading}
        onClick={convertToPdf}
        className={` ${filterData.length === 0 ? "hidden" : "bg-[#1a1d24] cursor-pointer rounded-md px-4 py-2 flex gap-2 items-center justify-center text-[#d4af37]! disabled:opacity-50 disabled:cursor-not-allowed"}`}
      >
        <FaDownload className="text-2xl  cursor-pointer" /> Export as PDF
      </button>
    </div>
  );
};

export default SearchAndFilter;
