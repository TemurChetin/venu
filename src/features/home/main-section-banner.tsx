"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners } from "@/services";
import Image from "next/image";
import Link from "next/link";

export default function MainSectionBanner() {
  const { data: bannersData, isLoading: bannersLoading } = useBanners();
  const mainSectionBanners =
    bannersData?.filter(
      (banner) =>
        banner.banner_type === "Main Section Banner" && banner.published === 1,
    ) || [];
  return (
    <div>
      {bannersLoading ? (
        <div className="py-6">
          <Skeleton className="w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl" />
        </div>
      ) : (
        mainSectionBanners.length > 0 &&
        mainSectionBanners[0] && (
          <div className=" py-6">
            {mainSectionBanners[0].url ? (
              <Link
                href={mainSectionBanners[0].url}
                className="block overflow-hidden rounded-2xl hover:opacity-90 transition-opacity"
              >
                <Image
                  width={1200}
                  height={720}
                  src={
                    mainSectionBanners[0].photo_full_url?.path ||
                    "/placeholder.svg"
                  }
                  alt={mainSectionBanners[0].title || "Banner"}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </Link>
            ) : (
              <div className="overflow-hidden rounded-2xl">
                <Image
                  width={1200}
                  height={720}
                  src={
                    mainSectionBanners[0].photo_full_url?.path ||
                    "/placeholder.svg"
                  }
                  alt={mainSectionBanners[0].title || "Banner"}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
