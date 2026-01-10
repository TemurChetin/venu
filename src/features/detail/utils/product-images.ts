import { ProductDetailResponse } from "@/types/api";

export function getProductImages(product: ProductDetailResponse | undefined): string[] {
  if (!product) return [];

  if (product.images_full_url && product.images_full_url.length > 0) {
    return product.images_full_url.map((img) => img.path);
  }

  const thumbnailPath = product.thumbnail_full_url?.path || product.thumbnail;
  return thumbnailPath ? [thumbnailPath] : [];
}


