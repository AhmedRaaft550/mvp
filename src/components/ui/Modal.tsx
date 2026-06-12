"use client";

import { Modal, Divider, ConfigProvider } from "antd";
import { FaUser } from "react-icons/fa";
import { BsFileTextFill, BsPrinterFill } from "react-icons/bs";
import { OrderData } from "../admin-dashboard/Admin-Table";
import { MdOutlineRestaurant } from "react-icons/md";
import { MdOutlineTimer } from "react-icons/md";
import useDateFormat from "@/hooks/useDateFormat";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  open: boolean;
  handleCancel: () => void;
  orderDetails: OrderData | null;
  isAdmin?: boolean;
};

const OrderDetailsModal: React.FC<Props> = ({
  open,
  handleCancel,
  orderDetails,
  isAdmin = false,
}) => {
  const { formatDateAndTime, formatTimeOnly } = useDateFormat();
  const [receiptLoading, setReceiptLoading] = useState(false);

  if (!orderDetails) return null;

  const parsedItems = orderDetails.items_summary
    .split(",")
    .map((item) => item.trim());

  const getStatusStyle = (status: string) => {
    if (status === "Preparing")
      return "text-gray-900  bg-sky-950/50 border-sky-500/30";
    if (status === "Completed")
      return "text-gray-900  bg-emerald-950/50 border-emerald-500/30";

    if (status === "Pending")
      return "text-gray-900 bg-rose-950/50 border-rose-500/30";

    return "text-amber-400 bg-amber-950/50 border-amber-500/30";
  };

  // export as PDF
  const generateReceiptPdf = (order: OrderData) => {
    const toastId = toast.loading("Compiling Premium Receipt PDF...");

    setReceiptLoading(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a5",
        });

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(0, 21, 41);
        doc.text("LUXURY RESTAURANT", 15, 20);

        doc.setFontSize(10);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(212, 175, 55);
        doc.text(`PREMIUM RECEIPT - ORDER #${order.id}`, 15, 26);

        doc.setDrawColor(0, 33, 64);
        doc.setLineWidth(0.5);
        doc.line(15, 30, 133, 30);

        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Customer:", 15, 38);
        doc.text("Position:", 85, 38);

        doc.setFont("Helvetica", "bold");
        doc.setTextColor(0, 21, 41);
        doc.text(`${order.customer_name || "Guest"}`, 15, 43);
        doc.text(`Table ${order.table_number}`, 85, 43);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Created At: ${isAdmin ? formatDateAndTime(order.created_at) : formatTimeOnly(order.created_at)}`,
          15,
          51,
        );
        doc.text(`Status: ${order.status.toUpperCase()}`, 85, 51);

        const headers = [["Qty", "Item Description"]];
        const rows = order.items_summary.split(",").map((item) => {
          const hasCount = item.includes("x");
          const qty = hasCount ? item.split("x")[0].trim() + "x" : "1x";
          const name = hasCount ? item.split("x")[1].trim() : item.trim();
          return [qty, name];
        });

        autoTable(doc, {
          startY: 57,
          head: headers,
          body: rows,
          styles: { font: "Helvetica", fontSize: 9, cellPadding: 3 },
          headStyles: {
            fillColor: [0, 21, 41],
            textColor: [212, 175, 55],
            fontStyle: "bold",
          },
          columnStyles: { 0: { cellWidth: 15, fontStyle: "bold" } },
          margin: { left: 15, right: 15 },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        if (order.customer_notes) {
          doc.setFont("Helvetica", "italic");
          doc.setFontSize(9);
          doc.setTextColor(150, 110, 30);
          doc.text(`Notes: ${order.customer_notes}`, 15, finalY);
        }

        const totalY = order.customer_notes ? finalY + 12 : finalY + 5;
        doc.setDrawColor(212, 175, 55);
        doc.line(15, totalY, 133, totalY);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 21, 41);
        doc.text("TOTAL LEDGER VALUATION:", 15, totalY + 8);
        doc.setTextColor(212, 175, 55);
        doc.text(`AED ${order.total_price}`, 95, totalY + 8);

        doc.save(`Receipt_Order_#${order.id}.pdf`);
        toast.success("Receipt downloaded successfully! ", { id: toastId });
      } catch (error) {
        console.error("PDF Export Error:", error);
        toast.error("Failed to compile receipt.", { id: toastId });
      } finally {
        setReceiptLoading(false);
      }
    }, 1500);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#001529",

          colorText: "#cbd5e1",
        },
      }}
    >
      <Modal
        title={
          <div className="flex items-center flex-col justify-between pr-6 pt-3 border-b border-[#002140] pb-3 ">
            <div className="flex items-center gap-2 flex-col">
              <span className="text-lg font-black text-[#d4af37] tracking-tight text-center">
                Order Summary
              </span>
              <span className="text-xs font-bold text-[#001529]  px-2 py-0.5 rounded-md shadow-sm font-mono">
                #{orderDetails.id || "N/A"}
              </span>
            </div>
          </div>
        }
        open={open}
        onCancel={handleCancel}
        footer={[
          <div
            key="footer"
            className="flex items-center gap-3 pt-2 border-t border-[#002140]"
          >
            <button
              key="close"
              onClick={() => generateReceiptPdf(orderDetails)}
              // onClick={handleCancel}
              disabled={receiptLoading}
              className="w-full flex justify-center items-center gap-3 bg-[#002140] hover:bg-[#002d57] text-slate-300 border border-slate-700/50 font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition-all active:scale-[0.98] disabled:bg-[#002140]/30 disabled:text-slate-500 disabled:border-slate-700/30 disabled:cursor-not-allowed"
            >
              <FaDownload />
              Download as PDF
            </button>
            {isAdmin && (
              <button
                key="print"
                onClick={() => window.print()}
                className="w-full bg-[#c99d0d] hover:bg-[#b8952e] text-[#001529]! font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/10"
              >
                <BsPrinterFill /> Print Premium Receipt
              </button>
            )}
          </div>,
        ]}
        width={500}
        centered
      >
        <div className="mt-5 space-y-5 text-slate-300">
          <div className="grid grid-cols-2 gap-3 bg-[#002140] p-4 rounded-xl border border-[#d4af37]/10 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#001529] flex items-center justify-center shadow-sm text-[#d4af37] border border-[#003366]">
                <FaUser size={13} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold m-0">
                  Customer
                </p>
                <p className="text-sm font-extrabold text-white m-0 truncate max-w-36">
                  {orderDetails.customer_name || "Guest"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold m-0">
                  Position
                </p>
                <p className="text-sm font-extrabold text-[#d4af37] m-0">
                  Table {orderDetails.table_number}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MdOutlineRestaurant size={20} className="text-[#002140]" /> Order
              Summary
            </h4>
            <div className="bg-[#002140]/80 border border-[#002140] rounded-xl overflow-hidden">
              {parsedItems.map((item, index) => {
                const hasCount = item.includes("x");
                const count = hasCount ? item.split("x")[0] + "x" : "";
                const name = hasCount ? item.split("x")[1] : item;

                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3.5 text-sm ${
                      index !== parsedItems.length - 1
                        ? "border-b border-[#002140]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {count && (
                        <span className="font-black text-[#001529] bg-[#d4af37] px-2 py-0.5 rounded text-xs font-mono">
                          {count}
                        </span>
                      )}
                      <span className="font-semibold text-slate-200">
                        {name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {orderDetails.customer_notes && (
            <div className="bg-[#002140]/80 border border-amber-500/20 p-4 rounded-xl flex gap-3 items-start">
              <BsFileTextFill className="text-[#d4af37] mt-1 shrink-0" />
              <div>
                <h4 className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider m-0 mb-1">
                  Special Instructions
                </h4>
                <p className="text-xs text-slate-300 m-0 leading-relaxed italic font-medium">
                  {orderDetails.customer_notes}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center flex-col gap-4">
            <span
              className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusStyle(orderDetails.status)}`}
            >
              Order is {orderDetails.status}
            </span>

            <span className="flex justify-center items-center gap-2 text-black">
              <MdOutlineTimer size={18} className="text-[#d4af37]" /> Order
              Created At :{" "}
              <span className="font-semibold underline">
                {isAdmin
                  ? formatDateAndTime(orderDetails.created_at)
                  : formatTimeOnly(orderDetails.created_at)}
              </span>
            </span>
          </div>
          <Divider className="my-2 border-[#002140]" />

          <div className="flex justify-between items-center bg-linear-to-r from-[#002140] to-[#001529] p-4 rounded-xl border border-[#d4af37]/20 shadow-md">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest m-0">
                {isAdmin ? "Total Ledger Valuation" : "Total Bill Amount"}
              </p>
              <p className="text-[9px] text-slate-400 m-0 mt-0.5">
                Includes premium service rates
              </p>
            </div>
            <span className="text-md font-black text-[#d4af37] tracking-tight font-mono">
              AED {orderDetails.total_price}
            </span>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default OrderDetailsModal;
