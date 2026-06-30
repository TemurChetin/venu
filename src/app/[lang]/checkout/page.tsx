"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useGuestId } from "@/services/guest-id";
import { useAddresses, useDeliveryMethods } from "@/services/queries/checkout";
import { useConfigStore } from "@/stores";
import { AddAddressModal } from "@/features/checkout/add-address-modal";
import { PhoneAuthModal } from "@/components/auth";
import { EmptyCheckout, LoadCheckout } from "@/features/checkout/load-empty";
import {
  AddressSelection,
  DeliveryMethodSelection,
  PaymentMethodSelection,
  OrderSummary,
} from "@/features/checkout/components";
import {
  useCheckoutCart,
  useCheckoutAddress,
  useCheckoutPricing,
  useCheckoutDelivery,
  useCheckoutSelectionRestore,
  useCheckoutSubmit,
} from "@/features/checkout/hooks";
import type { PaymentMethod } from "@/features/checkout/types/checkout.types";

export default function CheckoutNewPage() {
  const t = useTranslations("checkout");
  const { data: session, status } = useSession();
  const { guestID } = useGuestId();
  const { config } = useConfigStore();

  // Page-level UI state
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("click");
  const [couponCode] = useState("");
  const [orderNote] = useState("");
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Data + domen hook'lari
  const { cartData, cartItems, isCartLoading, isCartFetching, cartDataUpdatedAt } =
    useCheckoutCart();

  const { data: addresses, isLoading: isAddressesLoading } = useAddresses();
  const { selectedAddressId, setSelectedAddressId, selectedAddress } =
    useCheckoutAddress(addresses);

  const { data: deliveryMethods } = useDeliveryMethods(
    selectedAddress?.region_id || null,
  );

  const { subtotal, totalDiscount, isFreeDeliveryEligible, howMuchToAdd } =
    useCheckoutPricing(cartItems, config);

  const {
    selectedDeliveryMethod,
    deliveryCost,
    handleDeliveryMethodChange,
  } = useCheckoutDelivery({
    selectedAddress,
    deliveryMethods,
    isFreeDeliveryEligible,
    sessionUserId: session?.user?.id,
  });

  const { isAuthModalOpen, setIsAuthModalOpen, openAuthModal } =
    useCheckoutSelectionRestore({
      status,
      cartData,
      cartItems,
      cartDataUpdatedAt,
      isCartLoading,
      isCartFetching,
    });

  const { handleSubmit, isSubmitting } = useCheckoutSubmit({
    guestID,
    selectedAddressId,
    selectedDeliveryMethod,
    selectedPaymentMethod,
    orderNote,
    couponCode,
    subtotal,
    deliveryCost,
    isFreeDeliveryEligible,
    exchangeRate: config?.uzsCurrency?.exchange_rate,
    openAuthModal,
  });

  const handlePaymentChange = (value: PaymentMethod) => {
    setSelectedPaymentMethod(value);
    if (!session) {
      openAuthModal();
    }
  };

  const submitDisabled =
    !selectedAddressId ||
    !selectedDeliveryMethod ||
    isSubmitting ||
    (deliveryCost === null &&
      selectedDeliveryMethod !== "free" &&
      !isFreeDeliveryEligible);

  // Show loading skeletons while checking authentication or loading data
  const isLoading =
    status === "loading" || isCartLoading || isAddressesLoading;

  if (isLoading) {
    return <LoadCheckout />;
  }

  if (!cartData) {
    return <EmptyCheckout />;
  }

  return (
    <div className="w-full mt-4">
      <h1 className="mb-8 text-3xl font-bold text-foreground">{t("title")}</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side - Form */}
        <div className="col-span-12 lg:col-span-8">
          <div className="space-y-6">
            <AddressSelection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onAddNew={() => setIsAddAddressModalOpen(true)}
            />

            {selectedAddress && deliveryMethods && (
              <DeliveryMethodSelection
                deliveryMethods={deliveryMethods}
                selectedDeliveryMethod={selectedDeliveryMethod}
                deliveryCost={deliveryCost}
                isFreeDeliveryEligible={isFreeDeliveryEligible}
                onChange={handleDeliveryMethodChange}
              />
            )}

            <PaymentMethodSelection
              selectedPaymentMethod={selectedPaymentMethod}
              onChange={handlePaymentChange}
            />
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="col-span-12 lg:col-span-4">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            isFreeDeliveryEligible={isFreeDeliveryEligible}
            howMuchToAdd={howMuchToAdd}
            deliveryCost={deliveryCost}
            selectedDeliveryMethod={selectedDeliveryMethod}
            config={config}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitDisabled={submitDisabled}
          />
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
      />

      <PhoneAuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onSuccess={() => handleSubmit()}
      />
    </div>
  );
}
