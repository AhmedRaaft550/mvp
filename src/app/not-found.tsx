"use client";

import React from "react";
import { Button, Result, ConfigProvider } from "antd";
import { useRouter } from "next/navigation";
import { BiHomeAlt } from "react-icons/bi";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d4af37",
          borderRadiusLG: 12,
        },
      }}
    >
      <div className="min-h-screen bg-[#060b13] flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-72 h-72 bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

        <Result
          className="
            p-0! max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500
            [&_.ant-result-icon]:mb-4!
          "
          icon={
            <div className="text-6xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-[#d4af37] via-[#f59e0b] to-[#78350f] select-none drop-shadow-2xl">
              404
            </div>
          }
          title={
            <h1 className="text-xl md:text-2xl font-semibold text-neutral-100 tracking-wide font-serif mt-2">
              Lost in the Menu?
            </h1>
          }
          subTitle={
            <p className="text-xs md:text-sm text-neutral-400 max-w-xs mx-auto mt-1 leading-relaxed">
              We couldn&apos;t find the page you&apos;re looking for. Let&apos;s
              get you back to our delicious dishes.
            </p>
          }
          extra={
            <div className="mt-6 flex justify-center">
              <Button
                type="primary"
                size="large"
                icon={<BiHomeAlt size={18} className="text-black" />}
                className="
                  bg-[#d4af37]! text-black! border-none! font-bold text-sm h-12 px-8 rounded-xl! 
                  flex items-center gap-2 hover:scale-105! active:scale-95! transition-all 
                  shadow-lg shadow-[#d4af37]/10 cursor-pointer
                "
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </div>
          }
        />
      </div>
    </ConfigProvider>
  );
};

export default NotFound;
