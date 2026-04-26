import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Mail, MapPin, Navigation, Phone, Send } from "lucide-react";
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
        eyebrow="Get in Touch"
        title={
          <>
            We&apos;d love to
            <br />
            <em className="font-serif-elegant text-shimmer">hear from you.</em>
          </>
        }
        description="Visit one of our two campuses in G-11/2 Islamabad, call the academy directly, or send a quick admission inquiry so the team can guide you toward the right program."
        backgroundImage={heroBg}
        stats={[
          { value: "2", label: "academy campuses" },
          { value: "1 day", label: "response rhythm" },
          { value: "Mon-Sat", label: "admissions support" },
          { value: "G-11/2", label: "Islamabad location" },
        ]}
        aside={
          <div className="paper-panel overflow-hidden p-5 sm:p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              Quick Contact
            </div>
            <div className="mt-3 headline-balance font-display text-2xl font-black text-navy-deep sm:text-3xl">
              Fast ways for families to reach the academy without friction.
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  icon: Phone,
                  title: academy.phone,
                  detail: "Call for admissions, timings or campus guidance.",
                  href: `tel:${academy.phoneIntl}`,
                },
                {
                  icon: Mail,
                  title: academy.email,
                  detail: "Use email when you want to share a longer inquiry.",
                  href: `mailto:${academy.email}`,
                },
                {
                  icon: MapPin,
                  title: "Visit G-11/2 campuses",
                  detail: "Both branches are close by and easy for parents to compare.",
                  href: academy.mapsLink,
                },
              ].map(({ icon: Icon, title, detail, href }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-[1.35rem] bg-white/75 p-4 shadow-soft transition-colors hover:bg-white"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy-deep text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display text-lg font-black text-navy-deep">{title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        }
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-5 sm:space-y-6 lg:col-span-2">
            <div>
              <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
                <span className="inline-block h-2 w-2 rounded-full bg-sky" />
                Reach Us
              </p>
              <h2 className="headline-balance mt-3 font-display text-fluid-h2 font-black text-navy-deep">
                Contact Information
              </h2>
            </div>

            {[
              { icon: MapPin, title: "Main Campus", detail: academy.addressPrimary },
              { icon: MapPin, title: "Second Campus", detail: academy.addressSecondary },
              { icon: Phone, title: "Phone", detail: academy.phone, href: `tel:${academy.phoneIntl}` },
              { icon: Mail, title: "Email", detail: academy.email, href: `mailto:${academy.email}` },
              { icon: Clock, title: "Hours", detail: "Monday - Saturday | 3:00 PM - 9:00 PM" },
              { icon: Facebook, title: "Facebook", detail: "@Almustafa614", href: academy.facebook },
            ].map(({ icon: Icon, title, detail, href }) => {
              const card = (
                <div className="flex gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-gold hover:shadow-card sm:gap-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-gradient sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5 text-navy-deep" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">{title}</div>
                    <div className="mt-0.5 break-words text-sm font-semibold text-navy sm:text-base">{detail}</div>
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
            <div className="relative overflow-hidden rounded-2xl bg-navy-deep p-6 text-primary-foreground shadow-elegant sm:rounded-3xl sm:p-8 md:p-10">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
                  Admission Inquiry
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
                  Send us a message
                </h2>
                <p className="mt-2 text-xs text-primary-foreground/70 sm:text-sm">
                  We&apos;ll get back to you within one working day.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="text-xs uppercase tracking-wider text-gold-soft/80">
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        required
                        name="name"
                        autoComplete="name"
                        className="mt-2 w-full rounded-lg border border-gold/20 bg-navy px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="text-xs uppercase tracking-wider text-gold-soft/80">
                        Phone
                      </label>
                      <input
                        id="contact-phone"
                        required
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        className="mt-2 w-full rounded-lg border border-gold/20 bg-navy px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                        placeholder="03XX XXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-program" className="text-xs uppercase tracking-wider text-gold-soft/80">
                      Class / Program
                    </label>
                    <select
                      id="contact-program"
                      required
                      name="program"
                      className="mt-2 w-full rounded-lg border border-gold/20 bg-navy px-4 py-3 text-primary-foreground focus:border-gold focus:outline-none"
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
                    <label htmlFor="contact-message" className="text-xs uppercase tracking-wider text-gold-soft/80">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      className="mt-2 w-full resize-none rounded-lg border border-gold/20 bg-navy px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-gold focus:outline-none"
                      placeholder="Tell us a little about your child..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] sm:py-4"
                  >
                    <Send className="h-4 w-4" /> {sent ? "Opening your email..." : "Send Inquiry"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 bg-navy-deep py-fluid-section text-primary-foreground">
        <div className="container-fluid">
          <div className="mb-10 text-center sm:mb-14">
            <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Our Branches
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black">
              Two campuses, <em className="font-serif-elegant text-gold">one neighbourhood.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-fluid-base text-primary-foreground/70">
              Both branches sit just minutes apart in G-11/2 - choose whichever is closer to home.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {branches.map((branch, i) => (
              <article
                key={branch.id}
                className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-navy shadow-elegant transition-colors hover:border-gold/60 sm:rounded-3xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
                  <iframe
                    src={branch.mapsEmbed}
                    className="h-full w-full border-0 grayscale-[20%] transition-all duration-700 group-hover:grayscale-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${branch.name} location map`}
                  />
                  <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-navy-deep/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur">
                    Branch 0{i + 1}
                  </div>
                </div>

                <div className="p-5 sm:p-6 md:p-8">
                  <h3 className="font-display text-xl font-black text-gold sm:text-2xl">{branch.label}</h3>
                  <div className="gold-divider my-4 w-16" />
                  <ul className="space-y-3 text-xs text-primary-foreground/80 sm:text-sm">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{branch.address}</span>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <a href={`tel:${branch.phoneIntl}`} className="hover:text-gold">
                        {branch.phone}
                      </a>
                    </li>
                    <li className="flex gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{branch.hours}</span>
                    </li>
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                    <a
                      href={branch.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2.5 text-xs font-semibold text-navy-deep shadow-gold transition-transform hover:scale-105 sm:px-5 sm:text-sm"
                    >
                      <Navigation className="h-4 w-4" /> Get Directions
                    </a>
                    <a
                      href={`tel:${branch.phoneIntl}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2.5 text-xs text-gold-soft transition-colors hover:bg-gold/10 sm:px-5 sm:text-sm"
                    >
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
