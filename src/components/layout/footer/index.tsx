"use client";

import { Mail, Phone, MapPin, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export function Footer() {
  const session = useSession();
  const params = useParams();
  const lang = (params?.lang as string) || "uz";
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-background mt-12">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and App Download Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Image src={"/logo.png"} alt="Logo" width={200} height={80} />
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="#">
                <Image
                  width={200}
                  height={90}
                  src={"/playmarket.png"}
                  alt="Play market"
                />
              </Link>

              <Link href="#">
                <Image
                  src={"/appstore.png"}
                  alt="App store"
                  width={200}
                  height={90}
                />
              </Link>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="mb-4 text-base font-semibold uppercase tracking-wide text-foreground">
              {t("forCustomers")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${lang}/business-page/biz-haqimizda-o-nas-about-us`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/business-page/maxfiylik-siyosati-politika-konfidencialnosti-privacy-policy`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/business-page/promokod-haqida`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("aboutPromocode")}
                </Link>
              </li>
            </ul>
          </div>

          {/* User Section */}
          {session.status === "unauthenticated" && (
            <div>
              <h3 className="mb-4 text-base font-semibold uppercase tracking-wide text-foreground">
                {t("user")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/auth"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t("login")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t("register")}
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Contact Section */}
        <div className="mt-12 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="tel:+998992021001"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              <span>+998992021001</span>
            </Link>

            <Link
              href="mailto:info@venu.uz"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              <span>info@venu.uz</span>
            </Link>

            <Link
              href="https://t.me/Venumarketplace"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <User className="h-4 w-4" />
              <span>{t("supportRequest")}</span>
            </Link>
          </div>

          <Link
            href="https://share.google/nI1wuUbpekBIy728T"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{t("address")}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
