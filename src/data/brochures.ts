export type BrochureImage = {
  src: string;
  alt: string;
  caption: string;
  isActive: boolean;
  sortOrder: number;
};

export const brochureImages: BrochureImage[] = [
  {
    src: "/brochures/poster-1.png",
    alt: "Al-Mustafa Academy Poster 1",
    caption: "Admissions Open 2026-27",
    isActive: true,
    sortOrder: 1,
  },
  {
    src: "/brochures/poster-2.png",
    alt: "Al-Mustafa Academy Poster 2",
    caption: "Evening Coaching Programs",
    isActive: true,
    sortOrder: 2,
  },
  {
    src: "/brochures/poster-3.png",
    alt: "Al-Mustafa Academy Poster 3",
    caption: "Senior Faculty Members",
    isActive: true,
    sortOrder: 3,
  },
  {
    src: "/brochures/poster-4.png",
    alt: "Al-Mustafa Academy Poster 4",
    caption: "Campus Life & Activities",
    isActive: true,
    sortOrder: 4,
  },
  {
    src: "/brochures/poster-5.png",
    alt: "Al-Mustafa Academy Poster 5",
    caption: "Results & Achievements",
    isActive: true,
    sortOrder: 5,
  },
];
