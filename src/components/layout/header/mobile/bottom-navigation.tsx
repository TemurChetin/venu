"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Home, Search, ShoppingCart, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "../common/cart-drawer";

type Props = {
  cartItemsCount?: number;
};

const Navigation = [
  {
    name: "Bosh sahifa",
    href: "/",
    icon: Home,
    id: "home",
  },
  {
    name: "Qidiruv",
    href: "/search",
    icon: Search,
    id: "search",
  },
  {
    name: "Savatcha",
    icon: ShoppingCart,
    id: "cart",
    showBadge: true,
    isDrawer: true, // Cart opens drawer, doesn't navigate
  },
  {
    name: "Buyurtmalar",
    href: "/orders",
    icon: Package,
    id: "orders",
  },
  {
    name: "Profil",
    href: "/settings",
    icon: User,
    id: "settings",
  },
];

// Mock cart items for drawer
const mockCartItems = [
  {
    id: "1",
    name: "Paxta yostiqchalari Soft Cotton Lure!, 120 dona",
    price: 23455,
    quantity: 2,
    image:
      "https://media.moddb.com/images/downloads/1/297/296999/no-photo-or-blank-image-icon-loa.jpg",
    size: "16 GB",
    color: "white",
  },
];

function BottomNavigation({ cartItemsCount = 2 }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href || pathname === `/${pathname.split("/")[1]}`;
    }
    return pathname?.includes(href);
  };

  return (
    <>
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
              return (
                <CartDrawer
                  key={item.id}
                  items={mockCartItems}
                  onUpdateQuantity={() => {}}
                  onRemoveItem={() => {}}
                >
                  <button
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
