"use client";

import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import IntelisceneSearchInput from "./inteliscene-search-input";
import { useState } from "react";
import { WishlistDrawer } from "../common/wishlist-drawer";
import { CartDrawer } from "../common/cart-drawer";
import { CatalogModal } from "./catalog-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { PhoneAuthModal } from "@/components/auth";
import { toast } from "react-hot-toast";
import {
  useWishlist,
  useRemoveFromWishlist,
  useCart,
  useUpdateCart,
  useRemoveFromCart,
  useAddToCart,
} from "@/services/queries";

export default function DesktopHeader() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session } = useSession();

  // Wishlist API hooks
  const { data: wishlistData, isLoading: isWishlistLoading } = useWishlist(
    !!session
  );
  const removeFromWishlist = useRemoveFromWishlist();

  // Cart API hooks - only fetch when user is authenticated
  const { data: cartData, isLoading: isCartLoading } = useCart(!!session);
  const updateCart = useUpdateCart();
  const removeFromCart = useRemoveFromCart();
  const addToCart = useAddToCart();

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist.mutate(productId);
  };

  // Handle add to cart from wishlist
  const handleAddToCart = (productId: number) => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    addToCart.mutate({
      id: productId,
      quantity: 1,
    });
  };

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
  const cartItems = cartData || [];
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Muvaffaqiyatli chiqildi");
    } catch (error) {
      toast.error("Chiqishda xatolik yuz berdi");
    }
  };

  return (
    <header className="z-50 relative w-full border-b border-border bg-background/95 backdrop-blur">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto flex h-10 items-center justify-between px-4 text-sm lg:px-6">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              Toshkent
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              Sotuvchi bo'lish
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              Savol-javob
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              Mening buyurtmalarim
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-base">🇺🇿</span>
              <span>O'zbekcha</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src={"/logo.png"} alt="Logo" width={130} height={80} />
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
              Katalog
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
                    <Link href="/settings">Hisobim</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Buyurtmalarim</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Chiqish
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
          <nav className="flex h-12 items-center gap-6 overflow-x-auto text-sm">
            <button className="whitespace-nowrap text-foreground font-medium hover:text-primary transition-colors">
              Elektronika
            </button>
            <button className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
              Maishiy texnika
            </button>
            <button className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
              Kiyim
            </button>
            <button className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
              Poyabzal
            </button>
            <button className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
              Aksessuarlar
            </button>
            <button className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
              Go'zallik
            </button>
            <button className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
              Salomatlik
            </button>
            <button className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors">
              Uy-ro'zg'or
            </button>
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
