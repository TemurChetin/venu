"use client";

import { ProductCard } from "@/components/common/product-card";
import { mockDataGenerator } from "@/lib/mock-data";

export function RelatedProducts() {
  const mock = mockDataGenerator(5);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">O'xshash mahsulotlar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mock.map((item, index) => (
          <ProductCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
