"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Button, List } from "antd";
import useRedux from "@/hooks/useRedux";
import { IoIosRemoveCircle } from "react-icons/io";
import { removeFromCart } from "@/redux/slice";
import { toast } from "sonner";
import { MealItem } from "../../const/menu-static-data";
import { placeOrder } from "../../actions/place-order";
import { clearCart } from "@/redux/slice";
import { useRouter } from "next/navigation";
import EmptySatet from "../ui/EmptyState-Ui";

const PAGE_SIZE = 3;

const Cart: React.FC = () => {
  const { state, dispatch } = useRedux();
  const cartItems = state.cart.cartItems;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [sumittedOrder, setSubmittedOrder] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [customerNote, setCustomerNote] = useState<string>("");

  const router = useRouter();

  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.price;
  }, 0);

  const finalPrice = Number(totalAmount.toFixed(2));

  const displayedItems = cartItems.slice(0, visibleCount);

  const hasMore = visibleCount < cartItems.length;

  const onLoadMore = () => {
    setLoading(true);

    setTimeout(() => {
      setVisibleCount((prevCount) => prevCount + PAGE_SIZE);
      setLoading(false);
    }, 600);
  };

  const loadMore = hasMore ? (
    <div
      style={{
        textAlign: "center",
        marginTop: 12,
        height: 32,
        lineHeight: "32px",
      }}
    >
      <Button
        onClick={onLoadMore}
        loading={loading}
        className="bg-[#d4af37]! text-black! border-none! font-medium active:scale-105! transition-transform"
      >
        {loading ? "Loading..." : "Load More Items"}
      </Button>
    </div>
  ) : null;

  const handleRemoveFromCart = (meal: MealItem) => {
    dispatch(removeFromCart(meal));
    toast.success("Removed from cart", {
      id: "remove-from-cart-toast",
    });
  };

  useEffect(() => {
    if (visibleCount > cartItems.length && cartItems.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleCount(Math.max(PAGE_SIZE, cartItems.length));
    }
  }, [cartItems.length, visibleCount]);

  // make the order and send request to api

  const submitOrder = async () => {
    const userSessionId = localStorage.getItem("user_Session_ID") || ""; // order id which indicates the user
    setSubmitError(null);
    setSubmittedOrder(true);
    try {
      const result = await placeOrder({
        table_number: 5, // will be getten from the QR code
        items_summary: state.cart.cartItems,
        total_price: finalPrice,
        customer_notes: customerNote || "No notes",
        customer_session_id: userSessionId, // send the user session id to DB
      });

      if (result.success && result.data) {
        toast.success("Order placed successfully");
        router.push(`/orders/${userSessionId}`); // orders/ + userSessionId (URL included params)
        dispatch(clearCart());
      } else if (result.error) {
        setSubmitError(result.error);
        toast.error(result.error);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to place order";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmittedOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b13] pb-72! text-zinc-100 relative ">
      {/* cart page header */}
      <div className="relative  overflow-hidden bg-linear-to-r from-[#030712] via-[#0b1324] to-[#030712] py-8 px-4 text-center border-b border-white/40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#d4af37]/10 blur-3xl rounded-full pointer-events-none" />
        <h1 className="text-xl md:text-2xl font-light tracking-widest text-[#d4af37] uppercase font-serif animate-bounce">
          {cartItems.length === 0 ? "Your cart is empty" : "Your cart is ready"}
        </h1>
        <p className="text-[10px] text-zinc-400 mt-1 tracking-[0.2em] uppercase">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
          selected
        </p>
      </div>

      {submitError && (
        <div className="mx-auto my-4 max-w-3xl rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-left text-rose-100 shadow-inner">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Unable to place order</p>
              <p className="text-xs text-rose-200/90">{submitError}</p>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <List
        className="px-4 mt-2"
        itemLayout="horizontal"
        locale={{
          emptyText: <EmptySatet type="cart" />,
        }}
        loadMore={loadMore}
        dataSource={displayedItems}
        renderItem={(item) => (
          <List.Item
            className="animate-in fade-in duration-500 bg-[#0d1527]/40 backdrop-blur-md my-2 rounded-xl border border-white/5! px-4!"
            key={item.id}
            actions={[
              <button
                onClick={() => handleRemoveFromCart(item)}
                key="remove"
                className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <IoIosRemoveCircle size={22} className=" text-[#d4af37]" />
              </button>,
            ]}
          >
            <List.Item.Meta
              className="items-center!"
              avatar={
                <div className="border border-white/10 rounded-lg overflow-hidden shadow-md">
                  <Avatar src={item?.image} size={60} shape="square" />
                </div>
              }
              title={
                <span className="text-zinc-100 font-medium text-base block mb-0.5">
                  {item.name}
                </span>
              }
              description={
                <p className="text-zinc-400 text-xs leading-relaxed max-w-62.5">
                  {item.description}
                </p>
              }
            />
          </List.Item>
        )}
      />
      {cartItems.length > 0 && (
        <div className="fixed bottom-13 left-0 right-0 z-50 bg-[#001529]/95 backdrop-blur-md border-t border-[#d4af37]/20 px-4 pt-4 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:max-w-xl md:mx-auto md:rounded-t-3xl">
          <div className="space-y-4">
            <div>
              <textarea
                rows={2}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                className="w-full text-xs rounded-xl bg-[#002140] text-slate-200 p-3 border border-slate-800 outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/30 placeholder:text-slate-500 placeholder:text-[11px] transition-all resize-none font-sans"
                placeholder="Add your special request or order notes here (e.g., no onions, extra sauce)..."
              ></textarea>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                  Total Amount
                </span>
                <span className="text-lg font-black text-[#d4af37] tracking-tight font-mono">
                  {finalPrice}{" "}
                  <span className="text-xs font-sans text-[#d4af37]/80">
                    AED
                  </span>
                </span>
              </div>

              <button
                onClick={submitOrder}
                disabled={sumittedOrder}
                className="flex-1 max-w-60 relative overflow-hidden bg-linear-to-r from-[#d4af37] via-[#f59e0b] to-[#d4af37] text-[#001529] font-black text-xs tracking-widest uppercase py-3.5 px-6 rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {sumittedOrder ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-[#001529]"
                      xmlns="http://www.w3.org/2000/v2000"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Place the order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
