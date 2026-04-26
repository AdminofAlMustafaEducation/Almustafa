import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock, Users, BookOpen, ArrowRight } from "lucide-react";
import { programs, academy } from "@/data/faculty";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Juniors, Matric & F.Sc | Al-Mustafa Academy" },
      { name: "description", content: "Evening coaching programs for Class 1–8, Matric and F.Sc (Pre-Medical & Pre-Engineering) in G-11/2 Islamabad. Senior college lecturers, small batches, FBISE-aligned." },
      { property: "og:title", content: "Programs — Al-Mustafa Academy" },
      { property: "og:description", content: "Juniors · Matric · F.Sc — taught by senior college lecturers." },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <section className="relative bg-navy-deep text-primary-foreground py-fluid-hero overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold">Academic Programs</p>
          <h1 className="mt-5 sm:mt-6 font-display text-fluid-h1 font-bold">
            Three programs.<br/><em className="text-shimmer font-serif-elegant">One standard of excellence.</em>
          </h1>
          <p className="mt-6 sm:mt-8 text-fluid-base text-primary-foreground/80 max-w-3xl mx-auto">
            Whether your child is just starting school or preparing for medical and engineering universities, our programs are crafted to deliver clarity, confidence and results.
          </p>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid space-y-16 sm:space-y-20">
          {programs.map((p, i) => (
            <div key={p.title} className={`grid lg:grid-cols-12 gap-8 lg:gap-10 items-center ${i % 2 ? "lg:[&>:first-child]:order-2" : ""}`}>
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5] max-w-md mx-auto lg:max-w-none rounded-2xl sm:rounded-3xl bg-navy-deep overflow-hidden shadow-elegant">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/80 via-navy/60 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                    <div className="text-6xl sm:text-7xl lg:text-8xl">{p.icon}</div>
                    <div>
                      <div className="font-display text-7xl sm:text-8xl lg:text-9xl font-bold text-gold/20">0{i+1}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-semibold">Program 0{i+1}</p>
                <h2 className="mt-3 font-display text-fluid-h2 text-navy font-bold">{p.title}</h2>
                <div className="gold-divider my-5 sm:my-6 w-20" />
                <p className="text-muted-foreground text-fluid-base">{p.description}</p>

                <div className="mt-6 sm:mt-8">
                  <p className="text-xs uppercase tracking-wider text-navy font-bold mb-3">Subjects Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {p.subjects.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 bg-navy text-primary-foreground px-3 py-1.5 rounded-full text-xs sm:text-sm">
                        <Check className="h-3.5 w-3.5 text-gold" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 grid sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border">
                    <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Timing</div>
                      <div className="font-semibold text-navy text-xs sm:text-sm">Evenings · Mon–Sat</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border">
                    <Users className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Batch</div>
                      <div className="font-semibold text-navy text-xs sm:text-sm">Small groups</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border">
                    <BookOpen className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Curriculum</div>
                      <div className="font-semibold text-navy text-xs sm:text-sm">FBISE-aligned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy text-primary-foreground py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">Ready to enroll?</h2>
          <p className="mt-3 text-sm sm:text-base text-primary-foreground/75">Call {academy.phone} or visit our campus in G-11/2 Islamabad.</p>
          <Link to="/contact" className="mt-6 sm:mt-8 inline-flex items-center gap-2 bg-gold-gradient text-navy-deep font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-gold hover:scale-105 transition-transform text-sm">
            Start Registration <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}