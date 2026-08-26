import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Mail, MapPin, Navigation, Phone, Send, Youtube } from "lucide-react";
import { useState } from "react";
import { academy, branches } from "@/data/faculty";
import heroBg from "@/assets/hero-bg.jpg";
import { PageHero } from "@/components/page-hero";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildPageHead({
      title: "Contact and Admissions | Al-Mustafa Academy, G-11/2 Islamabad",
      description:
        "Visit Al-Mustafa Academy at House# 1461, Sachal Sarmast Road, G-11/2, Islamabad. Call 0335 0555696 or email almustafaschool@gmail.com.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Admission inquiry - ${data.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nPhone: ${data.get("phone")}\nClass / Program: ${data.get("program")}\n\nMessage:\n${data.get("message")}`,
    );

    window.location.assign(`mailto:${academy.email}?subject=${subject}&body=${body}`);
    setSent(true);
  };

  return (
    <>
      <PageHero
        title={
          <>
            Visit, call,
            <br />
            or write to us.
          </>
        }
        description="Two campuses in G-11/2 and G-10 Islamabad. Call the academy or send a short admission inquiry."
        backgroundImage={heroBg}
        stats={[
          { value: "2", label: "academy campuses" },
          { value: "1 day", label: "response rhythm" },
          { value: "Mon-Sat", label: "admissions support" },
        ]}
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-5 lg:col-span-2">
            <h2 className="font-display text-3xl font-black tracking-tight text-navy-deep">Contact information</h2>
            {[
              { icon: MapPin, title: "Main campus", detail: academy.addressPrimary },
              { icon: MapPin, title: "Second campus", detail: academy.addressSecondary },
              { icon: Phone, title: "Phone", detail: academy.phone, href: `tel:${academy.phoneIntl}` },
              { icon: Mail, title: "Email", detail: academy.email, href: `mailto:${academy.email}` },
              { icon: Clock, title: "Hours", detail: "Monday to Saturday, 3:00 PM to 9:00 PM" },
              { icon: Facebook, title: "Facebook", detail: "@Almustafa614", href: academy.facebook },
              { icon: Youtube, title: "YouTube", detail: "@almustafa1292", href: academy.youtube },
            ].map(({ icon: Icon, title, detail, href }) => {
              const card = (
                <div className="flex gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient">
                    <Icon className="h-5 w-5 text-navy-deep" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{title}</div>
                    <div className="mt-0.5 break-words text-sm font-semibold text-navy-deep">{detail}</div>
                  </div>
                </div>
              );

              return href ? (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block"
                >
                  {card}
                </a>
              ) : (
                <div key={title}>{card}</div>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-navy-deep p-6 text-primary-foreground sm:p-8 md:p-10">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Send us a message</h2>
              <p className="mt-2 text-sm text-primary-foreground/70">We will get back to you within one working day.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-medium text-gold-soft">
                      Full name
                    </label>
                    <input
                      id="contact-name"
                      required
                      name="name"
                      autoComplete="name"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-navy px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-sm font-medium text-gold-soft">
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      required
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-navy px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                      placeholder="03XX XXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-program" className="text-sm font-medium text-gold-soft">
                    Class / Program
                  </label>
                  <select
                    id="contact-program"
                    required
                    name="program"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-navy px-4 py-3 text-primary-foreground focus:border-gold focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a program
                    </option>
                    <option>Juniors (Class 1-8)</option>
                    <option>Matric (9th)</option>
                    <option>Matric (10th)</option>
                    <option>F.Sc Pre-Medical (1st Year)</option>
                    <option>F.Sc Pre-Medical (2nd Year)</option>
                    <option>F.Sc Pre-Engineering (1st Year)</option>
                    <option>F.Sc Pre-Engineering (2nd Year)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium text-gold-soft">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-navy px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                    placeholder="Tell us a little about your child"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 font-bold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" /> {sent ? "Opening your email..." : "Send inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-fluid-section">
        <div className="container-fluid">
          <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
            Two campuses, one neighbourhood.
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Both branches sit in G-11/2 and G-10. Choose whichever is closer to home.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {branches.map((branch) => (
              <article key={branch.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
                  <iframe
                    src={branch.mapsEmbed}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${branch.name} location map`}
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-xl font-bold text-navy-deep">{branch.label}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{branch.address}</span>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <a href={`tel:${branch.phoneIntl}`} className="hover:text-navy-deep">
                        {branch.phone}
                      </a>
                    </li>
                    <li className="flex gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{branch.hours}</span>
                    </li>
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={branch.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2.5 text-sm font-bold text-navy-deep shadow-gold"
                    >
                      <Navigation className="h-4 w-4" /> Get directions
                    </a>
                    <a
                      href={`tel:${branch.phoneIntl}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-bold text-navy-deep"
                    >
                      <Phone className="h-4 w-4" /> Call branch
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
