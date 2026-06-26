"use client";

import { useParams } from "next/navigation";
import { RelatedProducts } from "@/features/detail/related-products";
import {
  useProductDetail,
  useRelatedProducts,
} from "@/services/queries/products";

import { LazySection } from "@/components/common/lazy";
import { HomeSkleton } from "@/components/common/homeSkleton";
import { ProductPart } from "@/features/detail/pageParts/productPart";

export default function DetailPage() {
  const params = useParams();
  const productSlug = params?.id as string;

  const { data: product, isLoading: isLoadingProduct } =
    useProductDetail(productSlug);
  const { data: relatedProductsData } = useRelatedProducts(product?.id, 4);

  const relatedProducts = relatedProductsData || [];

  return (
    <>
      <ProductPart slug={productSlug} />

      {relatedProducts.length > 0 && (
        <LazySection skeleton={<HomeSkleton />}>
          <RelatedProducts products={relatedProducts} />
        </LazySection>
      )}
    </>
  );
}
