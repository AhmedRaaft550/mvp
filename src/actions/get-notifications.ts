"use server";

import { supabaseConfig } from "@/lib/supabase";
import { AppEndPoints } from "@/const/api/App-EndPoints";

const getNotifications = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from(AppEndPoints.notifications)
      .select("*")
      .order("created_at", { ascending: false }); // from the latest to the oldest

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fetch Notifications Error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to fetch notifications" };
  }
};

export default getNotifications;
