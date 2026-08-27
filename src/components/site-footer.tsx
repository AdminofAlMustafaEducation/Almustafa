import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { academy } from "@/data/faculty";

const logo = "/brand/almustafa-logo.jpg";

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 bg-navy-deep text-primary-foreground">
      <div className="container-fluid py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white p-1 ring-1 ring-gold/25">
                <img
                  src={logo}
                  alt="Al-Mustafa Academy logo"
                  width={48}
                  height={48}
                  className="h-full w-full rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-gold">Al-Mustafa</div>
                <div className="text-xs text-gold-soft/70">Academy, since 1998</div>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Evening coaching in G-11 and G-10 Islamabad for Juniors, Matric and F.Sc.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-bold text-gold">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/programs", label: "Programs" },
                { to: "/faculty", label: "Faculty" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-bold text-gold">Portals</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/apply"
                  className="text-primary-foreground/70 transition-colors hover:text-gold"
                >
                  Apply for Admission
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="text-primary-foreground/70 transition-colors hover:text-gold"
                >
                  Track Application
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-primary-foreground/70 transition-colors hover:text-gold"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/portal"
                  className="text-primary-foreground/70 transition-colors hover:text-gold"
                >
                  Student Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/teacher"
                  className="text-primary-foreground/70 transition-colors hover:text-gold"
                >
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-primary-foreground/70 transition-colors hover:text-gold"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-bold text-gold">Contact</h3>
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
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Mon-Sat, 3:00 PM to 9:00 PM</span>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-4">
              <a
                href={academy.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold"
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
              <a
                href={academy.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold"
              >
                <Youtube className="h-4 w-4" /> YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gold/15 pt-6 text-xs text-primary-foreground/50">
          <p>Copyright {new Date().getFullYear()} Al-Mustafa Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
