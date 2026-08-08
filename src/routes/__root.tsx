import { HeadContent, Link, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppChat } from "@/components/whatsapp-chat";
import { NotificationBell } from "@/components/notification-bell";
import { AuthProvider } from "@/components/auth/auth-provider";
import { academy } from "@/data/faculty";
import { buildPageHead, logoPath, logoUrl, siteName, siteUrl } from "@/lib/seo";

import appCss from "../styles.css?url";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": `${siteUrl}/#school`,
    name: academy.name,
    description:
      "Evening coaching academy in G-11/2 Islamabad for Juniors, Matric and F.Sc students, trusted by families since 1998.",
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    telephone: academy.phoneIntl,
    email: academy.email,
    sameAs: [academy.facebook, academy.youtube],
    address: {
      "@type": "PostalAddress",
      streetAddress: academy.addressPrimary,
      addressLocality: "Islamabad",
      addressCountry: "PK",
    },
    openingHours: "Mo-Sa 15:00-21:00",
    areaServed: "Islamabad",
    foundingDate: "1998",
    priceRange: "$$",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Academic coaching programs",
      itemListElement: academy.programNames.map((name) => ({
        "@type": "Course",
        name,
        provider: {
          "@type": "School",
          name: academy.name,
          sameAs: siteUrl,
        },
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  },
];

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
            The page you&apos;re looking for does not exist or has been moved.
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
  head: () => {
    const pageHead = buildPageHead({
      title: "Al-Mustafa Academy | Evening Coaching in G-11/2 Islamabad",
      description:
        "Trusted evening coaching academy in Islamabad since 1998. Juniors, Matric and F.Sc by senior college lecturers. Call 0335 0555696.",
      path: "/",
    });

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: siteName },
        { name: "theme-color", content: "#223a57" },
        { name: "format-detection", content: "telephone=yes" },
        ...pageHead.meta,
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: logoPath, type: "image/jpeg" },
        { rel: "apple-touch-icon", href: logoPath },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        ...pageHead.links,
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only absolute left-3 top-3 z-[200] rounded-full bg-navy px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isAdmin = pathname.startsWith("/admin");

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {!isAdmin && <SiteHeader />}
        <main id="main-content">
          <Outlet />
        </main>
        {!isAdmin && <SiteFooter />}
        {!isAdmin && <NotificationBell />}
        {!isAdmin && <WhatsAppChat />}
      </AuthProvider>
    </QueryClientProvider>
  );
}
