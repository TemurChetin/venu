import { instanceAuth } from "../api/instance";
import {
  getGuestWishlist,
  clearGuestWishlist,
} from "@/lib/storage/guest-wishlist";

/**
 * Pushes the guest wishlist (saved in localStorage while logged out) to the
 * backend, then clears it. Called once right after a successful sign-in so the
 * products a guest liked are persisted to their account.
 *
 * Individual failures are ignored (e.g. a product already in the user's
 * wishlist) so one bad item does not block syncing the rest.
 */
export async function syncGuestWishlistToBackend(): Promise<void> {
  const items = getGuestWishlist();
  if (items.length === 0) return;

  await Promise.allSettled(
    items.map((item) =>
      instanceAuth.post(
        `/v1/customer/wish-list/add?product_id=${item.product_id}`
      )
    )
  );

  clearGuestWishlist();
}
