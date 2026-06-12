"use client";

import { useEffect, useState } from "react";
import { Table, ConfigProvider } from "antd";
import { toast } from "sonner";
import { getOrders } from "../../actions/get-order";
import ModalComponent from "../ui/Modal";
import { FiRefreshCw } from "react-icons/fi";
import { MdOutlineRestaurant, MdDelete } from "react-icons/md";
import SearchAndFilter from "./SearchAndFilter";
import { useMemo } from "react";
import useDebounce from "../../hooks/useDebounce";
import { IoMdTime } from "react-icons/io";
import useDateFormat from "../../hooks/useDateFormat";
import usePdfExport from "@/hooks/usePdfExport";
import DashboardCount from "./Count-Dashboard";
import EmptySatet from "../ui/EmptyState-Ui";
import { supabaseConfig } from "@/lib/supabase";
import AdminNavigation from "../admin-Tabs-Navigation/Admin-Navigation";
import { AppEndPoints } from "@/const/api/App-EndPoints";
import { deleteArchivedOrders } from "../../actions/delete-orders";
import { confirmActionWithToast } from "../../helper/confirmToast";

export interface OrderData {
  id: number;
  created_at: string;
  customer_name: string;
  table_number: number;
  items_summary: string;
  total_price: number;
  status: string;
  customer_notes?: string;
}

const AdminTable = ({ archived }: { archived: boolean }) => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const { formatDateAndTime } = useDateFormat();

  const { convertToPdf, loadingDownload } = usePdfExport(orders);

  const fetchOrders = async () => {
    setFetchError(null);
    try {
      setLoading(true);
      const result = await getOrders(archived); // this function is render on the server and it takes the res id from the cookies in the action func
      if (result.success && result.data) {
        const formattedOrders = result.data.map((order: OrderData) => ({
          ...order,
          key: order.id.toString(),
        }));
        setOrders(formattedOrders);
      } else {
        const errorMessage = result.error || "Failed to load orders";
        setFetchError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error fetching orders";
      setFetchError(errorMessage);
      console.error("Error fetching orders:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // handle admin dashboard with the resturant id with order real time

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   let ordersSubscription: any;
  //   const initializeSubscription = async () => {
  //     const restaurantsId = await getrestaurantsId();
  //     if (!restaurantsId) {
  //       toast.error(
  //         "Restaurant ID not found, Please contact the administrator",
  //       );
  //       return;
  //     }

  //     fetchOrders();

  //     // add notification sound
  //     const notificationSound = () => {
  //       try {
  //         const audio = new Audio("/sounds/notification.mp3");
  //         audio.volume = 0.6;
  //         audio.currentTime = 0;
  //         if (audio) {
  //           audio.play();
  //         } else {
  //           console.error("Failed to play notification sound");
  //         }
  //       } catch (error) {
  //         console.error("Error playing notification sound:", error);
  //       }
  //     };

  //     // subscription on the subapase ==> (RT)
  //     // ======> this function needs more testing since the channel takes time for the order to be reflected in the admin dashboard
  //     ordersSubscription = supabaseConfig
  //       .channel("custom-filter-channel")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "INSERT", // follow when the new item post to DB
  //           schema: "public",
  //           table: "orders",
  //           filter: `restaurant_id=eq.${restaurantsId}`,
  //         },
  //         (payload) => {
  //           const newOrder = {
  //             ...(payload.new as OrderData),
  //             key: payload.new.id.toString(),
  //           };

  //           setOrders((prevOrders) => [newOrder, ...prevOrders]);

  //           toast.success(`Premium Alert: New Order #${newOrder.id} placed!`, {
  //             description: `Table ${newOrder.table_number} • EGP ${newOrder.total_price}`,
  //             duration: 5000,
  //           });

  //           notificationSound();
  //         },
  //       )
  //       .subscribe();
  //   };
  //   initializeSubscription();
  //   return () => {
  //     if (ordersSubscription) {
  //       supabaseConfig.removeChannel(ordersSubscription);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();

    // add notification sound
    const notificationSound = () => {
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.volume = 0.6;
        audio.currentTime = 0;
        if (audio) {
          audio.play();
        } else {
          console.error("Failed to play notification sound");
        }
      } catch (error) {
        console.error("Error playing notification sound:", error);
      }
    };

    // subscription on the subapase ==> (RT)
    const ordersSubscription = supabaseConfig
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: AppEndPoints.orders,
        },
        (payload) => {
          const newOrder = {
            ...(payload.new as OrderData),
            key: payload.new.id.toString(),
          };

          if (archived && newOrder.status !== "Archived") {
            return; // to stop insereting the new order in Archived table
          }

          setOrders((prevOrders) => [newOrder, ...prevOrders]);

          toast.success(`Premium Alert: New Order #${newOrder.id} placed!`, {
            description: `Table ${newOrder.table_number} • AED ${newOrder.total_price}`,
            duration: 5000,
          });

          notificationSound();
        },
      )
      .subscribe();
    // clean up
    return () => {
      supabaseConfig.removeChannel(ordersSubscription);
    };
  }, []);

  const handleUpdateStatus = async (orderId: number, nextStatus: string) => {
    //keep a copy of the original orders
    const originalOrders = [...orders];

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
    );

    toast.promise(
      async () => {
        const { error } = await supabaseConfig
          .from(AppEndPoints.orders)
          .update({ status: nextStatus })
          .eq("id", orderId);

        if (!error && nextStatus === "Archived") {
          fetchOrders();
        }

        if (error) throw new Error(error.message);
      },
      {
        loading: `Updating Order #${orderId} to ${nextStatus}...`,
        success: `Wow, Order #${orderId} status updated to ${nextStatus}! `,
        error: (err) => {
          setOrders(originalOrders);
          return `Failed to update order: ${err.message || "Network Error"}`;
        },
      },
    );
  };

  // handle delete the archived orders

  const handleDeletedArchiveOrders = async () => {
    try {
      const res = await deleteArchivedOrders();
      if (res.success) {
        fetchOrders();
        toast.success("Archived Orders Deleted Successfully!");
      }
    } catch (error) {
      console.error("Failed to delete archived orders:", error);
    }
  };

  // filter the data
  const filterData = useMemo(() => {
    const filteredDataBySearch = orders.filter((order) => {
      return (
        order.id.toString().includes(debouncedSearch) ||
        order.customer_name
          ?.toLowerCase()
          ?.includes(debouncedSearch.toLowerCase()) ||
        order.table_number.toString().includes(debouncedSearch)
      );
    });

    return filteredDataBySearch;
  }, [debouncedSearch, orders]);

  // table columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: number) => (
        <span className="font-extrabold text-amber-300/50! tracking-wide">
          #{id}
        </span>
      ),
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => (
        <div className="flex items-center gap-2">
          <IoMdTime className="text-amber-300!" size={20} />
          <span className="font-extrabold text-red-300/50! tracking-wide">
            {formatDateAndTime(created_at)}
          </span>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (name: string) => (
        <span className="font-semibold text-slate-200">
          {name ? name : "Guest"}
        </span>
      ),
    },
    {
      title: "Table",
      dataIndex: "table_number",
      key: "table_number",
      render: (num: number) => (
        <span className="bg-[#002140] text-white! border border-[#d4af37]/30 text-xs font-bold px-3 py-1 rounded-md">
          T-{num}
        </span>
      ),
    },

    // order details
    {
      title: "Items Ordered",
      dataIndex: "items_summary",
      key: "items_summary",
      ellipsis: true,
      render: (text: string) => (
        <span className="text-slate-300 font-medium">{text}</span>
      ),
    },
    // customer notes
    {
      title: "Guest Notes",
      dataIndex: "customer_notes",
      key: "customer_notes",
      render: (notes: string) =>
        notes ? (
          <span className="text-xs text-amber-300/60 bg-amber-950/20 border border-amber-500/30 px-2 py-1 rounded-md italic">
            {notes}
          </span>
        ) : (
          <span className="text-slate-500">-</span>
        ),
    },
    // price
    {
      title: "Total Account",
      dataIndex: "total_price",
      key: "total_price",
      render: (price: number) => (
        <span className="font-bold text-gray-500 text-sm ">AED {price}</span>
      ),
    },

    // order status
    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status: string) => {
        let bg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        if (status === "Preparing")
          bg = "bg-sky-500/10 text-sky-400 border-sky-500/20";
        if (status === "Completed")
          bg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        if (status === "Pending")
          bg = "bg-amber-500/10 text-amber-600 border-rose-500/20";
        if (status === "Cancelled")
          bg = "bg-rose-500/10 text-rose-400 border-rose-500/20";
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${bg}`}
          >
            {status}
          </span>
        );
      },
    },

    // actions on the order
    {
      title: "Executive Actions",
      key: "actions",
      render: (record: OrderData) => (
        <div
          className="flex gap-2 items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {record.status === "Pending" && (
            <button
              onClick={() => handleUpdateStatus(record.id, "Preparing")}
              className="bg-green-900/40 hover:bg-green-800 text-gray-400! text-xs font-extrabold py-1.5 px-3.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-md shadow-[#d4af37]/10"
            >
              Accept
            </button>
          )}

          {record.status === "Preparing" && (
            <button
              onClick={() => handleUpdateStatus(record.id, "Completed")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-1.5 px-3.5 rounded-lg cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-600/10"
            >
              Completed
            </button>
          )}

          {(record.status === "Completed" || record.status === "Cancelled") && (
            <button
              onClick={() => handleUpdateStatus(record.id, "Archived")}
              className="bg-red-900/40 hover:bg-red-700/40 text-white text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-all active:scale-95"
            >
              Archive
            </button>
          )}

          {record.status === "Pending" && (
            <button
              onClick={() => handleUpdateStatus(record.id, "Cancelled")}
              className="bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 text-rose-400 text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-all active:scale-95"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminNavigation />
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#001529",
            colorText: "#cbd5e1",
            colorTextHeading: "#cbd5e1",
            colorPrimary: "#d4af37",
            colorBorderSecondary: "#cbd5e1",
          },
          components: {
            Table: {
              headerBg: "#002140",
              rowHoverBg: "#002140",
            },
          },
        }}
      >
        <div className="p-6 bg-[#001529]  flex gap-6 items-start shadow-2xl border border-[#002140] min-h-screen">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="text-[#d4af37]">
                    <MdOutlineRestaurant />
                  </span>{" "}
                  {archived ? "Archived Orders" : "Live Luxury Orders Monitor"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {archived
                    ? ""
                    : "Real-time premium kitchen workflow management controller"}
                </p>
              </div>

              {orders.length > 0 && (
                <div className="grow mx-4">
                  <SearchAndFilter
                    search={search}
                    setSearch={setSearch}
                    downloadloading={loadingDownload}
                    convertToPdf={convertToPdf}
                    filterData={filterData}
                  />
                </div>
              )}

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={fetchOrders}
                  className="bg-[#002140] flex items-center gap-2 hover:bg-[#003366] text-[#d4af37]! border border-[#d4af37]/30 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition-all shadow-inner"
                >
                  <span>
                    <FiRefreshCw size={20} color="#d4af37" />
                  </span>
                  Sync Live Data
                </button>

                {archived && orders.length > 0 && (
                  <button
                    onClick={() =>
                      confirmActionWithToast(handleDeletedArchiveOrders)
                    }
                    className="bg-[#002140] flex items-center gap-2 hover:bg-[#003366] text-red-900! border border-[#d4af37]/30 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition-all shadow-inner"
                  >
                    <span>
                      <MdDelete size={20} color="#82181a " />
                    </span>
                    Delete All
                  </button>
                )}
              </div>
            </div>

            {!archived && <DashboardCount data={filterData} />}

            {fetchError && (
              <div className="mb-4 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-100">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Live data unavailable</p>
                    <p className="text-xs text-rose-200/80">{fetchError}</p>
                  </div>
                  <button
                    onClick={fetchOrders}
                    className="text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <Table
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedOrder(record);
                    setShowModal(true);
                  },
                  className: "cursor-pointer overflow-x-auto",
                })}
                rowKey="id"
                dataSource={filterData}
                columns={
                  archived
                    ? columns.filter((col) => col.key !== "actions")
                    : columns
                }
                column={{ align: "center", ellipsis: true }}
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="overflow-hidden rounded-xl border border-[#002140]"
                locale={{
                  emptyText: (
                    <EmptySatet
                      type="adminOrders"
                      description={
                        orders.length > 0
                          ? "No orders match your search. Try a different query."
                          : archived
                            ? "No archived orders found"
                            : "There are currently no active orders for this restaurant"
                      }
                    />
                  ),
                }}
              />
            </div>
          </div>

          {/* <NotificationsSystem /> */}

          {showModal && (
            <ModalComponent
              open={showModal}
              handleCancel={() => setShowModal(false)}
              orderDetails={selectedOrder}
              isAdmin={true}
            />
          )}
        </div>
      </ConfigProvider>
    </>
  );
};

export default AdminTable;
