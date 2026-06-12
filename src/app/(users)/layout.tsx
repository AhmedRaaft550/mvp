import React from "react";
import NavigationWithCustomTabs from "@/components/header/NavigationWithCustomTabs";
import ChatBot from "@/components/chat/ui/Chatbot-ui";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavigationWithCustomTabs />
      <main className="flex-1">{children}</main>
      <ChatBot />
    </div>
  );
}
