"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useCategories } from "@/services/queries/products";
import type { SubCategory, SubSubCategory } from "@/types/api";
import Image from "next/image";

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
                    {category.icon_full_url.path && (
                      <Image
                        src={category.icon_full_url.path}
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
            <div className="flex-1 p-8">
              {activeCategory.childes && activeCategory.childes.length > 0 ? (
                <div className="grid grid-cols-3 gap-8">
                  {activeCategory.childes.map((subCategory: SubCategory) => (
                    <div key={subCategory.id}>
                      <button
                        onClick={() => {
                          router.push(`/search?category=${subCategory.id}`);
                          onClose();
                        }}
                        className="mb-3 font-semibold text-foreground hover:text-primary transition-colors text-left"
                      >
                        {subCategory.name}
                      </button>
                      {subCategory.childes && subCategory.childes.length > 0 ? (
                        <ul className="space-y-2">
                          {subCategory.childes.map(
                            (subSubCategory: SubSubCategory) => (
                              <li key={subSubCategory.id}>
                                <button
                                  onClick={() => {
                                    router.push(
                                      `/search?category=${subSubCategory.id}`
                                    );
                                    onClose();
                                  }}
                                  className="text-sm text-muted-foreground transition-colors hover:text-primary text-left"
                                >
                                  {subSubCategory.name}
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Bu kategoriyada subkategoriyalar mavjud emas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
