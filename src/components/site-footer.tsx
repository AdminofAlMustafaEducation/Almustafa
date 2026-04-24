import { Link } from "@tanstack/react-router";
import { Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "@/assets/logo.png";
import { academy } from "@/data/faculty";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-primary-foreground border-t border-gold/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" width={56} height={56} className="h-14 w-14" loading="lazy" />
              <div>
                <div className="font-display text-2xl text-gold font-bold">Al-Mustafa</div>
                <div className="text-xs uppercase tracking-[0.2em] text-gold-soft/70">Academy · Since 1998</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Trusted evening coaching academy in Islamabad, shaping generations of students from Juniors through F.Sc since 1998.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-display text-lg mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/programs", label: "Programs" },
                { to: "/faculty", label: "Faculty" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-primary-foreground/70 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-display text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /><span>{academy.addressPrimary}</span></li>
              <li className="flex gap-2"><Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" /><a href={`tel:${academy.phoneIntl}`} className="hover:text-gold">{academy.phone}</a></li>
              <li className="flex gap-2"><Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" /><a href={`mailto:${academy.email}`} className="hover:text-gold break-all">{academy.email}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-display text-lg mb-4">Hours</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              <li className="flex gap-2"><Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" /><span>Mon – Sat<br/>3:00 PM – 9:00 PM</span></li>
            </ul>
            <a href={academy.facebook} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold">
              <Facebook className="h-4 w-4" /> Follow on Facebook
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/15 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Al-Mustafa Academy. All rights reserved.</p>
          <p className="font-serif-elegant italic text-gold-soft/70">"Education is the kindling of a flame."</p>
        </div>
      </div>
    </footer>
  );
}