"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CatalogFilters() {
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    stock: true,
    color: true,
    language: true,
    country: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
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
            <div className="flex items-center space-x-2">
              <Checkbox id="cat1" />
              <Label
                htmlFor="cat1"
                className="text-sm font-normal cursor-pointer"
              >
                Kitoblar
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cat2" />
              <Label
                htmlFor="cat2"
                className="text-sm font-normal cursor-pointer"
              >
                O'quv adabiyotlari
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cat3" />
              <Label
                htmlFor="cat3"
                className="text-sm font-normal cursor-pointer"
              >
                Badiiy adabiyot
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cat4" />
              <Label
                htmlFor="cat4"
                className="text-sm font-normal cursor-pointer"
              >
                Bolalar uchun
              </Label>
            </div>
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
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="h-10"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="150000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="h-10"
              />
            </div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
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

      {/* Color */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("color")}
          className="flex w-full items-center justify-between text-base font-semibold text-foreground"
        >
          Rang
          {expandedSections.color ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.color && (
          <div className="flex flex-wrap gap-2">
            <button className="h-8 w-8 rounded-full border-2 border-border bg-red-500 hover:border-primary transition-colors" />
            <button className="h-8 w-8 rounded-full border-2 border-border bg-blue-500 hover:border-primary transition-colors" />
            <button className="h-8 w-8 rounded-full border-2 border-border bg-yellow-500 hover:border-primary transition-colors" />
            <button className="h-8 w-8 rounded-full border-2 border-border bg-green-500 hover:border-primary transition-colors" />
            <button className="h-8 w-8 rounded-full border-2 border-border bg-purple-500 hover:border-primary transition-colors" />
            <button className="h-8 w-8 rounded-full border-2 border-border bg-pink-500 hover:border-primary transition-colors" />
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
