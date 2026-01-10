import { toast } from "react-hot-toast";
import { ProductDetailResponse } from "@/types/api";

interface ShareProductParams {
  product: ProductDetailResponse;
  lang: string;
  translations: {
    shareSuccess: string;
    copySuccess: string;
    copyError: string;
  };
}

export async function shareProduct({
  product,
  lang,
  translations,
}: ShareProductParams): Promise<void> {
  const productUrl = `${window.location.origin}/${lang}/products/${product.slug}`;
  const shareData = {
    title: product.name,
    text: product.details
      ? `${product.name} - ${product.details
          .replace(/<[^>]*>/g, "")
          .substring(0, 100)}...`
      : product.name,
    url: productUrl,
  };

  // Check if Web Share API is available
  const canUseWebShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share !== "undefined" &&
    (typeof navigator.canShare === "function"
      ? navigator.canShare(shareData)
      : true);

  if (canUseWebShare) {
    try {
      await navigator.share(shareData);
      toast.success(translations.shareSuccess);
    } catch (error: unknown) {
      // User cancelled or error occurred
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name !== "AbortError"
      ) {
        // Fallback to clipboard if share fails
        await copyToClipboard(productUrl, translations);
      }
    }
  } else {
    // Fallback to clipboard
    await copyToClipboard(productUrl, translations);
  }
}

async function copyToClipboard(
  text: string,
  translations: { copySuccess: string; copyError: string }
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(translations.copySuccess);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      toast.success(translations.copySuccess);
    } catch (err) {
      toast.error(translations.copyError);
    }

    document.body.removeChild(textArea);
  }
}
