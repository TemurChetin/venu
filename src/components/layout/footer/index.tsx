"use client";

import { Mail, Phone, MapPin, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBanners } from "@/services/queries/products";

export function Footer() {
  const session = useSession();
  const params = useParams();
  const lang = (params?.lang as string) || "uz";
  
  // Fetch banners
  const { data: bannersData, isLoading: bannersLoading } = useBanners();

  // Filter Footer Banners (published only)
  const footerBanners =
    bannersData?.filter(
      (banner) =>
        banner.banner_type === "Footer Banner" && banner.published === 1
    ) || [];

  return (
    <footer className="border-t bg-background mt-12">
      {/* Footer Banners */}
      {bannersLoading ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-32 md:h-40 bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        </div>
      ) : (
        footerBanners.length > 0 && (
          <div className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-6 md:py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {footerBanners.map((banner) => (
                  <div
                    key={banner.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    {banner.url ? (
                      <Link
                        href={banner.url}
                        className="block w-full h-full"
                        aria-label={banner.title || "Banner"}
                      >
                        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src={banner.photo_full_url?.path || "/placeholder.svg"}
                            alt={banner.title || "Banner"}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                    ) : (
                      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
                        <img
                          src={banner.photo_full_url?.path || "/placeholder.svg"}
                          alt={banner.title || "Banner"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

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

          {/* For Customers (Uzbek) */}
          <div>
            <h3 className="mb-4 text-base font-semibold uppercase tracking-wide text-foreground">
              Mijozlar Uchun
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${lang}/business-page/biz-haqimizda-o-nas-about-us`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Biz Haqimizda
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/business-page/maxfiylik-siyosati-politika-konfidencialnosti-privacy-policy`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Maxfiylik Siyosati
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/business-page/promokod-haqida`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Promokod Haqida
                </Link>
              </li>
            </ul>
          </div>

          {/* User Section (Uzbek) */}
          {session.status === "unauthenticated" && (
            <div>
              <h3 className="mb-4 text-base font-semibold uppercase tracking-wide text-foreground">
                Foydalanuvchi
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/auth"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Kirish
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Ro&apos;yxatdan O&apos;tish
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
              <span>Заявка в поддержку</span>
            </Link>
          </div>

          <Link
            href="https://share.google/nI1wuUbpekBIy728T"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Toshkent shahar Yunusobod tuman Yangishahar 3A</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
