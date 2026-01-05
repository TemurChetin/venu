import { MetadataRoute } from "next";
import { LANGUAGES } from "@/lib/constants";
import type { ProductListResponse, Product } from "@/types/api";
import axios from "axios";

/**
 * Dynamic Sitemap Generator
 * Generates sitemap for all static pages and product pages in all languages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venu.uz";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API || "";

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Define static pages (without language prefix, will be added per language)
  const staticPages = [
    "", // Home page
    "search",
    "business-page/biz-haqimizda-o-nas-about-us",
    "business-page/maxfiylik-siyosati-politika-konfidencialnosti-privacy-policy",
    "business-page/promokod-haqida",
  ];

  // Add static pages for all languages
  for (const lang of LANGUAGES) {
    for (const page of staticPages) {
      const url = page
        ? `${baseUrl}/${lang.code}/${page}`
        : `${baseUrl}/${lang.code}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "monthly",
        priority: page === "" ? 1.0 : 0.7,
      });
    }
  }

  try {
    // Get guest ID for API request
    let guestId = 845406; // Default fallback guest ID
    try {
      const guestIdResponse = await axios.get(
        `${apiBaseUrl}/api/v1/get-guest-id`
      );
      if (guestIdResponse.data?.guest_id) {
        guestId = guestIdResponse.data.guest_id;
      }
    } catch (error) {
      console.warn("Could not fetch guest ID, using default:", error);
    }

    // Fetch all products using the filter API
    // We'll fetch in batches to get all products
    const allProducts: Product[] = [];
    const limit = 20; // Fetch 20 products at a time
    let offset = 0;
    let totalSize = 0;
    let isFirstRequest = true;
    let consecutiveEmptyBatches = 0; // Track consecutive empty batches
    const MAX_CONSECUTIVE_EMPTY = 5; // Stop after 5 consecutive empty batches
    const MAX_OFFSET = 50000; // Safety limit for offset

    let batchNumber = 0;
    while (true) {
      batchNumber++;

      // Safety checks: don't exceed max offset or totalSize
      if (offset >= MAX_OFFSET) {
        console.warn(
          `⚠️ Reached max offset limit (${MAX_OFFSET}), stopping. Fetched ${allProducts.length}/${totalSize} products.`
        );
        break;
      }

      // Don't request beyond totalSize (with some buffer for API inconsistencies)
      if (totalSize > 0 && offset >= totalSize + limit * 2) {
        console.warn(
          `⚠️ Offset (${offset}) exceeds totalSize (${totalSize}) by too much, stopping. Fetched ${allProducts.length}/${totalSize} products.`
        );
        break;
      }

      try {
        const filterPayload = {
          brand: "[]",
          category: "[]",
          limit: limit.toString(),
          offset: offset,
          price_max: null,
          price_min: null,
          product_authors: "[]",
          product_type: "all",
          publishing_houses: "[]",
          search: "",
          sort_by: null,
        };

        const url = `${apiBaseUrl}/api/v1/products/filter?guest_id=${guestId}`;

        console.log(
          `🔄 [Batch ${batchNumber}] Fetching: offset=${offset}, limit=${limit}, payload:`,
          JSON.stringify(filterPayload)
        );

        const response = await axios.post(url, filterPayload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          console.error(`Failed to fetch products: ${response.statusText}`);
          break;
        }

        const data: ProductListResponse = response.data;

        // Set total size from first response
        if (isFirstRequest) {
          totalSize = data.total_size;
          isFirstRequest = false;
          console.log(
            `📦 Total products to fetch: ${totalSize}, fetching in batches of ${limit}`
          );
          console.log(
            `📋 API Response: limit=${data.limit}, offset=${data.offset}, total_size=${data.total_size}`
          );
        }

        // Check if we got products
        if (!data.products || data.products.length === 0) {
          consecutiveEmptyBatches++;

          // If we've had too many consecutive empty batches, stop
          if (consecutiveEmptyBatches >= MAX_CONSECUTIVE_EMPTY) {
            console.warn(
              `⚠️ Stopping after ${consecutiveEmptyBatches} consecutive empty batches. Fetched ${allProducts.length}/${totalSize} products.`
            );
            break;
          }

          // If we haven't reached total size yet, warn but continue
          if (allProducts.length < totalSize) {
            console.warn(
              `⚠️ No products returned at offset ${offset} (empty batch ${consecutiveEmptyBatches}/${MAX_CONSECUTIVE_EMPTY}), but we only have ${allProducts.length}/${totalSize}. Trying next offset...`
            );
            offset += limit;
            continue;
          } else {
            // We've reached total size or beyond, stop
            console.log("⚠️ No more products returned, stopping");
            break;
          }
        }

        // Reset consecutive empty batches counter if we got products
        consecutiveEmptyBatches = 0;

        allProducts.push(...data.products);
        const currentCount = allProducts.length;
        console.log(
          `✅ Fetched ${currentCount}/${totalSize} products (batch: ${data.products.length}, offset: ${offset})`
        );

        // Check if we've fetched all products - this is the ONLY condition to stop
        if (currentCount >= totalSize) {
          console.log(
            `🎯 Reached total size: ${currentCount} >= ${totalSize}, stopping`
          );
          break;
        }

        // Move to next batch - increment offset BEFORE next iteration
        offset += limit;
        console.log(`➡️ Moving to next batch, new offset will be: ${offset}`);

        // Small delay to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `❌ Error fetching products batch (offset: ${offset}):`,
          error
        );
        // Don't break on error, try to continue with what we have
        // But log the error for debugging
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", error.response?.data);
        }
        break;
      }
    }

    console.log(
      `🎉 Successfully fetched ${allProducts.length} products for sitemap`
    );

    // Generate sitemap entries for each product in all languages
    for (const product of allProducts) {
      if (!product.slug) continue;

      for (const lang of LANGUAGES) {
        sitemapEntries.push({
          url: `${baseUrl}/${lang.code}/products/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Continue with static pages even if product fetching fails
    // This prevents the site from breaking if the API is down
  }

  return sitemapEntries;
}
