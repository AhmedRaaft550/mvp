import { useState } from "react";

import { toast } from "sonner";
import useDateFormat from "./useDateFormat";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderData } from "../components/admin-dashboard/Admin-Table";

const usePdfExport = (filterData: OrderData[]) => {
  const [loadingDownload, setLoadingDownload] = useState(false);
  const { formatDateAndTime } = useDateFormat();
  const convertToPdf = () => {
    const loadingToastId = toast.loading("Generating Premium PDF Report...");
    try {
      setTimeout(() => {
        setLoadingDownload(false);
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        // report title
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 21, 41);
        doc.text("LUXURY RESTAURANT - ORDERS MANIFEST", 14, 15);

        doc.setFontSize(10);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);

        // prepare the table headers titles
        const tableHeaders = [
          [
            "Order ID",
            "Created At",
            "Customer",
            "Table",
            "Items Summary",
            "Total price",
            "Status",
          ],
        ];

        // prepare the table rows for the PDF
        const tableRows = filterData.map((order) => [
          `#${order.id}`,
          formatDateAndTime(order.created_at),
          order.customer_name || "Guest",
          `Table ${order.table_number}`,
          order.items_summary,
          `AED ${order.total_price}`,
          order.status.toUpperCase(),
        ]);

        // Draw the table
        autoTable(doc, {
          startY: 28,
          head: tableHeaders,
          body: tableRows,
          styles: {
            font: "Helvetica",
            fontSize: 9,
            cellPadding: 4,
          },
          headStyles: {
            fillColor: [0, 21, 41],
            textColor: [212, 175, 55],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250],
          },
          margin: { top: 25, left: 14, right: 14, bottom: 15 },
        });

        const fileName = `Orders_Report_${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(fileName);
        toast.success("Report downloaded successfully!", {
          id: loadingToastId,
        });
      }, 1500);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to export PDF file.", {
        id: loadingToastId,
      });
    } finally {
      toast.dismiss();
      setLoadingDownload(true);
    }
  };
  return { convertToPdf, loadingDownload };
};

export default usePdfExport;
