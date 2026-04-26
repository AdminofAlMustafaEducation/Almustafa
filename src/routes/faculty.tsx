import { createFileRoute } from "@tanstack/react-router";
import { faculty } from "@/data/faculty";
import { FacultyCard } from "@/components/faculty-card";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Our Faculty — Al-Mustafa Academy, Islamabad" },
      { name: "description", content: "Meet the 11 expert faculty members of Al-Mustafa Academy — senior lecturers from IMCB, ICB, Bahria College, APS Rawalpindi and Al-Kausar." },
      { property: "og:title", content: "Faculty — Al-Mustafa Academy" },
      { property: "og:description", content: "Senior lecturers from Islamabad's leading colleges." },
    ],
  }),
  component: FacultyPage,
});

function FacultyPage() {
  const directors = faculty.slice(0, 3);
  const lecturers = faculty.slice(3);

  return (
    <>
      <section className="relative bg-navy-deep text-primary-foreground py-fluid-hero overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold">Our Faculty</p>
          <h1 className="mt-5 sm:mt-6 font-display text-fluid-h1 font-bold">
            The teachers who<br/><em className="text-shimmer font-serif-elegant">make the difference.</em>
          </h1>
          <p className="mt-6 sm:mt-8 text-fluid-base text-primary-foreground/80 max-w-3xl mx-auto">
            Eleven dedicated educators — senior lecturers, coordinators and subject specialists — drawn from Islamabad's most respected colleges and institutions.
          </p>
        </div>
      </section>

      <section className="bg-navy-deep text-primary-foreground py-fluid-section border-t border-gold/20">
        <div className="container-fluid">
          <div className="text-center mb-10 sm:mb-14">
            <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-semibold">Leadership</p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold">
              <em className="font-serif-elegant text-gold">Directors</em> & Senior Faculty
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {directors.map((m) => <FacultyCard key={m.name} member={m} featured />)}
          </div>
        </div>

        <div className="container-fluid mt-16 sm:mt-24">
          <div className="text-center mb-10 sm:mb-14">
            <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-semibold">Subject Specialists</p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold">
              Lecturers & <em className="font-serif-elegant text-gold">Coordinators</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {lecturers.map((m) => <FacultyCard key={m.name + m.position} member={m} />)}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="font-serif-elegant italic text-xl sm:text-2xl md:text-3xl text-navy leading-relaxed">
            "A teacher affects eternity; he can never tell where his influence stops."
          </p>
          <div className="gold-divider my-5 sm:my-6 mx-auto w-24" />
          <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">— Henry Adams</p>
        </div>
      </section>
    </>
  );
}