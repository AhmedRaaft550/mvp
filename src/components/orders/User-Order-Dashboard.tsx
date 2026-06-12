"use client";

import { OrderData } from "../admin-dashboard/Admin-Table";
import { Button, Badge } from "antd";
import {
  IoReceiptOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoSparklesSharp,
} from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import useDateFormat from "@/hooks/useDateFormat";
import OrderDetailsModal from "../ui/Modal";
import { useState } from "react";
import { useEffect } from "react";
import { supabaseConfig } from "@/lib/supabase";
import { toast } from "sonner";
import { ImBin } from "react-icons/im";
import EmptySatet from "../ui/EmptyState-Ui";
import { AppEndPoints } from "@/const/api/App-EndPoints";

const UserOrdersDashboard = ({ ordersData }: { ordersData: OrderData[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>(ordersData);
  const [completedOrders, setCompletedOrders] = useState<number[]>([]);

  const activeOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Preparing",
  );
  const completedToday = orders.filter(
    (o) =>
      (o.status === "Completed" || o.status === "Archived") &&
      !completedOrders.includes(o.id),
  );

  // handle first mount to get the completed orders
  useEffect(() => {
    const completedOrders = localStorage.getItem("COMPLETED_ORDERS");

    if (completedOrders) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompletedOrders(JSON.parse(completedOrders));
    }
  }, []);

  const formatOrderID = (id: number) => `# ${id.toString().slice(0, 3)}`;
  const { formatTimeOnly } = useDateFormat();

  const steps = ["Ordered", "Preparing", "Completed"];

  const ordersChecker =
    activeOrders.length === 0 && completedToday.length === 0;

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Preparing":
        return 1;
      case "Completed":
        return 2;
      case "Cancelled":
        return 3;
      default:
        return 0;
    }
  };

  // on mount since dependency is empty
  useEffect(() => {
    const currentSessionId = localStorage.getItem("user_Session_ID") || "";

    if (!currentSessionId) return;

    const channel = supabaseConfig
      .channel("live-orders-tracking-by-user")
      .on(
        "postgres_changes",
        {
          event: "*", // updated cases
          schema: "public", // type of schema
          table: AppEndPoints.orders, // table name
          filter: `customer_session_id=eq.${currentSessionId}`, // where customer_session_id = session from local storage
        },
        (payload) => {
          const updatedOrder = payload.new as OrderData;

          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === updatedOrder.id ? updatedOrder : order,
            ),
          );

          if (updatedOrder.status === "Cancelled") {
            toast.error(
              "Sorry, Order is cancelled, for more info please ask for waiter",
            );
          }

          if (updatedOrder.status === "Preparing") {
            toast.success("Wow, Order is being prepared");
            // navigator.vibrate([200, 100, 200]);
          }

          if (updatedOrder.status === "Completed") {
            toast.success("Order is completed");
            // navigator.vibrate([200, 100, 200]);
          }
        },
      )
      .subscribe();

    // clean up
    return () => {
      supabaseConfig.removeChannel(channel);
    };
  }, []);

  const handleViewReceipt = (order: OrderData) => {
    setIsModalOpen(true);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // handle remove the completed orders
  const handleRemoveCompletedOrders = (orderId: number) => {
    const updatedCompletedOrders = [...completedOrders, orderId];
    setCompletedOrders(updatedCompletedOrders);
    localStorage.setItem(
      "COMPLETED_ORDERS",
      JSON.stringify(updatedCompletedOrders),
    );
    toast.success("Order removed from view");
  };

  return (
    <div className="min-h-screen bg-[#060b13]  text-white p-4 pb-20! md:p-8 font-sans antialiased relative">
      <div className="max-w-xl mx-auto ">
        {/* orders page header ===> static part */}
        <header className="flex justify-between items-center mb-8 border-b border-[#d4af37]/10 pb-4">
          <div className="flex flex-col">
            <span className="text-md font-black tracking-widest text-[#d4af37] font-serif">
              Restaurant name
            </span>
            <span className="text-[10px] tracking-wider text-slate-400 uppercase">
              Premium SaaS Hospitality
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#002140] px-3 py-1.5 rounded-full border border-[#d4af37]/30 shadow-sm animate-pulse">
            <IoSparklesSharp className="text-[#d4af37] text-xs" />
            <span className="text-[#d4af37] text-[11px] font-black tracking-wider uppercase">
              Royal Service
            </span>
          </div>
        </header>

        <h2 className="text-base border-b border-gray-500/30 animate-bounce [animation-duration:2s] p-3 font-extrabold text-center text-[#d4af37] mb-8 tracking-widest">
          LIVE ORDER TRACKING
        </h2>

        {ordersChecker && <EmptySatet type="orders" />}

        {/* active orders */}
        {activeOrders.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <IoTimeOutline className="text-[#d4af37] text-lg" />
              <h3 className="text-xs m-0! font-bold tracking-widest text-slate-300 uppercase">
                Active Orders
              </h3>
              <Badge
                count={activeOrders.length} // => preparing + pending
                size="medium"
                status="processing"
                showZero
              />
            </div>

            <div className="space-y-6">
              {activeOrders.map((order) => {
                const currentStep = getStatusStep(order.status);
                const orderStatus =
                  currentStep === 0
                    ? "Pending"
                    : currentStep === 1
                      ? "Preparing"
                      : "Completed";

                return (
                  <Badge.Ribbon
                    key={order.id}
                    text={
                      orderStatus === "Pending" ? (
                        <div className="flex items-center gap-1 text-white">
                          <span className="animate-pulse">⏳</span>
                          <span>PENDING</span>
                        </div>
                      ) : orderStatus === "Preparing" ? (
                        <div className="flex items-center gap-1 text-[#001529]">
                          <BiLoaderAlt className="animate-spin text-sm" />
                          <span>PREPARING</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-white">
                          <IoCheckmarkCircleOutline className="text-sm" />
                          <span>COMPLETED</span>
                        </div>
                      )
                    }
                    color={
                      orderStatus === "Pending"
                        ? "#696FC7"
                        : orderStatus === "Preparing"
                          ? "#d4af37"
                          : "#10b981"
                    }
                    className={`font-black text-[10px] tracking-wider uppercase px-2.5 shadow-md select-none ${
                      orderStatus === "Preparing"
                        ? "text-[#001529]"
                        : "text-white"
                    }`}
                  >
                    {/* order price */}

                    <div className="bg-[#002140] rounded-2xl p-5 border border-[#d4af37]/20 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#d4af37]/40">
                      <div className="flex justify-between items-start mb-4 ">
                        <div>
                          <h4 className="text-lg  font-bold text-white tracking-tight">
                            Order {formatOrderID(order.id)}
                          </h4>

                          <div className="text-xs ">
                            <h3 className="font-semibold text-[#d4af37] ">
                              {order.total_price} AED
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 max-w-55 sm:max-w-70 leading-relaxed font-medium">
                            {order.items_summary}
                          </p>
                        </div>
                      </div>

                      <div className="my-6 bg-[#001529]/60 p-4 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between items-center relative">
                          {/* steps section */}
                          <div className="absolute left-0 right-0 top-3 h-0.5 bg-white! text-white! -z-10" />

                          {steps.map((stepName, idx) => {
                            const isDone = idx < currentStep;
                            const isCurrent = idx === currentStep;
                            console.log(isCurrent, "isCurrent");
                            return (
                              <div
                                key={stepName}
                                className="flex flex-col items-center flex-1 relative"
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold border-2 transition-all duration-500 ${
                                    isDone
                                      ? "bg-[#d4af37] border-[#d4af37] text-[#001529]"
                                      : isCurrent
                                        ? "bg-[#002140] border-[#d4af37] text-[#d4af37] scale-110 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                        : "bg-[#001529] border-slate-700 text-slate-500"
                                  }`}
                                >
                                  {isDone ? "✓" : idx + 1}
                                </div>

                                <span
                                  className={`text-[10px] font-bold mt-2 tracking-wide transition-colors duration-300 ${
                                    isCurrent
                                      ? "text-[#d4af37]"
                                      : isDone
                                        ? "text-slate-300"
                                        : "text-slate-500"
                                  }`}
                                >
                                  {stepName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 justify-between items-center pt-3 border-t border-slate-800/60">
                        <span className="text-xs text-slate-400 font-medium">
                          Order created At : {formatTimeOnly(order.created_at)}
                        </span>

                        <span className="text-xs text-slate-400 font-medium">
                          <strong className=" text-amber-300/40! animate-pulse">
                            {orderStatus === "Pending"
                              ? "Waiting for resturant approval"
                              : orderStatus === "Preparing"
                                ? "Order accepted and is being prepared"
                                : "Done and picked up"}
                          </strong>
                        </span>

                        {/* view receipt */}
                        <Button
                          onClick={() => handleViewReceipt(order)}
                          type="text"
                          className="bg-[#d4af37]! font-semibold!  active:scale-95 text-[#001529]! text-[11px] tracking-wider rounded-xl px-4 py-1.5 h-auto flex items-center gap-1.5 transition-all border-none shadow-md"
                        >
                          <IoReceiptOutline className="text-base text-[#001529]!" />
                          VIEW RECEIPT
                        </Button>
                      </div>
                    </div>
                  </Badge.Ribbon>
                );
              })}
            </div>
          </section>
        )}

        {/* completed today orders */}
        {completedToday.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-center gap-2 mb-4 pt-6">
              <IoCheckmarkCircleOutline className="text-slate-500 text-lg" />
              <h3 className="text-xs m-0! font-bold tracking-widest text-slate-500 uppercase">
                Completed Today
              </h3>
            </div>

            <div className="space-y-3 opacity-50">
              {completedToday.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#002140]/40 rounded-xl p-4 border border-slate-800 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-sm font-mono font-bold text-slate-400 tracking-tight">
                      Order #{order.id}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {order.items_summary}
                    </p>
                  </div>

                  <span className="bg-slate-900/60 text-slate-500 text-[10px] tracking-wider font-black px-3 py-1 rounded-md uppercase border border-slate-800">
                    DELIVERED
                  </span>
                  <button onClick={() => handleRemoveCompletedOrders(order.id)}>
                    <ImBin size={20} color="#d4af37" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
        {isModalOpen && selectedOrder && (
          <OrderDetailsModal
            open={isModalOpen}
            handleCancel={handleCloseModal}
            orderDetails={selectedOrder}
            isAdmin={false}
          />
        )}
      </div>
    </div>
  );
};

export default UserOrdersDashboard;
