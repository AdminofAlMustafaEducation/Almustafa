import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Compass, Eye, GraduationCap, Heart, MapPin, Target, Users } from "lucide-react";
import classroom from "@/assets/classroom.jpg";
import study from "@/assets/study.jpg";
import { PageHero } from "@/components/page-hero";
import { academy } from "@/data/faculty";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageHead({
      title: "About | Al-Mustafa Academy, G-11/2 & G-10 Islamabad",
      description:
        "Learn about Al-Mustafa Academy - a 27-year legacy of evening coaching in Islamabad. Our mission, vision and the values that shape our teaching.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={
          <>
            Twenty-seven years of
            <br />
            <em className="font-serif-elegant text-shimmer">quiet excellence.</em>
          </>
        }
        description="From a single evening classroom in 1998 to one of the most respected coaching academies in Islamabad, our story is written in steady routines, trusted teachers and the success of generations of students."
        backgroundImage={study}
        stats={[
          { value: "27+", label: "years of teaching trust" },
          { value: "2", label: "campuses in G-11 & G-10" },
          { value: "Our Faculty", label: "experienced members" },
        ]}
        aside={
          <div className="paper-panel overflow-hidden p-5 sm:p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              Story Snapshot
            </div>
            <div className="mt-3 headline-balance font-display text-2xl font-black text-navy-deep sm:text-3xl">
              A local academy shaped by discipline, consistency and long-term parent trust.
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  icon: GraduationCap,
                  title: "Experienced teaching",
                  detail: "The academy grew through senior faculty who understand classroom rhythm, not short-term hype.",
                },
                {
                  icon: Users,
                  title: "Family confidence",
                  detail: "Parents return because communication, routines and expectations stay clear from year to year.",
                },
                {
                  icon: MapPin,
                  title: "Neighbourhood roots",
                  detail: "Two campuses in G-11/2 and G-10 keep the academy practical and accessible for families in Islamabad.",
                },
              ].map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-start gap-3 rounded-[1.35rem] bg-white/75 p-4 shadow-soft">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy-deep text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display text-lg font-black text-navy-deep">{title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="section-shell-alt bg-background py-fluid-section">
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
            <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              The Beginning
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              A vision born in Islamabad, in 1998.
            </h2>
            <p className="text-fluid-base text-muted-foreground">
              Founded by Syed Ali Azeem Kazmi and Syed Ali Abbas Kazmi, Al-Mustafa Academy began with a simple conviction: that every child in Islamabad deserves access to the same quality of teaching as the country&apos;s best institutions.
            </p>
            <p className="mt-4 text-fluid-base text-muted-foreground">
              Over more than two decades, that conviction has shaped every classroom, every test, and every student conversation. Today, we coach hundreds of students each year, from Class 1 through F.Sc, across campuses in G-11/2 and G-10.
            </p>
            <p className="mt-4 font-serif-elegant text-base italic leading-relaxed text-navy sm:text-lg">
              &quot;Education is not the filling of a pail, but the lighting of a fire.&quot;
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell bg-navy-deep py-fluid-section text-primary-foreground">
        <div className="container-fluid">
          <div className="mb-10 text-center sm:mb-16">
            <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              What Drives Us
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black">Mission, Vision and Values</h2>
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
                className={`card-lift rounded-2xl border border-gold/15 bg-navy p-6 transition-colors hover:border-gold/40 sm:p-8 ${t === "Our Values" ? "sm:col-span-2 lg:col-span-1" : ""}`}
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
        <div className="container-fluid">
          <div className="mb-10 text-center sm:mb-16">
            <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Our Journey
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              A timeline of trust
            </h2>
          </div>

          <div className="relative mx-auto max-w-3xl">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-gold/30 md:left-1/2 md:-translate-x-px" />
            {[
              { year: "1998", t: "The Founding", d: "Al-Mustafa Academy opens its doors in G-11/2, Islamabad with a small evening batch." },
              { year: "2005", t: "Faculty Expansion", d: "Senior lecturers from IMCB and Bahria College join the academy, raising the standard of teaching." },
              { year: "2007", t: "Second Campus", d: "A second campus opens on Sawan Road, G-10/4 to accommodate growing demand." },
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
                  <div className="paper-panel card-lift rounded-2xl p-5 sm:p-6">
                    <div className="font-display text-2xl font-black text-gold sm:text-3xl">{milestone.year}</div>
                    <h3 className="mt-1 font-display text-lg font-black text-navy-deep sm:text-xl">{milestone.t}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{milestone.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint/30 py-12 sm:py-16">
        <div className="container-fluid">
          <div className="paper-panel mx-auto max-w-4xl px-6 py-8 text-center sm:px-8 sm:py-10">
            <Heart className="mx-auto mb-4 h-9 w-9 text-navy-deep sm:h-10 sm:w-10" />
            <h3 className="font-display text-2xl font-black text-navy-deep sm:text-3xl md:text-4xl">
            Become part of our story.
            </h3>
            <p className="mt-3 text-sm text-navy-deep/80 sm:text-base">Visit us at {academy.addressPrimary}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-navy sm:px-7 sm:py-3.5"
              >
                Get in Touch
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-navy-deep/15 px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-white sm:px-7 sm:py-3.5"
              >
                <BookOpen className="h-4 w-4" />
                View Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
