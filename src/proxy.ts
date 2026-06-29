import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const GUEST_ID_COOKIE = "venu_guest_id";

export default async function proxy(req: NextRequest) {
  let guestId = req.cookies.get(GUEST_ID_COOKIE)?.value;
  let fetched = false;

  // Birinchi tashrif — guest_id'ni server tomonda olamiz.
  // Timeout bilan: backend sekin/ulanmasa, sahifa osilib qolmasin.
  if (!guestId) {
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/get-guest-id`,
        {
          headers: {
            lang: req.nextUrl.pathname.startsWith("/ru") ? "ru" : "uz",
          },
          signal: AbortSignal.timeout(2000),
        },
      );
      const data = await r.json();
      if (data?.guest_id) {
        guestId = String(data.guest_id);
        fetched = true;
      }
    } catch (e) {
      // Fatal emas — client (useGuestId) o'zi fallback qilib cookie yozadi.
      console.warn("[proxy] guest-id fetch failed:", (e as Error)?.message);
    }
  }

  // Shu requestning RSC render'i (cookies()) cookie'ni KO'RISHI uchun
  // request cookie'siga yozamiz — next-intl ham, downstream ham buni ko'radi.
  if (guestId) {
    req.cookies.set(GUEST_ID_COOKIE, guestId);
  }

  const res = intlMiddleware(req);

  // Yangi olingan bo'lsa — brauzerga saqlash uchun response cookie'siga yozamiz
  if (fetched && guestId) {
    res.cookies.set(GUEST_ID_COOKIE, guestId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return res;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
