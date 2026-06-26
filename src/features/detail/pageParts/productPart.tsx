"use client";
import { useProductDetail, useProductReviews } from "@/services";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { PhoneAuthModal } from "@/components/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import ProductGallery from "@/features/detail/product-galler";
import { SellerInfo } from "@/features/detail/seller-info";
import { ProductReviews } from "@/features/detail/product-reviews";
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
  ProductGuarantees,
} from "@/features/detail/components";
import { Share2 } from "lucide-react";
import { MountLoadSkleton } from "@/features/detail/skletonProduct";
import { useAddToCart, useCart, useSelectCartItems } from "@/services/queries";
import { instanceAuth } from "@/services/api";
import { useGuestId } from "@/services/guest-id";
import { queryGenerator } from "@/lib/query-generator";
import { useQueryClient } from "@tanstack/react-query";
import {
  useProductSelection,
  useProductPrice,
  useProductWishlist,
} from "@/features/detail/hooks";
import { trackProductPageConversion } from "@/lib/google-ads-conversion";

export function ProductPart({ slug }: { slug: string }) {
  const t = useTranslations("product");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const params = useParams();
  const lang = (params?.lang as string) || "uz";

  const { data: product, isLoading: isLoadingProduct } = useProductDetail(slug);
  const { data: reviewsData } = useProductReviews(slug);

  const router = useRouter();
  const queryClient = useQueryClient();

  const addToCart = useAddToCart();
  const { data: cartData } = useCart();
  const { guestId } = useGuestId();
  const selectCartItems = useSelectCartItems();
  const [isOneClickBuyPending, setIsOneClickBuyPending] = useState(false);
  const {
    selectedSize,
    selectedColor,
    setSelectedSize,
    setSelectedColor,
    getSelectedColorName,
  } = useProductSelection(product);
  const priceInfo = useProductPrice(product);
  const {
    isWishlisted,
    handleToggle: handleWishlistToggle,
    isPending: isWishlistPending,
  } = useProductWishlist(product);

  const trackedProductPageIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!product || trackedProductPageIdRef.current === product.id) {
      return;
    }

    trackProductPageConversion({
      productId: product.id,
      productName: product.name,
    });
    trackedProductPageIdRef.current = product.id;
  }, [product]);

  const handleAddToCart = () => {
    // Works for guests too — cart is keyed by guest_id
    if (!product) return;

    const colorName = getSelectedColorName();

    addToCart.mutate({
      id: product.id,
      quantity: 1,
      variant: selectedSize || undefined,
      color: colorName || undefined,
      conversion: {
        value: priceInfo?.discountedPrice ?? product.unit_price,
        currency: "USD",
        productId: product.id,
        productName: product.name,
        quantity: 1,
      },
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
    // Works for guests — items go into the guest_id cart; the checkout page
    // requires login, where the guest cart is merged into the user.
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
          queryKey: ["/v1/cart", guestId],
          queryFn: async () => {
            const url = guestId
              ? `/v1/cart${queryGenerator({ guest_id: guestId })}`
              : "/v1/cart";
            const { data } = await instanceAuth.get<any[]>(url);
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
        router.push("/checkout");
      } else {
        router.push("/checkout");
      }
    } catch (error) {
      console.error("One-click buy error:", error);
    } finally {
      setIsOneClickBuyPending(false);
    }
  };

  const reviews = reviewsData?.reviews || [];

  if (isLoadingProduct) {
    return <MountLoadSkleton />;
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
      <ProductBreadcrumb
        name={product.category?.name ?? ""}
        id={product.category?.id ?? 0}
      />

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
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {product.name}
              </h1>
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

      <PhoneAuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
      />
    </>
  );
}
