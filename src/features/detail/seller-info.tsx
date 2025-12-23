"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Store } from "lucide-react";

interface SellerInfoProps {
  seller: {
    id: number;
    name: string;
    logo?: string;
    rating?: number;
    review_count?: number;
    product_count?: number;
  };
}

export function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Информация о продавце
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {seller.logo && (
              <img
                src={seller.logo}
                alt={seller.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div className="space-y-1">
              <p className="font-medium">{seller.name}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {seller.review_count !== undefined && (
                  <>
                    <span>{seller.review_count} Отзывы</span>
                    <span>•</span>
                  </>
                )}
                {seller.product_count !== undefined && (
                  <span>{seller.product_count} Товары</span>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <MessageCircle className="h-4 w-4" />
            Чат с продавцом
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
