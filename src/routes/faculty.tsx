import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, GraduationCap, MapPin, Users } from "lucide-react";
import { faculty } from "@/data/faculty";
import { FacultyCard } from "@/components/faculty-card";
import { PageHero } from "@/components/page-hero";
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
      <PageHero
        eyebrow="Our Faculty"
        title={
          <>
            Experienced teachers.
            <br />
            <em className="font-serif-elegant text-shimmer">A steadier learning journey.</em>
          </>
        }
        description="Our faculty brings together senior lecturers, coordinators and subject specialists from well-known institutions across Islamabad and Rawalpindi, giving students guidance that feels both disciplined and personal."
        backgroundImage={heroBg}
        stats={[
          { value: "11", label: "expert teachers" },
          { value: "27+", label: "years of trust" },
          { value: "2", label: "campus locations" },
          { value: "3", label: "program streams" },
        ]}
        aside={
          <div className="paper-panel overflow-hidden p-5 sm:p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
              Faculty Snapshot
            </div>
            <div className="mt-3 headline-balance font-display text-2xl font-black text-navy-deep sm:text-3xl">
              A teaching team built for consistency, care and board-focused preparation.
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  icon: Users,
                  title: "Personal attention",
                  detail: "Small batches make it easier to notice gaps early and guide students properly.",
                },
                {
                  icon: GraduationCap,
                  title: "Experienced teaching",
                  detail: "Students learn from educators already used to academic standards and exam pacing.",
                },
                {
                  icon: BookOpen,
                  title: "Subject depth",
                  detail: "Science, maths, English and coordination support are handled by specialists.",
                },
                {
                  icon: MapPin,
                  title: "Accessible campuses",
                  detail: "Two G-11/2 locations keep the academy close to families in the area.",
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
