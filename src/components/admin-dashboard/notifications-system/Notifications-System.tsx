"use client";

import { FaBell, FaUserCheck } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import getNotifications from "@/actions/get-notifications";
import { useEffect, useState } from "react";
import useDateFormat from "@/hooks/useDateFormat";
import { supabaseConfig } from "@/lib/supabase";
import { toast } from "sonner";
import { FiRefreshCw } from "react-icons/fi";
import { TbLivePhoto } from "react-icons/tb";
// import { getrestaurantsId } from "@/actions/get-restaurantsId";
import { AppEndPoints } from "@/const/api/App-EndPoints";

interface Notification {
  id: number;
  table_id: string;
  type: string;
  created_at: string;
  status: "Pending" | "Attend" | "resolved";
}

interface AttendedNotificationStore {
  id: number;
  stoppedTime: string;
}

const NotificationsSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [attendedNotifications, setAttendedNotifications] = useState<
    AttendedNotificationStore[]
  >(() => {
    if (typeof window === "undefined") return [];

    const storedValue = localStorage.getItem("attendedNotifications");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  const { formatDateAndTime } = useDateFormat();

  const getNotificationsData = async () => {
    try {
      const response = await getNotifications();
      if (!response.success || !response.data) {
        throw new Error("Failed to fetch notifications");
      }
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculatedTime = (notificationId: number, created_at: string) => {
    const attendedItem = attendedNotifications.find(
      (item) => item.id === notificationId,
    );

    if (attendedItem) {
      return {
        time: attendedItem.stoppedTime,
        exceededFiveMinutes: false,
      };
    }

    const exceededFiveMinutes =
      currentTime - new Date(created_at).getTime() >= 60 * 1000;

    const diffInSeconds = Math.floor(
      (currentTime - new Date(created_at).getTime()) / 1000,
    );

    const minutes = Math.floor(diffInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (diffInSeconds % 60).toString().padStart(2, "0");

    return {
      time: `${minutes}:${seconds}`,
      exceededFiveMinutes,
    };
  };

  const notificationAudio = () => {
    const audio = new Audio("/sounds/user-called-notifications.mp3");
    audio.volume = 0.6;
    audio.currentTime = 0;
    if (audio) {
      audio.play();
    } else {
      toast.error(
        "Failed to play notification sound, Please interact with the page",
      );
    }
  };

  // useEffect(() => {
  //   // const fetchNotifications = async () => {
  //   //   const restaurantsId = await getrestaurantsId();
  //   //   if (!restaurantsId) {
  //   //     toast.error(
  //   //       "Restaurant ID not found, Please contact the administrator",
  //   //     );
  //   //     return;
  //   //   }

  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   getNotificationsData();

  //   const Notifications_Subscription = supabaseConfig
  //     .channel("notifications")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "notifications",
  //         filter: "restaurant_id=eq.",
  //       },
  //       (payload) => {
  //         const newNotification = payload.new as Notification;
  //         setNotifications((prev) => [newNotification, ...prev]);
  //         toast.success("New notification received");
  //         notificationAudio();
  //       },
  //     )
  //     .subscribe();

  //   return () => {
  //     supabaseConfig.removeChannel(Notifications_Subscription);
  //   };

  //   // fetchNotifications();
  // }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getNotificationsData();

    const Notifications_Subscription = supabaseConfig
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          console.log(payload);

          const newNotification = payload.new as Notification;

          setNotifications((prev) => [newNotification, ...prev]);

          toast.success("New notification received");
          notificationAudio();
        },
      )
      .subscribe();

    return () => {
      supabaseConfig.removeChannel(Notifications_Subscription);
    };
  }, []);

  const syncNotificationsSystem = () => {
    getNotificationsData();
  };

  const handleAttend = (notificationId: number, currentLiveTime: string) => {
    if (attendedNotifications.some((item) => item.id === notificationId))
      return;

    const updatedNotifications = [
      ...attendedNotifications,
      { id: notificationId, stoppedTime: currentLiveTime },
    ];

    setAttendedNotifications(updatedNotifications);
    localStorage.setItem(
      "attendedNotifications",
      JSON.stringify(updatedNotifications),
    );
  };

  const handleResolvedNotification = async (notificationId: number) => {
    const previousNotifications = [...notifications];
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    const updatedAttended = attendedNotifications.filter(
      (item) => item.id !== notificationId,
    );
    setAttendedNotifications(updatedAttended);
    localStorage.setItem(
      "attendedNotifications",
      JSON.stringify(updatedAttended),
    );

    try {
      const { error } = await supabaseConfig
        .from(AppEndPoints.notifications)
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      toast.success("Notification resolved successfully!");
    } catch (error) {
      setNotifications(previousNotifications);
      const restoredAttended = [
        ...updatedAttended,
        attendedNotifications.find((item) => item.id === notificationId),
      ].filter(Boolean) as AttendedNotificationStore[];

      setAttendedNotifications(restoredAttended);
      localStorage.setItem(
        "attendedNotifications",
        JSON.stringify(restoredAttended),
      );

      if (error instanceof Error) {
        toast.error(`Failed to resolve: ${error.message}`);
      }
    }
  };

  const totalActive = notifications.length;
  const totalUrgent = notifications.filter((n) => {
    const isAttended = attendedNotifications.some((item) => item.id === n.id);
    const exceeded =
      currentTime - new Date(n.created_at).getTime() >= 60 * 1000;
    return !isAttended && exceeded;
  }).length;

  return (
    <div className="bg-[#001529] min-h-screen text-white flex flex-col font-sans">
      <header className="bg-[#002140] border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#d4af37] shadow-md shadow-amber-950/20">
            <FaBell size={18} className="animate-bounce" />
          </div>
          <div>
            <h1 className="text-base font-black text-white uppercase tracking-wider m-0">
              Live Operations Control
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">
              Real-time table calls monitor
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="bg-[#001529] border border-slate-800 rounded-xl px-4 py-1.5 flex items-center gap-3">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Active Alerts:
            </span>
            <span className="text-sm font-black text-[#d4af37] bg-amber-500/10 px-2 py-0.5 rounded-md min-w-6 text-center">
              {totalActive}
            </span>
          </div>
          <div className="bg-[#001529] border border-slate-800 rounded-xl px-4 py-1.5 flex items-center gap-3">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Urgent (5m+):
            </span>
            <span
              className={`text-sm font-black px-2 py-0.5 rounded-md min-w-6 text-center ${totalUrgent > 0 ? "bg-rose-500/20 text-rose-500 animate-pulse" : "bg-slate-800 text-slate-500"}`}
            >
              {totalUrgent}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={syncNotificationsSystem}
            className="bg-[#002140] hover:bg-[#003366] text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-black/20"
          >
            <FiRefreshCw size={14} className="animate-spin-[duration:4s]" />
            <span className="hidden sm:inline">Sync System</span>
          </button>

          <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl flex items-center gap-2">
            <TbLivePhoto size={16} className="text-rose-500 animate-pulse" />
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest hidden sm:inline">
              Live Engine
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {notifications.map((notification: Notification) => {
              const { time, exceededFiveMinutes } = calculatedTime(
                notification.id,
                notification.created_at,
              );

              const isAttended = attendedNotifications.some(
                (item) => item.id === notification.id,
              );

              return (
                <div
                  key={notification.id}
                  className={`border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                    isAttended
                      ? "border-sky-500/20 bg-[#002140]/40 opacity-75 grayscale-30 shadow-none"
                      : exceededFiveMinutes
                        ? "border-rose-500/50 bg-linear-to-b from-rose-950/40 to-[#001529] animate-pulse ring-1 ring-rose-500/30"
                        : "border-slate-800 bg-[#002140] hover:border-amber-500/30 shadow-black/20"
                  }`}
                >
                  {!isAttended && exceededFiveMinutes && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span
                        className={`font-black px-3 py-1 rounded-lg text-xs tracking-wider shadow-inner ${
                          isAttended
                            ? "bg-slate-800 text-slate-400"
                            : exceededFiveMinutes
                              ? "bg-rose-500 text-white font-black"
                              : "bg-amber-500 text-slate-950"
                        }`}
                      >
                        TABLE {notification.table_id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-900/50 px-2 py-1 rounded-md">
                        {formatDateAndTime(notification.created_at).split(
                          " ",
                        )[1] || formatDateAndTime(notification.created_at)}
                      </span>
                    </div>

                    <h2
                      className={`text-sm font-bold tracking-wide mb-6 ${isAttended ? "text-slate-400 line-through" : "text-white"}`}
                    >
                      {notification.type}
                    </h2>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-800/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Status Clock:
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-md tracking-wide ${
                          isAttended
                            ? "text-sky-400 bg-sky-950/50 border border-sky-500/20"
                            : exceededFiveMinutes
                              ? "text-rose-400 bg-rose-950/60 border border-rose-500/30 animate-pulse"
                              : "text-emerald-400 bg-emerald-950/30 border border-emerald-500/20"
                        }`}
                      >
                        {isAttended
                          ? ` Attended in: ${time}`
                          : ` Waiting: ${time}`}
                      </span>
                    </div>

                    {!isAttended && exceededFiveMinutes && (
                      <div className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2 rounded-lg font-bold text-center">
                        ⚠️ High Priority Alert (&gt;5m)
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {!isAttended ? (
                        <button
                          onClick={() => handleAttend(notification.id, time)}
                          className="bg-slate-800/80 hover:bg-[#d4af37] hover:text-slate-950 border border-slate-700 hover:border-transparent text-slate-200 text-xs font-black py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <FaUserCheck size={13} /> Attend
                        </button>
                      ) : (
                        <div className="bg-sky-950/20 border border-sky-500/20 text-sky-400 text-[10px] font-black rounded-xl flex items-center justify-center gap-1">
                          <FaUserCheck size={12} /> Serving...
                        </div>
                      )}

                      <button
                        onClick={() =>
                          handleResolvedNotification(notification.id)
                        }
                        className={`text-xs font-black py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                          isAttended
                            ? "col-span-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "col-span-1 bg-slate-900 hover:bg-emerald-900/60 text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/30"
                        }`}
                      >
                        <FaCheckCircle size={13} /> Resolve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-xl shadow-emerald-950/10">
              <FaCheckCircle size={36} className="animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white">
              All Clear, Good Job!
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              There are no pending customer calls right now. All tables are
              perfectly served.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsSystem;
