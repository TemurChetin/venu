

const GUEST_ID_KEY = "venu_guest_id";

export function getGuestIdFromStorage(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(GUEST_ID_KEY);
    if (stored) {
      const guestId = parseInt(stored, 10);
      if (!isNaN(guestId)) {
        return guestId;
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error reading guestId from localStorage:", error);
    }
  }

  return null;
}

export function saveGuestIdToStorage(guestId: number): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(GUEST_ID_KEY, guestId.toString());
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error saving guestId to localStorage:", error);
    }
  }
}

export function removeGuestIdFromStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(GUEST_ID_KEY);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error removing guestId from localStorage:", error);
    }
  }
}
