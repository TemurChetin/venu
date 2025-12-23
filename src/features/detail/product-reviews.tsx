"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Review } from "@/types/api";
import { formatDate } from "@/lib/formatDate";

interface ProductReviewsProps {
  reviews: Review[];
  totalCount?: number;
}

export function ProductReviews({ reviews, totalCount }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>
          Izohlar {totalCount !== undefined && `(${totalCount})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                {review.user_avatar ? (
                  <img
                    src={review.user_avatar}
                    alt={review.user_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {review.user_name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-medium">
                    {review.user_name || "Безымянный"}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
