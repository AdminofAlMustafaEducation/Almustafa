import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Eye, Heart, Target } from "lucide-react";
import classroom from "@/assets/classroom.jpg";
import study from "@/assets/study.jpg";
import { academy } from "@/data/faculty";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageHead({
      title: "About | Al-Mustafa Academy, G-11/2 Islamabad",
      description:
        "Learn about Al-Mustafa Academy - a 27-year legacy of evening coaching in Islamabad. Our mission, vision and the values that shape our teaching.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep py-fluid-hero text-primary-foreground">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${study})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy-deep/85 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="ornament text-[10px] uppercase tracking-[0.3em] text-gold sm:text-xs">Our Story</p>
          <h1 className="mt-5 font-display text-fluid-h1 font-bold sm:mt-6">
            Twenty-seven years of <em className="font-serif-elegant text-shimmer">quiet excellence.</em>
          </h1>
          <div className="gold-divider mx-auto my-6 w-32 sm:my-8" />
          <p className="mx-auto max-w-3xl text-fluid-base text-primary-foreground/80">
            From a single evening classroom in 1998 to one of the most respected coaching academies in Islamabad, our story is written in the success of thousands of students.
          </p>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 mx-auto w-full max-w-md lg:order-1 lg:mx-0 lg:max-w-none">
            <div className="absolute -inset-6 rotate-2 rounded-3xl bg-gold/10" />
            <img
              src={classroom}
              alt="Students learning in a classroom at Al-Mustafa Academy"
              className="relative w-full rounded-2xl shadow-elegant"
              loading="lazy"
              width={1280}
              height={896}
              decoding="async"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="ornament inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
              The Beginning
            </p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold text-navy">
              A vision born in Islamabad, in 1998.
            </h2>
            <div className="gold-divider my-5 w-24 sm:my-6" />
            <p className="text-fluid-base text-muted-foreground">
              Founded by Syed Ali Azeem Kazmi and Syed Ali Abbas Kazmi, Al-Mustafa Academy began with a simple conviction: that every child in Islamabad deserves access to the same quality of teaching as the country&apos;s best institutions.
            </p>
            <p className="mt-4 text-fluid-base text-muted-foreground">
              Over more than two decades, that conviction has shaped every classroom, every test, and every student conversation. Today, we coach hundreds of students each year, from Class 1 through F.Sc, across two campuses in G-11/2.
            </p>
            <p className="mt-4 font-serif-elegant text-base italic leading-relaxed text-navy sm:text-lg">
              &quot;Education is not the filling of a pail, but the lighting of a fire.&quot;
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy-deep py-fluid-section text-primary-foreground">
        <div className="container-fluid">
          <div className="mb-10 text-center sm:mb-16">
            <p className="ornament text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
              What Drives Us
            </p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold">Mission, Vision and Values</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {[
              {
                icon: Target,
                t: "Our Mission",
                d: "To provide structured, concept-driven evening coaching that empowers students to excel in board examinations and entry tests without compromising on character.",
              },
              {
                icon: Eye,
                t: "Our Vision",
                d: "To remain Islamabad's most trusted academy, where every student receives the personal attention, expert teaching and moral guidance they deserve.",
              },
              {
                icon: Compass,
                t: "Our Values",
                d: "Discipline. Sincerity. Care. Honesty in teaching, transparency with parents, and a steady commitment to every student's success.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className={`rounded-2xl border border-gold/15 bg-navy p-6 transition-colors hover:border-gold/40 sm:p-8 ${t === "Our Values" ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-gradient shadow-gold sm:mb-5 sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 text-navy-deep sm:h-7 sm:w-7" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-gold sm:text-2xl">{t}</h3>
                <p className="text-sm leading-relaxed text-primary-foreground/75 sm:text-base">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-16">
            <p className="ornament text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
              Our Journey
            </p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold text-navy">A timeline of trust</h2>
          </div>

          <div className="relative mx-auto max-w-3xl">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-gold/30 md:left-1/2 md:-translate-x-px" />
            {[
              { year: "1998", t: "The Founding", d: "Al-Mustafa Academy opens its doors in G-11/2, Islamabad with a small evening batch." },
              { year: "2005", t: "Faculty Expansion", d: "Senior lecturers from IMCB and Bahria College join the academy, raising the standard of teaching." },
              { year: "2012", t: "Second Campus", d: "A second campus opens on Street 58, G-11/2 to accommodate growing demand." },
              { year: "2020", t: "Two Decades Strong", d: "Thousands of alumni, consistent board toppers and a community that trusts us with its children." },
              { year: "Today", t: "A Living Legacy", d: "11 expert faculty members, three full programs, and one mission - every student, every day." },
            ].map((milestone, i) => (
              <div
                key={milestone.year}
                className={`relative mb-8 flex sm:mb-10 md:items-center ${i % 2 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 z-10 h-3 w-3 rounded-full bg-gold ring-4 ring-background md:left-1/2 md:-translate-x-1/2" />
                <div className="ml-10 sm:ml-12 md:ml-0 md:w-1/2 md:px-6 lg:px-8">
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-gold sm:p-6">
                    <div className="font-display text-2xl font-bold text-gold sm:text-3xl">{milestone.year}</div>
                    <h3 className="mt-1 font-display text-lg font-bold text-navy sm:text-xl">{milestone.t}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{milestone.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-gradient py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Heart className="mx-auto mb-4 h-9 w-9 text-navy-deep sm:h-10 sm:w-10" />
          <h3 className="font-display text-2xl font-bold text-navy-deep sm:text-3xl md:text-4xl">
            Become part of our story.
          </h3>
          <p className="mt-3 text-sm text-navy-deep/80 sm:text-base">Visit us at {academy.addressPrimary}</p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-navy sm:px-7 sm:py-3.5"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
