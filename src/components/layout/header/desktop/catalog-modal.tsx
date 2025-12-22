"use client";

import type React from "react";

import { useState } from "react";
import {
  Smartphone,
  Refrigerator,
  Shirt,
  Footprints,
  Glasses,
  Sparkles,
  Heart,
  Home,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/routing";

interface SubCategory {
  name: string;
  items: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subCategories: SubCategory[];
  featured?: string[];
}

const categories: Category[] = [
  {
    id: "electronics",
    name: "Elektronika",
    icon: <Smartphone className="h-5 w-5" />,
    subCategories: [
      {
        name: "Smartfonlar va telefonlar",
        items: [
          "iPhone",
          "Samsung",
          "Xiaomi",
          "Realme",
          "Vivo",
          "OPPO",
          "Huawei",
          "Honor",
        ],
      },
      {
        name: "Noutbuklar, planshetlar va kompyuterlar",
        items: [
          "Noutbuklar",
          "Planshetlar",
          "Monobloklar",
          "Stol kompyuterlari",
          "Gaming noutbuklar",
        ],
      },
      {
        name: "Audio texnika",
        items: [
          "Quloqchinlar",
          "Kalonkalar",
          "Naushniklar",
          "Mikrafonlar",
          "Audio aksessuarlar",
        ],
      },
      {
        name: "TV, video va foto",
        items: [
          "Televizorlar",
          "Proektorlar",
          "Fotoapparatlar",
          "Video kameralar",
          "Dronlar",
        ],
      },
      {
        name: "Aqlli soatlar va fitnes bilaguzuklar",
        items: [
          "Apple Watch",
          "Samsung Galaxy Watch",
          "Xiaomi Mi Band",
          "Fitnes bilaguzuklar",
        ],
      },
    ],
    featured: [
      "iPhone 15 Pro",
      "MacBook Air M2",
      "Samsung Galaxy S24",
      "AirPods Pro",
    ],
  },
  {
    id: "appliances",
    name: "Maishiy texnika",
    icon: <Refrigerator className="h-5 w-5" />,
    subCategories: [
      {
        name: "Katta maishiy texnika",
        items: [
          "Muzlatgichlar",
          "Kir yuvish mashinalari",
          "Gaz plitalari",
          "Dishwasherlar",
          "Konditsionerlar",
        ],
      },
      {
        name: "Oshxona texnikasi",
        items: [
          "Mikroto'lqinli pechlar",
          "Blenderlar",
          "Multicookerlar",
          "Elektr choynak",
          "Kofemashina",
        ],
      },
      {
        name: "Uy uchun texnika",
        items: [
          "Changyutgichlar",
          "Dazmollar",
          "Ventilyatorlar",
          "Isitgichlar",
          "Namlagichlar",
        ],
      },
      {
        name: "Go'zallik texnikasi",
        items: [
          "Fen",
          "Soch to'g'rilagich",
          "Elektr ustaralar",
          "Epilyatorlar",
          "Manikur to'plamlari",
        ],
      },
    ],
    featured: [
      "Samsung Muzlatgich",
      "LG Kir yuvish",
      "Bosch Gaz plita",
      "Dyson Changyutgich",
    ],
  },
  {
    id: "clothing",
    name: "Kiyim",
    icon: <Shirt className="h-5 w-5" />,
    subCategories: [
      {
        name: "Erkaklar kiyimi",
        items: [
          "Ko'ylaklar",
          "Futbolkalar",
          "Shimlar",
          "Shortilar",
          "Kostyumlar",
          "Kurtka va paltolar",
        ],
      },
      {
        name: "Ayollar kiyimi",
        items: [
          "Ko'ylaklar",
          "Bluzalar",
          "Yubkalar",
          "Shimlar",
          "Kostyumlar",
          "Paltolar",
        ],
      },
      {
        name: "Bolalar kiyimi",
        items: [
          "O'g'il bolalar",
          "Qiz bolalar",
          "Chaqaloqlar",
          "Sport kiyimlari",
        ],
      },
      {
        name: "Sport kiyimlari",
        items: [
          "Futbolkalar",
          "Sportivka",
          "Shortilar",
          "Trikolar",
          "Suzish kiyimlari",
        ],
      },
    ],
    featured: ["Erkaklar ko'ylagi", "Ayollar ko'ylagi", "Bolalar futbolkasi"],
  },
  {
    id: "shoes",
    name: "Poyabzal",
    icon: <Footprints className="h-5 w-5" />,
    subCategories: [
      {
        name: "Erkaklar poyabzali",
        items: [
          "Krossovkalar",
          "Tufllar",
          "Botinkalar",
          "Sandallalar",
          "Sport poyabzal",
        ],
      },
      {
        name: "Ayollar poyabzali",
        items: [
          "Krossovkalar",
          "Tufllar",
          "Botinkalar",
          "Sandallalar",
          "Sport poyabzal",
        ],
      },
      {
        name: "Bolalar poyabzali",
        items: ["Krossovkalar", "Tufllar", "Botinkalar", "Sandallalar"],
      },
    ],
    featured: ["Nike Air Max", "Adidas Ultraboost", "Puma RS-X"],
  },
  {
    id: "accessories",
    name: "Aksessuarlar",
    icon: <Glasses className="h-5 w-5" />,
    subCategories: [
      {
        name: "Sumkalar va ryukzaklar",
        items: [
          "Erkaklar sumkalari",
          "Ayollar sumkalari",
          "Ryukzaklar",
          "Baul va chemodanlar",
        ],
      },
      {
        name: "Bosh kiyimlar",
        items: ["Kepkalar", "Shapkalar", "Shapka va sharf to'plamlari"],
      },
      {
        name: "Kamarlar va hamyonlar",
        items: [
          "Erkaklar hamyonlari",
          "Ayollar hamyonlari",
          "Kamarlar",
          "Kartochka ushlagichlar",
        ],
      },
      {
        name: "Zargarlik buyumlari",
        items: ["Soatlar", "Bilaguzuklar", "Sirg'alar", "Zanjirlar", "Uzuklar"],
      },
    ],
    featured: ["Designer sumka", "Premium hamyon", "Gold soat"],
  },
  {
    id: "beauty",
    name: "Go'zallik va parfyumeriya",
    icon: <Sparkles className="h-5 w-5" />,
    subCategories: [
      {
        name: "Parfyumeriya",
        items: [
          "Erkaklar parfyumi",
          "Ayollar parfyumi",
          "Deodorantlar",
          "Atirlar",
        ],
      },
      {
        name: "Parvarishlash",
        items: [
          "Yuz uchun",
          "Tana uchun",
          "Soch uchun",
          "Qo'l uchun",
          "Oyoq uchun",
        ],
      },
      {
        name: "Dekorativ kosmetika",
        items: [
          "Makiyaj asoslari",
          "Ko'z makiyaji",
          "Lab makiyaji",
          "Nail art",
        ],
      },
      {
        name: "Soch parvarishi",
        items: ["Shampunlar", "Konditsionerlar", "Maskalar", "Soch moylari"],
      },
    ],
    featured: ["Dior Sauvage", "Chanel No.5", "La Mer kremi"],
  },
  {
    id: "health",
    name: "Salomatlik",
    icon: <Heart className="h-5 w-5" />,
    subCategories: [
      {
        name: "Tibbiy asboblar",
        items: [
          "Tonometrlar",
          "Termometrlar",
          "Glyukometrlar",
          "Puls o'lchagichlar",
        ],
      },
      {
        name: "Vitaminlar va qo'shimchalar",
        items: [
          "Multivitaminlar",
          "Omega-3",
          "Kaltsiy",
          "Vitamin D",
          "Protein",
        ],
      },
      {
        name: "Ortopedik mahsulotlar",
        items: ["Yostiqlar", "Matraslar", "Kamarlar", "To'piqlar"],
      },
    ],
    featured: ["Omron tonometr", "Vitamin kompleksi", "Ortopedik yostiq"],
  },
  {
    id: "home",
    name: "Uy va bog'",
    icon: <Home className="h-5 w-5" />,
    subCategories: [
      {
        name: "Mebel",
        items: ["Yotoq xonasi", "Mehmonxona", "Oshxona", "Ofis mebellari"],
      },
      {
        name: "Uyni bezash",
        items: ["Pardalari", "Gilamlar", "Yostiqlar", "Dekoratsiyalar"],
      },
      {
        name: "Oshxona buyumlari",
        items: ["Idish-tovoqlar", "Kostryulkalar", "Pichoqlar", "Aksessuarlar"],
      },
      {
        name: "Bog' asboblari",
        items: ["O'roq", "Qurzoq", "Suv purkagichlar", "Bog' mebellar"],
      },
    ],
    featured: ["Divan", "Stol va stul to'plami", "Pardalar"],
  },
];

export function CatalogModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(
    categories[0].id
  );

  if (!isOpen) return null;

  const activeCategory =
    categories.find((cat) => cat.id === hoveredCategory) || categories[0];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-0 right-0 top-[168px] z-50 mx-auto max-w-[1200px] transition-all duration-700 ease-out transform",
          {
            "opacity-100 translate-y-0": isOpen,
            "opacity-0 -translate-y-5 pointer-events-none": !isOpen,
          }
        )}
      >
        <div className="overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border">
          <div className="flex">
            {/* Left Sidebar - Categories */}
            <div className="w-[280px] border-r bg-muted/30">
              <div className="py-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      router.push("/search");
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${
                      hoveredCategory === category.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`${
                        hoveredCategory === category.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {category.icon}
                    </span>
                    <span className="flex-1 font-medium">{category.name}</span>
                    <ChevronRight
                      className={`h-4 w-4 ${
                        hoveredCategory === category.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content - Subcategories */}
            <div className="flex-1 p-8">
              <div className="grid grid-cols-3 gap-8">
                {activeCategory.subCategories.map((subCategory, index) => (
                  <div key={index}>
                    <h3 className="mb-3 font-semibold text-foreground">
                      {subCategory.name}
                    </h3>
                    <ul className="space-y-2">
                      {subCategory.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            onClick={onClose}
                            href="/search"
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Featured Products */}
              {activeCategory.featured && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="mb-4 font-semibold text-foreground">
                    Ommabop mahsulotlar
                  </h3>
                  <div className="flex gap-3">
                    {activeCategory.featured.map((product, index) => (
                      <a
                        key={index}
                        href="#"
                        className="rounded-lg border bg-muted/30 px-4 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                      >
                        {product}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
