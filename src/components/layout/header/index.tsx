"use client";

import useDeviceDetect from "@/hooks/use-device";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const DesktopHeaderSkeleton = () => {
  return (
    <header className="z-50 relative w-full border-b border-border bg-background/95 backdrop-blur">
      {/* Top Bar Skeleton */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto flex h-10 items-center justify-between px-4 text-sm lg:px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>

      {/* Main Header Skeleton */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-32" />
          </div>

          {/* Search and Catalog Skeleton */}
          <div className="flex gap-2 items-center w-[700px]">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 flex-1" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>

      {/* Categories Navigation Skeleton */}
      <div className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <nav className="flex h-12 items-center gap-6 overflow-hidden">
            <Skeleton className="h-4 w-20 shrink-0" />
            <Skeleton className="h-4 w-24 shrink-0" />
            <Skeleton className="h-4 w-28 shrink-0" />
            <Skeleton className="h-4 w-16 shrink-0" />
            <Skeleton className="h-4 w-22 shrink-0" />
            <Skeleton className="h-4 w-18 shrink-0" />
          </nav>
        </div>
      </div>
    </header>
  );
};

const MobileHeaderSkeleton = () => {
  return (
    <header>
      <div className="container mt-4">
        {/* Search Input Skeleton */}
        <div className="flex gap-2 items-center">
          <Skeleton className="h-11 flex-1 max-w-2xl" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      {/* Bottom Navigation Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background">
        <div className="flex h-16 items-center justify-around px-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </header>
  );
};

const LazyDesctopHeader = dynamic(() => import("./desktop/header"), {
  loading: () => <DesktopHeaderSkeleton />,
});

const LazyMobileHeader = dynamic(() => import("./mobile/mobile"), {
  loading: () => <MobileHeaderSkeleton />,
});

export function Header({}: Props) {
  const { isDesktop } = useDeviceDetect();

  if (isDesktop) {
    return <LazyDesctopHeader />;
  } else {
    return <LazyMobileHeader />;
  }
}
