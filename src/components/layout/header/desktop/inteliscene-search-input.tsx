"use client";

import type React from "react";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Package, Tag, Clock, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, encodeSearchQuery } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/routing";
import { useProductSearch } from "@/services/queries/products";
import { useCategories } from "@/services/queries/products";
import type { Category } from "@/types/api";
import { useTranslations } from "next-intl";

// Recent searches storage utilities
const RECENT_SEARCHES_KEY = "venu_recent_searches";
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading recent searches:", error);
  }
  return [];
}

function saveRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(
      (q) => q.toLowerCase() !== query.toLowerCase()
    );
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving recent search:", error);
  }
}

export default function IntelisceneSearchInput() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // API hooks
  const { data: productSuggestions, isLoading: isLoadingProducts } =
    useProductSearch(encodeSearchQuery(query));

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();

  // Filter categories based on query
  const filteredCategories = useMemo(() => {
    if (!categoriesData || query.length === 0) return [];

    const searchLower = query.toLowerCase();
    const results: Array<{
      id: number;
      name: string;
      slug: string;
      count?: number;
    }> = [];

    // Search in main categories
    categoriesData.forEach((category: Category) => {
      if (category.name.toLowerCase().includes(searchLower)) {
        results.push({
          id: category.id,
          name: category.name,
          slug: category.slug,
          count: category.products?.length || 0,
        });
      }

      // Search in subcategories
      category.childes?.forEach((subCategory) => {
        if (subCategory.name.toLowerCase().includes(searchLower)) {
          results.push({
            id: subCategory.id,
            name: subCategory.name,
            slug: subCategory.slug,
          });
        }

        // Search in sub-subcategories
        subCategory.childes?.forEach((subSubCategory) => {
          if (subSubCategory.name.toLowerCase().includes(searchLower)) {
            results.push({
              id: subSubCategory.id,
              name: subSubCategory.name,
              slug: subSubCategory.slug,
            });
          }
        });
      });
    });

    return results.slice(0, 3);
  }, [categoriesData, query]);

  // Get products from API
  const filteredProducts = useMemo(() => {
    if (!productSuggestions?.products || query.length === 0) return [];
    return productSuggestions.products.slice(0, 5);
  }, [productSuggestions, query]);

  const totalResults = filteredProducts.length + filteredCategories.length;
  const showRecentSearches =
    query.length === 0 && isOpen && recentSearches.length > 0;
  const isLoading = isLoadingProducts || isLoadingCategories;

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

    const recentSearchesStart = 0;
    const recentSearchesEnd = showRecentSearches ? recentSearches.length : 0;
    const categoriesStart = recentSearchesEnd;
    const categoriesEnd = categoriesStart + filteredCategories.length;
    const productsStart = categoriesEnd;
    const productsEnd = productsStart + filteredProducts.length;

    const allItemsLength = productsEnd;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItemsLength - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allItemsLength) {
        // Recent search
        if (
          selectedIndex >= recentSearchesStart &&
          selectedIndex < recentSearchesEnd
        ) {
          const searchQuery =
            recentSearches[selectedIndex - recentSearchesStart];
          handleSearch(searchQuery);
        }
        // Category
        else if (
          selectedIndex >= categoriesStart &&
          selectedIndex < categoriesEnd
        ) {
          const category = filteredCategories[selectedIndex - categoriesStart];
          router.push(`/search?category=${category.slug}`);
          setIsOpen(false);
        }
        // Product
        else if (
          selectedIndex >= productsStart &&
          selectedIndex < productsEnd
        ) {
          const product = filteredProducts[selectedIndex - productsStart];
          if (product.name) {
            saveRecentSearch(product.name);
            setRecentSearches(getRecentSearches());
            router.push(`/products/${product.slug}`);
            setIsOpen(false);
          }
        }
      } else {
        // No selection, search with current query
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setRecentSearches(getRecentSearches());
      router.push("/search?query=" + encodeURIComponent(searchQuery));
      setIsOpen(false);
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

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <div className="relative flex-1 max-w-2xl" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={t("common.searchPlaceholder")}
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
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm",
                      selectedIndex === idx
                        ? "bg-primary text-primary-foreground"
                        : ""
                    )}
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && query.length > 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin" />
              <p className="text-sm">Qidirilmoqda...</p>
            </div>
          )}

          {/* Categories */}
          {!isLoading && filteredCategories.length > 0 && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Tag className="h-3 w-3" />
                <span>Turkumlar</span>
              </div>
              <div className="space-y-1">
                {filteredCategories.map((category, idx) => {
                  const categoryIndex =
                    (showRecentSearches ? recentSearches.length : 0) + idx;
                  return (
                    <Link
                      key={category.id}
                      href={`/search?category=${category.slug}`}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm group",
                        selectedIndex === categoryIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      <span className="flex-1 text-left font-medium">
                        {category.name}
                      </span>
                      {category.count !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {category.count} mahsulot
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Package className="h-3 w-3" />
                <span>Mahsulotlar</span>
              </div>
              <div className="space-y-1">
                {filteredProducts.map((product, idx) => {
                  const productIndex =
                    (showRecentSearches ? recentSearches.length : 0) +
                    filteredCategories.length +
                    idx;
                  return (
                    <Link
                      href={`/products/${product.slug}`}
                      key={product.id || idx}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm group",
                        selectedIndex === productIndex
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                      onClick={() => {
                        if (product.name) {
                          saveRecentSearch(product.name);
                          setRecentSearches(getRecentSearches());
                        }
                        setIsOpen(false);
                      }}
                    >
                      <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium truncate">
                          {product.name}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results */}
          {!isLoading &&
            query.length > 0 &&
            totalResults === 0 &&
            !showRecentSearches && (
              <div className="p-8 text-center text-muted-foreground z-50">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">"{query}" uchun natija topilmadi</p>
                <p className="text-xs mt-1">Boshqa so'z bilan qidiring</p>
              </div>
            )}

          {/* Footer tip */}
          {!isLoading && totalResults > 0 && (
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
