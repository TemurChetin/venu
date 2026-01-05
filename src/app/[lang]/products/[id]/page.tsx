"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, Heart, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/features/detail/product-gallery";
import { SellerInfo } from "@/features/detail/seller-info";
import { ProductReviews } from "@/features/detail/product-reviews";
import { RelatedProducts } from "@/features/detail/related-products";
import {
  useProductDetail,
  useProductReviews,
  useRelatedProducts,
} from "@/services/queries/products";
import { useFormatCurrency } from "@/lib/format-currency";
import { useSession } from "next-auth/react";
import { PhoneAuthModal } from "@/components/auth";
import {
  useAddToCart,
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/services/queries";
import {
  StructuredData,
  generateProductSchema,
  generateBreadcrumbSchema,
} from "@/components/seo/structured-data";

export default function DetailPage() {
  const params = useParams();
  const productSlug = params?.id as string;
  const lang = (params?.lang as string) || "uz";

  const { data: productData, isLoading: isLoadingProduct } =
    useProductDetail(productSlug);
  const { data: reviewsData } = useProductReviews(productSlug);
  const { data: relatedProductsData } = useRelatedProducts(productData?.id, 4);

  const product = productData;
  const reviews = reviewsData?.reviews || [];
  const relatedProducts = relatedProductsData || [];

  const formatCurrency = useFormatCurrency();

  const { data: session } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const addToCart = useAddToCart();

  // Wishlist hooks - only fetch when user is authenticated
  const { data: wishlistData } = useWishlist(!!session);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate price with discount
  const priceInfo = useMemo(() => {
    if (!product) return null;

    const originalPrice = product.unit_price;
    let discountedPrice = originalPrice;

    if (product.discount > 0) {
      if (product.discount_type === "percentage") {
        discountedPrice = originalPrice * (1 - product.discount / 100);
      } else {
        discountedPrice = originalPrice - product.discount;
      }
    }

    const discountPercent =
      product.discount > 0
        ? product.discount_type === "percentage"
          ? product.discount
          : Math.round((product.discount / originalPrice) * 100)
        : 0;

    return {
      originalPrice,
      discountedPrice,
      discountPercent,
    };
  }, [product]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!product?.rating || product.rating.length === 0) return 0;
    const sum = product.rating.reduce((a: number, b: number) => a + b, 0);
    return sum / product.rating.length;
  }, [product]);

  // Initialize selected color and size when product loads
  useEffect(() => {
    if (
      product?.colors &&
      product.colors.length > 0 &&
      selectedColor === null
    ) {
      setSelectedColor(product.colors[0].id);
    }
    if (product?.sizes && product.sizes.length > 0 && selectedSize === null) {
      setSelectedSize(product.sizes[0].value);
    }
  }, [product, selectedColor, selectedSize]);

  useEffect(() => {
    console.log(product);
  }, [product]);

  // Update wishlist status when wishlistData or product changes
  useEffect(() => {
    if (product && wishlistData) {
      setIsWishlisted(
        wishlistData.some(
          (wishlistProduct) => wishlistProduct.product_id === product.id
        ) ?? false
      );
    }
  }, [wishlistData, product]);

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    // If user is not authenticated, show login modal
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!product) return;

    // If authenticated, toggle wishlist
    if (isWishlisted) {
      removeFromWishlist.mutate(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist.mutate(product.id);
      setIsWishlisted(true);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // If user is not authenticated, show login modal
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!product) return;

    // Find selected color name
    const selectedColorObj = product.colors?.find(
      (color: { id: number; name: string; code: string }) =>
        color.id === selectedColor
    );
    const colorName = selectedColorObj?.name || selectedColorObj?.code;

    // Add to cart with selected options
    addToCart.mutate({
      id: product.id,
      quantity: 1,
      variant: selectedSize || undefined,
      color: colorName || undefined,
    });
  };

  // Show loading state only after mount to prevent hydration mismatch
  if (!isMounted || isLoadingProduct) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Mahsulot topilmadi</p>
        </div>
      </main>
    );
  }

  // At this point, product is guaranteed to be defined
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData
        data={generateProductSchema({
          name: product.name,
          slug: product.slug,
          details: product.details,
          thumbnail: product.thumbnail,
          thumbnail_full_url: product.thumbnail_full_url,
          unit_price: product.unit_price,
          discount: product.discount,
          discount_type: product.discount_type,
          category: product.category,
          rating: product.rating,
          review_count: product.review_count || product.reviews_count,
          seller: product.seller
            ? {
                name:
                  `${product.seller.f_name || ""} ${
                    product.seller.l_name || ""
                  }`.trim() || "Venu",
              }
            : undefined,
        })}
      />
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: "Bosh sahifa", url: `/${lang}` },
          ...(product.category
            ? [
                {
                  name: product.category.name,
                  url: `/${lang}/search?category=${product.category.id}`,
                },
              ]
            : []),
          { name: product.name, url: `/${lang}/products/${product.slug}` },
        ])}
      />
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>Главная</li>
            <li>/</li>
            {product.category && (
              <>
                <li>{product.category.name}</li>
                <li>/</li>
              </>
            )}
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 mb-12">
          {/* Gallery */}
          <ProductGallery
            images={
              product.images_full_url?.map(
                (img: { path: string }) => img.path
              ) || [product.thumbnail_full_url?.path || product.thumbnail || ""]
            }
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-balance leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(averageRating)
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count || product.reviews_count || 0}{" "}
                    sharhlar)
                  </span>
                </div>
                {product.product_type && (
                  <Badge variant="secondary">{product.product_type}</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            {priceInfo && (
              <div className="space-y-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-primary">
                    {formatCurrency(Math.round(priceInfo.discountedPrice))}
                  </span>
                  {priceInfo.discountPercent > 0 && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatCurrency(Math.round(priceInfo.originalPrice))}
                      </span>
                      <Badge variant="destructive" className="bg-primary">
                        -{priceInfo.discountPercent}%
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.current_stock} dona xarid qilish mumkin
                </p>
              </div>
            )}

            <Separator />

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Rangi:</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.colors.map(
                    (color: { id: number; name: string; code: string }) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`h-10 w-10 rounded-full border-2 transition-all ${
                          selectedColor === color.id
                            ? "border-primary scale-110"
                            : "border-border"
                        }`}
                        style={{
                          backgroundColor: color.code || "#fff",
                        }}
                        title={color.name}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Hajmi:</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.sizes.map(
                    (size: { id: number; name: string; value: string }) => (
                      <Button
                        key={size.id}
                        variant={
                          selectedSize === size.value ? "default" : "outline"
                        }
                        onClick={() => setSelectedSize(size.value)}
                        className="min-w-[80px]"
                      >
                        {size.value}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Delivery Info */}
            {product.shipping_methods &&
              product.shipping_methods.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Truck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      {product.shipping_methods[0].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.shipping_methods[0].estimated_days} kun ichida
                      yetkazib beramiz
                    </p>
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <Button
                size="lg"
                className="md:flex-1 h-10 md:h-12 text-base font-medium"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addToCart.isPending ? "Qo'shilmoqda..." : "Savatga qo'shish"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="sm:w-auto h-12 bg-transparent"
                onClick={handleWishlistToggle}
                disabled={
                  addToWishlist.isPending || removeFromWishlist.isPending
                }
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>
            {/* 
            <Button
              size="lg"
              variant="secondary"
              className="w-full h-12 text-base font-medium"
            >
              1 bosishda xarid qiling
            </Button> */}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Заказы</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {product.review_count || product.reviews_count || 0}
                </p>
                <p className="text-xs text-muted-foreground">Отзывы</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {product.wish_list || product.wish_list_count || 0}
                </p>
                <p className="text-xs text-muted-foreground">В избранном</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.details && (
          <Card className="mb-12">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">Mahsulot haqida</h2>
              <div
                className="space-y-4 text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.details }}
              />
            </CardContent>
          </Card>
        )}

        {/* Seller Info */}
        {product.seller && <SellerInfo seller={product.seller} />}

        {/* Reviews */}
        <ProductReviews
          reviews={reviews}
          totalCount={reviewsData?.total_count}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}

        {/* Auth Modal */}
        <PhoneAuthModal
          open={isAuthModalOpen}
          onOpenChange={setIsAuthModalOpen}
        />
      </main>
    </>
  );
}
