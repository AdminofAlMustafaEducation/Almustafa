import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { academy } from "@/data/faculty";

const logo = "/brand/almustafa-logo.jpg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/faculty", label: "Faculty" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container-fluid">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-[72px]">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-gold/20 sm:h-12 sm:w-12">
              <img
                src={logo}
                alt="Al-Mustafa Academy logo"
                className="h-full w-full rounded-full object-cover"
                width={48}
                height={48}
                decoding="async"
              />
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-base font-bold tracking-tight text-navy-deep sm:text-lg">
                Al-Mustafa
              </span>
              <span className="truncate text-[10px] text-muted-foreground sm:text-[11px]">
                Academy, since 1998
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-navy-deep/75 transition-colors hover:text-navy-deep"
                activeProps={{
                  className: "rounded-full bg-navy-deep px-3.5 py-2 text-sm font-semibold text-white",
                  "aria-current": "page",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={`tel:${academy.phoneIntl}`}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-navy-deep/80 transition-colors hover:text-navy-deep"
            >
              <Phone className="h-4 w-4 text-gold" /> {academy.phone}
            </a>
            <Link
              to="/apply"
              className="inline-flex items-center rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-bold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="rounded-md p-2 text-navy-deep transition-colors hover:bg-muted lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="space-y-1 border-t border-border pb-4 pt-3 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-3 py-2.5 text-navy-deep/85 hover:bg-white hover:text-gold"
                activeProps={{
                  className: "block rounded-2xl bg-white px-3 py-2.5 text-gold shadow-soft",
                  "aria-current": "page",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/apply"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-2xl bg-gold-gradient px-3 py-2.5 text-center text-sm font-bold text-navy-deep"
            >
              Apply for Admission
            </Link>
            <a
              href={`tel:${academy.phoneIntl}`}
              className="flex items-center gap-2 px-3 py-2 font-semibold text-navy-deep"
            >
              <Phone className="h-4 w-4 text-gold" /> {academy.phone}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
