import { useState, useEffect } from "react";
import { ProductDetailResponse } from "@/types/api";

interface UseProductSelectionReturn {
  selectedSize: string | null;
  selectedColor: number | null;
  setSelectedSize: (size: string | null) => void;
  setSelectedColor: (colorId: number | null) => void;
  getSelectedColorName: () => string | undefined;
}

export function useProductSelection(product: ProductDetailResponse | undefined): UseProductSelectionReturn {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  // Initialize selected color and size when product loads
  useEffect(() => {
    if (!product) return;

    if (product.colors && product.colors.length > 0 && selectedColor === null) {
      setSelectedColor(product.colors[0].id);
    }

    if (product.sizes && product.sizes.length > 0 && selectedSize === null) {
      setSelectedSize(product.sizes[0].value);
    }
  }, [product, selectedColor, selectedSize]);

  const getSelectedColorName = (): string | undefined => {
    if (!product || selectedColor === null) return undefined;

    const selectedColorObj = product.colors?.find(
      (color) => color.id === selectedColor
    );

    return selectedColorObj?.name || selectedColorObj?.code;
  };

  return {
    selectedSize,
    selectedColor,
    setSelectedSize,
    setSelectedColor,
    getSelectedColorName,
  };
}

