"use client";

import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
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
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  children?: React.ReactNode;
}

export function CartDrawer({
  items,
  onUpdateQuantity,
  onRemoveItem,
  children,
}: CartDrawerProps) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0"
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            Savat ({itemCount})
          </SheetTitle>
          <SheetDescription>Sizning mahsulotlaringiz</SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Savat bo'sh</p>
              <p className="text-sm text-muted-foreground">
                Mahsulotlar qo'shib boshlang
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card"
                >
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
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span className="capitalize">{item.color}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {item.price.toLocaleString()} so'm
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 bg-transparent"
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
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
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => onRemoveItem(item.id)}
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

        {items.length > 0 && (
          <>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Oraliq summa:</span>
                  <span className="font-medium">
                    {total.toLocaleString()} so'm
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Yetkazib berish:
                  </span>
                  <span className="font-medium text-green-600">Bepul</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Jami:</span>
                  <span className="text-primary">
                    {total.toLocaleString()} so'm
                  </span>
                </div>
              </div>
              <Button size="lg" className="w-full h-12 text-base">
                Rasmiylashtirish
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
