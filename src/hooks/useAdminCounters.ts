"use client";

import { useEffect, useState } from "react";
import { supabaseConfig } from "@/lib/supabase";
import { AppEndPoints } from "@/const/api/App-EndPoints";

const useAdminCounters = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const getInitialCount = async () => {
      try {
        const [ordersCountRes, notificationsCountRes] = await Promise.all([
          supabaseConfig
            .from(AppEndPoints.orders)
            .select("id", { count: "exact" }),
          supabaseConfig
            .from(AppEndPoints.notifications)
            .select("id", { count: "exact" }),
        ]);

        if (isMounted) {
          if (!ordersCountRes.error) setOrdersCount(ordersCountRes.count || 0);
          if (!notificationsCountRes.error)
            setNotificationsCount(notificationsCountRes.count || 0);
        }
      } catch (error) {
        console.error("Error fetching initial counts:", error);
      }
    };

    getInitialCount();

    const adminLiveChannel = supabaseConfig
      .channel("admin-dashboard-counters")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (!isMounted) return;
          if (payload.eventType === "INSERT") {
            setOrdersCount((prev) => prev + 1);
          } else if (payload.eventType === "DELETE") {
            setOrdersCount((prev) => Math.max(0, prev - 1));
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          if (!isMounted) return;
          if (payload.eventType === "INSERT") {
            setNotificationsCount((prev) => prev + 1);
          } else if (payload.eventType === "DELETE") {
            setNotificationsCount((prev) => Math.max(0, prev - 1));
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (adminLiveChannel) {
        supabaseConfig.removeChannel(adminLiveChannel);
      }
    };
  }, []);

  return { ordersCount, notificationsCount };
};

export default useAdminCounters;
