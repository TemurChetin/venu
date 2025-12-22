"use client";

import dynamic from "next/dynamic";

const BottomNavigation = dynamic(() => import("./bottom-navigation"), {
  ssr: false,
});

export default function BottomNavigationWrapper() {
  return <BottomNavigation />;
}
