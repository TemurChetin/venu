import { useTranslations } from "next-intl";
import { Heart, ShoppingCart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionButtonsProps {
  onShare: () => void;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  isWishlistPending: boolean;
  isAddToCartPending: boolean;
  onOneClickBuy?: () => void;
}

export function ProductActionButtons({
  onShare,
  onWishlistToggle,
  onAddToCart,
  isWishlisted,
  isWishlistPending,
  isAddToCartPending,
  onOneClickBuy,
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
        >
          {t("oneClickBuy")}
        </Button>
      )}
      <div className="flex gap-3 flex-col sm:flex-row">
        <Button
          size="lg"
          variant="outline"
          className="sm:w-auto h-12 bg-transparent"
          onClick={onShare}
        >
          <Share2 />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="sm:w-auto h-12 bg-transparent"
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
          size="lg"
          className="md:flex-1 h-10 md:h-12 text-base font-medium"
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

