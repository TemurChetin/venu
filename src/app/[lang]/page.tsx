import { ProductCard } from "@/components/common/product-card";
import { Carousel } from "@/features/home/carousel";
import { mockDataGenerator } from "@/lib/mock-data";
import Image from "next/image";

type Props = {};

function Page({}: Props) {
  const mock = mockDataGenerator(5);

  return (
    <>
      <Carousel />

      <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mock.map((item) => (
          <ProductCard key={`line-1-${item.id}`} {...item} />
        ))}
      </div>

      <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mock.map((item) => (
          <ProductCard key={`line-2-${item.id}`} {...item} />
        ))}
      </div>

      {/* Timeout Banner  */}
      {/* Timeout banner only works on large screens */}
      <div>
        <Image
          src="https://venu.uz/storage/banner/2025-09-17-68ca3be65996d.webp"
          alt="Timeout Banner"
          className="w-full h-auto hidden lg:block my-8 rounded-lg"
          width={1200}
          height={720}
        />
      </div>

      <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mock.map((item) => (
          <ProductCard key={`line-1-${item.id}`} {...item} />
        ))}
      </div>

      <div className="grid pb-2.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mock.map((item) => (
          <ProductCard key={`line-2-${item.id}`} {...item} />
        ))}
      </div>
    </>
  );
}

export default Page;
