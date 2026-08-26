import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Check, Clock, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { academy, programs } from "@/data/faculty";
import heroBg from "@/assets/hero-bg.jpg";
import classroom from "@/assets/classroom.jpg";
import studentsGroup from "@/assets/gallery/students-group.jpg";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/programs")({
  head: () =>
    buildPageHead({
      title: "Programs | Juniors, Matric and F.Sc | Al-Mustafa Academy",
      description:
        "Evening coaching programs for Class 1-8, Matric and F.Sc (Pre-Medical and Pre-Engineering) in G-11/2 Islamabad. Senior college lecturers, small batches, FBISE-aligned.",
      path: "/programs",
    }),
  component: ProgramsPage,
});

const programImages = [classroom, studentsGroup];

function ProgramsPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Three programs.
            <br />
            One standard.
          </>
        }
        description="Whether a student is building early foundations or preparing for board and entry-test pressure, each program is structured, focused and practical."
        backgroundImage={heroBg}
        stats={[
          { value: "1-8", label: "junior classes" },
          { value: "9-10", label: "matric support" },
          { value: "F.Sc", label: "college preparation" },
          { value: "Mon-Sat", label: "evening routine" },
        ]}
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid space-y-16 sm:space-y-20">
          {programs.map((program, i) => {
            const meta = (
              <div className={`mt-8 grid gap-4 sm:grid-cols-3 ${i === 2 ? "text-white" : ""}`}>
                <div className="flex items-start gap-3">
                  <Clock className={`mt-0.5 h-5 w-5 shrink-0 ${i === 2 ? "text-gold-soft" : "text-gold"}`} />
                  <div>
                    <div className={`text-xs ${i === 2 ? "text-white/60" : "text-muted-foreground"}`}>Timing</div>
                    <div className={`text-sm font-semibold ${i === 2 ? "text-white" : "text-navy-deep"}`}>
                      Evenings, Mon-Sat
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className={`mt-0.5 h-5 w-5 shrink-0 ${i === 2 ? "text-gold-soft" : "text-gold"}`} />
                  <div>
                    <div className={`text-xs ${i === 2 ? "text-white/60" : "text-muted-foreground"}`}>Batch</div>
                    <div className={`text-sm font-semibold ${i === 2 ? "text-white" : "text-navy-deep"}`}>
                      Small groups
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className={`mt-0.5 h-5 w-5 shrink-0 ${i === 2 ? "text-gold-soft" : "text-gold"}`} />
                  <div>
                    <div className={`text-xs ${i === 2 ? "text-white/60" : "text-muted-foreground"}`}>Curriculum</div>
                    <div className={`text-sm font-semibold ${i === 2 ? "text-white" : "text-navy-deep"}`}>
                      FBISE-aligned
                    </div>
                  </div>
                </div>
              </div>
            );

            const subjects = (
              <div className="mt-6">
                <p className={`mb-3 text-sm font-semibold ${i === 2 ? "text-white" : "text-navy-deep"}`}>
                  Subjects covered
                </p>
                <div className="flex flex-wrap gap-2">
                  {program.subjects.map((subject) => (
                    <span
                      key={subject}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
                        i === 2 ? "bg-white/10 text-white" : "bg-muted text-navy-deep"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 text-gold" /> {subject}
                    </span>
                  ))}
                </div>
              </div>
            );

            if (i === 2) {
              return (
                <article key={program.title} className="rounded-2xl bg-navy-deep p-6 text-white sm:p-8 lg:p-12">
                  <h2 className="headline-balance font-display text-3xl font-black tracking-tight sm:text-4xl">
                    {program.title}
                  </h2>
                  <p className="mt-4 max-w-[65ch] text-base text-white/75">{program.description}</p>
                  {subjects}
                  {meta}
                </article>
              );
            }

            return (
              <article key={program.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="overflow-hidden rounded-2xl lg:col-span-5">
                  <img
                    src={programImages[i] ?? classroom}
                    alt=""
                    className="aspect-[4/5] w-full object-cover sm:aspect-[3/2] lg:aspect-[4/5]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="lg:col-span-7">
                  <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
                    {program.title}
                  </h2>
                  <p className="mt-4 max-w-[65ch] text-base text-muted-foreground">{program.description}</p>
                  {subjects}
                  {meta}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/40 py-14 sm:py-16">
        <div className="container-fluid text-center">
          <h2 className="font-display text-3xl font-black text-navy-deep">Ready to enroll?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Call {academy.phone} or visit our campus in G-11/2 Islamabad.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-sm font-bold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${academy.phoneIntl}`}
              className="inline-flex items-center rounded-full border border-navy-deep/15 px-6 py-3.5 text-sm font-bold text-navy-deep hover:bg-white"
            >
              Call the academy
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
