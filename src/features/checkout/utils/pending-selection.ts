// Login mehmon savatini user akkauntiga merge qiladi — merge'da is_checked
// holati yo'qoladi. Modal ochishdan oldin tanlangan item'larning identifikatori
// (product_id + variant + color) localStorage'ga saqlanadi, shunda login paytida
// sahifa reload/remount bo'lsa ham ma'lumot yo'qolmaydi. Login'dan keyin localdan
// o'qib, mos row'lar yangi ID'lari bo'yicha qayta "checked" qilinadi va local tozalanadi.

const PENDING_SELECTION_KEY = "checkout_pending_selection";

// Pending tanlov faqat login oqimi davomida (sekundlar) yashashi kerak.
// Tashlab ketilgan oqimdan qolgan eski yozuv kelajakdagi tashriflarda redirect
// guard'ni noto'g'ri to'sib qo'ymasligi uchun TTL bilan avto-eskiradi.
const PENDING_TTL_MS = 10 * 60 * 1000; // 10 daqiqa

export interface PendingSelection {
  items: Array<{
    product_id: number;
    variant?: string;
    color?: string | null;
  }>;
  snapshotAt: number; // snapshot olingan paytdagi cart dataUpdatedAt (epoch ms)
}

export function readPendingSelection(): PendingSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_SELECTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingSelection;
    if (!parsed?.items?.length) return null;
    // Eskirgan yozuvni tozalab, yo'q deb hisoblaymiz.
    if (!parsed.snapshotAt || Date.now() - parsed.snapshotAt > PENDING_TTL_MS) {
      clearPendingSelection();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writePendingSelection(value: PendingSelection) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_SELECTION_KEY, JSON.stringify(value));
  } catch {
    // localStorage mavjud bo'lmasa (private mode) — jim o'tamiz
  }
}

export function clearPendingSelection() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_SELECTION_KEY);
  } catch {
    // ignore
  }
}
