"use client";

import { useSearchParams, useParams } from "next/navigation";
import { MdOutlineQrCodeScanner, MdFastfood } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getrestaurantsId } from "@/actions/get-restaurantsId";
const UserHomePage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const tableNumber = searchParams.get("table");

  const rawRestaurantName = params?.restaurantSlug as string;
  const restaurantName = rawRestaurantName
    ? rawRestaurantName
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Our Restaurant";

  useEffect(() => {
    const fetchRestaurantsId = async () => {
      await getrestaurantsId(rawRestaurantName);
    };
    fetchRestaurantsId();
  }, [rawRestaurantName]);

  return (
    <div className="relative p-6 bg-linear-to-b from-slate-900 via-slate-950 to-black text-white min-h-screen flex flex-col items-center justify-between overflow-hidden">
      <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-75 h-75 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full flex flex-col items-center pt-12 z-10 text-center">
        <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6 animate-fade-in">
          <MdFastfood size={40} className="text-slate-950 animate-pulse" />
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-amber-500/70 font-semibold mb-1">
          Welcome To
        </p>
        <h1 className="text-3xl font-black tracking-tight bg-linear-to-r from-white via-slate-200 to-gray-400 bg-clip-text text-transparent capitalize px-4">
          {restaurantName}
        </h1>
      </div>

      <div className="w-full max-w-sm z-10 my-auto px-2">
        {tableNumber ? (
          <div className="relative bg-white/3 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center shadow-2xl transition-all hover:border-amber-500/30">
            <span className="absolute top-4 right-4 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-400">
              <HiOutlineLocationMarker size={24} />
            </div>

            <p className="text-gray-400 text-sm font-medium">
              Your Table Is Secured
            </p>
            <h2 className="text-4xl font-black mt-2 text-white tracking-tight">
              Table{" "}
              <span className="text-amber-400 bg-linear-to-r from-amber-400 to-amber-200 bg-clip-text ">
                {tableNumber}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-3 border-t border-white/5 pt-3">
              Orders will be served directly to this spot.
            </p>
          </div>
        ) : (
          <div className="bg-white/2 border border-rose-500/20 backdrop-blur-md rounded-3xl p-6 text-center shadow-xl">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20 text-rose-400">
              <MdOutlineQrCodeScanner size={24} />
            </div>
            <h3 className="text-base font-bold text-rose-400">
              No Table Number Detected
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed px-4">
              Please scan the QR code physically placed on your table to ensure
              correct order delivery.
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm pb-10 z-10 px-2">
        <button
          disabled={!tableNumber}
          onClick={() => router.push(`/menu`)}
          className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-800 disabled:to-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed text-slate-950 text-base font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          Browse Menu & Order
        </button>
        {tableNumber && (
          <p className="text-center text-[11px] text-gray-500 mt-3! font-medium">
            By clicking, you can explore meals and place live orders.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserHomePage;
