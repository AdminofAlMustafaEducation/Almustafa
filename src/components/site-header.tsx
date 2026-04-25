import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { academy } from "@/data/faculty";

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
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-gold-gradient shadow-gold transition-transform group-hover:scale-105">
              <img src={logo} alt="Al-Mustafa Academy logo" className="h-9 w-9" width={36} height={36} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-xl sm:text-2xl text-navy-deep font-bold tracking-tight">Al-Mustafa</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Academy · Since 1998</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-2 text-sm font-semibold text-navy-deep/80 hover:text-gold transition-colors relative group"
                activeProps={{ className: "px-4 py-2 text-sm font-semibold text-gold relative" }}
              >
                {item.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          <a
            href={`tel:${academy.phoneIntl}`}
            className="hidden lg:inline-flex items-center gap-2 bg-gold-gradient text-white font-bold px-6 py-3 rounded-full text-sm shadow-gold hover:scale-105 transition-transform uppercase tracking-wide"
          >
            <Phone className="h-4 w-4" /> {academy.phone}
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-navy-deep p-2"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 space-y-1 border-t border-border pt-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-navy-deep/85 hover:bg-muted hover:text-gold"
                activeProps={{ className: "block px-3 py-2 rounded-md text-gold bg-muted" }}
              >
                {item.label}
              </Link>
            ))}
            <a href={`tel:${academy.phoneIntl}`} className="flex items-center gap-2 px-3 py-2 text-gold font-semibold">
              <Phone className="h-4 w-4" /> {academy.phone}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}