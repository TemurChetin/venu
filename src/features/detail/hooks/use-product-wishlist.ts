import { useState, useEffect } from "react";
import { ProductDetailResponse } from "@/types/api";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/services/queries";

interface UseProductWishlistReturn {
  isWishlisted: boolean;
  handleToggle: () => void;
  isPending: boolean;
}

export function useProductWishlist(
  product: ProductDetailResponse | undefined
): UseProductWishlistReturn {
  const { data: wishlistData } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Update wishlist status when wishlistData or product changes
  useEffect(() => {
    if (product && wishlistData) {
      const isInWishlist = wishlistData.some(
        (wishlistProduct) => wishlistProduct.product_id === product.id
      );
      setIsWishlisted(isInWishlist ?? false);
    }
  }, [wishlistData, product]);

  const handleToggle = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist.mutate(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist.mutate(product);
      setIsWishlisted(true);
    }
  };

  return {
    isWishlisted,
    handleToggle,
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
}
