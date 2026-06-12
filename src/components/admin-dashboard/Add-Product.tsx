"use client";

import React, { useState } from "react";
import { addBulkProductsWithImages } from "@/actions/postOrder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BulkUploadMenu() {
  const [jsonInput, setJsonInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const route = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleBulkSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const parsedData = JSON.parse(jsonInput);

      // in case the inputs are JSON but not an array will be run the below toast
      if (!Array.isArray(parsedData)) {
        toast.error("Data must be an array of products [ {...}, {...} ]");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("productsJson", JSON.stringify(parsedData));

      selectedImages.forEach((imageFile) => {
        formData.append("images", imageFile);
      });

      // ==> hit the api call
      const result = await addBulkProductsWithImages(formData);

      if (result && result.success) {
        toast.success(
          `Success! ${result.count} products uploaded to the user menu !`,
        );
        setJsonInput("");
        setSelectedImages([]);
        route.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Failed to upload products");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#1a1d24] border border-neutral-800 rounded-2xl shadow-xl mt-10 ">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-neutral-200">
          Magic Bulk Menu Upload
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Paste your text menu, select all images at once in the exact same
          order, and you are done.
        </p>
      </div>

      <form onSubmit={handleBulkSubmit} className="space-y-5">
        {/* json input */}
        <div>
          <label className="block text-sm text-neutral-300 mb-2 font-medium">
            1. Paste Menu (JSON Array)
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value.trim())}
            placeholder="[ { 'product_name': '...', 'price': 10, ... } ]"
            rows={10}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm font-mono text-emerald-400 focus:outline-none focus:border-[#d4af37] transition-colors resize-none! "
          />
        </div>

        {/* upload images input */}
        <div>
          <label className="block text-sm text-neutral-300 mb-2 font-medium">
            2. Upload All Images (Must match the JSON list order)
          </label>
          <div className="relative border border-dashed border-neutral-800 rounded-xl p-6 bg-neutral-950 text-center hover:border-neutral-700 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-sm text-neutral-400">
              {selectedImages.length > 0
                ? ` ${selectedImages.length} images selected ready to go!`
                : "Click or drag & drop to select multiple images"}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || jsonInput.trim() === ""}
            className={`px-6 py-2.5 rounded-xl text-black font-semibold text-sm transition-all
              ${isSubmitting || jsonInput === "" ? "bg-neutral-600 cursor-not-allowed" : "bg-[#d4af37] hover:scale-[1.02]"}`}
          >
            {isSubmitting ? "Processing Upload..." : "Publish Full Menu"}
          </button>
        </div>
      </form>
    </div>
  );
}
