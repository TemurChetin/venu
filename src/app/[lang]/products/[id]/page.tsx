"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGallery } from "@/features/detail/product-gallery";
import { SellerInfo } from "@/features/detail/seller-info";
import { ProductReviews } from "@/features/detail/product-reviews";
import { RelatedProducts } from "@/features/detail/related-products";
import {
  useProductDetail,
  useProductReviews,
  useRelatedProducts,
} from "@/services/queries/products";
import { useAddToCart } from "@/services/queries";
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
} from "@/features/detail/components";

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

  const addToCart = useAddToCart();
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

  // Show loading state only after mount to prevent hydration mismatch
  if (!isMounted || isLoadingProduct) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
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
      <ProductStructuredData product={product} lang={lang} />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <ProductBreadcrumb product={product} />

        {/* Product Section */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12 mb-12">
          <ProductGallery images={getProductImages(product)} />

          {/* Product Info */}
          <div className="col-span-4 space-y-6">
            <Card className="space-y-6">
              <CardContent className="space-y-4">
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
                  onShare={handleShare}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                  isWishlisted={isWishlisted}
                  isWishlistPending={isWishlistPending}
                  isAddToCartPending={addToCart.isPending}
                />
              </CardContent>
            </Card>
            <ProductDeliveryBanner />
            {product.seller && <SellerInfo seller={product.seller} />}
          </div>
        </div>

        <ProductDescription product={product} />
        <ProductReviews
          reviews={reviews}
          totalCount={reviewsData?.total_count}
        />

        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}

        <PhoneAuthModal
          open={isAuthModalOpen}
          onOpenChange={setIsAuthModalOpen}
        />
      </main>
    </>
  );
}
