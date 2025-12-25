"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
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
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/routing";
import { useCategories } from "@/services/queries/products";
import Image from "next/image";

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

// Icon mapping function
const getIconFromString = (iconName?: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    smartphone: <Smartphone className="h-5 w-5" />,
    refrigerator: <Refrigerator className="h-5 w-5" />,
    shirt: <Shirt className="h-5 w-5" />,
    footprints: <Footprints className="h-5 w-5" />,
    glasses: <Glasses className="h-5 w-5" />,
    sparkles: <Sparkles className="h-5 w-5" />,
    heart: <Heart className="h-5 w-5" />,
    home: <Home className="h-5 w-5" />,
  };

  if (iconName) {
    const normalized = iconName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return iconMap[normalized] || <Package className="h-5 w-5" />;
  }

  return <Package className="h-5 w-5" />;
};

export function CatalogModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { data: categoriesData, isLoading, error } = useCategories();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  const categories = categoriesData ?? [];

  // Set initial hovered category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !hoveredCategory) {
      setHoveredCategory(categories[0]?.id);
    }
  }, [categories, hoveredCategory]);

  if (!isOpen) return null;

  // Show loading state
  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0" onClick={onClose} />
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
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error || categories.length === 0) {
    return (
      <>
        <div className="fixed inset-0" onClick={onClose} />
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
            <div className="flex items-center justify-center p-8">
              <p className="text-muted-foreground">
                Kategoriyalar yuklanmadi. Iltimos, qayta urinib ko'ring.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

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
              <div className="">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      router.push(`/search?category=${category.id}`);
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    className={`flex w-full items-center gap-3 px-6 py-3 text-left transition-colors ${
                      hoveredCategory === category.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {category.icon && (
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={20}
                        height={20}
                      />
                    )}
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
            {/* <div className="flex-1 p-8">
              <div className="grid grid-cols-3 gap-8">
                {activeCategory.subcategories?.map((subCategory, index) => (
                  <div key={index}>
                    <h3 className="mb-3 font-semibold text-foreground">
                      {subCategory.name}
                    </h3>
                    <ul className="space-y-2">
                      {subCategory.subcategories &&
                      subCategory.subcategories?.length > 0 ? (
                        subCategory.subcategories?.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              onClick={onClose}
                              href="/search"
                              className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <Link
                            onClick={onClose}
                            href={`/search?category=${activeCategory.id}`}
                            className="text-sm text-muted-foreground transition-colors hover:text-primary"
                          >
                            {subCategory.name}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
