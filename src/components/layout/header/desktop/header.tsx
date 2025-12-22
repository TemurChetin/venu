"use client";

import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
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

export default function DesktopHeader() {
  const [cartItems, setCartItems] = useState([
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
  ]);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "2",
      name: "Paxta yostiqchalari Soft Cotton Lure!, 120 dona",
      price: 23455,
      originalPrice: 25990,
      discount: 12,
      image:
        "https://media.moddb.com/images/downloads/1/297/296999/no-photo-or-blank-image-icon-loa.jpg",
      inStock: true,
    },
  ]);

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

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
              </DropdownMenuContent>
            </DropdownMenu>
            <WishlistDrawer
              onRemoveItem={() => {}}
              items={wishlistItems}
              onAddToCart={() => {}}
            >
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                  {wishlistItems.length}
                </Badge>
              </Button>
            </WishlistDrawer>
            <CartDrawer
              onUpdateQuantity={() => {}}
              onRemoveItem={() => {}}
              items={cartItems}
            >
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
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
    </header>
  );
}
