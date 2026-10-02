"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SanityImage } from "@/components/shared/SanityImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapPin, Maximize2 } from "lucide-react";

interface GalleryImage {
  asset?: any;
  alt?: string;
  caption?: string;
  location?: string;
}

interface GalleryBlockProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  images: GalleryImage[];
  layout?: "masonry" | "grid-3" | "carousel";
}

export function GalleryBlock({
  badge,
  heading,
  subheading,
  images = [],
}: GalleryBlockProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {(heading || badge) && (
          <div className="max-w-2xl mb-12 text-center mx-auto">
            {badge && (
              <Badge variant="accent" className="mb-3">
                {badge}
              </Badge>
            )}
            {heading && (
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-border/60 bg-muted transition-all duration-300 hover:shadow-xl"
            >
              <SanityImage
                image={img}
                alt={img.alt || "Gallery image"}
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white flex items-center justify-between w-full">
                  <div>
                    {img.location && (
                      <span className="inline-flex items-center text-xs font-semibold text-accent">
                        <MapPin className="h-3 w-3 mr-1" />
                        {img.location}
                      </span>
                    )}
                    {img.caption && (
                      <p className="text-sm font-medium line-clamp-1">{img.caption}</p>
                    )}
                  </div>
                  <Maximize2 className="h-4 w-4 shrink-0 text-white/80" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-2 bg-black/95 border-none text-white">
            {selectedImage && (
              <div className="relative">
                <SanityImage
                  image={selectedImage}
                  alt={selectedImage.alt || "Gallery Preview"}
                  width={1400}
                  height={900}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                {(selectedImage.caption || selectedImage.location) && (
                  <div className="p-4 text-center">
                    {selectedImage.location && (
                      <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                        {selectedImage.location}
                      </p>
                    )}
                    {selectedImage.caption && (
                      <p className="text-sm text-white/80">{selectedImage.caption}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
