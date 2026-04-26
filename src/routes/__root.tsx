import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { academy } from "@/data/faculty";

import appCss from "../styles.css?url";

const siteUrl = "https://al-mustafa-clone.vercel.app";
const logoPath = "/brand/almustafa-logo.jpg";
const logoUrl = `${siteUrl}${logoPath}`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: academy.name,
  url: siteUrl,
  logo: logoUrl,
  image: logoUrl,
  telephone: academy.phoneIntl,
  email: academy.email,
  sameAs: [academy.facebook],
  address: {
    "@type": "PostalAddress",
    streetAddress: academy.addressPrimary,
    addressLocality: "Islamabad",
    addressCountry: "PK",
  },
};

function NotFoundComponent() {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-24">
        <div className="max-w-md text-center">
          <h1 className="font-display text-8xl font-bold text-navy">404</h1>
          <div className="gold-divider mx-auto my-6 w-32" />
          <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-navy-deep"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Al-Mustafa Academy — Evening Coaching in G-11/2 Islamabad" },
      {
        name: "description",
        content:
          "Trusted evening coaching academy in Islamabad since 1998. Juniors, Matric & F.Sc by senior college lecturers. Call 0335 0555696.",
      },
      { name: "author", content: academy.name },
      { property: "og:title", content: "Al-Mustafa Academy — Since 1998" },
      {
        property: "og:description",
        content: "Premier evening coaching academy in G-11/2 Islamabad. Juniors, Matric & F.Sc.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:site_name", content: academy.name },
      { property: "og:image", content: logoUrl },
      { property: "og:image:alt", content: "Al-Mustafa Academy official logo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Al-Mustafa Academy — Since 1998" },
      {
        name: "twitter:description",
        content: "Premier evening coaching academy in G-11/2 Islamabad. Juniors, Matric & F.Sc.",
      },
      { name: "twitter:image", content: logoUrl },
      { name: "theme-color", content: "#6b1f19" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: logoPath, type: "image/jpeg" },
      { rel: "apple-touch-icon", href: logoPath },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
