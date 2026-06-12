"use client";

// handle the user network status

import { createContext } from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type UserNetworkStatusContextType = {
  isOnline: boolean;
};

export const UserNetworkStatusContext =
  createContext<UserNetworkStatusContextType>({
    isOnline: true,
  });

const UserNetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are online");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline, please check your internet connection");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // clean up the event
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <UserNetworkStatusContext.Provider value={{ isOnline }}>
      {children}
    </UserNetworkStatusContext.Provider>
  );
};

export default UserNetworkProvider;
