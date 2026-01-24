"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import ProductGallery from "@/features/detail/product-galler";
import { SellerInfo } from "@/features/detail/seller-info";
import { ProductReviews } from "@/features/detail/product-reviews";
import { RelatedProducts } from "@/features/detail/related-products";
import {
  useProductDetail,
  useProductReviews,
  useRelatedProducts,
} from "@/services/queries/products";
import { useAddToCart, useCart, useSelectCartItems } from "@/services/queries";
import { instanceAuth } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { PhoneAuthModal } from "@/components/auth";
import {
  useProductSelection,
  useProductWishlist,
} from "@/features/detail/hooks";
import { shareProduct, getProductImages } from "@/features/detail/utils";
import {
  ProductPriceDisplay,
  ProductColorSelector,
  ProductSizeSelector,
  ProductDeliveryInfo,
  ProductStats,
  ProductActionButtons,
  ProductBreadcrumb,
  ProductDescription,
  ProductDeliveryBanner,
  ProductStructuredData,
  ProductGuarantees,
} from "@/features/detail/components";
import { Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Product Gallery Skeleton
function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="w-full h-[350px] md:h-[650px] rounded-lg" />
      <div className="flex gap-3 overflow-x-auto py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-16 h-24 md:w-20 md:h-32 rounded-lg shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

// Product Info Card Skeleton
function ProductInfoSkeleton() {
  return (
    <Card className="space-y-6 relative">
      <Skeleton className="absolute top-3 right-3 h-4 w-4 rounded" />
      <CardContent className="space-y-4">
        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Color Selector */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 rounded-md" />
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-11 flex-1 rounded-md" />
            <Skeleton className="h-11 w-11 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Product Description Skeleton
function ProductDescriptionSkeleton() {
  return (
    <Card className="mb-12">
      <CardContent>
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}

// Product Reviews Skeleton
function ProductReviewsSkeleton() {
  return (
    <Card className="mb-12">
      <CardContent>
        <Skeleton className="h-7 w-32 mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4 rounded" />
                  ))}
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Related Products Skeleton
function RelatedProductsSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full max-w-[320px]">
            <div className="relative">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            </div>
            <div className="bg-white mt-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <div className="flex items-end justify-between">
                <div>
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DetailPage() {
  const t = useTranslations("product");
  const params = useParams();
  const productSlug = params?.id as string;
  const lang = (params?.lang as string) || "uz";

  const { data: product, isLoading: isLoadingProduct } =
    useProductDetail(productSlug);
  const { data: reviewsData } = useProductReviews(productSlug);
  const { data: relatedProductsData } = useRelatedProducts(product?.id, 4);

  const { data: session } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const addToCart = useAddToCart();
  const { data: cartData } = useCart(!!session);
  const selectCartItems = useSelectCartItems();
  const [isOneClickBuyPending, setIsOneClickBuyPending] = useState(false);
  const {
    selectedSize,
    selectedColor,
    setSelectedSize,
    setSelectedColor,
    getSelectedColorName,
  } = useProductSelection(product);

  const {
    isWishlisted,
    handleToggle: handleWishlistToggle,
    isPending: isWishlistPending,
  } = useProductWishlist(product, session, () => setIsAuthModalOpen(true));

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const reviews = reviewsData?.reviews || [];
  const relatedProducts = relatedProductsData || [];

  const handleAddToCart = () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!product) return;

    const colorName = getSelectedColorName();

    addToCart.mutate({
      id: product.id,
      quantity: 1,
      variant: selectedSize || undefined,
      color: colorName || undefined,
    });
  };

  const handleShare = async () => {
    if (!product) return;

    await shareProduct({
      product,
      lang,
      translations: {
        shareSuccess: t("shareSuccess"),
        copySuccess: t("copySuccess"),
        copyError: t("copyError"),
      },
    });
  };

  const handleOneClickBuy = async () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!product) return;

    setIsOneClickBuyPending(true);

    try {
      // Step 1: Uncheck all cart items
      if (cartData && cartData.length > 0) {
        const allCheckedItemIds = cartData
          .filter((item) => item.is_checked === 1)
          .map((item) => item.id);

        if (allCheckedItemIds.length > 0) {
          await selectCartItems.mutateAsync({
            ids: allCheckedItemIds,
            action: "unchecked",
          });
        }
      }

      // Step 2: Add product to cart
      const colorName = getSelectedColorName();
      await addToCart.mutateAsync({
        id: product.id,
        quantity: 1,
        variant: selectedSize || undefined,
        color: colorName || undefined,
      });

      // Step 3: Wait for cart to refresh and find the newly added item
      // The addToCart mutation already invalidates queries, so we fetch fresh data
      // Use fetchQuery to get the updated cart data
      const cartItems =
        (await queryClient.fetchQuery({
          queryKey: ["/v1/cart"],
          queryFn: async () => {
            const { data } = await instanceAuth.get<any[]>("/v1/cart");
            return data;
          },
        })) || [];

      // Step 4: Find the newly added item that matches this product
      const newCartItem = cartItems.find((item) => {
        const matchesProduct = item.product_id === product.id;
        const matchesVariant = !selectedSize || item.variant === selectedSize;
        const matchesColor = !colorName || item.color === colorName;
        return matchesProduct && matchesVariant && matchesColor;
      });

      // Step 5: Check the newly added item
      if (newCartItem) {
        await selectCartItems.mutateAsync({
          ids: [newCartItem.id],
          action: "checked",
        });

        // Step 6: Redirect to checkout page
        router.push("/checkout");
      } else {
        // If item not found, still try to redirect (it might have been added)
        // The checkout page will handle checking if there are any checked items
        router.push("/checkout");
      }
    } catch (error) {
      console.error("One-click buy error:", error);
      // Error is already handled by the mutations' onError handlers
    } finally {
      setIsOneClickBuyPending(false);
    }
  };

  // Show loading state only after mount to prevent hydration mismatch
  if (!isMounted || isLoadingProduct) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Product Section Skeleton */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 lg:gap-12 mb-12">
          <div className="lg:col-span-8">
            <ProductGallerySkeleton />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <ProductInfoSkeleton />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-5 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description Skeleton */}
        <ProductDescriptionSkeleton />

        {/* Reviews Skeleton */}
        <ProductReviewsSkeleton />

        {/* Related Products Skeleton */}
        <RelatedProductsSkeleton />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">{t("notFound")}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <ProductBreadcrumb product={product} />

      {/* Product Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <ProductGallery images={getProductImages(product)} />
        </div>

        {/* Product Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="space-y-6 relative">
            <button onClick={handleShare} className="absolute top-3 right-3">
              <Share2 className="w-4 h-4" />
            </button>

            <CardContent className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <ProductPriceDisplay product={product} />
              <ProductColorSelector
                product={product}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
              <ProductSizeSelector
                product={product}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
              />
              <ProductDeliveryInfo product={product} />
              <ProductStats product={product} />
              <ProductActionButtons
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                isWishlisted={isWishlisted}
                isWishlistPending={isWishlistPending}
                isAddToCartPending={addToCart.isPending}
                onOneClickBuy={handleOneClickBuy}
                isOneClickBuyPending={isOneClickBuyPending}
              />
            </CardContent>
          </Card>
          <ProductGuarantees />
          {product.seller && <SellerInfo seller={product.seller} />}
          <ProductDeliveryBanner />
        </div>
      </div>

      <ProductDescription product={product} />
      <ProductReviews reviews={reviews} totalCount={reviewsData?.total_count} />

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}

      <PhoneAuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
      />
    </>
  );
}
