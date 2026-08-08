import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Check, Clock, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
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
      <PageHero
        eyebrow="Academic Programs"
        title={
          <>
            Programs.
            <br />
            <em className="font-serif-elegant text-shimmer">One standard of excellence.</em>
          </>
        }
        description="Whether a student is building early foundations or preparing for board and entry-test pressure, each program is shaped to feel structured, focused and practical."
        backgroundImage={heroBg}
        stats={[
          { value: "1-8", label: "junior classes" },
          { value: "9-10", label: "matric support" },
          { value: "F.Sc", label: "college preparation" },
          { value: "Mon-Sat", label: "evening routine" },
        ]}
        aside={
          <div className="paper-panel overflow-hidden p-5 sm:p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              Program Snapshot
            </div>
            <div className="mt-3 headline-balance font-display text-2xl font-black text-navy-deep sm:text-3xl">
              Clear pathways for younger students, board classes and senior science batches.
            </div>

            <div className="mt-5 grid gap-3">
              {[
                "Small batches that are easier to manage on a daily basis",
                "FBISE-aware preparation with weekly testing and revision rhythm",
                "Experienced faculty guidance for concept clarity and exam confidence",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-[1.35rem] bg-white/75 p-4 shadow-soft">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-black text-navy-deep">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="section-shell-alt bg-cream py-12 sm:py-14">
        <div className="container-fluid">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "For Juniors",
                detail: "Foundation-building with study habits, confidence and subject clarity from the start.",
              },
              {
                title: "For Matric",
                detail: "Board-focused structure with regular testing, past-paper work and disciplined follow-up.",
              },
              {
                title: "For F.Sc",
                detail: "Senior science coaching with college-level guidance for marks, pacing and exam control.",
              },
            ].map((item) => (
              <div key={item.title} className="paper-panel card-lift rounded-[1.7rem] p-5 sm:p-6">
                <div className="font-display text-xl font-black text-navy-deep">{item.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid space-y-16 sm:space-y-20">
          {programs.map((program, i) => (
            <div
              key={program.title}
              className={`paper-panel grid items-center gap-8 rounded-[2rem] p-5 sm:p-6 lg:grid-cols-12 lg:gap-10 lg:p-8 ${i % 2 ? "lg:[&>:first-child]:order-2" : ""}`}
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
                <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
                  <span className="inline-block h-2 w-2 rounded-full bg-sky" />
                  Program 0{i + 1}
                </p>
                <h2 className="headline-balance mt-3 font-display text-fluid-h2 font-black text-navy-deep">
                  {program.title}
                </h2>
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

      <section className="bg-mint/30 py-12 text-primary-foreground sm:py-16">
        <div className="container-fluid">
          <div className="paper-panel mx-auto max-w-5xl px-6 py-8 text-center sm:px-8 sm:py-10">
            <h2 className="font-display text-2xl font-black text-navy-deep sm:text-3xl md:text-4xl">
              Ready to enroll?
            </h2>
            <p className="mt-3 text-sm text-navy-deep/75 sm:text-base">
              Call {academy.phone} or visit our campus in G-11/2 Islamabad.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-105 sm:px-7 sm:py-3.5"
              >
                Start Registration <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${academy.phoneIntl}`}
                className="inline-flex items-center gap-2 rounded-full border border-navy-deep/15 px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-white sm:px-7 sm:py-3.5"
              >
                Call the Academy
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
