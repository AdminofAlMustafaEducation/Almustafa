"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { BrochureImage } from "@/data/brochures";

type HoverExpandGalleryProps = {
  images: BrochureImage[];
  className?: string;
};

export function HoverExpandGallery({ images, className }: HoverExpandGalleryProps) {
  const [activeImage, setActiveImage] = useState<number | null>(0);
  const activeImages = images.filter((img) => img.isActive);

  useEffect(() => {
    if (activeImages.length === 0) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => {
        if (prev === null || prev >= activeImages.length - 1) return 0;
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeImages.length]);

  if (activeImages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={cn("relative w-full", className)}
    >
      {/* Mobile: Horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:hidden">
        {activeImages.map((image, index) => (
          <motion.div
            key={index}
            className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl"
            style={{ width: activeImage === index ? 200 : 64, height: 64 }}
            animate={{
              width: activeImage === index ? 200 : 64,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setActiveImage(index)}
          >
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-x-0 bottom-0 flex items-end p-2"
                >
                  <p className="text-[10px] font-semibold text-white">{image.caption}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Tablet: Vertical stack with tap */}
      <div className="hidden sm:flex lg:hidden flex-col gap-1.5">
        {activeImages.map((image, index) => (
          <motion.div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-2xl"
            initial={{ height: 40 }}
            animate={{
              height: activeImage === index ? 250 : 40,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setActiveImage(index)}
          >
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4"
                >
                  <p className="text-sm font-semibold text-white">{image.caption}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Desktop: Vertical stack with hover */}
      <div className="hidden lg:flex flex-col gap-1.5">
        {activeImages.map((image, index) => (
          <motion.div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-2xl"
            initial={{ height: 36 }}
            animate={{
              height: activeImage === index ? 280 : 36,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setActiveImage(index)}
            onHoverStart={() => setActiveImage(index)}
          >
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5"
                >
                  <p className="text-sm font-semibold text-white">{image.caption}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover"
              loading="eager"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
