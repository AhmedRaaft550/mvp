"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaDownload } from "react-icons/fa";

interface TableQrBtnProps {
  restaurantSlug: string;
  tableNumber: string;
}

export default function TableQrBtn({
  restaurantSlug,
  tableNumber,
}: TableQrBtnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseUrl = "https://your-saas.com/r";
  const qrValue = `${baseUrl}/${restaurantSlug}?table=${tableNumber}`;

  const downloadQrCode = () => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(image, 0, 0, 400, 400);
        const png = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = png;
        downloadLink.download = `QR-${restaurantSlug}-Table-${tableNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  return (
    <div>
      <div ref={containerRef} className="hidden">
        <QRCodeSVG value={qrValue} size={250} level="M" />
      </div>

      <button
        onClick={downloadQrCode}
        className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
      >
        <FaDownload size={12} /> Download QR
      </button>
    </div>
  );
}
