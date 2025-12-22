interface ColorOption {
  name: string;
  value: string;
}

interface Product {
  badge: string;
  image: string;
  title: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  discountedPrice: number;
  colors: ColorOption[];
  id: string;
}

// Tasodifiy raqamlar yaratish uchun yordamchi funksiya
function getRandomRating(): number {
  return (Math.random() * (5 - 3) + 3).toFixed(1) as unknown as number; // 3 dan 5 gacha bo'lgan tasodifiy reyting
}

function getRandomReviewCount(): number {
  return Math.floor(Math.random() * (1000 - 100) + 100); // 100 dan 1000 gacha bo'lgan tasodifiy reviewCount
}

function getRandomPrice(): number {
  return Math.floor(Math.random() * (60000 - 20000) + 20000); // 20000 dan 60000 gacha bo'lgan tasodifiy narx
}

function getRandomDiscountPrice(originalPrice: number): number {
  // Original narxdan 10% dan 20% gacha chegirma
  const discount = Math.random() * (0.2 - 0.1) + 0.1;
  return Math.floor(originalPrice * (1 - discount));
}

function radomUUID() {
  return `${Math.random().toString(36).substr(2, 9)}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}

export function mockDataGenerator(itemCount: number): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < itemCount; i++) {
    const originalPrice = getRandomPrice();
    const discountedPrice = getRandomDiscountPrice(originalPrice);
    products.push({
      id: radomUUID(),
      badge: "Original",
      image:
        "https://images.uzum.uz/crokh9mvip07shn5qbg0/t_product_540_high.jpg",
      title: `Oreal Parij shampunini o'zgartirish 'Elseve, orzu uzunligi', keratin bilan, ${
        i + 1
      }`,
      rating: getRandomRating(),
      reviewCount: getRandomReviewCount(),
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      colors: [
        { name: "Qora", value: "#1a1a2e" },
        { name: "Pushti", value: "#e8a0a0" },
        { name: "Bej", value: "#d4c4b0" },
      ],
    });
  }

  return products;
}
