"use server";
import { supabaseConfig } from "@/lib/supabase";
import { AppEndPoints } from "@/const/api/App-EndPoints";

export const deleteArchivedOrders = async () => {
  try {
    const { error } = await supabaseConfig
      .from(AppEndPoints.orders)
      .delete()
      .eq("status", "Archived");

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Delete Orders Error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete orders" };
  }
};
