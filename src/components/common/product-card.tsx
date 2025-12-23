"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";
import { TbBasketPlus } from "react-icons/tb";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";

import { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
  colors?: { name: string; value: string }[];
}

export function ProductCard({
  product,
  colors = [
    { name: "Qora", value: "#1a1a2e" },
    { name: "Pushti", value: "#e8a0a0" },
    { name: "Bej", value: "#d4c4b0" },
  ],
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  // Calculate average rating
  const averageRating =
    product.rating && Array.isArray(product.rating) && product.rating.length > 0
      ? product.rating.reduce((sum, r) => sum + r, 0) / product.rating.length
      : 0;

  // Calculate prices
  const originalPrice = product.unit_price;
  const discountAmount =
    product.discount_type === "percentage" ||
    product.discount_type === "percent"
      ? (originalPrice * product.discount) / 100
      : product.discount;
  const discountedPrice = originalPrice - discountAmount;

  const formattedOriginalPrice = formatCurrency(originalPrice);

  // Get thumbnail image
  const thumbnailImage =
    product.thumbnail_full_url?.path ||
    (product.thumbnail
      ? `${process.env.NEXT_PUBLIC_API || ""}/storage/product/thumbnail/${
          product.thumbnail
        }`
      : null) ||
    "/placeholder.svg";

  // Get review count
  const reviewCount = product.reviews_count || product.review_count || 0;

  return (
    <>
      <Link href={`/products/${product.slug}`} className="w-full max-w-[320px]">
        {/* Header with badge and wishlist */}
        <div className="relative">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white transition-colors"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </button>

          {/* Product Image */}
          <div className="overflow-hidden rounded-xl">
            <img
              src={thumbnailImage}
              alt={product.name}
              className="h-[250px] hover:scale-105 transition-all duration-300 md:h-[315px] w-full object-cover rounded-xl overflow-hidden"
            />
          </div>

          {/* Color Options */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {colors.map((color, index) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(index)}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  selectedColor === index
                    ? "border-white ring-2 ring-gray-400"
                    : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white mt-4">
          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-foreground">
                {averageRating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({reviewCount} sharhlar)
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="mb-3 text-xs line-clamp-2 leading-snug text-foreground">
            {product.name}
          </h3>

          {/* Prices and Cart Button */}
          <div className="flex items-end justify-between">
            <div>
              {product.discount > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  {formattedOriginalPrice}
                </p>
              )}
              <p className="text-sm font-bold text-primary">
                {formatCurrency(discountedPrice)}
              </p>
            </div>
            <Button variant="default" size={"icon"}>
              <TbBasketPlus />
            </Button>
          </div>
        </div>
      </Link>
    </>
  );
}
