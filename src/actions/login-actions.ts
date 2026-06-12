"use server";

import { supabaseConfig } from "@/lib/supabase";
import { cookies } from "next/headers";
import { AppEndPoints } from "@/const/api/App-EndPoints";

export const handleAdminLogin = async (email: string, password: string) => {
  const cookiesValue = await cookies();
  const { data, error } = await supabaseConfig.auth.signInWithPassword({
    email: email,
    password: password,
  });

  console.log(data, "user Data");

  if (error) {
    return {
      success: false,
      error: error.message.includes("Invalid login credentials")
        ? "Please enter valid credentials"
        : error.message,
    };
  }

  if (data?.session) {
    const { data: restaurantData, error: restaurantError } =
      await supabaseConfig
        .from(AppEndPoints.restaurants)
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

    if (restaurantError) {
      return { success: false, error: restaurantError.message };
    }

    if (!restaurantData) {
      return {
        success: false,
        error: "This Account is not exsisting , please contact Admin support",
      };
    }

    // save the user token
    cookiesValue.set("userToken", data?.session?.access_token || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: data?.session?.expires_in,
      path: "/",
    });

    // save the restaurant id
    cookiesValue.set("restaurantId", restaurantData.id || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return { success: true, data };
};
