"use server";

import { supabaseConfig } from "@/lib/supabase";
import { cookies } from "next/headers";
import { AppEndPoints } from "@/const/api/App-EndPoints";
interface InsertNotificationPayload {
  table_id: string;
  customer_session_id: string;
  type: "call_waiter";
}

const insertUserNotification = async (payload: InsertNotificationPayload) => {
  const cookiesRef = await cookies();
  const restaurantId = cookiesRef.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, error: "Restaurant ID not found" };
  }
  try {
    const { data, error } = await supabaseConfig
      .from(AppEndPoints.notifications)
      .insert({
        table_id: payload.table_id,
        customer_session_id: payload.customer_session_id,
        type: payload.type,
        // restaurant_id: restaurantId,
      })
      .select();

    // if there is an error, throw it
    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Insert User Notification Error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to insert user notification" };
  }
};
export default insertUserNotification;
