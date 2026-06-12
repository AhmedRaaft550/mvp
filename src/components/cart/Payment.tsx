import React, { useState } from "react";
import { Radio } from "antd";
import { FaApplePay, FaCreditCard } from "react-icons/fa";

const PaymentMethods: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="mt-6 px-4 flex justify-center items-center">
      <h2 className="text-base font-medium text-neutral-200 mb-3">
        Payment Method
      </h2>

      <Radio.Group
        onChange={(e) => setPaymentMethod(e.target.value)}
        value={paymentMethod}
        className="w-full flex flex-col gap-3"
      >
        {/* خيار Apple Pay - أساسي جداً للخليج */}
        <Radio
          value="applepay"
          className="w-full !margin-0 [&_.ant-radio]:hidden"
        >
          <div
            className={`
            flex items-center justify-between p-4 rounded-xl border transition-all w-full
            ${paymentMethod === "applepay" ? "bg-[#1e1b4b]/40 border-[#6366f1]" : "bg-[#1a1d24] border-neutral-800"}
          `}
          >
            <span className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
              <FaApplePay size={28} className="text-white" /> Apple Pay
            </span>
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "applepay" ? "border-[#6366f1]" : "border-neutral-600"}`}
            >
              {paymentMethod === "applepay" && (
                <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
              )}
            </div>
          </div>
        </Radio>

        {/* خيار البطاقة الائتمانية */}
        <Radio value="card" className="w-full !margin-0 [&_.ant-radio]:hidden">
          <div
            className={`
            flex items-center justify-between p-4 rounded-xl border transition-all w-full
            ${paymentMethod === "card" ? "bg-[#422006]/40 border-[#d4af37]" : "bg-[#1a1d24] border-neutral-800"}
          `}
          >
            <span className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
              <FaCreditCard size={20} className="text-[#d4af37]" /> Credit /
              Debit Card
            </span>
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-[#d4af37]" : "border-neutral-600"}`}
            >
              {paymentMethod === "card" && (
                <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
              )}
            </div>
          </div>
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default PaymentMethods;
