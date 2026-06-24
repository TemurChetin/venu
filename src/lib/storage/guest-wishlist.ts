import type { Product, ProductFullInfo, WishlistProduct } from "@/types/api";

const GUEST_WISHLIST_KEY = "venu_guest_wishlist";

export function getGuestWishlist(): WishlistProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as WishlistProduct[];
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error reading guest wishlist from localStorage:", error);
    }
  }

  return [];
}

function saveGuestWishlist(items: WishlistProduct[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error saving guest wishlist to localStorage:", error);
    }
  }
}

export function isInGuestWishlist(productId: number): boolean {
  return getGuestWishlist().some((item) => item.product_id === productId);
}

export function addToGuestWishlist(product: Product): WishlistProduct[] {
  const items = getGuestWishlist();

  if (items.some((item) => item.product_id === product.id)) {
    return items;
  }

  const now = new Date().toISOString();
  const newItem: WishlistProduct = {
    id: product.id,
    customer_id: 0,
    product_id: product.id,
    created_at: now,
    updated_at: now,
    product_full_info: product as unknown as ProductFullInfo,
  };

  const updated = [...items, newItem];
  saveGuestWishlist(updated);
  return updated;
}

export function removeFromGuestWishlist(productId: number): WishlistProduct[] {
  const updated = getGuestWishlist().filter(
    (item) => item.product_id !== productId,
  );
  saveGuestWishlist(updated);
  return updated;
}

export function clearGuestWishlist(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error clearing guest wishlist from localStorage:", error);
    }
  }
}
