"use server";
import { cookies } from "next/headers";
import { supabaseConfig } from "@/lib/supabase";
import { AppEndPoints } from "@/const/api/App-EndPoints";

export const getrestaurantsId = async (slug?: string) => {
  const cookieStore = await cookies();

  const restaurantId = cookieStore.get("restaurantId")?.value;
  if (restaurantId) return restaurantId;

  if (slug) {
    const { data } = await supabaseConfig
      .from(AppEndPoints.restaurants)
      .select("id")
      .eq("slug", slug)
      .single();

    if (data) {
      cookieStore.set("restaurantId", data.id, { httpOnly: true, path: "/" });
      return data.id;
    }
  }

  return null;
};
