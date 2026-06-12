import { supabaseConfig } from "@/lib/supabase";
import { AppEndPoints } from "@/const/api/App-EndPoints";

export const getUserMenu = async () => {
  const { data, error } = await supabaseConfig
    .from(AppEndPoints.resOrders)
    .select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
