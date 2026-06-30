"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { useSelectCartItems } from "@/services";
import type { CartItem, CartResponse } from "@/types/api";
import {
  readPendingSelection,
  writePendingSelection,
  clearPendingSelection,
} from "../utils/pending-selection";

interface UseCheckoutSelectionRestoreParams {
  status: "authenticated" | "loading" | "unauthenticated";
  cartData: CartResponse | undefined;
  cartItems: CartItem[];
  cartDataUpdatedAt: number;
  isCartLoading: boolean;
  isCartFetching: boolean;
}

/**
 * Login → savatni saqlash mantig'i:
 * - openAuthModal: modal ochishdan OLDIN tanlangan item identifikatorlarini
 *   localStorage'ga yozadi (reload bo'lsa ham yo'qolmaydi).
 * - Login'dan keyin: merge'langan (snapshot'dan keyin yangilangan) savatda mos
 *   item'larni topib, yangi ID'lari bo'yicha qayta "checked" qiladi.
 * - Redirect guard: savat bo'sh bo'lsa "/" ga uchiradi, lekin restore davom
 *   etayotganda yoki cart fetch bo'layotganda kutadi.
 */
export function useCheckoutSelectionRestore({
  status,
  cartData,
  cartItems,
  cartDataUpdatedAt,
  isCartLoading,
  isCartFetching,
}: UseCheckoutSelectionRestoreParams) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const selectCartItems = useSelectCartItems();

  // Re-check mutation'ini bir marta ishga tushirish uchun (effect qayta yugurganda
  // dublikat bo'lmasin). Pending tanlov localStorage'da saqlanadi.
  const selectionStartedRef = useRef(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    const pending = readPendingSelection();
    if (!pending || selectionStartedRef.current) return;
    if (!cartData || isCartFetching) return;
    // Faqat snapshot'dan KEYIN yangilangan (login merge'idan kelgan) cart'ga
    // ishlaymiz. Stale guest cart hali shu vaqtdan oldin yangilangan bo'ladi.
    if (cartDataUpdatedAt <= pending.snapshotAt) return;

    // Pending'ga mos BARCHA row'lar (checked yoki yo'q — farqi yo'q). is_checked
    // bo'yicha filtrlamaymiz: backend merge'ni yakunlab item'larni keyinroq
    // uncheck qilishi mumkin, shuning uchun proaktiv ravishda hammasini checked
    // qilamiz (idempotent) — bu yakuniy holatni kafolatlaydi.
    // Identifikatorlar guest↔merge orasida turlicha serializatsiya bo'lishi mumkin
    // (null vs "" vs undefined; number vs string) — normalizatsiya bilan solishtirib,
    // mos kelmaslik sabab item'lar tanlanmay qolishini oldini olamiz.
    const normStr = (v: string | null | undefined) =>
      v == null ? "" : String(v).trim();
    const sameIdentity = (
      p: { product_id: number; variant?: string; color?: string | null },
      item: CartItem,
    ) =>
      Number(p.product_id) === Number(item.product_id) &&
      normStr(p.variant) === normStr(item.variant) &&
      normStr(p.color) === normStr(item.color);

    const matchedIds = cartData
      .filter((item) => pending.items.some((p) => sameIdentity(p, item)))
      .map((item) => item.id);

    if (process.env.NODE_ENV !== "production") {
      // VAQTINCHA diagnostika — sababni aniqlagach olib tashlanadi.
      console.warn("[checkout-restore]", {
        pending: pending.items,
        snapshotAt: pending.snapshotAt,
        cartDataUpdatedAt,
        cartIdentities: cartData.map((i) => ({
          id: i.id,
          product_id: i.product_id,
          variant: i.variant,
          color: i.color,
          is_checked: i.is_checked,
        })),
        matchedIds,
      });
    }

    // Item'lar hali merge'langan savatda yo'q (merge davom etmoqda) — KUTAMIZ.
    // pending'ni tozalamaymiz, shunda guard erta redirect qilmaydi. Eski yozuv
    // readPendingSelection ichidagi TTL bilan avto-eskiradi.
    if (matchedIds.length === 0) return;

    selectionStartedRef.current = true;
    selectCartItems.mutate(
      { ids: matchedIds, action: "checked" },
      {
        onSettled: () => {
          // Faqat mutatsiya tugagach tozalaymiz — "idsToCheck bo'sh" deb erta
          // tozalash redirect bug'iga sabab bo'lardi.
          clearPendingSelection();
          selectionStartedRef.current = false;
        },
      },
    );
  }, [status, cartData, cartDataUpdatedAt, isCartFetching, selectCartItems]);

  useEffect(() => {
    if (isCartLoading || isCartFetching) return;
    if (readPendingSelection()) return;
    if (cartData && cartItems.length === 0) {
      toast.error(t("selectItemsToCheckout"));
      router.push("/");
    }
  }, [cartItems.length, isCartLoading, isCartFetching, cartData, router, t]);

  const openAuthModal = () => {
    writePendingSelection({
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        variant: item.variant,
        color: item.color,
      })),
      snapshotAt: cartDataUpdatedAt,
    });
    selectionStartedRef.current = false;
    setIsAuthModalOpen(true);
  };

  return { isAuthModalOpen, setIsAuthModalOpen, openAuthModal };
}
