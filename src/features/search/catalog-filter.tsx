"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import {
  useAllCategories,
  useBrands,
  type ProductFilterParams,
} from "@/services/queries/products";

interface CatalogFiltersProps {
  searchQuery?: string;
  filters: ProductFilterParams;
  onFiltersChange: (filters: ProductFilterParams) => void;
}

export function CatalogFilters({
  filters,
  onFiltersChange,
}: CatalogFiltersProps) {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategories();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();

  const categories = categoriesData || [];
  const brands = brandsData?.brands || [];

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.price_min || 0,
    filters.price_max || 150000,
  ]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    filters.category && filters.category > 0 ? filters.category : null
  );
  const [selectedBrands, setSelectedBrands] = useState<number[]>(
    filters.brand ? JSON.parse(filters.brand) : []
  );

  // Track which parent categories are expanded
  const [expandedParentCategories, setExpandedParentCategories] = useState<
    Set<number>
  >(new Set());

  // Track which subcategories are expanded
  const [expandedSubCategories, setExpandedSubCategories] = useState<
    Set<number>
  >(new Set());

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
  });

  // Auto-expand parent category if a subcategory is selected
  useEffect(() => {
    if (selectedCategory) {
      categories.forEach((category) => {
        // Check if selected category is in this parent category
        if (category.id === selectedCategory) {
          setExpandedParentCategories((prev) => new Set(prev).add(category.id));
        }
        // Check subcategories
        category.childes?.forEach((subCategory) => {
          if (subCategory.id === selectedCategory) {
            setExpandedParentCategories((prev) =>
              new Set(prev).add(category.id)
            );
            setExpandedSubCategories((prev) =>
              new Set(prev).add(subCategory.id)
            );
          }
          // Check sub-subcategories
          subCategory.childes?.forEach((subSubCategory) => {
            if (subSubCategory.id === selectedCategory) {
              setExpandedParentCategories((prev) =>
                new Set(prev).add(category.id)
              );
              setExpandedSubCategories((prev) =>
                new Set(prev).add(subCategory.id)
              );
            }
          });
        });
      });
    }
  }, [selectedCategory, categories]);

  const toggleParentCategory = (categoryId: number) => {
    setExpandedParentCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSubCategory = (subCategoryId: number) => {
    setExpandedSubCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subCategoryId)) {
        newSet.delete(subCategoryId);
      } else {
        newSet.add(subCategoryId);
      }
      return newSet;
    });
  };

  // Update price range when filters change externally
  useEffect(() => {
    if (filters.price_min !== undefined || filters.price_max !== undefined) {
      setPriceRange([filters.price_min || 0, filters.price_max || 150000]);
    }
  }, [filters.price_min, filters.price_max]);

  // Update selected category/brands when filters change externally
  useEffect(() => {
    if (filters.category && filters.category > 0) {
      setSelectedCategory(filters.category);
    } else {
      setSelectedCategory(null);
    }
    if (filters.brand) {
      setSelectedBrands(filters.brand ? JSON.parse(filters.brand) : []);
    }
  }, [filters.category, filters.brand]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    // Only one category can be selected at a time
    const newSelected = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newSelected);
    onFiltersChange({
      ...filters,
      category: newSelected,
    });
  };

  const handleBrandToggle = (brandId: number) => {
    const newSelected = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(newSelected);
    onFiltersChange({
      ...filters,
      brand: newSelected.length > 0 ? JSON.stringify(newSelected) : "[]",
    });
  };

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange([newRange[0], newRange[1]]);
    onFiltersChange({
      ...filters,
      price_min: newRange[0] > 0 ? newRange[0] : null,
      price_max: newRange[1] < 150000 ? newRange[1] : null,
    });
  };

  return (
    <div className="space-y-6 px-4">
      {/* Categories */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("categories")}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Kategoriyalar
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="space-y-1">
            {categoriesLoading ? (
              <div className="text-sm text-muted-foreground">
                Yuklanmoqda...
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const isParentExpanded = expandedParentCategories.has(
                  category.id
                );
                const hasSubCategories =
                  category.childes && category.childes.length > 0;

                return (
                  <div key={category.id} className="space-y-1">
                    {/* Parent Category */}
                    <div className="flex items-center gap-2 group">
                      {hasSubCategories && (
                        <button
                          onClick={() => toggleParentCategory(category.id)}
                          className="p-0.5 hover:bg-muted rounded transition-colors"
                          aria-label={
                            isParentExpanded
                              ? "Kategoriyani yig'ish"
                              : "Kategoriyani ochish"
                          }
                        >
                          {isParentExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                      )}
                      {!hasSubCategories && (
                        <div className="w-4" /> // Spacer for alignment
                      )}
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Checkbox
                          id={`cat-${category.id}`}
                          checked={selectedCategory === category.id}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.id)
                          }
                        />
                        <Label
                          htmlFor={`cat-${category.id}`}
                          className="text-sm font-normal cursor-pointer flex-1 truncate"
                        >
                          {category.name}
                        </Label>
                      </div>
                    </div>

                    {/* Subcategories - Collapsed */}
                    {hasSubCategories && isParentExpanded && (
                      <div className="ml-6 space-y-1">
                        {category.childes?.map((subCategory) => {
                          const isSubExpanded = expandedSubCategories.has(
                            subCategory.id
                          );
                          const hasSubSubCategories =
                            subCategory.childes &&
                            subCategory.childes.length > 0;

                          return (
                            <div key={subCategory.id} className="space-y-1">
                              {/* Subcategory */}
                              <div className="flex items-center gap-2 group">
                                {hasSubSubCategories && (
                                  <button
                                    onClick={() =>
                                      toggleSubCategory(subCategory.id)
                                    }
                                    className="p-0.5 hover:bg-muted rounded transition-colors"
                                    aria-label={
                                      isSubExpanded
                                        ? "Kategoriyani yig'ish"
                                        : "Kategoriyani ochish"
                                    }
                                  >
                                    {isSubExpanded ? (
                                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                  </button>
                                )}
                                {!hasSubSubCategories && (
                                  <div className="w-4" /> // Spacer
                                )}
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <Checkbox
                                    id={`cat-${subCategory.id}`}
                                    checked={
                                      selectedCategory === subCategory.id
                                    }
                                    onCheckedChange={() =>
                                      handleCategoryToggle(subCategory.id)
                                    }
                                  />
                                  <Label
                                    htmlFor={`cat-${subCategory.id}`}
                                    className="text-sm font-normal cursor-pointer flex-1 truncate text-muted-foreground"
                                  >
                                    {subCategory.name}
                                  </Label>
                                </div>
                              </div>

                              {/* Sub-subcategories */}
                              {hasSubSubCategories &&
                                isSubExpanded &&
                                subCategory.childes?.map((subSubCategory) => (
                                  <div
                                    key={subSubCategory.id}
                                    className="ml-6 flex items-center space-x-2"
                                  >
                                    <div className="w-4" /> {/* Spacer */}
                                    <Checkbox
                                      id={`cat-${subSubCategory.id}`}
                                      checked={
                                        selectedCategory === subSubCategory.id
                                      }
                                      onCheckedChange={() =>
                                        handleCategoryToggle(subSubCategory.id)
                                      }
                                    />
                                    <Label
                                      htmlFor={`cat-${subSubCategory.id}`}
                                      className="text-sm font-normal cursor-pointer flex-1 truncate text-muted-foreground"
                                    >
                                      {subSubCategory.name}
                                    </Label>
                                  </div>
                                ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground">
                Kategoriyalar topilmadi
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Brands */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("brands")}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Brendlar
          {expandedSections.brands ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.brands && (
          <div className="space-y-2.5">
            {brandsLoading ? (
              <div className="text-sm text-muted-foreground">
                Yuklanmoqda...
              </div>
            ) : brands.length > 0 ? (
              brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => handleBrandToggle(brand.id)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                Brendlar topilmadi
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Price Range */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Narx, so'm
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="0"
                value={priceRange[0]}
                onChange={(e) =>
                  handlePriceChange([
                    Number(e.target.value) || 0,
                    priceRange[1],
                  ])
                }
                className="h-10"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="150000"
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceChange([
                    priceRange[0],
                    Number(e.target.value) || 150000,
                  ])
                }
                className="h-10"
              />
            </div>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={150000}
              step={1000}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
