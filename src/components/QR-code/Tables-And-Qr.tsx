"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaDownload } from "react-icons/fa";

export default function MvpQrGenerator() {
  const restaurantSlug = "villa9";
  const baseUrl = `http://192.168.1.12:3000`;

  const [totalTables, setTotalTables] = useState<number>(10);

  // download single qr
  const downloadSingleQr = (tableNum: number) => {
    const svg = document.getElementById(`qr-table-${tableNum}`);
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
        downloadLink.download = `${restaurantSlug}-table-${tableNum}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  return (
    <div className="bg-[#1f2937] p-6 rounded-2xl max-w-4xl mx-auto text-white shadow-xl border border-gray-700 ">
      <div className="flex flex-col  md:flex-row justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h3 className="text-xl font-bold text-amber-400">
            QR Codes Generator
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Enter your total number of tables to generate active QR codes
            instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <label className="text-sm font-medium text-gray-300">
            Total Tables:
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={totalTables}
            onChange={(e) => setTotalTables(Number(e.target.value))}
            className="w-20 bg-[#111827] border border-gray-600 rounded-lg px-2 py-1.5 text-white font-bold text-center focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4  ">
        {Array.from({ length: totalTables }, (_, i) => i + 1).map(
          (tableNum) => {
            const qrValue = `${baseUrl}/${restaurantSlug}?table=${tableNum}`;

            return (
              <div
                key={tableNum}
                className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-between group hover:border-amber-500/50 transition-all"
              >
                <span className="text-sm font-bold text-amber-400 mb-2">
                  Table {tableNum}
                </span>

                <div className="bg-white p-2 rounded-lg mb-3">
                  <QRCodeSVG
                    id={`qr-table-${tableNum}`}
                    value={qrValue}
                    size={120}
                    level="M"
                  />
                </div>

                <button
                  onClick={() => downloadSingleQr(tableNum)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <FaDownload size={10} /> Download
                </button>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
