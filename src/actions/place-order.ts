"use server";
import { MealItem } from "@/const/menu-static-data";
import { supabaseConfig } from "@/lib/supabase";
import { cookies } from "next/headers";
import { AppEndPoints } from "@/const/api/App-EndPoints";

interface OrderPayload {
  table_number: number;
  items_summary: MealItem[];
  total_price: number;
  customer_notes?: string;
  customer_session_id?: string | null;
}

export const placeOrder = async (payload: OrderPayload) => {
  const cookiesRef = await cookies();
  const restaurantId = cookiesRef.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, error: "Restaurant ID not found" };
  }
  // place order for items count should be updated as per the user count
  try {
    const itemsSummary = payload.items_summary
      .map((item) => `${3}x ${item.name}`)
      .join(", ");
    const { data, error } = await supabaseConfig
      .from(AppEndPoints.orders)
      .insert([
        {
          table_number: payload.table_number,
          items_summary: itemsSummary,
          total_price: payload.total_price,
          customer_notes: payload.customer_notes,
          status: "Pending",
          customer_session_id: payload.customer_session_id,
          restaurant_id: restaurantId, // to post the order to the target restaurant
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "An unknown error occurred" };
    }
  }
};
