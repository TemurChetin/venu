import { useState, useEffect } from "react";

// Breakpointlarni o'zingizga moslab o'zgartirishingiz mumkin
const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

type DeviceType = "mobile" | "tablet" | "desktop";

interface DeviceDetectResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  width: number | undefined; // Serverda width bo'lmaydi
}

const useDeviceDetect = (): DeviceDetectResult => {
  // Boshlang'ich qiymatlar (SSR uchun xavfsiz bo'lishi kerak)
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Faqat klijent tomonida ishlaydi
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Dastlabki o'lchamni olish
    handleResize();

    // O'zgarishlarni tinglash
    window.addEventListener("resize", handleResize);

    // Tozalash (Cleanup)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mantiqiy hisoblash
  const isMobile = width !== undefined && width < breakpoints.mobile;
  const isTablet =
    width !== undefined &&
    width >= breakpoints.mobile &&
    width <= breakpoints.tablet;
  const isDesktop = width !== undefined && width > breakpoints.tablet;

  let deviceType: DeviceType = "desktop"; // Default
  if (isMobile) deviceType = "mobile";
  if (isTablet) deviceType = "tablet";

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    width,
  };
};

export default useDeviceDetect;
