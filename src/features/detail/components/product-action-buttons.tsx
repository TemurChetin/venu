import { useTranslations } from "next-intl";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionButtonsProps {
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  isWishlistPending: boolean;
  isAddToCartPending: boolean;
  onOneClickBuy?: () => void;
  isOneClickBuyPending?: boolean;
}

export function ProductActionButtons({
  onWishlistToggle,
  onAddToCart,
  isWishlisted,
  isWishlistPending,
  isAddToCartPending,
  onOneClickBuy,
  isOneClickBuyPending = false,
}: ProductActionButtonsProps) {
  const t = useTranslations("product");

  return (
    <>
      {onOneClickBuy && (
        <Button
          size="lg"
          variant="secondary"
          className="w-full h-12 text-base font-medium"
          onClick={onOneClickBuy}
          disabled={isOneClickBuyPending || isAddToCartPending}
        >
          {isOneClickBuyPending ? t("processing") : t("oneClickBuy")}
        </Button>
      )}
      <div className="flex gap-3 w-full">
        <Button
          variant="outline"
          className="bg-transparent"
          onClick={onWishlistToggle}
          disabled={isWishlistPending}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </Button>
        <Button
          className="flex-1 text-base font-medium"
          onClick={onAddToCart}
          disabled={isAddToCartPending}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isAddToCartPending ? t("adding") : t("addToCart")}
        </Button>
      </div>
    </>
  );
}
