"use server";

import { supabaseConfig } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppEndPoints } from "@/const/api/App-EndPoints";

export const getOrders = async (archived?: boolean) => {
  const cookiesRef = await cookies();

  const restaurantId = cookiesRef.get("restaurantId")?.value;

  if (!restaurantId) {
    redirect("/admin/login");
  }

  try {
    const { data, error } = await supabaseConfig
      .from(AppEndPoints.orders)
      .select("*")
      .eq("restaurant_id", restaurantId) // get the orders that match the restaurantId
      .filter("status", archived ? "eq" : "neq", "Archived")
      .order("created_at", { ascending: false }); // sorting the orders

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fetch Orders Error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to fetch orders" };
  }
};
