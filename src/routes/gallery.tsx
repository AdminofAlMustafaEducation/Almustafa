import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { PageHero } from "@/components/page-hero";
import { galleryCategories, galleryImages, type GalleryImage } from "@/data/gallery";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () =>
    buildPageHead({
      title: "Gallery | Campus, Classrooms and Faculty | Al-Mustafa Academy",
      description:
        "A glimpse inside Al-Mustafa Academy: our G-11/2 campus, classrooms, library, science lab, faculty and student moments captured with care.",
      path: "/gallery",
    }),
  component: GalleryPage,
});

function GalleryPage() {
  const [filter, setFilter] = useState<(typeof galleryCategories)[number]>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = filter === "All" ? galleryImages : galleryImages.filter((image) => image.category === filter);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((index) => (index === null ? null : (index + 1) % visible.length)),
    [visible.length],
  );
  const prev = useCallback(
    () => setActiveIndex((index) => (index === null ? null : (index - 1 + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
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
      <PageHero
        title={
          <>
            A look inside
            <br />
            the academy.
          </>
        }
        description="Campus, classrooms, faculty and student life. Tap any image to view it larger."
        backgroundImage={heroBg}
      />

      <section className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-md sm:top-[72px]">
        <div className="container-fluid flex items-center gap-2 overflow-x-auto py-3">
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === category
                  ? "bg-navy-deep text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-navy-deep"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-background py-10 md:py-16">
        <div className="container-fluid">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-black text-navy-deep sm:text-3xl">
              {filter === "All" ? "All academy moments" : `${filter} moments`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {visible.length} image{visible.length === 1 ? "" : "s"}
            </p>
          </div>

          {visible.length ? (
            <div className="columns-1 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
              {visible.map((image, i) => (
                <button
                  key={image.src + filter}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="group relative mb-4 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-2xl bg-navy-deep"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border px-6 py-10 text-center">
              <h3 className="font-display text-2xl font-black text-navy-deep">No images in this filter yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                Try another category to explore more of the academy.
              </p>
            </div>
          )}
        </div>
      </section>

      {active && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${activeIndex + 1} of ${visible.length}: ${active.caption}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/98 p-3 sm:p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-5 sm:top-5"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4 md:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            aria-label="Next"
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4 md:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <figure
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-5xl flex-col items-center px-10 sm:px-14"
          >
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[70vh] max-w-full rounded-xl object-contain sm:max-h-[78vh]"
              decoding="async"
            />
            <figcaption className="mt-4 px-4 text-center">
              <p className="font-display text-base text-white sm:text-xl">{active.caption}</p>
              <p className="mt-1 text-xs text-white/50">
                {activeIndex + 1} of {visible.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
