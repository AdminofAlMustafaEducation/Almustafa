import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-24">
        <div className="max-w-md text-center">
          <h1 className="font-display text-8xl font-bold text-navy">404</h1>
          <div className="gold-divider my-6 mx-auto w-32" />
          <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-navy-deep transition-colors">
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
      { name: "description", content: "Trusted evening coaching academy in Islamabad since 1998. Juniors, Matric & F.Sc by senior college lecturers. Call 0335 0555696." },
      { name: "author", content: "Al-Mustafa Academy" },
      { property: "og:title", content: "Al-Mustafa Academy — Since 1998" },
      { property: "og:description", content: "Premier evening coaching academy in G-11/2 Islamabad. Juniors, Matric & F.Sc." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
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
