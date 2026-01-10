import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function ProductDeliveryBanner() {
  const t = useTranslations("product");

  return (
    <Card>
      <CardContent className="">
        <p className="text-primary font-bold">{t("deliveryBannerTitle")}</p>
        <h1 className="text-2xl font-bold">{t("deliveryBannerSubtitle")}</h1>
      </CardContent>
    </Card>
  );
}


