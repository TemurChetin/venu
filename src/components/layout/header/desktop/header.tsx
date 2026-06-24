"use client";

import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import IntelisceneSearchInput from "./inteliscene-search-input";
import { useState, useRef, useEffect } from "react";
import { WishlistDrawer } from "../common/wishlist-drawer";
import { CartDrawer } from "../common/cart-drawer";
import { CatalogModal } from "./catalog-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { PhoneAuthModal } from "@/components/auth";
import { toast } from "react-hot-toast";
import { LanguageSwitcher } from "@/components/common";
import { useTranslations } from "next-intl";
import {
  useWishlist,
  useRemoveFromWishlist,
  useCart,
  useUpdateCart,
  useRemoveFromCart,
  useAddToCart,
  useCategories,
} from "@/services/queries";

export default function DesktopHeader() {
  const t = useTranslations();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [visibleCategoriesCount, setVisibleCategoriesCount] = useState<
    number | null
  >(null);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const categoryRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const { data: session } = useSession();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const categories = categoriesData ?? [];

  const router = useRouter();

  // Wishlist API hooks
  const { data: wishlistData, isLoading: isWishlistLoading } = useWishlist(
    !!session
  );
  const removeFromWishlist = useRemoveFromWishlist();

  // Cart API hooks — works for guests too (cart is keyed by guest_id)
  const { data: cartData, isLoading: isCartLoading } = useCart();
  const updateCart = useUpdateCart();
  const removeFromCart = useRemoveFromCart();
  const addToCart = useAddToCart();

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist.mutate(productId);
  };

  // Handle add to cart from wishlist — works for guests too
  const handleAddToCart = (productId: number) => {
    setAddingProductId(productId);
    addToCart.mutate(
      {
        id: productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setAddingProductId(null);
        },
        onError: () => {
          setAddingProductId(null);
        },
      }
    );
  };

  // Handle update cart quantity
  const handleUpdateCartQuantity = (key: number, quantity: number) => {
    updateCart.mutate({ key, quantity });
  };

  // Handle remove from cart
  const handleRemoveFromCart = (key: number) => {
    removeFromCart.mutate({ key });
  };

  // Get cart items and count
  const cartItems = cartData || [];
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success(t("toast.logoutSuccess"));
    } catch (error) {
      toast.error(t("toast.logoutError"));
    }
  };

  // Calculate visible categories based on available space
  useEffect(() => {
    if (categories.length === 0) {
      setVisibleCategoriesCount(null);
      return;
    }

    const calculateVisibleCategories = () => {
      const nav = navRef.current;
      if (!nav) return;

      const navWidth = nav.offsetWidth;
      if (navWidth === 0) return; // Not yet mounted

      const gap = 24; // gap-6 = 24px
      let totalWidth = 0;
      let count = 0;
      const moreButtonWidth = 90; // Approximate width for "Ko'proq" button

      // Check each category to see if it fits
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const element = categoryRefs.current.get(category.id);

        if (element) {
          // Use offsetWidth for rendered elements, or scrollWidth as fallback
          const itemWidth =
            element.offsetWidth > 0
              ? element.offsetWidth
              : element.scrollWidth || 100; // Fallback estimate

          const neededWidth = totalWidth + itemWidth + (count > 0 ? gap : 0);

          // Check if adding this category would exceed available space
          // Account for "More" button if there are more categories after this one
          const hasMoreCategories = i < categories.length - 1;
          const spaceNeeded =
            neededWidth + (hasMoreCategories ? moreButtonWidth + gap : 0);

          // Always show at least one category, or show if it fits
          if (count === 0 || spaceNeeded <= navWidth) {
            totalWidth = neededWidth;
            count++;
          } else {
            break;
          }
        } else if (count === 0) {
          // If first element not yet measured, assume it fits
          count = 1;
        }
      }

      // Ensure at least one category is visible if we have categories
      if (count === 0 && categories.length > 0) {
        count = 1;
      }

      setVisibleCategoriesCount(count);
    };

    // Delay to ensure DOM is ready and elements are measured
    const timeoutId = setTimeout(calculateVisibleCategories, 100);

    // Recalculate on window resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateVisibleCategories, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [categories]);

  const visibleCategories =
    visibleCategoriesCount !== null
      ? categories.slice(0, visibleCategoriesCount)
      : categories;
  const hiddenCategories =
    visibleCategoriesCount !== null
      ? categories.slice(visibleCategoriesCount)
      : [];

  return (
    <header className="z-50 relative w-full border-b border-border bg-background/95 backdrop-blur">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto flex h-10 items-center justify-between px-4 text-sm lg:px-6">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              {t("common.city")}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://t.me/Venumarketplace"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common.becomeSeller")}
            </Link>
            <Link
              href={"https://t.me/Venumarketplace"}
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common.faq")}
            </Link>
            <Link
              href={"/orders"}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("common.myOrders")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={130}
                height={38}
                style={{ height: "auto" }}
              />
            </Link>
          </div>

          {/* Catalog Button */}
          <div className="flex gap-2 items-center w-[700px]">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => setIsCatalogOpen(true)}
              size={"lg"}
            >
              {isCatalogOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              {t("common.catalog")}
            </Button>

            <IntelisceneSearchInput />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hidden sm:flex"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">{t("header.account")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t("header.orders")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("header.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden sm:flex"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            <WishlistDrawer
              onRemoveItem={handleRemoveFromWishlist}
              items={wishlistData || []}
              onAddToCart={handleAddToCart}
              isLoading={isWishlistLoading}
              addingProductId={addingProductId}
            >
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistData && wishlistData.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                    {wishlistData.length}
                  </Badge>
                )}
              </Button>
            </WishlistDrawer>
            <CartDrawer
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              items={cartItems}
              isLoading={isCartLoading}
            >
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </CartDrawer>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <nav
            ref={navRef}
            className="flex h-12 items-center gap-6 overflow-hidden text-sm relative"
          >
            {/* Render all categories for measurement when visibleCategoriesCount is null,
                or render visible ones when count is calculated */}
            {categories.map((category, index) => {
              const isVisible =
                visibleCategoriesCount === null ||
                index < visibleCategoriesCount;

              if (!isVisible && visibleCategoriesCount !== null) {
                // Don't render hidden categories (they're in the dropdown)
                return null;
              }

              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    if (el) {
                      categoryRefs.current.set(category.id, el);
                    } else {
                      categoryRefs.current.delete(category.id);
                    }
                  }}
                  className="flex items-center gap-2 whitespace-nowrap text-foreground font-medium hover:text-primary transition-colors shrink-0"
                  onClick={() => {
                    router.push(`/search?category=${category.id}`);
                  }}
                >
                  {category.icon_full_url.path && (
                    <Image
                      src={category.icon_full_url.path}
                      alt={category.name}
                      width={20}
                      height={20}
                    />
                  )}
                  {category.name}
                </button>
              );
            })}

            {hiddenCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 whitespace-nowrap text-foreground font-medium hover:text-primary transition-colors shrink-0">
                    {t("common.more")}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-[400px] overflow-y-auto"
                >
                  {hiddenCategories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => {
                        router.push(`/search?category=${category.id}`);
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {category.icon_full_url.path && (
                          <Image
                            src={category.icon_full_url.path}
                            alt={category.name}
                            width={20}
                            height={20}
                          />
                        )}
                        {category.name}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>

      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
      <PhoneAuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
      />
    </header>
  );
}
