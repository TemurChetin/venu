import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Shield, Package, Truck, CheckCircle2 } from "lucide-react";

export function ProductGuarantees() {
  const t = useTranslations("product");

  return (
    <Card className="mt-6">
      <CardContent className="space-y-4">
        {/* Original Product */}
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">{t("guarantees.originalProduct")}</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm mb-2">
              {t("guarantees.securePayment")}
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/click.png"
                alt="Click"
                width={50}
                height={30}
                className="h-6 object-contain"
              />
              <Image
                src="/payme.png"
                alt="Payme"
                width={50}
                height={30}
                className="h-6 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">{t("guarantees.returnPolicy")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("guarantees.returnPolicyDescription")}
            </p>
          </div>
        </div>

        {/* Fast Delivery */}
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">{t("guarantees.fastDelivery")}</p>
          </div>
        </div>

        {/* Original and Guaranteed */}
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-sm">{t("guarantees.originalGuaranteed")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
