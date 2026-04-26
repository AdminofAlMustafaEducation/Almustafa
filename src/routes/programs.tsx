import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Check, Clock, Users } from "lucide-react";
import { academy, programs } from "@/data/faculty";
import heroBg from "@/assets/hero-bg.jpg";
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

function ProgramsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep py-fluid-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold sm:text-xs">Academic Programs</p>
          <h1 className="mt-5 font-display text-fluid-h1 font-bold sm:mt-6">
            Three programs.
            <br />
            <em className="font-serif-elegant text-shimmer">One standard of excellence.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-fluid-base text-primary-foreground/80 sm:mt-8">
            Whether your child is just starting school or preparing for medical and engineering universities, our programs are crafted to deliver clarity, confidence and results.
          </p>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid space-y-16 sm:space-y-20">
          {programs.map((program, i) => (
            <div
              key={program.title}
              className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-10 ${i % 2 ? "lg:[&>:first-child]:order-2" : ""}`}
            >
              <div className="lg:col-span-5">
                <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl bg-navy-deep shadow-elegant sm:aspect-[3/2] sm:rounded-3xl lg:max-w-none lg:aspect-[4/5]">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/80 via-navy/60 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
                    <div className="font-display text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                      {program.icon}
                    </div>
                    <div className="font-display text-7xl font-bold text-gold/20 sm:text-8xl lg:text-9xl">0{i + 1}</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
                  Program 0{i + 1}
                </p>
                <h2 className="mt-3 font-display text-fluid-h2 font-bold text-navy">{program.title}</h2>
                <div className="gold-divider my-5 w-20 sm:my-6" />
                <p className="text-fluid-base text-muted-foreground">{program.description}</p>

                <div className="mt-6 sm:mt-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy">Subjects Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {program.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs text-primary-foreground sm:text-sm"
                      >
                        <Check className="h-3.5 w-3.5 text-gold" /> {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 sm:p-4">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                        Timing
                      </div>
                      <div className="text-xs font-semibold text-navy sm:text-sm">Evenings | Mon-Sat</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 sm:p-4">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                        Batch
                      </div>
                      <div className="text-xs font-semibold text-navy sm:text-sm">Small groups</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 sm:p-4">
                    <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                        Curriculum
                      </div>
                      <div className="text-xs font-semibold text-navy sm:text-sm">FBISE-aligned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy py-12 text-primary-foreground sm:py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">Ready to enroll?</h2>
          <p className="mt-3 text-sm text-primary-foreground/75 sm:text-base">
            Call {academy.phone} or visit our campus in G-11/2 Islamabad.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-105 sm:mt-8 sm:px-7 sm:py-3.5"
          >
            Start Registration <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
