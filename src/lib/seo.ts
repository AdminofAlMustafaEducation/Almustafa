export const siteUrl = "https://al-mustafa-clone.vercel.app";
export const siteName = "Al-Mustafa Academy";
export const logoPath = "/brand/almustafa-logo.jpg";
export const logoUrl = `${siteUrl}${logoPath}`;

type PageHeadInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function buildPageHead({ title, description, path, image = logoUrl }: PageHeadInput) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${pathname === "/" ? "" : pathname}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:site_name", content: siteName },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: `${siteName} official logo` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
