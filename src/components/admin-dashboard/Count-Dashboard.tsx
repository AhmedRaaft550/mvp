import { OrderData } from "../admin-dashboard/Admin-Table";

const CountDashboard = ({ data }: { data: OrderData[] }) => {
  const pendingOrders = data.filter((order) => order.status === "Pending");
  const preparingOrders = data.filter((order) => order.status === "Preparing");
  const completedOrders = data.filter((order) => order.status === "Completed");
  const totalAmount = data
    .map((order) => order.total_price)
    .reduce((curr, acc) => {
      return curr + acc;
    }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-[#002140] p-4 rounded-xl border border-[#d4af37]/20">
        <p className="text-xs text-slate-400 font-bold uppercase">
          Today&apos;s Valuation{" "}
        </p>
        <h3 className="text-xl font-black text-[#d4af37]  mt-1">
          AED {totalAmount.toFixed(2)}
        </h3>
      </div>
      <div className="bg-[#002140] p-4 rounded-xl border border-rose-500/20">
        <p className="text-xs text-slate-400 font-bold uppercase">
          Urgent Action Required
        </p>
        <h3 className="text-xl font-black text-rose-400  mt-1">
          {pendingOrders.length || 0}{" "}
          {pendingOrders.length > 1 ? "Orders" : "Order"} Pending
        </h3>
      </div>
      <div className="bg-[#002140] p-4 rounded-xl border border-sky-500/20">
        <p className="text-xs text-slate-400 font-bold uppercase">
          Active Kitchen Workflow
        </p>
        <h3 className="text-xl  text-green-700 font-semibold  mt-1">
          {preparingOrders.length || 0}{" "}
          {preparingOrders.length > 1 ? "Orders" : "Order"} Preparing
        </h3>
      </div>

      <div className="bg-[#002140] p-4 rounded-xl border border-sky-500/20">
        <p className="text-xs text-slate-400 font-bold uppercase">
          Completed Orders
        </p>
        <h3 className="text-xl font-black text-sky-400  mt-1">
          {completedOrders.length || 0}{" "}
          {completedOrders.length > 1 ? "Orders" : "Order"} Completed
        </h3>
      </div>
    </div>
  );
};

export default CountDashboard;
