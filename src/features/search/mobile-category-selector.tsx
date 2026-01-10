"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import { useCategories } from "@/services/queries/products";
import type { SubCategory, SubSubCategory } from "@/types/api";
import Image from "next/image";

export function MobileCategorySelector() {
  const router = useRouter();
  const { data: categoriesData, isLoading, error } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  const categories = categoriesData ?? [];

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategorySelect = (categoryId: number) => {
    router.push(`/search?category=${categoryId}`);
  };

  const handleSubCategorySelect = (categoryId: number) => {
    router.push(`/search?category=${categoryId}`);
  };

  const handleSubSubCategorySelect = (categoryId: number) => {
    router.push(`/search?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Yuklanmoqda...</p>
      </div>
    );
  }

  if (error || categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Kategoriyalar yuklanmadi. Iltimos, qayta urinib ko'ring.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Kategoriyalar
        </h2>
        <p className="text-sm text-muted-foreground">
          Tanlang: Kategoriya tanlang
        </p>
      </div>

      <div className="space-y-1">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const hasChildren =
            category.childes && category.childes.length > 0;

          return (
            <div key={category.id} className="border-b border-border">
              {/* Main Category */}
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleCategory(category.id);
                    } else {
                      handleCategorySelect(category.id);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                    "hover:bg-muted active:bg-muted/80"
                  )}
                >
                  {category.icon_full_url?.path && (
                    <div className="flex-shrink-0">
                      <Image
                        src={category.icon_full_url.path}
                        alt={category.name}
                        width={24}
                        height={24}
                      />
                    </div>
                  )}
                  <span className="flex-1 font-medium text-foreground">
                    {category.name}
                  </span>
                  {hasChildren ? (
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {/* Subcategories */}
                {hasChildren && isExpanded && (
                  <div className="bg-muted/30 pl-4">
                    {category.childes?.map((subCategory: SubCategory) => {
                      const isSubExpanded = expandedCategories.has(
                        subCategory.id
                      );
                      const hasSubChildren =
                        subCategory.childes &&
                        subCategory.childes.length > 0;

                      return (
                        <div key={subCategory.id} className="border-b border-border/50">
                          <button
                            onClick={() => {
                              if (hasSubChildren) {
                                toggleCategory(subCategory.id);
                              } else {
                                handleSubCategorySelect(subCategory.id);
                              }
                            }}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                              "hover:bg-muted/50 active:bg-muted/70"
                            )}
                          >
                            {subCategory.icon_full_url?.path && (
                              <div className="flex-shrink-0">
                                <Image
                                  src={subCategory.icon_full_url.path}
                                  alt={subCategory.name}
                                  width={20}
                                  height={20}
                                />
                              </div>
                            )}
                            <span className="flex-1 font-medium text-sm text-foreground">
                              {subCategory.name}
                            </span>
                            {hasSubChildren ? (
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 text-muted-foreground transition-transform",
                                  isSubExpanded && "rotate-180"
                                )}
                              />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>

                          {/* Sub-subcategories */}
                          {hasSubChildren && isSubExpanded && (
                            <div className="bg-muted/20 pl-4">
                              {subCategory.childes?.map(
                                (subSubCategory: SubSubCategory) => (
                                  <button
                                    key={subSubCategory.id}
                                    onClick={() =>
                                      handleSubSubCategorySelect(
                                        subSubCategory.id
                                      )
                                    }
                                    className={cn(
                                      "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                      "hover:bg-muted/40 active:bg-muted/60",
                                      "text-sm text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {subSubCategory.icon_full_url?.path && (
                                      <div className="flex-shrink-0">
                                        <Image
                                          src={subSubCategory.icon_full_url.path}
                                          alt={subSubCategory.name}
                                          width={18}
                                          height={18}
                                        />
                                      </div>
                                    )}
                                    <span className="flex-1">
                                      {subSubCategory.name}
                                    </span>
                                    <ChevronRight className="h-4 w-4 opacity-50" />
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

