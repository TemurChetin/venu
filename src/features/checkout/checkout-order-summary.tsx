"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Truck, Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format-currency";

interface OrderItem {
  id: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

interface CheckoutOrderSummaryProps {
  deliveryType: "yandex" | "bts" | "free";
  isFreeDelivery: boolean;
  onSubmit: () => void;
}

export function CheckoutOrderSummary({
  deliveryType,
  isFreeDelivery,
  onSubmit,
}: CheckoutOrderSummaryProps) {
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "1",
      image:
        "https://images.uzum.uz/crokh9mvip07shn5qbg0/t_product_540_high.jpg",
      title: "Samsung Galaxy S24 Ultra 12/256GB",
      price: 14990000,
      quantity: 1,
    },
  ]);

  const deliveryPrices = {
    yandex: 25000,
    bts: 20000,
    free: 0,
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryPrice = isFreeDelivery ? 0 : deliveryPrices[deliveryType];
  const total = subtotal + deliveryPrice;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="sticky top-4 space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Buyurtma
        </h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="line-clamp-2 text-sm font-medium">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-neutral-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-2 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-neutral-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm font-semibold">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Mahsulotlar ({items.length})
            </span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Truck className="h-4 w-4" />
              Yetkazish
            </span>
            <span className="font-medium">
              {isFreeDelivery ? (
                <span className="text-green-600">Bepul</span>
              ) : (
                formatCurrency(deliveryPrice)
              )}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-base">
            <span className="font-semibold">Jami:</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>

          {subtotal < 1000000 && (
            <p className="rounded-lg bg-primary/10 p-3 text-xs text-primary">
              Yana {formatCurrency(1000000 - subtotal)} qo'shing va bepul
              yetkazishdan foydalaning!
            </p>
          )}
        </div>

        <Button
          type="submit"
          onClick={onSubmit}
          className="mt-6 w-full bg-primary py-6 text-base font-semibold hover:bg-primary/90"
        >
          Buyurtmani tasdiqlash
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Buyurtmani tasdiqlash orqali siz{" "}
          <a href="#" className="text-primary hover:underline">
            foydalanish shartlari
          </a>
          ga rozilik bildirasiz
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-xs font-medium">Xavfsiz to'lov</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Truck className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-xs font-medium">Tez yetkazish</p>
        </div>
      </div>
    </div>
  );
}
