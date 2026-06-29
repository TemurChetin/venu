"use client";

import { useAddToCart, useCart, useSelectCartItems } from "@/services";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Product } from "@/types/api";

/**
 * "Bir bosishda sotib olish" orkestratsiyasi.
 * Tanlangan o'lcham/rang komponentdan uzatiladi — hook ichida alohida
 * useProductSelection chaqirilmaydi (aks holda foydalanuvchi tanlovi yo'qoladi).
 *
 * So'rovlar zanjiri (oldin 4 ta edi → endi 1-2 ta):
 *   1. Boshqa belgilangan itemlarni uncheck qilish (faqat kerak bo'lsa)
 *   2. Savatga qo'shish — javobda item id va is_checked qaytadi
 *   3. is_checked allaqachon 1 bo'lmasa — o'sha id'ni check qilish
 * `/v1/cart/add` javobida cart.id bo'lgani uchun savatni qayta tortib
 * (GET /v1/cart) item qidirish (eski Step 3-4) endi kerak emas.
 */
export function useOneClickBuy(
  product: Product | undefined,
  selectedSize: string | null,
  getSelectedColorName: () => string | null | undefined,
) {
  const [isPending, setIsPending] = useState(false);
  const addToCart = useAddToCart();
  const selectCartItems = useSelectCartItems();
  const { data: cartData } = useCart();
  const router = useRouter();

  const buy = async () => {
    if (!product) return;
    setIsPending(true);
    try {
      // Step 1: Boshqa belgilangan itemlarni uncheck qilamiz, checkout faqat
      // shu mahsulotni ko'rsatishi uchun (faqat belgilangan item bo'lsa).
      if (cartData && cartData.length > 0) {
        const allCheckedItemIds = cartData
          .filter((item) => item.is_checked === 1)
          .map((item) => item.id);

        if (allCheckedItemIds.length > 0) {
          await selectCartItems.mutateAsync({
            ids: allCheckedItemIds,
            action: "unchecked",
          });
        }
      }

      // Step 2: Savatga qo'shamiz — javobda item id va is_checked keladi.
      const colorName = getSelectedColorName();
      const result = await addToCart.mutateAsync({
        id: product.id,
        quantity: 1,
        variant: selectedSize || undefined,
        color: colorName || undefined,
      });


      const newItemId = result?.cart?.id;
      if (newItemId) {
        await selectCartItems.mutateAsync({
          ids: [newItemId],
          action: "checked",
        });
      }

      router.push("/checkout");
    } catch (error) {
      // Mutatsiyalarning o'z onError'i bor — bu yerda faqat loglaymiz
      console.error("One-click buy error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return { buy, isPending };
}
