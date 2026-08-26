import { createFileRoute } from "@tanstack/react-router";
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
        title={
          <>
            Experienced teachers.
            <br />
            A steadier learning journey.
          </>
        }
        description="Senior lecturers, coordinators and subject specialists from well-known institutions across Islamabad and Rawalpindi."
        backgroundImage={heroBg}
        stats={[
          { value: "11", label: "expert teachers" },
          { value: "27+", label: "years of trust" },
          { value: "2", label: "campus locations" },
          { value: "3", label: "program streams" },
        ]}
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
            Directors and senior faculty
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            The academic tone of the academy is shaped by experienced leadership that blends discipline and long-term
            consistency.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {directors.map((member) => (
              <FacultyCard key={member.name} member={member} featured />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-fluid-section">
        <div className="container-fluid">
          <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
            Lecturers and coordinators
          </h2>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground">
            From science and mathematics to administration, each member supports the academy with subject depth and
            classroom experience.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {lecturers.map((member) => (
              <FacultyCard key={member.name + member.position} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
