"use client";

import { useState, useEffect } from "react";

/**
 * Guest ID hook
 * - Avval cookie'dan o'qiydi (proxy SSR'da o'rnatadi) — sinxron, kutishsiz.
 * - Cookie yo'q bo'lsa (proxy fetch'i yiqilgan bo'lsa) — client fallback:
 *   backend'dan olib, COOKIE'ga yozadi (localStorage emas), shunda keyingi
 *   tashrif/navigatsiyada SSR prefetch ishlaydi.
 */

const GUEST_ID_COOKIE = "venu_guest_id";

function readCookie(name: string): number | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? Number(m[2]) : null;
}

function writeCookie(name: string, value: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

function getLang(): string {
  if (typeof window === "undefined") return "uz";
  return window.location.pathname.startsWith("/ru") ? "ru" : "uz";
}

// Bir nechta hook bir vaqtda fetch qilmasligi uchun singleton promise
let guestIdPromise: Promise<number | null> | null = null;

function fetchGuestId(): Promise<number | null> {
  if (guestIdPromise) return guestIdPromise;

  guestIdPromise = fetch(`${process.env.NEXT_PUBLIC_API}/api/v1/get-guest-id`, {
    headers: { lang: getLang() },
  })
    .then((r) => r.json())
    .then((d) => (d?.guest_id ? Number(d.guest_id) : null))
    .catch(() => null)
    .finally(() => {
      guestIdPromise = null;
    });

  return guestIdPromise;
}

export function useGuestId() {
  const [guestID, setGuestID] = useState<number | null>(() =>
    readCookie(GUEST_ID_COOKIE),
  );

  useEffect(() => {
    if (guestID) return;

    // Cookie yo'q — proxy fetch'i yiqilgan bo'lishi mumkin. Client fallback.
    let active = true;
    fetchGuestId().then((id) => {
      if (active && id) {
        writeCookie(GUEST_ID_COOKIE, id);
        setGuestID(id);
      }
    });

    return () => {
      active = false;
    };
  }, [guestID]);

  return { guestID, isLoading: false };
}
