import useDeviceDetect from "@/hooks/use-device";
import dynamic from "next/dynamic";
import React from "react";

type Props = {
  images?: string[];
};

const DesktopProductGallery = dynamic(
  () => import("./desktop/product-gallery"),
  {
    loading: () => <div>Loading...</div>,
  }
);

const MobileProductGallery = dynamic(() => import("./mobile/product-gallery"), {
  loading: () => <div>Loading...</div>,
});

function ProductGallery({ images }: Props) {
  const { isDesktop } = useDeviceDetect();

  if (isDesktop) {
    return <DesktopProductGallery images={images} />;
  } else {
    return <MobileProductGallery images={images} />;
  }
}

export default ProductGallery;
