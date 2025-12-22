"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Store } from "lucide-react";

export function SellerInfo() {
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
          <div className="space-y-1">
            <p className="font-medium">AGE Compyuters</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>0 Отзывы</span>
              <span>•</span>
              <span>475 Товары</span>
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
