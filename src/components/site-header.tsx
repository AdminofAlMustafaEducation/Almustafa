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
    <header className="sticky top-0 z-50 border-b border-white/60 bg-background/82 backdrop-blur-xl">
      <div className="container-fluid">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-20">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1 shadow-[0_12px_32px_-16px_rgba(40,15,10,0.45)] ring-1 ring-gold/25 transition-transform group-hover:scale-[1.03] sm:h-14 sm:w-14">
              <img
                src={logo}
                alt="Al-Mustafa Academy logo"
                className="h-full w-full rounded-full object-cover"
                width={56}
                height={56}
                decoding="async"
              />
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-base font-bold tracking-tight text-navy-deep sm:text-2xl">
                Al-Mustafa
              </span>
              <span className="truncate text-[9px] uppercase tracking-[0.24em] text-muted-foreground sm:text-[10px] sm:tracking-[0.26em]">
                Academy | Since 1998
              </span>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 rounded-full border border-white/60 bg-white/55 px-2 py-1 shadow-soft backdrop-blur-md lg:flex"
            aria-label="Primary"
          >
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group relative rounded-full px-4 py-2 text-sm font-semibold text-navy-deep/82 transition-colors hover:text-gold"
                activeProps={{ className: "relative rounded-full bg-navy-deep px-4 py-2 text-sm font-semibold text-white shadow-soft" }}
              >
                {item.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <a
            href={`tel:${academy.phoneIntl}`}
            className="hidden items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-gold transition-transform hover:scale-105 lg:inline-flex"
          >
            <Phone className="h-4 w-4" /> {academy.phone}
          </a>

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
                activeProps={{ className: "block rounded-2xl bg-white px-3 py-2.5 text-gold shadow-soft" }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${academy.phoneIntl}`}
              className="flex items-center gap-2 px-3 py-2 font-semibold text-gold"
            >
              <Phone className="h-4 w-4" /> {academy.phone}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
