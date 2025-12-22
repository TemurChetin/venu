"use client";

import { Heart, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  inStock: boolean;
}

interface WishlistDrawerProps {
  items: WishlistItem[];
  onRemoveItem: (id: string) => void;
  onAddToCart: (id: string) => void;
  children: React.ReactNode;
}

export function WishlistDrawer({
  items,
  onRemoveItem,
  onAddToCart,
  children,
}: WishlistDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0"
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            Sevimlilar ({items.length})
          </SheetTitle>
          <SheetDescription>Sizning sevimli mahsulotlaringiz</SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Sevimlilar bo'sh</p>
              <p className="text-sm text-muted-foreground">
                Mahsulotlarni sevimlilarga qo'shing
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-medium text-sm line-clamp-2 pr-8">
                        {item.name}
                      </h4>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-primary">
                          {item.price.toLocaleString()} so'm
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice.toLocaleString()}
                            </span>
                            {item.discount && (
                              <Badge
                                variant="destructive"
                                className="bg-primary text-xs"
                              >
                                -{item.discount}%
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {item.inStock ? (
                        <Button
                          size="sm"
                          className="w-full h-9"
                          onClick={() => onAddToCart(item.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Savatga qo'shish
                        </Button>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="w-full justify-center"
                        >
                          Sotuvda yo'q
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
