"use server";

import { supabaseConfig } from "@/lib/supabase";
import { AppEndPoints } from "@/const/api/App-EndPoints";

export const addBulkProductsWithImages = async (formData: FormData) => {
  try {
    const productsJson = formData.get("productsJson") as string;
    const imageFiles = formData.getAll("images") as File[];

    if (!productsJson) {
      return { success: false, message: "Products data is missing." };
    }

    const products = JSON.parse(productsJson);

    if (!Array.isArray(products)) {
      return { success: false, message: "Data format must be an array." };
    }

    const DEFAULT_IMAGE = "/images/static-item-image.png";

    const uploadedUrls = await Promise.all(
      imageFiles.map(async (file) => {
        if (!file || file.size === 0) return DEFAULT_IMAGE;

        const fileExtension = file.name.split(".").pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;

        const { error } = await supabaseConfig.storage
          .from(AppEndPoints.storge)
          .upload(uniqueFileName, file);

        if (error) {
          console.error(`Failed to upload ${file.name}:`, error.message);
          return DEFAULT_IMAGE;
        }

        const {
          data: { publicUrl },
        } = supabaseConfig.storage
          .from(AppEndPoints.storge)
          .getPublicUrl(uniqueFileName);

        return publicUrl;
      }),
    );

    const formattedProducts = products.map(
      (
        product: {
          product_name: string;
          price: number;
          description: string;
          category: string;
          image: string;
        },
        index: number,
      ) => {
        return {
          product_name: product.product_name.trim(),
          price: Number(product.price),
          description: product.description.trim(),
          category: product.category.trim(),
          image: uploadedUrls[index] || DEFAULT_IMAGE,
        };
      },
    );

    const { data, error } = await supabaseConfig
      .from(AppEndPoints.resOrders)
      .insert(formattedProducts)
      .select();

    if (error) {
      console.error("Supabase Database Bulk Insert Error:", error);
      return { success: false, message: `Database Error: ${error.message}` };
    }

    return { success: true, count: data.length };
  } catch (err) {
    console.error("Bulk upload crash:", err);
    return { success: false, message: "Invalid JSON format or server error." };
  }
};
