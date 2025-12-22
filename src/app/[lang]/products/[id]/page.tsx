"use client";

import { useState } from "react";
import { Star, Heart, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/features/detail/product-gallery";
import { SellerInfo } from "@/features/detail/seller-info";
import { ProductReviews } from "@/features/detail/product-reviews";
import { RelatedProducts } from "@/features/detail/related-products";

export default function DetailPage() {
  const [selectedSize, setSelectedSize] = useState("16GB");
  const [selectedColor, setSelectedColor] = useState("white");

  return (
    <main className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>Главная</li>
          <li>/</li>
          <li>Категории</li>
          <li>/</li>
          <li className="text-foreground">Paxta yostiqchalari</li>
        </ol>
      </nav>

      {/* Product Section */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 mb-12">
        {/* Gallery */}
        <ProductGallery />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-balance leading-tight">
              Paxta yostiqchalari Soft Cotton Lure!, 120 dona
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9</span>
                <span className="text-sm text-muted-foreground">
                  (755 sharhlar)
                </span>
              </div>
              <Badge variant="secondary">Original</Badge>
            </div>
          </div>

          {/* Timer */}
          {/* <Card className="border-primary/20 bg-primary/5"> */}
          {/*   <CardContent className="p-4"> */}
          {/*     <div className="flex items-center justify-between gap-4 flex-wrap"> */}
          {/*       <span className="text-sm font-medium">Ulgurib qoling</span> */}
          {/*       <CountdownTimer hours={136} minutes={56} seconds={4} /> */}
          {/*     </div> */}
          {/*   </CardContent> */}
          {/* </Card> */}
          {/**/}
          {/* Price */}

          <div className="space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-bold text-primary">
                23,455 so'm
              </span>
              <span className="text-xl text-muted-foreground line-through">
                25,990
              </span>
              <Badge variant="destructive" className="bg-primary">
                -12%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              2699 dona xarid qilish mumkin
            </p>
            <p className="text-sm font-medium">
              Bu haftada 435 kishi sotib oldi
            </p>
          </div>

          <Separator />

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Rangi:</label>
            <div className="flex items-center gap-3 flex-wrap">
              {["white", "pink", "blue"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary scale-110"
                      : "border-border"
                  }`}
                  style={{
                    backgroundColor:
                      color === "white"
                        ? "#fff"
                        : color === "pink"
                        ? "#ffc0cb"
                        : "#add8e6",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Hajmi:</label>
            <div className="flex items-center gap-3 flex-wrap">
              {["8 GB", "16 GB", "32 GB"].map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                  className="min-w-[80px]"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Delivery Info */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Ertaga yetkazib beramiz</p>
              <p className="text-sm text-muted-foreground">
                В пункт выдачи или курьером
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <Button size="lg" className="flex-1 h-12 text-base font-medium">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Savatga qo'shish
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="sm:w-auto h-12 bg-transparent"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="w-full h-12 text-base font-medium"
          >
            1 bosishda xarid qiling
          </Button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground">Заказы</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground">Отзывы</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground">В избранном</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <Card className="mb-12">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4">Mahsulot haqida</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              LURE paxta yostiqchalari maxsus texnologiya - "suv bilan
              silliqlash" yordamida ishlab chiqariladi, shu bilan mukammal
              silliq sirt hosil qiladi.
            </p>
            <p>
              Silliq sirt tufayli disklar kosmetik mahsulotlarni o'zlashtiradi
              va surmaydi. Disklar delaminatsiyalanmaydi va villi qoldirmaydi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seller Info */}
      <SellerInfo />

      {/* Reviews */}
      <ProductReviews />

      {/* Related Products */}
      <RelatedProducts />
    </main>
  );
}
