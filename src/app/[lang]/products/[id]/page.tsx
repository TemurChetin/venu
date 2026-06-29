import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/get-query-client";
import { queryGenerator } from "@/lib/query-generator";
import DetailClient from "@/features/detail/detail-client";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id: slug, lang } = await params;
  const guestId = (await cookies()).get("venu_guest_id")?.value;

  const queryClient = makeQueryClient();

  // MUHIM: queryKey client'dagi bilan AYNAN bir xil bo'lishi shart (Bosqich E)
  const detailUrl =
    `/v1/products/details/${slug}` +
    (guestId ? queryGenerator({ guest_id: guestId }) : "");

  // Prefetch fatal emas: xato/timeout bo'lsa prefetchQuery uni yutadi va
  // client (useProductDetail) mount'da o'zi qayta oladi — sahifa osilmaydi.
  await queryClient.prefetchQuery({
    queryKey: [detailUrl],
    queryFn: async () => {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API}/api${detailUrl}`, {
        headers: { lang },
        signal: AbortSignal.timeout(3000),
      });
      if (!r.ok) {
        throw new Error(`Detail prefetch failed: ${r.status}`);
      }
      return r.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailClient slug={slug} />
    </HydrationBoundary>
  );
}
