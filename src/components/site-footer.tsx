import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { academy } from "@/data/faculty";

const logo = "/brand/almustafa-logo.jpg";

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 bg-navy-deep text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white p-1 shadow-[0_14px_34px_-18px_rgba(0,0,0,0.5)] ring-1 ring-gold/25">
                <img
                  src={logo}
                  alt="Al-Mustafa Academy logo"
                  width={56}
                  height={56}
                  className="h-full w-full rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-gold">Al-Mustafa</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gold-soft/70">
                  Academy | Since 1998
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Trusted evening coaching academy in Islamabad, shaping generations of students from Juniors through F.Sc since 1998.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-gold">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/programs", label: "Programs" },
                { to: "/faculty", label: "Faculty" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-gold">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{academy.addressPrimary}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${academy.phoneIntl}`} className="hover:text-gold">
                  {academy.phone}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${academy.email}`} className="break-all hover:text-gold">
                  {academy.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-gold">Hours</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  Mon - Sat
                  <br />
                  3:00 PM - 9:00 PM
                </span>
              </li>
            </ul>
            <a
              href={academy.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold"
            >
              <Facebook className="h-4 w-4" /> Follow on Facebook
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gold/15 pt-6 text-xs text-primary-foreground/50 sm:flex-row">
          <p>Copyright {new Date().getFullYear()} Al-Mustafa Academy. All rights reserved.</p>
          <p className="font-serif-elegant italic text-gold-soft/70">"Education is the kindling of a flame."</p>
        </div>
      </div>
    </footer>
  );
}
