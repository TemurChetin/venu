"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Home, Search, ShoppingCart, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "../common/cart-drawer";
import { useSession } from "next-auth/react";
import { useCart, useUpdateCart, useRemoveFromCart } from "@/services/queries";
import { PhoneAuthModal } from "@/components/auth";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  cartItemsCount?: number;
};

function BottomNavigation({ cartItemsCount: propCartItemsCount }: Props) {
  const t = useTranslations();

  const Navigation = [
    {
      name: t("navigation.home"),
      href: "/",
      icon: Home,
      id: "home",
    },
    {
      name: t("common.catalog"),
      href: "/search",
      icon: Search,
      id: "search",
    },
    {
      name: t("navigation.cart"),
      icon: ShoppingCart,
      id: "cart",
      showBadge: true,
      isDrawer: true, // Cart opens drawer, doesn't navigate
      auth_required: true,
    },
    {
      name: t("navigation.orders"),
      href: "/orders",
      icon: Package,
      id: "orders",
      auth_required: true,
    },
    {
      name: t("navigation.profile"),
      href: "/settings",
      icon: User,
      id: "settings",
      auth_required: true,
    },
  ];
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Cart API hooks - only fetch when user is authenticated
  const { data: cartData, isLoading: isCartLoading } = useCart(!!session);
  const updateCart = useUpdateCart();
  const removeFromCart = useRemoveFromCart();

  // Handle update cart quantity
  const handleUpdateCartQuantity = (key: number, quantity: number) => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    updateCart.mutate({ key, quantity });
  };

  // Handle remove from cart
  const handleRemoveFromCart = (key: number) => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    removeFromCart.mutate({ key });
  };

  // Get cart items and count
  const cartItems = cartData ?? [];
  const cartItemsCount =
    propCartItemsCount ??
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href || pathname === `/${pathname.split("/")[1]}`;
    }
    return pathname?.includes(href);
  };

  return (
    <>
      <PhoneAuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
      />
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
          "border-t border-border",
          "safe-area-inset-bottom" // For devices with notches
        )}
      >
        <div className="flex h-16 items-center justify-around px-2">
          {Navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href ? isActive(item.href) : false;

            // Special handling for cart with drawer
            if (item.isDrawer && item.id === "cart") {
              const handleCartClick = (e: React.MouseEvent) => {
                if (item.auth_required && !session) {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsAuthModalOpen(true);
                  return false;
                }
              };

              return (
                <CartDrawer
                  key={item.id}
                  items={cartItems}
                  onUpdateQuantity={handleUpdateCartQuantity}
                  onRemoveItem={handleRemoveFromCart}
                  isLoading={isCartLoading}
                >
                  <button
                    onClick={handleCartClick}
                    className={cn(
                      "relative flex flex-col items-center justify-center",
                      "min-w-0 flex-1 gap-1 p-2",
                      "transition-colors duration-200",
                      "hover:bg-accent/50 active:bg-accent",
                      "rounded-lg"
                    )}
                  >
                    <div className="relative">
                      <Icon className="h-5 w-5 transition-colors text-muted-foreground" />
                      {item.showBadge && cartItemsCount > 0 && (
                        <Badge
                          variant="destructive"
                          className={cn(
                            "absolute -right-2 -top-2 h-5 min-w-5 flex items-center justify-center p-0",
                            "text-[10px] font-semibold"
                          )}
                        >
                          {cartItemsCount > 99 ? "99+" : cartItemsCount}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] font-medium leading-tight transition-colors line-clamp-1 text-muted-foreground">
                      {item.name}
                    </span>
                  </button>
                </CartDrawer>
              );
            }

            if (!item.href) return null;

            // Handle auth required items
            if (item.auth_required) {
              const handleClick = (e: React.MouseEvent) => {
                if (!session) {
                  e.preventDefault();
                  setIsAuthModalOpen(true);
                  return;
                }
                // If authenticated, navigate to the href
                if (item.href) {
                  router.push(item.href);
                }
              };

              return (
                <button
                  key={item.id}
                  onClick={handleClick}
                  className={cn(
                    "flex flex-col items-center justify-center",
                    "min-w-0 flex-1 gap-1 p-2",
                    "transition-colors duration-200",
                    "hover:bg-accent/50 active:bg-accent",
                    "rounded-lg",
                    active && "text-primary"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium leading-tight transition-colors",
                      "line-clamp-1",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "min-w-0 flex-1 gap-1 p-2",
                  "transition-colors duration-200",
                  "hover:bg-accent/50 active:bg-accent",
                  "rounded-lg",
                  active && "text-primary"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-tight transition-colors",
                    "line-clamp-1",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default BottomNavigation;
