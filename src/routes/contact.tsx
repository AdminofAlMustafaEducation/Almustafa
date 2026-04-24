import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Facebook, Send, Navigation } from "lucide-react";
import { useState } from "react";
import { academy, branches } from "@/data/faculty";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Admissions — Al-Mustafa Academy, G-11/2 Islamabad" },
      { name: "description", content: "Visit Al-Mustafa Academy at House# 1461, Sachal Sarmast Road, G-11/2, Islamabad. Call 0335 0555696 or email almustafaschool@gmail.com." },
      { property: "og:title", content: "Contact Al-Mustafa Academy" },
      { property: "og:description", content: "Two campuses in G-11/2 Islamabad. Call 0335 0555696." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Admission inquiry — ${data.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nPhone: ${data.get("phone")}\nClass / Program: ${data.get("program")}\n\nMessage:\n${data.get("message")}`
    );
    window.location.href = `mailto:${academy.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <section className="relative bg-navy-deep text-primary-foreground py-24 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <p className="ornament text-xs uppercase tracking-[0.3em] text-gold">Get in Touch</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-tight">
            We'd love to <em className="text-shimmer font-serif-elegant">hear from you.</em>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Visit one of our two campuses in G-11/2 Islamabad, or send a quick message and we'll respond within one working day.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-12">
          {/* CONTACT INFO */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="ornament text-xs uppercase tracking-[0.3em] text-gold font-semibold inline-block">Reach Us</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-navy font-bold">Contact Information</h2>
              <div className="gold-divider my-5 w-20" />
            </div>

            {[
              { icon: MapPin, t: "Main Campus", d: academy.addressPrimary },
              { icon: MapPin, t: "Second Campus", d: academy.addressSecondary },
              { icon: Phone, t: "Phone", d: academy.phone, href: `tel:${academy.phoneIntl}` },
              { icon: Mail, t: "Email", d: academy.email, href: `mailto:${academy.email}` },
              { icon: Clock, t: "Hours", d: "Monday – Saturday · 3:00 PM – 9:00 PM" },
              { icon: Facebook, t: "Facebook", d: "@Almustafa614", href: academy.facebook },
            ].map(({ icon: Icon, t, d, href }) => {
              const inner = (
                <div className="flex gap-4 p-5 bg-card border border-border rounded-2xl hover:border-gold hover:shadow-card transition-all">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gold-gradient flex items-center justify-center">
                    <Icon className="h-5 w-5 text-navy-deep" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{t}</div>
                    <div className="font-semibold text-navy mt-0.5">{d}</div>
                  </div>
                </div>
              );
              return href ? (
                <a key={t} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">
                  {inner}
                </a>
              ) : (
                <div key={t}>{inner}</div>
              );
            })}
          </div>

          {/* FORM */}
          <div className="lg:col-span-3">
            <div className="bg-navy-deep text-primary-foreground rounded-3xl p-8 md:p-10 shadow-elegant relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Admission Inquiry</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Send us a message</h2>
                <p className="mt-2 text-primary-foreground/70 text-sm">We'll get back to you within one working day.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gold-soft/80">Full Name</label>
                      <input required name="name" className="mt-2 w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gold-soft/80">Phone</label>
                      <input required name="phone" type="tel" className="mt-2 w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none" placeholder="03XX XXXXXXX" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-gold-soft/80">Class / Program</label>
                    <select required name="program" className="mt-2 w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-primary-foreground focus:border-gold focus:outline-none">
                      <option value="">Select a program</option>
                      <option>Juniors (Class 1 – 8)</option>
                      <option>Matric (9th)</option>
                      <option>Matric (10th)</option>
                      <option>F.Sc Pre-Medical (1st Year)</option>
                      <option>F.Sc Pre-Medical (2nd Year)</option>
                      <option>F.Sc Pre-Engineering (1st Year)</option>
                      <option>F.Sc Pre-Engineering (2nd Year)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-gold-soft/80">Message</label>
                    <textarea name="message" rows={4} className="mt-2 w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none resize-none" placeholder="Tell us a little about your child..." />
                  </div>

                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-gold-gradient text-navy-deep font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-[1.02] transition-transform">
                    <Send className="h-4 w-4" /> {sent ? "Opening your email..." : "Send Inquiry"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="bg-navy-deep text-primary-foreground py-20 md:py-28 border-t border-gold/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="ornament text-xs uppercase tracking-[0.3em] text-gold font-semibold">Our Branches</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">
              Two campuses, <em className="font-serif-elegant text-gold">one neighbourhood.</em>
            </h2>
            <p className="mt-4 text-primary-foreground/70 max-w-xl mx-auto">
              Both branches sit just minutes apart in G-11/2 — choose whichever is closer to home.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {branches.map((b, i) => (
              <article key={b.id} className="group relative bg-navy rounded-3xl border border-gold/20 overflow-hidden shadow-elegant hover:border-gold/60 transition-colors">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <iframe
                    src={b.mapsEmbed}
                    className="w-full h-full border-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${b.name} location map`}
                  />
                  <div className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-2 bg-navy-deep/90 backdrop-blur border border-gold/40 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.25em] text-gold">
                    Branch 0{i+1}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="font-display text-2xl text-gold font-bold">{b.label}</h3>
                  <div className="gold-divider my-4 w-16" />
                  <ul className="space-y-3 text-sm text-primary-foreground/80">
                    <li className="flex gap-3"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /><span>{b.address}</span></li>
                    <li className="flex gap-3"><Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" /><a href={`tel:${b.phoneIntl}`} className="hover:text-gold">{b.phone}</a></li>
                    <li className="flex gap-3"><Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" /><span>{b.hours}</span></li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={b.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gold-gradient text-navy-deep font-semibold px-5 py-2.5 rounded-full text-sm shadow-gold hover:scale-105 transition-transform">
                      <Navigation className="h-4 w-4" /> Get Directions
                    </a>
                    <a href={`tel:${b.phoneIntl}`} className="inline-flex items-center gap-2 border border-gold/40 text-gold-soft px-5 py-2.5 rounded-full text-sm hover:bg-gold/10 transition-colors">
                      <Phone className="h-4 w-4" /> Call Branch
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}