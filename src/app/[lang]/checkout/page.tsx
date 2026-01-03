"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Truck,
  CreditCard,
  Check,
  Loader2,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { AddAddressModal } from "@/features/checkout/add-address-modal";
import { useFormatCurrency, formatUZS } from "@/lib/format-currency";
import {
  useAddresses,
  useDeliveryMethods,
  useChooseShippingMethod,
  useCalculateDelivery,
  useCreateOrder,
} from "@/services/queries/checkout";
import { useGuestId } from "@/services/guest-id";
import { toast } from "react-hot-toast";
import { useCart } from "@/services";
import { useConfigStore } from "@/stores";
import Image from "next/image";

export default function CheckoutNewPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { guestId } = useGuestId();
  const formatCurrency = useFormatCurrency();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const currentPath = window.location.pathname;
      router.push(`/auth?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);

  // State
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<
    "yandex" | "bts" | "free" | null
  >(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "click" | "payme"
  >("click");
  const [couponCode, setCouponCode] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);

  const { config } = useConfigStore();

  // Queries
  const { data: cartData, isLoading: isCartLoading } = useCart(true);
  const { data: addresses, isLoading: isAddressesLoading } = useAddresses();
  const selectedAddress = addresses?.find((a) => a.id === selectedAddressId);
  const { data: deliveryMethods } = useDeliveryMethods(
    selectedAddress?.region_id || null
  );

  // Mutations
  const chooseShippingMethod = useChooseShippingMethod();
  const calculateDelivery = useCalculateDelivery();
  const createOrder = useCreateOrder();

  // Calculate totals
  const cartItems = cartData || [];
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  // Calculate total discount
  const totalDiscount = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = item.product_full_info || item.product;
      if (!product) return sum;

      const originalPrice = product.unit_price || item.price || 0;
      const discount = product.discount || 0;
      const discountType = product.discount_type || "";

      // Calculate discount amount for this item
      const discountAmount =
        discount > 0
          ? discountType === "percentage" || discountType === "percent"
            ? (originalPrice * discount) / 100
            : discount
          : 0;

      const quantity = item.quantity || 0;
      return sum + discountAmount * quantity;
    }, 0);
  }, [cartItems]);

  const isFreeDeliveryEligible =
    subtotal * (config?.uzsCurrency?.exchange_rate || 0) >= 1000000;
  const howMuchToAdd =
    1000000 - subtotal * (config?.uzsCurrency?.exchange_rate || 0);

  const finalDeliveryCost =
    selectedDeliveryMethod === "free" || isFreeDeliveryEligible
      ? 0
      : deliveryCost || 0;

  // Auto-select first address
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Auto-select delivery method when address changes
  useEffect(() => {
    if (selectedAddress && deliveryMethods && deliveryMethods.length > 0) {
      // Prefer the address's delivery method, or use the first available
      const preferredMethod = selectedAddress.delivery_method;
      const methodExists = deliveryMethods.some(
        (m) => m.code === preferredMethod
      );
      if (methodExists) {
        setSelectedDeliveryMethod(preferredMethod as "yandex" | "bts" | "free");
      } else {
        setSelectedDeliveryMethod(
          deliveryMethods[0].code as "yandex" | "bts" | "free"
        );
      }
    }
  }, [selectedAddress, deliveryMethods]);

  // Track previous values to prevent unnecessary recalculations
  const prevCalcParamsRef = useRef<{
    addressId?: number;
    deliveryMethod?: string | null;
    isFreeEligible?: boolean;
  }>({});

  // Calculate delivery cost when address and delivery method are selected
  useEffect(() => {
    const addressId = selectedAddress?.id;
    const deliveryMethod = selectedDeliveryMethod;
    const isFreeEligible = isFreeDeliveryEligible;

    // Skip if values haven't changed
    const prev = prevCalcParamsRef.current;
    if (
      prev.addressId === addressId &&
      prev.deliveryMethod === deliveryMethod &&
      prev.isFreeEligible === isFreeEligible
    ) {
      return;
    }

    // Update ref
    prevCalcParamsRef.current = {
      addressId,
      deliveryMethod,
      isFreeEligible,
    };

    if (
      selectedAddress &&
      deliveryMethod &&
      deliveryMethod !== "free" &&
      !isFreeEligible
    ) {
      const customerId = session?.user?.id
        ? parseInt(session.user.id, 10)
        : null;

      if (customerId) {
        calculateDelivery.mutate(
          {
            delivery_method: deliveryMethod,
            customer_id: customerId,
            long: parseFloat(selectedAddress.longitude),
            lat: parseFloat(selectedAddress.latitude),
            district: selectedAddress.district_id.toString(),
          },
          {
            onSuccess: (data) => {
              setDeliveryCost(data.price);
            },
            onError: () => {
              setDeliveryCost(null);
            },
          }
        );
      }
    } else if (deliveryMethod === "free" || isFreeEligible) {
      setDeliveryCost(0);
    }
  }, [
    selectedAddress?.id,
    selectedAddress?.longitude,
    selectedAddress?.latitude,
    selectedAddress?.district_id,
    selectedDeliveryMethod,
    isFreeDeliveryEligible,
    session?.user?.id,
  ]);

  // Handle shipping method selection
  const handleDeliveryMethodChange = (value: string) => {
    setSelectedDeliveryMethod(value as "yandex" | "bts" | "free");
    if (value !== "free" && !isFreeDeliveryEligible) {
      // Reset delivery cost to recalculate
      setDeliveryCost(null);
    }
  };

  // Handle order submission
  const handleSubmit = async () => {
    if (!selectedAddressId || !selectedDeliveryMethod || !guestId) {
      toast.error("Iltimos, barcha kerakli ma'lumotlarni to'ldiring");
      return;
    }

    const customerId = session?.user?.id || null;
    const isGuest = !customerId;

    try {
      // Note: Shipping method choose step might be optional or needs proper ID
      // Skipping for now as the ID mapping is unclear from the API docs
      // If needed, we can add it later with proper shipping method ID mapping

      // Choose shipping method before creating order
      await chooseShippingMethod.mutateAsync({
        id: 2, // Shipping method ID (from API documentation)
        guest_id: guestId.toString(),
        cart_group_id: "all_cart_group",
      });

      // Create order
      const orderData = {
        order_note: orderNote || "",
        customer_id: customerId?.toString() || "",
        address_id: selectedAddressId.toString(),
        billing_address_id: selectedAddressId.toString(),
        coupon_code: couponCode || "",
        coupon_discount: "0",
        payment_platform: "app",
        payment_method: selectedPaymentMethod,
        callback: null,
        payment_request_from: "app",
        guest_id: guestId.toString(),
        is_guest: isGuest,
        is_check_create_account: "0",
        password: "",
        delivery_method: selectedDeliveryMethod,
      };

      await createOrder.mutateAsync(orderData);
      // Redirect will happen in the mutation's onSuccess
    } catch (error) {
      // Error is handled by mutations
      console.error("Order creation error:", error);
    }
  };

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  // Show loading skeletons while checking authentication or loading data
  const isLoading = status === "loading" || isCartLoading || isAddressesLoading;

  // Loading skeleton component
  if (isLoading) {
    return (
      <div className="w-full mt-4">
        <Skeleton className="mb-8 h-9 w-64" />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Form Skeleton */}
          <div className="col-span-12 lg:col-span-8">
            <div className="space-y-6">
              {/* Address Selection Skeleton */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-9 w-32" />
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full max-w-md" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Method Skeleton */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <Skeleton className="mb-6 h-7 w-40" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Skeleton */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <Skeleton className="mb-6 h-7 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary Skeleton */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <Skeleton className="mb-4 h-7 w-32" />

                {/* Cart Items Skeleton */}
                <div className="space-y-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Skeleton */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-lg mt-4" />
                </div>

                <Skeleton className="mt-6 h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className="w-full mt-4">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          Buyurtmani rasmiylashtirish
        </h1>
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="text-lg text-muted-foreground">
            Savatingiz bo'sh. Buyurtma berish uchun mahsulot qo'shing.
          </p>
          <Button onClick={() => router.push("/")} className="mt-6">
            Bosh sahifaga qaytish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Buyurtmani rasmiylashtirish
      </h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Form */}
        <div className="col-span-12 lg:col-span-8">
          <div className="space-y-6">
            {/* Address Selection */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <User className="h-5 w-5 text-primary" />
                  Yetkazib berish manzili
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddAddressModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Yangi manzil
                </Button>
              </div>

              {addresses && addresses.length > 0 ? (
                <RadioGroup
                  value={selectedAddressId?.toString() || ""}
                  onValueChange={(value) =>
                    setSelectedAddressId(parseInt(value, 10))
                  }
                  className="space-y-3"
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <RadioGroupItem
                          value={address.id.toString()}
                          id={`address-${address.id}`}
                        />
                        <Label
                          htmlFor={`address-${address.id}`}
                          className="flex flex-col items-start cursor-pointer font-normal flex-1"
                        >
                          <div className="font-semibold">
                            {address.contact_person_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {address.address}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {address.phone} • {address.address_type}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Hech qanday manzil qo'shilmagan
                  </p>
                  <Button onClick={() => setIsAddAddressModalOpen(true)}>
                    Yangi manzil qo'shish
                  </Button>
                </div>
              )}
            </div>

            {/* Delivery Method */}
            {selectedAddress && deliveryMethods && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                  <Truck className="h-5 w-5 text-primary" />
                  Yetkazib berish turi
                </h2>

                <RadioGroup
                  value={selectedDeliveryMethod || ""}
                  onValueChange={handleDeliveryMethodChange}
                  className="space-y-3"
                >
                  {deliveryMethods.map((method) => {
                    const isFree = method.code === "free";
                    const isDisabled = isFree && !isFreeDeliveryEligible;
                    const cost =
                      isFree || isFreeDeliveryEligible
                        ? 0
                        : method.code === selectedDeliveryMethod &&
                          deliveryCost !== null
                        ? deliveryCost
                        : null;

                    return (
                      <div
                        key={method.code}
                        className={`flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 ${
                          isDisabled ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem
                            value={method.code}
                            id={method.code}
                            disabled={isDisabled}
                          />
                          <Label
                            htmlFor={method.code}
                            className={`cursor-pointer font-normal flex-1 ${
                              isDisabled ? "cursor-not-allowed" : ""
                            }`}
                          >
                            <div className="font-semibold">{method.title}</div>
                            {isFree && (
                              <div className="text-sm text-muted-foreground">
                                {isFreeDeliveryEligible
                                  ? "1 000 000 so'mdan yuqori buyurtmalar uchun"
                                  : "Faqat 1 000 000 so'mdan yuqori buyurtmalar uchun"}
                              </div>
                            )}
                          </Label>
                        </div>
                        <span className="font-semibold">
                          {cost === null ? null : cost === 0 ? (
                            <span className="text-green-600">Bepul</span>
                          ) : (
                            formatUZS(cost)
                          )}
                        </span>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Payment Method */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                <CreditCard className="h-5 w-5 text-primary" />
                To'lov turi
              </h2>

              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value) =>
                  setSelectedPaymentMethod(value as "click" | "payme")
                }
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="payme"
                  className="relative flex bg-[#10ACAF] items-center justify-center rounded-lg border border-border p-4 transition-all cursor-pointer"
                >
                  {selectedPaymentMethod === "payme" && (
                    <div className="flex items-center justify-center absolute top-2 right-2 h-5 w-5 rounded-full bg-white">
                      <Check className="h-3 w-3 text-[#10ACAF]" />
                    </div>
                  )}
                  <RadioGroupItem
                    value="payme"
                    id="payme"
                    className="sr-only"
                  />
                  <Image
                    width={400}
                    height={90}
                    src="/payme.png"
                    alt="Payme"
                    className="h-8"
                  />
                </Label>

                <Label
                  htmlFor="click"
                  className="relative flex bg-blue-500 items-center justify-center rounded-lg border border-border p-4 transition-all cursor-pointer"
                >
                  {selectedPaymentMethod === "click" && (
                    <div className="flex items-center justify-center absolute top-2 right-2 h-5 w-5 rounded-full bg-white">
                      <Check className="h-3 w-3 text-blue-500" />
                    </div>
                  )}
                  <RadioGroupItem
                    value="click"
                    id="click"
                    className="sr-only"
                  />
                  <Image
                    width={400}
                    height={90}
                    src="/click.png"
                    alt="Click"
                    className="h-8"
                  />
                </Label>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-4 space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Buyurtma</h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {cartItems.map((item) => {
                  const itemName =
                    item.name ||
                    item.product?.name ||
                    item.product_full_info?.name ||
                    "Mahsulot";
                  const thumbnailUrl = item.thumbnail
                    ? `https://venu.uz/storage/product/thumbnail/${item.thumbnail}`
                    : item.product?.thumbnail_full_url?.path ||
                      item.product_full_info?.thumbnail_full_url?.path ||
                      "/placeholder.svg";

                  // Get product info for discount calculation
                  const product = item.product_full_info || item.product;
                  const originalPrice = product?.unit_price || item.price;
                  const discount = product?.discount || 0;
                  const discountType = product?.discount_type || "";

                  // Calculate discount amount
                  const discountAmount =
                    discount > 0
                      ? discountType === "percentage" ||
                        discountType === "percent"
                        ? (originalPrice * discount) / 100
                        : discount
                      : 0;

                  const hasDiscount = discount > 0 && discountAmount > 0;
                  const discountedPrice = hasDiscount
                    ? originalPrice - discountAmount
                    : item.price;

                  // Discount display text
                  const discountText = hasDiscount
                    ? discountType === "percentage" ||
                      discountType === "percent"
                      ? `-${discount}%`
                      : `-${formatCurrency(discount)}`
                    : null;

                  return (
                    <div key={item.id} className="flex gap-3 relative">
                      {/* Discount Badge */}
                      {discountText && (
                        <div className="absolute left-0 top-0 z-10 flex items-center justify-center rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          {discountText}
                        </div>
                      )}
                      <Image
                        width={700}
                        height={700}
                        src={thumbnailUrl}
                        alt={itemName}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="line-clamp-2 text-sm font-medium">
                          {itemName}
                        </h3>
                        <div className="mt-1 space-y-0.5">
                          {hasDiscount && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatCurrency(originalPrice)} x {item.quantity}
                            </p>
                          )}
                          <p className="text-sm font-semibold">
                            {formatCurrency(discountedPrice)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <ShoppingCart className="h-4 w-4" />
                    Mahsulotlar ({cartItems.length})
                  </span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    Yetkazish
                  </span>
                  <span className="font-medium">
                    {finalDeliveryCost === 0 ? (
                      <span className="text-green-600">Bepul</span>
                    ) : deliveryCost === null ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      formatUZS(finalDeliveryCost)
                    )}
                  </span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      Chegirma
                    </span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(totalDiscount)}
                    </span>
                  </div>
                )}

                {!isFreeDeliveryEligible &&
                  config?.uzsCurrency?.exchange_rate && (
                    <p className="rounded-lg bg-primary/10 p-3 text-xs text-primary">
                      Yana {howMuchToAdd} qo'shing va bepul yetkazishdan
                      foydalaning!
                    </p>
                  )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={
                  !selectedAddressId ||
                  !selectedDeliveryMethod ||
                  createOrder.isPending ||
                  (deliveryCost === null &&
                    selectedDeliveryMethod !== "free" &&
                    !isFreeDeliveryEligible)
                }
                className="mt-6 w-full bg-primary py-6 text-base font-semibold hover:bg-primary/90"
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buyurtma yaratilmoqda...
                  </>
                ) : (
                  "Buyurtmani tasdiqlash"
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Buyurtmani tasdiqlash orqali siz{" "}
                <a href="#" className="text-primary hover:underline">
                  foydalanish shartlari
                </a>
                ga rozilik bildirasiz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
      />
    </div>
  );
}
