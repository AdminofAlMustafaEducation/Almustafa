"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrochureImage } from "@/data/brochures";

type HoverExpandGalleryProps = {
  images: BrochureImage[];
  className?: string;
};

export function HoverExpandGallery({ images, className }: HoverExpandGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const activeImages = images.filter((img) => img.isActive);

  if (activeImages.length === 0) return null;

  function handlePrev() {
    setActiveImage((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  }

  function handleNext() {
    setActiveImage((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={cn("relative w-full", className)}
    >
      {/* Mobile: Horizontal scroll with arrows */}
      <div className="relative sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          {activeImages.map((image, index) => (
            <motion.div
              key={index}
              className="group relative shrink-0 cursor-pointer overflow-hidden rounded-xl"
              style={{ width: activeImage === index ? 220 : 72, height: 72 }}
              animate={{
                width: activeImage === index ? 220 : 72,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="size-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Tablet: Vertical stack with tap and arrows */}
      <div className="relative hidden sm:flex lg:hidden flex-col gap-1.5">
        {activeImages.map((image, index) => (
          <motion.div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-2xl"
            initial={{ height: 44 }}
            animate={{
              height: activeImage === index ? 280 : 44,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setActiveImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
        <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop: Vertical stack with hover and arrows */}
      <div className="relative hidden lg:flex flex-col gap-1.5">
        {activeImages.map((image, index) => (
          <motion.div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-2xl"
            initial={{ height: 40 }}
            animate={{
              height: activeImage === index ? 320 : 40,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setActiveImage(index)}
            onHoverStart={() => setActiveImage(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="absolute -bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {activeImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveImage(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeImage === index ? "w-6 bg-navy-deep" : "w-1.5 bg-navy-deep/40",
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
