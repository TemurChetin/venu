"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Tag, CreditCard, Truck, Check } from "lucide-react";
import { CheckoutOrderSummary } from "@/features/checkout/checkout-order-summary";
import DeliveryMap from "@/features/checkout/map";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, "To'g'ri telefon raqam kiriting (+998901234567)"),
  addressType: z.enum(["home", "office", "other"]),
  address: z.string().min(10, "Manzilni to'liq kiriting"),
  deliveryType: z.enum(["yandex", "bts", "free"]),
  coupon: z.string().optional(),
  paymentType: z.enum(["payme", "click"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [orderTotal, setOrderTotal] = useState(14990000);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: "+998",
      addressType: "home",
      deliveryType: "yandex",
      paymentType: "payme",
    },
  });

  const deliveryType = watch("deliveryType");
  const isFreeDelivery = orderTotal >= 1000000;

  const onSubmit = (data: CheckoutFormData) => {
    console.log("[v0] Order data:", data);
    console.log("[v0] Selected location:", selectedLocation);
    // API call to create order
  };

  return (
    <div className="w-full mt-4">
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Buyurtmani rasmiylashtirish
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-3">
          {/* Left Side - Form */}
          <div className="col-span-8">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                  <User className="h-5 w-5 text-primary" />
                  Aloqa ma'lumotlari
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">
                      Ism va familiya{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Masalan: Abdullayev Abdulla"
                      {...register("fullName")}
                      className="mt-2"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      Telefon raqam <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+998901234567"
                      {...register("phone")}
                      className="mt-2"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <DeliveryMap />

              {/* Delivery Method */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                  <Truck className="h-5 w-5 text-primary" />
                  Yetkazib berish turi
                </h2>

                <RadioGroup
                  defaultValue="yandex"
                  onValueChange={(value) =>
                    setValue("deliveryType", value as any)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="yandex" id="yandex" />
                      <Label
                        htmlFor="yandex"
                        className="cursor-pointer font-normal"
                      >
                        <div className="font-semibold">Yandex Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          1-2 ish kuni ichida
                        </div>
                      </Label>
                    </div>
                    <span className="font-semibold">25 000 so'm</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="bts" id="bts" />
                      <Label
                        htmlFor="bts"
                        className="cursor-pointer font-normal"
                      >
                        <div className="font-semibold">BTS Logistika</div>
                        <div className="text-sm text-muted-foreground">
                          2-3 ish kuni ichida
                        </div>
                      </Label>
                    </div>
                    <span className="font-semibold">20 000 so'm</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="free"
                        id="free"
                        disabled={!isFreeDelivery}
                      />
                      <Label
                        htmlFor="free"
                        className={`cursor-pointer font-normal ${
                          !isFreeDelivery ? "opacity-50" : ""
                        }`}
                      >
                        <div className="font-semibold">Bepul yetkazish</div>
                        <div className="text-sm text-muted-foreground">
                          {isFreeDelivery
                            ? "1 000 000 so'mdan yuqori buyurtmalar uchun"
                            : "Faqat 1 000 000 so'mdan yuqori buyurtmalar uchun"}
                        </div>
                      </Label>
                    </div>
                    <span className="font-semibold text-green-600">Bepul</span>
                  </div>
                </RadioGroup>
              </div>

              {/* Coupon & Payment */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="space-y-6">
                  {/* Coupon */}
                  <div>
                    <Label htmlFor="coupon" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Promokod
                    </Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        id="coupon"
                        placeholder="Promokodni kiriting"
                        {...register("coupon")}
                      />
                      <Button type="button" variant="outline">
                        Qo'llash
                      </Button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      To'lov turi <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                      defaultValue="click"
                      onValueChange={(value) =>
                        setValue("paymentType", value as any)
                      }
                      className="mt-3 grid grid-cols-2 gap-4"
                    >
                      <Label
                        htmlFor="payme"
                        className="relative flex bg-[#10ACAF] items-center justify-center rounded-lg border border-border p-4 transition-all"
                      >
                        {watch("paymentType") === "payme" && (
                          <div className="flex items-center justify-center absolute top-2 right-2 h-5 w-5 rounded-full bg-white">
                            <Check />
                          </div>
                        )}

                        <RadioGroupItem
                          value="payme"
                          id="payme"
                          className="sr-only"
                        />
                        <img src="/payme.png" alt="Payme" className="h-8" />
                      </Label>

                      <Label
                        htmlFor="click"
                        className="relative flex bg-blue-500 items-center justify-center rounded-lg border border-border p-4 transition-all"
                      >
                        {watch("paymentType") === "click" && (
                          <div className="flex items-center justify-center absolute top-2 right-2 h-5 w-5 rounded-full bg-white">
                            <Check />
                          </div>
                        )}
                        <RadioGroupItem
                          value="click"
                          id="click"
                          className="sr-only"
                        />
                        <img src="/click.png" alt="Click" className="h-8" />
                      </Label>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-4">
            <CheckoutOrderSummary
              deliveryType={deliveryType}
              isFreeDelivery={isFreeDelivery}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
