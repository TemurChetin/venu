"use client";

import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormatCurrency } from "@/lib/format-currency";
import { TbBasketPlus } from "react-icons/tb";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
  useAddToCart,
} from "@/services/queries";

import { Product } from "@/types/api";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: wishlistData } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const addToCart = useAddToCart();

  const formatCurrency = useFormatCurrency();

  const [isWishlisted, setIsWishlisted] = useState(false);

  // Update wishlist status when wishlistData or product changes
  useEffect(() => {
    setIsWishlisted(
      wishlistData?.some(
        (wishlistProduct) => wishlistProduct.product_id === product.id
      ) ?? false
    );
  }, [wishlistData, product.id]);

  const averageRating =
    product.rating && Array.isArray(product.rating) && product.rating.length > 0
      ? product.rating.reduce((sum, r) => sum + r, 0) / product.rating.length
      : 0;

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

  // Calculate discount display text
  const discountDisplayText =
    product.discount > 0
      ? product.discount_type === "percentage" ||
        product.discount_type === "percent"
        ? `-${product.discount}%`
        : `-${formatCurrency(product.discount)}`
      : null;

  // Handle wishlist toggle — works for guests too (saved in localStorage)
  const handleWishlistToggle = async () => {
    if (isWishlisted) {
      removeFromWishlist.mutate(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist.mutate(product);
      setIsWishlisted(true);
    }
  };

  // Handle add to cart — works for guests too (cart is keyed by guest_id)
  const handleAddToCart = async () => {
    // Add to cart with default quantity 1
    addToCart.mutate({
      id: product.id,
      quantity: 1,
      conversion: {
        value: discountedPrice,
        currency: "USD",
        productId: product.id,
        productName: product.name,
        quantity: 1,
      },
    });
  };

  const isLoading =
    addToWishlist.isPending ||
    removeFromWishlist.isPending ||
    addToCart.isPending;

  return (
    <div className="w-full max-w-[320px]">
      {/* Header with badge and wishlist */}
      <div className="relative">
          {/* Discount Badge */}
          {discountDisplayText && (
            <div className="absolute left-1 top-1 z-10 flex items-center justify-center rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
              {discountDisplayText}
            </div>
          )}

          <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className="cursor-pointer absolute right-1 top-1 z-10 flex lg:h-9 lg:w-9 h-7 w-7 items-center justify-center rounded-full bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart
              className={cn(
                "lg:h-5 lg:w-5 h-4 w-4 transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </button>

          {/* Product Image */}
          <Link
            href={`/products/${product.slug}`}
            className="relative block overflow-hidden rounded-xl"
          >
            <Image
              width={315}
              height={560}
              src={thumbnailImage}
              alt={product.name}
              className="aspect-[3/4] hover:scale-105 transition-all duration-300 w-full object-cover rounded-xl overflow-hidden"
            />
          </Link>
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
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Prices and Cart Button */}
          <div className="flex items-end justify-between">
            <Link href={`/products/${product.slug}`}>
              {product.discount > 0 && (
                <p className="text-xs text-muted-foreground line-through">
                  {formattedOriginalPrice}
                </p>
              )}
              <p className="text-sm font-bold text-primary">
                {formatCurrency(discountedPrice)}
              </p>
            </Link>
            <Button
              variant="default"
              size={"icon"}
              onClick={handleAddToCart}
              disabled={isLoading || product.current_stock <= 0}
            >
              <TbBasketPlus />
            </Button>
          </div>
        </div>
      </div>
  );
}
