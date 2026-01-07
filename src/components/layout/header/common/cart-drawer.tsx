"use client";

import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { CartItem as ApiCartItem } from "@/types/api";
import { useFormatCurrency } from "@/lib/format-currency";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelectCartItems } from "@/services/queries/cart";

interface DisplayCartItem {
  id: number;
  key: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  is_checked?: number;
}

interface CartDrawerProps {
  items: ApiCartItem[];
  onUpdateQuantity: (key: number, quantity: number) => void;
  onRemoveItem: (key: number) => void;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export function CartDrawer({
  items,
  onUpdateQuantity,
  onRemoveItem,
  children,
  isLoading = false,
}: CartDrawerProps) {
  const t = useTranslations();
  const formatCurrency = useFormatCurrency();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const selectCartItems = useSelectCartItems();

  // Transform API cart items to display format
  const transformItem = (item: ApiCartItem): DisplayCartItem | null => {
    const product = item.product_full_info || item.product;
    if (!product) return null;

    // Calculate price (using item price if available, otherwise product price)
    const itemPrice = item.price || product.unit_price;
    const discountAmount =
      product.discount_type === "percentage" ||
      product.discount_type === "percent"
        ? (product.unit_price * product.discount) / 100
        : product.discount || 0;
    const finalPrice = itemPrice || product.unit_price - discountAmount;

    // Get product image
    const imageUrl =
      product.thumbnail_full_url?.path ||
      (product.thumbnail
        ? `${process.env.NEXT_PUBLIC_API || ""}/storage/product/thumbnail/${
            product.thumbnail
          }`
        : null) ||
      product.images_full_url?.[0]?.path ||
      "/placeholder.svg";

    return {
      id: item.id,
      key: item.id, // Using id as key for API calls
      name: product.name,
      price: finalPrice,
      quantity: item.quantity,
      image: imageUrl,
      size: item.size || product.variation?.[0]?.value,
      color: item.color || product.colors?.[0]?.name,
      is_checked: item.is_checked ?? 0,
    };
  };

  const displayItems = items
    .map(transformItem)
    .filter((item): item is DisplayCartItem => item !== null);

  // Handle checkbox change
  const handleCheckboxChange = (itemId: number, checked: boolean) => {
    selectCartItems.mutate({
      ids: [itemId],
      action: checked ? "checked" : "unchecked",
    });
  };

  // Calculate totals only for checked items
  const checkedItems = displayItems.filter((item) => item.is_checked === 1);
  const total = checkedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = displayItems.reduce((sum, item) => sum + item.quantity, 0);

  // Check if all items are checked
  const allChecked =
    displayItems.length > 0 && checkedItems.length === displayItems.length;

  // Handle check all / uncheck all
  const handleToggleAll = () => {
    const allItemIds = displayItems.map((item) => item.id);
    selectCartItems.mutate({
      ids: allItemIds,
      action: allChecked ? "unchecked" : "checked",
    });
  };

  return (
    <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0"
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            {t("cart.title")} ({itemCount})
          </SheetTitle>
          <SheetDescription>{t("cart.description")}</SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-muted-foreground">
                {t("cart.loading")}
              </p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">{t("cart.empty")}</p>
              <p className="text-sm text-muted-foreground">
                {t("cart.emptyDescription")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Check All / Uncheck All Button */}
              <div className="flex justify-end pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleAll}
                  disabled={selectCartItems.isPending}
                  className="text-xs"
                >
                  {allChecked ? t("cart.uncheckAll") : t("cart.checkAll")}
                </Button>
              </div>
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-start pt-1">
                    <Checkbox
                      checked={item.is_checked === 1}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(item.id, checked === true)
                      }
                      disabled={selectCartItems.isPending}
                    />
                  </div>
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {item.name}
                    </h4>
                    {(item.size || item.color) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {item.size && <span>{item.size}</span>}
                        {item.size && item.color && <span>•</span>}
                        {item.color && (
                          <span className="capitalize">{item.color}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {formatCurrency(item.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => {
                            if (item.quantity === 1) {
                              onRemoveItem(item.key);
                            } else {
                              onUpdateQuantity(item.key, item.quantity - 1);
                            }
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 bg-transparent"
                          onClick={() =>
                            onUpdateQuantity(item.key, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => onRemoveItem(item.key)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {displayItems.length > 0 && (
          <>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("cart.delivery")}
                  </span>
                  <span className="font-medium text-green-600">
                    {t("cart.deliveryFree")}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={(e) => {
                  if (checkedItems.length === 0) {
                    e.preventDefault();
                    return;
                  }
                  setIsCheckoutOpen(false);
                }}
                className={buttonVariants({
                  className: `w-full h-12 text-base ${
                    checkedItems.length === 0
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`,
                  variant: checkedItems.length === 0 ? "secondary" : "default",
                })}
                aria-disabled={checkedItems.length === 0}
              >
                {t("cart.checkout")}
              </Link>
              {checkedItems.length === 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  {t("cart.selectItemsToCheckout")}
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
