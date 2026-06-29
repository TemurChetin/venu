"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "@/services/api/token-store";

/**
 * SessionProvider keshidagi token'ni module-level store bilan sinxronlaydi,
 * shunda axios interceptor uni network'siz o'qiy oladi.
 * Login/logout'da token avtomatik yangilanadi.
 */
export function TokenSync() {
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // hali aniq emas — kutamiz
    setAccessToken((data as any)?.accessToken ?? null);
  }, [data, status]);

  return null;
}
