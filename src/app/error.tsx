"use client";

import React, { useEffect } from "react";
import { Button, ConfigProvider } from "antd";
import { BiRefresh } from "react-icons/bi";
import { IoLogoIonic } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError: React.FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error("Captured Application Error:", error);
  }, [error]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d4af37",
          borderRadiusLG: 12,
        },
      }}
    >
      <div className="min-h-screen bg-[#060b13] flex flex-col items-center justify-center relative overflow-hidden px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#d4af37]/5 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full text-center relative z-10 animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#1a1d24] to-[#0f1115] border border-neutral-800/80 flex items-center justify-center shadow-xl shadow-black/40 mb-6 group">
            <IoLogoIonic size={36} className="text-[#d4af37] animate-pulse" />
          </div>

          <h1 className="text-xl md:text-2xl font-semibold text-neutral-100 tracking-wide font-serif">
            Something Went Wrong in the Kitchen
          </h1>

          <p className="text-xs md:text-sm text-neutral-400 max-w-xs mx-auto mt-2 leading-relaxed">
            Our virtual team encountered an unexpected glitch while preparing
            your view. Let’s try to refresh the counter.
          </p>

          <div className="mt-8 w-full px-6">
            <Button
              type="primary"
              size="large"
              icon={<BiRefresh size={22} className="text-black" />}
              className="
                w-full bg-[#d4af37]! text-black! border-none! font-bold text-sm h-12 rounded-xl! 
                flex items-center justify-center gap-2 hover:scale-[1.02]! active:scale-[0.98]! transition-all 
                shadow-lg shadow-[#d4af37]/10 cursor-pointer
              "
              onClick={() => {
                reset();
              }}
            >
              Refresh Counter
            </Button>

            <button
              onClick={() => (window.location.href = "/")}
              className="mt-4 text-xs text-neutral-500 hover:text-[#d4af37] transition-colors cursor-pointer underline underline-offset-4"
            >
              Or go back to main menu
            </button>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default GlobalError;
