import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Facebook, Send } from "lucide-react";
import { useState } from "react";
import { academy } from "@/data/faculty";
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

      <section className="bg-navy py-2">
        <div className="mx-auto max-w-7xl">
          <div className="aspect-[16/8] md:aspect-[21/8] w-full overflow-hidden border-y-2 border-gold/30">
            <iframe
              src={academy.mapsEmbed}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Al-Mustafa Academy location"
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-12 text-center">
        <a href={academy.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-navy font-semibold hover:text-gold transition-colors">
          <MapPin className="h-4 w-4" /> Open in Google Maps
        </a>
      </section>
    </>
  );
}