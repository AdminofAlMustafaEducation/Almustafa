import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import { faculty } from "@/data/faculty";
import { FacultyCard } from "@/components/faculty-card";
import heroBg from "@/assets/hero-bg.jpg";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/faculty")({
  head: () =>
    buildPageHead({
      title: "Our Faculty | Al-Mustafa Academy, Islamabad",
      description:
        "Meet the 11 expert faculty members of Al-Mustafa Academy - senior lecturers from IMCB, ICB, Bahria College, APS Rawalpindi and Al-Kausar.",
      path: "/faculty",
    }),
  component: FacultyPage,
});

function FacultyPage() {
  const directors = faculty.slice(0, 3);
  const lecturers = faculty.slice(3);

  return (
    <>
      <section className="section-shell relative overflow-hidden bg-navy-deep py-fluid-hero text-primary-foreground">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="soft-grid absolute inset-0 opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/65 via-navy-deep/82 to-navy-deep" />

        <div className="container-fluid relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Our Faculty
            </p>
            <h1 className="headline-balance mt-5 font-display text-fluid-h1 font-black sm:mt-6">
              The teachers who turn
              <br />
              <em className="font-serif-elegant text-shimmer">effort into results.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-fluid-base text-primary-foreground/80 sm:mt-8">
              Eleven dedicated educators, senior lecturers, coordinators and subject specialists drawn from Islamabad&apos;s most respected colleges and institutions.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, value: "11", label: "expert teachers" },
              { icon: GraduationCap, value: "27+", label: "years of trust" },
              { icon: Award, value: "2", label: "campus locations" },
              { icon: BookOpen, value: "3", label: "program streams" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass-panel rounded-[1.5rem] px-4 py-4 text-left sm:px-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-gold shadow-soft">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display text-2xl font-black text-white">{value}</div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/70 sm:text-[11px]">
                      {label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell-alt bg-lavender/30 py-fluid-section">
        <div className="container-fluid">
          <div className="mb-10 text-center sm:mb-14">
            <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Leadership
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              <em className="font-serif-elegant text-gold">Directors</em> and Senior Faculty
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-fluid-base text-muted-foreground">
              The academic tone of the academy is shaped by experienced leadership that blends discipline, approachability and long-term consistency.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {directors.map((member) => (
              <FacultyCard key={member.name} member={member} featured />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mb-10 text-center sm:mb-14">
            <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Subject Specialists
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              Lecturers and <em className="font-serif-elegant text-gold">Coordinators</em>
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-fluid-base text-muted-foreground">
              From science and mathematics to administration and coordination, each member supports the academy with subject depth and practical classroom experience.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {lecturers.map((member) => (
              <FacultyCard key={member.name + member.position} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint/30 py-12 sm:py-16">
        <div className="container-fluid">
          <div className="paper-panel mx-auto max-w-4xl px-6 py-8 text-center sm:px-8 sm:py-10">
            <p className="font-serif-elegant text-xl italic leading-relaxed text-navy sm:text-2xl md:text-3xl">
              &quot;A teacher affects eternity; he can never tell where his influence stops.&quot;
            </p>
            <div className="gold-divider mx-auto my-5 w-24 sm:my-6" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground sm:text-sm">- Henry Adams</p>
          </div>
        </div>
      </section>
    </>
  );
}
