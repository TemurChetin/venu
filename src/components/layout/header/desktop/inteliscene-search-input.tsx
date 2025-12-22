"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, Package, Tag, TrendingUp, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/routing";

// Namunaviy mahsulotlar va kategoriyalar
const PRODUCTS = [
  {
    id: 1,
    name: "Samsung Galaxy S24",
    category: "Smartfonlar",
    trending: true,
  },
  { id: 2, name: 'Samsung TV 55"', category: "Televizorlar", trending: false },
  { id: 3, name: "Samsung Galaxy Watch", category: "Soatlar", trending: true },
  { id: 4, name: "Savat", category: "Uy-jihozlari", trending: false },
  { id: 5, name: "Sabzi", category: "Oziq-ovqat", trending: false },
  { id: 6, name: "Salat", category: "Oziq-ovqat", trending: false },
  { id: 7, name: "Sony PlayStation 5", category: "O'yinlar", trending: true },
  { id: 8, name: "Samsung Buds Pro", category: "Audio", trending: true },
];

const CATEGORIES = [
  { id: 1, name: "Smartfonlar", icon: Package, count: 156 },
  { id: 2, name: "Televizorlar", icon: Package, count: 89 },
  { id: 3, name: "Soatlar", icon: Package, count: 234 },
  { id: 4, name: "Audio", icon: Package, count: 167 },
];

const RECENT_SEARCHES = ["Samsung Galaxy", "iPhone 15", "Noutbuk"];

export default function IntelisceneSearchInput() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Qidiruv natijalarini filter qilish
  const filteredProducts =
    query.length > 0
      ? PRODUCTS.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      : [];

  const filteredCategories =
    query.length > 0
      ? CATEGORIES.filter((cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3)
      : [];

  const totalResults = filteredProducts.length + filteredCategories.length;
  const showRecentSearches = query.length === 0 && isOpen;

  // Tashqarida bosilganda yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigatsiya
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "Enter") {
      e.preventDefault();
      router.push("/search?query=" + query);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-2xl" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Mahsulot va turkumlarni izlash"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="h-11 w-full pl-10 pr-10 bg-accent/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Dropdown natijalar */}
      {isOpen && (query.length > 0 || showRecentSearches) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Recent Searches */}
          {showRecentSearches && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Clock className="h-3 w-3" />
                <span>So'nggi qidiruvlar</span>
              </div>
              <div className="space-y-1">
                {RECENT_SEARCHES.map((search, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                    onClick={() => handleQueryChange(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {filteredCategories.length > 0 && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Tag className="h-3 w-3" />
                <span>Turkumlar</span>
              </div>
              <div className="space-y-1">
                {filteredCategories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm group",
                        selectedIndex === idx
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="flex-1 text-left font-medium">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {category.count} mahsulot
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Package className="h-3 w-3" />
                <span>Mahsulotlar</span>
              </div>
              <div className="space-y-1">
                {filteredProducts.map((product, idx) => {
                  const currentIndex = filteredCategories.length + idx;
                  return (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm group",
                        selectedIndex === currentIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.category}
                        </div>
                      </div>
                      {product.trending && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <TrendingUp className="h-3 w-3" />
                          <span className="hidden sm:inline">Ommabop</span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results */}
          {query.length > 0 && totalResults === 0 && (
            <div className="p-8 text-center text-muted-foreground z-50">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">"{query}" uchun natija topilmadi</p>
              <p className="text-xs mt-1">Boshqa so'z bilan qidiring</p>
            </div>
          )}

          {/* Footer tip */}
          {totalResults > 0 && (
            <div className="px-3 py-2 bg-accent/30 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>↑↓ tanlash • Enter kirish • Esc yopish</span>
                <span>{totalResults} natija</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
