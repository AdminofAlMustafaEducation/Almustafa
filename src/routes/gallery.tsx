import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Images, LayoutGrid, X } from "lucide-react";
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
        eyebrow="Gallery"
        title={
          <>
            A look inside our
            <br />
            <em className="font-serif-elegant text-shimmer">academy.</em>
          </>
        }
        description="Explore moments from classrooms, faculty, campus routines and academy life through a gallery that keeps the experience visual without becoming cluttered."
        backgroundImage={heroBg}
        stats={[
          { value: `${galleryImages.length}`, label: "photo moments" },
          { value: `${galleryCategories.length - 1}`, label: "view categories" },
          { value: "2", label: "campus locations" },
          { value: "27+", label: "years of memories" },
        ]}
        aside={
          <div className="paper-panel overflow-hidden p-5 sm:p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              Explore the Gallery
            </div>
            <div className="mt-3 headline-balance font-display text-2xl font-black text-navy-deep sm:text-3xl">
              Browse by category, tap any image, and move through the collection without leaving the page.
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  icon: Camera,
                  title: "Touch-friendly browsing",
                  detail: "Category filters stay accessible on smaller screens with simple horizontal scrolling.",
                },
                {
                  icon: Images,
                  title: "Full-screen viewing",
                  detail: "Each image opens into a focused lightbox with keyboard and tap navigation support.",
                },
                {
                  icon: LayoutGrid,
                  title: "Balanced layout",
                  detail: "The gallery keeps a clean visual rhythm across phones, tablets and larger screens.",
                },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-start gap-3 rounded-[1.35rem] bg-white/75 p-4 shadow-soft">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy-deep text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display text-lg font-black text-navy-deep">{title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="sticky top-20 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container-fluid flex items-center gap-2 overflow-x-auto py-3 sm:py-4">
          <Camera className="mr-1 h-4 w-4 shrink-0 text-gold sm:mr-2" />
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all sm:px-4 sm:text-xs ${
                filter === category
                  ? "bg-navy text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:bg-muted hover:text-navy"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-background py-10 md:py-16">
        <div className="container-fluid">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-sky sm:text-xs">
                Filtered View
              </p>
              <h2 className="mt-2 font-display text-2xl font-black text-navy-deep sm:text-3xl">
                {filter === "All" ? "All academy moments" : `${filter} moments`}
              </h2>
            </div>
            <div className="stat-pill text-xs font-semibold text-navy sm:text-sm">
              <Images className="h-4 w-4 text-gold" />
              {visible.length} image{visible.length === 1 ? "" : "s"}
            </div>
          </div>

          {visible.length ? (
          <div className="columns-1 gap-4 [column-fill:_balance] sm:columns-2 sm:gap-5 lg:columns-3">
            {visible.map((image, i) => (
              <button
                key={image.src + filter}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="group relative mb-4 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-2xl bg-navy-deep shadow-card sm:mb-5"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{image.category}</span>
                  <h3 className="mt-1 font-display text-base text-primary-foreground sm:text-lg">{image.caption}</h3>
                </div>
              </button>
            ))}
          </div>
          ) : (
            <div className="paper-panel rounded-[1.8rem] px-6 py-10 text-center sm:px-8">
              <h3 className="font-display text-2xl font-black text-navy-deep">No images in this filter yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Try another category to explore more of the academy, faculty and classroom environment.
              </p>
            </div>
          )}
        </div>
      </section>

      {active && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${activeIndex! + 1} of ${visible.length}: ${active.caption}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/98 p-3 backdrop-blur-md sm:p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-navy/80 text-gold-soft transition-colors hover:bg-gold hover:text-navy-deep sm:right-5 sm:top-5 sm:h-11 sm:w-11"
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
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-navy/80 text-gold-soft transition-colors hover:bg-gold hover:text-navy-deep sm:left-3 sm:h-12 sm:w-12 md:left-8"
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
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-navy/80 text-gold-soft transition-colors hover:bg-gold hover:text-navy-deep sm:right-3 sm:h-12 sm:w-12 md:right-8"
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
              className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-elegant sm:max-h-[78vh]"
              decoding="async"
            />
            <figcaption className="mt-3 px-4 text-center sm:mt-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{active.category}</span>
              <p className="mt-1 font-display text-base text-primary-foreground sm:text-xl">{active.caption}</p>
              <p className="mt-1 text-[11px] text-primary-foreground/50 sm:text-xs">
                {activeIndex + 1} / {visible.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
