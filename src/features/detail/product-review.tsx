"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    author: "Безымянный",
    date: "3 Oktabr",
    rating: 5,
    comment: "Izoh: narxiga yarasha ekan",
  },
  {
    id: 2,
    author: "AGE Compyuters",
    date: "3 Oktabr",
    rating: 5,
    comment: "Izoh: narxiga yarasha ekan",
  },
  {
    id: 3,
    author: "Безымянный",
    date: "3 Oktabr",
    rating: 5,
    comment: "Izoh: narxiga yarasha ekan",
  },
];

export function ProductReviews() {
  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>Izohlar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {review.author[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-medium">{review.author}</p>
                  <span className="text-sm text-muted-foreground">
                    {review.date}
                  </span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
