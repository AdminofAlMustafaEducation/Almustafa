import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
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
        title={
          <>
            Twenty-seven years of
            <br />
            quiet excellence.
          </>
        }
        description="From a single evening classroom in 1998 to one of the most respected coaching academies in Islamabad. Steady routines, trusted teachers, and generations of students."
        backgroundImage={study}
        stats={[
          { value: "27+", label: "years of teaching trust" },
          { value: "2", label: "campuses in G-11 and G-10" },
          { value: "11", label: "experienced faculty" },
        ]}
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
              A vision born in Islamabad, in 1998.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Founded by Syed Ali Azeem Kazmi and Syed Ali Abbas Kazmi, Al-Mustafa Academy began
              with a simple conviction: every child in Islamabad deserves access to the same quality
              of teaching as the country&apos;s best institutions.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Over more than two decades, that conviction has shaped every classroom, every test,
              and every student conversation. Today we coach students from Class 1 through F.Sc
              across campuses in G-11/2 and G-10.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src={classroom}
              alt="Students learning in a classroom at Al-Mustafa Academy"
              className="w-full object-cover"
              loading="lazy"
              width={1280}
              height={896}
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="bg-navy-deep py-fluid-section text-primary-foreground">
        <div className="container-fluid max-w-4xl space-y-10">
          {[
            {
              t: "Our Mission",
              d: "To provide structured, concept-driven evening coaching that empowers students to excel in board examinations and entry tests without compromising on character.",
            },
            {
              t: "Our Vision",
              d: "To remain Islamabad's most trusted academy, where every student receives the personal attention, expert teaching and moral guidance they deserve.",
            },
            {
              t: "Our Values",
              d: "Discipline. Sincerity. Care. Honesty in teaching, transparency with parents, and a steady commitment to every student's success.",
            },
          ].map((item) => (
            <div key={item.t} className="border-t border-white/15 pt-8">
              <h2 className="font-display text-2xl font-black text-gold sm:text-3xl">{item.t}</h2>
              <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-primary-foreground/75">
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
            A timeline of trust
          </h2>
          <ol className="mx-auto mt-10 max-w-3xl space-y-8">
            {[
              {
                year: "1998",
                t: "The Founding",
                d: "Al-Mustafa Academy opens its doors in G-11/2, Islamabad with a small evening batch.",
              },
              {
                year: "2005",
                t: "Faculty Expansion",
                d: "Senior lecturers from IMCB and Bahria College join the academy, raising the standard of teaching.",
              },
              {
                year: "2007",
                t: "Second Campus",
                d: "A second campus opens on Sawan Road, G-10/4 to accommodate growing demand.",
              },
              {
                year: "2020",
                t: "Two Decades Strong",
                d: "Thousands of alumni, consistent board results, and a community that trusts us with its children.",
              },
              {
                year: "Today",
                t: "A Living Legacy",
                d: "Eleven expert faculty members, three full programs, and one mission: every student, every day.",
              },
            ].map((milestone) => (
              <li key={milestone.year} className="grid gap-2 sm:grid-cols-[6rem_1fr] sm:gap-8">
                <div className="font-display text-xl font-black text-gold">{milestone.year}</div>
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-deep">{milestone.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {milestone.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-muted/40 py-14 sm:py-16">
        <div className="container-fluid text-center">
          <h2 className="font-display text-3xl font-black text-navy-deep">
            Become part of our story.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">Visit us at {academy.addressPrimary}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center rounded-full bg-navy-deep px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply
            </Link>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-full border border-navy-deep/15 px-6 py-3 text-sm font-bold text-navy-deep hover:bg-white"
            >
              <BookOpen className="h-4 w-4" />
              View programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
