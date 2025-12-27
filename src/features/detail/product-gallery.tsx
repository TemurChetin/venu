"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images?: string[];
}

export function ProductGallery({ images = [] }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden bg-muted h-[350px] md:h-[650px] p-0">
        <img
          src={displayImages[currentImage] || "/placeholder.svg"}
          alt="Product"
          className="w-full h-full object-cover"
        />
        {displayImages.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? displayImages.length - 1 : prev - 1
                )
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === displayImages.length - 1 ? 0 : prev + 1
                )
              }
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </Card>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === idx
                  ? "border-primary scale-105"
                  : "border-border"
              }`}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
