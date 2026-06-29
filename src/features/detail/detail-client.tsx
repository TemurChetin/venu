"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import ProductGallery from "@/features/detail/product-galler";
import {
  useProductDetail,
  useProductReviews,
  useRelatedProducts,
} from "@/services/queries/products";
import { useAddToCart } from "@/services/queries";
import {
  useProductSelection,
  useProductPrice,
  useProductWishlist,
} from "@/features/detail/hooks";
import { trackProductPageConversion } from "@/lib/google-ads-conversion";
import { shareProduct, getProductImages } from "@/features/detail/utils";
import {
  ProductPriceDisplay,
  ProductColorSelector,
  ProductSizeSelector,
  ProductDeliveryInfo,
  ProductStats,
  ProductActionButtons,
  ProductBreadcrumb,
  ProductDeliveryBanner,
  ProductGuarantees,
} from "@/features/detail/components";
import { Share2 } from "lucide-react";
import { MountLoadSkleton } from "@/features/detail/skletonProduct";
import { LazySection } from "@/components/common/lazy";
import { HomeSkleton } from "@/components/common/homeSkleton";
import { useOneClickBuy } from "./hooks/use-one-click-buy";

// Below-the-fold qismlar — alohida chunk'ga bo'linadi (boshlang'ich JS kichrayadi)
const ProductDescription = dynamic(() =>
  import("@/features/detail/components/product-description").then(
    (m) => m.ProductDescription,
  ),
);
const ProductReviews = dynamic(() =>
  import("@/features/detail/product-reviews").then((m) => m.ProductReviews),
);
const SellerInfo = dynamic(() =>
  import("@/features/detail/seller-info").then((m) => m.SellerInfo),
);
const RelatedProducts = dynamic(() =>
  import("@/features/detail/related-products").then((m) => m.RelatedProducts),
);

export default function DetailClient({ slug }: { slug: string }) {
  const t = useTranslations("product");
  const params = useParams();
  const lang = (params?.lang as string) || "uz";

  const { data: product, isLoading: isLoadingProduct } = useProductDetail(slug);
  const { data: reviewsData } = useProductReviews(slug);
  const { data: relatedProductsData } = useRelatedProducts(product?.id, 4);

  const addToCart = useAddToCart();
  const {
    selectedSize,
    selectedColor,
    setSelectedSize,
    setSelectedColor,
    getSelectedColorName,
  } = useProductSelection(product);
  const priceInfo = useProductPrice(product);
  const trackedProductPageIdRef = useRef<number | null>(null);

  const {
    isWishlisted,
    handleToggle: handleWishlistToggle,
    isPending: isWishlistPending,
  } = useProductWishlist(product);

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

  const reviews = reviewsData?.reviews || [];
  const relatedProducts = relatedProductsData || [];

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

  const { buy: handleOneClickBuy, isPending: isOneClickBuyPending } =
    useOneClickBuy(product, selectedSize, getSelectedColorName);

  // Show loading state only after mount to prevent hydration mismatch
  if (isLoadingProduct) {
    return <MountLoadSkleton />;
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center min-h-100">
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

      {relatedProducts.length > 0 && (
        <LazySection skeleton={<HomeSkleton />}>
          <RelatedProducts products={relatedProducts} />
        </LazySection>
      )}
    </>
  );
}
