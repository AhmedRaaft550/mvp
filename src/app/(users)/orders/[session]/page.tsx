import UserOrdersDashboard from "@/components/orders/User-Order-Dashboard";
import { supabaseConfig } from "@/lib/supabase";
import EmptySatet from "@/components/ui/EmptyState-Ui";
import { AppEndPoints } from "@/const/api/App-EndPoints";

const page = async ({ params }: { params: Promise<{ session: string }> }) => {
  const { session } = await params;

  try {
    const { data: ordersData, error } = await supabaseConfig
      .from(AppEndPoints.orders)
      .select("*")
      .eq("customer_session_id", session) // where customer_session_id = session to get the order for each user
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!ordersData || ordersData.length === 0) {
      return (
        <div className="text-center min-h-screen flex flex-col items-center justify-center bg-[#001529]">
          <EmptySatet
            type="orders"
            description="No order history was found for this session. Place an order from the menu to track it live."
          />
        </div>
      );
    }

    return (
      <div>
        <UserOrdersDashboard ordersData={ordersData} />
      </div>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load your orders.";
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center bg-[#001529] px-4">
        <EmptySatet
          type="error"
          description={message}
          actionText="Back to menu"
          actionHref="/menu"
        />
      </div>
    );
  }
};

export default page;
