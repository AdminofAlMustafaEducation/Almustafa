import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { galleryImages, galleryCategories, type GalleryImage } from "@/data/gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Campus, Classrooms & Faculty | Al-Mustafa Academy" },
      { name: "description", content: "A glimpse inside Al-Mustafa Academy: our G-11/2 campus, classrooms, library, science lab, faculty and student moments captured with care." },
      { property: "og:title", content: "Gallery — Al-Mustafa Academy" },
      { property: "og:description", content: "Step inside our Islamabad campus through pictures." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [filter, setFilter] = useState<(typeof galleryCategories)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = filter === "All" ? galleryImages : galleryImages.filter((i) => i.category === filter);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % visible.length)),
    [visible.length],
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  const active: GalleryImage | null = activeIndex !== null ? visible[activeIndex] : null;

  return (
    <>
      {/* HERO */}
      <section className="relative bg-navy-deep text-primary-foreground py-fluid-hero overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold">Gallery</p>
          <h1 className="mt-5 sm:mt-6 font-display text-fluid-h1 font-bold">
            A look inside our<br/>
            <em className="text-shimmer font-serif-elegant">academy.</em>
          </h1>
          <p className="mt-6 sm:mt-8 text-fluid-base text-primary-foreground/80 max-w-2xl mx-auto">
            Twenty-seven years of teaching, learning and quiet milestones — captured in light.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="bg-background border-b border-border sticky top-20 z-30 backdrop-blur-md bg-background/85">
        <div className="container-fluid py-3 sm:py-4 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <Camera className="h-4 w-4 text-gold shrink-0 mr-1 sm:mr-2" />
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all ${
                filter === cat
                  ? "bg-navy text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:text-navy hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* MASONRY */}
      <section className="bg-background py-10 md:py-16">
        <div className="container-fluid">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 [column-fill:_balance]">
            {visible.map((img, i) => (
              <button
                key={img.src + filter}
                onClick={() => setActiveIndex(i)}
                className="group relative mb-4 sm:mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-navy-deep cursor-zoom-in shadow-card"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 text-left">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{img.category}</span>
                  <h3 className="font-display text-base sm:text-lg text-primary-foreground mt-1">{img.caption}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {active && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-navy-deep/98 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-up"
          onClick={close}
        >
          <button onClick={close} aria-label="Close" className="absolute top-3 right-3 sm:top-5 sm:right-5 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-navy/80 border border-gold/30 text-gold-soft flex items-center justify-center hover:bg-gold hover:text-navy-deep transition-colors z-10">
            <X className="h-5 w-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-2 sm:left-3 md:left-8 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-navy/80 border border-gold/30 text-gold-soft flex items-center justify-center hover:bg-gold hover:text-navy-deep transition-colors z-10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-2 sm:right-3 md:right-8 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-navy/80 border border-gold/30 text-gold-soft flex items-center justify-center hover:bg-gold hover:text-navy-deep transition-colors z-10">
            <ChevronRight className="h-5 w-5" />
          </button>

          <figure onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full max-h-[88vh] flex flex-col items-center px-10 sm:px-14">
            <img src={active.src} alt={active.alt} className="max-h-[70vh] sm:max-h-[78vh] max-w-full w-auto rounded-xl shadow-elegant object-contain" />
            <figcaption className="mt-3 sm:mt-4 text-center px-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{active.category}</span>
              <p className="font-display text-base sm:text-xl text-primary-foreground mt-1">{active.caption}</p>
              <p className="text-[11px] sm:text-xs text-primary-foreground/50 mt-1">{activeIndex + 1} / {visible.length}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}