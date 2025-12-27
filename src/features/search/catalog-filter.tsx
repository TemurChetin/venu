"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  useAllCategories,
  useBrands,
  type ProductFilterParams,
} from "@/services/queries/products";
import type { Category } from "@/types/api";

interface CatalogFiltersProps {
  searchQuery?: string;
  filters: ProductFilterParams;
  onFiltersChange: (filters: ProductFilterParams) => void;
}

export function CatalogFilters({
  searchQuery,
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

  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    filters.category ? JSON.parse(filters.category) : []
  );
  const [selectedBrands, setSelectedBrands] = useState<number[]>(
    filters.brand ? JSON.parse(filters.brand) : []
  );

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    stock: true,
    language: true,
    country: true,
  });

  // Update price range when filters change externally
  useEffect(() => {
    if (filters.price_min !== undefined || filters.price_max !== undefined) {
      setPriceRange([filters.price_min || 0, filters.price_max || 150000]);
    }
  }, [filters.price_min, filters.price_max]);

  // Update selected categories/brands when filters change externally
  useEffect(() => {
    if (filters.category) {
      setSelectedCategories(
        filters.category ? JSON.parse(filters.category) : []
      );
    }
    if (filters.brand) {
      setSelectedBrands(filters.brand ? JSON.parse(filters.brand) : []);
    }
  }, [filters.category, filters.brand]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelected);
    onFiltersChange({
      ...filters,
      category: newSelected.length > 0 ? JSON.stringify(newSelected) : "[]",
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
          <div className="space-y-2.5">
            {categoriesLoading ? (
              <div className="text-sm text-muted-foreground">
                Yuklanmoqda...
              </div>
            ) : categories.length > 0 ? (
              categories.map((category: Category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))
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
              brands.slice(0, 10).map((brand) => (
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

      <div className="h-px bg-border" />

      {/* Stock Status */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("stock")}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Omborda
          {expandedSections.stock ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.stock && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <Checkbox id="stock1" />
              <Label
                htmlFor="stock1"
                className="text-sm font-normal cursor-pointer"
              >
                Mahsulot mavjud
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="stock2" />
              <Label
                htmlFor="stock2"
                className="text-sm font-normal cursor-pointer"
              >
                Tezkor yetkazish
              </Label>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Language */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("language")}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Til
          {expandedSections.language ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.language && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <Checkbox id="lang1" />
              <Label
                htmlFor="lang1"
                className="text-sm font-normal cursor-pointer"
              >
                O'zbekcha
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lang2" />
              <Label
                htmlFor="lang2"
                className="text-sm font-normal cursor-pointer"
              >
                Ruscha
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lang3" />
              <Label
                htmlFor="lang3"
                className="text-sm font-normal cursor-pointer"
              >
                Inglizcha
              </Label>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Country */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("country")}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Ishlab chiqaruvchi mamlakat
          {expandedSections.country ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.country && (
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <Checkbox id="country1" />
              <Label
                htmlFor="country1"
                className="text-sm font-normal cursor-pointer"
              >
                O'zbekiston
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="country2" />
              <Label
                htmlFor="country2"
                className="text-sm font-normal cursor-pointer"
              >
                Rossiya
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="country3" />
              <Label
                htmlFor="country3"
                className="text-sm font-normal cursor-pointer"
              >
                Xitoy
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
