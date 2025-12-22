"use client";

import useDeviceDetect from "@/hooks/use-device";
import dynamic from "next/dynamic";

type Props = {};

const LazyDesctopHeader = dynamic(() => import("./desktop/header"), {
  loading: () => <p>Yuklanmoqda...</p>,
});

const LazyMobileHeader = dynamic(() => import("./mobile/mobile"), {
  loading: () => <p>Yuklanmoqda...</p>,
});

export function Header({}: Props) {
  const { isDesktop } = useDeviceDetect();

  if (isDesktop) {
    return <LazyDesctopHeader />;
  } else {
    return <LazyMobileHeader />;
  }
}
