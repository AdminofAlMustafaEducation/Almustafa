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
      <section className="relative bg-navy-deep text-primary-foreground py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <p className="ornament text-xs uppercase tracking-[0.3em] text-gold">Academic Programs</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-tight">
            Three programs.<br/><em className="text-shimmer font-serif-elegant">One standard of excellence.</em>
          </h1>
          <p className="mt-8 text-lg text-primary-foreground/80 max-w-3xl mx-auto">
            Whether your child is just starting school or preparing for medical and engineering universities, our programs are crafted to deliver clarity, confidence and results.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {programs.map((p, i) => (
            <div key={p.title} className={`grid lg:grid-cols-12 gap-10 items-center ${i % 2 ? "lg:[&>:first-child]:order-2" : ""}`}>
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] rounded-3xl bg-navy-deep overflow-hidden shadow-elegant">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/80 via-navy/60 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between p-10">
                    <div className="text-8xl">{p.icon}</div>
                    <div>
                      <div className="font-display text-9xl font-bold text-gold/20">0{i+1}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Program 0{i+1}</p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl text-navy font-bold leading-tight">{p.title}</h2>
                <div className="gold-divider my-6 w-20" />
                <p className="text-muted-foreground leading-relaxed text-lg">{p.description}</p>

                <div className="mt-8">
                  <p className="text-xs uppercase tracking-wider text-navy font-bold mb-3">Subjects Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {p.subjects.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 bg-navy text-primary-foreground px-3 py-1.5 rounded-full text-sm">
                        <Check className="h-3.5 w-3.5 text-gold" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                    <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Timing</div>
                      <div className="font-semibold text-navy text-sm">Evenings · Mon–Sat</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                    <Users className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Batch</div>
                      <div className="font-semibold text-navy text-sm">Small groups</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                    <BookOpen className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Curriculum</div>
                      <div className="font-semibold text-navy text-sm">FBISE-aligned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy text-primary-foreground py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to enroll?</h2>
          <p className="mt-3 text-primary-foreground/75">Call {academy.phone} or visit our campus in G-11/2 Islamabad.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 bg-gold-gradient text-navy-deep font-semibold px-7 py-3.5 rounded-full shadow-gold hover:scale-105 transition-transform">
            Start Registration <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}