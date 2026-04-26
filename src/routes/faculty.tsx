import { createFileRoute } from "@tanstack/react-router";
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
      <section className="relative overflow-hidden bg-navy-deep py-fluid-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="ornament text-[10px] uppercase tracking-[0.3em] text-gold sm:text-xs">Our Faculty</p>
          <h1 className="mt-5 font-display text-fluid-h1 font-bold sm:mt-6">
            The teachers who
            <br />
            <em className="font-serif-elegant text-shimmer">make the difference.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-fluid-base text-primary-foreground/80 sm:mt-8">
            Eleven dedicated educators, senior lecturers, coordinators and subject specialists, drawn from Islamabad&apos;s most respected colleges and institutions.
          </p>
        </div>
      </section>

      <section className="border-t border-gold/20 bg-navy-deep py-fluid-section text-primary-foreground">
        <div className="container-fluid">
          <div className="mb-10 text-center sm:mb-14">
            <p className="ornament text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
              Leadership
            </p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold">
              <em className="font-serif-elegant text-gold">Directors</em> and Senior Faculty
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {directors.map((member) => (
              <FacultyCard key={member.name} member={member} featured />
            ))}
          </div>
        </div>

        <div className="container-fluid mt-16 sm:mt-24">
          <div className="mb-10 text-center sm:mb-14">
            <p className="ornament text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
              Subject Specialists
            </p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold">
              Lecturers and <em className="font-serif-elegant text-gold">Coordinators</em>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {lecturers.map((member) => (
              <FacultyCard key={member.name + member.position} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="font-serif-elegant text-xl italic leading-relaxed text-navy sm:text-2xl md:text-3xl">
            &quot;A teacher affects eternity; he can never tell where his influence stops.&quot;
          </p>
          <div className="gold-divider mx-auto my-5 w-24 sm:my-6" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground sm:text-sm">- Henry Adams</p>
        </div>
      </section>
    </>
  );
}
