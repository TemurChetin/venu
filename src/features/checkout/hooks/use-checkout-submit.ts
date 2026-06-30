"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import {
  useChooseShippingMethod,
  useCreateOrder,
} from "@/services/queries/checkout";
import { createFallbackTransactionId } from "../utils/transaction-id";
import type { DeliveryMethodCode, PaymentMethod } from "../types/checkout.types";

interface UseCheckoutSubmitParams {
  guestID: number | null;
  selectedAddressId: number | null;
  selectedDeliveryMethod: DeliveryMethodCode | null;
  selectedPaymentMethod: PaymentMethod;
  orderNote: string;
  couponCode: string;
  subtotal: number;
  deliveryCost: number | null;
  isFreeDeliveryEligible: boolean;
  exchangeRate: number | undefined;
  openAuthModal: () => void;
}

/**
 * Buyurtma yaratish: shipping method tanlash + order yaratish + conversion qiymati.
 */
export function useCheckoutSubmit(params: UseCheckoutSubmitParams) {
  const { data: session } = useSession();
  const t = useTranslations("checkout");
  const chooseShippingMethod = useChooseShippingMethod();
  const createOrder = useCreateOrder();

  const isSubmitting = createOrder.isPending || chooseShippingMethod.isPending;

  const handleSubmit = async () => {
    if (!session) {
      params.openAuthModal();
      return;
    }

    const {
      guestID,
      selectedAddressId,
      selectedDeliveryMethod,
      selectedPaymentMethod,
      orderNote,
      couponCode,
      subtotal,
      deliveryCost,
      isFreeDeliveryEligible,
      exchangeRate,
    } = params;

    if (!selectedAddressId || !selectedDeliveryMethod || !guestID) {
      toast.error(t("fillAllFields"));
      return;
    }

    const customerId = session?.user?.id || null;
    const isGuest = !customerId;

    const finalDeliveryCost =
      selectedDeliveryMethod === "free" || isFreeDeliveryEligible
        ? 0
        : deliveryCost || 0;
    const rate = exchangeRate || 12700;
    const deliveryValueUsd =
      finalDeliveryCost > 0 ? finalDeliveryCost / rate : 0;
    const conversionValue = subtotal + deliveryValueUsd;

    try {
      // Choose shipping method before creating order
      await chooseShippingMethod.mutateAsync({
        id: 2, // Shipping method ID (from API documentation)
        guest_id: guestID.toString(),
        cart_group_id: "all_cart_group",
      });

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
        guest_id: guestID.toString(),
        is_guest: isGuest,
        is_check_create_account: "0",
        password: "",
        delivery_method: selectedDeliveryMethod,
      };

      await createOrder.mutateAsync({
        order: orderData,
        conversion: {
          value: conversionValue,
          currency: "USD",
          transactionId: createFallbackTransactionId(guestID),
        },
      });
      // Redirect will happen in the mutation's onSuccess
    } catch (error) {
      // Error is handled by mutations
      console.error("Order creation error:", error);
    }
  };

  return { handleSubmit, isSubmitting };
}
