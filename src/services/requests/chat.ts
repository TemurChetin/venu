export interface ChatApiResponse {
  intent: string;
  answer: string;
  products: unknown[];
  category_id: string | null;
  price_max: number | null;
  search: string | null;
  search_products: unknown[];
  category_products: unknown[];
  history: { role: string; content: string }[];
}

/**
 * Sends a chat message via Next.js `/api/chat` (server proxies to Python chat backend).
 * Same-origin: avoids browser CORS and mixed-content when the site is HTTPS.
 */
export async function sendSupportChatMessage(
  message: string
): Promise<ChatApiResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`);
  }
  return res.json() as Promise<ChatApiResponse>;
}
